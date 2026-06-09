// ============================================================
// 七脈輪能量測評 — 完整數據引擎
// 基於 chakra-test-seven.vercel.app 的 56 題體系
// 適配亦須AI 品牌色系（金 #c9a84c + 白 + 灰）
// ============================================================

// ─── 脈輪顏色（CSS 變量引用 + hex fallback） ───
export const CHAKRA_COLORS: Record<number, string> = {
  1: "#e74c3c", // 海底輪 — 紅
  2: "#e67e22", // 本我輪 — 橙
  3: "#f1c40f", // 太陽神經叢 — 黃
  4: "#2ecc71", // 心輪 — 綠
  5: "#3498db", // 喉輪 — 藍
  6: "#4a3f8a", // 眉心輪 — 靛
  7: "#9b59b6", // 頂輪 — 紫
};

export const CHAKRA_GRADIENTS: Record<number, [string, string]> = {
  1: ["#e74c3c", "#c0392b"],
  2: ["#e67e22", "#d35400"],
  3: ["#f1c40f", "#f39c12"],
  4: ["#2ecc71", "#27ae60"],
  5: ["#3498db", "#2980b9"],
  6: ["#4a3f8a", "#2c2458"],
  7: ["#9b59b6", "#8e44ad"],
};

// ─── 脈輪定義 ───
export interface ChakraInfo {
  id: number;
  nameZh: string;
  nameEn: string;
  sanskrit: string;
  color: string;
  gradient: [string, string];
  location: string;
  description: string;
  statusOpen: string;
  statusUnder: string;
  statusOver: string;
  demon: string;
  right: string;
  sound: string;
  meditation: string;
  mantraZh: string; // 梵咒中文音譯
}

