// 点心问卦 · 核心起卦算法
// 梅花易数先天八卦数起卦法

import { XIANTIAN_REVERSE, GUA_MAP, HEXAGRAMS, LOGICAL_LEVELS } from "@/data/yijing";
import type { Hexagram } from "@/data/yijing";

/* ── 工具函数 ── */

/** 將数字逐位相加（如 1992 → 1+9+9+2=21） */
export function digitSum(num: number): number {
  const digits = Math.abs(num).toString().split("").map(Number);
  return digits.reduce((a, b) => a + b, 0);
}

/** 將数字逐位相加（字符串版，如 "20260609" → 2+0+2+6+0+6+0+9=25） */
export function digitSumStr(str: string): number {
  return str.split("").filter(c => c >= "0" && c <= "9").reduce((a, c) => a + Number(c), 0);
}

/** 除8取余（0→8，即整除时取8） */
export function mod8(n: number): number {
  const r = n % 8;
  return r === 0 ? 8 : r;
}

/** 除6取余（0→6，即整除时取6） */
export function mod6(n: number): number {
  const r = n % 6;
  return r === 0 ? 6 : r;
}

/* ── 季節判定 ── */

export type Season = "春" | "夏" | "秋" | "冬";

export function getSeason(month?: number): Season {
  const m = month ?? new Date().getMonth() + 1;
  if (m >= 3 && m <= 5) return "春";
  if (m >= 6 && m <= 8) return "夏";
  if (m >= 9 && m <= 11) return "秋";
  return "冬";
}

export function getSeasonLabel(season: Season): string {
  const labels: Record<Season, string> = {
    "春": "春季 · 万物萌发",
    "夏": "夏季 · 阳气正盛",
    "秋": "秋季 · 收敛归藏",
    "冬": "冬季 · 潜藏蓄势",
  };
  return labels[season];
}

/* ── 手机号验证 ── */

export function isValidPhone(phone: string): boolean {
  // 接受任何国家手机号，3-15位純数字
  const cleaned = phone.replace(/[\s\-\+]/g, "");
  return /^\d{3,15}$/.test(cleaned);
}

/* ── 起卦结果类型 ── */

export interface DivinationResult {
  hexagram: Hexagram;
  upperGuaName: string;   // 上卦名（如"干"）
  lowerGuaName: string;   // 下卦名（如"坤"）
  dongYao: number;        // 动爻位置（1-6）
  season?: Season;        // 季節（入口一专用）
  topic?: string;         // 諮询课题（入口二专用）
  score?: number;         // 狀態分（入口二专用）
}

/* ── 入口一：手机号季度咨询 ── */

export function divineByPhone(phone: string): DivinationResult | null {
  if (!isValidPhone(phone)) return null;

  const cleaned = phone.replace(/[\s\-\+]/g, "");
  const len = cleaned.length;
  const mid = Math.floor(len / 2);

  // 前半段每位数字相加 → 上卦
  const frontDigits = cleaned.slice(0, mid);
  const upperNum = mod8(digitSumStr(frontDigits));

  // 后半段每位数字相加 → 下卦
  const backDigits = cleaned.slice(mid);
  const lowerNum = mod8(digitSumStr(backDigits));

  // 年月日时分全組逐位相加 → 动爻
  const now = new Date();
  const timeStr = `${now.getFullYear()}${now.getMonth() + 1}${now.getDate()}${now.getHours()}${now.getMinutes()}`;
  const dongYao = mod6(digitSumStr(timeStr));

  // 查卦
  const hexIndex = GUA_MAP[`${upperNum}-${lowerNum}`];
  if (hexIndex === undefined) return null;

  const hexagram = HEXAGRAMS[hexIndex];

  return {
    hexagram,
    upperGuaName: XIANTIAN_REVERSE[upperNum],
    lowerGuaName: XIANTIAN_REVERSE[lowerNum],
    dongYao,
    season: getSeason(),
  };
}

/* ── 入口二：生活咨询（时间+狀態分起卦） ── */

export function divineByTime(score: number, topic: string): DivinationResult {
  const now = new Date();

  // 年月日逐位相加 → 上卦
  const dateStr = `${now.getFullYear()}${now.getMonth() + 1}${now.getDate()}`;
  const upperNum = mod8(digitSumStr(dateStr));

  // 狀態分逐位相加 → 下卦
  const lowerNum = mod8(digitSum(score));

  // 年月日时分秒全組逐位相加 → 动爻
  const fullTimeStr = `${now.getFullYear()}${now.getMonth() + 1}${now.getDate()}${now.getHours()}${now.getMinutes()}${now.getSeconds()}`;
  const dongYao = mod6(digitSumStr(fullTimeStr));

  // 查卦
  const hexIndex = GUA_MAP[`${upperNum}-${lowerNum}`] ?? 0;
  const hexagram = HEXAGRAMS[hexIndex];

  return {
    hexagram,
    upperGuaName: XIANTIAN_REVERSE[upperNum],
    lowerGuaName: XIANTIAN_REVERSE[lowerNum],
    dongYao,
    topic,
    score,
  };
}

/* ── 报告生成 ── */

export interface YaoReport {
  position: number;       // 1-6
  isDongYao: boolean;     // 是否动爻
  yaoText: string;       // 爻辭原文
  level: string;         // 理解层次名
  isYang: boolean;       // 是否阳爻
  lineSymbol: string;    // 爻符号（⚊ / ⚋）
}

export function generateYaoReports(result: DivinationResult): YaoReport[] {
  const { hexagram, dongYao } = result;
  const reports: YaoReport[] = [];

  for (let i = 0; i < 6; i++) {
    const position = i + 1;
    const isYang = hexagram.lines[i] === 1;
    reports.push({
      position,
      isDongYao: position === dongYao,
      yaoText: hexagram.yaoTexts[i],
      level: LOGICAL_LEVELS[i],
      isYang,
      lineSymbol: isYang ? "⚊" : "⚋",
    });
  }

  return reports;
}
