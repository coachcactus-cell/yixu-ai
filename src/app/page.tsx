"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Home, BookOpen, ClipboardList, User, Compass, Music2, Cookie } from "lucide-react";
import ChatPage from "@/components/ChatPage";
import DictionaryTabPage from "@/components/DictionaryTabPage";
import AssessmentPage from "@/components/AssessmentPage";
import ProfilePage from "@/components/ProfilePage";
import YijingPage from "@/components/YijingPage";
import TianLaiTabPage from "@/components/TianLaiTabPage";
import DianXinTabPage from "@/components/DianXinTabPage";

const VALID_TABS = ["home", "yijing", "tianlai", "dictionary", "assessment", "dianxin", "profile"];

const TABS = [
  { key: "home", label: "首页", icon: Home },
  { key: "yijing", label: "易卦", icon: Compass },
  { key: "tianlai", label: "天籁", icon: Music2 },
  { key: "dictionary", label: "公益辞典", icon: BookOpen },
  { key: "assessment", label: "测评", icon: ClipboardList },
  { key: "dianxin", label: "点心", icon: Cookie },
  { key: "profile", label: "我的", icon: User },
];

function AppContent() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const initialTab = tabParam && VALID_TABS.includes(tabParam) ? tabParam : "home";

  const [activeTab, setActiveTab] = useState(initialTab);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // 当 URL query 变化时同步 tab
  useEffect(() => {
    if (tabParam && VALID_TABS.includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  return (
    <div className="page-container">
      {/* Page Content */}
      {activeTab === "home" && <ChatPage />}
      {activeTab === "yijing" && <YijingPage />}
      {activeTab === "tianlai" && <TianLaiTabPage />}
      {activeTab === "dictionary" && <DictionaryTabPage />}
      {activeTab === "assessment" && (
        <AssessmentPage onFullscreenChange={setIsFullscreen} />
      )}
      {activeTab === "dianxin" && <DianXinTabPage />}
      {activeTab === "profile" && <ProfilePage />}

      {/* Bottom Tab Bar — 全屏模式隐藏 */}
      {!isFullscreen && (
      <nav className="tab-bar">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              className={`tab-item ${isActive ? "active" : ""}`}
              onClick={() => setActiveTab(tab.key)}
            >
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>
      )}
    </div>
  );
}

export default function AppPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen bg-white"><div className="w-8 h-8 border-2 border-[#c9a84c] border-t-transparent rounded-full animate-spin" /></div>}>
      <AppContent />
    </Suspense>
  );
}
