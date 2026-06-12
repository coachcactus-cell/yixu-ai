"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Home, Calendar, ClipboardList, User, Compass } from "lucide-react";
import ChatPage from "@/components/ChatPage";
import CalendarPage from "@/components/CalendarPage";
import AssessmentPage from "@/components/AssessmentPage";
import ProfilePage from "@/components/ProfilePage";
import YijingPage from "@/components/YijingPage";

const VALID_TABS = ["home", "yijing", "calendar", "assessment", "profile"];

const TABS = [
  { key: "home", label: "首页", icon: Home },
  { key: "yijing", label: "易卦", icon: Compass },
  { key: "calendar", label: "修行", icon: Calendar },
  { key: "assessment", label: "测评", icon: ClipboardList },
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
      {activeTab === "calendar" && <CalendarPage />}
      {activeTab === "assessment" && (
        <AssessmentPage onFullscreenChange={setIsFullscreen} />
      )}
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
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
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
