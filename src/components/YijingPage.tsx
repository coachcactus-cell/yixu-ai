"use client";

import { useState } from "react";
import { Compass, ArrowRight, Sparkles, Smartphone, Dice1 } from "lucide-react";

/* ── 類型定義 ── */
interface Theme {
  id: number;
  icon: string;
  text: string;
}

/* ── 常數 ── */
const THEMES: Theme[] = [
  { id: 1, icon: "💼", text: "事业财富 ── 寻找破局先机" },
  { id: 2, icon: "🌹", text: "情感流动 ── 解码亲密关系" },
  { id: 3, icon: "🩺", text: "身心健康 ── 能量平衡调理" },
  { id: 4, icon: "🧘", text: "内心恐惧 ── 打破迷茫焦虑" },
  { id: 5, icon: "🤝", text: "人际磁场 ── 小人贵人应对" },
  { id: 6, icon: "👑", text: "自我价值 ── 配得感与自信" },
  { id: 7, icon: "🧭", text: "重大决策 ── 当下进退抉择" },
  { id: 8, icon: "👨‍👩‍👧‍👦", text: "原生家庭 ── 和解与心灵重塑" },
  { id: 9, icon: "🎯", text: "天命大愿 ── 生涯意义探索" },
  { id: 10, icon: "☕", text: "当下点心 ── 每日一禅转化" },
];

const GUA_NAMES = [
  "坤为地", "乾为天", "兑为泽", "离为火",
  "震为雷", "巽为风", "坎为水", "艮为山",
];

/* ── 子組件：入口一 ─ 手機號碼季能量 ── */
function PhoneModule() {
  const [phone, setPhone] = useState("");
  const [report, setReport] = useState("");

  const handleGenerate = () => {
    if (!phone.trim()) return;
    setReport(
      `【格局解析】：基于手机号码锁定，本季触发「山天大畜」之象。\n\n【核心卡点】：目前外在资源完全充足，核心障碍卡在【信念 / 价值观层级】。大脑神经元存在防御规条，容易因过度谨慎而错失显化良机。\n\n【点心转化法】：练习呼吸放松法，在吸气时默念「自爱」，呼气时放下外在评判，突破防御。`
    );
  };

  return (
    <div className="card mx-0">
      <div className="flex items-center gap-2 mb-3">
        <Smartphone size={18} className="text-[#c9a84c]" />
        <h3 className="font-semibold text-[#1a1a1a] text-sm">入口一 · 季度能量总纲</h3>
      </div>
      <p className="text-xs text-[#888888] mb-3">
        输入手机号码，锁定本季核心身心格局
      </p>
      <div className="flex gap-2">
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="例如：19924633003"
          className="flex-1 bg-[#f5f5f5] border border-[#e8e8e8] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#c9a84c] transition-colors"
        />
        <button
          onClick={handleGenerate}
          className="btn-primary text-sm py-2 px-4 flex-shrink-0"
        >
          解锁总纲
        </button>
      </div>

      {report && (
        <div className="mt-4 p-4 rounded-xl border border-dashed border-[#c9a84c] bg-[#fdfaf2] animate-fade-in-up">
          <p className="text-sm font-bold text-[#c9a84c] mb-2">🔮 季能量 · 当季身心总纲格局</p>
          <p className="text-sm text-[#1a1a1a] leading-relaxed whitespace-pre-line">{report}</p>
        </div>
      )}
    </div>
  );
}

