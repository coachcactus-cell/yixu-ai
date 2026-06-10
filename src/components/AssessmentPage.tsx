"use client";

import { useState, useCallback } from "react";
import { Brain, Heart, Sparkles, Users, ArrowRight, Lock, Hexagon } from "lucide-react";
import ChakraAssessmentPage from "@/components/ChakraAssessmentPage";
import EnneagramPage from "@/components/EnneagramPage";

type ViewMode = "list" | "chakra-quiz" | "enneagram-quiz";

const ASSESSMENTS = [
  {
    id: "chakra",
    title: "七脈輪能量評估",
    desc: "56 題深度檢測，了解你七個能量中心狀態",
    icon: Sparkles,
    price: "¥9.90",
    count: "1,286+ 人已測",
    available: true,
    color: "#c9a84c",
  },
  {
    id: "enneagram",
    title: "九型人格测试",
    desc: "126 题精准定位你的核心型号 + Wing 翼型",
    icon: Hexagon,
    price: "免费",
    count: "1,500+ 人已测",
    available: true,
    color: "#c9a84c",
  },
  {
    id: "attachment",
    title: "心念執念檢測",
    desc: "唯識學 × 行為心理：識別你深層的執著模式",
    icon: Heart,
    price: "¥19.90",
    count: "即將上線",
    available: false,
    color: "#888888",
  },
  {
    id: "emotion",
    title: "情緒慣性模式",
    desc: "Sino-NLP × 四體模型：揭露你的情緒反應慣性",
    icon: Brain,
    price: "¥19.90",
    count: "即將上線",
    available: false,
    color: "#888888",
  },
];

export default function AssessmentPage({
  onFullscreenChange,
}: {
  onFullscreenChange?: (fullscreen: boolean) => void;
}) {
  const [view, setView] = useState<ViewMode>("list");

  const handleStartChakra = useCallback(() => {
    setView("chakra-quiz");
    onFullscreenChange?.(true);
  }, [onFullscreenChange]);

  const handleStartEnneagram = useCallback(() => {
    setView("enneagram-quiz");
    onFullscreenChange?.(true);
  }, [onFullscreenChange]);

  const handleBackToList = useCallback(() => {
    setView("list");
    onFullscreenChange?.(false);
  }, [onFullscreenChange]);

  // 如果進入脈輪測評流程，全屏接管
  if (view === "chakra-quiz") {
    return <ChakraAssessmentPage onBack={handleBackToList} />;
  }

  // 如果進入九型人格測評流程，全屏接管
  if (view === "enneagram-quiz") {
    return <EnneagramPage onBack={handleBackToList} />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/95 backdrop-blur-md px-4 py-4 border-b border-[#e8e8e8]">
        <h1 className="text-xl font-bold text-[#1a1a1a] font-song">測評中心</h1>
        <p className="text-sm text-[#666666] mt-1">深入了解自己，從測評開始</p>
      </header>

      <div className="flex-1 px-4 pb-24">
        {/* Banner */}
        <div
          className="mt-4 rounded-xl p-4 text-white"
          style={{
            background: "linear-gradient(135deg, #c9a84c, #a88830)",
          }}
        >
          <div className="flex items-center gap-3 mb-2">
            <Users size={20} />
            <span className="text-sm font-medium">已有 1,286+ 人通過測評更了解自己</span>
          </div>
          <p className="text-sm opacity-80">
            每個測評都由亦須先生親自設計，基於 Sino-NLP 體系與中華經學智慧
          </p>
        </div>

        {/* Assessment Cards */}
        <div className="mt-4 space-y-3">
          {ASSESSMENTS.map((a) => {
            const Icon = a.icon;
            return (
              <div
                key={a.id}
                className="card"
                style={{ opacity: a.available ? 1 : 0.6 }}
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
                        <Lock size={14} className="text-[#999999] flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-sm text-[#666666] mt-1">{a.desc}</p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-sm text-[#777777]">{a.count}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-[#c9a84c]">
                          {a.available ? "免費測評" : a.price}
                        </span>
                        {a.available ? (
                          <button
                            className="btn-primary text-sm py-2 px-4"
                            onClick={a.id === "enneagram" ? handleStartEnneagram : handleStartChakra}
                          >
                            開始測評
                            <ArrowRight size={14} />
                          </button>
                        ) : (
                          <button className="btn-outline text-sm py-2 px-4 opacity-50" disabled>
                            即將推出
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
