/**
 * 订单管理系统 - 数据层
 * 基于 In-Memory Store（开发/Phase 1），后续可迁移到数据库
 */

// ── Types ──

export interface Order {
  id: string;
  userId: string;
  userName: string;
  userPhone?: string;
  plan: "month" | "year";
  amount: number; // ¥68 月卡 / ¥198 年卡
  status: "pending" | "paid" | "rejected" | "expired" | "short_paid";
  paymentMethod: "wechat" | "alipay"; // 用户选择的支付方式
  note: string; // 用户填写的备注（交易单号后6位等）
  actualAmount?: number; // C老大填写的实际收款金额（分）
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

// ── In-Memory Store ──

const orders = new Map<string, Order>();

// ── ID 生成器 ──

function generateOrderId(): string {
  return `ORD_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

// ── CRUD 操作 ──

/** 创建订单 */
export function createOrder(data: {
  userId: string;
  userName: string;
  userPhone?: string;
  plan: PlanType;
  paymentMethod: "wechat" | "alipay";
  note: string;
}): Order {
  const id = generateOrderId();
  const order: Order = {
    id,
    userId: data.userId,
    userName: data.userName,
    userPhone: data.userPhone,
    plan: data.plan,
    amount: PLANS[data.plan].price,
    status: "pending",
    paymentMethod: data.paymentMethod,
    note: data.note || "",
    createdAt: new Date().toISOString(),
  };
  orders.set(id, order);
  return order;
}

/** 获取订单 */
export function getOrder(id: string): Order | null {
  return orders.get(id) || null;
}

/** 获取用户的订单列表 */
export function getUserOrders(userId: string): Order[] {
  return Array.from(orders.values())
    .filter((o) => o.userId === userId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

/** 获取所有订单（后台用） */
export function getAllOrders(options?: { status?: Order["status"]; limit?: number }): Order[] {
  let result = Array.from(orders.values()).sort(
    (a, b) => b.createdAt.localeCompare(a.createdAt)
  );
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
export function confirmOrder(
  id: string,
  actualAmount?: number,
  forceConfirmReason?: string
): { order: Order | null; warning?: string } {
  const order = orders.get(id);
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
        orders.set(id, order);
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
  orders.set(id, order);
  return { order };
}

/** 拒绝订单 */
export function rejectOrder(id: string, reason: string): Order | null {
  const order = orders.get(id);
  if (!order) return null;
  // 允许 pending 和 short_paid 状态被拒绝
  if (order.status !== "pending" && order.status !== "short_paid") return null;

  order.status = "rejected";
  order.rejectedAt = new Date().toISOString();
  order.rejectReason = reason;
  orders.set(id, order);
  return order;
}

/** 订单统计（后台用） */
export function getOrderStats() {
  const all = Array.from(orders.values());
  return {
    total: all.length,
    pending: all.filter((o) => o.status === "pending").length,
    paid: all.filter((o) => o.status === "paid").length,
    rejected: all.filter((o) => o.status === "rejected").length,
    totalRevenue: all
      .filter((o) => o.status === "paid")
      .reduce((sum, o) => sum + o.amount, 0),
    todayOrders: all.filter((o) => {
      const today = new Date().toISOString().slice(0, 10);
      return o.createdAt.startsWith(today);
    }).length,
    todayRevenue: all
      .filter((o) => o.status === "paid" && o.createdAt.startsWith(new Date().toISOString().slice(0, 10)))
      .reduce((sum, o) => sum + o.amount, 0),
  };
}
