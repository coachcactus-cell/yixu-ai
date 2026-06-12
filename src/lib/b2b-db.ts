/**
 * B2B 客戶数据层
 * 使用 Vercel KV (生产) 或 Memory Store (开发)
 */

// ── Types ──
export interface B2BClient {
  id: string;
  wechatId: string;
  companyName: string;
  plan: "trial" | "basic" | "pro";
  trialStart: number; // Unix ms
  trialEnd: number;
  subscriptionEnd: number; // 0 = 无订阅
  features: B2BFeatures;
  createdAt: number;
  status: "active" | "expired" | "suspended";
}

export interface B2BFeatures {
  enneagram: boolean;
  chakra: boolean;
  yijing: boolean;
  tarot: boolean;
}

export interface AssessmentRecord {
  id: string;
  clientId: string;
  userId: string;
  type: "enneagram" | "chakra" | "yijing";
  result: any;
  createdAt: number;
}

// ── 超级管理員（写死，不受 deploy 影響）──
const SUPER_ADMIN = {
  id: "yixu-founder",
  wechatId: process.env.FOUNDER_WECHAT_ID || "founder",
  companyName: "YIXU HEALING 总部",
  plan: "pro" as const,
  trialStart: 0,
  trialEnd: 9999999999999,
  subscriptionEnd: 9999999999999,
  features: { enneagram: true, chakra: true, yijing: true, tarot: true },
  createdAt: 0,
  status: "active" as const,
};

// ── 预设演示客戶（写死，方便测试）──
const DEMO_CLIENT = {
  id: "yixu-demo",
  wechatId: "demo",
  companyName: "演示公司",
  plan: "trial" as const,
  trialStart: Date.now(),
  trialEnd: Date.now() + 7 * 24 * 60 * 60 * 1000,
  subscriptionEnd: 0,
  features: { enneagram: true, chakra: true, yijing: true, tarot: false },
  createdAt: Date.now(),
  status: "active" as const,
};

// ── In-Memory Store (开发用) ──
const clients = new Map<string, B2BClient>();
const records: AssessmentRecord[] = [];

// 初始化：写死的帳号永远存在
clients.set(SUPER_ADMIN.id, SUPER_ADMIN);
clients.set(DEMO_CLIENT.id, DEMO_CLIENT);

// ── CRUD ──

/** 創建 B2B 客戶（自动 7 日试用） */
export function createB2BClient(data: {
  wechatId: string;
  companyName: string;
}): B2BClient {
  const now = Date.now();
  const client: B2BClient = {
    id: `b2b_${now}_${Math.random().toString(36).slice(2, 8)}`,
    wechatId: data.wechatId,
    companyName: data.companyName,
    plan: "trial",
    trialStart: now,
    trialEnd: now + 7 * 24 * 60 * 60 * 1000, // 7 日
    subscriptionEnd: 0,
    features: {
      enneagram: true, // 试用期全开
      chakra: true,
      yijing: true,
      tarot: false, // 孟子塔羅未完成
    },
    createdAt: now,
    status: "active",
  };
  clients.set(client.id, client);
  return client;
}

/** 查询客戶 */
export function getB2BClient(id: string): B2BClient | null {
  return clients.get(id) || null;
}

/** 查询客戶 by wechatId */
export function getB2BClientByWechat(wechatId: string): B2BClient | null {
  for (const c of clients.values()) {
    if (c.wechatId === wechatId) return c;
  }
  return null;
}

/** 列出所有客戶（后台用） */
export function listB2BClients(): B2BClient[] {
  return Array.from(clients.values()).sort((a, b) => b.createdAt - a.createdAt);
}

/** 允许更新的欄位白名单 */
const UPDATABLE_FIELDS = ["plan", "status", "subscriptionEnd", "features"] as const;
type UpdatableField = typeof UPDATABLE_FIELDS[number];

/** 更新客戶狀態（人手开通/停用）— 只允许白名单欄位 */
export function updateB2BClient(
  id: string,
  updates: Partial<Pick<B2BClient, "plan" | "status" | "subscriptionEnd" | "features">>
): B2BClient | null {
  const client = clients.get(id);
  if (!client) return null;

  // 只复制白名单中的欄位，防止注入 id/wechatId 等
  for (const key of UPDATABLE_FIELDS) {
    if (key in updates) {
      (client as any)[key] = (updates as any)[key];
    }
  }
  clients.set(id, client);
  return client;
}

/** 刪除客戶 */
export function deleteB2BClient(id: string): boolean {
  return clients.delete(id);
}

/** 檢查客戶是否有某功能权限 */
export function checkFeatureAccess(
  clientId: string,
  feature: keyof B2BFeatures
): { allowed: boolean; reason: string } {
  const client = getB2BClient(clientId);
  if (!client) return { allowed: false, reason: "客戶不存在" };
  if (client.status === "suspended") return { allowed: false, reason: "帳号已停用" };

  // 檢查试用期
  if (client.plan === "trial") {
    if (Date.now() > client.trialEnd) {
      return { allowed: false, reason: "试用期已结束，请加微信 859022196 續费" };
    }
    return { allowed: client.features[feature], reason: "" };
  }

  // 檢查付费期
  if (client.subscriptionEnd > 0 && Date.now() > client.subscriptionEnd) {
    return { allowed: false, reason: "订阅已过期，请續费" };
  }

  return { allowed: client.features[feature], reason: "" };
}

/** 儲存测评记录 */
export function saveAssessmentRecord(record: Omit<AssessmentRecord, "id" | "createdAt">): AssessmentRecord {
  const full: AssessmentRecord = {
    ...record,
    id: `rec_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    createdAt: Date.now(),
  };
  records.push(full);
  return full;
}

/** 查询客戶的测评记录 */
export function getClientRecords(clientId: string, limit = 50): AssessmentRecord[] {
  return records
    .filter((r) => r.clientId === clientId)
    .slice(-limit)
    .reverse();
}

/** 统计客戶数据（后台用） */
export function getClientStats(clientId: string) {
  const clientRecords = records.filter((r) => r.clientId === clientId);
  return {
    totalAssessments: clientRecords.length,
    byType: {
      enneagram: clientRecords.filter((r) => r.type === "enneagram").length,
      chakra: clientRecords.filter((r) => r.type === "chakra").length,
      yijing: clientRecords.filter((r) => r.type === "yijing").length,
    },
    lastActivity: clientRecords[0]?.createdAt || 0,
  };
}
