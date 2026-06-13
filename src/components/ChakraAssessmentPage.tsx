"use client";

import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { ChevronLeft, Sparkles, Download, Share2, Phone, Home } from "lucide-react";
import html2canvas from "html2canvas";
import {
  CHAKRAS,
  QUESTIONS,
  SCORE_OPTIONS,
  SCORE_LABELS,
  TOTAL_QUESTIONS,
  calcAllResults,
  type ChakraResult,
} from "@/data/chakra";
import { useUser } from "@/hooks/useUser";

// ─── 阶段枚舉 ───
type Stage = "intro" | "quiz" | "result" | "collect-phone";

// ─── 禁止截图+复制 Hook ───
function useQuizProtection() {
  useEffect(() => {
    const prevent = (e: Event) => { e.preventDefault(); };
    document.addEventListener("copy", prevent);
    document.addEventListener("cut", prevent);
    document.addEventListener("contextmenu", prevent);
    return () => {
      document.removeEventListener("copy", prevent);
      document.removeEventListener("cut", prevent);
      document.removeEventListener("contextmenu", prevent);
    };
  }, []);
}

// ─── 回首页链接 ───
function HomeLink() {
  return (
    <button
      onClick={() => window.location.href = "/"}
      className="text-[#c9a84c] text-base flex items-center gap-1 shrink-0"
    >
      <Home size={18} />
      <span>首页</span>
    </button>
  );
}