export const CHAKRAS: ChakraInfo[] = [
  {
    id: 1,
    nameZh: "海底輪",
    nameEn: "Root Chakra",
    sanskrit: "Muladhara",
    color: CHAKRA_COLORS[1],
    gradient: CHAKRA_GRADIENTS[1],
    location: "脊椎底部",
    description: "主管生存、安全感和穩定感。",
    statusOpen: "你感到踏實、穩定和安全，不會不必要地不信任他人。你感到活在當下，與身體連接，有足夠的安全感。",
    statusUnder: "你容易感到恐懼或緊張，覺得自己不受歡迎。建議練習接地冥想（關注脊椎底部），吟誦聲音 LAM，通過面對恐懼來開啟此脈輪。",
    statusOver: "你可能過於物質和貪婪，可能沉迷於安全感而抗拒改變。建議先不要直接減少海底輪的能量，而是檢查是否有其他脈輪不活躍導致它過度補償。練習內觀冥想（Vipassana）來平衡。",
    demon: "恐懼",
    right: "存在的權利",
    sound: "LAM",
    meditation: "關注生殖器和肛門之間的位置。手印：拇指和食指指尖相觸。",
    mantraZh: "拉姆",
  },
  {
    id: 2,
    nameZh: "本我輪",
    nameEn: "Sacral Chakra",
    sanskrit: "Svadhisthana",
    color: CHAKRA_COLORS[2],
    gradient: CHAKRA_GRADIENTS[2],
    location: "下腹部",
    description: "主管情感、創造力、感官享受。",
    statusOpen: "你的情感自由流動並自然表達，不會過度情緒化。你對親密關係開放，可以充滿熱情和活力。",
    statusUnder: "你傾向於僵硬和缺乏情感，或者面無表情。你不很願意對人敞開心扉。建議練習感受冥想（關注骶骨），吟誦聲音 VAM，通過面對內疚感來開啟此脈輪。",
    statusOver: "你可能時刻處於情緒化狀態，對他人情感依賴過強，可能過度沉迷於性。建議練習覺察冥想，關注內在感受而非外在刺激，以平衡此脈輪。",
    demon: "內疚",
    right: "感受的權利",
    sound: "VAM",
    meditation: "關注骶骨（下背部）。手印：雙手放於腿上，掌心朝上，左手在下，拇指指尖相觸。",
    mantraZh: "瓦姆",
  },
  {
    id: 3,
    nameZh: "太陽神經叢",
    nameEn: "Solar Plexus Chakra",
    sanskrit: "Manipura",
    color: CHAKRA_COLORS[3],
    gradient: CHAKRA_GRADIENTS[3],
    location: "胃部上方",
    description: "主管自信、意志力和行動力。",
    statusOpen: "你感到有掌控力，擁有足夠的自尊和自信。",
    statusUnder: "你傾向於被動和猶豫不決，可能膽怯，不容易得到自己想要的東西。建議練習力量冥想（關注脊柱肚臍稍上方），吟誦聲音 RAM，通過面對羞恥感來建立自信。",
    statusOver: "你可能專橫甚至具有攻擊性。建議練習慈悲冥想，學會傾聽他人，以平衡權力和溫柔。",
    demon: "羞恥",
    right: "行動的權利",
    sound: "RAM",
    meditation: "關注脊柱肚臍稍上方的位置。手印：雙手置於胃前，手指頂部相接指向外方，交叉拇指。",
    mantraZh: "拉姆",
  },
  {
    id: 4,
    nameZh: "心輪",
    nameEn: "Heart Chakra",
    sanskrit: "Anahata",
    color: CHAKRA_COLORS[4],
    gradient: CHAKRA_GRADIENTS[4],
    location: "胸口中央",
    description: "主管愛、同理心和人際關係。",
    statusOpen: "你富有同情心和友善，努力維護和諧的關係。",
    statusUnder: "你冷漠而疏離，不容易與人建立親密關係。建議練習慈悲冥想（關注脊柱與心臟齊平處），吟誦聲音 YAM，通過面對悲傷來開啟心輪。",
    statusOver: "你可能用愛令人窒息，而你的愛可能帶有自私的動機。建議學習給予空間和自由，無條件地愛。",
    demon: "悲傷",
    right: "愛與被愛的權利",
    sound: "YAM",
    meditation: "關注脊柱與心臟齊平處。手印：左手放於左膝，右手置於胸骨下方，食指和拇指指尖相觸。",
    mantraZh: "雅姆",
  },
  {
    id: 5,
    nameZh: "喉輪",
    nameEn: "Throat Chakra",
    sanskrit: "Vishuddha",
    color: CHAKRA_COLORS[5],
    gradient: CHAKRA_GRADIENTS[5],
    location: "喉嚨",
    description: "主管溝通、表達和真實聲音。",
    statusOpen: "你能夠自如地表達自己，可能以藝術家的方式表達。",
    statusUnder: "你傾向於不多說話，可能內向害羞。不說真話可能會阻塞此脈輪。建議練習真實表達冥想（關注喉嚨底部），吟誦聲音 HAM，勇敢說出真話。",
    statusOver: "你可能說話過多，通常為了控制局面和與人保持距離。你可能是個糟糕的傾聽者。建議練習靜默冥想和深度傾聽，學會在表達和傾聽之間取得平衡。",
    demon: "謊言",
    right: "說真話和聽真話的權利",
    sound: "HAM",
    meditation: "關注喉嚨底部。手印：雙手手指交叉於內側，拇指在頂部相觸並稍微向上拉。",
    mantraZh: "哈姆",
  },
  {
    id: 6,
    nameZh: "眉心輪",
    nameEn: "Third Eye Chakra",
    sanskrit: "Ajna",
    color: CHAKRA_COLORS[6],
    gradient: CHAKRA_GRADIENTS[6],
    location: "兩眉之間",
    description: "主管直覺、洞察力和內在智慧。",
    statusOpen: "你擁有良好的直覺，可能傾向於想像和幻想。",
    statusUnder: "你不太善於獨立思考，可能傾向於依賴權威。你可能思維僵化，過於依賴信念，甚至容易困惑。建議練習直覺冥想（關注兩眉之間稍上方），吟誦聲音 OM，通過面對幻覺來開啟。",
    statusOver: "你可能過多地生活在幻想世界中，在極端情況下可能出現幻覺。建議練習內觀禪修（Zen），關注當下現實，腳踏實地。",
    demon: "幻覺",
    right: "看見的權利",
    sound: "OM",
    meditation: "關注兩眉之間稍上方的位置。手印：雙手置於胸前，中指伸直在頂部相觸，其他手指彎曲。",
    mantraZh: "嗡",
  },
  {
    id: 7,
    nameZh: "頂輪",
    nameEn: "Crown Chakra",
    sanskrit: "Sahasrara",
    color: CHAKRA_COLORS[7],
    gradient: CHAKRA_GRADIENTS[7],
    location: "頭頂",
    description: "主管靈性連接、覺知和宇宙意識。",
    statusOpen: "你沒有偏見，對世界和自己有深刻的覺知。",
    statusUnder: "你對靈性不太覺察，可能思維相當僵化。建議練習開放冥想（關注頭頂），吟誦聲音 NG，通過放下執念來開啟頂輪。",
    statusOver: "你可能過度理性化事物，可能沉迷於靈性而忽視身體需求。建議先確保海底輪（根輪）足夠強大，再進行頂輪冥想。平衡靈性與日常生活。",
    demon: "執念",
    right: "認知的權利",
    sound: "NG",
    meditation: "關注頭頂。手印：雙手置於胃前，無名指向上在頂部相觸，交叉其他手指。注意：除非海底輪足夠強大，否則不要進行此冥想。",
    mantraZh: "嗡",
  },
];

