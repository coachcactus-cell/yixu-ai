export interface IncenseItem {
  name: string;
  desc: string;
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

export const GRID_WIDTH = 10;
export const GRID_HEIGHT = 20;

export const INITIAL_SPEED = 800; // 初始下落間隔 (毫秒)
export const MIN_SPEED = 150; // 最快下落間隔 (毫秒)
export const SPEED_STEP = 50; // 每升一級減少的毫秒數

export const COLOR_PRIMARY = "#c9a84c"; // 金色

export const INCENSE_NAMES: IncenseItem[] = [
  { name: "愈疾香", desc: "心平能愈三千疾，心静能平万事理。古方养生，祛疾扶正。" },
  { name: "灵虚香", desc: "传承汉代道家古方，清灵通窍，安神定志。" },
  { name: "柏子贡香", desc: "复原唐代宫廷贡香配方，古朴庄重，肃穆不燥。" },
  { name: "莲花藏香", desc: "复刻文成公主入藏古方，融合汉藏和香智慧。" },
  { name: "七宝莲花香", desc: "梁武帝御用古方，七味核心香药，气场清净庄严。" },
  { name: "东坡闻思香", desc: "苏东坡专属读书香方，清灵益智，开窍醒神。" },
  { name: "状元伴读香", desc: "益智开窍草本，温和清心，增强记忆专注力。" },
  { name: "祛疫避瘟香", desc: "18味古法防疫草本，辟秽祛浊，家庭常备。" },
  { name: "九龙香", desc: "珍稀上品香药，气场浑厚中正，聚气安神。" },
  { name: "澄明香", desc: "净化祛湿香药配伍，化解浊气，四季通用。" },
];

// 從所有香名中提取出不重複的字池，用於生成下落方塊
export const CHARACTER_POOL: string[] = Array.from(
  new Set(INCENSE_NAMES.map((item) => item.name).join("").split(""))
);
