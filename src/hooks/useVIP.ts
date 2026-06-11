"use client";

import { useState, useEffect, useCallback } from "react";

const VIP_KEY = "yixu-vip";
const VIP_CODE_KEY = "yixu-vip-codes";

interface VIPStatus {
  isVIP: boolean;
  plan: "none" | "month" | "year";
  expiresAt: string | null; // ISO date string
  activatedAt: string | null;
}

// Valid activation codes (C老大 can add more here or manage via Google Sheet)
// These are hardcoded for Phase 1 - manual management
const VALID_CODES: Record<string, { plan: "month" | "year"; days: number }> = {
  // Demo codes for testing - C老大 will generate real ones
  "DEMO01": { plan: "month", days: 30 },
  "DEMO02": { plan: "month", days: 30 },
  "DEMOY1": { plan: "year", days: 365 },
};

function loadVIP(): VIPStatus {
  if (typeof window === "undefined") return { isVIP: false, plan: "none", expiresAt: null, activatedAt: null };
  try {
    const raw = localStorage.getItem(VIP_KEY);
    if (!raw) return { isVIP: false, plan: "none", expiresAt: null, activatedAt: null };
    const status: VIPStatus = JSON.parse(raw);
    // Check expiration
    if (status.expiresAt) {
      const expires = new Date(status.expiresAt);
      if (expires < new Date()) {
        // VIP expired
        const expired: VIPStatus = { isVIP: false, plan: "none", expiresAt: null, activatedAt: null };
        localStorage.setItem(VIP_KEY, JSON.stringify(expired));
        return expired;
      }
    }
    return status;
  } catch {
    return { isVIP: false, plan: "none", expiresAt: null, activatedAt: null };
  }
}

function saveVIP(status: VIPStatus): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(VIP_KEY, JSON.stringify(status));
  } catch { /* ignore */ }
}

export function useVIP() {
  const [vip, setVip] = useState<VIPStatus>({
    isVIP: false,
    plan: "none",
    expiresAt: null,
    activatedAt: null,
  });

  useEffect(() => {
    setVip(loadVIP());
  }, []);

  const activateCode = useCallback((code: string): { success: boolean; message: string } => {
    const upperCode = code.toUpperCase().trim();

    // Check if code is already used
    try {
      const usedCodes = JSON.parse(localStorage.getItem(VIP_CODE_KEY) || "[]") as string[];
      if (usedCodes.includes(upperCode)) {
        return { success: false, message: "此激活码已被使用" };
      }
    } catch { /* ignore */ }

    const codeInfo = VALID_CODES[upperCode];
    if (!codeInfo) {
      return { success: false, message: "无效激活码，请联系亦须先生获取" };
    }

    const now = new Date();
    const expires = new Date(now.getTime() + codeInfo.days * 24 * 60 * 60 * 1000);

    const newStatus: VIPStatus = {
      isVIP: true,
      plan: codeInfo.plan,
      expiresAt: expires.toISOString(),
      activatedAt: now.toISOString(),
    };

    // Mark code as used
    try {
      const usedCodes = JSON.parse(localStorage.getItem(VIP_CODE_KEY) || "[]") as string[];
      usedCodes.push(upperCode);
      localStorage.setItem(VIP_CODE_KEY, JSON.stringify(usedCodes));
    } catch { /* ignore */ }

    saveVIP(newStatus);
    setVip(newStatus);
    return { success: true, message: `VIP ${codeInfo.plan === "year" ? "年" : "月"}会员已激活，有效期至 ${expires.toLocaleDateString("zh-CN")}` };
  }, []);

  const revokeVIP = useCallback(() => {
    const noneStatus: VIPStatus = { isVIP: false, plan: "none", expiresAt: null, activatedAt: null };
    saveVIP(noneStatus);
    setVip(noneStatus);
  }, []);

  // Calculate remaining days
  const remainingDays = vip.expiresAt
    ? Math.max(0, Math.ceil((new Date(vip.expiresAt).getTime() - Date.now()) / (24 * 60 * 60 * 1000)))
    : 0;

  return { vip, activateCode, revokeVIP, remainingDays };
}