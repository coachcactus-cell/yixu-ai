"use client";

import { useState, useCallback, useMemo } from "react";
import { ArrowLeft, ArrowRight, RotateCcw } from "lucide-react";
import { enneagramQuestions } from "@/data/enneagram-questions";
import { enneagramTypes } from "@/data/enneagram-types";

type Answer = "no" | "partly" | "yes";
type Phase = "intro" | "quiz" | "result";

const Q_PER_PAGE = 9;

export default function EnneagramPage({ onBack }: { onBack: () => void }) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [page, setPage] = useState(0);
  const [answers, setAnswers] = useState<Record<number, Answer>>({});

  const totalPages = Math.ceil(enneagramQuestions.length / Q_PER_PAGE);
  const pageQs = useMemo(
    () => enneagramQuestions.slice(page * Q_PER_PAGE, (page + 1) * Q_PER_PAGE),
    [page]
  );
  const allAnswered = pageQs.every((q) => answers[q.id]);

  // 計分
  const scores = useMemo(() => {
    const s: Record<number, number> = {};
    for (let i = 1; i <= 9; i++) s[i] = 0;
    enneagramQuestions.forEach((q) => {
      const ans = answers[q.id];
      if (!ans) return;
      const val = ans === "yes" ? 2 : ans === "partly" ? 1 : 0;
      for (const [t, w] of Object.entries(q.types)) {
        s[Number(t)] += val * w;
      }
    });
    return s;
  }, [answers]);

  const result = useMemo(() => {
    let main = 1, mainS = 0, wing = 1, wingS = 0;
    for (let i = 1; i <= 9; i++) {
      if (scores[i] > mainS) { mainS = scores[i]; main = i; }
    }
    for (let i = 1; i <= 9; i++) {
      if (i !== main && scores[i] > wingS) { wingS = scores[i]; wing = i; }
    }
    return { main, wing, mainS, wingS };
  }, [scores]);

  const handleAnswer = useCallback((questionId: number, answer: Answer) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  }, []);

  const handleRestart = useCallback(() => {
    setAnswers({});
    setPage(0);
    setPhase("intro");
  }, []);

  const handleNext = useCallback(() => {
    if (page < totalPages - 1) setPage((p) => p + 1);
    else setPhase("result");
  }, [page, totalPages]);

  const maxScore = Math.max(...Object.values(scores), 1);

  // ── INTRO ──
  if (phase === "intro") {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <header className="sticky top-0 z-10 bg-white/95 backdrop-blur-md px-4 py-3 border-b border-[#e8e8e8]">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-1"><ArrowLeft size={20} className="text-[#666]" /></button>
            <h1 className="text-lg font-bold text-[#1a1a1a] font-song">九型人格测试</h1>
          </div>
        </header>
        <div className="flex-1 flex flex-col items-center justify-center px-6 pb-16">
          <div className="text-6xl mb-6">🔮</div>
          <h2 className="text-2xl font-bold text-[#1a1a1a] font-song mb-3">九型人格</h2>
          <p className="text-sm text-[#666] text-center max-w-xs leading-relaxed mb-2">Enneagram — 探索你内在最深层的性格驱动力</p>
          <p className="text-xs text-[#999] text-center max-w-xs leading-relaxed mb-8">
            {enneagramQuestions.length} 道题目 · 约 10 分钟<br/>
            诚实作答，才能得到准确结果
          </p>
          <div className="w-full max-w-xs space-y-3 mb-6">
            {[
              { emoji: "🧠", text: "不是你「想成为」的人，而是你「真正是」的人" },
              { emoji: "💡", text: "基于 Sino-NLP × 中华经学深度解读" },
              { emoji: "🎯", text: "识别你的核心型号 + Wing 翼型" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#fdf8ed]">
                <span className="text-lg">{item.emoji}</span>
                <p className="text-sm text-[#333]">{item.text}</p>
              </div>
            ))}
          </div>
          <button onClick={() => setPhase("quiz")} className="flex items-center gap-2 px-10 py-3.5 rounded-full bg-gradient-to-r from-[#c9a84c] to-[#b89430] text-white font-bold text-base shadow-lg shadow-[#c9a84c]/25 active:scale-95 transition-transform">
            开始测试 <ArrowRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  // ── QUIZ ──
  if (phase === "quiz") {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <header className="sticky top-0 z-10 bg-white/95 backdrop-blur-md px-4 py-3 border-b border-[#e8e8e8]">
          <div className="flex items-center justify-between">
            <button onClick={onBack} className="p-1"><ArrowLeft size={20} className="text-[#666]" /></button>
            <h1 className="text-base font-bold text-[#1a1a1a]">九型人格测试</h1>
            <span className="text-sm text-[#999]">{page + 1}/{totalPages}</span>
          </div>
          {/* 進度條 */}
          <div className="mt-2 h-1.5 bg-[#eeece8] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#c9a84c] to-[#b89430] transition-all duration-300"
              style={{ width: `${((page + 1) / totalPages) * 100}%` }}
            />
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          <p className="text-xs text-[#999] text-center mb-2">请根据你的真实情况作答，而非你想成为的样子</p>
          {pageQs.map((q) => (
            <div key={q.id} className="card py-3">
              <p className="text-sm text-[#1a1a1a] leading-relaxed mb-3">{q.text}</p>
              <div className="flex gap-2">
                {([
                  { value: "no" as Answer, label: "不是", color: "border-[#e8e8e8] text-[#999]" },
                  { value: "partly" as Answer, label: "部分是", color: "border-[#c9a84c]/40 text-[#c9a84c]" },
                  { value: "yes" as Answer, label: "就是我", color: "border-[#c9a84c] text-white bg-[#c9a84c]" },
                ]).map((opt) => {
                  const selected = answers[q.id] === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => handleAnswer(q.id, opt.value)}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-all active:scale-95 ${
                        selected
                          ? opt.value === "yes"
                            ? "bg-[#c9a84c] border-[#c9a84c] text-white"
                            : opt.value === "partly"
                            ? "bg-[#fdf8ed] border-[#c9a84c] text-[#c9a84c]"
                            : "bg-[#f5f5f5] border-[#ccc] text-[#666]"
                          : "bg-white border-[#e8e8e8] text-[#999]"
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* 底部導航 */}
        <div className="sticky bottom-0 bg-white/95 backdrop-blur-md px-4 py-3 border-t border-[#e8e8e8]">
          <div className="flex gap-3">
            {page > 0 && (
              <button onClick={() => setPage((p) => p - 1)} className="flex-1 py-3 rounded-xl border border-[#e8e8e8] text-sm font-medium text-[#666] active:scale-95 transition-transform">
                上一页
              </button>
            )}
            <button
              onClick={handleNext}
              disabled={!allAnswered}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#c9a84c] to-[#b89430] text-white text-sm font-bold disabled:opacity-40 active:scale-95 transition-transform flex items-center justify-center gap-1"
            >
              {page < totalPages - 1 ? "下一页" : "查看结果"} <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── RESULT ──
  const mainType = enneagramTypes.find((t) => t.id === result.main)!;
  const wingType = enneagramTypes.find((t) => t.id === result.wing)!;

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <header className="sticky top-0 z-10 bg-white/95 backdrop-blur-md px-4 py-3 border-b border-[#e8e8e8]">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-1"><ArrowLeft size={20} className="text-[#666]" /></button>
          <h1 className="text-lg font-bold text-[#1a1a1a] font-song">测试结果</h1>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 pb-8">
        {/* 主型卡片 */}
        <div className="mt-4 rounded-2xl overflow-hidden" style={{ background: "linear-gradient(135deg, #c9a84c, #b89430)" }}>
          <div className="px-5 py-6 text-white">
            <p className="text-sm opacity-80 mb-1">你的核心型号</p>
            <h2 className="text-3xl font-black font-song mb-1">第 {mainType.id} 型 · {mainType.name}</h2>
            <p className="text-sm opacity-80">{mainType.subtitle}</p>
            <div className="mt-4 flex items-center gap-2 text-sm">
              <span className="opacity-80">翼型 Wing:</span>
              <span className="font-bold">第 {wingType.id} 型 · {wingType.name}</span>
            </div>
          </div>
        </div>

        {/* 分數圖 */}
        <div className="mt-4 card">
          <h3 className="font-bold text-[#1a1a1a] mb-3">九型分数分布</h3>
          <div className="space-y-2">
            {enneagramTypes.map((t) => {
              const score = scores[t.id];
              const pct = maxScore > 0 ? (score / maxScore) * 100 : 0;
              const isMain = t.id === result.main;
              const isWing = t.id === result.wing;
              return (
                <div key={t.id} className="flex items-center gap-2">
                  <span className={`w-8 text-xs font-bold ${isMain ? "text-[#c9a84c]" : isWing ? "text-[#8a9bae]" : "text-[#999]"}`}>
                    {t.id}型
                  </span>
                  <div className="flex-1 h-5 bg-[#f5f5f5] rounded-full overflow-hidden relative">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isMain ? "bg-gradient-to-r from-[#c9a84c] to-[#b89430]" : isWing ? "bg-[#8a9bae]" : "bg-[#ddd]"
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className={`w-10 text-xs text-right ${isMain ? "font-bold text-[#c9a84c]" : "text-[#999]"}`}>
                    {score}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 核心恐懼/渴望 */}
        <div className="mt-4 card">
          <h3 className="font-bold text-[#1a1a1a] mb-3">核心驱动力</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <span className="text-base mt-0.5">😰</span>
              <div>
                <p className="text-xs text-[#999]">核心恐惧</p>
                <p className="text-sm text-[#1a1a1a]">{mainType.coreFear}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-base mt-0.5">💫</span>
              <div>
                <p className="text-xs text-[#999]">核心渴望</p>
                <p className="text-sm text-[#1a1a1a]">{mainType.coreDesire}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 性格概述 */}
        <div className="mt-4 card">
          <h3 className="font-bold text-[#1a1a1a] mb-2">性格概述</h3>
          <p className="text-sm text-[#333] leading-relaxed">{mainType.overview}</p>
        </div>

        {/* 優勢/盲點 */}
        <div className="mt-4 card">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-bold text-[#c9a84c] text-sm mb-2">✨ 优势</h4>
              <ul className="space-y-1.5">
                {mainType.strengths.map((s, i) => (
                  <li key={i} className="text-xs text-[#333] leading-relaxed">· {s}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-[#8a9bae] text-sm mb-2">👁 盲点</h4>
              <ul className="space-y-1.5">
                {mainType.blindSpots.map((s, i) => (
                  <li key={i} className="text-xs text-[#333] leading-relaxed">· {s}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Sino-NLP 解讀 */}
        <div className="mt-4 rounded-2xl bg-[#fdf8ed] border border-[#c9a84c]/20 p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-base">🙏</span>
            <h3 className="font-bold text-[#c9a84c] font-song">亦须先生 · Sino-NLP 解读</h3>
          </div>
          <p className="text-sm text-[#333] leading-relaxed">{mainType.sinoxNlp}</p>
        </div>

        {/* 修行方向 */}
        <div className="mt-4 card">
          <h3 className="font-bold text-[#1a1a1a] mb-2">🎯 修行方向</h3>
          <p className="text-sm text-[#333] leading-relaxed">{mainType.growthTip}</p>
        </div>

        {/* 重新測試 */}
        <button onClick={handleRestart} className="mt-6 w-full py-3 rounded-xl border border-[#c9a84c] text-[#c9a84c] font-bold text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform">
          <RotateCcw size={16} /> 重新测试
        </button>

        <p className="mt-4 text-center text-xs text-[#999]">
          YIXU HEALING · 九型人格测试 · Sino-NLP
        </p>
      </div>
    </div>
  );
}
