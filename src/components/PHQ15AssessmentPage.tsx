"use client";

import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { ChevronLeft, Sparkles, Download, Share2, Phone, Home } from "lucide-react";
import html2canvas from "html2canvas";
import { PHQ15_QUESTIONS, PHQ15_OPTIONS, TOTAL_PHQ15, calcPHQ15Result, type PHQ15Result } from "@/data/phq15";
import { useUser } from "@/hooks/useUser";

type Stage = "intro" | "quiz" | "result" | "collect-phone";

const severityColorMap: Record<string, string> = {
  minimal: "#27ae60",
  mild: "#e67e22",
  moderate: "#d4a017",
  severe: "#c0392b",
};

const severityBgMap: Record<string, string> = {
  minimal: "#e3f2e8",
  mild: "#fff3e0",
  moderate: "#fff0e0",
  severe: "#fce4e4",
};

const PRIMARY_COLOR = "#7caacc";

// ─── 禁止截图 + 复制的 Hook ───
function useQuizProtection() {
  useEffect(() => {
    const preventCopy = (e: Event) => { e.preventDefault(); };
    const preventScreenshot = () => {
      document.body.style.filter = "none";
    };

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
      onClick={() => window.location.href = "/"}
      className="text-[#7caacc] text-base flex items-center gap-1 shrink-0"
    >
      <Home size={18} />
      <span>首页</span>
    </button>
  );
}

// ─── 性别选择组件 ───
function GenderSelector({ value, onChange }: { value: "male" | "female" | null; onChange: (g: "male" | "female") => void }) {
  return (
    <div className="flex gap-3">
      <button
        onClick={() => onChange("male")}
        className="flex-1 py-3.5 rounded-xl border-2 text-lg font-medium transition-all active:scale-[0.98]"
        style={{
          borderColor: value === "male" ? PRIMARY_COLOR : "#e8e8e8",
          backgroundColor: value === "male" ? "#e8f2f8" : "#fafaff",
          color: value === "male" ? PRIMARY_COLOR : "#666666",
        }}
      >
        👨 男性
      </button>
      <button
        onClick={() => onChange("female")}
        className="flex-1 py-3.5 rounded-xl border-2 text-lg font-medium transition-all active:scale-[0.98]"
        style={{
          borderColor: value === "female" ? PRIMARY_COLOR : "#e8e8e8",
          backgroundColor: value === "female" ? "#e8f2f8" : "#fafaff",
          color: value === "female" ? PRIMARY_COLOR : "#666666",
        }}
      >
        👩 女性
      </button>
    </div>
  );
}

// ─── 介绍页 ───
function PHQ15Intro({ onStart, onBack }: { onStart: (gender: "male" | "female") => void; onBack: () => void }) {
  const [gender, setGender] = useState<"male" | "female" | null>(null);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <header className="sticky-header bg-white/95 backdrop-blur-md px-4 py-4 border-b border-[#e8e8e8]">
        <div className="flex items-center gap-2">
          <button onClick={onBack} className="text-[#7caacc]">
            <ChevronLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-[#1a1a1a] font-song">PHQ-15 躯体症状量表</h1>
            <p className="text-base text-[#666666] mt-0.5">Patient Health Questionnaire-15</p>
          </div>
          <HomeLink />
        </div>
      </header>

      <div className="flex-1 px-4 pb-32">
        {/* 说明卡 */}
        <div className="mt-6 card">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={20} className="text-[#7caacc]" />
            <span className="text-lg font-semibold text-[#1a1a1a]">测评须知</span>
          </div>
          <ul className="space-y-2.5 text-base text-[#666666]">
            <li className="flex items-start gap-2">
              <span className="text-[#7caacc] font-bold mt-0.5">•</span>
              共 {TOTAL_PHQ15} 题，预计需时 2-3 分钟
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#7caacc] font-bold mt-0.5">•</span>
              回顾过去四个星期的状况，选择最符合的选项
            </li>
            <li className="flex items-start gap-2 font-bold text-[#1a1a1a]">
              <span className="text-[#7caacc] font-bold mt-0.5">•</span>
              请看好问题后以第一感觉直觉尽快作答，即不必深思熟虑，考虑越多，结果越不准确。
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#7caacc] font-bold mt-0.5">•</span>
              本测评仅供参考，不作为医学诊断依据
            </li>
          </ul>
        </div>

        {/* 性别选择 */}
        <div className="mt-4 card">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">👤</span>
            <span className="text-lg font-semibold text-[#1a1a1a]">请选择你的性别</span>
            <span className="text-base text-red-400">*</span>
          </div>
          <p className="text-base text-[#666666] mb-3">部分题目仅适用于女性，男性将自动跳过并计0分</p>
          <GenderSelector value={gender} onChange={setGender} />
        </div>

        {/* 金句 */}
        <div className="mt-4 px-2 py-4 text-center">
          <p className="text-base text-[#999999] italic font-song leading-relaxed">
            「身体从不说谎，它在替你承受。」
          </p>
          <p className="text-base text-[#999999] mt-1">—— 亦须先生</p>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-[#e8e8e8] bg-white/95 backdrop-blur-md px-4 py-4 pb-[calc(1rem+env(safe-area-inset-bottom,0px))]">
        <button
          onClick={() => gender && onStart(gender)}
          disabled={!gender}
          className="w-full rounded-xl py-3.5 text-lg font-semibold transition-all active:scale-[0.98]"
          style={{
            background: gender ? `linear-gradient(135deg, ${PRIMARY_COLOR}, #6a99bb)` : "#e8e8e8",
            color: gender ? "white" : "#aaaaaa",
          }}
        >
          开始测评
        </button>
      </div>
    </div>
  );
}

// ─── 答题页 ───
function PHQ15Quiz({ onComplete, gender }: { onComplete: (answers: Record<number, number>) => void; gender: "male" | "female" }) {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [selectedGender, setSelectedGender] = useState<"male" | "female">(gender);
  useQuizProtection();

  const effectiveQuestions = PHQ15_QUESTIONS.map(q => ({
    ...q,
    disabled: q.femaleOnly && selectedGender === "male",
  }));

  const answeredCount = Object.entries(answers).filter(([id]) => {
    const q = PHQ15_QUESTIONS.find(qq => qq.id === Number(id));
    return q && !(q.femaleOnly && selectedGender === "male");
  }).length;

  const totalActiveQuestions = PHQ15_QUESTIONS.filter(q => !(q.femaleOnly && selectedGender === "male")).length;
  const progress = Math.round((answeredCount / totalActiveQuestions) * 100);

  const handleSelect = useCallback((score: number) => {
    const q = effectiveQuestions[currentQ];
    if (q.disabled) return;
    setAnswers((prev) => ({ ...prev, [q.id]: score }));
    if (currentQ < TOTAL_PHQ15 - 1) {
      setTimeout(() => setCurrentQ((p) => p + 1), 200);
    }
  }, [currentQ, effectiveQuestions]);

  const allAnswered = answeredCount === totalActiveQuestions;
  const currentQuestion = effectiveQuestions[currentQ];
  const currentSelected = answers[currentQuestion.id];

  // 切换性别时，清除女性专用题的答案（若切换为男性）
  useEffect(() => {
    if (selectedGender === "male") {
      setAnswers((prev) => {
        const next = { ...prev };
        PHQ15_QUESTIONS.filter(q => q.femaleOnly).forEach(q => {
          delete next[q.id];
        });
        return next;
      });
    }
  }, [selectedGender]);

  return (
    <div className="flex flex-col min-h-screen bg-white quiz-protected">
      <nav className="sticky-header z-30 border-b border-[#e8e8e8] bg-white/95 backdrop-blur-md px-4 py-3">
        <div className="flex items-center gap-2 mb-2">
          <HomeLink />
          <Sparkles size={20} className="text-[#7caacc]" />
          <span className="text-base font-semibold text-[#1a1a1a]">PHQ-15 躯体症状测评</span>
          <span className="ml-auto text-base text-[#666666]">
            {answeredCount}/{totalActiveQuestions}
          </span>
        </div>
        <div className="h-1.5 bg-[#f0f0f0] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${progress}%`,
              background: `linear-gradient(90deg, ${PRIMARY_COLOR}, #6a99bb)`,
            }}
          />
        </div>
        {/* 性别选择 */}
        <div className="mt-2">
          <GenderSelector value={selectedGender} onChange={setSelectedGender} />
        </div>
        <p className="text-xl font-bold text-[#1a1a1a] mt-3 px-1">
          📌 过去四个星期，你被以下身体不适困扰的程度如何？
        </p>
      </nav>

      <section className="flex-1 px-4 pt-6 pb-40">
        <div className="mb-2 text-base text-[#7caacc] font-semibold">
          第 {currentQ + 1} 题（共 {TOTAL_PHQ15} 题）
          {currentQuestion.disabled && (
            <span className="ml-2 text-sm text-[#999999] font-normal">（女性适用题）</span>
          )}
        </div>
        <h2
          className="text-2xl font-bold text-[#1a1a1a] leading-relaxed mb-8"
          style={currentQuestion.disabled ? { color: "#cccccc" } : undefined}
        >
          {currentQuestion.text}
          {currentQuestion.femaleOnly && !currentQuestion.disabled && (
            <span className="ml-2 text-sm font-normal text-[#7caacc]">👩 女性适用</span>
          )}
        </h2>

        {currentQuestion.disabled ? (
          <div className="rounded-xl border-2 border-[#e8e8e8] bg-[#f8f8f8] p-6 text-center">
            <p className="text-lg text-[#999999]">此题为女性适用题，男性自动计0分</p>
            <button
              onClick={() => {
                if (currentQ < TOTAL_PHQ15 - 1) {
                  setCurrentQ((p) => p + 1);
                }
              }}
              className="mt-3 px-6 py-2 rounded-xl border border-[#e8e8e8] text-base text-[#666]"
            >
              跳过此题 →
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {PHQ15_OPTIONS.map((opt) => {
              const isSelected = currentSelected === opt.score;
              return (
                <button
                  key={opt.score}
                  onClick={() => handleSelect(opt.score)}
                  className="w-full flex items-center gap-3 px-4 py-4 rounded-xl border-2 transition-all active:scale-[0.98]"
                  style={{
                    borderColor: isSelected ? PRIMARY_COLOR : "#e8e8e8",
                    backgroundColor: isSelected ? "#e8f2f8" : "#fafaff",
                    boxShadow: isSelected ? `0 2px 8px rgba(124,170,204,0.15)` : "none",
                  }}
                >
                  <div
                    className="size-10 rounded-full flex items-center justify-center text-base font-bold shrink-0 transition-all"
                    style={{
                      backgroundColor: isSelected ? PRIMARY_COLOR : "#f0f0f0",
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
        )}

        {/* 导航 */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={() => setCurrentQ((p) => Math.max(0, p - 1))}
            disabled={currentQ === 0}
            className="flex-1 py-3 rounded-xl border border-[#e8e8e8] text-base text-[#666] disabled:opacity-30 disabled:cursor-not-allowed"
          >
            上一题
          </button>
          <button
            onClick={() => setCurrentQ((p) => Math.min(TOTAL_PHQ15 - 1, p + 1))}
            disabled={currentQ === TOTAL_PHQ15 - 1}
            className="flex-1 py-3 rounded-xl border border-[#e8e8e8] text-base text-[#666] disabled:opacity-30 disabled:cursor-not-allowed"
          >
            下一题
          </button>
        </div>
      </section>

      <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-[#e8e8e8] bg-white/95 backdrop-blur-md px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))]">
        {!allAnswered && (
          <p className="mb-2 text-center text-base text-[#666666]">
            已完成 {answeredCount}/{totalActiveQuestions} 题
          </p>
        )}
        <button
          onClick={() => onComplete(answers)}
          disabled={!allAnswered}
          className="w-full rounded-xl py-3.5 text-lg font-semibold transition-all active:scale-[0.98]"
          style={{
            backgroundColor: allAnswered ? PRIMARY_COLOR : "#e8e8e8",
            color: allAnswered ? "white" : "#aaaaaa",
          }}
        >
          查看结果
        </button>
      </div>
    </div>
  );
}

// ─── 手机号收集页 ───
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
    if (!trimmed) { setError("请输入手机号"); return; }
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
          <HomeLink />
          <Sparkles size={20} className="text-[#7caacc]" />
          <h1 className="text-2xl font-bold text-[#1a1a1a] font-song">解锁完整报告</h1>
        </div>
      </header>

      <div className="flex-1 px-4 pt-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#e8f2f8] to-[#d0e4f0] flex items-center justify-center mx-auto mb-4">
            <Phone size={32} className="text-[#7caacc]" />
          </div>
          <h2 className="text-xl font-bold text-[#1a1a1a] mb-2">🎁 先生送你完整报告</h2>
          <p className="text-base text-[#666666] leading-relaxed">
            输入手机号，即可查看完整躯体症状评估报告<br />
            并可随时下载保存
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-base font-medium text-[#1a1a1a] mb-1.5">
              📱 手机号 <span className="text-red-400">*</span>
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => { setPhone(e.target.value.replace(/\D/g, "").slice(0, 11)); setError(""); }}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="输入手机号，用于接收报告"
              className="w-full px-4 py-3 rounded-xl border border-[#e8e8e8] text-center text-lg tracking-widest outline-none focus:border-[#7caacc] transition-colors"
              autoFocus
            />
            {error && <p className="text-sm text-red-500 mt-1.5 text-center">{error}</p>}
          </div>
          <div>
            <label className="block text-base font-medium text-[#1a1a1a] mb-1.5">💬 微信号（选填）</label>
            <input
              type="text"
              value={wechatId}
              onChange={(e) => setWechatId(e.target.value)}
              placeholder="选填，先生可加你交流"
              className="w-full px-4 py-3 rounded-xl border border-[#e8e8e8] text-center text-base outline-none focus:border-[#7caacc] transition-colors"
            />
            <p className="text-sm text-[#999999] mt-1 text-center">留下微信号，先生可亲自为你解读报告</p>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full mt-6 rounded-xl py-3.5 text-lg font-semibold text-white transition-all active:scale-[0.98]"
          style={{ background: `linear-gradient(135deg, ${PRIMARY_COLOR}, #6a99bb)` }}
        >
          获取报告
        </button>
        <button onClick={onSkip} className="w-full mt-3 py-2.5 text-base text-[#999999]">暂不输入，直接查看</button>
      </div>
      <div className="px-4 pb-8 text-center">
        <p className="text-sm text-[#cccccc]">你的信息仅用于发送报告，不会公开</p>
      </div>
    </div>
  );
}

// ─── 结果页 ───
function PHQ15ResultView({
  result,
  onRestart,
  phone,
}: {
  result: PHQ15Result;
  onRestart: () => void;
  phone?: string;
}) {
  const [isDownloading, setIsDownloading] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

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

  const handleDownload = useCallback(async () => {
    if (!reportRef.current || isDownloading) return;
    setIsDownloading(true);
    try {
      const canvas = await html2canvas(reportRef.current, { scale: 2, backgroundColor: "#ffffff", useCORS: true, allowTaint: true, logging: false });
      const dataUrl = canvas.toDataURL("image/png", 0.95);
      const link = document.createElement("a");
      link.download = `PHQ15躯体症状报告_${testDate.replace(/\//g, "-")}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) { console.error("Download failed:", err); }
    finally { setIsDownloading(false); }
  }, [testDate, isDownloading]);

  const handleShare = useCallback(async () => {
    if (!reportRef.current) return;
    try {
      const canvas = await html2canvas(reportRef.current, { scale: 2, backgroundColor: "#ffffff", useCORS: true, allowTaint: true, logging: false });
      const dataUrl = canvas.toDataURL("image/png", 0.95);
      if (navigator.share) {
        const response = await fetch(dataUrl);
        const blob = await response.blob();
        const file = new File([blob], "PHQ15躯体症状报告.png", { type: "image/png" });
        await navigator.share({ title: "我的躯体症状评估报告 - 亦须AI", text: "测测你的躯体症状水平 👇", files: [file] });
      }
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <nav className="sticky-header z-30 border-b border-[#e8e8e8] bg-white/95 backdrop-blur-md px-4 py-3">
        <div className="flex items-center gap-2">
          <HomeLink />
          <Sparkles size={20} className="text-[#7caacc]" />
          <span className="text-base font-semibold text-[#1a1a1a]">PHQ-15 评估结果</span>
          <div className="ml-auto flex items-center gap-1">
            <button onClick={handleShare} className="p-2 text-[#999999] active:text-[#7caacc]" title="分享"><Share2 size={20} /></button>
            <button onClick={handleDownload} disabled={isDownloading} className="p-2 text-[#999999] active:text-[#7caacc] disabled:opacity-50" title="下载报告"><Download size={20} /></button>
          </div>
        </div>
      </nav>

      <div className="flex-1 px-4 pt-4 pb-20">
        <div ref={reportRef} className="bg-white">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-[#1a1a1a] font-song">你的躯体症状水平评估</h1>
            <p className="text-base text-[#666666] mt-1.5">{testDate}</p>
            {phone && (
              <p className="text-sm text-[#999999] mt-0.5">账号：{phone.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2")}</p>
            )}
          </div>

          {/* 总分卡 */}
          <div className="text-center mb-6">
            <p className="text-base text-[#8888aa] mb-2">你的总分</p>
            <p className="text-5xl font-extrabold" style={{ color: severityColorMap[result.severityClass] }}>
              {result.totalScore}
            </p>
            <p className="text-base text-[#8888aa] mt-1">/ 30</p>
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

          {/* 分数条 */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-[#999] mb-1">
              <span>0 正常</span><span>4</span><span>9</span><span>14</span><span>30 重度</span>
            </div>
            <div className="h-3 rounded-full bg-[#f0f0f0] relative overflow-hidden">
              <div className="absolute inset-0 flex">
                <div className="bg-[#27ae6030]" style={{ width: "13.3%" }} />
                <div className="bg-[#e67e2230]" style={{ width: "16.7%" }} />
                <div className="bg-[#d4a01730]" style={{ width: "16.7%" }} />
                <div className="bg-[#c0392b30]" style={{ width: "53.3%" }} />
              </div>
              <div
                className="absolute top-0 h-full w-1.5 bg-black rounded-full"
                style={{ left: `${Math.min(100, (result.totalScore / 30) * 100)}%` }}
              />
            </div>
          </div>

          {/* 建议 */}
          <div className="rounded-xl p-5 mb-6" style={{ backgroundColor: severityBgMap[result.severityClass] + "80" }}>
            <p className="text-lg text-[#555577] leading-relaxed">{result.advice}</p>
          </div>

          <div className="text-center pt-2 pb-2">
            <p className="text-sm text-[#7caacc] font-song">YIXU HEALING · 亦须疗愈</p>
            <p className="text-xs text-[#999999]">Sino-NLP 中华身心语言学</p>
          </div>
        </div>

        {/* 付费解锁 */}
        <div className="mt-4 rounded-xl border border-[#7caacc30] bg-gradient-to-br from-[#e8f2f8] to-white p-5">
          <div className="text-center mb-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#7caacc15] mb-2">
              <Sparkles size={16} className="text-[#7caacc]" />
              <span className="text-base font-semibold text-[#7caacc]">解锁深度解读</span>
            </div>
            <h3 className="text-xl font-bold text-[#1a1a1a] font-song">获取专属躯体症状舒缓方案</h3>
          </div>
          <div className="space-y-2 mb-4">
            {["躯体症状来源深度分析", "个性化身心调节指引", "七日身体觉察练习", "亦须先生亲自解读"].map((f, i) => (
              <div key={i} className="flex items-center gap-2 text-base text-[#555]"><span className="text-[#7caacc] text-sm">✦</span>{f}</div>
            ))}
          </div>
          <div className="text-center mb-3">
            <span className="text-2xl font-bold text-[#7caacc]">¥9.90</span>
            <span className="text-base text-[#666] ml-1">/ 永久解锁</span>
          </div>
          <button className="w-full rounded-xl py-3 text-lg font-semibold text-white transition-all active:scale-[0.98]" style={{ background: `linear-gradient(135deg, ${PRIMARY_COLOR}, #6a99bb)` }}>
            解锁完整报告
          </button>
        </div>

        <div className="mt-4 mb-2 text-center">
          <button onClick={onRestart} className="text-base text-[#999] underline underline-offset-4">重新测评</button>
        </div>
      </div>
    </div>
  );
}

// ─── 主组件 ───
export default function PHQ15AssessmentPage({ onBack }: { onBack?: () => void }) {
  const [stage, setStage] = useState<Stage>("intro");
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [result, setResult] = useState<PHQ15Result | null>(null);
  const [gender, setGender] = useState<"male" | "female">("female");
  const { loginWithPhone, isLoggedIn } = useUser();

  const handleStart = useCallback((g: "male" | "female") => {
    setGender(g);
    setStage("quiz");
  }, []);

  const handleComplete = useCallback((ans: Record<number, number>) => {
    setAnswers(ans);
    const res = calcPHQ15Result(ans, gender);
    setResult(res);
    if (isLoggedIn) {
      setStage("result");
    } else {
      setStage("collect-phone");
    }
  }, [isLoggedIn, gender]);

  const handlePhoneComplete = useCallback((phone: string) => {
    loginWithPhone(phone);
    setStage("result");
  }, [loginWithPhone]);

  const handlePhoneSkip = useCallback(() => setStage("result"), []);

  const handleRestart = useCallback(() => {
    setAnswers({});
    setResult(null);
    setStage("intro");
  }, []);

  const handleBack = useCallback(() => { if (onBack) onBack(); }, [onBack]);

  return (
    <>
      {stage === "intro" && <PHQ15Intro onStart={handleStart} onBack={handleBack} />}
      {stage === "quiz" && <PHQ15Quiz onComplete={handleComplete} gender={gender} />}
      {stage === "collect-phone" && <PhoneCollectPage onComplete={handlePhoneComplete} onSkip={handlePhoneSkip} />}
      {stage === "result" && result && <PHQ15ResultView result={result} onRestart={handleRestart} />}
    </>
  );
}
