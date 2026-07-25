export interface IncenseItem {
  name: string;
  desc: string;
  unlockLevel: number; // 解鎖關卡
}

export interface Cell {
  char: string;
  color: string;
}

export type Grid = (Cell | null)[][];

export interface Piece {
  x: number;
  y: number;
  char: string;
  color: string;
}

export const GRID_WIDTH = 5;
export const GRID_HEIGHT = 15;

export const INITIAL_SPEED = 1200; // 初始下落間隔 (毫秒)
export const MIN_SPEED = 250; // 最快下落間隔 (毫秒)
export const SPEED_STEP = 30; // 每升一級減少的毫秒數

export const COLOR_PRIMARY = "#c9a84c"; // 金色

export const INCENSE_NAMES: IncenseItem[] = [
  { name: "愈疾香", desc: "心平能愈三千疾，心静能平万事理。古方养生，祛疾扶正。", unlockLevel: 1 },
  { name: "澄明香", desc: "净化祛湿香药配伍，化解浊气，四季通用。", unlockLevel: 1 },
  { name: "九龙香", desc: "珍稀上品香药，气场浑厚中正，聚气安神。", unlockLevel: 2 },
  { name: "灵虚香", desc: "传承汉代道家古方，清灵通窍，安神定志。", unlockLevel: 2 },
  { name: "莲花藏香", desc: "复刻文成公主入藏古方，融合汉藏和香智慧。", unlockLevel: 3 },
  { name: "柏子贡香", desc: "复原唐代宫廷贡香配方，古朴庄重，肃穆不燥。", unlockLevel: 3 },
  { name: "东坡闻思香", desc: "苏东坡专属读书香方，清灵益智，开窍醒神。", unlockLevel: 4 },
  { name: "状元伴读香", desc: "益智开窍草本，温和清心，增强记忆专注力。", unlockLevel: 4 },
  { name: "祛疫避瘟香", desc: "18味古法防疫草本，辟秽祛浊，家庭常备。", unlockLevel: 5 },
  { name: "七宝莲花香", desc: "梁武帝御用古方，七味核心香药，气场清净庄严。", unlockLevel: 5 },
];

// 獲取當前關卡已解鎖的香名
export function getUnlockedIncense(currentLevel: number): IncenseItem[] {
  return INCENSE_NAMES.filter((item) => item.unlockLevel <= currentLevel);
}

// 根據已解鎖香名動態生成字池
export function getCharacterPool(currentLevel: number): string[] {
  const unlocked = getUnlockedIncense(currentLevel);
  return Array.from(new Set(unlocked.map((item) => item.name).join("").split("")));
}
