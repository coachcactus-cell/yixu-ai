"use client";

import { useState } from "react";
import {
  Crown,
  MessageCircle,
  ClipboardList,
  BookOpen,
  Heart,
  ChevronRight,
  Star,
  Sparkles,
} from "lucide-react";

const VIP_PLANS = [
  {
    name: "月会员",
    price: "¥29",
    period: "/月",
    features: ["无限 AI 对话", "独家修行内容", "所有测评免费", "优先线下活动报名"],
    popular: false,
  },
  {
    name: "年会员",
    price: "¥299",
    period: "/年",
    features: ["月会员全部权益", "个人化修行路径", "1对1 线上咨询 1 次", "线下活动 8 折"],
    popular: true,
    save: "省 ¥49",
  },
];

export default function ProfilePage() {
  const [showVIP, setShowVIP] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/95 backdrop-blur-md px-4 py-4 border-b border-[#e8e8e8]">
        <h1 className="text-xl font-bold text-[#1a1a1a] font-song">我的</h1>
      </header>

      <div className="flex-1 px-4 pb-20">
        {/* User Card */}
        <div className="card mt-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[#c9a84c] flex items-center justify-center bg-[#fdf8ed]">
              <img
                src="/cartoon-formal.jpg"
                alt="亦须先生"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="font-bold text-lg text-[#1a1a1a] font-song">修行者</h2>
              <div className="flex items-center gap-1 mt-1">
                <span className="gold-tag">
                  免费会员
                </span>
              </div>
            </div>
            <button
              onClick={() => setShowVIP(!showVIP)}
              className="ml-auto btn-primary text-sm py-2 px-4"
            >
              <Crown size={14} />
              升级 VIP
            </button>
          </div>
        </div>

        {/* VIP Plans (expandable) */}
        {showVIP && (
          <div className="mt-3 space-y-3 animate-fade-in-up">
            <h3 className="section-header">选择你的修行计划</h3>
            {VIP_PLANS.map((plan, i) => (
              <div
                key={i}
                className={`card relative ${
                  plan.popular
                    ? "border-2 border-[#c9a84c] bg-[#fdf8ed]"
                    : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-2 right-4 bg-[#c9a84c] text-white text-xs px-3 py-0.5 rounded-full font-bold">
                    最多人选择
                  </div>
                )}
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-[#1a1a1a]">{plan.name}</h4>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-[#c9a84c] font-song">
                      {plan.price}
                    </span>
                    <span className="text-sm text-[#888888]">{plan.period}</span>
                  </div>
                </div>
                <ul className="space-y-2 mb-3">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-[#1a1a1a]">
                      <Star size={14} className="text-[#c9a84c] flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                {plan.save && (
                  <p className="text-sm text-[#666666] mb-2">{plan.save}</p>
                )}
                <button className="w-full btn-primary">立即订阅</button>
              </div>
            ))}
          </div>
        )}

        {/* Stats */}
        <div className="card mt-3">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-[#c9a84c] font-song">0</p>
              <p className="text-sm text-[#666666] mt-1">收藏对话</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-[#c9a84c] font-song">0</p>
              <p className="text-sm text-[#666666] mt-1">完成练习</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-[#c9a84c] font-song">0</p>
              <p className="text-sm text-[#666666] mt-1">测评记录</p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="mt-4 space-y-1">
          {[
            { icon: MessageCircle, label: "我的对话记录", badge: null },
            { icon: BookOpen, label: "修行练习记录", badge: null },
            { icon: ClipboardList, label: "测评报告", badge: "0" },
            { icon: Heart, label: "收藏内容", badge: null },
          ].map((item, i) => (
            <button
              key={i}
              className="w-full card flex items-center justify-between py-3"
            >
              <div className="flex items-center gap-3">
                <item.icon size={18} className="text-[#c9a84c]" />
                <span className="text-sm text-[#1a1a1a]">{item.label}</span>
              </div>
              <div className="flex items-center gap-2">
                {item.badge && (
                  <span className="text-sm text-[#666666]">{item.badge}</span>
                )}
                <ChevronRight size={16} className="text-[#999999]" />
              </div>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center pb-4">
          <p className="text-xs text-[#999999] font-song">
            YIXU HEALING · 亦须疗愈
          </p>
          <p className="text-xs text-[#999999] mt-1">
            Sino-NLP 中华身心语言学 © 2026
          </p>
        </div>
      </div>
    </div>
  );
}
