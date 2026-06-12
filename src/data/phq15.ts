// PHQ-15 躯体症状量表
// Patient Health Questionnaire-15
// 15 题 · 0-2 计分 · 总分 0-30
// 时间框架：过去四星期
// 特殊：第4、11题为女性适用，男性自动计0分

export interface PHQ15Question {
  id: number;
  text: string;
  femaleOnly?: boolean; // 女性适用题
}

export interface PHQ15Option {
  score: number;
  label: string;
}

export interface PHQ15Result {
  totalScore: number;
  severity: string;
  severityClass: "minimal" | "mild" | "moderate" | "severe";
  advice: string;
}

export const PHQ15_QUESTIONS: PHQ15Question[] = [
  { id: 1, text: "胃痛或消化不良" },
  { id: 2, text: "背痛" },
  { id: 3, text: "手臂、腿或关节疼痛" },
  { id: 4, text: "经期疼痛或问题", femaleOnly: true },
  { id: 5, text: "头痛" },
  { id: 6, text: "胸痛" },
  { id: 7, text: "头晕" },
  { id: 8, text: "昏厥（晕倒）" },
  { id: 9, text: "心悸或心跳加快" },
  { id: 10, text: "呼吸急促" },
  { id: 11, text: "性生活不愉快", femaleOnly: true },
  { id: 12, text: "便秘、腹泻或肠胃不适" },
  { id: 13, text: "恶心、胀气或消化不良" },
  { id: 14, text: "感觉疲倦或精力不足" },
  { id: 15, text: "睡眠问题" },
];

export const PHQ15_OPTIONS: PHQ15Option[] = [
  { score: 0, label: "完全没有困扰" },
  { score: 1, label: "有些困扰" },
  { score: 2, label: "非常困扰" },
];

export const TOTAL_PHQ15 = PHQ15_QUESTIONS.length;

export function calcPHQ15Result(answers: Record<number, number>, gender: "male" | "female"): PHQ15Result {
  // 男性女性适用题自动计0分
  let totalScore = 0;
  PHQ15_QUESTIONS.forEach(q => {
    if (q.femaleOnly && gender === "male") {
      // 不计入
    } else {
      totalScore += answers[q.id] ?? 0;
    }
  });

  let severity: string;
  let severityClass: "minimal" | "mild" | "moderate" | "severe";
  let advice: string;

  if (totalScore <= 4) {
    severity = "极轻微";
    severityClass = "minimal";
    advice = "目前躯体症状极少，身体状况良好，建议保持健康的生活作息与运动习惯。";
  } else if (totalScore <= 9) {
    severity = "轻度";
    severityClass = "mild";
    advice = "可能有轻度躯体化症状，建议观察症状变化，适当放松减压，必要时可咨询家庭医师。";
  } else if (totalScore <= 14) {
    severity = "中度";
    severityClass = "moderate";
    advice = "建议寻求医疗评估，了解症状背后的原因。有些身体不适可能与心理压力相关，身心兼顾的治疗效果更佳。";
  } else {
    severity = "重度";
    severityClass = "severe";
    advice = "建议就医检查，并考虑心理层面的评估。多种躯体症状可能是身心症的表现，综合性的医疗评估对找出根本原因很重要。";
  }

  return { totalScore, severity, severityClass, advice };
}
