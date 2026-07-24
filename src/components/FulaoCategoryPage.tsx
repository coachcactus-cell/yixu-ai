"use client";

import { ChevronLeft, Clock } from "lucide-react";
import Link from "next/link";
import BoshanluIcon from "@/components/icons/BoshanluIcon";
import { getCategoryById } from "@/data/fulaoData";

export default function FulaoCategoryPage({ categoryId }: { categoryId: string }) {
  const category = getCategoryById(categoryId);

  if (!category) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#999] text-sm mb-4">分类未找到</p>
          <Link href="/shop/fulao" className="text-[#c9a84c] text-sm">返回傅老和香</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] pb-20">
      {/* ── Banner 区（黑色底 + 出烟动图） ── */}
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

        {/* 柔光装饰 */}
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-[#c9a84c]/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-8 w-44 h-44 rounded-full bg-[#8a9bae]/10 blur-3xl pointer-events-none" />

        <div className="relative px-5 pt-6 pb-7">
          {/* 顶部导航 */}
          <div className="flex items-center justify-between mb-4">
            <Link href="/shop/fulao" className="flex items-center gap-1 text-white/70 active:text-[#c9a84c]">
              <ChevronLeft size={20} />
              <span className="text-sm">傅老和香</span>
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#c9a84c]/15 border border-[#c9a84c]/30 flex items-center justify-center">
                <BoshanluIcon className="w-5 h-5 text-[#c9a84c]" />
              </div>
            </div>
          </div>

          {/* 分类名 */}
          <h1 className="text-2xl font-black font-song text-white leading-tight">{category.name}</h1>
          <p className="text-sm text-white/70 mt-2 leading-relaxed">{category.subtitle}</p>
        </div>
      </div>

      {/* ── 分类简介卡 ── */}
      <div className="px-5 -mt-4 relative z-10">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#f0ede5]">
          <div className="flex items-center gap-2 mb-2">
            <span className="accent-line" />
            <h2 className="text-sm font-bold font-song text-[#1a1a1a]">{category.name}</h2>
          </div>
          <p className="text-xs text-[#666] leading-relaxed">
            承传非遗和香工艺，精选天然香材，古方手作。每一炉香，皆为先贤智慧之延续。
          </p>
          <div className="mt-3 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#c9a84c]/15 border border-[#c9a84c]/30">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c9a84c] animate-pulse" />
              <span className="text-[#c9a84c] text-[10px] font-semibold">即将上线</span>
            </span>
            <span className="text-[10px] text-[#aaa]">共 {category.products.length} 款</span>
          </div>
        </div>
      </div>

      {/* ── 产品列表 ── */}
      <div className="px-5 pt-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="accent-line" />
          <h2 className="text-sm font-bold font-song text-[#1a1a1a]">香品一览</h2>
        </div>

        <div className="space-y-4">
          {category.products.map((p, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl overflow-hidden border border-[#f0ede5] shadow-sm flex"
            >
              {/* 图片区 */}
              <div className="relative w-28 h-28 flex-shrink-0 bg-gradient-to-br from-[#fdf8ed] to-[#eef1f4] flex items-center justify-center overflow-hidden">
                {p.image ? (
                  <img
                    src={p.image}
                    alt={p.name}
                    className="absolute inset-0 w-full h-full object-cover"
                    onError={(e) => { e.currentTarget.style.display = "none"; }}
                  />
                ) : (
                  <span className="text-3xl opacity-50">🌿</span>
                )}
                {p.tag && (
                  <span className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded-full bg-[#c9a84c]/90 text-white text-[8px] font-medium">
                    {p.tag}
                  </span>
                )}
              </div>

              {/* 文字区 */}
              <div className="flex-1 p-3.5 flex flex-col justify-between min-w-0">
                <div>
                  <h3 className="text-sm font-bold font-song text-[#1a1a1a] leading-snug">{p.name}</h3>
                  <p className="text-[11px] text-[#999] mt-1 leading-relaxed line-clamp-2">
                    {p.ingredients}
                  </p>
                  <p className="text-[11px] text-[#aaa] mt-1 leading-relaxed line-clamp-2">
                    {p.usage}
                  </p>
                </div>
                <div className="flex items-end justify-between mt-2">
                  <span className="text-base font-bold text-[#c9a84c]">{p.price}</span>
                  <span className="text-[9px] text-[#aaa]">{p.image ? "新品预览" : "待上架"}</span>
                </div>
              </div>
            </div>
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
        <Link href="/shop/fulao" className="text-sm font-song text-[#c9a84c]">
          返回傅老和香
        </Link>
      </div>
    </div>
  );
}
