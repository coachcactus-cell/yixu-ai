"use client";

import { useState, useCallback } from "react";
import { Brain, Heart, Sparkles, Users, ArrowRight, Lock, Hexagon, AlertTriangle, ShieldAlert, Activity, Leaf, Eye, Waves } from "lucide-react";
import ChakraAssessmentPage from "@/components/ChakraAssessmentPage";
import EnneagramPage from "@/components/EnneagramPage";
import GAD7AssessmentPage from "@/components/GAD7AssessmentPage";
import PCL5AssessmentPage from "@/components/PCL5AssessmentPage";
import PHQ15AssessmentPage from "@/components/PHQ15AssessmentPage";
import COREOMAssessmentPage from "@/components/COREOMAssessmentPage";
import AttachmentTestPage from "@/components/AttachmentTestPage";
import EmotionInertiaPage from "@/components/EmotionInertiaPage";

type ViewMode = "list" | "chakra-quiz" | "enneagram-quiz" | "gad7-quiz" | "pcl5-quiz" | "phq15-quiz" | "coreom-quiz" | "attachment-quiz" | "emotion-quiz";

const ASSESSMENTS = [
  {
    id: "chakra",
    title: "七脉轮能量评估",
    desc: "56 题深度检测，了解你七个能量中心状态",
    icon: Sparkles,
    price: "¥9.90",
    count: "1,286+ 人已测",
    available: true,
    color: "#c9a84c",
    category: "yixu",
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
    category: "yixu",
  },
  {
    id: "gad7",
    title: "GAD-7 广泛性焦虑问卷",
    desc: "7 题快速筛查焦虑水平，DSM-5 国际标准量表",
    icon: AlertTriangle,
    price: "免费",
    count: "已上线",
    available: true,
    color: "#7c9cd4",
    category: "clinical",
  },
  {
    id: "pcl5",
    title: "PTSD 创伤压力筛查",
    desc: "20 题评估创伤后压力症状，DSM-5 国际标准量表",
    icon: ShieldAlert,
    price: "免费",
    count: "已上线",
    available: true,
    color: "#9b7fd4",
    category: "clinical",
  },
  {
    id: "phq15",
    title: "PHQ-15 躯体症状量表",
    desc: "15 题筛查身体不适程度，含性别适配，DSM-5 国际标准量表",
    icon: Activity,
    price: "免费",
    count: "已上线",
    available: true,
    color: "#7caacc",
    category: "clinical",
  },
  {
    id: "coreom",
    title: "CORE-OM 临床结果评量",
    desc: "34 题全面评估心理困扰，含反向计分与自杀风险筛查",
    icon: Leaf,
    price: "免费",
    count: "已上线",
    available: true,
    color: "#7dba9a",
    category: "clinical",
  },
  {
    id: "attachment",
    title: "心念执念检测",
    desc: "唯识学 × Sino-NLP：识别你深层的执着模式",
    icon: Eye,
    price: "¥19.90",
    count: "已上线",
    available: true,
    color: "#d4a060",
    category: "sino-nlp",
  },
  {
    id: "emotion",
    title: "情绪惯性模式",
    desc: "Sino-NLP × 四体模型：揭露你的情绪反应惯性",
    icon: Waves,
    price: "¥19.90",
    count: "已上线",
    available: true,
    color: "#6b8fb5",
    category: "sino-nlp",
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

  const handleStartGAD7 = useCallback(() => {
    setView("gad7-quiz");
    onFullscreenChange?.(true);
  }, [onFullscreenChange]);

  const handleStartPCL5 = useCallback(() => {
    setView("pcl5-quiz");
    onFullscreenChange?.(true);
  }, [onFullscreenChange]);

  const handleStartPHQ15 = useCallback(() => {
    setView("phq15-quiz");
    onFullscreenChange?.(true);
  }, [onFullscreenChange]);

  const handleStartCOREOM = useCallback(() => {
    setView("coreom-quiz");
    onFullscreenChange?.(true);
  }, [onFullscreenChange]);

  const handleStartAttachment = useCallback(() => {
    setView("attachment-quiz");
    onFullscreenChange?.(true);
  }, [onFullscreenChange]);

  const handleStartEmotion = useCallback(() => {
    setView("emotion-quiz");
    onFullscreenChange?.(true);
  }, [onFullscreenChange]);

  const handleBackToList = useCallback(() => {
    setView("list");
    onFullscreenChange?.(false);
  }, [onFullscreenChange]);

  const handleStartMap: Record<string, () => void> = {
    chakra: handleStartChakra,
    enneagram: handleStartEnneagram,
    gad7: handleStartGAD7,
    pcl5: handleStartPCL5,
    phq15: handleStartPHQ15,
    coreom: handleStartCOREOM,
    attachment: handleStartAttachment,
    emotion: handleStartEmotion,
  };

  if (view === "chakra-quiz") {
    return <ChakraAssessmentPage onBack={handleBackToList} />;
  }

  if (view === "enneagram-quiz") {
    return <EnneagramPage onBack={handleBackToList} />;
  }

  if (view === "gad7-quiz") {
    return <GAD7AssessmentPage onBack={handleBackToList} />;
  }

  if (view === "pcl5-quiz") {
    return <PCL5AssessmentPage onBack={handleBackToList} />;
  }

  if (view === "phq15-quiz") {
    return <PHQ15AssessmentPage onBack={handleBackToList} />;
  }

  if (view === "coreom-quiz") {
    return <COREOMAssessmentPage onBack={handleBackToList} />;
  }

  if (view === "attachment-quiz") {
    return <AttachmentTestPage onBack={handleBackToList} />;
  }

  if (view === "emotion-quiz") {
    return <EmotionInertiaPage onBack={handleBackToList} />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <header className="sticky-header bg-white/95 backdrop-blur-md px-4 py-4 border-b border-[#e8e8e8]">
        <h1 className="text-xl font-bold text-[#1a1a1a] font-song">测评中心</h1>
        <p className="text-sm text-[#666666] mt-1">深入了解自己，从测评开始</p>
      </header>

      <div className="flex-1 px-4 pb-24 content-below-header">
        {/* Banner */}
        <div
          className="rounded-xl p-4 text-white"
          style={{
            background: "linear-gradient(135deg, #c9a84c, #a88830)",
          }}
        >
          <div className="flex items-center gap-3 mb-2">
            <Users size={20} />
            <span className="text-sm font-medium">已有 1,286+ 人通过测评更了解自己</span>
          </div>
          <p className="text-sm opacity-80">
            每个测评都由亦须先生亲自设计，基于 Sino-NLP 体系与中华经学智慧
          </p>
        </div>

        {/* 国际标准心理量表专区 */}
        <div className="mt-4">
          <h3 className="text-sm font-semibold text-[#888] mb-2 flex items-center gap-1.5">
            <ShieldAlert size={14} className="text-[#7c9cd4]" />
            国际标准心理量表
          </h3>
          <div className="space-y-3">
            {ASSESSMENTS.filter((a) => a.category === "clinical").map((a) => {
              const Icon = a.icon;
              return (
                <div key={a.id} className="card" style={{ opacity: a.available ? 1 : 0.6 }}>
                  <div className="flex items-start gap-3">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: a.available ? a.color + "15" : "#f5f5f5" }}
                    >
                      <Icon size={22} style={{ color: a.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-[#1a1a1a]">{a.title}</h3>
                      </div>
                      <p className="text-sm text-[#666666] mt-1">{a.desc}</p>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-sm text-[#777777]">{a.count}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-[#c9a84c]">免费测评</span>
                          {a.available && (
                            <button
                              className="btn-primary text-sm py-2 px-4"
                              onClick={handleStartMap[a.id]}
                            >
                              开始测评
                              <ArrowRight size={14} />
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

        {/* 亦须原创测评专区 */}
        <div className="mt-4">
          <h3 className="text-sm font-semibold text-[#888] mb-2 flex items-center gap-1.5">
            <Sparkles size={14} className="text-[#c9a84c]" />
            亦须原创测评
          </h3>
          <div className="space-y-3">
            {ASSESSMENTS.filter((a) => a.category === "yixu").map((a) => {
              const Icon = a.icon;
              return (
                <div key={a.id} className="card" style={{ opacity: a.available ? 1 : 0.6 }}>
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
                      </div>
                      <p className="text-sm text-[#666666] mt-1">{a.desc}</p>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-sm text-[#777777]">{a.count}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-[#c9a84c]">免费测评</span>
                          {a.available && (
                            <button
                              className="btn-primary text-sm py-2 px-4"
                              onClick={handleStartMap[a.id]}
                            >
                              开始测评
                              <ArrowRight size={14} />
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

        {/* Sino-NLP 原创测评专区 */}
        <div className="mt-4">
          <h3 className="text-sm font-semibold text-[#888] mb-2 flex items-center gap-1.5">
            <Brain size={14} className="text-[#6b8fb5]" />
            Sino-NLP 原创测评
          </h3>
          <div className="space-y-3">
            {ASSESSMENTS.filter((a) => a.category === "sino-nlp").map((a) => {
              const Icon = a.icon;
              return (
                <div key={a.id} className="card" style={{ opacity: a.available ? 1 : 0.6 }}>
                  <div className="flex items-start gap-3">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: a.available ? a.color + "15" : "#f5f5f5" }}
                    >
                      <Icon size={22} style={{ color: a.available ? a.color : "#999" }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-[#1a1a1a]">{a.title}</h3>
                      </div>
                      <p className="text-sm text-[#666666] mt-1">{a.desc}</p>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-sm text-[#777777]">{a.count}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-[#c9a84c]">{a.price}</span>
                          {a.available ? (
                            <button
                              className="btn-primary text-sm py-2 px-4"
                              onClick={handleStartMap[a.id]}
                            >
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
    </div>
  );
}
