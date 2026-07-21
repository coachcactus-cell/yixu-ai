/**
 * 订单管理系统 - 数据层
 *
 * 生产环境：持久化到 Upstash Redis（order:{id} + orders:zset 有序集）
 * 开发环境（未配置 Redis）：回退内存 Map，保证本地可跑（重启即丢）
 *
 * 导出函数签名保持不变，API 路由与后台无需改动即可获得持久化能力。
 */

import { getRedis } from "./db";

// ── Types ──

export interface Order {
  id: string;
  userId: string;
  userName: string;
  userPhone?: string;
  plan: "month" | "year";
  amount: number; // ¥68 月卡 / ¥198 年卡
  currency?: "CNY" | "HKD";
  status: "pending" | "paid" | "rejected" | "expired" | "short_paid";
  paymentMethod: "wechat" | "alipay"; // 用户选择的支付方式
  note: string; // 用户填写的备注（交易单号后6位等）
  actualAmount?: number; // 实际收款金额（分）
  forceConfirmReason?: string; // 强制确认原因（金额不足时使用）
  createdAt: string; // ISO date
  paidAt?: string; // 确认收款时间
  rejectedAt?: string;
  rejectReason?: string;
}

// 套餐配置
export const PLANS = {
  month: {
    name: "月度会员",
    price: 68,
    days: 30,
    desc: "解锁全部付费测评 + AI对话",
  },
  year: {
    name: "年度会员",
    price: 198,
    days: 365,
    desc: "省¥204！相当于每月¥16.5",
  },
} as const;

export type PlanType = keyof typeof PLANS;

// ── Redis Key ──
const ORDERS_ZSET = "orders:zset";
const orderKey = (id: string) => `order:${id}`;

// ── 内存回退 ──
const memOrders = new Map<string, Order>();

