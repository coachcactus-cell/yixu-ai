"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { Compass, Smartphone, Sparkles, ChevronDown, ChevronUp, Share2 } from "lucide-react";
import html2canvas from "html2canvas";
import {
  divineByPhone,
  divineByTime,
  generateYaoReports,
  getSeason,
  getSeasonLabel,
  isValidPhone,
} from "@/lib/divination";
import type { DivinationResult, YaoReport } from "@/lib/divination";
import { HEXAGRAMS, LOGICAL_LEVELS } from "@/data/yijing";
import PurchaseModal from "@/components/PurchaseModal";
import { useWallet } from "@/hooks/useWallet";

/* ── 人生十项 ── */
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

/* ══════════════════════════════════════════════ */
/*  爻辭×理解层次解读引擎 v2                      */
/*  核心改进：基于卦象+爻位+爻辭原文+理解层次       */
/*  生成唯一解读，不再跨卦重复                      */
/* ══════════════════════════════════════════════ */

// 提取爻辭关键词（去掉"初九："等前綴）
function extractYaoKey(yaoText: string): string {
  return yaoText.replace(/^[初二三四五上][六九]：/, "").trim();
}

// 基于爻辭关键词提取核心意象
function extractImagery(yaoKey: string): { main: string; action: string } {
  // 常见易经意象映射
  const imageryMap: Record<string, { main: string; action: string }> = {
    "潜龙勿用": { main: "潜藏的龙", action: "蓄势待发，不宜轻举妄动" },
    "见龙在田": { main: "田间的龙", action: "才华初显，等待时机" },
    "君子终日干干": { main: "日夕不懈的君子", action: "勤勉精进，警惕自省" },
    "或跃在渊": { main: "跃动的龙", action: "审时度势，进退有度" },
    "飞龙在天": { main: "腾飞的龙", action: "正当其时，大有作为" },
    "亢龙有悔": { main: "过极的龙", action: "盛极而衰，需知进退" },
    "履霜坚冰至": { main: "脚下的霜", action: "见微知著，防患未然" },
    "直方大": { main: "正直方大的地", action: "守正而行，不待勉强" },
    "含章可贞": { main: "蕴藏的美质", action: "内敛才华，以待其时" },
    "括囊无咎": { main: "扎紧的口袋", action: "谨言慎行，明哲保身" },
    "黄裳元吉": { main: "黄色的衣裳", action: "居中守正，大吉之象" },
    "龙战于野": { main: "旷野的龙战", action: "阴阳交争，需守中道" },
  };

  // 精确匹配
  if (imageryMap[yaoKey]) return imageryMap[yaoKey];

  // 模糊匹配关键词
  const keywords: Record<string, { main: string; action: string }> = {
    "龙": { main: "龙的变化", action: "随势而动，把握时机" },
    "君子": { main: "君子的修为", action: "持守正道，言行有度" },
    "吉": { main: "吉祥之象", action: "顺势而行，自得天助" },
    "凶": { main: "凶险之兆", action: "退守为上，谨慎应对" },
    "无咎": { main: "无过之象", action: "守正即可，无需强求" },
    "利": { main: "有利之势", action: "把握机遇，果断行动" },
    "贞": { main: "守正之象", action: "持守本心，不随外变" },
    "悔": { main: "悔悟之机", action: "反思改过，转危为安" },
    "吝": { main: "困吝之象", action: "小心行事，避免冒进" },
    "往": { main: "前行之路", action: "择善而往，不盲从" },
    "孚": { main: "诚信之德", action: "以诚待人，信可通达" },
    "师": { main: "众人之力", action: "凝聚合力，纪律为要" },
    "蹇": { main: "艰难之行", action: "正视困境，宜守不宜进" },
    "困": { main: "受困之境", action: "坚守信念，困中求通" },
    "渐": { main: "渐进之势", action: "循序渐进，不急不躁" },
    "归": { main: "归往之象", action: "找到归属，安其所安" },
    "亨": { main: "通达之象", action: "畅通无阻，宜行正道" },
    "否": { main: "闭塞之象", action: "韬光养晦，等待转机" },
    "剥": { main: "剥落之象", action: "顺时而退，保全根本" },
    "复": { main: "复归之象", action: "否极泰来，正气回升" },
    "坎": { main: "险陷之境", action: "以诚破险，不失信念" },
    "离": { main: "光明之象", action: "依附光明，照亮前路" },
    "震": { main: "震动之变", action: "临变不惧，修省自持" },
    "巽": { main: "柔顺之风", action: "谦逊行事，以柔克刚" },
    "艮": { main: "止息之象", action: "当止则止，静待其时" },
    "兑": { main: "喜悦之象", action: "和悦相处，以诚为本" },
  };

  for (const [key, val] of Object.entries(keywords)) {
    if (yaoKey.includes(key)) return val;
  }

  return { main: "爻象所示", action: "审慎体悟，以变应变" };
}

