"use client";

import { ChevronLeft, Clock } from "lucide-react";
import Link from "next/link";
import BoshanluIcon from "@/components/icons/BoshanluIcon";
import { FULAO_CATEGORIES } from "@/data/fulaoData";

const CATEGORY_ICONS: Record<string, string> = {
  gongting: "👑",
  wenren: "📚",
  fangyi: "🛡️",
  shuyuan: "🌸",
  yuanchuang: "✨",
  wanfen: "💊",
  yangsheng: "🧘",
  honglou: "🎭",
  huaxun: "🌹",
};

export default function FulaoPage() {
  return (
    <div className="min-h-screen bg-[#fafafa] pb-20">
      {/* ── Banner 区 ── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#1a1a1a] via-[#221d12] to-[#1a1a1a]">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        >
          <source src="/videos/shop/banner.mp4" type="video/mp4" />
        </video>

        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-[#c9a84c]/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-8 w-44 h-44 rounded-full bg-[#8a9bae]/10 blur-3xl pointer-events-none" />

        <div className="relative px-5 pt-6 pb-7">
          {/* 顶部导航 */}
          <div className="flex items-center mb-4">
            <Link href="/shop" className="flex items-center gap-1 text-white/70 active:text-[#c9a84c]">
              <ChevronLeft size={20} />
              <span className="text-sm">香舖</span>
            </Link>
          </div>

          {/* 标题 */}
          <h1 className="text-2xl font-black font-song text-white leading-none">傅老和香</h1>
          <p className="text-sm text-white/70 mt-2 leading-relaxed">
            山东慧通香业 · 傅京亮和香全品图鉴<br/>
            <span className="text-[#c9a84c]">9 大系列 · 28 款香品</span>
          </p>
        </div>
      </div>

      {/* ── 简介卡 ── */}
      <div className="px-5 -mt-4 relative z-10">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#f0ede5]">
          <div className="flex items-center gap-2 mb-2">
            <span className="accent-line" />
            <h2 className="text-sm font-bold font-song text-[#1a1a1a]">傅老和香</h2>
          </div>
          <p className="text-xs text-[#666] leading-relaxed">
            承传非遗和香工艺，精选天然香材，古方手作。每一炉香，皆为先贤智慧之延续。
          </p>
          <div className="mt-3 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#c9a84c]/15 border border-[#c9a84c]/30">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c9a84c] animate-pulse" />
              <span className="text-[#c9a84c] text-[10px] font-semibold">即将上线</span>
            </span>
          </div>
        </div>
      </div>

      {/* ── 9 大分类入口 ── */}
      <div className="px-5 pt-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="accent-line" />
          <h2 className="text-sm font-bold font-song text-[#1a1a1a]">香品系列</h2>
        </div>

        <div className="space-y-3">
          {FULAO_CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/shop/fulao/${cat.id}`}
              className="block bg-white rounded-2xl p-4 border border-[#f0ede5] shadow-sm active:scale-[0.98] transition-transform"
            >
              <div className="flex items-center gap-3">
                {/* 图标 */}
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#fdf8ed] to-[#eef1f4] flex items-center justify-center flex-shrink-0 text-2xl">
                  {CATEGORY_ICONS[cat.id] || "🌿"}
                </div>

                {/* 文字 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold font-song text-[#1a1a1a]">{cat.name}</h3>
                    <span className="text-[10px] text-[#aaa]">{cat.products.length} 款</span>
                  </div>
                  <p className="text-[11px] text-[#999] mt-1 leading-relaxed line-clamp-1">{cat.subtitle}</p>
                </div>

                {/* 箭头 */}
                <ChevronLeft size={18} className="text-[#ccc] rotate-180 flex-shrink-0" />
              </div>
            </Link>
          ))}
        </div>

        {/* ── 预告 ── */}
        <div className="mt-6 flex items-start gap-2 bg-[#fdf8ed] rounded-xl p-4 border border-[#c9a84c]/10">
          <Clock size={16} className="text-[#c9a84c] flex-shrink-0 mt-0.5" />
          <p className="text-xs text-[#666] leading-relaxed">
            香舖即将开放购买功能。上线后可于此直接下单，或由亦须先生一对一推荐选用。
          </p>
        </div>
      </div>

      {/* ── 底部 ── */}
      <div className="px-5 pt-5 pb-2 text-center">
        <Link href="/shop" className="text-sm font-song text-[#c9a84c]">
          返回香舖
        </Link>
      </div>
    </div>
  );
}
