// ============================================================
// 七脉轮能量测评 — 完整数据引擎
// 基于 chakra-test-seven.vercel.app 的 56 题体系
// 适配亦须AI 品牌色系（金 #c9a84c + 白 + 灰）
// ============================================================

// ─── 脉轮颜色（CSS 变量引用 + hex fallback） ───
export const CHAKRA_COLORS: Record<number, string> = {
  1: "#e74c3c", // 海底轮 — 红
  2: "#e67e22", // 本我轮 — 橙
  3: "#f1c40f", // 太阳神经叢 — 黄
  4: "#2ecc71", // 心轮 — 绿
  5: "#3498db", // 喉轮 — 蓝
  6: "#4a3f8a", // 眉心轮 — 靛
  7: "#9b59b6", // 顶轮 — 紫
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

// ─── 脉轮定義 ───
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
    nameZh: "海底轮",
    nameEn: "Root Chakra",
    sanskrit: "Muladhara",
    color: CHAKRA_COLORS[1],
    gradient: CHAKRA_GRADIENTS[1],
    location: "脊椎底部",
    description: "主管生存、安全感和稳定感。",
    statusOpen: "你感到踏实、稳定和安全，不会不必要地不信任他人。你感到活在当下，與身体连接，有足夠的安全感。",
    statusUnder: "你容易感到恐惧或紧张，觉得自己不受欢迎。建议练习接地冥想（关注脊椎底部），吟诵声音 LAM，通过面对恐惧来开启此脉轮。",
    statusOver: "你可能过于物质和貪婪，可能沉迷于安全感而抗拒改变。建议先不要直接减少海底轮的能量，而是檢查是否有其他脉轮不活躍导致它过度补偿。练习内观冥想（Vipassana）来平衡。",
    demon: "恐惧",
    right: "存在的权利",
    sound: "LAM",
    meditation: "关注生殖器和肛门之间的位置。手印：拇指和食指指尖相触。",
    mantraZh: "拉姆",
  },
  {
    id: 2,
    nameZh: "本我轮",
    nameEn: "Sacral Chakra",
    sanskrit: "Svadhisthana",
    color: CHAKRA_COLORS[2],
    gradient: CHAKRA_GRADIENTS[2],
    location: "下腹部",
    description: "主管情感、创造力、感官享受。",
    statusOpen: "你的情感自由流动並自然表达，不会过度情绪化。你对亲密关是开放，可以充滿热情和活力。",
    statusUnder: "你倾向于僵硬和缺乏情感，或者面无表情。你不很愿意对人敞开心扉。建议练习感受冥想（关注骶骨），吟诵声音 VAM，通过面对内疚感来开启此脉轮。",
    statusOver: "你可能时刻处于情绪化狀态，对他人情感依賴过强，可能过度沉迷于性。建议练习觉察冥想，关注内在感受而非外在刺激，以平衡此脉轮。",
    demon: "内疚",
    right: "感受的权利",
    sound: "VAM",
    meditation: "关注骶骨（下背部）。手印：双手放于腿上，掌心朝上，左手在下，拇指指尖相触。",
    mantraZh: "瓦姆",
  },
  {
    id: 3,
    nameZh: "太阳神经叢",
    nameEn: "Solar Plexus Chakra",
    sanskrit: "Manipura",
    color: CHAKRA_COLORS[3],
    gradient: CHAKRA_GRADIENTS[3],
    location: "胃部上方",
    description: "主管自信、意志力和行动力。",
    statusOpen: "你感到有掌控力，拥有足夠的自尊和自信。",
    statusUnder: "你倾向于被动和猶豫不决，可能膽怯，不容易得到自己想要的東西。建议练习力量冥想（关注脊柱肚臍稍上方），吟诵声音 RAM，通过面对羞恥感来建立自信。",
    statusOver: "你可能专橫甚至具有攻擊性。建议练习慈悲冥想，学会倾听他人，以平衡权力和温柔。",
    demon: "羞恥",
    right: "行动的权利",
    sound: "RAM",
    meditation: "关注脊柱肚臍稍上方的位置。手印：双手置于胃前，手指顶部相接指向外方，交叉拇指。",
    mantraZh: "拉姆",
  },
  {
    id: 4,
    nameZh: "心轮",
    nameEn: "Heart Chakra",
    sanskrit: "Anahata",
    color: CHAKRA_COLORS[4],
    gradient: CHAKRA_GRADIENTS[4],
    location: "胸口中央",
    description: "主管爱、同理心和人际关是。",
    statusOpen: "你富有同情心和友善，努力维护和諧的关是。",
    statusUnder: "你冷漠而疏离，不容易与人建立亲密关是。建议练习慈悲冥想（关注脊柱與心臟齐平处），吟诵声音 YAM，通过面对悲傷来开启心轮。",
    statusOver: "你可能用爱令人窒息，而你的爱可能带有自私的动机。建议学习给予空间和自由，无条件地爱。",
    demon: "悲傷",
    right: "爱與被爱的权利",
    sound: "YAM",
    meditation: "关注脊柱與心臟齐平处。手印：左手放于左膝，右手置于胸骨下方，食指和拇指指尖相触。",
    mantraZh: "雅姆",
  },
  {
    id: 5,
    nameZh: "喉轮",
    nameEn: "Throat Chakra",
    sanskrit: "Vishuddha",
    color: CHAKRA_COLORS[5],
    gradient: CHAKRA_GRADIENTS[5],
    location: "喉咙",
    description: "主管沟通、表达和真实声音。",
    statusOpen: "你能夠自如地表达自己，可能以艺术家的方式表达。",
    statusUnder: "你倾向于不多说话，可能内向害羞。不说真话可能会阻塞此脉轮。建议练习真实表达冥想（关注喉咙底部），吟诵声音 HAM，勇敢说出真话。",
    statusOver: "你可能说话过多，通常为了控制局面和与人保持距离。你可能是个糟糕的倾听者。建议练习静默冥想和深度倾听，学会在表达和倾听之间取得平衡。",
    demon: "謊言",
    right: "说真话和听真话的权利",
    sound: "HAM",
    meditation: "关注喉咙底部。手印：双手手指交叉于内側，拇指在顶部相触並稍微向上拉。",
    mantraZh: "哈姆",
  },
  {
    id: 6,
    nameZh: "眉心轮",
    nameEn: "Third Eye Chakra",
    sanskrit: "Ajna",
    color: CHAKRA_COLORS[6],
    gradient: CHAKRA_GRADIENTS[6],
    location: "两眉之间",
    description: "主管直觉、洞察力和内在智慧。",
    statusOpen: "你拥有良好的直觉，可能倾向于想像和幻想。",
    statusUnder: "你不太善于独立思考，可能倾向于依賴权威。你可能思维僵化，过于依賴信念，甚至容易困惑。建议练习直觉冥想（关注两眉之间稍上方），吟诵声音 OM，通过面对幻觉来开启。",
    statusOver: "你可能过多地生活在幻想世界中，在极端情況下可能出现幻觉。建议练习内观禅修（Zen），关注当下现实，脚踏实地。",
    demon: "幻觉",
    right: "看见的权利",
    sound: "OM",
    meditation: "关注两眉之间稍上方的位置。手印：双手置于胸前，中指伸直在顶部相触，其他手指彎曲。",
    mantraZh: "嗡",
  },
  {
    id: 7,
    nameZh: "顶轮",
    nameEn: "Crown Chakra",
    sanskrit: "Sahasrara",
    color: CHAKRA_COLORS[7],
    gradient: CHAKRA_GRADIENTS[7],
    location: "头顶",
    description: "主管灵性连接、觉知和宇宙意识。",
    statusOpen: "你沒有偏见，对世界和自己有深刻的觉知。",
    statusUnder: "你对灵性不太觉察，可能思维相当僵化。建议练习开放冥想（关注头顶），吟诵声音 NG，通过放下執念来开启顶轮。",
    statusOver: "你可能过度理性化事物，可能沉迷于灵性而忽视身体需求。建议先确保海底轮（根轮）足夠强大，再进行顶轮冥想。平衡灵性與日常生活。",
    demon: "執念",
    right: "认知的权利",
    sound: "NG",
    meditation: "关注头顶。手印：双手置于胃前，无名指向上在顶部相触，交叉其他手指。注意：除非海底轮足夠强大，否则不要进行此冥想。",
    mantraZh: "嗡",
  },
];

