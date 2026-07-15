"use client";

import Link from "next/link";
import { BookOpen, ArrowLeft, Sparkles } from "lucide-react";

export default function DictionaryHomePage() {
  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-gradient-to-r from-[#1a1a2e] to-[#16213e] px-4 py-4">
        <div className="max-w-md mx-auto flex items-center gap-2">
          <Link href="/" className="text-white/60 hover:text-white">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#c9a84c]" />
            <h1 className="text-base font-bold text-white font-song">经典辞典</h1>
          </div>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 py-6 pb-20">
        <div className="text-center mb-8">
          <h2 className="text-xl font-bold text-[#1a1a1a] font-song mb-2">亦须经典辞典</h2>
          <p className="text-sm text-[#666]">
            公益免费 · 知识精准 · 一看就明
          </p>
        </div>

        {/* 詞典列表 */}
        <div className="space-y-4">
          {/* 易經詞典 */}
          <Link
            href="/dictionary/yijing"
            className="block bg-white rounded-2xl p-5 border border-[#e8e8e8] hover:border-[#c9a84c]/40 hover:shadow-md transition-all active:scale-[0.98]"
          >
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#c9a84c]/10 to-[#fdf8ed] flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">☰</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-base font-bold text-[#1a1a1a] font-song">易学辞典</h3>
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#10b981]/10 text-[#10b981] font-medium">
                    已上线
                  </span>
                </div>
                <p className="text-xs text-[#666] leading-relaxed mb-2">
                  基础概念 · 六十四卦 · 爻辞术语 · 占筮术语
                </p>
                <p className="text-[10px] text-[#999]">
                  持续更新中 · 目前 10+ 条
                </p>
              </div>
            </div>
          </Link>

          {/* 唯識詞典（未上線）*/}
          <div className="bg-white rounded-2xl p-5 border border-[#e8e8e8] opacity-60">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#8a9bae]/10 to-[#f0f4ff] flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">🪷</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-base font-bold text-[#1a1a1a] font-song">唯识辞典</h3>
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#f5f5f5] text-[#999] font-medium">
                    制作中
                  </span>
                </div>
                <p className="text-xs text-[#666] leading-relaxed mb-2">
                  五位百法 · 八识 · 唯识术语
                </p>
                <p className="text-[10px] text-[#999]">
                  敬请期待
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 說明 */}
        <div className="mt-8 p-4 rounded-xl bg-[#fdf8ed] border border-[#c9a84c]/20">
          <div className="flex items-center gap-1.5 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#c9a84c]" />
            <h3 className="text-xs font-bold text-[#c9a84c]">辞典特色</h3>
          </div>
          <ul className="text-xs text-[#666] space-y-1.5 leading-relaxed">
            <li>📍 一句话明白 — 10岁都看得懂</li>
            <li>📖 白话解释 — 生活化、接地气</li>
            <li>🔬 经典原文 — 可折叠，想深究再展开</li>
            <li>🌿 生活例子 — 每条术语都有日常对照</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
