// PCL-5 PTSD Checklist for DSM-5
// 20 题 · 0-4 计分 · 总分 0-80
// 时间框架：过去一个月

export interface PCL5Question {
  id: number;
  text: string;
}

export interface PCL5Option {
  score: number;
  label: string;
}

export interface PCL5Result {
  totalScore: number;
  severity: string;
  severityClass: "minimal" | "mild" | "moderate" | "moderate-severe" | "severe";
  advice: string;
}

export const PCL5_QUESTIONS: PCL5Question[] = [
  { id: 1, text: "反复想起令人痛苦的回忆、想法或影像" },
  { id: 2, text: "反复做有关此事件的噩梦" },
  { id: 3, text: "感觉好像事件正在重新发生（像 flashback）" },
  { id: 4, text: "想起该事件时感到非常难过" },
  { id: 5, text: "想起该事件时有强烈的生理反应（心跳加速、出汗等）" },
  { id: 6, text: "尽量避免回忆、谈论或感受与事件相关的事情" },
  { id: 7, text: "避免会让我想起该事件的人、地方或活动" },
  { id: 8, text: "忘记事件中的重要部分" },
  { id: 9, text: "对自己、他人或世界抱有负面看法" },
  { id: 10, text: "责怪自己或他人导致事件的发生" },
  { id: 11, text: "有强烈的负面情绪（恐惧、愤怒、罪恶感等）" },
  { id: 12, text: "对以前感兴趣的活动失去兴趣" },
  { id: 13, text: "感觉与他人疏离或隔绝" },
  { id: 14, text: "难以体验正面情绪（快乐、爱）" },
  { id: 15, text: "易怒、有攻击行为或脾气暴躁" },
  { id: 16, text: "冒险或自我毁灭的行为" },
  { id: 17, text: "过度警觉或警觉性过高" },
  { id: 18, text: "容易受惊吓" },
  { id: 19, text: "难以集中注意力" },
  { id: 20, text: "难以入睡或睡不安稳" },
];

export const PCL5_OPTIONS: PCL5Option[] = [
  { score: 0, label: "完全没有" },
  { score: 1, label: "轻微" },
  { score: 2, label: "中度" },
  { score: 3, label: "相当严重" },
  { score: 4, label: "极度严重" },
];

export const TOTAL_PCL5 = PCL5_QUESTIONS.length;

export function calcPCL5Result(answers: Record<number, number>): PCL5Result {
  const totalScore = PCL5_QUESTIONS.reduce((sum, q) => sum + (answers[q.id] ?? 0), 0);

  let severity: string;
  let severityClass: "minimal" | "mild" | "moderate" | "moderate-severe" | "severe";
  let advice: string;

  if (totalScore <= 15) {
    severity = "极轻微或无";
    severityClass = "minimal";
    advice = "目前无显著PTSD症状，心理状态良好，建议持续保持健康的生活习惯。";
  } else if (totalScore <= 30) {
    severity = "轻度";
    severityClass = "mild";
    advice = "可能有轻度创伤后压力反应。建议留意自身情绪变化，可透过与信任的人倾诉、放松练习等方式调适。";
  } else if (totalScore <= 45) {
    severity = "中度";
    severityClass = "moderate";
    advice = "建议寻求专业心理评估。心理专业人员可以帮助你处理创伤相关症状，避免症状持续恶化。";
  } else if (totalScore <= 60) {
    severity = "中重度";
    severityClass = "moderate-severe";
    advice = "建议接受专业治疗。中重度的PTSD症状已可能影响日常功能，创伤焦点治疗或药物治疗可有效改善。";
  } else {
    severity = "重度";
    severityClass = "severe";
    advice = "强烈建议立即寻求专业协助。重度创伤后压力症状需要精神科医师的评估与治疗，请不要犹豫寻求帮助。";
  }

  return { totalScore, severity, severityClass, advice };
}