// ─── 测评题目（56 题：7 脉轮 × 8 题） ───
export interface Question {
  id: number;
  chakraId: number;
  text: string;
  reverse: boolean; // 反向题：高分 = 脉轮越不活躍
}

export const QUESTIONS: Question[] = [
  // 脉轮 1 - 海底轮 (Q1-Q8)
  { id: 1, chakraId: 1, text: "你容易毫无保留地表达自己的情感？", reverse: false },
  { id: 2, chakraId: 1, text: "你对于自己的本能衝动感到羞恥？", reverse: true },
  { id: 3, chakraId: 1, text: "你是个非常情绪化和热情的人？", reverse: false },
  { id: 4, chakraId: 1, text: "处于團体中，你感觉可以掌控事情的发展？", reverse: false },
  { id: 5, chakraId: 1, text: "你喜好谈论？", reverse: false },
  { id: 6, chakraId: 1, text: "你是否很依賴于某些人或事？", reverse: true },
  { id: 7, chakraId: 1, text: "你很依賴直觉？", reverse: false },
  { id: 8, chakraId: 1, text: "你觉得不论在哪里，都感到很自在？", reverse: false },

  // 脉轮 2 - 本我轮 (Q9-Q16)
  { id: 9, chakraId: 2, text: "你很有自信？", reverse: false },
  { id: 10, chakraId: 2, text: "你容易紧张或倾向避免让你紧张的情況？", reverse: true },
  { id: 11, chakraId: 2, text: "你能自由地表达对性方面的感觉？", reverse: false },
  { id: 12, chakraId: 2, text: "你能觉察你的喜好、厭恶和需求？", reverse: false },
  { id: 13, chakraId: 2, text: "你很难表达自己的感觉，並且很少说话？", reverse: true },
  { id: 14, chakraId: 2, text: "你通常依賴他人的洞察力？", reverse: true },
  { id: 15, chakraId: 2, text: "你擔心自己的財务狀況和家宅的安全？", reverse: true },
  { id: 16, chakraId: 2, text: "你是否通常觉得活在当下，生活十分踏实？", reverse: false },

  // 脉轮 3 - 太阳神经叢 (Q17-Q24)
  { id: 17, chakraId: 3, text: "你能在必要时积极主动？", reverse: false },
  { id: 18, chakraId: 3, text: "你与人們情感联系的需求很强烈？", reverse: false },
  { id: 19, chakraId: 3, text: "你对所有发生在你身上的事情接受性很高？", reverse: false },
  { id: 20, chakraId: 3, text: "你是否倾向于被动，感到寂寞，或與他人刻意保持距离？", reverse: true },
  { id: 21, chakraId: 3, text: "你很有创造性？", reverse: false },
  { id: 22, chakraId: 3, text: "你努力追求人与人之关是的和諧？", reverse: false },
  { id: 23, chakraId: 3, text: "你觉得所謂巧合通常是有意義，而非全是随机发生？", reverse: false },
  { id: 24, chakraId: 3, text: "你很容易回想你的梦境？", reverse: false },

  // 脉轮 4 - 心轮 (Q25-Q32)
  { id: 25, chakraId: 4, text: "你对于未来有愿景或期待？", reverse: false },
  { id: 26, chakraId: 4, text: "你有自律的习慣？", reverse: false },
  { id: 27, chakraId: 4, text: "你对于表达示好的对象很小心，以免受到傷害？", reverse: true },
  { id: 28, chakraId: 4, text: "你倾向把发生在自己身上的事当作学习的过程？", reverse: false },
  { id: 29, chakraId: 4, text: "你对團队合作感到很轻松？", reverse: false },
  { id: 30, chakraId: 4, text: "你容易对于你所想要的事物採取行动？", reverse: false },
  { id: 31, chakraId: 4, text: "你感觉自己是背后一股更大力量的展现？", reverse: false },
  { id: 32, chakraId: 4, text: "你具有热情和同理心，可以容易延伸至自我和他人？", reverse: false },

  // 脉轮 5 - 喉轮 (Q33-Q40)
  { id: 33, chakraId: 5, text: "你总是对他人付出太多以至于忘记了自己？", reverse: true },
  { id: 34, chakraId: 5, text: "你是一个天生就很友善的人？", reverse: false },
  { id: 35, chakraId: 5, text: "你感觉到完整的自觉意识？", reverse: false },
  { id: 36, chakraId: 5, text: "是否经常有一些情況你极力想避免？", reverse: true },
  { id: 37, chakraId: 5, text: "你总是有掌控局勢的强烈慾望？", reverse: true },
  { id: 38, chakraId: 5, text: "你对于亲密关是和肉体慾望，都感觉很自然？", reverse: false },
  { id: 39, chakraId: 5, text: "你透过某种形式或创作（音乐、繪画、唱歌等）表达自己？", reverse: false },
  { id: 40, chakraId: 5, text: "你有困难將事情视觉化？", reverse: true },

  // 脉轮 6 - 眉心轮 (Q41-Q48)
  { id: 41, chakraId: 6, text: "你信賴大多数的人？", reverse: false },
  { id: 42, chakraId: 6, text: "你通常觉得你的精神常駐于肉体？", reverse: false },
  { id: 43, chakraId: 6, text: "你倾向于隐藏情绪，不显露表情？", reverse: true },
  { id: 44, chakraId: 6, text: "你常常有好的、创新的点子？", reverse: false },
  { id: 45, chakraId: 6, text: "你善于用语言、符号和概念进行思考？", reverse: false },
  { id: 46, chakraId: 6, text: "你善于写作以进行沟通？", reverse: false },
  { id: 47, chakraId: 6, text: "你喜爱无拘无束的幻想？", reverse: false },
  { id: 48, chakraId: 6, text: "你在社交上有被动和猶豫不决的倾向？", reverse: true },

  // 脉轮 7 - 顶轮 (Q49-Q56)
  { id: 49, chakraId: 7, text: "如果你和他人有冲突，你会考慮到他人的感受？", reverse: false },
  { id: 50, chakraId: 7, text: "你善于沟通，能倾听也能善于表达？", reverse: false },
  { id: 51, chakraId: 7, text: "你总是很有安全感？", reverse: false },
  { id: 52, chakraId: 7, text: "你对事物有洞见？", reverse: false },
  { id: 53, chakraId: 7, text: "你觉得和身边所有圍繞你的事物或宇宙间有某种联系？", reverse: false },
  { id: 54, chakraId: 7, text: "你行事比較倾向于事前规划而非随遇而安？", reverse: false },
  { id: 55, chakraId: 7, text: "你说话时的声音響亮清楚？", reverse: false },
  { id: 56, chakraId: 7, text: "你喜爱大多数的人？", reverse: false },
];

