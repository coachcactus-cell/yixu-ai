"use client";

import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { ChevronLeft, Sparkles, Home } from "lucide-react";
import {
  ATTACHMENT_QUESTIONS,
  ATTACHMENT_OPTIONS,
  TOTAL_ATTACHMENT,
  ATTACHMENT_DIMENSIONS,
  calcAttachmentResult,
  type AttachmentResult,
  type AttachmentQuestion,
} from "@/data/attachmentTest";

type Stage = "intro" | "quiz" | "result";

const severityColorMap: Record<string, string> = {
  free: "#27ae60",
  light: "#e67e22",
  bound: "#d4a017",
  "deep-bound": "#c0392b",
  trapped: "#8e1a1a",
};

const severityBgMap: Record<string, string> = {
  free: "#e3f2e8",
  light: "#fff3e0",
  bound: "#fff0e0",
  "deep-bound": "#fce4e4",
  trapped: "#f5d0d0",
};

const severityEmojiMap: Record<string, string> = {
  free: "🪷",
  light: "🪷",
  bound: "🪷",
  "deep-bound": "🪷",
  trapped: "🪷",
};

// ─── 禁止截图 + 复制的 Hook ───
function useQuizProtection() {
  useEffect(() => {
    const preventCopy = (e: Event) => { e.preventDefault(); };
    document.addEventListener("copy", preventCopy);
    document.addEventListener("cut", preventCopy);
    document.addEventListener("contextmenu", preventCopy);
    return () => {
      document.removeEventListener("copy", preventCopy);
      document.removeEventListener("cut", preventCopy);
      document.removeEventListener("contextmenu", preventCopy);
    };
  }, []);
}

// ─── 回首页链接 ───
function HomeLink() {
  return (
    <button
      onClick={() => (window.location.href = "/")}
      className="text-[#c9a84c] text-base flex items-center gap-1 shrink-0"
    >
      <Home size={18} />
      <span>首页</span>
    </button>
  );
}

