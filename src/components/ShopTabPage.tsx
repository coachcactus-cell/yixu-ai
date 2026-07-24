"use client";

import { Sparkles, Leaf, MapPin, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import BoshanluIcon from "@/components/icons/BoshanluIcon";

/* ── 北斗七星阵菜单 ──
 * 标准北斗七星天文坐标比例（垂直版，斗杓在上倾斜如勺、斗柄向下弧线）：
 *   斗杓（勺）：天枢→天璇→天玑→天权（倾斜四边形，天枢天璇距离较远形成勺口）
 *   斗柄（弧）：天权→玉衡→开阳→摇光（三星自然弧线向下延伸）
 * 连线：天枢→天璇→天玑→天权→玉衡→开阳→摇光
 */
const STAR_MENU = [
  // index 0-3: 斗杓（倾斜如勺）
  { star: "天枢", label: "傅老和香", key: "fulao", hasContent: true, x: 28, y: 8, labelDir: "left" as const },
  { star: "天璇", label: "金炉飘香", key: "jinlu", hasContent: false, x: 64, y: 12, labelDir: "right" as const },
  { star: "天玑", label: "烧香良伴", key: "shaoxiang", hasContent: false, x: 60, y: 34, labelDir: "right" as const },
  { star: "天权", label: "海南琼脂", key: "hainan", hasContent: false, x: 40, y: 28, labelDir: "left" as const },
  // index 4-6: 斗柄（弧线向下延伸）
  { star: "玉衡", label: "香学班", key: "xiangxue", hasContent: false, x: 32, y: 46, labelDir: "right" as const },
  { star: "开阳", label: "疗愈赋能", key: "liaoyu", hasContent: false, x: 22, y: 64, labelDir: "left" as const },
  { star: "摇光", label: "拼香", key: "pinxiang", hasContent: false, x: 16, y: 84, labelDir: "left" as const },
];

// 北斗七星连线顺序：天枢→天璇→天玑→天权→玉衡→开阳→摇光
const STAR_LINKS = [
  [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6],
];

type LabelDir = "up" | "down" | "left" | "right";

const TRANSFORM: Record<LabelDir, string> = {
  up: "translate(-50%, -100%)",
  down: "translate(-50%, 8px)",
  left: "translate(-100%, -50%)",
  right: "translate(8px, -50%)",
};

const PADDING: Record<LabelDir, string> = {
  up: "0 0 12px 0",
  down: "12px 0 0 0",
  left: "0 12px 0 0",
  right: "0 0 0 12px",
};

/* ── 商品列表（真实商品 + 占位） ── */
const PRODUCTS = [
  {
    name: "愈疾香",
    desc: "古方养生 · 祛疾扶正",
    price: "¥320",
    image: "/images/shop/yujixiang-1.jpg",
    tag: "精选",
  },
  {
    name: "灵虚香",
    desc: "窖藏版 · 灵虚凝神",
    price: "¥980",
    image: "/images/shop/lingxuxiang-1.jpg",
    tag: "窖藏",
  },
  { emoji: "🌿", name: "【示例】海南沉香线香", desc: "天然沉香 · 静心凝神", price: "¥ --", tag: "即将上架" },
  { emoji: "🕯️", name: "【示例】古法和香香丸", desc: "手作合香 · 随身佩戴", price: "¥ --", tag: "即将上架" },
];

export default function ShopTabPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-[#fafafa] pb-20">
      {/* ── Hero 头部 ── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#1a1a1a] via-[#221d12] to-[#1a1a1a]">
        {/* Banner 动图（MP4），原有 banner 上文字不变 */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        >
          <source src="/videos/shop/banner.mp4" type="video/mp4" />
        </video>

        {/* 柔光装饰 */}
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-[#c9a84c]/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-8 w-44 h-44 rounded-full bg-[#8a9bae]/10 blur-3xl pointer-events-none" />

        <div className="relative px-5 pt-8 pb-7">
          {/* 左上角 logo（博山炉 icon）+ 名称 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#c9a84c]/15 border border-[#c9a84c]/30 flex items-center justify-center">
                <BoshanluIcon className="w-6 h-6 text-[#c9a84c]" />
              </div>
              <div>
                <h1 className="text-2xl font-black font-song text-white leading-none">香舖</h1>
                <p className="text-[11px] text-[#8a9bae] mt-1 tracking-wider">C Store</p>
              </div>
            </div>

            {/* Coming Soon 状态标 */}
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#c9a84c]/15 border border-[#c9a84c]/30 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c9a84c] animate-pulse" />
              <span className="text-[#c9a84c] text-xs font-semibold tracking-wide">即将上线</span>
            </span>
          </div>

          <p className="relative text-sm text-white/80 mt-4 leading-relaxed">
            传统香品 · 身心灵疗愈课程<br/>
            <span className="text-[#c9a84c]">中 · 港</span> 私域直送，安心之选
          </p>
        </div>
      </div>

      {/* ── 北斗七星阵菜单 ── */}
      <div className="px-5 pt-3 pb-2">
        <div className="text-center mb-1">
          <h2 className="text-xs font-bold font-song text-[#1a1a1a] tracking-wide">北斗七星阵</h2>
          <p className="text-[9px] text-[#999] mt-0.5">点击星点进入</p>
        </div>

        {/* 北斗七星图 — 纯 SVG 画线+星点，HTML 标签独立定位 */}
        <div className="relative w-full max-w-[360px] mx-auto" style={{ aspectRatio: "3 / 4" }}>
          {/* SVG: 连线 + 星点（同一坐标系，保证对齐） */}
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            {/* 连线 */}
            {STAR_LINKS.map(([a, b], idx) => (
              <line
                key={`line-${idx}`}
                x1={STAR_MENU[a].x}
                y1={STAR_MENU[a].y}
                x2={STAR_MENU[b].x}
                y2={STAR_MENU[b].y}
                stroke="#c9a84c"
                strokeWidth="0.4"
                strokeLinecap="round"
                opacity="0.7"
              />
            ))}

            {/* 星点光晕 + 本体 */}
            {STAR_MENU.map((item, idx) => (
              <g key={`star-${idx}`}>
                {/* 光晕 */}
                <circle
                  cx={item.x}
                  cy={item.y}
                  r="5"
                  fill="#c9a84c"
                  opacity={item.hasContent ? 0.2 : 0.1}
                />
                {/* 星点本体 — 10px 直径 */}
                <circle
                  cx={item.x}
                  cy={item.y}
                  r="2"
                  fill={item.hasContent ? "#c9a84c" : "#c9a84c"}
                  opacity={item.hasContent ? 1 : 0.55}
                />
                {/* 内核高光 */}
                <circle
                  cx={item.x}
                  cy={item.y}
                  r="0.8"
                  fill="white"
                  opacity="0.5"
                />
              </g>
            ))}
          </svg>

          {/* HTML 标签层 — 竖排文字，覆盖喺 SVG 上面，可点击 */}
          {STAR_MENU.map((item) => {
            const isHoriz = item.labelDir === "left" || item.labelDir === "right";
            return (
              <button
                key={item.key}
                onClick={() => {
                  if (item.hasContent) {
                    router.push(`/shop/${item.key}`);
                  }
                }}
                className={`absolute z-10 flex flex-col items-center ${
                  item.hasContent ? "cursor-pointer" : "cursor-default"
                }`}
                style={{
                  left: `${item.x}%`,
                  top: `${item.y}%`,
                  transform: TRANSFORM[item.labelDir],
                  padding: PADDING[item.labelDir],
                  writingMode: "vertical-rl",
                  textOrientation: "mixed",
                }}
              >
                <span className={`text-[11px] font-bold font-song leading-none ${
                  item.hasContent ? "text-[#c9a84c]/80" : "text-[#c9a84c]/50"
                }`}>
                  {item.star}
                </span>
                <span className={`text-[15px] font-black font-song leading-tight mt-1 transition-colors ${
                  item.hasContent ? "text-[#1a1a1a]" : "text-[#666]"
                }`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── 商品网格 ── */}
      <div className="px-5 pt-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="accent-line" />
          <h2 className="text-base font-bold font-song text-[#1a1a1a]">香品一览</h2>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {PRODUCTS.map((p, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl overflow-hidden border border-[#f0ede5] shadow-sm flex flex-col"
            >
              {/* 图片区 */}
              <div className="relative aspect-square bg-gradient-to-br from-[#fdf8ed] to-[#eef1f4] flex items-center justify-center overflow-hidden">
                {p.image ? (
                  <img
                    src={p.image}
                    alt={p.name}
                    className="absolute inset-0 w-full h-full object-cover"
                    onError={(e) => { e.currentTarget.style.display = "none"; }}
                  />
                ) : (
                  <span className="text-5xl opacity-60">{p.emoji}</span>
                )}
                <span
                  className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-white text-[10px] font-medium ${
                    p.image ? "bg-[#c9a84c]/90" : "bg-[#999]/70"
                  }`}
                >
                  {p.tag}
                </span>
              </div>
              <div className="p-3 flex-1 flex flex-col">
                <h3 className="text-sm font-semibold text-[#1a1a1a] leading-snug line-clamp-2">{p.name}</h3>
                <p className="text-xs text-[#999] mt-1 leading-relaxed flex-1">{p.desc}</p>
                <div className="flex items-center justify-between mt-2.5">
                  <span className="text-base font-bold text-[#c9a84c]">{p.price}</span>
                  <span className="text-[10px] text-[#aaa]">{p.image ? "新品预览" : "上架后开放"}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 私域销售说明 ── */}
      <div className="px-5 pt-6">
        <div className="bg-gradient-to-r from-[#c9a84c]/8 to-[#8a9bae]/8 rounded-2xl p-5 border border-[#c9a84c]/15">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={18} className="text-[#c9a84c]" />
            <h3 className="text-sm font-bold text-[#1a1a1a]">私域安心购</h3>
          </div>
          <div className="space-y-2.5 text-xs text-[#555] leading-relaxed">
            <div className="flex items-start gap-2">
              <MapPin size={14} className="text-[#8a9bae] flex-shrink-0 mt-0.5" />
              <span>主力服务<strong className="text-[#c9a84c]">中、港</strong>市场客户，支持两地配送。</span>
            </div>
            <div className="flex items-start gap-2">
              <Leaf size={14} className="text-[#8a9bae] flex-shrink-0 mt-0.5" />
              <span>所有香品源自非遗和香工艺，天然原料，安心可溯。</span>
            </div>
            <div className="flex items-start gap-2">
              <Clock size={14} className="text-[#8a9bae] flex-shrink-0 mt-0.5" />
              <span>上线后可于此直接浏览、下单，或由亦须先生一对一推荐。</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── 底部预告 ── */}
      <div className="px-5 pt-6 pb-2 text-center">
        <p className="text-sm font-song text-[#c9a84c]">一炉好香，静待知音</p>
        <p className="text-xs text-[#999] mt-1.5 leading-relaxed">
          香舖即将开放<br/>
          有意成为首批体验者，可先联系亦须先生
        </p>
      </div>
    </div>
  );
}
