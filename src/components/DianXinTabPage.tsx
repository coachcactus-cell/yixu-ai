"use client";

import { Cookie } from "lucide-react";

/**
 * 点心 Tab 占位页（C老大稍后制作）
 * 「点心」—— 晚安推送 / Sino-NLP 点心话 / 轻量疗愈内容
 */
export default function DianXinTabPage() {
  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col items-center justify-center px-6">
      <div className="text-center">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#c9a84c]/20 to-[#fdf8ed] flex items-center justify-center mx-auto mb-6">
          <Cookie className="w-10 h-10 text-[#c9a84c]" />
        </div>
        <h1 className="text-2xl font-bold text-[#1a1a1a] font-song mb-3">点心</h1>
        <p className="text-sm text-[#666] leading-relaxed max-w-xs mx-auto">
          深夜疗愈推送<br />
          一点小点心，暖心一整夜
        </p>
        <p className="mt-8 text-xs text-[#999]">制作中 · 敬请期待</p>
      </div>
    </div>
  );
}