// ─── 评分系统 ───
export const SCORE_OPTIONS = [-2, -1, 0, 1, 2];
export const SCORE_LABELS = ["完全沒有", "偏弱", "一般", "偏强", "感觉强烈"];
export const MAX_SCORE = 2;
export const QUESTIONS_PER_CHAKRA = 8;
export const TOTAL_QUESTIONS = QUESTIONS.length;

// ─── 计算邏輯 ───

/** 计算某脉轮的得分（含反向题反转），範圍 -16 到 +16 */
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

/** 获取脉轮狀态：不活躍 < -4, 过度活躍 > 8, 中间为适度 */
export function getChakraStatus(score: number, answered: number): ChakraStatus {
  if (answered < QUESTIONS_PER_CHAKRA) return { label: "未完成", level: "mid" };
  if (score < -4) return { label: "不活躍", level: "low" };
  if (score > 8) return { label: "过度活躍", level: "high" };
  return { label: "适度活躍", level: "mid" };
}

export interface ChakraResult {
  chakra: ChakraInfo;
  score: number;
  percentage: number;
  status: ChakraStatus;
}

const MIN_SCORE_TOTAL = QUESTIONS_PER_CHAKRA * (-MAX_SCORE); // -16
const MAX_SCORE_TOTAL = QUESTIONS_PER_CHAKRA * MAX_SCORE;     // +16

/** 计算全部 7 脉轮的结果 */
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

/** 生成脉轮分数的 SVG 雷达图数据（用于视觉化） */
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

/** 付费牆配置 */
export const PAYWALL_CONFIG = {
  price: "¥12.30",
  title: "解锁詳细脉轮分析",
  subtitle: "获得每个脉轮的深入解读、冥想指引與七日平衡计划",
  features: [
    "7 脉轮 × 200+ 字深度解读",
    "对应梵咒冥想音频指引",
    "七日脉轮平衡练习计划",
    "专屬脉轮能量提升技巧",
    "可保存 PDF 报告",
  ],
};
