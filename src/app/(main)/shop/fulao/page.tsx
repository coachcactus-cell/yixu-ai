"use client";

import { ChevronLeft, Clock } from "lucide-react";
import Link from "next/link";
import BoshanluIcon from "@/components/icons/BoshanluIcon";

/* ── 傅老和香 — 商品列表 ── */
const FULAO_PRODUCTS = [
  {
    name: "愈疾香",
    desc: "心平能愈三千疾，心静能平万事理。古方养生香品，祛疾扶正，安神定志。",
    price: "¥320",
    image: "/images/shop/yujixiang-1.jpg",
    tag: "精选",
  },
  {
    name: "���虚香",
    desc: "窖藏版 · 灵虚凝神。黑灵虚窖藏，深沉醇厚，静心通达灵虚之境。",
    price: "¥980",
    image: "/images/shop/lingxuxiang-1.jpg",
    tag: "窖藏",
  },
];

export default function FulaoPage() {
  return (
    <div className="min-h-screen bg-[#fafafa] pb-20">
      {/* ── 顶部导航 ── */}
      <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-sm border-b border-[#f0ede5]">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/shop" className="flex items-center gap-1 text-[#666] active:text-[#c9a84c]">
            <ChevronLeft size={20} />
            <span className="text-sm">返回</span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#c9a84c]/15 border border-[#c9a84c]/30 flex items-center justify-center">
              <BoshanluIcon className="w-4.5 h-4.5 text-[#c9a84c]" />
            </div>
            <h1 className="text-base font-bold font-song text-[#1a1a1a]">傅老和香</h1>
          </div>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#c9a84c]/15 border border-[#c9a84c]/30">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c9a84c] animate-pulse" />
            <span className="text-[#c9a84c] text-[10px] font-semibold">即将上线</span>
          </span>
        </div>
      </div>

      {/* ── 分类简介 ── */}
      <div className="px-5 pt-5 pb-3">
        <div className="bg-gradient-to-r from-[#c9a84c]/8 to-[#8a9bae]/8 rounded-2xl p-4 border border-[#c9a84c]/15">
          <h2 className="text-sm font-bold font-song text-[#1a1a1a] mb-1">傅老和香</h2>
          <p className="text-xs text-[#666] leading-relaxed">
            承传非遗和香工艺，精选天然香材，古方手作。每一炉香，皆为先贤智慧之延续。
          </p>
        </div>
      </div>

      {/* ── 商品列表 ── */}
      <div className="px-5 pt-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="accent-line" />
          <h2 className="text-sm font-bold font-song text-[#1a1a1a]">香品一览</h2>
        </div>

        <div className="space-y-4">
          {FULAO_PRODUCTS.map((p, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl overflow-hidden border border-[#f0ede5] shadow-sm flex"
            >
              {/* 图片区 */}
              <div className="relative w-32 h-32 flex-shrink-0 bg-gradient-to-br from-[#fdf8ed] to-[#eef1f4] flex items-center justify-center overflow-hidden">
                {p.image ? (
                  <img
                    src={p.image}
                    alt={p.name}
                    className="absolute inset-0 w-full h-full object-cover"
                    onError={(e) => { e.currentTarget.style.display = "none"; }}
                  />
                ) : (
                  <span className="text-3xl opacity-60">🌿</span>
                )}
              </div>

              {/* 文字区 */}
              <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-base font-bold font-song text-[#1a1a1a]">{p.name}</h3>
                    <span className="px-1.5 py-0.5 rounded-full bg-[#c9a84c]/15 text-[#c9a84c] text-[9px] font-medium">
                      {p.tag}
                    </span>
                  </div>
                  <p className="text-xs text-[#999] leading-relaxed line-clamp-2">{p.desc}</p>
                </div>
                <div className="flex items-end justify-between mt-2">
                  <span className="text-lg font-bold text-[#c9a84c]">{p.price}</span>
                  <span className="text-[10px] text-[#aaa]">新品预览</span>
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
    </div>
  );
}
