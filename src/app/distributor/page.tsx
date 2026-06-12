"use client";

import { useState } from "react";
import {
  BarChart3,
  QrCode,
  Users,
  DollarSign,
  LogOut,
  RefreshCw,
  TrendingUp,
  Share2,
  Copy,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  Link2,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

type Tab = "overview" | "promote" | "customers" | "commission";

// ── Mock 數據（分銷商視角）──
const MOCK_DIST = {
  id: "dsp-001",
  name: "靜心瑜伽工作室",
  wechat: "yoga_zhengxin",
  commission: 15,
  status: "active",
  referralCode: "DSP001-YOGA",
  referralLink: "https://yixu-ai.online/?ref=DSP001-YOGA",
  joinDate: "2026-04-01",
};

const MOCK_STATS = {
  totalClicks: 234,
  clicksChange: 18.5,
  totalSignups: 45,
  signupChange: 12.3,
  conversionRate: 19.2,
  convChange: -1.8,
  pendingCommission: 134,
  commChange: 8.9,
  weekClicks: [12, 18, 25, 31, 28, 35, 23],
};

const MOCK_CUSTOMERS = [
  { id: "c1", name: "小明", signupDate: "2026-05-15", source: "推廣連結", assessments: 3, vip: false },
  { id: "c2", name: "阿靜", signupDate: "2026-05-18", source: "二維碼", assessments: 5, vip: true },
  { id: "c3", name: "修行者A", signupDate: "2026-05-22", source: "推廣連結", assessments: 2, vip: false },
  { id: "c4", name: "瑜伽同學", signupDate: "2026-06-01", source: "二維碼", assessments: 1, vip: false },
  { id: "c5", name: "芳療愛好者", signupDate: "2026-06-08", source: "推廣連結", assessments: 4, vip: true },
];

const MOCK_COMMISSION = [
  { month: "2026-04", revenue: 320, commission: 48, paid: true },
  { month: "2026-05", revenue: 570, commission: 86, paid: true },
  { month: "2026-06", revenue: 890, commission: 134, paid: false },
];

export default function DistributorDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(MOCK_DIST.referralLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleLogout = () => {
    window.location.href = "/";
  };

  const tabs: { key: Tab; label: string; icon: any }[] = [
    { key: "overview", label: "總覽", icon: BarChart3 },
    { key: "promote", label: "推廣", icon: Share2 },
    { key: "customers", label: "客戶", icon: Users },
    { key: "commission", label: "佣金", icon: DollarSign },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#fafafa]">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-gradient-to-r from-[#1a3a2e] to-[#1a2e3a] px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#c9a84c] to-[#b89430] flex items-center justify-center">
              <Handshake size={14} className="text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white">{MOCK_DIST.name}</h1>
              <p className="text-[10px] text-white/50">分銷商後台 · {MOCK_DIST.referralCode}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-1.5 rounded-lg bg-white/10 text-white/70 hover:bg-white/20 transition-colors">
              <RefreshCw size={14} />
            </button>
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg bg-white/10 text-white/70 hover:bg-white/20 transition-colors"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </header>

      {/* Tab Bar */}
      <div className="flex border-b border-[#e8e8e8] bg-white">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 text-[10px] font-medium transition-colors ${
                isActive
                  ? "text-[#c9a84c] border-b-2 border-[#c9a84c]"
                  : "text-[#999]"
              }`}
            >
              <Icon size={16} strokeWidth={isActive ? 2.5 : 2} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 pb-8">
        {activeTab === "overview" && <DistOverviewTab />}
        {activeTab === "promote" && <DistPromoteTab copied={copied} onCopy={handleCopyLink} />}
        {activeTab === "customers" && <DistCustomersTab />}
        {activeTab === "commission" && <DistCommissionTab />}
      </div>
    </div>
  );
}

function Handshake(props: any) {
  return (
    <svg width={props.size || 24} height={props.size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
      <path d="M11 20H7a2 2 0 0 1-2-2v-6l4-4 3 3 3-3 4 4v6a2 2 0 0 1-2 2h-4" />
      <path d="m8 16 3-3 3 3" />
    </svg>
  );
}

// ── 分銷商總覽 ──
function DistOverviewTab() {
  const s = MOCK_STATS;
  const maxClicks = Math.max(...s.weekClicks);

  return (
    <>
      <div className="grid grid-cols-2 gap-3 mt-4">
        <KPICard label="點擊量" value={s.totalClicks} change={s.clicksChange} icon={Eye} color="#c9a84c" />
        <KPICard label="註冊數" value={s.totalSignups} change={s.signupChange} icon={Users} color="#6366f1" />
        <KPICard label="轉化率" value={s.conversionRate} change={s.convChange} icon={TrendingUp} color="#8b5cf6" suffix="%" />
        <KPICard label="待結佣金" value={s.pendingCommission} change={s.commChange} icon={DollarSign} color="#10b981" prefix="¥" />
      </div>

      <div className="mt-4 bg-white rounded-xl p-4 border border-[#e8e8e8]">
        <h3 className="text-sm font-bold text-[#1a1a1a] mb-3 flex items-center gap-2">
          <TrendingUp size={14} className="text-[#c9a84c]" />
          本週點擊趨勢
        </h3>
        <div className="flex items-end gap-2 h-24">
          {["一", "二", "三", "四", "五", "六", "日"].map((day, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-full rounded-t-sm bg-gradient-to-t from-[#c9a84c] to-[#d4b85c] transition-all duration-500"
                style={{ height: `${(s.weekClicks[i] / maxClicks) * 100}%`, minHeight: 4 }}
              />
              <span className="text-[9px] text-[#999]">{day}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 bg-white rounded-xl p-4 border border-[#e8e8e8]">
        <h3 className="text-sm font-bold text-[#1a1a1a] mb-3">快速推廣</h3>
        <div className="flex items-center gap-2 bg-[#fafafa] rounded-lg p-3">
          <Link2 size={14} className="text-[#c9a84c] flex-shrink-0" />
          <p className="text-xs text-[#666] flex-1 truncate">https://yixu-ai.online/?ref=DSP001-YOGA</p>
          <button className="text-xs text-[#c9a84c] font-bold flex-shrink-0">複製</button>
        </div>
      </div>
    </>
  );
}

// ── 推廣工具 ──
function DistPromoteTab({ copied, onCopy }: { copied: boolean; onCopy: () => void }) {
  return (
    <>
      <div className="mt-4 bg-white rounded-xl p-4 border border-[#e8e8e8]">
        <h3 className="text-sm font-bold text-[#1a1a1a] mb-3 flex items-center gap-2">
          <Share2 size={14} className="text-[#c9a84c]" />
          推廣連結
        </h3>

        {/* 連結卡片 */}
        <div className="bg-[#fafafa] rounded-lg p-4 mb-3">
          <p className="text-xs text-[#999] mb-1">你的專屬推廣連結</p>
          <p className="text-sm font-mono text-[#1a1a1a] break-all">
            {MOCK_DIST.referralLink}
          </p>
        </div>

        <button
          onClick={onCopy}
          className={`w-full py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95 ${
            copied
              ? "bg-green-500 text-white"
              : "bg-gradient-to-r from-[#c9a84c] to-[#b89430] text-white"
          }`}
        >
          {copied ? (
            <>
              <Copy size={14} /> 已複製！
            </>
          ) : (
            <>
              <Copy size={14} /> 複製連結
            </>
          )}
        </button>
      </div>

      {/* 推廣二維碼 */}
      <div className="mt-4 bg-white rounded-xl p-4 border border-[#e8e8e8]">
        <h3 className="text-sm font-bold text-[#1a1a1a] mb-3 flex items-center gap-2">
          <QrCode size={14} className="text-[#c9a84c]" />
          推廣二維碼
        </h3>
        <div className="flex flex-col items-center py-4">
          <div className="w-40 h-40 bg-[#fafafa] rounded-xl border border-[#e8e8e8] flex items-center justify-center mb-3">
            <div className="text-center">
              <QrCode size={40} className="mx-auto text-[#ccc] mb-2" />
              <p className="text-[9px] text-[#999]">掃碼進入亦須AI</p>
            </div>
          </div>
          <button className="text-xs px-4 py-2 rounded-lg border border-[#c9a84c] text-[#c9a84c] font-bold active:scale-95 transition-transform">
            下載二維碼
          </button>
        </div>
      </div>

      {/* 推廣素材 */}
      <div className="mt-4 bg-white rounded-xl p-4 border border-[#e8e8e8]">
        <h3 className="text-sm font-bold text-[#1a1a1a] mb-3">推廣素材</h3>
        <div className="space-y-2">
          {[
            { name: "亦須AI 介紹海報", type: "圖片", size: "2.4 MB" },
            { name: "九型人格測評推廣文", type: "文案", size: "1.2 KB" },
            { name: "七脈輪體驗分享模板", type: "文案", size: "0.8 KB" },
          ].map((item) => (
            <div key={item.name} className="flex items-center justify-between py-2.5 border-b border-[#f5f5f5] last:border-0">
              <div>
                <p className="text-xs font-bold text-[#1a1a1a]">{item.name}</p>
                <p className="text-[10px] text-[#999]">{item.type} · {item.size}</p>
              </div>
              <button className="text-xs text-[#c9a84c] font-bold flex items-center gap-1">
                <ExternalLink size={10} /> 下載
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// ── 客戶列表 ──
function DistCustomersTab() {
  return (
    <>
      <div className="mt-4 grid grid-cols-3 gap-3">
        <div className="bg-white rounded-xl p-3 border border-[#e8e8e8] text-center">
          <p className="text-xl font-bold text-[#c9a84c]">{MOCK_CUSTOMERS.length}</p>
          <p className="text-[10px] text-[#999]">總客戶</p>
        </div>
        <div className="bg-white rounded-xl p-3 border border-[#e8e8e8] text-center">
          <p className="text-xl font-bold text-[#10b981]">{MOCK_CUSTOMERS.filter(c => c.vip).length}</p>
          <p className="text-[10px] text-[#999]">VIP</p>
        </div>
        <div className="bg-white rounded-xl p-3 border border-[#e8e8e8] text-center">
          <p className="text-xl font-bold text-[#6366f1]">{MOCK_CUSTOMERS.reduce((a, c) => a + c.assessments, 0)}</p>
          <p className="text-[10px] text-[#999]">測評數</p>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {MOCK_CUSTOMERS.map((c) => (
          <div key={c.id} className="bg-white rounded-xl p-3 border border-[#e8e8e8] flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#f0f4ff] flex items-center justify-center flex-shrink-0">
              <span className="text-sm">🧘</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-[#1a1a1a] truncate">{c.name}</span>
                {c.vip && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#c9a84c] text-white font-bold">VIP</span>
                )}
              </div>
              <p className="text-[10px] text-[#999]">來源: {c.source} · {c.signupDate}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-xs text-[#666]">{c.assessments} 測評</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

// ── 佣金提現 ──
function DistCommissionTab() {
  const totalEarned = MOCK_COMMISSION.reduce((a, c) => a + c.commission, 0);
  const totalPaid = MOCK_COMMISSION.filter(c => c.paid).reduce((a, c) => a + c.commission, 0);
  const pending = totalEarned - totalPaid;

  return (
    <>
      <div className="mt-4 bg-gradient-to-br from-[#1a3a2e] to-[#1a2e3a] rounded-xl p-5 text-white">
        <p className="text-xs text-white/60 mb-1">可提現佣金</p>
        <p className="text-3xl font-bold">¥{pending}</p>
        <p className="text-xs text-white/50 mt-1">累計收入: ¥{totalEarned}</p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="bg-white rounded-xl p-3 border border-[#e8e8e8]">
          <p className="text-xs text-[#999]">已提現</p>
          <p className="text-lg font-bold text-[#10b981]">¥{totalPaid}</p>
        </div>
        <div className="bg-white rounded-xl p-3 border border-[#e8e8e8]">
          <p className="text-xs text-[#999]">佣金率</p>
          <p className="text-lg font-bold text-[#c9a84c]">{MOCK_DIST.commission}%</p>
        </div>
      </div>

      <div className="mt-4">
        <button className="w-full py-3 rounded-xl bg-gradient-to-r from-[#c9a84c] to-[#b89430] text-white font-bold text-sm active:scale-[0.98] transition-transform">
          申請提現
        </button>
      </div>

      <div className="mt-4 bg-white rounded-xl p-4 border border-[#e8e8e8]">
        <h3 className="text-sm font-bold text-[#1a1a1a] mb-3">收入明細</h3>
        <div className="space-y-3">
          {MOCK_COMMISSION.map((c) => (
            <div key={c.month} className="flex items-center justify-between py-2 border-b border-[#f5f5f5] last:border-0">
              <div>
                <p className="text-xs font-bold text-[#1a1a1a]">{c.month}</p>
                <p className="text-[10px] text-[#999]">營收 ¥{c.revenue}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-[#c9a84c]">¥{c.commission}</p>
                <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${c.paid ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                  {c.paid ? "已結算" : "待結算"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// ── Reusable KPI Card ──
function KPICard({
  label,
  value,
  change,
  icon: Icon,
  color,
  prefix = "",
  suffix = "",
}: {
  label: string;
  value: number;
  change: number;
  icon: any;
  color: string;
  prefix?: string;
  suffix?: string;
}) {
  const isPositive = change >= 0;
  return (
    <div className="bg-white rounded-xl p-3 border border-[#e8e8e8]">
      <div className="flex items-center justify-between mb-1">
        <Icon size={14} style={{ color }} />
        <span
          className={`text-[9px] font-bold flex items-center gap-0.5 ${
            isPositive ? "text-green-500" : "text-red-500"
          }`}
        >
          {isPositive ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
          {Math.abs(change)}%
        </span>
      </div>
      <p className="text-xl font-bold text-[#1a1a1a]">{prefix}{value}{suffix}</p>
      <p className="text-[10px] text-[#999]">{label}</p>
    </div>
  );
}
