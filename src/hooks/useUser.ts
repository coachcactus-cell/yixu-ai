"use client";

import { useState, useEffect, useCallback } from "react";

const USER_KEY = "yixu-user";

interface YixuUser {
  id: string;
  nickname: string;
  wechatId?: string;
  createdAt: string;
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

export function useUser() {
  const [user, setUser] = useState<YixuUser | null>(null);

  useEffect(() => {
    const existing = loadUser();
    if (existing) {
      setUser(existing);
    } else {
      // Auto-create a user on first visit
      const newUser: YixuUser = {
        id: generateId(),
        nickname: "修行者",
        createdAt: new Date().toISOString(),
      };
      saveUser(newUser);
      setUser(newUser);
    }
  }, []);

  const setNickname = useCallback((nickname: string) => {
    if (!user) return;
    const updated = { ...user, nickname };
    saveUser(updated);
    setUser(updated);
  }, [user]);

  const setWechatId = useCallback((wechatId: string) => {
    if (!user) return;
    const updated = { ...user, wechatId };
    saveUser(updated);
    setUser(updated);
  }, [user]);

  return { user, setNickname, setWechatId };
}