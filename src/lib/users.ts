/**
 * 用户数据层（服务端持久化）
 *
 * 生产环境：Upstash Redis（user:{id} + users:zset 有序集）
 * 开发环境：内存 Map 回退
 *
 * 用途：让后台「用户」Tab 与总览能看到真实用户（不再只有 localStorage 假数据）。
 * 客户端仍保留 localStorage 作为本地缓存/匿名身份，这里只是把用户镜像到服务端。
 */

import { getRedis } from "./db";

export interface StoredUser {
  id: string;
  phone?: string;
  wechatId?: string;
  nickname: string;
  avatar?: string;
  createdAt: string;
  vipLevel: "free" | "monthly" | "yearly" | "staff";
  lastSeen?: string;
}

const USERS_ZSET = "users:zset";
const userKey = (id: string) => `user:${id}`;

const memUsers = new Map<string, StoredUser>();

/** 写入/更新用户（upsert，幂等） */
export async function saveUser(user: StoredUser): Promise<void> {
  const r = getRedis();
  if (!r) {
    memUsers.set(user.id, user);
    return;
  }
  try {
    await r.set(userKey(user.id), user as any);
    const score = new Date(user.createdAt).getTime() || Date.now();
    await r.zadd(USERS_ZSET, { score, member: user.id });
  } catch (e) {
    console.error("[users] 保存用户失败:", user.id, e);
  }
}

/** 获取单个用户 */
export async function getUser(id: string): Promise<StoredUser | null> {
  const r = getRedis();
  if (!r) return memUsers.get(id) || null;
  try {
    return (await r.get<StoredUser>(userKey(id))) ?? null;
  } catch (e) {
    console.error("[users] 获取用户失败:", id, e);
    return null;
  }
}

/** 列出全部用户（按注册时间倒序） */
export async function listUsers(): Promise<StoredUser[]> {
  const r = getRedis();
  if (!r) {
    return Array.from(memUsers.values()).sort((a, b) =>
      b.createdAt.localeCompare(a.createdAt)
    );
  }
  try {
    const ids = await r.zrange<string[]>(USERS_ZSET, 0, -1, { rev: true });
    if (!ids.length) return [];
    const raws = await r.mget<StoredUser[]>(...ids.map(userKey));
    return raws.filter((x): x is StoredUser => x != null);
  } catch (e) {
    console.error("[users] 列出用户失败:", e);
    return [];
  }
}
