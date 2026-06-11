/**
 * B2B 客戶數據層
 * 使用 Vercel KV (生產) 或 Memory Store (開發)
 */

// ── Types ──
export interface B2BClient {
  id: string;
  wechatId: string;
  companyName: string;
  plan: "trial" | "basic" | "pro";
  trialStart: number; // Unix ms
  trialEnd: number;
  subscriptionEnd: number; // 0 = 無訂閱
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

// ── In-Memory Store (開發用) ──
const clients = new Map<string, B2BClient>();
const records: AssessmentRecord[] = [];

// ── CRUD ──

/** 創建 B2B 客戶（自動 7 日試用） */
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
      enneagram: true, // 試用期全開
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

/** 查詢客戶 */
export function getB2BClient(id: string): B2BClient | null {
  return clients.get(id) || null;
}

/** 查詢客戶 by wechatId */
export function getB2BClientByWechat(wechatId: string): B2BClient | null {
  for (const c of clients.values()) {
    if (c.wechatId === wechatId) return c;
  }
  return null;
}

/** 列出所有客戶（後台用） */
export function listB2BClients(): B2BClient[] {
  return Array.from(clients.values()).sort((a, b) => b.createdAt - a.createdAt);
}

/** 更新客戶狀態（人手開通/停用） */
export function updateB2BClient(
  id: string,
  updates: Partial<Pick<B2BClient, "plan" | "status" | "subscriptionEnd" | "features">>
): B2BClient | null {
  const client = clients.get(id);
  if (!client) return null;
  Object.assign(client, updates);
  clients.set(id, client);
  return client;
}

/** 刪除客戶 */
export function deleteB2BClient(id: string): boolean {
  return clients.delete(id);
}

/** 檢查客戶是否有某功能權限 */
export function checkFeatureAccess(
  clientId: string,
  feature: keyof B2BFeatures
): { allowed: boolean; reason: string } {
  const client = getB2BClient(clientId);
  if (!client) return { allowed: false, reason: "客戶不存在" };
  if (client.status === "suspended") return { allowed: false, reason: "帳號已停用" };

  // 檢查試用期
  if (client.plan === "trial") {
    if (Date.now() > client.trialEnd) {
      return { allowed: false, reason: "試用期已結束，請加微信 859022196 續費" };
    }
    return { allowed: client.features[feature], reason: "" };
  }

  // 檢查付費期
  if (client.subscriptionEnd > 0 && Date.now() > client.subscriptionEnd) {
    return { allowed: false, reason: "訂閱已過期，請續費" };
  }

  return { allowed: client.features[feature], reason: "" };
}

/** 儲存測評記錄 */
export function saveAssessmentRecord(record: Omit<AssessmentRecord, "id" | "createdAt">): AssessmentRecord {
  const full: AssessmentRecord = {
    ...record,
    id: `rec_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    createdAt: Date.now(),
  };
  records.push(full);
  return full;
}

/** 查詢客戶嘅測評記錄 */
export function getClientRecords(clientId: string, limit = 50): AssessmentRecord[] {
  return records
    .filter((r) => r.clientId === clientId)
    .slice(-limit)
    .reverse();
}

/** 統計客戶數據（後台用） */
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
