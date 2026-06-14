"use client";

import { useState, useEffect, useCallback } from "react";

// ─── 定價表（單位：分）───
export const ASSESSMENT_PRICES: Record<string, number> = {
  chakra: 1290,       // ¥12.90
  attachment: 1290,
  emotion: 1290,
  starseed: 1290,
  gad7: 1290,
  pcl5: 1290,
  phq15: 1290,
  coreom: 1290,
  yijing: 1290,
  enneagram: 0,       // 免費
};

// ─── 測評名稱映射 ───
export const ASSESSMENT_NAMES: Record<string, string> = {
  chakra: "七脉轮能量评估",
  attachment: "心念执念检测",
  emotion: "情绪惯性模式",
  starseed: "星宿种子性格测评",
  gad7: "GAD-7 焦虑问卷",
  pcl5: "PTSD 创伤压力筛查",
  phq15: "PHQ-15 躯体症状量表",
  coreom: "CORE-OM 临床结果评量",
  yijing: "易卦占卜",
  enneagram: "九型人格测试",
};

// ─── 充值碼（Phase 1 硬編碼）───
const TOPUP_CODES: Record<string, { amount: number; desc: string }> = {
  "YIXU50": { amount: 5000, desc: "充值 ¥50" },
  "YIXU100": { amount: 10000, desc: "充值 ¥100" },
  "YIXU200": { amount: 20000, desc: "充值 ¥200" },
};

// ─── localStorage Keys ───
const WALLET_KEY = "yixu-wallet";
const UNLOCKED_KEY = "yixu-unlocked";
const USED_CODES_KEY = "yixu-used-topup-codes";

// ─── 類型定義 ───
export interface Transaction {
  id: string;
  type: "topup" | "purchase";
  amount: number;           // 正數（分）
  description: string;
  assessmentId?: string;
  createdAt: string;
}

export interface WalletData {
  balance: number;
  transactions: Transaction[];
}

export interface UnlockedItem {
  unlockedAt: string;
  transactionId: string;
}

export type UnlockedItems = Record<string, UnlockedItem>;

// ─── 工具函數 ───
function generateId(): string {
  return `tx_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function formatAmount(fen: number): string {
  return `¥${(fen / 100).toFixed(2)}`;
}

// ─── localStorage 讀寫 ───
function loadWallet(): WalletData {
  if (typeof window === "undefined") return { balance: 0, transactions: [] };
  try {
    const raw = localStorage.getItem(WALLET_KEY);
    if (!raw) return { balance: 0, transactions: [] };
    return JSON.parse(raw);
  } catch {
    return { balance: 0, transactions: [] };
  }
}

function saveWallet(data: WalletData): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(WALLET_KEY, JSON.stringify(data));
  } catch { /* ignore */ }
}

function loadUnlocked(): UnlockedItems {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(UNLOCKED_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function saveUnlocked(items: UnlockedItems): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(UNLOCKED_KEY, JSON.stringify(items));
  } catch { /* ignore */ }
}

function loadUsedCodes(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(USED_CODES_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveUsedCodes(codes: string[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(USED_CODES_KEY, JSON.stringify(codes));
  } catch { /* ignore */ }
}

// ─── Hook ───
export function useWallet() {
  const [wallet, setWallet] = useState<WalletData>({ balance: 0, transactions: [] });
  const [unlocked, setUnlocked] = useState<UnlockedItems>({});

  useEffect(() => {
    setWallet(loadWallet());
    setUnlocked(loadUnlocked());
  }, []);

  // 獲取定價
  const getPrice = useCallback((assessmentId: string): number => {
    return ASSESSMENT_PRICES[assessmentId] ?? 0;
  }, []);

  // 是否已解鎖
  const isUnlocked = useCallback((assessmentId: string): boolean => {
    if (ASSESSMENT_PRICES[assessmentId] === 0) return true; // 免費測評
    return !!unlocked[assessmentId];
  }, [unlocked]);

  // 餘額是否足夠
  const canAfford = useCallback((assessmentId: string): boolean => {
    const price = getPrice(assessmentId);
    return wallet.balance >= price;
  }, [wallet.balance, getPrice]);

  // 購買測評
  const purchase = useCallback((assessmentId: string): { success: boolean; message: string } => {
    const price = getPrice(assessmentId);

    if (price === 0) {
      return { success: true, message: "免费测评，无需购买" };
    }

    if (isUnlocked(assessmentId)) {
      return { success: true, message: "已解锁" };
    }

    if (wallet.balance < price) {
      return { success: false, message: `余额不足，需要 ${formatAmount(price)}，当前余额 ${formatAmount(wallet.balance)}` };
    }

    // 扣款
    const tx: Transaction = {
      id: generateId(),
      type: "purchase",
      amount: price,
      description: `解锁「${ASSESSMENT_NAMES[assessmentId] || assessmentId}」`,
      assessmentId,
      createdAt: new Date().toISOString(),
    };

    const newWallet: WalletData = {
      balance: wallet.balance - price,
      transactions: [tx, ...wallet.transactions].slice(0, 100), // 最多保留 100 筆
    };

    const newUnlocked: UnlockedItems = {
      ...unlocked,
      [assessmentId]: {
        unlockedAt: new Date().toISOString(),
        transactionId: tx.id,
      },
    };

    saveWallet(newWallet);
    saveUnlocked(newUnlocked);
    setWallet(newWallet);
    setUnlocked(newUnlocked);

    return { success: true, message: `已解锁「${ASSESSMENT_NAMES[assessmentId] || assessmentId}」` };
  }, [wallet, unlocked, getPrice, isUnlocked]);

  // 兌換充值碼
  const redeemCode = useCallback((code: string): { success: boolean; message: string } => {
    const upperCode = code.trim().toUpperCase();

    if (!upperCode) {
      return { success: false, message: "请输入充值码" };
    }

    // 檢查是否已用
    const usedCodes = loadUsedCodes();
    if (usedCodes.includes(upperCode)) {
      return { success: false, message: "此充值码已被使用" };
    }

    const codeInfo = TOPUP_CODES[upperCode];
    if (!codeInfo) {
      return { success: false, message: "无效充值码，请联系亦须先生获取" };
    }

    // 加餘額
    const tx: Transaction = {
      id: generateId(),
      type: "topup",
      amount: codeInfo.amount,
      description: codeInfo.desc,
      createdAt: new Date().toISOString(),
    };

    const newWallet: WalletData = {
      balance: wallet.balance + codeInfo.amount,
      transactions: [tx, ...wallet.transactions].slice(0, 100),
    };

    // 標記碼已用
    usedCodes.push(upperCode);
    saveUsedCodes(usedCodes);
    saveWallet(newWallet);
    setWallet(newWallet);

    return { success: true, message: `充值成功！${codeInfo.desc}，当前余额 ${formatAmount(newWallet.balance)}` };
  }, [wallet]);

  return {
    balance: wallet.balance,
    transactions: wallet.transactions,
    unlocked,
    getPrice,
    isUnlocked,
    canAfford,
    purchase,
    redeemCode,
    formatAmount,
  };
}
