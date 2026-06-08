"use client";

import { useState } from "react";
import { Home, Calendar, ClipboardList, User, Compass } from "lucide-react";
import ChatPage from "@/components/ChatPage";
import CalendarPage from "@/components/CalendarPage";
import AssessmentPage from "@/components/AssessmentPage";
import ProfilePage from "@/components/ProfilePage";
import YijingPage from "@/components/YijingPage";

const TABS = [
  { key: "home", label: "首页", icon: Home },
  { key: "yijing", label: "易卦", icon: Compass },
  { key: "calendar", label: "修行", icon: Calendar },
  { key: "assessment", label: "测评", icon: ClipboardList },
  { key: "profile", label: "我的", icon: User },
];

export default function AppPage() {
  const [activeTab, setActiveTab] = useState("home");

  return (
    <div className="page-container">
      {/* Page Content */}
      {activeTab === "home" && <ChatPage />}
      {activeTab === "yijing" && <YijingPage />}
      {activeTab === "calendar" && <CalendarPage />}
      {activeTab === "assessment" && <AssessmentPage />}
      {activeTab === "profile" && <ProfilePage />}

      {/* Bottom Tab Bar */}
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
    </div>
  );
}
