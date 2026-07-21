/**
 * 数据库层 — Upstash Redis（Serverless）封装
 *
 * 所有持久化数据（订单、用户、VIP、充值码）都走这里。
 * 若未配置 UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN，
 * 各业务模块会自动回退到内存存储，保证本地无凭证也能跑。
 */

import { Redis } from "@upstash/redis";

let _redis: Redis | null = null;
let _warned = false;

/** 取得 Redis 客户端；未配置则返回 null */
export function getRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    if (!_warned) {
      console.warn("[db] ⚠️ UPSTASH_REDIS 未配置，业务将回退内存存储（仅开发用，重启即丢）");
      _warned = true;
    }
    return null;
  }

  if (!_redis) {
    _redis = new Redis({ url, token });
  }
  return _redis;
}

/** 是否已接入真实 Redis */
export function isRedisReady(): boolean {
  return getRedis() !== null;
}

// ── 通用 JSON 读写 ──

/** 读取 JSON 对象 */
export async function jsonGet<T>(key: string): Promise<T | null> {
  const r = getRedis();
  if (!r) return null;
  try {
    const v = await r.get<T>(key);
    return (v ?? null) as T | null;
  } catch (e) {
    console.error("[db] jsonGet 失败:", key, e);
    return null;
  }
}

/** 写入 JSON 对象 */
export async function jsonSet(key: string, value: unknown): Promise<boolean> {
  const r = getRedis();
  if (!r) return false;
  try {
    await r.set(key, value as any);
    return true;
  } catch (e) {
    console.error("[db] jsonSet 失败:", key, e);
    return false;
  }
}

/** 删除 key */
export async function delKey(key: string): Promise<boolean> {
  const r = getRedis();
  if (!r) return false;
  try {
    await r.del(key);
    return true;
  } catch (e) {
    console.error("[db] delKey 失败:", key, e);
    return false;
  }
}
