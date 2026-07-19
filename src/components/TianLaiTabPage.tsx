"use client";

import { Music2 } from "lucide-react";

/**
 * 天籁 Tab 占位页（C老大稍后制作）
 * 「天籁」—— 声音疗愈 / 自然音律 / 五音疗疾
 */
export default function TianLaiTabPage() {
  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col items-center justify-center px-6">
      <div className="text-center">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#c9a84c]/20 to-[#fdf8ed] flex items-center justify-center mx-auto mb-6">
          <Music2 className="w-10 h-10 text-[#c9a84c]" />
        </div>
        <h1 className="text-2xl font-bold text-[#1a1a1a] font-song mb-3">天籁</h1>
        <p className="text-sm text-[#666] leading-relaxed max-w-xs mx-auto">
          声音疗愈 · 五音疗疾<br />
          自然之音，洗心养性
        </p>
        <p className="mt-8 text-xs text-[#999]">制作中 · 敬请期待</p>
      </div>
    </div>
  );
}