// ─── 測評題目（56 題：7 脈輪 × 8 題） ───
export interface Question {
  id: number;
  chakraId: number;
  text: string;
  reverse: boolean; // 反向題：高分 = 脈輪越不活躍
}

export const QUESTIONS: Question[] = [
  // 脈輪 1 - 海底輪 (Q1-Q8)
  { id: 1, chakraId: 1, text: "你容易毫無保留地表達自己的情感？", reverse: false },
  { id: 2, chakraId: 1, text: "你對於自己的本能衝動感到羞恥？", reverse: true },
  { id: 3, chakraId: 1, text: "你是個非常情緒化和熱情的人？", reverse: false },
  { id: 4, chakraId: 1, text: "處於團體中，你感覺可以掌控事情的發展？", reverse: false },
  { id: 5, chakraId: 1, text: "你喜好談論？", reverse: false },
  { id: 6, chakraId: 1, text: "你是否很依賴於某些人或事？", reverse: true },
  { id: 7, chakraId: 1, text: "你很依賴直覺？", reverse: false },
  { id: 8, chakraId: 1, text: "你覺得不論在哪裡，都感到很自在？", reverse: false },

  // 脈輪 2 - 本我輪 (Q9-Q16)
  { id: 9, chakraId: 2, text: "你很有自信？", reverse: false },
  { id: 10, chakraId: 2, text: "你容易緊張或傾向避免讓你緊張的情況？", reverse: true },
  { id: 11, chakraId: 2, text: "你能自由地表達對性方面的感覺？", reverse: false },
  { id: 12, chakraId: 2, text: "你能覺察你的喜好、厭惡和需求？", reverse: false },
  { id: 13, chakraId: 2, text: "你很難表達自己的感覺，並且很少說話？", reverse: true },
  { id: 14, chakraId: 2, text: "你通常依賴他人的洞察力？", reverse: true },
  { id: 15, chakraId: 2, text: "你擔心自己的財務狀況和家宅的安全？", reverse: true },
  { id: 16, chakraId: 2, text: "你是否通常覺得活在當下，生活十分踏實？", reverse: false },

  // 脈輪 3 - 太陽神經叢 (Q17-Q24)
  { id: 17, chakraId: 3, text: "你能在必要時積極主動？", reverse: false },
  { id: 18, chakraId: 3, text: "你與人們情感聯繫的需求很強烈？", reverse: false },
  { id: 19, chakraId: 3, text: "你對所有發生在你身上的事情接受性很高？", reverse: false },
  { id: 20, chakraId: 3, text: "你是否傾向於被動，感到寂寞，或與他人刻意保持距離？", reverse: true },
  { id: 21, chakraId: 3, text: "你很有創造性？", reverse: false },
  { id: 22, chakraId: 3, text: "你努力追求人與人之關係的和諧？", reverse: false },
  { id: 23, chakraId: 3, text: "你覺得所謂巧合通常是有意義，而非全是隨機發生？", reverse: false },
  { id: 24, chakraId: 3, text: "你很容易回想你的夢境？", reverse: false },

  // 脈輪 4 - 心輪 (Q25-Q32)
  { id: 25, chakraId: 4, text: "你對於未來有願景或期待？", reverse: false },
  { id: 26, chakraId: 4, text: "你有自律的習慣？", reverse: false },
  { id: 27, chakraId: 4, text: "你對於表達示好的對象很小心，以免受到傷害？", reverse: true },
  { id: 28, chakraId: 4, text: "你傾向把發生在自己身上的事當作學習的過程？", reverse: false },
  { id: 29, chakraId: 4, text: "你對團隊合作感到很輕鬆？", reverse: false },
  { id: 30, chakraId: 4, text: "你容易對於你所想要的事物採取行動？", reverse: false },
  { id: 31, chakraId: 4, text: "你感覺自己是背後一股更大力量的展現？", reverse: false },
  { id: 32, chakraId: 4, text: "你具有熱情和同理心，可以容易延伸至自我和他人？", reverse: false },

  // 脈輪 5 - 喉輪 (Q33-Q40)
  { id: 33, chakraId: 5, text: "你總是對他人付出太多以至於忘記了自己？", reverse: true },
  { id: 34, chakraId: 5, text: "你是一個天生就很友善的人？", reverse: false },
  { id: 35, chakraId: 5, text: "你感覺到完整的自覺意識？", reverse: false },
  { id: 36, chakraId: 5, text: "是否經常有一些情況你極力想避免？", reverse: true },
  { id: 37, chakraId: 5, text: "你總是有掌控局勢的強烈慾望？", reverse: true },
  { id: 38, chakraId: 5, text: "你對於親密關係和肉體慾望，都感覺很自然？", reverse: false },
  { id: 39, chakraId: 5, text: "你透過某種形式或創作（音樂、繪畫、唱歌等）表達自己？", reverse: false },
  { id: 40, chakraId: 5, text: "你有困難將事情視覺化？", reverse: true },

  // 脈輪 6 - 眉心輪 (Q41-Q48)
  { id: 41, chakraId: 6, text: "你信賴大多數的人？", reverse: false },
  { id: 42, chakraId: 6, text: "你通常覺得你的精神常駐於肉體？", reverse: false },
  { id: 43, chakraId: 6, text: "你傾向於隱藏情緒，不顯露表情？", reverse: true },
  { id: 44, chakraId: 6, text: "你常常有好的、創新的點子？", reverse: false },
  { id: 45, chakraId: 6, text: "你善於用語言、符號和概念進行思考？", reverse: false },
  { id: 46, chakraId: 6, text: "你善於寫作以進行溝通？", reverse: false },
  { id: 47, chakraId: 6, text: "你喜愛無拘無束的幻想？", reverse: false },
  { id: 48, chakraId: 6, text: "你在社交上有被動和猶豫不決的傾向？", reverse: true },

  // 脈輪 7 - 頂輪 (Q49-Q56)
  { id: 49, chakraId: 7, text: "如果你和他人有衝突，你會考慮到他人的感受？", reverse: false },
  { id: 50, chakraId: 7, text: "你善於溝通，能傾聽也能善於表達？", reverse: false },
  { id: 51, chakraId: 7, text: "你總是很有安全感？", reverse: false },
  { id: 52, chakraId: 7, text: "你對事物有洞見？", reverse: false },
  { id: 53, chakraId: 7, text: "你覺得和身邊所有圍繞你的事物或宇宙間有某種聯繫？", reverse: false },
  { id: 54, chakraId: 7, text: "你行事比較傾向於事前規劃而非隨遇而安？", reverse: false },
  { id: 55, chakraId: 7, text: "你說話時的聲音響亮清楚？", reverse: false },
  { id: 56, chakraId: 7, text: "你喜愛大多數的人？", reverse: false },
];