/* ── 子組件：入口二 ─ 雙組數字天天問事 ── */
function NumberModule() {
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [numOne, setNumOne] = useState("");
  const [numTwo, setNumTwo] = useState("");
  const [report, setReport] = useState("");

  const handleSelectTheme = (theme: Theme) => {
    setSelectedTheme(theme.text);
    setSelectedId(theme.id);
    setReport("");
  };

  const handleGenerate = () => {
    if (!numOne || !numTwo || !selectedTheme) return;

    const n1 = Math.abs(Math.floor(Number(numOne)));
    const n2 = Math.abs(Math.floor(Number(numTwo)));
    const currentHour = new Date().getHours();

    const upperGuaIndex = n1 % 8;
    const lowerGuaIndex = n2 % 8;
    let dongYao = (n1 + n2 + currentHour) % 6;
    if (dongYao === 0) dongYao = 6;

    const upperGua = GUA_NAMES[upperGuaIndex];
    const lowerGua = GUA_NAMES[lowerGuaIndex];

    let interpretation = `【咨询课题】：${selectedTheme}\n`;
    interpretation += `【时空密码】：上卦 [${upperGua}] / 下卦 [${lowerGua}] / 动在 [第 ${dongYao} 爻]\n\n`;

    if (dongYao === 1 || dongYao === 4) {
      interpretation += `【NLP理解层次卡点】：环境与行为层次\n【心灵重塑】：目前你在此课题下面对的卡点，主要是外在环境的杂音影响了你的日常行为节奏。请调动你的【自信】心法。稳住核心，中庸应对，外在环境只是暂时的镜子。\n【日常功课】：执行格物致知，每日记下三件令你感到有掌控感与配得感的事情。`;
    } else if (dongYao === 2 || dongYao === 5) {
      interpretation += `【NLP理解层次卡点】：能力与身分认同层次\n【心灵重塑】：你在这个课题上产生了潜意识的防御与自我怀疑。核心需要修复【自爱】与【自尊】。你本自具足，不需要向外在证明任何价值。\n【日常功课】：配合「呼吸放松法」，每次感到卡顿焦虑时闭眼三分钟，专注于吸气自爱、呼气放松。`;
    } else {
      interpretation += `【NLP理解层次卡点】：精神、信念与天命大愿层次\n【心灵重塑】：此动爻代表你正面临一个生命轨道或思考盲区的转折点。突破这个精神层面的规条约束，将会直接提升你的身心统合满意度。\n【日常功课】：放下大脑的防御规条，容许自己以最自然的状态去体验当下能量的流动。`;
    }

    setReport(interpretation);
  };

  return (
    <div className="card mx-0">
      <div className="flex items-center gap-2 mb-3">
        <Dice1 size={18} className="text-[#c9a84c]" />
        <h3 className="font-semibold text-[#1a1a1a] text-sm">入口二 · 天天问事当下指引</h3>
      </div>
      <p className="text-xs text-[#888888] mb-3">
        请先选择你想咨询的日常课题：
      </p>

      {/* 課題選擇 */}
      <div className="space-y-1.5 max-h-48 overflow-y-auto mb-3 border border-[#e8e8e8] rounded-lg p-2 bg-[#fafafa]">
        {THEMES.map((theme) => (
          <button
            key={theme.id}
            onClick={() => handleSelectTheme(theme)}
            className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-left text-sm transition-all ${
              selectedId === theme.id
                ? "border border-[#c9a84c] bg-[#fdf8ed] text-[#1a1a1a]"
                : "border border-transparent bg-white text-[#555555] hover:border-[#e8e8e8] hover:bg-[#fafafa]"
            }`}
          >
            <span className="text-base">{theme.icon}</span>
            <span className="text-xs">{theme.text}</span>
          </button>
        ))}
      </div>

      {/* 雙組數字輸入 */}
      {selectedTheme && (
        <div className="animate-fade-in-up">
          <p className="text-xs text-[#c9a84c] mb-2 font-medium">
            请屏息静气，凭直觉注入两组任意数字：
          </p>
          <div className="flex gap-2 mb-3">
            <input
              type="number"
              value={numOne}
              onChange={(e) => setNumOne(e.target.value)}
              placeholder="第一组数（如: 88）"
              className="flex-1 bg-[#f5f5f5] border border-[#e8e8e8] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#c9a84c] transition-colors"
            />
            <input
              type="number"
              value={numTwo}
              onChange={(e) => setNumTwo(e.target.value)}
              placeholder="第二组数（如: 92）"
              className="flex-1 bg-[#f5f5f5] border border-[#e8e8e8] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#c9a84c] transition-colors"
            />
          </div>
          <button
            onClick={handleGenerate}
            className="w-full btn-primary text-sm"
          >
            注入直觉 · 呼唤心弦指引
          </button>
        </div>
      )}

      {/* 結果面板 */}
      {report && (
        <div className="mt-4 p-4 rounded-xl border border-dashed border-[#c9a84c] bg-[#fdfaf2] animate-fade-in-up">
          <p className="text-sm font-bold text-[#c9a84c] mb-2">📝 天天问事 · Sino-NLP 双组数时空指引</p>
          <p className="text-sm text-[#1a1a1a] leading-relaxed whitespace-pre-line">{report}</p>
        </div>
      )}
    </div>
  );
}

/* ── 主組件：易卦問事頁 ── */
export default function YijingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/95 backdrop-blur-md px-4 py-4 border-b border-[#e8e8e8]">
        <div className="flex items-center gap-2">
          <Compass size={22} className="text-[#c9a84c]" />
          <div>
            <h1 className="text-xl font-bold text-[#1a1a1a] font-song">易卦问事</h1>
            <p className="text-sm text-[#888888] mt-1">
              心弦易理 · 梅花易数 × Sino-NLP 身心重塑
            </p>
          </div>
        </div>
      </header>

      <div className="flex-1 px-4 pb-24">
        {/* 簡介卡片 */}
        <div className="card bg-gradient-to-br from-[#c9a84c]/5 to-[#fdf8ed] border-[#c9a84c]/20 mt-4">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={18} className="text-[#c9a84c]" />
            <span className="text-sm font-medium text-[#c9a84c]">心弦易理</span>
          </div>
          <p className="text-xs text-[#888888] leading-relaxed">
            以梅花易数起卦，结合 Sino-NLP 六爻 × 理解层次模型，将古老易经智慧转化为现代身心转化指引。
            两个入口，两种用法：季度总纲观大势，天天问事照当下。
          </p>
        </div>

        {/* 入口一：手機號碼 */}
        <PhoneModule />

        {/* 分隔線 */}
        <div className="flex items-center gap-3 px-4 my-2">
          <div className="flex-1 h-px bg-[#e8e8e8]" />
          <span className="text-xs text-[#cccccc] font-medium">亦 须</span>
          <div className="flex-1 h-px bg-[#e8e8e8]" />
        </div>

        {/* 入口二：雙組數字 */}
        <NumberModule />

        {/* 底部說明 */}
        <div className="mt-6 text-center pb-4">
          <p className="text-xs text-[#cccccc] font-song">
            梅花易数 · 六爻对应 NLP 理解层次
          </p>
          <p className="text-xs text-[#cccccc] mt-1">
            环境行为层 | 能力身分层 | 精神信念层
          </p>
        </div>
      </div>
    </div>
  );
}
