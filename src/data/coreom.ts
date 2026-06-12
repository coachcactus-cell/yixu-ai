// CORE-OM 临床结果评量
// Clinical Outcomes in Routine Evaluation
// 34 题 · 0-4 计分 · 总分 0-136（含12题反向计分）
// 时间框架：过去一星期
// 特殊：第23、33题为自杀风险筛查项

export interface COREOMQuestion {
  id: number;
  text: string;
  isReverse?: boolean; // 反向计分题
  isSuicideRisk?: boolean; // 自杀风险筛查题
}

export interface COREOMOption {
  score: number;
  label: string;
}

export interface COREOMResult {
  totalScore: number;
  severity: string;
  severityClass: "minimal" | "mild" | "moderate" | "moderate-severe" | "severe";
  advice: string;
  hasSuicideRisk: boolean;
  suicideRiskItems: string[];
}

export const COREOM_QUESTIONS: COREOMQuestion[] = [
  { id: 1, text: "我感到非常孤单" },
  { id: 2, text: "我能够紧张起来", isReverse: true },
  { id: 3, text: "我感到有人关心我", isReverse: true },
  { id: 4, text: "我感到吃不消" },
  { id: 5, text: "我完全没有精力" },
  { id: 6, text: "我对自己感到满意", isReverse: true },
  { id: 7, text: "我能处理日常事务", isReverse: true },
  { id: 8, text: "我受到某些困扰" },
  { id: 9, text: "我感到与人很亲近", isReverse: true },
  { id: 10, text: "我睡眠有困难" },
  { id: 11, text: "我感到难堪或羞愧" },
  { id: 12, text: "我宁愿一个人待着" },
  { id: 13, text: "我有想哭的冲动" },
  { id: 14, text: "我对自己的外表感到满意", isReverse: true },
  { id: 15, text: "我觉得好像有什么可怕的事要发生" },
  { id: 16, text: "我对别人发脾气" },
  { id: 17, text: "我能够享受独处", isReverse: true },
  { id: 18, text: "我很难做决定" },
  { id: 19, text: "我与他人的关系很紧张" },
  { id: 20, text: "我能与他人保持联系", isReverse: true },
  { id: 21, text: "我觉得自己是个失败者" },
  { id: 22, text: "我对自己的生活感到满意", isReverse: true },
  { id: 23, text: "我有想伤害自己的念头", isSuicideRisk: true },
  { id: 24, text: "我感到很焦虑或紧张" },
  { id: 25, text: "我对未来充满希望", isReverse: true },
  { id: 26, text: "有人伤害或利用了我" },
  { id: 27, text: "我觉得有人在我背后议论我" },
  { id: 28, text: "我对自己很苛刻" },
  { id: 29, text: "我对事情感兴趣", isReverse: true },
  { id: 30, text: "我感到恐慌" },
  { id: 31, text: "我的朋友让我失望" },
  { id: 32, text: "我觉得自己一文不值" },
  { id: 33, text: "我想到要结束自己的生命", isSuicideRisk: true },
  { id: 34, text: "我能完成我订下的目标", isReverse: true },
];

export const COREOM_OPTIONS: COREOMOption[] = [
  { score: 0, label: "完全没有" },
  { score: 1, label: "仅偶尔" },
  { score: 2, label: "有时" },
  { score: 3, label: "经常" },
  { score: 4, label: "大部分或总是" },
];

export const TOTAL_COREOM = COREOM_QUESTIONS.length;

function reverseScore(score: number): number {
  return 4 - score;
}

export function calcCOREOMResult(answers: Record<number, number>): COREOMResult {
  let totalScore = 0;
  const suicideRiskItems: string[] = [];

  COREOM_QUESTIONS.forEach(q => {
    const raw = answers[q.id] ?? 0;
    if (q.isReverse) {
      totalScore += reverseScore(raw);
    } else {
      totalScore += raw;
    }
    // 自杀风险检查
    if (q.isSuicideRisk && raw >= 1) {
      suicideRiskItems.push(`第${q.id}题（${q.text}）`);
    }
  });

  const hasSuicideRisk = suicideRiskItems.length > 0;

  let severity: string;
  let severityClass: "minimal" | "mild" | "moderate" | "moderate-severe" | "severe";
  let advice: string;

  if (totalScore <= 20) {
    severity = "极轻微或无";
    severityClass = "minimal";
    advice = "目前心理状况良好，情绪稳定，建议继续保持健康的生活作息与人际互动。";
  } else if (totalScore <= 40) {
    severity = "轻度";
    severityClass = "mild";
    advice = "可能有轻微心理困扰，建议留意自身情绪变化，保持与亲友的联系，必要时可考虑寻求心理咨询。";
  } else if (totalScore <= 60) {
    severity = "中度";
    severityClass = "moderate";
    advice = "建议寻求专业心理评估。专业心理人员可以帮助你更深入了解目前困扰的根源，并制定合适的改善计划。";
  } else if (totalScore <= 80) {
    severity = "中重度";
    severityClass = "moderate-severe";
    advice = "建议接受专业心理治疗。中重度的心理困扰已可能影响日常生活，心理治疗可以有效改善症状。";
  } else {
    severity = "重度";
    severityClass = "severe";
    advice = "强烈建议立即寻求专业协助。请尽快联络精神科医师或心理治疗师，接受全面的评估与治疗。";
  }

  return { totalScore, severity, severityClass, advice, hasSuicideRisk, suicideRiskItems };
}
