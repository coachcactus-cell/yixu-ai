// GAD-7 广泛性焦虑问卷
// Generalized Anxiety Disorder Assessment (DSM-5)
// 7 题 · 0-3 计分 · 总分 0-21

export interface GAD7Question {
  id: number;
  text: string;
}

export interface GAD7Option {
  score: number;
  label: string;
}

export interface GAD7Result {
  totalScore: number;
  severity: string;
  severityClass: "minimal" | "mild" | "moderate" | "severe";
  advice: string;
}

export const GAD7_QUESTIONS: GAD7Question[] = [
  { id: 1, text: "感到紧张、焦虑或不安" },
  { id: 2, text: "无法停止担心或无法控制担心" },
  { id: 3, text: "过度担心各种事情（「过度」的意思是令你无法集中注意力）" },
  { id: 4, text: "难以放松" },
  { id: 5, text: "坐立不安，无法安静坐着" },
  { id: 6, text: "容易烦躁或生气" },
  { id: 7, text: "感到害怕，好像有可怕的事情即将发生" },
];

export const GAD7_OPTIONS: GAD7Option[] = [
  { score: 0, label: "完全没有" },
  { score: 1, label: "有几天" },
  { score: 2, label: "超过一半天数" },
  { score: 3, label: "几乎每天" },
];

export const TOTAL_GAD7 = GAD7_QUESTIONS.length;

export function calcGAD7Result(answers: Record<number, number>): GAD7Result {
  const totalScore = GAD7_QUESTIONS.reduce((sum, q) => sum + (answers[q.id] ?? 0), 0);

  let severity: string;
  let severityClass: "minimal" | "mild" | "moderate" | "severe";
  let advice: string;

  if (totalScore <= 4) {
    severity = "极轻微或无";
    severityClass = "minimal";
    advice = "目前焦虑水平正常，建议保持规律作息、适量运动，维持良好的生活习惯。";
  } else if (totalScore <= 9) {
    severity = "轻度";
    severityClass = "mild";
    advice = "可能有轻度焦虑倾向，建议观察自身情绪变化，透过放松练习、正念冥想等方式舒缓压力。";
  } else if (totalScore <= 14) {
    severity = "中度";
    severityClass = "moderate";
    advice = "建议寻求专业心理评估，心理咨询师或医师可以帮助你深入了解焦虑来源，并提供适当的治疗方案。";
  } else {
    severity = "重度";
    severityClass = "severe";
    advice = "强烈建议寻求精神科专业评估与治疗。重度焦虑可能会影响日常生活功能，及早接受治疗非常重要。";
  }

  return { totalScore, severity, severityClass, advice };
}