// 根据理解层次 + 卦名 + 爻位 + 意象 → 生成唯一解读
function generateYaoNLP(
  hexagramName: string,
  position: number,
  yaoKey: string,
  level: string,
  isYang: boolean,
  isDong: boolean
): string {
  const { main, action } = extractImagery(yaoKey);
  const yinYang = isYang ? "阳刚主动" : "阴柔承顺";
  const posLabel = ["初", "二", "三", "四", "五", "上"][position - 1];

  // 每个层次的解读模板，融入卦名+爻位+意象
  const levelInterpretations: Record<string, string> = {
    "环境": `在${hexagramName}卦的${posLabel}位，${main}揭示了你当下的外在处境。${yaoKey}——${action}。环境正在释放信号：${isYang ? "外在条件已具备行动的基础" : "外在条件尚需沉淀与等待"}。此爻提醒你审视周遭，${isDong ? "环境正处于关键转折点，不可忽视" : "留意环境的变化节奏"}。`,

    "行为": `${hexagramName}卦${posLabel}爻，${main}映照你近期的行为模式。${yaoKey}——你的行动正在${isYang ? "积极推动" : "被动承受"}某种结果。${action}。此爻提示：${isDong ? "你的行为正面临重大调整，旧的应对方式需要更新" : "觉察你惯常的应对，是否仍在重复无效的模式"}。`,

    "能力": `${hexagramName}卦${posLabel}位，${main}触及你的能力与策略层面。${yaoKey}——${action}。你的${yinYang}特质正在被考验：${isYang ? "是否懂得收敛锋芒，在力量之外加上智慧" : "是否能在柔和中找到坚定，不因退让而失守"}。${isDong ? "此刻正是突破能力瓶颈的契机，不要回避挑战" : "在现有能力框架中，寻找微调与精进的空间"}。`,

    "信念价值": `${hexagramName}卦${posLabel}爻，${main}直指你深层的信念系统。${yaoKey}——${action}。此爻追问：什么是你真正相信的？${isDong ? "你的价值观正经历重大校准——旧信念在松动，新的可能正在进入。容许这种不稳固，它是成长的信号" : "检查那些你习以为常的信念，它们是否仍在为你服务"}。`,

    "身份": `${hexagramName}卦${posLabel}位，${main}映照「我是谁」的根本追问。${yaoKey}——${action}。你的身份认同正在${isYang ? "从内在力量重新定义自己" : "从外在关系中重新寻找定位"}。${isDong ? "此刻你正经历角色的蜕变——不必急于定义新的自己，允许转变自然发生" : "你如何看待自己，决定了你如何面对这个世界"}。`,

    "精神": `${hexagramName}卦${posLabel}爻，${main}触及你与更大力量的关系。${yaoKey}——${action}。此爻召唤你超越个人得失的视角：${isYang ? "在主动创造中感受与天地的共振" : "在顺随接纳中体悟与万物的连结"}。${isDong ? "你与更高意义的连结正在被激活——静心聆听，答案不在外面，在你之内" : "回归内在的宁静，你与更大整体的关联一直在那里"}。`,
  };

  return levelInterpretations[level] || levelInterpretations["环境"];
}

