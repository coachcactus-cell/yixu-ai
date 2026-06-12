"use client";

import { useState, useEffect, useCallback } from "react";

const USER_KEY = "yixu-user";
const HISTORY_KEY = "yixu-history";

export interface ChakraHistoryRecord {
  id: string;
  date: string;
  results: {
    nameZh: string;
    percentage: number;
    statusLabel: string;
    color: string;
  }[];
  reportImageUrl?: string;
}

export interface YijingHistoryRecord {
  id: string;
  date: string;
  hexagram: string;
  question: string;
  interpretation?: string;
}

export interface UserHistory {
  chakraRecords: ChakraHistoryRecord[];
  yijingRecords: YijingHistoryRecord[];
}

export interface YixuUser {
  id: string;
  phone?: string;       // 手机号（主键）
  wechatId?: string;    // 微信ID（选填）
  nickname: string;
  createdAt: string;
  vipLevel: "free" | "monthly" | "yearly";
}

function generateId(): string {
  return `yx_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function loadUser(): YixuUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveUser(user: YixuUser): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch { /* ignore */ }
}

function loadHistory(): UserHistory {
  if (typeof window === "undefined") return { chakraRecords: [], yijingRecords: [] };
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return { chakraRecords: [], yijingRecords: [] };
    return JSON.parse(raw);
  } catch {
    return { chakraRecords: [], yijingRecords: [] };
  }
}

function saveHistory(history: UserHistory): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch { /* ignore */ }
}

export function useUser() {
  const [user, setUser] = useState<YixuUser | null>(null);
  const [history, setHistory] = useState<UserHistory>({ chakraRecords: [], yijingRecords: [] });
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const existing = loadUser();
    if (existing) {
      setUser(existing);
      setIsLoggedIn(!!existing.phone);
    } else {
      // Auto-create anonymous user on first visit
      const newUser: YixuUser = {
        id: generateId(),
        nickname: "修行者",
        createdAt: new Date().toISOString(),
        vipLevel: "free",
      };
      saveUser(newUser);
      setUser(newUser);
      setIsLoggedIn(false);
    }
    // Load history
    const hist = loadHistory();
    setHistory(hist);
  }, []);

  // ── 手机号登录/注册 ──
  const loginWithPhone = useCallback((phone: string) => {
    if (!user) return false;
    const updated: YixuUser = { ...user, phone, nickname: "修行者" };
    saveUser(updated);
    setUser(updated);
    setIsLoggedIn(true);
    return true;
  }, [user]);

  // ── 补充微信ID ──
  const setWechatId = useCallback((wechatId: string) => {
    if (!user) return;
    const updated = { ...user, wechatId };
    saveUser(updated);
    setUser(updated);
  }, [user]);

  // ── 登出 ──
  const logout = useCallback(() => {
    if (!user) return;
    const updated: YixuUser = { ...user, phone: undefined, wechatId: undefined };
    saveUser(updated);
    setUser(updated);
    setIsLoggedIn(false);
  }, [user]);

  // ── 保存脉轮测评记录 ──
  const addChakraRecord = useCallback((record: Omit<ChakraHistoryRecord, "id">) => {
    const newRecord: ChakraHistoryRecord = {
      ...record,
      id: generateId(),
    };
    setHistory((prev) => {
      const updated = {
        ...prev,
        chakraRecords: [newRecord, ...prev.chakraRecords].slice(0, 20), // 最多保留20条
      };
      saveHistory(updated);
      return updated;
    });
  }, []);

  // ── 保存易卦占卜记录 ──
  const addYijingRecord = useCallback((record: Omit<YijingHistoryRecord, "id">) => {
    const newRecord: YijingHistoryRecord = {
      ...record,
      id: generateId(),
    };
    setHistory((prev) => {
      const updated = {
        ...prev,
        yijingRecords: [newRecord, ...prev.yijingRecords].slice(0, 20),
      };
      saveHistory(updated);
      return updated;
    });
  }, []);

  // ── 更新脉轮报告图片 ──
  const updateChakraReportImage = useCallback((recordId: string, imageUrl: string) => {
    setHistory((prev) => {
      const updated = {
        ...prev,
        chakraRecords: prev.chakraRecords.map((r) =>
          r.id === recordId ? { ...r, reportImageUrl: imageUrl } : r
        ),
      };
      saveHistory(updated);
      return updated;
    });
  }, []);

  return {
    user,
    history,
    isLoggedIn,
    loginWithPhone,
    setWechatId,
    logout,
    addChakraRecord,
    addYijingRecord,
    updateChakraReportImage,
  };
}
