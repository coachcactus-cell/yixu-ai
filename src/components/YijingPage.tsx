"use client";

import { useState, useEffect, useRef } from "react";
import { Compass, Smartphone, Sparkles, ChevronDown, ChevronUp, Download } from "lucide-react";
import {
  divineByPhone,
  divineByTime,
  generateYaoReports,
  getSeason,
  getSeasonLabel,
  isValidPhone,
} from "@/lib/divination";
import type { DivinationResult, YaoReport } from "@/lib/divination";

/* ── 人生十項 ── */
const LIFE_TOPICS = [
  { id: 1, icon: "💚", name: "健康", hint: "身体与心理的良好状态" },
  { id: 2, icon: "💼", name: "工作", hint: "在事业、学业或目标上的成就感" },
  { id: 3, icon: "🌹", name: "爱情", hint: "给予与接受爱、关怀的能力" },
  { id: 4, icon: "🕊️", name: "自由", hint: "不受拘束，能自主选择生活方式" },
  { id: 5, icon: "👨‍👩‍👧‍👦", name: "家庭", hint: "与家人、伴侣或朋友深刻的心灵连结" },
  { id: 6, icon: "🛡️", name: "安全", hint: "经济、情感或环境上的稳定感" },
  { id: 7, icon: "💰", name: "财富", hint: "物质资源的丰足" },
  { id: 8, icon: "📚", name: "知识", hint: "对事物的好奇心、学习与掌握技能" },
  { id: 9, icon: "🧘", name: "修养", hint: "对人处事的态度、道德与品格" },
  { id: 10, icon: "🌍", name: "贡献", hint: "对他人、社会或世界发挥影响力" },
];