// 动爻詳解：5-6句深度解读
function generateDongYaoNLP(
  hexagramName: string,
  position: number,
  yaoKey: string,
  level: string,
  isYang: boolean
): string {
  const { main, action } = extractImagery(yaoKey);
  const posLabel = ["初", "二", "三", "四", "五", "上"][position - 1];

  const dongInterpretations: Record<string, string> = {
    "环境": `【动爻·环境层】\n\n${hexagramName}卦${posLabel}爻为动爻，格外有力。${main}——${yaoKey}——揭示你当下的外在环境正在发生关键转变。\n\n旧有的格局正在松动，新的条件正在形成。不要抗拒变化，而是观察：环境在告诉你什么？顺势而为，比逆流而上更有力量。\n\n此刻适合调整你的外在节奏，${isYang ? "主动创造有利条件" : "先稳住脚跟，再图发展"}。`,

    "行为": `【动爻·行为层】\n\n${hexagramName}卦${posLabel}爻为动爻，你的行为模式正面临转折。${main}——${yaoKey}——你惯常的应对方式已经到了需要更新的时刻。\n\n觉察你正在重复的行为——它们是否还在为你服务？有时候，最简单的改变就是：停下来，换一种方式去做。\n\n调动你的${isYang ? "决断力，该出手时就出手" : "感受力，用柔软的方式回应刚硬的处境"}。`,

    "能力": `【动爻·能力层】\n\n${hexagramName}卦${posLabel}爻为动爻，你的能力与策略正被深度检视。${main}——${yaoKey}——不是你不够好，而是旧的策略已经不够用了。\n\n这正是学习新方法、拓展新视角的时机。${action}。能力不是一蹴而就的，而是在挑战中一层层长出来的。\n\n${isYang ? "你已经具备了突破的力量，缺的只是合适的切入点" : "柔韧也是一种力量，在退让中积蓄，在沉稳中精进"}。`,

    "信念价值": `【动爻·信念价值层】\n\n${hexagramName}卦${posLabel}爻为动爻，直指你最深层的信念系统。${main}——${yaoKey}——你正在经历一次价值观的重新校准。\n\n旧的信念在崩塌，新的信念尚未稳固——这是关键的转折点。问自己：我真正相信的是什么？什么规条在束缚我？\n\n${isYang ? "有勇气打破旧信念，才能容纳新的可能" : "不必急于建立新的信念框架，先容许不确定性存在"}。`,

    "身份": `【动爻·身份层】\n\n${hexagramName}卦${posLabel}爻为动爻，你的身份认同正在被重塑。${main}——${yaoKey}——「我是谁」这个根本问题正在被重新回答。\n\n你可能正在经历角色的转变——从某种旧的身份中脱离，走向新的自我定义。这个过程需要时间与勇气。\n\n${isYang ? "你不需要向外在证明自己的价值，你本自具足" : "在关系的镜映中重新认识自己，你不只是别人眼中的角色"}。`,

    "精神": `【动爻·精神层】\n\n${hexagramName}卦${posLabel}爻为动爻，触及你与更大力量的关系。${main}——${yaoKey}——你与天地万物、与更高意义的连结，正在呼唤你的觉察。\n\n这不是关于个人的得失，而是关于你在更大的整体中如何安放自己。放下「小我」的执着，看见「大我」的流向。\n\n此刻，静心聆听内在的声音——它不在喧嚣中，而在你深处的宁静里。`,

  };

  return dongInterpretations[level] || dongInterpretations["环境"];
}