// ─── 介绍页 ───
function AttachmentIntro({ onStart, onBack }: { onStart: () => void; onBack: () => void }) {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <header className="sticky top-0 z-10 bg-white/95 backdrop-blur-md px-4 py-4 border-b border-[#e8e8e8]">
        <div className="flex items-center gap-2">
          <button onClick={onBack} className="text-[#c9a84c]">
            <ChevronLeft size={24} />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-[#1a1a1a] font-song">心念执念检测</h1>
            <p className="text-base text-[#666666] mt-0.5">唯识学 × Sino-NLP：识别你深层的执着模式</p>
          </div>
          <HomeLink />
        </div>
      </header>

      <div className="flex-1 px-4 pb-32">
        {/* 说明卡 */}
        <div className="mt-6 card">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={20} className="text-[#c9a84c]" />
            <span className="text-lg font-semibold text-[#1a1a1a]">测评须知</span>
          </div>
          <ul className="space-y-2.5 text-base text-[#666666]">
            <li className="flex items-start gap-2">
              <span className="text-[#c9a84c] font-bold mt-0.5">•</span>
              本测评基于唯识学执念理论，结合 Sino-NLP 方法论
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#c9a84c] font-bold mt-0.5">•</span>
              共 {TOTAL_ATTACHMENT} 题，预计需时 5-8 分钟
            </li>
            <li className="flex items-start gap-2 font-bold text-[#1a1a1a]">
              <span className="text-[#c9a84c] font-bold mt-0.5">•</span>
              请看好问题后以第一感觉直觉尽快作答
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#c9a84c] font-bold mt-0.5">•</span>
              没有对错之分
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#c9a84c] font-bold mt-0.5">•</span>
              本测评仅供参考，不作为医学诊断依据
            </li>
          </ul>
        </div>

        {/* 维度预览 */}
        <div className="mt-4 card">
          <h3 className="text-lg font-semibold text-[#1a1a1a] mb-3">五大执念维度</h3>
          <div className="space-y-2">
            {ATTACHMENT_DIMENSIONS.map((dim, i) => (
              <div key={dim.key} className="flex items-center gap-2 text-base text-[#555]">
                <span className="text-[#c9a84c] font-bold">{i + 1}.</span>
                {dim.label}
              </div>
            ))}
          </div>
        </div>

        {/* 金句 */}
        <div className="mt-4 px-2 py-4 text-center">
          <p className="text-base text-[#999999] italic font-song leading-relaxed">
            「执念，不是你不够好，而是你看不见自己在执着什么。」
          </p>
          <p className="text-base text-[#999999] mt-1">—— 先生 留</p>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-[#e8e8e8] bg-white/95 backdrop-blur-md px-4 py-4 pb-[calc(1rem+env(safe-area-inset-bottom,0px))]">
        <button onClick={onStart} className="btn-primary w-full text-lg py-3.5">
          开始测评
        </button>
      </div>
    </div>
  );
}

// ─── 答题页 ───
function AttachmentQuiz({ onComplete }: { onComplete: (answers: Record<number, number>) => void }) {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showTip, setShowTip] = useState(false);
  useQuizProtection();

  const question = ATTACHMENT_QUESTIONS[currentQ];
  const answeredCount = Object.keys(answers).length;
  const progress = Math.round((answeredCount / TOTAL_ATTACHMENT) * 100);
  const allAnswered = answeredCount === TOTAL_ATTACHMENT;
  const currentSelected = answers[question.id];

  // 当前维度信息
  const currentDimLabel = question.dimensionLabel;
  // 维度内进度
  const dimQuestions = ATTACHMENT_QUESTIONS.filter((q) => q.dimension === question.dimension);
  const dimIndex = dimQuestions.findIndex((q) => q.id === question.id);

  const handleSelect = useCallback(
    (score: number) => {
      setAnswers((prev) => ({ ...prev, [question.id]: score }));
      setShowTip(true);
      // 自动跳到下一题（短暂延迟让用户看到亦须小语）
      if (currentQ < TOTAL_ATTACHMENT - 1) {
        setTimeout(() => {
          setCurrentQ((p) => p + 1);
          setShowTip(false);
        }, 1800);
      }
    },
    [currentQ, question.id]
  );

  return (
    <div className="flex flex-col min-h-screen bg-white quiz-protected">
      <nav className="sticky top-0 z-30 border-b border-[#e8e8e8] bg-white/95 backdrop-blur-md px-4 py-3">
        <div className="flex items-center gap-2 mb-2">
          <HomeLink />
          <Sparkles size={20} className="text-[#c9a84c]" />
          <span className="text-base font-semibold text-[#1a1a1a]">心念执念检测</span>
          <span className="ml-auto text-base text-[#666666]">
            {answeredCount}/{TOTAL_ATTACHMENT}
          </span>
        </div>
        <div className="h-1.5 bg-[#f0f0f0] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${progress}%`,
              background: "linear-gradient(90deg, #c9a84c, #d4b85c)",
            }}
          />
        </div>
        <p className="text-xl font-bold text-[#1a1a1a] mt-3 px-1">
          📌 {currentDimLabel} · 第 {dimIndex + 1}/{dimQuestions.length} 题
        </p>
      </nav>

      <section className="flex-1 px-4 pt-6 pb-40">
        <div className="mb-2 text-base text-[#c9a84c] font-semibold">
          第 {currentQ + 1} 题（共 {TOTAL_ATTACHMENT} 题）
        </div>
        <h2 className="text-2xl font-bold text-[#1a1a1a] leading-relaxed mb-8">{question.text}</h2>

        <div className="space-y-3">
          {ATTACHMENT_OPTIONS.map((opt) => {
            const isSelected = currentSelected === opt.score;
            return (
              <button
                key={opt.score}
                onClick={() => handleSelect(opt.score)}
                className="w-full flex items-center gap-3 px-4 py-4 rounded-xl border-2 transition-all active:scale-[0.98]"
                style={{
                  borderColor: isSelected ? "#c9a84c" : "#e8e8e8",
                  backgroundColor: isSelected ? "#fdf8ed" : "#fafaff",
                  boxShadow: isSelected ? "0 2px 8px rgba(201,168,76,0.15)" : "none",
                }}
              >
                <div
                  className="size-10 rounded-full flex items-center justify-center text-base font-bold shrink-0 transition-all"
                  style={{
                    backgroundColor: isSelected ? "#c9a84c" : "#f0f0f0",
                    color: isSelected ? "white" : "#999999",
                  }}
                >
                  {opt.score}
                </div>
                <div className="text-left flex-1">
                  <div className="text-lg font-medium text-[#1a1a1a]">{opt.label}</div>
                  <div className="text-sm text-[#999999]">{opt.score} 分</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* 亦须小语 */}
        {showTip && currentSelected !== undefined && (
          <div className="mt-6 rounded-xl bg-[#fdf8ed] border border-[#c9a84c30] p-4 animate-fadeIn">
            <div className="flex items-center gap-1.5 mb-2">
              <span className="text-[#c9a84c]">💡</span>
              <span className="text-base font-semibold text-[#c9a84c]">亦须小语</span>
            </div>
            <p className="text-base text-[#555] leading-relaxed">{question.tip}</p>
            <p className="text-base text-[#999] mt-2 text-right">—— 先生 留</p>
          </div>
        )}

        {/* 导航 */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={() => {
              setCurrentQ((p) => Math.max(0, p - 1));
              setShowTip(false);
            }}
            disabled={currentQ === 0}
            className="flex-1 py-3 rounded-xl border border-[#e8e8e8] text-base text-[#666] disabled:opacity-30 disabled:cursor-not-allowed"
          >
            上一题
          </button>
          <button
            onClick={() => {
              setCurrentQ((p) => Math.min(TOTAL_ATTACHMENT - 1, p + 1));
              setShowTip(false);
            }}
            disabled={currentQ === TOTAL_ATTACHMENT - 1}
            className="flex-1 py-3 rounded-xl border border-[#e8e8e8] text-base text-[#666] disabled:opacity-30 disabled:cursor-not-allowed"
          >
            下一题
          </button>
        </div>
      </section>

      <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-[#e8e8e8] bg-white/95 backdrop-blur-md px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))]">
        {!allAnswered && (
          <p className="mb-2 text-center text-base text-[#666666]">
            已完成 {answeredCount}/{TOTAL_ATTACHMENT} 题
          </p>
        )}
        <button
          onClick={() => onComplete(answers)}
          disabled={!allAnswered}
          className="w-full rounded-xl py-3.5 text-lg font-semibold transition-all active:scale-[0.98]"
          style={{
            backgroundColor: allAnswered ? "#c9a84c" : "#e8e8e8",
            color: allAnswered ? "white" : "#aaaaaa",
          }}
        >
          查看结果
        </button>
      </div>
    </div>
  );
}

// ─── 结果页 ───
function AttachmentResultView({ result, onRestart }: { result: AttachmentResult; onRestart: () => void }) {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <nav className="sticky top-0 z-30 border-b border-[#e8e8e8] bg-white/95 backdrop-blur-md px-4 py-3">
        <div className="flex items-center gap-2">
          <HomeLink />
          <Sparkles size={20} className="text-[#c9a84c]" />
          <span className="text-base font-semibold text-[#1a1a1a]">心念执念检测结果</span>
        </div>
      </nav>

      <div className="flex-1 px-4 pt-4 pb-20">
        {/* 总分卡 */}
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">{severityEmojiMap[result.severityClass]}</div>
          <h1 className="text-2xl font-bold text-[#1a1a1a] font-song">你的执念等级</h1>
          <p className="text-base text-[#666666] mt-1.5">你的总分</p>
          <p className="text-5xl font-extrabold mt-2" style={{ color: severityColorMap[result.severityClass] }}>
            {result.totalScore}
          </p>
          <p className="text-base text-[#8888aa] mt-1">/ 80</p>
          <div
            className="inline-block mt-3 px-5 py-2 rounded-full text-lg font-bold"
            style={{
              backgroundColor: severityBgMap[result.severityClass],
              color: severityColorMap[result.severityClass],
            }}
          >
            {result.severity}
          </div>
        </div>

        {/* 维度雷达 */}
        <div className="card mb-4">
          <h3 className="text-lg font-semibold text-[#1a1a1a] mb-4">五大维度分析</h3>
          <div className="space-y-4">
            {result.dimensions.map((dim) => {
              const pct = Math.round((dim.score / dim.maxScore) * 100);
              const isHigh = dim.score >= 10;
              return (
                <div key={dim.dimension}>
                  <div className="flex justify-between text-base mb-1">
                    <span className={`font-medium ${isHigh ? "text-[#c0392b]" : "text-[#1a1a1a]"}`}>
                      {dim.dimensionLabel}
                      {isHigh && <span className="text-sm ml-1">⚠️ 需关注</span>}
                    </span>
                    <span className="text-[#666666]">
                      {dim.score}/{dim.maxScore}
                    </span>
                  </div>
                  <div className="h-2.5 bg-[#f0f0f0] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: isHigh ? "#c0392b" : "#c9a84c",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-sm text-[#999] mt-3">* 单一维度 ≥ 10 分建议特别关注</p>
        </div>

        {/* 描述卡 */}
        <div className="rounded-xl p-5 mb-4" style={{ backgroundColor: severityBgMap[result.severityClass] + "80" }}>
          <p className="text-lg text-[#555577] leading-relaxed">{result.advice}</p>
        </div>

        {/* 延伸学习 */}
        <div className="card mb-4">
          <h3 className="text-lg font-semibold text-[#1a1a1a] mb-3">📚 延伸学习</h3>
          <div className="space-y-3">
            {result.extendedLearning.map((item, i) => (
              <div key={i} className="flex items-start gap-2 text-base text-[#555] leading-relaxed">
                <span className="text-[#c9a84c] font-bold mt-0.5">•</span>
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* CTA - Sino-NLP 课程 */}
        <div className="rounded-xl border-2 border-[#c9a84c] bg-gradient-to-br from-[#fdf8ed] to-white p-5 mb-4">
          <div className="text-center mb-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#c9a84c15] mb-2">
              <Sparkles size={16} className="text-[#c9a84c]" />
              <span className="text-base font-semibold text-[#c9a84c]">深入学习</span>
            </div>
            <h3 className="text-xl font-bold text-[#1a1a1a] font-song">Sino-NLP 课程</h3>
          </div>
          <p className="text-base text-[#666] text-center mb-4 leading-relaxed">{result.ctaText}</p>
          <button
            className="w-full rounded-xl py-3.5 text-lg font-semibold text-white transition-all active:scale-[0.98]"
            style={{ background: "linear-gradient(135deg, #c9a84c, #b8943a)" }}
            onClick={() => {
              // 课程链接待补充
              alert("课程详情即将上线，敬请期待！");
            }}
          >
            了解 Sino-NLP 课程
          </button>
        </div>

        <div className="text-center pt-2 pb-2">
          <p className="text-sm text-[#c9a84c] font-song">YIXU HEALING · 亦须疗愈</p>
          <p className="text-xs text-[#999999]">Sino-NLP 中华身心语言学 · 唯识学智慧</p>
        </div>

        <div className="mt-4 mb-2 text-center">
          <button onClick={onRestart} className="text-base text-[#999] underline underline-offset-4">
            重新测评
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── 主组件 ───
export default function AttachmentTestPage({ onBack }: { onBack?: () => void }) {
  const [stage, setStage] = useState<Stage>("intro");
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [result, setResult] = useState<AttachmentResult | null>(null);

  const handleStart = useCallback(() => setStage("quiz"), []);

  const handleComplete = useCallback((ans: Record<number, number>) => {
    setAnswers(ans);
    const res = calcAttachmentResult(ans);
    setResult(res);
    setStage("result");
  }, []);

  const handleRestart = useCallback(() => {
    setAnswers({});
    setResult(null);
    setStage("intro");
  }, []);

  const handleBack = useCallback(() => {
    if (onBack) onBack();
  }, [onBack]);

  return (
    <>
      {stage === "intro" && <AttachmentIntro onStart={handleStart} onBack={handleBack} />}
      {stage === "quiz" && <AttachmentQuiz onComplete={handleComplete} />}
      {stage === "result" && result && <AttachmentResultView result={result} onRestart={handleRestart} />}
    </>
  );
}
