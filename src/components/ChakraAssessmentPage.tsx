"use client";

import { useState, useMemo, useCallback } from "react";
import { ChevronLeft, Sparkles } from "lucide-react";
import {
  CHAKRAS,
  QUESTIONS,
  SCORE_OPTIONS,
  SCORE_LABELS,
  TOTAL_QUESTIONS,
  calcAllResults,
  type ChakraResult,
} from "@/data/chakra";

// ─── 阶段枚舉 ───
type Stage = "intro" | "quiz" | "result";

// ─── 子組件：介紹页 ───
function ChakraIntro({ onStart, onBack }: { onStart: () => void; onBack: () => void }) {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/95 backdrop-blur-md px-4 py-4 border-b border-[#e8e8e8]">
        <div className="flex items-center gap-2">
          <button onClick={onBack} className="text-[#c9a84c]">
            <ChevronLeft size={22} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-[#1a1a1a] font-song">七脉轮能量测评</h1>
            <p className="text-sm text-[#666666] mt-0.5">基于古印度脉轮体系，56 题深度檢测</p>
          </div>
        </div>
      </header>

      <div className="flex-1 px-4 pb-32">
        {/* 脉轮图示 */}
        <div className="mt-6 flex justify-center">
          <div className="flex flex-col items-center gap-1.5">
            {CHAKRAS.map((c) => (
              <div
                key={c.id}
                className="flex items-center gap-3 px-4 py-2 rounded-full"
                style={{
                  background: `linear-gradient(135deg, ${c.color}12, ${c.color}06)`,
                  border: `1px solid ${c.color}30`,
                }}
              >
                <div
                  className="size-3.5 rounded-full shadow-sm"
                  style={{ background: `linear-gradient(135deg, ${c.gradient[0]}, ${c.gradient[1]})` }}
                />
                <span className="text-sm font-medium text-[#1a1a1a]">{c.nameZh}</span>
                <span className="text-sm text-[#999999]">{c.sanskrit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 说明卡 */}
        <div className="mt-6 card">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={18} className="text-[#c9a84c]" />
            <span className="font-semibold text-[#1a1a1a]">测评须知</span>
          </div>
          <ul className="space-y-2 text-sm text-[#666666]">
            <li className="flex items-start gap-2">
              <span className="text-[#c9a84c] font-bold mt-0.5">•</span>
              共 {TOTAL_QUESTIONS} 题，分 7 个脉轮区块，预计需时 8-12 分鐘
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#c9a84c] font-bold mt-0.5">•</span>
              從「完全沒有」到「感觉强烈」，选择最符合你的程度
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#c9a84c] font-bold mt-0.5">•</span>
              诚实作答才能獲得准确结果，沒有「正确答案」
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#c9a84c] font-bold mt-0.5">•</span>
              免费查看脉轮百分比與狀態，付费解鎖深度解读（¥9.90）
            </li>
          </ul>
        </div>

        {/* 金句 */}
        <div className="mt-4 px-2 py-4 text-center">
          <p className="text-sm text-[#999999] italic font-song leading-relaxed">
            「身体是灵魂的廟宇，脉轮是能量的门戶。」
          </p>
          <p className="text-sm text-[#999999] mt-1">—— 古印度瑜伽智慧</p>
        </div>
      </div>

      {/* 底部按鈕 */}
      <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-[#e8e8e8] bg-white/95 backdrop-blur-md px-4 py-4 pb-[calc(1rem+env(safe-area-inset-bottom,0px))]">
        <button onClick={onStart} className="btn-primary w-full text-base py-3.5">
          开始测评
        </button>
      </div>
    </div>
  );
}

// ─── 子組件：测评题目页 ───
function ChakraQuiz({
  onComplete,
}: {
  onComplete: (results: ChakraResult[]) => void;
}) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [currentChakra, setCurrentChakra] = useState(0); // 当前脉轮索引

  const answeredCount = Object.keys(answers).length;
  const progress = Math.round((answeredCount / TOTAL_QUESTIONS) * 100);

  const handleChange = useCallback((qId: number, score: number) => {
    setAnswers((prev) => ({ ...prev, [qId]: score }));
  }, []);

  const handleSubmit = () => {
    if (answeredCount < TOTAL_QUESTIONS) return;
    const results = calcAllResults(answers);
    sessionStorage.setItem("chakra_answers", JSON.stringify(answers));
    sessionStorage.setItem("chakra_results", JSON.stringify(results));
    onComplete(results);
  };

  const allAnswered = answeredCount === TOTAL_QUESTIONS;

  // 分組展示：当前脉轮的题目
  const currentChakraData = CHAKRAS[currentChakra];
  const currentQuestions = QUESTIONS.filter((q) => q.chakraId === currentChakraData.id);
  const currentAnswered = currentQuestions.filter((q) => answers[q.id] !== undefined).length;
  const currentTotal = currentQuestions.length;

  const goNext = () => {
    if (currentChakra < CHAKRAS.length - 1) {
      setCurrentChakra((prev) => prev + 1);
    }
  };

  const goPrev = () => {
    if (currentChakra > 0) {
      setCurrentChakra((prev) => prev - 1);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* 顶部固定欄 */}
      <nav className="sticky top-0 z-30 border-b border-[#e8e8e8] bg-white/95 backdrop-blur-md px-4 py-3">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles size={18} className="text-[#c9a84c]" />
          <span className="text-sm font-semibold text-[#1a1a1a]">脉轮测评</span>
          <span className="ml-auto text-sm text-[#666666]">
            {answeredCount}/{TOTAL_QUESTIONS}
          </span>
        </div>
        {/* 进度条 */}
        <div className="h-1.5 bg-[#f0f0f0] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${progress}%`,
              background: "linear-gradient(90deg, #c9a84c, #d4b85c)",
            }}
          />
        </div>
        {/* 脉轮导航 */}
        <div className="flex items-center justify-between mt-2.5">
          <button
            onClick={goPrev}
            disabled={currentChakra === 0}
            className="text-xs text-[#c9a84c] disabled:text-[#dddddd] disabled:cursor-not-allowed flex items-center gap-0.5"
          >
            <ChevronLeft size={14} />
            上一脉轮
          </button>
          <div className="flex items-center gap-1.5">
            {CHAKRAS.map((c, idx) => (
              <button
                key={c.id}
                onClick={() => setCurrentChakra(idx)}
                className="size-2 rounded-full transition-all"
                style={{
                  backgroundColor:
                    idx === currentChakra
                      ? c.color
                      : QUESTIONS.filter((q) => q.chakraId === c.id).every((q) => answers[q.id] !== undefined)
                      ? c.color + "60"
                      : "#e0e0e0",
                  transform: idx === currentChakra ? "scale(1.3)" : "scale(1)",
                }}
              />
            ))}
          </div>
          <button
            onClick={goNext}
            disabled={currentChakra === CHAKRAS.length - 1}
            className="text-xs text-[#c9a84c] disabled:text-[#dddddd] disabled:cursor-not-allowed"
          >
            下一脉轮
          </button>
        </div>
      </nav>

      {/* 当前脉轮标题 */}
      <div
        className="mx-4 mt-4 rounded-xl p-4"
        style={{
          background: `linear-gradient(135deg, ${currentChakraData.color}10, ${currentChakraData.color}05)`,
          border: `1px solid ${currentChakraData.color}20`,
        }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="size-3 rounded-full"
            style={{
              background: `linear-gradient(135deg, ${currentChakraData.gradient[0]}, ${currentChakraData.gradient[1]})`,
            }}
          />
          <span className="font-semibold text-[#1a1a1a]">{currentChakraData.nameZh}</span>
          <span className="text-xs text-[#777777]">{currentChakraData.sanskrit}</span>
          <span className="ml-auto text-sm text-[#666666]">
            {currentAnswered}/{currentTotal} 题
          </span>
        </div>
        <p className="text-sm text-[#666666] mt-1.5">{currentChakraData.description}</p>
      </div>

      {/* 题目列表 */}
      <section className="flex-1 px-4 pt-3 pb-40">
        <div className="space-y-2.5">
          {currentQuestions.map((q) => {
            const selected = answers[q.id];
            const isAnswered = selected !== undefined;
            return (
              <div
                key={q.id}
                className="rounded-xl border border-[#e8e8e8] bg-white p-3.5 transition-all"
                style={{
                  borderColor: isAnswered ? "#c9a84c40" : "#e8e8e8",
                  boxShadow: isAnswered ? "0 1px 4px rgba(201,168,76,0.08)" : "none",
                }}
              >
                <p className="mb-3 text-base font-medium leading-relaxed text-[#1a1a1a]">
                  <span className="text-[#c9a84c] font-bold mr-1.5">{q.id}.</span>
                  {q.text}
                </p>
                {/* 5 级评分 */}
                <div className="flex items-center gap-1.5">
                  <span className="shrink-0 text-xs text-[#777777] w-10 text-right">
                    完全沒有
                  </span>
                  <div className="flex flex-1 justify-center gap-2">
                    {SCORE_OPTIONS.map((score, idx) => {
                      const checked = selected === score;
                      return (
                        <button
                          key={score}
                          type="button"
                          onClick={() => handleChange(q.id, score)}
                          className="cursor-pointer transition-all active:scale-90"
                          title={SCORE_LABELS[idx]}
                        >
                          <div
                            className="flex size-8 items-center justify-center rounded-full border-2 transition-all duration-150"
                            style={{
                              borderColor: checked ? "#c9a84c" : "#dddddd",
                              backgroundColor: checked ? "#c9a84c" : "transparent",
                              boxShadow: checked ? "0 1px 3px rgba(201,168,76,0.3)" : "none",
                            }}
                          >
                            {checked ? (
                              <span className="text-[11px] font-bold text-white">
                                {SCORE_LABELS[idx]}
                              </span>
                            ) : (
                              <span className="text-[11px] text-[#999999]">
                                {idx + 1}
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  <span className="shrink-0 text-xs text-[#777777] w-10 text-left">
                    感觉强烈
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 底部固定提交欄 */}
      <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-[#e8e8e8] bg-white/95 backdrop-blur-md px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))]">
        {!allAnswered && (
          <p className="mb-2 text-center text-sm text-[#666666]">
            已完成 {answeredCount}/{TOTAL_QUESTIONS} 题
            {currentChakra < CHAKRAS.length - 1 && currentAnswered === currentTotal && (
              <span className="text-[#c9a84c] ml-1">— 可滑动至下一脉轮 ↑</span>
            )}
          </p>
        )}
        <button
          className="w-full rounded-xl py-3.5 text-base font-semibold transition-all active:scale-[0.98]"
          style={{
            backgroundColor: allAnswered ? "#c9a84c" : "#e8e8e8",
            color: allAnswered ? "white" : "#aaaaaa",
            cursor: allAnswered ? "pointer" : "not-allowed",
          }}
          disabled={!allAnswered}
          onClick={handleSubmit}
        >
          查看结果
        </button>
      </div>
    </div>
  );
}

// ─── 子組件：结果页 ───
function ChakraResultView({
  results,
  onRestart,
}: {
  results: ChakraResult[];
  onRestart: () => void;
}) {
  const [showPaywall, setShowPaywall] = useState(false);
  const [expandedChakra, setExpandedChakra] = useState<number | null>(null);

  const statusColorMap: Record<string, string> = {
    low: "#3498db",
    mid: "#27ae60",
    high: "#e67e22",
  };

  const statusBgMap: Record<string, string> = {
    low: "#3498db15",
    mid: "#27ae6015",
    high: "#e67e2215",
  };

  const testDate = useMemo(
    () =>
      new Date().toLocaleString("zh-CN", {
        timeZone: "Asia/Shanghai",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }),
    []
  );

  if (results.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-4">
        <div className="text-center">
          <p className="mb-4 text-base text-[#666666]">未找到测验结果，请先完成测验。</p>
          <button onClick={onRestart} className="btn-primary">
            前往测验
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <nav className="sticky top-0 z-30 border-b border-[#e8e8e8] bg-white/95 backdrop-blur-md px-4 py-3">
        <div className="flex items-center gap-2">
          <Sparkles size={18} className="text-[#c9a84c]" />
          <span className="text-sm font-semibold text-[#1a1a1a]">测评结果</span>
        </div>
      </nav>

      <div className="flex-1 px-4 pt-4 pb-52">
        {/* 标题区 */}
        <div className="text-center mb-2">
          <h1 className="text-2xl font-bold text-[#1a1a1a] font-song">你的脉轮能量分析</h1>
          <p className="text-sm text-[#666666] mt-1.5">{testDate}</p>
        </div>

        {/* 图例 */}
        <div className="flex items-center justify-center gap-3 mb-5 text-sm">
          <span style={{ color: statusColorMap.low }}>● 不活躍</span>
          <span style={{ color: statusColorMap.mid }}>● 适度活躍</span>
          <span style={{ color: statusColorMap.high }}>● 过度活躍</span>
        </div>

        {/* 7 脉轮结果卡 */}
        <div className="space-y-2.5">
          {results.map((r) => (
            <div
              key={r.chakra.id}
              className="rounded-xl border border-[#e8e8e8] bg-white overflow-hidden"
            >
              <div className="p-3.5">
                {/* 头部 */}
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-2">
                    <div
                      className="size-2.5 rounded-full"
                      style={{
                        background: `linear-gradient(135deg, ${r.chakra.gradient[0]}, ${r.chakra.gradient[1]})`,
                      }}
                    />
                    <span className="text-sm font-semibold text-[#1a1a1a]">{r.chakra.nameZh}</span>
                    <span className="text-xs text-[#999999]">{r.chakra.sanskrit}</span>
                  </div>
                  <span
                    className="rounded-full px-2 py-0.5 text-xs font-medium"
                    style={{
                      backgroundColor: statusBgMap[r.status.level],
                      color: statusColorMap[r.status.level],
                    }}
                  >
                    {r.status.label}
                  </span>
                </div>

                {/* 能量条 */}
                <div className="h-3 w-full rounded-full bg-[#f0f0f0] overflow-hidden mb-1.5">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${r.percentage}%`,
                      background: `linear-gradient(90deg, ${r.chakra.gradient[0]}, ${r.chakra.gradient[1]})`,
                      opacity: 0.85,
                    }}
                  />
                </div>

                <div className="flex items-end justify-between">
                  <p className="text-sm text-[#666666]">{r.chakra.description}</p>
                  <span className="text-sm font-semibold tabular-nums" style={{ color: r.chakra.color }}>
                    {r.percentage}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 付费解鎖区 */}
        <div className="mt-6 rounded-xl border border-[#c9a84c30] bg-gradient-to-br from-[#fdf8ed] to-white p-5">
          <div className="text-center mb-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#c9a84c15] mb-2">
              <Sparkles size={14} className="text-[#c9a84c]" />
              <span className="text-sm font-semibold text-[#c9a84c]">解鎖完整分析</span>
            </div>
            <h3 className="text-lg font-bold text-[#1a1a1a] font-song">獲取深度脉轮解读</h3>
            <p className="text-sm text-[#666666] mt-1">
              了解每个脉轮的深层含義，獲得专屬冥想指引
            </p>
          </div>

          <div className="space-y-2 mb-4">
            {[
              "7 脉轮 × 200+ 字深度解读",
              "对應梵咒冥想音频指引",
              "七日脉轮平衡練习计划",
              "专屬脉轮能量提升技巧",
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-[#555555]">
                <span className="text-[#c9a84c] text-xs">✦</span>
                {f}
              </div>
            ))}
          </div>

          <div className="text-center mb-3">
            <span className="text-2xl font-bold text-[#c9a84c]">¥9.90</span>
            <span className="text-sm text-[#666666] ml-1">/ 永久解鎖</span>
          </div>

          <button
            onClick={() => setShowPaywall(true)}
            className="w-full rounded-xl py-3 text-sm font-semibold text-white transition-all active:scale-[0.98]"
            style={{
              background: "linear-gradient(135deg, #c9a84c, #b8943a)",
            }}
          >
            解鎖完整报告
          </button>
        </div>

        {/* 重新测试 */}
        <div className="mt-4 mb-2 text-center">
          <button
            onClick={onRestart}
            className="text-sm text-[#999999] underline underline-offset-4"
          >
            重新测评
          </button>
        </div>
      </div>

      {/* 付费彈窗 */}
      {showPaywall && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowPaywall(false)} />
          <div className="relative w-full sm:max-w-sm bg-white rounded-t-2xl sm:rounded-2xl p-6 animate-fade-in-up">
            <div className="text-center">
              <Sparkles size={32} className="text-[#c9a84c] mx-auto mb-2" />
              <h2 className="text-xl font-bold text-[#1a1a1a] font-song">解鎖完整报告</h2>
              <p className="text-sm text-[#888888] mt-1 mb-4">
                支付 ¥9.90 即可獲得深度脉轮解读與七日平衡计划
              </p>

              <div className="bg-[#fdf8ed] rounded-xl p-4 mb-4 text-left space-y-2">
                {[
                  "每个脉轮的 200+ 字专业解读",
                  "不活躍/过度活躍的具体改善建议",
                  "对應梵咒冥想音频指引",
                  "七日脉轮平衡練习计划",
                  "可保存为 PDF 永久留存",
                ].map((f, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-[#555555]">
                    <span className="text-[#c9a84c] mt-0.5">✦</span>
                    {f}
                  </div>
                ))}
              </div>

              <div className="mb-4">
                <span className="text-3xl font-bold text-[#c9a84c]">¥9.90</span>
              </div>

              <button
                className="w-full rounded-xl py-3.5 text-base font-semibold text-white mb-2 transition-all active:scale-[0.98]"
                style={{ background: "linear-gradient(135deg, #c9a84c, #b8943a)" }}
                onClick={() => {
                  // TODO: 接入微信支付
                  setShowPaywall(false);
                }}
              >
                立即解鎖
              </button>
              <button
                onClick={() => setShowPaywall(false)}
                className="w-full text-base text-[#666666] py-2"
              >
                稍后再说
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── 主組件：狀態机管理 ───
export default function ChakraAssessmentPage({ onBack }: { onBack?: () => void }) {
  const [stage, setStage] = useState<Stage>("intro");
  const [results, setResults] = useState<ChakraResult[]>([]);

  const handleStart = useCallback(() => {
    setStage("quiz");
  }, []);

  const handleComplete = useCallback((res: ChakraResult[]) => {
    setResults(res);
    setStage("result");
  }, []);

  const handleRestart = useCallback(() => {
    sessionStorage.removeItem("chakra_answers");
    sessionStorage.removeItem("chakra_results");
    setResults([]);
    setStage("intro");
  }, []);

  const handleBack = useCallback(() => {
    if (onBack) {
      onBack();
    }
  }, [onBack]);

  return (
    <>
      {stage === "intro" && <ChakraIntro onStart={handleStart} onBack={handleBack} />}
      {stage === "quiz" && <ChakraQuiz onComplete={handleComplete} />}
      {stage === "result" && <ChakraResultView results={results} onRestart={handleRestart} />}
    </>
  );
}
