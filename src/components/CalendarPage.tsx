"use client";

import { BookOpen, CheckCircle2, Lock, ArrowRight } from "lucide-react";

const PRACTICES = [
  {
    day: "今日修行",
    title: "儒家：三省吾身",
    desc: "曾子曰：「吾日三省吾身」— 今日回顾三件事：为人谋而不忠乎？与朋友交而不信乎？传不习乎？",
    unlocked: true,
    progress: "0/1",
  },
  {
    day: "Day 2",
    title: "道家：心斋坐忘",
    desc: "庄子曰：「唯道集虚。虚者，心斋也。」— 练习放下思虑，回归虚静。",
    unlocked: false,
    progress: "🔒",
  },
  {
    day: "Day 3",
    title: "佛家：观照练习",
    desc: "观照念头如流水，不取不舍，不迎不拒。",
    unlocked: false,
    progress: "🔒",
  },
  {
    day: "Day 4",
    title: "易经：时位觉察",
    desc: "观当下所处之时、所居之位，知进退存亡之道。",
    unlocked: false,
    progress: "🔒",
  },
  {
    day: "Day 5",
    title: "心学：事上磨练",
    desc: "阳明先生曰：「人须在事上磨，方立得住。」— 从今日遇到的一件事中修行。",
    unlocked: false,
    progress: "🔒",
  },
];

export default function CalendarPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/95 backdrop-blur-md px-4 py-4 border-b border-[#e8e8e8]">
        <h1 className="text-xl font-bold text-[#1a1a1a] font-song">修行日课</h1>
        <p className="text-sm text-[#888888] mt-1">中华经学每日一练 · 六经轮替</p>
      </header>

      {/* Progress Summary */}
      <div className="px-4 pt-4">
        <div className="card flex items-center justify-between">
          <div>
            <p className="text-sm text-[#888888]">修行进度</p>
            <p className="text-2xl font-bold text-[#c9a84c] font-song">1/5</p>
          </div>
          <div className="w-24">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: "20%" }} />
            </div>
          </div>
        </div>
      </div>

      {/* Daily Practices */}
      <div className="flex-1 px-4 pb-20">
        <h2 className="section-header">六经修行路径</h2>
        <div className="space-y-3">
          {PRACTICES.map((p, i) => (
            <div
              key={i}
              className={`practice-card ${!p.unlocked ? "opacity-60" : ""}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#c9a84c] bg-[#fdf8ed] px-2 py-0.5 rounded-full">
                    {p.day}
                  </span>
                  <h3 className="font-semibold text-[#1a1a1a]">{p.title}</h3>
                </div>
                {p.unlocked ? (
                  <CheckCircle2 size={20} className="text-[#c9a84c]" />
                ) : (
                  <Lock size={16} className="text-[#cccccc]" />
                )}
              </div>
              <p className="text-sm text-[#888888] mt-2 leading-relaxed">
                {p.desc}
              </p>
              {p.unlocked && (
                <button className="mt-3 flex items-center gap-1 text-sm font-medium text-[#c9a84c]">
                  开始练习 <ArrowRight size={14} />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Coming Soon */}
        <div className="mt-6 card text-center">
          <BookOpen size={24} className="mx-auto text-[#cccccc] mb-2" />
          <p className="text-sm text-[#888888]">
            更多经学修行模块即将推出
            <br />
            <span className="text-xs">唯识学 · 深度观照 · 音声冥想</span>
          </p>
        </div>
      </div>
    </div>
  );
}