// ─── 子组件：介绍页 ───
function ChakraIntro({ onStart, onBack }: { onStart: () => void; onBack: () => void }) {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <header className="sticky-header bg-white/95 backdrop-blur-md px-4 py-4 border-b border-[#e8e8e8]">
        <div className="flex items-center gap-2">
          <button onClick={onBack} className="text-[#c9a84c]">
            <ChevronLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-[#1a1a1a] font-song">七脉轮能量测评</h1>
            <p className="text-base text-[#666666] mt-0.5">基于古印度脉轮体系，56 题深度检测</p>
          </div>
          <HomeLink />
        </div>
      </header>

      <div className="flex-1 px-4 pb-32">
        {/* 人体脉轮图 */}
        <div className="mt-6 flex justify-center">
          <img
            src="/images/chakra-body-diagram.png"
            alt="七脉轮人体图 - Chakra Body Diagram"
            className="w-64 h-64 object-contain"
          />
        </div>

        {/* 脉轮中英对照 */}
        <div className="mt-4 grid grid-cols-2 gap-2 px-2">
          {CHAKRAS.map((c) => (
            <div
              key={c.id}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
              style={{ backgroundColor: c.color + "10" }}
            >
              <div
                className="size-3 rounded-full"
                style={{ background: `linear-gradient(135deg, ${c.gradient[0]}, ${c.gradient[1]})` }}
              />
              <span className="text-base font-medium text-[#1a1a1a]">{c.nameZh}</span>
              <span className="text-sm text-[#999999]">{c.sanskrit}</span>
            </div>
          ))}
        </div>

        {/* 说明卡 */}
        <div className="mt-6 card">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={20} className="text-[#c9a84c]" />
            <span className="text-lg font-semibold text-[#1a1a1a]">测评须知</span>
          </div>
          <ul className="space-y-2.5 text-base text-[#666666]">
            <li className="flex items-start gap-2">
              <span className="text-[#c9a84c] font-bold mt-0.5">•</span>
              共 {TOTAL_QUESTIONS} 题，分 7 个脉轮区块，预计需时 8-12 分钟
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#c9a84c] font-bold mt-0.5">•</span>
              从「完全没有」到「感觉强烈」，选择最符合你的程度
            </li>
            <li className="flex items-start gap-2 font-bold text-[#1a1a1a]">
              <span className="text-[#c9a84c] font-bold mt-0.5">•</span>
              请看好问题后以第一感觉直觉尽快作答，即不必深思熟虑，考虑越多，结果越不准确。
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#c9a84c] font-bold mt-0.5">•</span>
              诚实作答才能获得准确结果，没有「正确答案」
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#c9a84c] font-bold mt-0.5">•</span>
              免费查看脉轮百分比与状态，付费解锁深度解读（¥9.90）
            </li>
          </ul>
        </div>

        {/* 金句 */}
        <div className="mt-4 px-2 py-4 text-center">
          <p className="text-base text-[#999999] italic font-song leading-relaxed">
            「身体是灵魂的庙宇，脉轮是能量的门户。」
          </p>
          <p className="text-base text-[#999999] mt-1">—— 古印度瑜伽智慧</p>
        </div>
      </div>

      {/* 底部按钮 */}
      <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-[#e8e8e8] bg-white/95 backdrop-blur-md px-4 py-4 pb-[calc(1rem+env(safe-area-inset-bottom,0px))]">
        <button onClick={onStart} className="btn-primary w-full text-lg py-3.5">
          开始测评
        </button>
      </div>
    </div>
  );
}

// ─── 子组件：测评题目页 ───
function ChakraQuiz({
  onComplete,
}: {
  onComplete: (results: ChakraResult[]) => void;
}) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [currentChakra, setCurrentChakra] = useState(0);
  useQuizProtection();

  const answeredCount = Object.keys(answers).length;
  const progress = Math.round((answeredCount / TOTAL_QUESTIONS) * 100);

  const handleChange = useCallback((qId: number, score: number) => {
    setAnswers((prev) => {
      const updated = { ...prev, [qId]: score };
      // 检查当前脉轮最后一题是否已答，答完自动跳下一脉轮
      const chakraId = QUESTIONS.find((q) => q.id === qId)?.chakraId;
      if (chakraId) {
        const chakraQs = QUESTIONS.filter((q) => q.chakraId === chakraId);
        const allDone = chakraQs.every((q) => updated[q.id] !== undefined);
        if (allDone) {
          const chakraIdx = CHAKRAS.findIndex((c) => c.id === chakraId);
          if (chakraIdx < CHAKRAS.length - 1) {
            setTimeout(() => setCurrentChakra(chakraIdx + 1), 300);
          }
        }
      }
      return updated;
    });
  }, []);

  const handleSubmit = () => {
    if (answeredCount < TOTAL_QUESTIONS) return;
    const results = calcAllResults(answers);
    sessionStorage.setItem("chakra_answers", JSON.stringify(answers));
    sessionStorage.setItem("chakra_results", JSON.stringify(results));
    onComplete(results);
  };

  const allAnswered = answeredCount === TOTAL_QUESTIONS;

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
    <div className="flex flex-col min-h-screen bg-white quiz-protected">
      <nav className="sticky-header z-30 border-b border-[#e8e8e8] bg-white/95 backdrop-blur-md px-4 py-3">
        <div className="flex items-center gap-2 mb-2">
          <HomeLink />
          <Sparkles size={20} className="text-[#c9a84c]" />
          <span className="text-base font-semibold text-[#1a1a1a]">脉轮测评</span>
          <span className="ml-auto text-base text-[#666666]">
            {answeredCount}/{TOTAL_QUESTIONS}
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
        <div className="flex items-center justify-between mt-2.5">
          <button
            onClick={goPrev}
            disabled={currentChakra === 0}
            className="text-sm text-[#c9a84c] disabled:text-[#dddddd] disabled:cursor-not-allowed flex items-center gap-0.5"
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
            className="text-sm text-[#c9a84c] disabled:text-[#dddddd] disabled:cursor-not-allowed"
          >
            下一脉轮
          </button>
        </div>
      </nav>

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
          <span className="text-lg font-semibold text-[#1a1a1a]">{currentChakraData.nameZh}</span>
          <span className="text-base text-[#777777]">{currentChakraData.sanskrit}</span>
          <span className="ml-auto text-base text-[#666666]">
            {currentAnswered}/{currentTotal} 题
          </span>
        </div>
        <p className="text-base text-[#666666] mt-1.5">{currentChakraData.description}</p>
      </div>

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
                <p className="mb-3 text-lg font-medium leading-relaxed text-[#1a1a1a]">
                  <span className="text-[#c9a84c] font-bold mr-1.5">{q.id}.</span>
                  {q.text}
                </p>
                <div className="flex items-center gap-1.5">
                  <span className="shrink-0 text-xs text-[#777777] w-10 text-right">
                    完全没有
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

      <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-[#e8e8e8] bg-white/95 backdrop-blur-md px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))]">
        {!allAnswered && (
          <p className="mb-2 text-center text-base text-[#666666]">
            已完成 {answeredCount}/{TOTAL_QUESTIONS} 题
            {currentChakra < CHAKRAS.length - 1 && currentAnswered === currentTotal && (
              <span className="text-[#c9a84c] ml-1">— 可滑动至下一脉轮 ↑</span>
            )}
          </p>
        )}
        <button
          className="w-full rounded-xl py-3.5 text-lg font-semibold transition-all active:scale-[0.98]"
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

// ─── 手机号收集页（甜头：解锁完整报告）───
function PhoneCollectPage({
  onComplete,
  onSkip,
}: {
  onComplete: (phone: string) => void;
  onSkip: () => void;
}) {
  const [phone, setPhone] = useState("");
  const [wechatId, setWechatId] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    const trimmed = phone.trim();
    if (!trimmed) {
      setError("请输入手机号");
      return;
    }
    // 简单验证：中国大陆手机号 11 位，1 开头
    if (!/^1[3-9]\d{9}$/.test(trimmed)) {
      setError("请输入有效的11位手机号");
      return;
    }
    setError("");
    onComplete(trimmed);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <header className="sticky-header bg-white/95 backdrop-blur-md px-4 py-4 border-b border-[#e8e8e8]">
        <div className="flex items-center gap-2">
          <Sparkles size={18} className="text-[#c9a84c]" />
          <h1 className="text-xl font-bold text-[#1a1a1a] font-song">解锁完整报告</h1>
        </div>
      </header>

      <div className="flex-1 px-4 pt-8">
        {/* 甜头说明 */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#fdf8ed] to-[#fef3d0] flex items-center justify-center mx-auto mb-4">
            <Phone size={32} className="text-[#c9a84c]" />
          </div>
          <h2 className="text-lg font-bold text-[#1a1a1a] mb-2">🎁 先生送你完整报告</h2>
          <p className="text-sm text-[#666666] leading-relaxed">
            输入手机号，即可查看完整脉轮能量报告<br />
            并可随时下载保存
          </p>
        </div>

        {/* 输入区 */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#1a1a1a] mb-1.5">
              📱 手机号 <span className="text-red-400">*</span>
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value.replace(/\D/g, "").slice(0, 11));
                setError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="输入手机号，用于接收报告"
              className="w-full px-4 py-3 rounded-xl border border-[#e8e8e8] text-center text-lg tracking-widest outline-none focus:border-[#c9a84c] transition-colors"
              autoFocus
            />
            {error && (
              <p className="text-xs text-red-500 mt-1.5 text-center">{error}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1a1a1a] mb-1.5">
              💬 微信号（选填）
            </label>
            <input
              type="text"
              value={wechatId}
              onChange={(e) => setWechatId(e.target.value)}
              placeholder="选填，先生可加你交流"
              className="w-full px-4 py-3 rounded-xl border border-[#e8e8e8] text-center text-base outline-none focus:border-[#c9a84c] transition-colors"
            />
            <p className="text-xs text-[#999999] mt-1 text-center">
              留下微信号，先生可亲自为你解读报告
            </p>
          </div>
        </div>

        {/* 提交按钮 */}
        <button
          onClick={handleSubmit}
          className="w-full mt-6 rounded-xl py-3.5 text-base font-semibold text-white transition-all active:scale-[0.98]"
          style={{ background: "linear-gradient(135deg, #c9a84c, #b8943a)" }}
        >
          获取报告
        </button>

        {/* 跳过 */}
        <button
          onClick={onSkip}
          className="w-full mt-3 py-2.5 text-sm text-[#999999]"
        >
          暂不输入，直接查看
        </button>
      </div>

      <div className="px-4 pb-8 text-center">
        <p className="text-xs text-[#cccccc]">
          你的信息仅用于发送报告，不会公开
        </p>
      </div>
    </div>
  );
}

// ─── 子组件：结果页（含下载功能）───
function ChakraResultView({
  results,
  onRestart,
  phone,
  wechatId,
}: {
  results: ChakraResult[];
  onRestart: () => void;
  phone?: string;
  wechatId?: string;
}) {
  const [showPaywall, setShowPaywall] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

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

  // 下载报告为图片
  const handleDownload = useCallback(async () => {
    if (!reportRef.current || isDownloading) return;
    setIsDownloading(true);
    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true,
        allowTaint: true,
        logging: false,
      });
      const dataUrl = canvas.toDataURL("image/png", 0.95);

      // 尝试触发下载
      const link = document.createElement("a");
      link.download = `脉轮报告_${testDate.replace(/\//g, "-")}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Download failed:", err);
    } finally {
      setIsDownloading(false);
    }
  }, [testDate, isDownloading]);

  // 分享报告
  const handleShare = useCallback(async () => {
    if (!reportRef.current) return;
    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true,
        allowTaint: true,
        logging: false,
      });
      const dataUrl = canvas.toDataURL("image/png", 0.95);

      if (navigator.share) {
        const response = await fetch(dataUrl);
        const blob = await response.blob();
        const file = new File([blob], "脉轮报告.png", { type: "image/png" });
        await navigator.share({
          title: "我的脉轮能量报告 - 亦须AI",
          text: "测测你的七脉轮能量状态 👇",
          files: [file],
        });
      }
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;
      console.error("Share failed:", err);
    }
  }, []);

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
      <nav className="sticky-header z-30 border-b border-[#e8e8e8] bg-white/95 backdrop-blur-md px-4 py-3">
        <div className="flex items-center gap-2">
          <Sparkles size={18} className="text-[#c9a84c]" />
          <span className="text-sm font-semibold text-[#1a1a1a]">测评结果</span>
          <div className="ml-auto flex items-center gap-1">
            <button
              onClick={handleShare}
              className="p-2 text-[#999999] active:text-[#c9a84c]"
              title="分享"
            >
              <Share2 size={18} />
            </button>
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="p-2 text-[#999999] active:text-[#c9a84c] disabled:opacity-50"
              title="下载报告"
            >
              <Download size={18} />
            </button>
          </div>
        </div>
      </nav>

      <div className="flex-1 px-4 pt-4 pb-52">
        {/* 报告内容区（用于截图下载） */}
        <div ref={reportRef} className="bg-white">
          {/* 标题区 */}
          <div className="text-center mb-2">
            <h1 className="text-2xl font-bold text-[#1a1a1a] font-song">你的脉轮能量分析</h1>
            <p className="text-sm text-[#666666] mt-1.5">{testDate}</p>
            {phone && (
              <p className="text-xs text-[#999999] mt-0.5">账号：{phone.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2")}</p>
            )}
          </div>

          {/* 图例 */}
          <div className="flex items-center justify-center gap-3 mb-5 text-sm">
            <span style={{ color: statusColorMap.low }}>● 不活跃</span>
            <span style={{ color: statusColorMap.mid }}>● 适度活跃</span>
            <span style={{ color: statusColorMap.high }}>● 过度活跃</span>
          </div>

          {/* 7 脉轮结果卡 */}
          <div className="space-y-2.5">
            {results.map((r) => (
              <div
                key={r.chakra.id}
                className="rounded-xl border border-[#e8e8e8] bg-white overflow-hidden"
              >
                <div className="p-3.5">
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

          {/* 底部品牌 */}
          <div className="text-center pt-4 pb-2">
            <p className="text-xs text-[#c9a84c] font-song">YIXU HEALING · 亦须疗愈</p>
            <p className="text-[10px] text-[#999999]">Sino-NLP 中华身心语言学</p>
          </div>
        </div>

        {/* 付费解锁区 */}
        <div className="mt-4 rounded-xl border border-[#c9a84c30] bg-gradient-to-br from-[#fdf8ed] to-white p-5">
          <div className="text-center mb-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#c9a84c15] mb-2">
              <Sparkles size={14} className="text-[#c9a84c]" />
              <span className="text-sm font-semibold text-[#c9a84c]">解锁完整分析</span>
            </div>
            <h3 className="text-lg font-bold text-[#1a1a1a] font-song">获取深度脉轮解读</h3>
            <p className="text-sm text-[#666666] mt-1">
              了解每个脉轮的深层含义，获得专属冥想指引
            </p>
          </div>

          <div className="space-y-2 mb-4">
            {[
              "7 脉轮 × 200+ 字深度解读",
              "对应梵咒冥想音频指引",
              "七日脉轮平衡练习计划",
              "专属脉轮能量提升技巧",
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-[#555555]">
                <span className="text-[#c9a84c] text-xs">✦</span>
                {f}
              </div>
            ))}
          </div>

          <div className="text-center mb-3">
            <span className="text-2xl font-bold text-[#c9a84c]">¥9.90</span>
            <span className="text-sm text-[#666666] ml-1">/ 永久解锁</span>
          </div>

          <button
            onClick={() => setShowPaywall(true)}
            className="w-full rounded-xl py-3 text-sm font-semibold text-white transition-all active:scale-[0.98]"
            style={{
              background: "linear-gradient(135deg, #c9a84c, #b8943a)",
            }}
          >
            解锁完整报告
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

      {/* 付费弹窗 */}
      {showPaywall && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowPaywall(false)} />
          <div className="relative w-full sm:max-w-sm bg-white rounded-t-2xl sm:rounded-2xl p-6 animate-fade-in-up">
            <div className="text-center">
              <Sparkles size={32} className="text-[#c9a84c] mx-auto mb-2" />
              <h2 className="text-xl font-bold text-[#1a1a1a] font-song">解锁完整报告</h2>
              <p className="text-sm text-[#888888] mt-1 mb-4">
                支付 ¥9.90 即可获得深度脉轮解读与七日平衡计划
              </p>

              <div className="bg-[#fdf8ed] rounded-xl p-4 mb-4 text-left space-y-2">
                {[
                  "每个脉轮的 200+ 字专业解读",
                  "不活跃/过度活跃的具体改善建议",
                  "对应梵咒冥想音频指引",
                  "七日脉轮平衡练习计划",
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
                立即解锁
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

// ─── 主组件：状态机管理 ───
export default function ChakraAssessmentPage({ onBack }: { onBack?: () => void }) {
  const [stage, setStage] = useState<Stage>("intro");
  const [results, setResults] = useState<ChakraResult[]>([]);
  const { loginWithPhone, setWechatId, addChakraRecord, isLoggedIn } = useUser();

  const handleStart = useCallback(() => {
    setStage("quiz");
  }, []);

  const handleComplete = useCallback((res: ChakraResult[]) => {
    setResults(res);
    // 已登录用户直接看结果；未登录则引导手机号收集
    if (isLoggedIn) {
      setStage("result");
      // 保存到历史
      const recordResults = res.map((r) => ({
        nameZh: r.chakra.nameZh,
        percentage: r.percentage,
        statusLabel: r.status.label,
        color: r.chakra.color,
      }));
      addChakraRecord({
        date: new Date().toLocaleString("zh-CN", {
          timeZone: "Asia/Shanghai",
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        }),
        results: recordResults,
      });
    } else {
      setStage("collect-phone");
    }
  }, [isLoggedIn, addChakraRecord]);

  const handlePhoneComplete = useCallback((phone: string) => {
    loginWithPhone(phone);
    setStage("result");
    // 保存到历史
    const recordResults = results.map((r) => ({
      nameZh: r.chakra.nameZh,
      percentage: r.percentage,
      statusLabel: r.status.label,
      color: r.chakra.color,
    }));
    addChakraRecord({
      date: new Date().toLocaleString("zh-CN", {
        timeZone: "Asia/Shanghai",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }),
      results: recordResults,
    });
  }, [loginWithPhone, results, addChakraRecord]);

  const handlePhoneSkip = useCallback(() => {
    setStage("result");
    // 即使跳过也保存匿名记录
    const recordResults = results.map((r) => ({
      nameZh: r.chakra.nameZh,
      percentage: r.percentage,
      statusLabel: r.status.label,
      color: r.chakra.color,
    }));
    addChakraRecord({
      date: new Date().toLocaleString("zh-CN", {
        timeZone: "Asia/Shanghai",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }),
      results: recordResults,
    });
  }, [results, addChakraRecord]);

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
      {stage === "collect-phone" && (
        <PhoneCollectPage onComplete={handlePhoneComplete} onSkip={handlePhoneSkip} />
      )}
      {stage === "result" && (
        <ChakraResultView results={results} onRestart={handleRestart} />
      )}
    </>
  );
}