/* ── SVG 六爻圖 ── */
function HexagramSVG({ lines, dongYao }: { lines: number[]; dongYao: number }) {
  return (
    <div className="flex flex-col items-center gap-1.5 my-4">
      {lines.map((line, i) => {
        const pos = 6 - i; // 從上到下渲染，但爻位由下至上
        const isDong = pos === dongYao;
        const isYang = line === 1;

        return (
          <div key={i} className="flex items-center gap-1">
            {isDong && (
              <span className="text-[10px] text-[#c9a84c] font-bold w-4 text-right">▶</span>
            )}
            {!isDong && <span className="w-4" />}
            {isYang ? (
              // 陽爻 ⚊
              <div
                className={`h-[6px] w-20 rounded-sm transition-all ${
                  isDong ? "bg-[#c9a84c] shadow-md shadow-[#c9a84c]/40" : "bg-[#1a1a1a]"
                }`}
              />
            ) : (
              // 陰爻 ⚋
              <div className="flex gap-2">
                <div
                  className={`h-[6px] w-8 rounded-sm transition-all ${
                    isDong ? "bg-[#c9a84c] shadow-md shadow-[#c9a84c]/40" : "bg-[#1a1a1a]"
                  }`}
                />
                <div
                  className={`h-[6px] w-8 rounded-sm transition-all ${
                    isDong ? "bg-[#c9a84c] shadow-md shadow-[#c9a84c]/40" : "bg-[#1a1a1a]"
                  }`}
                />
              </div>
            )}
            {!isDong && <span className="w-4" />}
            {isDong && (
              <span className="text-[10px] text-[#c9a84c] font-bold w-4">◀</span>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ── 爻辭報告卡片 ── */
function YaoCard({ report, hexagramName }: { report: YaoReport; hexagramName: string }) {
  const [expanded, setExpanded] = useState(report.isDongYao); // 動爻默認展開

  return (
    <div
      className={`rounded-xl border transition-all ${
        report.isDongYao
          ? "border-[#c9a84c] bg-[#fdf8ed] shadow-sm"
          : "border-[#e8e8e8] bg-white"
      }`}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 px-4 py-3 text-left"
      >
        {/* 爻位 + 陰陽符號 */}
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
          report.isDongYao ? "bg-[#c9a84c] text-white" : "bg-[#f5f5f5] text-[#888888]"
        }`}>
          {report.position}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#c9a84c] font-medium">{report.level}</span>
            {report.isDongYao && (
              <span className="text-[10px] bg-[#c9a84c]/10 text-[#c9a84c] px-2 py-0.5 rounded-full font-bold">
                动爻
              </span>
            )}
          </div>
          <p className="text-sm text-[#1a1a1a] font-medium mt-0.5 truncate">
            {report.yaoText}
          </p>
        </div>

        {expanded ? (
          <ChevronUp size={16} className="text-[#cccccc] flex-shrink-0" />
        ) : (
          <ChevronDown size={16} className="text-[#cccccc] flex-shrink-0" />
        )}
      </button>

      {expanded && (
        <div className="px-4 pb-4 pt-0 animate-fade-in-up">
          <div className="pl-11">
            <p className="text-sm text-[#1a1a1a] leading-relaxed whitespace-pre-line">
              {report.isDongYao
                ? generateDongYaoInterpretation(report, hexagramName)
                : generateYaoInterpretation(report)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── 爻辭×理解層次解讀生成 ── */

function generateYaoInterpretation(report: YaoReport): string {
  const { yaoText, level } = report;

  // 根據理解層次生成2-3句簡要解讀
  const templates: Record<string, string[]> = {
    "环境": [
      `此爻指向你当下的外在处境。${yaoText}——环境的变动正在影响你的节奏，留意周遭的变化。`,
      `从环境层面看，${yaoText}。你所处的客观条件正在发生变化，顺势而为方能安然。`,
    ],
    "行为": [
      `${yaoText}——此爻映照你近期的行为模式。你的行动正在形成某种惯性，觉察它。`,
      `行为层面，${yaoText}。你做了什么、没做什么，正在塑造当下的结果。`,
    ],
    "能力": [
      `此爻触及你的能力与策略。${yaoText}——你拥有的方法是否足够应对？或许需要新的视角。`,
      `从能力角度看，${yaoText}。你的技能和策略正在被考验，精进方能突破。`,
    ],
    "信念价值": [
      `${yaoText}——此爻直指你深层的信念。你真正相信的是什么？什么在驱动你的选择？`,
      `信念层面，${yaoText}。你的价值观正在经历校准，回归本心才能看清方向。`,
    ],
    "身份": [
      `此爻映照「我是谁」的根本问题。${yaoText}——你的角色认同正在被重新定义。`,
      `身份层面，${yaoText}。你如何看待自己，决定了你如何面对这个世界。`,
    ],
    "精神": [
      `${yaoText}——此爻触及你与更大力量的关系。你与天地万物、与更高意义的连结，正在呼唤你的觉察。`,
      `精神层面，${yaoText}。超越个人得失，你与更大整体的关联正在显现。`,
    ],
  };

  const options = templates[level] || templates["环境"];
  return options[Math.floor(Math.random() * options.length)];
}

function generateDongYaoInterpretation(report: YaoReport, hexagramName: string): string {
  const { yaoText, level } = report;

  // 動爻5-6句詳解
  const templates: Record<string, string> = {
    "环境": `【动爻·环境层】${yaoText}\n\n此爻为动爻，格外有力。你当下的外在环境正在发生关键转变。旧有的格局正在松动，新的条件正在形成。\n\n不要抗拒变化，而是观察：环境在告诉你什么？顺势而为，比逆流而上更有力量。\n\n此刻适合调整你的外在节奏，与变化同行。`,
    "行为": `【动爻·行为层】${yaoText}\n\n此爻为动爻，你的行为模式正面临转折。你惯常的应对方式已经到了需要更新的时刻。\n\n觉察你正在重复的行为——它们是否还在为你服务？有时候，最简单的改变就是：停下来，换一种方式去做。\n\n调动你的「自信」，相信直觉的力量。`,
    "能力": `【动爻·能力层】${yaoText}\n\n此爻为动爻，你的能力与策略正被深度检视。不是你不够好，而是旧的策略已经不够用了。\n\n这正是学习新方法、拓展新视角的时机。修习「自爱」——允许自己尚未掌握一切，在不完美中精进。\n\n能力不是一蹴而就的，而是在挑战中一层层长出来的。`,
    "信念价值": `【动爻·信念价值层】${yaoText}\n\n此爻为动爻，直指你最深层的信念系统。你正在经历一次价值观的重新校准——旧的信念在崩塌，新的信念尚未稳固。\n\n这是关键的转折点。问自己：我真正相信的是什么？什么规条在束缚我？\n\n修习「自尊」——有勇气承认旧的信念不再适用，并容许新的可能进入。`,
    "身份": `【动爻·身份层】${yaoText}\n\n此爻为动爻，你的身份认同正在被重塑。「我是谁」这个根本问题正在被重新回答。\n\n你可能正在经历角色的转变——从某种旧的身份中脱离，走向新的自我定义。这个过程需要「自爱」和「自尊」的双重力量。\n\n你不需要向外在证明自己的价值，你本自具足。`,
    "精神": `【动爻·精神层】${yaoText}\n\n此爻为动爻，触及你与更大力量的关系。你与天地万物、与更高意义的连结，正在呼唤你的觉察。\n\n这不是关于个人的得失，而是关于你在更大的整体中如何安放自己。放下「小我」的执着，看见「大我」的流向。\n\n此刻，静心聆听内在的声音，它会引导你走向你该去的地方。`,
  };

  return templates[level] || templates["环境"];
}

/* ── 完整報告頁 ── */
function ReportView({ result, onClose }: { result: DivinationResult; onClose: () => void }) {
  const { hexagram, upperGuaName, lowerGuaName, dongYao, season, topic } = result;
  const yaoReports = generateYaoReports(result);
  const reportRef = useRef<HTMLDivElement>(null);

  const seasonLabel = season ? getSeasonLabel(season) : "";

  return (
    <div className="flex flex-col min-h-screen bg-white animate-fade-in-up">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/95 backdrop-blur-md px-4 py-3 border-b border-[#e8e8e8]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass size={20} className="text-[#c9a84c]" />
            <h1 className="text-lg font-bold text-[#1a1a1a] font-song">点卦报告</h1>
          </div>
          <button
            onClick={onClose}
            className="text-sm text-[#c9a84c] font-medium"
          >
            重新问卦
          </button>
        </div>
      </header>

      <div ref={reportRef} className="flex-1 px-4 pb-24">
        {/* 卦象主卡片 */}
        <div className="card mt-4 border-[#c9a84c]/30 bg-gradient-to-b from-[#fdf8ed]/50 to-white">
          {/* 季節/課題標籤 */}
          {seasonLabel && (
            <p className="text-xs text-[#c9a84c] font-medium mb-1">{seasonLabel}</p>
          )}
          {topic && (
            <p className="text-xs text-[#c9a84c] font-medium mb-1">咨询：{topic}</p>
          )}

          {/* 卦名 */}
          <h2 className="text-3xl font-black text-[#1a1a1a] font-song text-center mb-1">
            {hexagram.name}
          </h2>
          <p className="text-sm text-[#8a9bae] text-center mb-4">
            上{upperGuaName} 下{lowerGuaName} · 动第{dongYao}爻
          </p>

          {/* 六爻圖 */}
          <HexagramSVG lines={hexagram.lines} dongYao={dongYao} />

          {/* 卦辭 */}
          <div className="mt-4 p-3 rounded-lg bg-[#fdf8ed] border border-[#c9a84c]/20">
            <p className="text-sm font-bold text-[#c9a84c] mb-1">卦辞</p>
            <p className="text-sm text-[#1a1a1a] leading-relaxed">{hexagram.judgement}</p>
          </div>

          {/* 大象 */}
          <div className="mt-2 p-3 rounded-lg bg-[#f9fafb] border border-[#e8e8e8]">
            <p className="text-sm font-bold text-[#888888] mb-1">象曰</p>
            <p className="text-sm text-[#1a1a1a] leading-relaxed">{hexagram.image}</p>
          </div>

          {/* 整體解讀 */}
          <div className="mt-2 p-3 rounded-lg bg-white border border-[#e8e8e8]">
            <p className="text-sm font-bold text-[#1a1a1a] mb-1">解读</p>
            <p className="text-sm text-[#555555] leading-relaxed">{hexagram.interpretation}</p>
          </div>
        </div>

        {/* 六爻×理解層次 */}
        <div className="mt-4">
          <h3 className="section-header">六爻 · 理解层次</h3>
          <p className="text-xs text-[#999999] px-4 -mt-2 mb-3">
            每一爻对应一个理解层次，动爻详解
          </p>
          <div className="space-y-2">
            {yaoReports.map((r) => (
              <YaoCard key={r.position} report={r} hexagramName={hexagram.name} />
            ))}
          </div>
        </div>

        {/* 付費詳細報告入口 */}
        <div className="card mt-6 bg-gradient-to-r from-[#fdf8ed] to-white border-[#c9a84c]/30 text-center">
          <Sparkles size={20} className="mx-auto text-[#c9a84c] mb-2" />
          <p className="text-sm font-bold text-[#1a1a1a] mb-1">获取详细报告</p>
          <p className="text-xs text-[#888888] mb-3">
            包含1000字深度解读，结合Sino-NLP体系与易經智慧的完整分析
          </p>
          <button className="btn-primary text-sm py-2.5 px-8">
            解锁详细报告 · ¥9.90
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════ */
/*  主頁面：點心問卦                              */
/* ══════════════════════════════════════════════ */

export default function YijingPage() {
  const [activeModule, setActiveModule] = useState<"none" | "phone" | "life">("none");
  const [result, setResult] = useState<DivinationResult | null>(null);

  // 入口一狀態
  const [phoneInput, setPhoneInput] = useState("");
  const [phoneError, setPhoneError] = useState("");

  // 入口二狀態
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [selectedTopicName, setSelectedTopicName] = useState<string | null>(null);
  const [score, setScore] = useState(50);
  const [showBreath, setShowBreath] = useState(false);
  const [showClickBtn, setShowClickBtn] = useState(false);
  const breathTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 季節
  const [seasonLabel, setSeasonLabel] = useState("");
  useEffect(() => {
    setSeasonLabel(getSeasonLabel(getSeason()));
  }, []);

  // 清理計時器
  useEffect(() => {
    return () => {
      if (breathTimerRef.current) clearTimeout(breathTimerRef.current);
    };
  }, []);

  /* ── 入口一：手機號起卦 ── */
  const handlePhoneDivine = () => {
    if (!isValidPhone(phoneInput)) {
      setPhoneError("请输入有效的手机号码（3-15位数字）");
      return;
    }
    setPhoneError("");
    const r = divineByPhone(phoneInput.replace(/[\s\-\+]/g, ""));
    if (r) {
      setResult(r);
    } else {
      setPhoneError("起卦失败，请重试");
    }
  };

  /* ── 入口二：時間+狀態分起卦 ── */
  const handleTopicSelect = (name: string, hint: string) => {
    setSelectedTopic(hint);
    setSelectedTopicName(name);
    setShowBreath(true);
    setShowClickBtn(false);

    // 6秒後彈出按鈕
    if (breathTimerRef.current) clearTimeout(breathTimerRef.current);
    breathTimerRef.current = setTimeout(() => {
      setShowClickBtn(true);
    }, 6000);
  };

  const handleTimeDivine = () => {
    if (!selectedTopic) return;
    const r = divineByTime(score, selectedTopicName || "");
    setResult(r);
  };

  /* ── 如果有結果，顯示報告 ── */
  if (result) {
    return <ReportView result={result} onClose={() => setResult(null)} />;
  }

  /* ── 主頁面 ── */
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/95 backdrop-blur-md px-4 py-4 border-b border-[#e8e8e8]">
        <div className="flex items-center gap-2">
          <Compass size={22} className="text-[#c9a84c]" />
          <div>
            <h1 className="text-xl font-bold text-[#1a1a1a] font-song">点卦问事</h1>
            <p className="text-sm text-[#888888] mt-1">
              梅花易数 × Sino-NLP 理解层次
            </p>
          </div>
        </div>
      </header>

      <div className="flex-1 px-4 pb-24">
        {/* 簡介卡片 */}
        <div className="card bg-gradient-to-br from-[#c9a84c]/5 to-[#fdf8ed] border-[#c9a84c]/20 mt-4">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={18} className="text-[#c9a84c]" />
            <span className="text-sm font-medium text-[#c9a84c]">点卦问事</span>
          </div>
          <p className="text-xs text-[#888888] leading-relaxed">
            以梅花易数先天八卦起卦，结合Sino-NLP理解层次模型，将易经384爻辞智慧转化为现代身心指引。两个入口，两种问法。
          </p>
        </div>

        {/* ═══ 入口一：季度咨詢 ═══ */}
        <div className="card mt-3">
          <button
            onClick={() => setActiveModule(activeModule === "phone" ? "none" : "phone")}
            className="w-full flex items-center gap-3 text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-[#fdf8ed] flex items-center justify-center flex-shrink-0">
              <Smartphone size={20} className="text-[#c9a84c]" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-[#1a1a1a]">季度咨询</h3>
              <p className="text-xs text-[#888888]">{seasonLabel}</p>
            </div>
            {activeModule === "phone" ? (
              <ChevronUp size={18} className="text-[#cccccc]" />
            ) : (
              <ChevronDown size={18} className="text-[#cccccc]" />
            )}
          </button>

          {activeModule === "phone" && (
            <div className="mt-4 animate-fade-in-up">
              <p className="text-xs text-[#888888] mb-3">
                输入手机号码，以先天八卦数起卦，锁定本季核心身心格局
              </p>
              <div className="flex gap-2">
                <input
                  type="tel"
                  value={phoneInput}
                  onChange={(e) => {
                    setPhoneInput(e.target.value);
                    setPhoneError("");
                  }}
                  placeholder="输入手机号码"
                  className="flex-1 bg-[#f5f5f5] border border-[#e8e8e8] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#c9a84c] transition-colors"
                />
                <button
                  onClick={handlePhoneDivine}
                  className="btn-primary text-sm py-2 px-4 flex-shrink-0"
                >
                  起卦
                </button>
              </div>
              {phoneError && (
                <p className="text-xs text-red-500 mt-2">{phoneError}</p>
              )}
              <p className="text-[10px] text-[#cccccc] mt-2">
                接受任何国家手机号，号码仅用于起卦运算
              </p>
            </div>
          )}
        </div>

        {/* 分隔線 */}
        <div className="flex items-center gap-3 px-4 my-1">
          <div className="flex-1 h-px bg-[#e8e8e8]" />
          <span className="text-xs text-[#cccccc] font-song">亦 须</span>
          <div className="flex-1 h-px bg-[#e8e8e8]" />
        </div>

        {/* ═══ 入口二：生活咨詢 ═══ */}
        <div className="card">
          <button
            onClick={() => setActiveModule(activeModule === "life" ? "none" : "life")}
            className="w-full flex items-center gap-3 text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-[#fdf8ed] flex items-center justify-center flex-shrink-0">
              <Sparkles size={20} className="text-[#c9a84c]" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-[#1a1a1a]">生活咨询</h3>
              <p className="text-xs text-[#888888]">选择课题，当下指引</p>
            </div>
            {activeModule === "life" ? (
              <ChevronUp size={18} className="text-[#cccccc]" />
            ) : (
              <ChevronDown size={18} className="text-[#cccccc]" />
            )}
          </button>

          {activeModule === "life" && !showBreath && (
            <div className="mt-4 animate-fade-in-up">
              <p className="text-xs text-[#888888] mb-3">选择你想咨询的课题：</p>
              <div className="grid grid-cols-2 gap-2">
                {LIFE_TOPICS.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => handleTopicSelect(t.name, t.hint)}
                    className={`text-left px-3 py-3 rounded-xl border transition-all active:scale-[0.98] ${
                      selectedTopicName === t.name
                        ? "border-[#c9a84c] bg-[#fdf8ed]"
                        : "border-[#e8e8e8] bg-white hover:border-[#c9a84c]/50"
                    }`}
                  >
                    <span className="text-base">{t.icon}</span>
                    <p className="text-sm font-medium text-[#1a1a1a] mt-1">{t.name}</p>
                    <p className="text-[10px] text-[#999999] leading-snug mt-0.5">{t.hint}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeModule === "life" && showBreath && (
            <div className="mt-4 animate-fade-in-up text-center">
              {/* 已選課題 */}
              <div className="flex items-center justify-center gap-2 mb-6">
                <span className="gold-tag">{selectedTopicName}</span>
              </div>

              {!showClickBtn ? (
                /* 呼吸引導 */
                <div className="py-8">
                  <div className="w-20 h-20 rounded-full bg-[#fdf8ed] mx-auto mb-4 flex items-center justify-center animate-pulse">
                    <span className="text-3xl">🙏</span>
                  </div>
                  <p className="text-sm text-[#1a1a1a] font-medium leading-relaxed">
                    请您闭上眼睛<br />
                    深深呼吸<br />
                    放松肩膀 5 秒<br />
                    然后再张开眼睛
                  </p>
                  <p className="text-xs text-[#cccccc] mt-3">正在准备中...</p>
                </div>
              ) : (
                /* 狀態分 + 起卦按鈕 */
                <div className="py-4">
                  <p className="text-sm text-[#c9a84c] font-medium mb-4">
                    张开眼睛了？为你当下的状态打个分：
                  </p>

                  {/* 狀態分 Slider */}
                  <div className="px-4 mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-[#999999]">低落</span>
                      <span className="text-2xl font-bold text-[#c9a84c] font-song">{score}</span>
                      <span className="text-xs text-[#999999]">充沛</span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={100}
                      value={score}
                      onChange={(e) => setScore(Number(e.target.value))}
                      className="w-full h-2 bg-[#e8e8e8] rounded-full appearance-none cursor-pointer accent-[#c9a84c]"
                    />
                  </div>

                  <button
                    onClick={handleTimeDivine}
                    className="btn-primary text-base py-3 px-8 rounded-full"
                  >
                    感应当下 · 起卦
                  </button>
                </div>
              )}

              {/* 返回選題 */}
              <button
                onClick={() => {
                  setShowBreath(false);
                  setShowClickBtn(false);
                  setSelectedTopic(null);
                  setSelectedTopicName(null);
                  if (breathTimerRef.current) clearTimeout(breathTimerRef.current);
                }}
                className="text-xs text-[#cccccc] mt-4 underline"
              >
                重新选择课题
              </button>
            </div>
          )}
        </div>

        {/* 底部說明 */}
        <div className="mt-6 text-center pb-4">
          <p className="text-xs text-[#cccccc] font-song">
            梅花易数 · 先天八卦数 · NLP理解层次
          </p>
          <p className="text-xs text-[#cccccc] mt-1">
            环境 | 行为 | 能力 | 信念价值 | 身份 | 精神
          </p>
        </div>
      </div>
    </div>
  );
}
