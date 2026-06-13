"use client";

import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { ChevronLeft, Sparkles, Download, Share2, Phone, Home, AlertTriangle } from "lucide-react";
import html2canvas from "html2canvas";
import { COREOM_QUESTIONS, COREOM_OPTIONS, TOTAL_COREOM, calcCOREOMResult, type COREOMResult } from "@/data/coreom";
import { useUser } from "@/hooks/useUser";

type Stage = "intro" | "quiz" | "result" | "collect-phone";

const PRIMARY = "#7dba9a";

const severityColorMap: Record<string, string> = {
  minimal: "#27ae60",
  mild: "#e67e22",
  moderate: "#d4a017",
  "moderate-severe": "#b9451d",
  severe: "#c0392b",
};

const severityBgMap: Record<string, string> = {
  minimal: "#e3f2e8",
  mild: "#fff3e0",
  moderate: "#fff0e0",
  "moderate-severe": "#ffe8e0",
  severe: "#fce4e4",
};

function reverseScore(score: number): number {
  return 4 - score;
}

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
      className="text-[#7dba9a] text-base flex items-center gap-1 shrink-0"
    >
      <Home size={18} />
      <span>首页</span>
    </button>
  );
}

// ─── 介绍页 ───
function COREOMIntro({ onStart, onBack }: { onStart: () => void; onBack: () => void }) {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <header className="sticky-header bg-white/95 backdrop-blur-md px-4 py-4 border-b border-[#e8e8e8]">
        <div className="flex items-center gap-2">
          <button onClick={onBack} className="text-[#7dba9a]">
            <ChevronLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-[#1a1a1a] font-song">CORE-OM 临床结果评量</h1>
            <p className="text-base text-[#666666] mt-0.5">Clinical Outcomes in Routine Evaluation</p>
          </div>
          <HomeLink />
        </div>
      </header>

      <div className="flex-1 px-4 pb-32 content-below-header">
        {/* 说明卡 */}
        <div className="card">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={20} className="text-[#7dba9a]" />
            <span className="text-lg font-semibold text-[#1a1a1a]">测评须知</span>
          </div>
          <ul className="space-y-2.5 text-base text-[#666666]">
            <li className="flex items-start gap-2">
              <span className="text-[#7dba9a] font-bold mt-0.5">•</span>
              共 {TOTAL_COREOM} 题，预计需时 5-8 分钟
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#7dba9a] font-bold mt-0.5">•</span>
              回顾过去一星期的状况，选择最符合的选项
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#7dba9a] font-bold mt-0.5">•</span>
              0-4 分制，部分题目为🟠反向计分（选"大部分或总是"得0分，选"完全没有"得4分）
            </li>
            <li className="flex items-start gap-2 font-bold text-[#1a1a1a]">
              <span className="text-[#7dba9a] font-bold mt-0.5">•</span>
              请看好问题后以第一感觉直觉尽快作答，即不必深思熟虑，考虑越多，结果越不准确。
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#7dba9a] font-bold mt-0.5">•</span>
              本测评仅供参考，不作为医学诊断依据
            </li>
          </ul>
        </div>

        {/* 金句 */}
        <div className="mt-4 px-2 py-4 text-center">
          <p className="text-base text-[#999999] italic font-song leading-relaxed">
            「心灵的伤口，比身体的更值得被看见。」
          </p>
          <p className="text-base text-[#999999] mt-1">—— 亦须先生</p>
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
function COREOMQuiz({ onComplete }: { onComplete: (answers: Record<number, number>) => void }) {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  useQuizProtection();

  const answeredCount = Object.keys(answers).length;
  const progress = Math.round((answeredCount / TOTAL_COREOM) * 100);

  const handleSelect = useCallback((score: number) => {
    setAnswers((prev) => ({ ...prev, [COREOM_QUESTIONS[currentQ].id]: score }));
    if (currentQ < TOTAL_COREOM - 1) {
      setTimeout(() => setCurrentQ((p) => p + 1), 200);
    }
  }, [currentQ]);

  const allAnswered = answeredCount === TOTAL_COREOM;
  const currentQuestion = COREOM_QUESTIONS[currentQ];
  const currentSelected = answers[currentQuestion.id];

  return (
    <div className="flex flex-col min-h-screen bg-white quiz-protected">
      <nav className="sticky-header z-30 border-b border-[#e8e8e8] bg-white/95 backdrop-blur-md px-4 py-3">
        <div className="flex items-center gap-2 mb-2">
          <HomeLink />
          <Sparkles size={20} className="text-[#7dba9a]" />
          <span className="text-base font-semibold text-[#1a1a1a]">CORE-OM 评量</span>
          <span className="ml-auto text-base text-[#666666]">
            {answeredCount}/{TOTAL_COREOM}
          </span>
        </div>
        <div className="h-1.5 bg-[#f0f0f0] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${progress}%`,
              background: "linear-gradient(90deg, #7dba9a, #5da07a)",
            }}
          />
        </div>
        <p className="text-xl font-bold text-[#1a1a1a] mt-3 px-1">
          📌 过去一个星期，你的情况如何？
        </p>
      </nav>

      <section className="flex-1 px-4 pb-40 content-below-quiz-nav">
        <div className="mb-2 text-base text-[#7dba9a] font-semibold">
          第 {currentQ + 1} 题（共 {TOTAL_COREOM} 题）
          {currentQuestion.isReverse && (
            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-sm font-medium bg-[#fff3e0] text-[#e67e22]">
              🟠 反向计分
            </span>
          )}
        </div>
        <h2 className="text-2xl font-bold text-[#1a1a1a] leading-relaxed mb-8">
          {currentQuestion.text}
        </h2>

        <div className="space-y-3">
          {COREOM_OPTIONS.map((opt) => {
            const isSelected = currentSelected === opt.score;
            const displayScore = currentQuestion.isReverse ? reverseScore(opt.score) : opt.score;
            return (
              <button
                key={opt.score}
                onClick={() => handleSelect(opt.score)}
                className="w-full flex items-center gap-3 px-4 py-4 rounded-xl border-2 transition-all active:scale-[0.98]"
                style={{
                  borderColor: isSelected ? PRIMARY : "#e8e8e8",
                  backgroundColor: isSelected ? "#f0faf5" : "#fafaff",
                  boxShadow: isSelected ? "0 2px 8px rgba(125,186,154,0.15)" : "none",
                }}
              >
                <div
                  className="size-10 rounded-full flex items-center justify-center text-base font-bold shrink-0 transition-all"
                  style={{
                    backgroundColor: isSelected ? PRIMARY : "#f0f0f0",
                    color: isSelected ? "white" : "#999999",
                  }}
                >
                  {displayScore}
                </div>
                <div className="text-left flex-1">
                  <div className="text-lg font-medium text-[#1a1a1a]">{opt.label}</div>
                  <div className="text-sm text-[#999999]">{displayScore} 分{currentQuestion.isReverse ? "（反向）" : ""}</div>
                </div>
              </button>
            );
          })}
        </div>

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
            onClick={() => setCurrentQ((p) => Math.min(TOTAL_COREOM - 1, p + 1))}
            disabled={currentQ === TOTAL_COREOM - 1}
            className="flex-1 py-3 rounded-xl border border-[#e8e8e8] text-base text-[#666] disabled:opacity-30 disabled:cursor-not-allowed"
          >
            下一题
          </button>
        </div>
      </section>

      <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-[#e8e8e8] bg-white/95 backdrop-blur-md px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))]">
        {!allAnswered && (
          <p className="mb-2 text-center text-base text-[#666666]">
            已完成 {answeredCount}/{TOTAL_COREOM} 题
          </p>
        )}
        <button
          onClick={() => onComplete(answers)}
          disabled={!allAnswered}
          className="w-full rounded-xl py-3.5 text-lg font-semibold transition-all active:scale-[0.98]"
          style={{
            backgroundColor: allAnswered ? PRIMARY : "#e8e8e8",
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
          <Sparkles size={20} className="text-[#7dba9a]" />
          <h1 className="text-2xl font-bold text-[#1a1a1a] font-song">解锁完整报告</h1>
        </div>
      </header>

      <div className="flex-1 px-4 pt-8 content-below-header">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#f0faf5] to-[#d4f0e0] flex items-center justify-center mx-auto mb-4">
            <Phone size={32} className="text-[#7dba9a]" />
          </div>
          <h2 className="text-xl font-bold text-[#1a1a1a] mb-2">🎁 先生送你完整报告</h2>
          <p className="text-base text-[#666666] leading-relaxed">
            输入手机号，即可查看完整 CORE-OM 评估报告<br />
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
              className="w-full px-4 py-3 rounded-xl border border-[#e8e8e8] text-center text-lg tracking-widest outline-none focus:border-[#7dba9a] transition-colors"
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
              className="w-full px-4 py-3 rounded-xl border border-[#e8e8e8] text-center text-base outline-none focus:border-[#7dba9a] transition-colors"
            />
            <p className="text-sm text-[#999999] mt-1 text-center">留下微信号，先生可亲自为你解读报告</p>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full mt-6 rounded-xl py-3.5 text-lg font-semibold text-white transition-all active:scale-[0.98]"
          style={{ background: "linear-gradient(135deg, #7dba9a, #5da07a)" }}
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
function COREOMResultView({
  result,
  onRestart,
  phone,
}: {
  result: COREOMResult;
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
      link.download = `CORE-OM报告_${testDate.replace(/\//g, "-")}.png`;
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
        const file = new File([blob], "CORE-OM报告.png", { type: "image/png" });
        await navigator.share({ title: "我的 CORE-OM 评估报告 - 亦须AI", text: "测测你的心理健康水平 👇", files: [file] });
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
          <Sparkles size={20} className="text-[#7dba9a]" />
          <span className="text-base font-semibold text-[#1a1a1a]">CORE-OM 评估结果</span>
          <div className="ml-auto flex items-center gap-1">
            <button onClick={handleShare} className="p-2 text-[#999999] active:text-[#7dba9a]" title="分享"><Share2 size={20} /></button>
            <button onClick={handleDownload} disabled={isDownloading} className="p-2 text-[#999999] active:text-[#7dba9a] disabled:opacity-50" title="下载报告"><Download size={20} /></button>
          </div>
        </div>
      </nav>

      <div className="flex-1 px-4 pb-20 content-below-quiz-nav">
        <div ref={reportRef} className="bg-white">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-[#1a1a1a] font-song">你的心理健康水平评估</h1>
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
            <p className="text-base text-[#8888aa] mt-1">/ 136</p>
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
              <span>0 正常</span><span>20</span><span>40</span><span>60</span><span>80</span><span>136 重度</span>
            </div>
            <div className="h-3 rounded-full bg-[#f0f0f0] relative overflow-hidden">
              <div className="absolute inset-0 flex">
                <div className="flex-1 bg-[#27ae6030]" />
                <div className="flex-1 bg-[#e67e2230]" />
                <div className="flex-1 bg-[#d4a01730]" />
                <div className="flex-1 bg-[#b9451d30]" />
                <div className="flex-1 bg-[#c0392b30]" />
              </div>
              <div
                className="absolute top-0 h-full w-1.5 bg-black rounded-full"
                style={{ left: `${Math.min(100, (result.totalScore / 136) * 100)}%` }}
              />
            </div>
          </div>

          {/* 自杀风险警示 */}
          {result.hasSuicideRisk && (
            <div className="rounded-xl border-2 border-red-400 bg-[#fff5f5] p-5 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle size={24} className="text-red-500" />
                <span className="text-lg font-bold text-red-600">自杀风险警示</span>
              </div>
              <p className="text-base text-[#555] leading-relaxed mb-3">
                你在以下题目中表达了自我伤害或自杀相关的想法：
              </p>
              <ul className="space-y-1 mb-4">
                {result.suicideRiskItems.map((item, i) => (
                  <li key={i} className="text-base text-red-600 font-medium">• {item}</li>
                ))}
              </ul>
              <p className="text-base text-[#555] leading-relaxed mb-3">
                如果你有这样的想法，请务必寻求帮助。你不是一个人，有人愿意倾听和支持你。
              </p>
              <div className="rounded-lg bg-white border border-red-200 p-4 space-y-2">
                <p className="text-base font-bold text-red-600">紧急求助热线：</p>
                <p className="text-lg font-bold text-[#1a1a1a]">🇭🇰 香港：1995（撒玛利亚防止自杀会）</p>
                <p className="text-lg font-bold text-[#1a1a1a]">🇨🇳 北京心理危机研究与干预中心：010-82951332</p>
                <p className="text-lg font-bold text-[#1a1a1a]">🚨 紧急情况：999（香港）/ 110（内地）</p>
              </div>
            </div>
          )}

          {/* 建议 */}
          <div className="rounded-xl p-5 mb-6" style={{ backgroundColor: severityBgMap[result.severityClass] + "80" }}>
            <p className="text-lg text-[#555577] leading-relaxed">{result.advice}</p>
          </div>

          <div className="text-center pt-2 pb-2">
            <p className="text-sm text-[#7dba9a] font-song">YIXU HEALING · 亦须疗愈</p>
            <p className="text-xs text-[#999999]">Sino-NLP 中华身心语言学</p>
          </div>
        </div>

        {/* 付费解锁 */}
        <div className="mt-4 rounded-xl border border-[#7dba9a30] bg-gradient-to-br from-[#f0faf5] to-white p-5">
          <div className="text-center mb-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#7dba9a15] mb-2">
              <Sparkles size={16} className="text-[#7dba9a]" />
              <span className="text-base font-semibold text-[#7dba9a]">解锁深度解读</span>
            </div>
            <h3 className="text-xl font-bold text-[#1a1a1a] font-song">获取专属心理健康方案</h3>
          </div>
          <div className="space-y-2 mb-4">
            {["心理健康深度分析", "个性化正念冥想指引", "七日情绪管理练习", "亦须先生亲自解读"].map((f, i) => (
              <div key={i} className="flex items-center gap-2 text-base text-[#555]"><span className="text-[#7dba9a] text-sm">✦</span>{f}</div>
            ))}
          </div>
          <div className="text-center mb-3">
            <span className="text-2xl font-bold text-[#7dba9a]">¥9.90</span>
            <span className="text-base text-[#666] ml-1">/ 永久解锁</span>
          </div>
          <button className="w-full rounded-xl py-3 text-lg font-semibold text-white transition-all active:scale-[0.98]" style={{ background: "linear-gradient(135deg, #7dba9a, #5da07a)" }}>
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
export default function COREOMAssessmentPage({ onBack }: { onBack?: () => void }) {
  const [stage, setStage] = useState<Stage>("intro");
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [result, setResult] = useState<COREOMResult | null>(null);
  const { loginWithPhone, isLoggedIn } = useUser();

  const handleStart = useCallback(() => setStage("quiz"), []);

  const handleComplete = useCallback((ans: Record<number, number>) => {
    setAnswers(ans);
    const res = calcCOREOMResult(ans);
    setResult(res);
    if (isLoggedIn) {
      setStage("result");
    } else {
      setStage("collect-phone");
    }
  }, [isLoggedIn]);

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
      {stage === "intro" && <COREOMIntro onStart={handleStart} onBack={handleBack} />}
      {stage === "quiz" && <COREOMQuiz onComplete={handleComplete} />}
      {stage === "collect-phone" && <PhoneCollectPage onComplete={handlePhoneComplete} onSkip={handlePhoneSkip} />}
      {stage === "result" && result && <COREOMResultView result={result} onRestart={handleRestart} />}
    </>
  );
}
