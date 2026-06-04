"use client";

import { Brain, Heart, Sparkles, Users, ArrowRight, Lock } from "lucide-react";

const ASSESSMENTS = [
  {
    id: "chakra",
    title: "七脉轮能量评估",
    desc: "了解你七个能量中心的状态，发现失衡之处",
    icon: Sparkles,
    price: "¥19.90",
    count: "1,286 人已测",
    available: true,
    color: "#c9a84c",
  },
  {
    id: "attachment",
    title: "心念执念检测",
    desc: "唯识学 × 行为心理：识别你深层的执着模式",
    icon: Heart,
    price: "¥19.90",
    count: "即将上线",
    available: false,
    color: "#888888",
  },
  {
    id: "emotion",
    title: "情绪惯性模式",
    desc: "Sino-NLP × 四体模型：揭露你的情绪反应惯性",
    icon: Brain,
    price: "¥19.90",
    count: "即将上线",
    available: false,
    color: "#888888",
  },
];

export default function AssessmentPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/95 backdrop-blur-md px-4 py-4 border-b border-[#e8e8e8]">
        <h1 className="text-xl font-bold text-[#1a1a1a] font-song">测评中心</h1>
        <p className="text-sm text-[#888888] mt-1">深入了解自己，从测评开始</p>
      </header>

      <div className="flex-1 px-4 pb-20">
        {/* Banner */}
        <div className="card bg-gradient-to-br from-[#c9a84c] to-[#a88830] text-white mt-4 border-0">
          <div className="flex items-center gap-3 mb-2">
            <Users size={20} />
            <span className="text-sm font-medium">已有 1,286+ 人通过测评更了解自己</span>
          </div>
          <p className="text-xs opacity-80">
            每个测评都由亦须先生亲自设计，基于 Sino-NLP 体系与中华经学智慧
          </p>
        </div>

        {/* Assessment Cards */}
        <div className="mt-4 space-y-3">
          {ASSESSMENTS.map((a) => {
            const Icon = a.icon;
            return (
              <div
                key={a.id}
                className={`card ${!a.available ? "opacity-60" : ""}`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: a.available ? "#fdf8ed" : "#f5f5f5" }}
                  >
                    <Icon size={22} style={{ color: a.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-[#1a1a1a]">{a.title}</h3>
                      {!a.available && (
                        <Lock size={14} className="text-[#cccccc] flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-sm text-[#888888] mt-1">{a.desc}</p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs text-[#888888]">{a.count}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-[#c9a84c]">
                          {a.price}
                        </span>
                        {a.available ? (
                          <button className="btn-primary text-sm py-2 px-4">
                            开始测评
                            <ArrowRight size={14} />
                          </button>
                        ) : (
                          <button className="btn-outline text-sm py-2 px-4 opacity-50" disabled>
                            即将推出
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