// ─── 評分系統 ───
export const SCORE_OPTIONS = [-2, -1, 0, 1, 2];
export const SCORE_LABELS = ["完全沒有", "偏弱", "一般", "偏強", "感覺強烈"];
export const MAX_SCORE = 2;
export const QUESTIONS_PER_CHAKRA = 8;
export const TOTAL_QUESTIONS = QUESTIONS.length;

// ─── 計算邏輯 ───

/** 計算某脈輪的得分（含反向題反轉），範圍 -16 到 +16 */
export function calcChakraScore(chakraId: number, answers: Record<number, number>): number {
  const qs = QUESTIONS.filter((q) => q.chakraId === chakraId);
  let total = 0;
  for (const q of qs) {
    const raw = answers[q.id];
    if (raw === undefined || raw === null) continue;
    total += q.reverse ? -raw : raw;
  }
  return total;
}

export type ChakraStatusLevel = "low" | "mid" | "high";

export interface ChakraStatus {
  label: string;
  level: ChakraStatusLevel;
}

/** 獲取脈輪狀態：不活躍 < -4, 過度活躍 > 8, 中間為適度 */
export function getChakraStatus(score: number, answered: number): ChakraStatus {
  if (answered < QUESTIONS_PER_CHAKRA) return { label: "未完成", level: "mid" };
  if (score < -4) return { label: "不活躍", level: "low" };
  if (score > 8) return { label: "過度活躍", level: "high" };
  return { label: "適度活躍", level: "mid" };
}

