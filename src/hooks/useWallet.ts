"use client";

import { useState, useEffect, useCallback } from "react";

// ─── 定價表（單位：分）───
export const ASSESSMENT_PRICES: Record<string, number> = {
  chakra: 1230,       // ¥12.30
  attachment: 1230,
  emotion: 1230,
  starseed: 1230,
  gad7: 1230,
  pcl5: 1230,
  phq15: 1230,
  coreom: 1230,
  yijing: 1230,
  enneagram: 1230,
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

// ─── 充值码系统 ───
// Phase 1：半自动流程
// 客户选金额 → 生成专属充值码 → 客户扫码付款备注码 → C老大确认 → 余额到账
// 管理员确认码存放在 localStorage（后续迁移到后端）

export const TOPUP_AMOUNTS = [
  { fen: 3000, label: "¥30" },
  { fen: 5000, label: "¥50" },
  { fen: 10000, label: "¥100" },
  { fen: 20000, label: "¥200" },
  { fen: 50000, label: "¥500" },
  { fen: 100000, label: "¥1000" },
];

// 已确认的充值码（管理员后台操作后写入）
// 格式：{ "YX50-ABCD": { amount: 5000, userId: "yx_xxx", confirmedAt: "..." } }
const CONFIRMED_CODES_KEY = "yixu-confirmed-topup-codes";

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

// ── 已确认充值码读写 ──
interface ConfirmedCodeInfo {
  amount: number;      // 金额（分）
  userId: string;      // 对应用户ID
  confirmedAt: string; // 确认时间
}

function loadConfirmedCodes(): Record<string, ConfirmedCodeInfo> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(CONFIRMED_CODES_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function saveConfirmedCodes(codes: Record<string, ConfirmedCodeInfo>): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CONFIRMED_CODES_KEY, JSON.stringify(codes));
  } catch { /* ignore */ }
}

// 生成专属充值码
export function generateTopupCode(userId: string, amountFen: number): string {
  const prefix = "YX";
  const amountTag = amountFen >= 10000 ? `${amountFen / 100}` : `${amountFen / 100}`;
  const random = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${prefix}${amountTag}-${random}`;
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
      return { success: true, message: "无需购买" };
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

  // 兑换充值码（从已确认列表中查）
  const redeemCode = useCallback((code: string): { success: boolean; message: string } => {
    const upperCode = code.trim().toUpperCase();

    if (!upperCode) {
      return { success: false, message: "请输入充值码" };
    }

    // 检查是否已用
    const usedCodes = loadUsedCodes();
    if (usedCodes.includes(upperCode)) {
      return { success: false, message: "此充值码已被使用" };
    }

    // 从已确认码列表中查找
    const confirmedCodes = loadConfirmedCodes();
    const codeInfo = confirmedCodes[upperCode];
    if (!codeInfo) {
      return { success: false, message: "无效充值码，请联系亦须先生获取" };
    }

    // 加余额
    const tx: Transaction = {
      id: generateId(),
      type: "topup",
      amount: codeInfo.amount,
      description: `充值 ¥${(codeInfo.amount / 100).toFixed(2)}`,
      createdAt: new Date().toISOString(),
    };

    const newWallet: WalletData = {
      balance: wallet.balance + codeInfo.amount,
      transactions: [tx, ...wallet.transactions].slice(0, 100),
    };

    // 标记码已用
    usedCodes.push(upperCode);
    saveUsedCodes(usedCodes);
    saveWallet(newWallet);
    setWallet(newWallet);

    return { success: true, message: `充值成功！¥${(codeInfo.amount / 100).toFixed(2)}，当前余额 ${formatAmount(newWallet.balance)}` };
  }, [wallet]);

  // ── 新用戶紅包（註冊獎勵）───
  const WELCOME_BONUS_KEY = "yixu-welcome-bonus-granted";
  const WELCOME_BONUS_AMOUNT = 1230; // ¥12.30

  const grantWelcomeBonus = useCallback((): boolean => {
    // 檢查是否已領過
    if (typeof window === "undefined") return false;
    const granted = localStorage.getItem(WELCOME_BONUS_KEY);
    if (granted) return false;

    const tx: Transaction = {
      id: generateId(),
      type: "topup",
      amount: WELCOME_BONUS_AMOUNT,
      description: "🧧 新学员红包 ¥12.30",
      createdAt: new Date().toISOString(),
    };

    const newWallet: WalletData = {
      balance: wallet.balance + WELCOME_BONUS_AMOUNT,
      transactions: [tx, ...wallet.transactions].slice(0, 100),
    };

    localStorage.setItem(WELCOME_BONUS_KEY, "1");
    saveWallet(newWallet);
    setWallet(newWallet);
    return true;
  }, [wallet]);

  // ── 管理员确认充值码（后台用）───
  const confirmTopupCode = useCallback((code: string, userId: string, amountFen: number): { success: boolean; message: string } => {
    const upperCode = code.trim().toUpperCase();
    const confirmedCodes = loadConfirmedCodes();
    if (confirmedCodes[upperCode]) {
      return { success: false, message: "此码已确认" };
    }
    confirmedCodes[upperCode] = {
      amount: amountFen,
      userId,
      confirmedAt: new Date().toISOString(),
    };
    saveConfirmedCodes(confirmedCodes);
    return { success: true, message: `已确认充值码 ${upperCode}，金额 ¥${(amountFen / 100).toFixed(2)}` };
  }, []);

  return {
    balance: wallet.balance,
    transactions: wallet.transactions,
    unlocked,
    getPrice,
    isUnlocked,
    canAfford,
    purchase,
    redeemCode,
    confirmTopupCode,
    grantWelcomeBonus,
    formatAmount,
  };
}