// ── ID 生成器 ──
function generateOrderId(): string {
  return `ORD_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

// ── 底层读写 ──

/** 拉取全部订单（按创建时间倒序） */
async function fetchAllOrders(): Promise<Order[]> {
  const r = getRedis();
  if (!r) {
    return Array.from(memOrders.values()).sort((a, b) =>
      b.createdAt.localeCompare(a.createdAt)
    );
  }
  try {
    const ids = await r.zrange<string[]>(ORDERS_ZSET, 0, -1, { rev: true });
    if (!ids.length) return [];
    const raws = await r.mget<Order[]>(...ids.map(orderKey));
    return raws.filter((x): x is Order => x != null);
  } catch (e) {
    console.error("[orders] 拉取全部订单失败:", e);
    return [];
  }
}

/** 写入单个订单（不动 zset，保持创建时间排序） */
async function saveOrder(order: Order): Promise<void> {
  const r = getRedis();
  if (!r) {
    memOrders.set(order.id, order);
    return;
  }
  try {
    await r.set(orderKey(order.id), order as any);
  } catch (e) {
    console.error("[orders] 写入订单失败:", order.id, e);
  }
}

// ── CRUD 操作 ──

/** 创建订单（含去重：同用户+同plan已有 pending/short_paid 则拒绝） */
export async function createOrder(data: {
  userId: string;
  userName: string;
  userPhone?: string;
  plan: PlanType;
  paymentMethod: "wechat" | "alipay";
  note: string;
  currency: "CNY" | "HKD";
}): Promise<{ order: Order | null; error?: string }> {
  const all = await fetchAllOrders();

  // 去重：同 userId + 同 plan 已有 pending 或 short_paid 则拒绝
  for (const existing of all) {
    if (
      existing.userId === data.userId &&
      existing.plan === data.plan &&
      (existing.status === "pending" || existing.status === "short_paid")
    ) {
      return {
        order: null,
        error: `您已有待处理的${data.plan === "month" ? "月卡" : "年卡"}订单，请先完成付款或等待处理`,
      };
    }
  }

  const id = generateOrderId();
  const now = new Date();
  const order: Order = {
    id,
    userId: data.userId,
    userName: data.userName,
    userPhone: data.userPhone,
    plan: data.plan,
    amount: PLANS[data.plan].price,
    currency: data.currency,
    status: "pending",
    paymentMethod: data.paymentMethod,
    note: data.note || "",
    createdAt: now.toISOString(),
  };

  const r = getRedis();
  if (r) {
    try {
      await r.set(orderKey(id), order as any);
      await r.zadd(ORDERS_ZSET, { score: now.getTime(), member: id });
    } catch (e) {
      console.error("[orders] 创建订单写入失败:", e);
      return { order: null, error: "订单写入失败，请稍后重试" };
    }
  } else {
    memOrders.set(id, order);
  }

  return { order };
}

/** 获取订单 */
export async function getOrder(id: string): Promise<Order | null> {
  const r = getRedis();
  if (!r) return memOrders.get(id) || null;
  try {
    return (await r.get<Order>(orderKey(id))) ?? null;
  } catch (e) {
    console.error("[orders] 获取订单失败:", id, e);
    return null;
  }
}

/** 获取用户的订单列表 */
export async function getUserOrders(userId: string): Promise<Order[]> {
  const all = await fetchAllOrders();
  return all
    .filter((o) => o.userId === userId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

/** 获取所有订单（后台用） */
export async function getAllOrders(options?: {
  status?: Order["status"];
  limit?: number;
}): Promise<Order[]> {
  let result = await fetchAllOrders();
  if (options?.status) {
    result = result.filter((o) => o.status === options.status);
  }
  if (options?.limit) {
    result = result.slice(0, options.limit);
  }
  return result;
}

/** 确认收款（含金额比对）
 *  actualAmount: 实际收款金额（元，如 68）
 *  forceConfirmReason: 如果实际收款 < 订单金额，需要填写强制确认原因才能激活
 *  返回: { order, warning } — warning 为金额不足提示
 */
export async function confirmOrder(
  id: string,
  actualAmount?: number,
  forceConfirmReason?: string
): Promise<{ order: Order | null; warning?: string }> {
  const order = await getOrder(id);
  if (!order) return { order: null };
  // 允许 pending 和 short_paid 状态再次确认
  if (order.status !== "pending" && order.status !== "short_paid") return { order: null };

  // 金额比对
  if (actualAmount !== undefined && actualAmount !== null) {
    order.actualAmount = Math.round(actualAmount * 100); // 存为分

    if (actualAmount < order.amount) {
      // 实际收款不足
      if (!forceConfirmReason || !forceConfirmReason.trim()) {
        // 无强制确认原因 → 标记 short_paid，不激活 VIP
        order.status = "short_paid";
        order.note += ` [收款不足: 订单¥${order.amount}, 实收¥${actualAmount}]`;
        await saveOrder(order);
        return {
          order,
          warning: `⚠️ 收款不足：订单 ¥${order.amount}，实收 ¥${actualAmount}，差额 ¥${order.amount - actualAmount}。如需强制激活，请填写原因。`,
        };
      }
      // 有强制确认原因 → 允许激活，但记录原因
      order.forceConfirmReason = forceConfirmReason.trim();
      order.note += ` [强制确认: 订单¥${order.amount}, 实收¥${actualAmount}, 原因: ${forceConfirmReason.trim()}]`;
    }
  }

  order.status = "paid";
  order.paidAt = new Date().toISOString();
  await saveOrder(order);
  return { order };
}

/** 拒绝订单 */
export async function rejectOrder(id: string, reason: string): Promise<Order | null> {
  const order = await getOrder(id);
  if (!order) return null;
  // 允许 pending 和 short_paid 状态被拒绝
  if (order.status !== "pending" && order.status !== "short_paid") return null;

  order.status = "rejected";
  order.rejectedAt = new Date().toISOString();
  order.rejectReason = reason;
  await saveOrder(order);
  return order;
}

/** 订单统计（后台用） */
export async function getOrderStats() {
  const all = await fetchAllOrders();
  const today = new Date().toISOString().slice(0, 10);
  return {
    total: all.length,
    pending: all.filter((o) => o.status === "pending").length,
    paid: all.filter((o) => o.status === "paid").length,
    rejected: all.filter((o) => o.status === "rejected").length,
    totalRevenue: all
      .filter((o) => o.status === "paid")
      .reduce((sum, o) => sum + o.amount, 0),
    todayOrders: all.filter((o) => o.createdAt.startsWith(today)).length,
    todayRevenue: all
      .filter((o) => o.status === "paid" && o.createdAt.startsWith(today))
      .reduce((sum, o) => sum + o.amount, 0),
  };
}