/* ── SVG 六爻图 ── */
function HexagramSVG({ lines, dongYao }: { lines: number[]; dongYao: number }) {
  return (
    <div className="flex flex-col items-center gap-1.5 my-4">
      {lines.map((line, i) => {
        const pos = 6 - i;
        const isDong = pos === dongYao;
        const isYang = line === 1;

        return (
          <div key={i} className="flex items-center gap-1">
            {isDong && (
              <span className="text-xs text-[#c9a84c] font-bold w-5 text-right">▶</span>
            )}
            {!isDong && <span className="w-5" />}
            {isYang ? (
              <div
                className={`h-[7px] w-24 rounded-sm transition-all ${
                  isDong ? "bg-[#c9a84c] shadow-md shadow-[#c9a84c]/40" : "bg-[#1a1a1a]"
                }`}
              />
            ) : (
              <div className="flex gap-2.5">
                <div
                  className={`h-[7px] w-9 rounded-sm transition-all ${
                    isDong ? "bg-[#c9a84c] shadow-md shadow-[#c9a84c]/40" : "bg-[#1a1a1a]"
                  }`}
                />
                <div
                  className={`h-[7px] w-9 rounded-sm transition-all ${
                    isDong ? "bg-[#c9a84c] shadow-md shadow-[#c9a84c]/40" : "bg-[#1a1a1a]"
                  }`}
                />
              </div>
            )}
            {!isDong && <span className="w-5" />}
            {isDong && (
              <span className="text-xs text-[#c9a84c] font-bold w-5">◀</span>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ── 爻辭报告卡片 ── */
function YaoCard({ report, hexagramName }: { report: YaoReport; hexagramName: string }) {
  const [expanded, setExpanded] = useState(report.isDongYao);

  const yaoKey = useMemo(() => extractYaoKey(report.yaoText), [report.yaoText]);

  const interpretation = useMemo(() => {
    if (report.isDongYao) {
      return generateDongYaoNLP(hexagramName, report.position, yaoKey, report.level, report.isYang);
    }
    return generateYaoNLP(hexagramName, report.position, yaoKey, report.level, report.isYang, false);
  }, [hexagramName, report.position, yaoKey, report.level, report.isYang, report.isDongYao]);

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
        className="w-full flex items-center gap-3 px-4 py-3.5 text-left"
      >
        {/* 爻位 + 阴阳符号 */}
        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
          report.isDongYao ? "bg-[#c9a84c] text-white" : "bg-[#f5f5f5] text-[#666666]"
        }`}>
          {report.position}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm text-[#c9a84c] font-semibold">{report.level}</span>
            {report.isDongYao && (
              <span className="text-xs bg-[#c9a84c]/10 text-[#c9a84c] px-2 py-0.5 rounded-full font-bold">
                动爻
              </span>
            )}
          </div>
          <p className="text-sm text-[#1a1a1a] font-medium mt-0.5 truncate">
            {report.yaoText}
          </p>
        </div>

        {expanded ? (
          <ChevronUp size={18} className="text-[#999999] flex-shrink-0" />
        ) : (
          <ChevronDown size={18} className="text-[#999999] flex-shrink-0" />
        )}
      </button>

      {expanded && (
        <div className="px-4 pb-4 pt-0 animate-fade-in-up">
          <div className="pl-12">
            <p className="text-sm text-[#333333] leading-relaxed whitespace-pre-line">
              {interpretation}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── 完整报告页 ── */
function ReportView({ result, onClose, unlocked, onUnlock }: { result: DivinationResult; onClose: () => void; unlocked: boolean; onUnlock: () => void }) {
  const { hexagram, upperGuaName, lowerGuaName, dongYao, season, topic } = result;
  const yaoReports = generateYaoReports(result);

  const seasonLabel = season ? getSeasonLabel(season) : "";

  return (
    <div className="flex flex-col min-h-screen bg-white animate-fade-in-up">
      {/* Header */}
      <header className="sticky-header bg-white/95 backdrop-blur-md px-4 py-3 border-b border-[#e8e8e8]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass size={20} className="text-[#c9a84c]" />
            <h1 className="text-lg font-bold text-[#1a1a1a] font-song">点卦报告</h1>
          </div>
          <button
            onClick={onClose}
            className="text-sm text-[#c9a84c] font-semibold"
          >
            重新问卦
          </button>
        </div>
      </header>

      <div className="flex-1 px-4 pb-24 content-below-header">
        {/* 卦象主卡片 */}
        <div className="card border-[#c9a84c]/30 bg-gradient-to-b from-[#fdf8ed]/50 to-white">
          {/* 季節/课题标籤 */}
          {seasonLabel && (
            <p className="text-sm text-[#c9a84c] font-medium mb-1">{seasonLabel}</p>
          )}
          {topic && (
            <p className="text-sm text-[#c9a84c] font-medium mb-1">咨询：{topic}</p>
          )}

          {/* 卦名 */}
          <h2 className="text-3xl font-black text-[#1a1a1a] font-song text-center mb-1">
            {hexagram.name}
          </h2>
          <p className="text-sm text-[#666666] text-center mb-4">
            上{upperGuaName} 下{lowerGuaName} · 动第{dongYao}爻
          </p>

          {/* 六爻图 */}
          <HexagramSVG lines={hexagram.lines} dongYao={dongYao} />

          {/* 卦辭 */}
          <div className="mt-4 p-3.5 rounded-lg bg-[#fdf8ed] border border-[#c9a84c]/20">
            <p className="text-sm font-bold text-[#c9a84c] mb-1">卦辞</p>
            <p className="text-base text-[#1a1a1a] leading-relaxed">{hexagram.judgement}</p>
          </div>

          {/* 大象 */}
          <div className="mt-2 p-3.5 rounded-lg bg-[#f9fafb] border border-[#e8e8e8]">
            <p className="text-sm font-bold text-[#666666] mb-1">象曰</p>
            <p className="text-base text-[#1a1a1a] leading-relaxed">{hexagram.image}</p>
          </div>

          {/* 整体解读 */}
          <div className="mt-2 p-3.5 rounded-lg bg-white border border-[#e8e8e8]">
            <p className="text-sm font-bold text-[#1a1a1a] mb-1">解读</p>
            <p className="text-base text-[#444444] leading-relaxed">{hexagram.interpretation}</p>
          </div>
        </div>

        {/* 六爻×理解层次 */}
        <div className="mt-4">
          <h3 className="section-header">六爻 · 理解层次</h3>
          <p className="text-sm text-[#777777] px-4 -mt-2 mb-3">
            每一爻对应一个理解层次，动爻详解
          </p>
          <div className="space-y-2">
            {yaoReports.map((r) => (
              <YaoCard key={r.position} report={r} hexagramName={hexagram.name} />
            ))}
          </div>
        </div>

        {/* 付费詳細报告 / 深度解读 */}
        {unlocked ? (
          <div className="card mt-6 bg-gradient-to-r from-[#f0faf0] to-white border-[#27ae60]/30 text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#27ae6015] mb-2">
              <Sparkles size={14} className="text-[#27ae60]" />
              <span className="text-sm font-semibold text-[#27ae60]">已解锁</span>
            </div>
            <p className="text-base font-bold text-[#1a1a1a] mb-1">深度解读报告</p>
            <p className="text-sm text-[#555555] leading-relaxed text-left mt-3">
              结合Sino-NLP体系与易经智慧，您的卦象揭示了深层的身心指引。请结合上方六爻理解层次的解读，深入体会每一爻在您生命中的映射。
            </p>
          </div>
        ) : (
          <div className="card mt-6 bg-gradient-to-r from-[#fdf8ed] to-white border-[#c9a84c]/30 text-center">
            <Sparkles size={20} className="mx-auto text-[#c9a84c] mb-2" />
            <p className="text-base font-bold text-[#1a1a1a] mb-1">获取详细报告</p>
            <p className="text-sm text-[#666666] mb-3">
              包含1000字深度解读，结合Sino-NLP体系与易经智慧的完整分析
            </p>
            <button
              onClick={onUnlock}
              className="btn-primary text-sm py-2.5 px-8"
            >
              解锁详细报告 · 付费
            </button>
          </div>
        )}

        {/* 分享按鈕 */}
        <div className="mt-3 flex gap-3">
          <button
            onClick={async () => {
              const el = document.getElementById("yijing-share-card");
              if (!el) return;
              const canvas = await html2canvas(el, { backgroundColor: "#ffffff", scale: 2 });
              const link = document.createElement("a");
              link.download = `亦须AI_易卦_${hexagram.name}.png`;
              link.href = canvas.toDataURL("image/png");
              link.click();
            }}
            className="flex-1 py-3 rounded-xl border border-[#c9a84c] text-[#c9a84c] font-bold text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform"
          >
            <Share2 size={16} /> 保存分享图
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════ */
/*  主页面：点心问卦                              */
/* ══════════════════════════════════════════════ */

export default function YijingPage() {
  const [activeModule, setActiveModule] = useState<"none" | "phone" | "life">("none");
  const [result, setResult] = useState<DivinationResult | null>(null);
  const { isUnlocked } = useWallet();
  const [showPurchase, setShowPurchase] = useState(false);
  const yijingUnlocked = isUnlocked("yijing");

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

  // 清理计时器
  useEffect(() => {
    return () => {
      if (breathTimerRef.current) clearTimeout(breathTimerRef.current);
    };
  }, []);

  /* ── 入口一：手机号起卦 ── */
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

  /* ── 入口二：时间+狀態分起卦 ── */
  const handleTopicSelect = (name: string, hint: string) => {
    setSelectedTopic(hint);
    setSelectedTopicName(name);
    setShowBreath(true);
    setShowClickBtn(false);

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

  /* ── 如果有结果，显示报告 ── */
  if (result) {
    return <ReportView result={result} onClose={() => setResult(null)} unlocked={yijingUnlocked} onUnlock={() => setShowPurchase(true)} />;
  }

  /* ── 主页面 ── */
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <header className="sticky-header bg-white/95 backdrop-blur-md px-4 py-4 border-b border-[#e8e8e8]">
        <div className="flex items-center gap-2">
          <Compass size={22} className="text-[#c9a84c]" />
          <div>
            <h1 className="text-xl font-bold text-[#1a1a1a] font-song">掛住心掛卦</h1>
            <p className="text-sm text-[#666666] mt-1">
              梅花易数 × Sino-NLP 理解层次
            </p>
          </div>
        </div>
      </header>

      <div className="flex-1 px-4 pb-24 content-below-header">
        {/* 簡介卡片 */}
        <div className="card bg-gradient-to-br from-[#c9a84c]/5 to-[#fdf8ed] border-[#c9a84c]/20">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={18} className="text-[#c9a84c]" />
            <span className="text-sm font-semibold text-[#c9a84c]">掛住心掛卦</span>
          </div>
          <p className="text-sm text-[#666666] leading-relaxed">
            以梅花易数先天八卦起卦，结合Sino-NLP理解层次模型，将易经384爻辞智慧转化为现代身心指引。两个入口，两种问法。
          </p>
        </div>

        {/* ═══ 入口一：季度咨询 ═══ */}
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
              <p className="text-sm text-[#666666]">{seasonLabel}</p>
            </div>
            {activeModule === "phone" ? (
              <ChevronUp size={18} className="text-[#999999]" />
            ) : (
              <ChevronDown size={18} className="text-[#999999]" />
            )}
          </button>

          {activeModule === "phone" && (
            <div className="mt-4 animate-fade-in-up">
              <p className="text-sm text-[#666666] mb-3">
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
                  className="flex-1 bg-[#f5f5f5] border border-[#e8e8e8] rounded-lg px-3 py-2.5 text-base outline-none focus:border-[#c9a84c] transition-colors"
                />
                <button
                  onClick={handlePhoneDivine}
                  className="btn-primary text-sm py-2 px-4 flex-shrink-0"
                >
                  起卦
                </button>
              </div>
              {phoneError && (
                <p className="text-sm text-red-500 mt-2">{phoneError}</p>
              )}
              <p className="text-xs text-[#999999] mt-2">
                接受任何国家手机号，号码仅用于起卦运算
              </p>
            </div>
          )}
        </div>

        {/* 分隔线 */}
        <div className="flex items-center gap-3 px-4 my-1">
          <div className="flex-1 h-px bg-[#e8e8e8]" />
          <span className="text-sm text-[#999999] font-song">亦 须</span>
          <div className="flex-1 h-px bg-[#e8e8e8]" />
        </div>

        {/* ═══ 入口二：生活咨询 ═══ */}
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
              <p className="text-sm text-[#666666]">选择课题，当下指引</p>
            </div>
            {activeModule === "life" ? (
              <ChevronUp size={18} className="text-[#999999]" />
            ) : (
              <ChevronDown size={18} className="text-[#999999]" />
            )}
          </button>

          {activeModule === "life" && !showBreath && (
            <div className="mt-4 animate-fade-in-up">
              <p className="text-sm text-[#666666] mb-3">选择你想咨询的课题：</p>
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
                    <span className="text-lg">{t.icon}</span>
                    <p className="text-sm font-medium text-[#1a1a1a] mt-1">{t.name}</p>
                    <p className="text-xs text-[#777777] leading-snug mt-0.5">{t.hint}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeModule === "life" && showBreath && (
            <div className="mt-4 animate-fade-in-up text-center">
              {/* 已选课题 */}
              <div className="flex items-center justify-center gap-2 mb-6">
                <span className="gold-tag">{selectedTopicName}</span>
              </div>

              {!showClickBtn ? (
                /* 呼吸引导 */
                <div className="py-8">
                  <div className="w-20 h-20 rounded-full bg-[#fdf8ed] mx-auto mb-4 flex items-center justify-center animate-pulse">
                    <span className="text-3xl">🙏</span>
                  </div>
                  <p className="text-base text-[#1a1a1a] font-medium leading-relaxed">
                    请您闭上眼睛<br />
                    深深呼吸<br />
                    放松肩膀 5 秒<br />
                    然后再张开眼睛
                  </p>
                  <p className="text-sm text-[#999999] mt-3">正在准备中...</p>
                </div>
              ) : (
                /* 狀態分 + 起卦按鈕 */
                <div className="py-4">
                  <p className="text-base text-[#c9a84c] font-medium mb-4">
                    张开眼睛了？为你当下的状态打个分：
                  </p>

                  {/* 狀態分 Slider */}
                  <div className="px-4 mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-[#777777]">低落</span>
                      <span className="text-2xl font-bold text-[#c9a84c] font-song">{score}</span>
                      <span className="text-sm text-[#777777]">充沛</span>
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

              {/* 返回选题 */}
              <button
                onClick={() => {
                  setShowBreath(false);
                  setShowClickBtn(false);
                  setSelectedTopic(null);
                  setSelectedTopicName(null);
                  if (breathTimerRef.current) clearTimeout(breathTimerRef.current);
                }}
                className="text-sm text-[#999999] mt-4 underline"
              >
                重新选择课题
              </button>
            </div>
          )}
        </div>

        {/* 底部说明 */}
        <div className="mt-6 text-center pb-4">
          <p className="text-sm text-[#999999] font-song">
            梅花易数 · 先天八卦数 · NLP理解层次
          </p>
          <p className="text-sm text-[#999999] mt-1">
            环境 | 行为 | 能力 | 信念价值 | 身份 | 精神
          </p>
        </div>
      </div>

      {/* 购买弹窗 */}
      <PurchaseModal
        assessmentId="yijing"
        assessmentName="易卦占卜"
        visible={showPurchase}
        onPurchased={() => setShowPurchase(false)}
        onClose={() => setShowPurchase(false)}
      />
    </div>
  );
}