export interface ChakraResult {
  chakra: ChakraInfo;
  score: number;
  percentage: number;
  status: ChakraStatus;
}

const MIN_SCORE_TOTAL = QUESTIONS_PER_CHAKRA * (-MAX_SCORE); // -16
const MAX_SCORE_TOTAL = QUESTIONS_PER_CHAKRA * MAX_SCORE;     // +16

/** 計算全部 7 脈輪的結果 */
export function calcAllResults(answers: Record<number, number>): ChakraResult[] {
  return CHAKRAS.map((chakra) => {
    const qs = QUESTIONS.filter((q) => q.chakraId === chakra.id);
    const answered = qs.filter((q) => answers[q.id] !== undefined && answers[q.id] !== null).length;
    const score = calcChakraScore(chakra.id, answers);
    const percentage = answered > 0
      ? Math.round(((score - MIN_SCORE_TOTAL) / (MAX_SCORE_TOTAL - MIN_SCORE_TOTAL)) * 100)
      : 0;
    const status = getChakraStatus(score, answered);
    return { chakra, score, percentage, status };
  });
}

/** 生成脈輪分數的 SVG 雷達圖數據（用於視覺化） */
export function getRadarPoints(results: ChakraResult[], cx: number, cy: number, r: number) {
  const n = results.length;
  return results.map((res, i) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    const value = res.percentage / 100;
    return {
      x: cx + r * value * Math.cos(angle),
      y: cy + r * value * Math.sin(angle),
      labelX: cx + (r + 18) * Math.cos(angle),
      labelY: cy + (r + 18) * Math.sin(angle),
    };
  });
}

/** 付費牆配置 */
export const PAYWALL_CONFIG = {
  price: "¥9.90",
  title: "解鎖詳細脈輪分析",
  subtitle: "獲得每個脈輪的深入解讀、冥想指引與七日平衡計劃",
  features: [
    "7 脈輪 × 200+ 字深度解讀",
    "對應梵咒冥想音頻指引",
    "七日脈輪平衡練習計劃",
    "專屬脈輪能量提升技巧",
    "可保存 PDF 報告",
  ],
};
