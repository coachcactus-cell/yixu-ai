"use client";

import { useState } from "react";
import {
  BarChart3,
  Users,
  DollarSign,
  Handshake,
  FileText,
  LogOut,
  RefreshCw,
  TrendingUp,
  Eye,
  MessageCircle,
  Sparkles,
  QrCode,
  ArrowUpRight,
  ArrowDownRight,
  Ticket,
  Copy,
  Plus,
  Trash2,
} from "lucide-react";
import Link from "next/link";

type Tab = "overview" | "users" | "revenue" | "distributors" | "content" | "topup-codes";

// ── Mock 数据 ──
const MOCK_OVERVIEW = {
  dau: 23,
  dauChange: 12.5,
  totalChats: 342,
  chatChange: 8.3,
  totalAssessments: 156,
  assessmentChange: -2.1,
  revenue: 1280,
  revenueChange: 23.6,
  weekData: [18, 22, 15, 28, 23, 31, 23],
  assessmentDist: { enneagram: 68, chakra: 52, yijing: 36 },
};

const MOCK_USERS = [
  { id: "u1", name: "修行者甲", joinDate: "2026-05-20", chats: 24, assessments: 3, vip: false },
  { id: "u2", name: "修行者乙", joinDate: "2026-05-28", chats: 12, assessments: 5, vip: true },
  { id: "u3", name: "修行者丙", joinDate: "2026-06-01", chats: 8, assessments: 2, vip: false },
  { id: "u4", name: "修行者丁", joinDate: "2026-06-05", chats: 31, assessments: 4, vip: true },
  { id: "u5", name: "修行者戊", joinDate: "2026-06-10", chats: 5, assessments: 1, vip: false },
];

const MOCK_DISTRIBUTORS = [
  { id: "dsp-001", name: "静心瑜伽工作室", wechat: "yoga_zhengxin", users: 45, revenue: 890, status: "active", commission: 15, joinDate: "2026-04-01" },
  { id: "dsp-002", name: "芳疗小院", wechat: "aroma_garden", users: 28, revenue: 520, status: "active", commission: 12, joinDate: "2026-04-15" },
  { id: "dsp-003", name: "身心健康中心", wechat: "health_center", users: 12, revenue: 180, status: "trial", commission: 10, joinDate: "2026-06-01" },
  { id: "dsp-004", name: "道然书院", wechat: "daoran_shuyuan", users: 0, revenue: 0, status: "pending", commission: 0, joinDate: "2026-06-10" },
];

const MOCK_CONTENT = [
  { id: "c1", title: "七脉轮深度解读", type: "测评", status: "已上架", views: 156 },
  { id: "c2", title: "孟子塔羅牌（5张）", type: "塔羅", status: "开发中", views: 0 },
  { id: "c3", title: "和香推薦·檀香", type: "用香", status: "已上架", views: 89 },
  { id: "c4", title: "修行日课·静心法", type: "修行", status: "草稿", views: 0 },
  { id: "c5", title: "易经·干卦解读", type: "易卦", status: "已上架", views: 234 },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = () => {
    setLoggingOut(true);
    window.location.href = "/";
  };

  const tabs: { key: Tab; label: string; icon: any }[] = [
    { key: "overview", label: "总览", icon: BarChart3 },
    { key: "users", label: "用戶", icon: Users },
    { key: "revenue", label: "收入", icon: DollarSign },
    { key: "distributors", label: "分銷", icon: Handshake },
    { key: "content", label: "内容", icon: FileText },
    { key: "topup-codes", label: "充值码", icon: Ticket },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#fafafa]">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-gradient-to-r from-[#1a1a2e] to-[#16213e] px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#c9a84c] to-[#b89430] flex items-center justify-center">
              <span className="text-white text-sm font-bold font-song">亦</span>
            </div>
            <div>
              <h1 className="text-sm font-bold text-white">C老大后台</h1>
              <p className="text-[10px] text-white/50">超级管理員</p>
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
        {activeTab === "overview" && <OverviewTab />}
        {activeTab === "users" && <UsersTab />}
        {activeTab === "revenue" && <RevenueTab />}
        {activeTab === "distributors" && <DistributorsTab />}
        {activeTab === "content" && <ContentTab />}
        {activeTab === "topup-codes" && <TopupCodesTab />}
      </div>
    </div>
  );
}

// ── 总览 Tab ──
function OverviewTab() {
  const d = MOCK_OVERVIEW;
  const maxWeek = Math.max(...d.weekData);

  return (
    <>
      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-3 mt-4">
        <KPICard label="DAU" value={d.dau} change={d.dauChange} icon={Users} color="#c9a84c" />
        <KPICard label="AI对话" value={d.totalChats} change={d.chatChange} icon={MessageCircle} color="#6366f1" />
        <KPICard label="测评次数" value={d.totalAssessments} change={d.assessmentChange} icon={Sparkles} color="#8b5cf6" />
        <KPICard label="收入(元)" value={d.revenue} change={d.revenueChange} icon={DollarSign} color="#10b981" />
      </div>

      {/* 週趋勢 */}
      <div className="mt-4 bg-white rounded-xl p-4 border border-[#e8e8e8]">
        <h3 className="text-sm font-bold text-[#1a1a1a] mb-3 flex items-center gap-2">
          <TrendingUp size={14} className="text-[#c9a84c]" />
          本週 DAU 趋勢
        </h3>
        <div className="flex items-end gap-2 h-24">
          {["一", "二", "三", "四", "五", "六", "日"].map((day, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-full rounded-t-sm bg-gradient-to-t from-[#c9a84c] to-[#d4b85c] transition-all duration-500"
                style={{ height: `${(d.weekData[i] / maxWeek) * 100}%`, minHeight: 4 }}
              />
              <span className="text-[9px] text-[#999]">{day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 测评分佈 */}
      <div className="mt-4 bg-white rounded-xl p-4 border border-[#e8e8e8]">
        <h3 className="text-sm font-bold text-[#1a1a1a] mb-3 flex items-center gap-2">
          <BarChart3 size={14} className="text-[#c9a84c]" />
          测评分佈
        </h3>
        <div className="space-y-3">
          {[
            { label: "九型人格", count: d.assessmentDist.enneagram, color: "#c9a84c" },
            { label: "七脉轮", count: d.assessmentDist.chakra, color: "#8b5cf6" },
            { label: "易卦", count: d.assessmentDist.yijing, color: "#3b82f6" },
          ].map((item) => {
            const total = d.assessmentDist.enneagram + d.assessmentDist.chakra + d.assessmentDist.yijing;
            const pct = (item.count / total) * 100;
            return (
              <div key={item.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-[#333]">{item.label}</span>
                  <span className="text-xs font-bold text-[#1a1a1a]">{item.count} 次 ({pct.toFixed(0)}%)</span>
                </div>
                <div className="h-2 bg-[#f5f5f5] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct}%`, backgroundColor: item.color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 快捷入口 */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <Link href="/b2b-register" className="bg-white rounded-xl p-3 border border-[#e8e8e8] flex items-center gap-2 active:scale-[0.98] transition-transform">
          <div className="w-8 h-8 rounded-lg bg-[#fdf8ed] flex items-center justify-center">
            <Handshake size={16} className="text-[#c9a84c]" />
          </div>
          <div>
            <p className="text-xs font-bold text-[#1a1a1a]">新增 B2B</p>
            <p className="text-[10px] text-[#999]">註册合作夥伴</p>
          </div>
        </Link>
        <Link href="/b2b-admin" className="bg-white rounded-xl p-3 border border-[#e8e8e8] flex items-center gap-2 active:scale-[0.98] transition-transform">
          <div className="w-8 h-8 rounded-lg bg-[#f0f4ff] flex items-center justify-center">
            <FileText size={16} className="text-[#6366f1]" />
          </div>
          <div>
            <p className="text-xs font-bold text-[#1a1a1a]">B2B 管理</p>
            <p className="text-[10px] text-[#999]">客戶列表</p>
          </div>
        </Link>
      </div>
    </>
  );
}

// ── 用戶 Tab ──
function UsersTab() {
  const users = MOCK_USERS;
  return (
    <>
      <div className="mt-4 grid grid-cols-3 gap-3">
        <div className="bg-white rounded-xl p-3 border border-[#e8e8e8] text-center">
          <p className="text-xl font-bold text-[#c9a84c]">{users.length}</p>
          <p className="text-[10px] text-[#999]">总用戶</p>
        </div>
        <div className="bg-white rounded-xl p-3 border border-[#e8e8e8] text-center">
          <p className="text-xl font-bold text-[#10b981]">{users.filter(u => u.vip).length}</p>
          <p className="text-[10px] text-[#999]">VIP</p>
        </div>
        <div className="bg-white rounded-xl p-3 border border-[#e8e8e8] text-center">
          <p className="text-xl font-bold text-[#6366f1]">{users.reduce((a, u) => a + u.chats, 0)}</p>
          <p className="text-[10px] text-[#999]">总对话</p>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {users.map((u) => (
          <div key={u.id} className="bg-white rounded-xl p-3 border border-[#e8e8e8] flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#fdf8ed] flex items-center justify-center flex-shrink-0">
              <span className="text-sm">🧘</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-[#1a1a1a] truncate">{u.name}</span>
                {u.vip && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#c9a84c] text-white font-bold">VIP</span>
                )}
              </div>
              <p className="text-[10px] text-[#999]">加入: {u.joinDate}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-xs font-bold text-[#1a1a1a]">{u.chats} 对话</p>
              <p className="text-[10px] text-[#999]">{u.assessments} 测评</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

// ── 收入 Tab ──
function RevenueTab() {
  return (
    <>
      <div className="mt-4 bg-gradient-to-br from-[#1a1a2e] to-[#16213e] rounded-xl p-5 text-white">
        <p className="text-xs text-white/60 mb-1">本月收入</p>
        <p className="text-3xl font-bold">¥1,280</p>
        <p className="text-xs text-green-400 mt-1 flex items-center gap-1">
          <ArrowUpRight size={12} /> +23.6% 較上月
        </p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="bg-white rounded-xl p-3 border border-[#e8e8e8]">
          <p className="text-xs text-[#999]">VIP 月费</p>
          <p className="text-lg font-bold text-[#c9a84c]">¥580</p>
          <p className="text-[10px] text-[#999]">20 人 × ¥29</p>
        </div>
        <div className="bg-white rounded-xl p-3 border border-[#e8e8e8]">
          <p className="text-xs text-[#999]">B2B 合作</p>
          <p className="text-lg font-bold text-[#6366f1]">¥700</p>
          <p className="text-[10px] text-[#999]">2 家客戶</p>
        </div>
      </div>

      <div className="mt-4 bg-white rounded-xl p-4 border border-[#e8e8e8]">
        <h3 className="text-sm font-bold text-[#1a1a1a] mb-3">收入趋勢（近6月）</h3>
        <div className="flex items-end gap-3 h-28">
          {[320, 480, 560, 720, 980, 1280].map((val, i) => {
            const maxVal = 1280;
            const months = ["1月", "2月", "3月", "4月", "5月", "6月"];
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[9px] text-[#999]">¥{val}</span>
                <div
                  className="w-full rounded-t-sm transition-all duration-500"
                  style={{
                    height: `${(val / maxVal) * 100}%`,
                    minHeight: 4,
                    background: i === 5 ? "linear-gradient(to top, #c9a84c, #d4b85c)" : "#e8e8e8",
                  }}
                />
                <span className="text-[9px] text-[#999]">{months[i]}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 bg-white rounded-xl p-4 border border-[#e8e8e8]">
        <h3 className="text-sm font-bold text-[#1a1a1a] mb-3">待结算佣金</h3>
        <div className="space-y-2">
          {MOCK_DISTRIBUTORS.filter(d => d.status === "active").map(d => (
            <div key={d.id} className="flex items-center justify-between py-2 border-b border-[#f5f5f5] last:border-0">
              <div>
                <p className="text-xs font-bold text-[#1a1a1a]">{d.name}</p>
                <p className="text-[10px] text-[#999]">佣金率: {d.commission}%</p>
              </div>
              <p className="text-sm font-bold text-[#c9a84c]">¥{(d.revenue * d.commission / 100).toFixed(0)}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// ── 分銷商 Tab ──
function DistributorsTab() {
  return (
    <>
      <div className="mt-4 grid grid-cols-3 gap-3">
        <div className="bg-white rounded-xl p-3 border border-[#e8e8e8] text-center">
          <p className="text-xl font-bold text-[#c9a84c]">{MOCK_DISTRIBUTORS.length}</p>
          <p className="text-[10px] text-[#999]">总分銷</p>
        </div>
        <div className="bg-white rounded-xl p-3 border border-[#e8e8e8] text-center">
          <p className="text-xl font-bold text-[#10b981]">{MOCK_DISTRIBUTORS.filter(d => d.status === "active").length}</p>
          <p className="text-[10px] text-[#999]">活躍</p>
        </div>
        <div className="bg-white rounded-xl p-3 border border-[#e8e8e8] text-center">
          <p className="text-xl font-bold text-[#f59e0b]">{MOCK_DISTRIBUTORS.filter(d => d.status === "pending").length}</p>
          <p className="text-[10px] text-[#999]">待審批</p>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {MOCK_DISTRIBUTORS.map((d) => (
          <div key={d.id} className="bg-white rounded-xl p-4 border border-[#e8e8e8]">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-[#1a1a1a]">{d.name}</h4>
                  <StatusBadge status={d.status} />
                </div>
                <p className="text-[10px] text-[#999] mt-0.5">微信: {d.wechat} · 加入: {d.joinDate}</p>
              </div>
              <p className="text-sm font-bold text-[#c9a84c]">¥{d.revenue}</p>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-3">
              <div className="text-center py-1.5 bg-[#fafafa] rounded-lg">
                <p className="text-sm font-bold text-[#1a1a1a]">{d.users}</p>
                <p className="text-[9px] text-[#999]">用戶数</p>
              </div>
              <div className="text-center py-1.5 bg-[#fafafa] rounded-lg">
                <p className="text-sm font-bold text-[#1a1a1a]">{d.commission}%</p>
                <p className="text-[9px] text-[#999]">佣金率</p>
              </div>
              <div className="text-center py-1.5 bg-[#fafafa] rounded-lg">
                <p className="text-sm font-bold text-[#1a1a1a]">¥{(d.revenue * d.commission / 100).toFixed(0)}</p>
                <p className="text-[9px] text-[#999]">佣金</p>
              </div>
            </div>

            {d.status === "pending" ? (
              <div className="flex gap-2">
                <button className="flex-1 py-2 rounded-lg bg-[#10b981] text-white text-xs font-bold active:scale-95 transition-transform">
                  批准
                </button>
                <button className="flex-1 py-2 rounded-lg border border-red-300 text-red-500 text-xs font-bold active:scale-95 transition-transform">
                  拒絕
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <button className="flex-1 py-2 rounded-lg border border-[#c9a84c] text-[#c9a84c] text-xs font-bold active:scale-95 transition-transform flex items-center justify-center gap-1">
                  <QrCode size={12} /> 推廣码
                </button>
                <button className="flex-1 py-2 rounded-lg border border-[#e8e8e8] text-[#666] text-xs font-bold active:scale-95 transition-transform flex items-center justify-center gap-1">
                  <Eye size={12} /> 詳情
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

// ── 内容 Tab ──
function ContentTab() {
  const statusColor: Record<string, string> = {
    "已上架": "bg-green-100 text-green-700",
    "开发中": "bg-yellow-100 text-yellow-700",
    "草稿": "bg-gray-100 text-gray-600",
  };

  return (
    <>
      <div className="mt-4 bg-white rounded-xl p-4 border border-[#e8e8e8]">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-[#1a1a1a]">内容管理</h3>
          <button className="text-xs px-3 py-1.5 rounded-lg bg-[#c9a84c] text-white font-bold active:scale-95 transition-transform">
            + 新增
          </button>
        </div>
        <div className="space-y-2">
          {MOCK_CONTENT.map((c) => (
            <div key={c.id} className="flex items-center justify-between py-2.5 border-b border-[#f5f5f5] last:border-0">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-[#1a1a1a] truncate">{c.title}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#f5f5f5] text-[#666]">{c.type}</span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-medium ${statusColor[c.status] || ""}`}>
                    {c.status}
                  </span>
                </div>
              </div>
              <div className="text-right flex-shrink-0 ml-3">
                <p className="text-xs text-[#999]">{c.views > 0 ? `${c.views} 次查看` : "—"}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// ── Components ──
function KPICard({
  label,
  value,
  change,
  icon: Icon,
  color,
}: {
  label: string;
  value: number;
  change: number;
  icon: any;
  color: string;
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
      <p className="text-xl font-bold text-[#1a1a1a]">{value}</p>
      <p className="text-[10px] text-[#999]">{label}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    active: "bg-green-100 text-green-700",
    trial: "bg-blue-100 text-blue-700",
    pending: "bg-yellow-100 text-yellow-700",
    suspended: "bg-red-100 text-red-700",
  };
  const labels: Record<string, string> = {
    active: "活躍",
    trial: "试用中",
    pending: "待審批",
    suspended: "已停用",
  };
  return (
    <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${styles[status] || "bg-gray-100 text-gray-600"}`}>
      {labels[status] || status}
    </span>
  );
}

// ── 充值码管理 Tab ──
interface TopupCodeEntry {
  code: string;
  amount: number;     // 分
  desc: string;
  createdAt: string;
  used: boolean;
  usedBy?: string;
  usedAt?: string;
}

const INITIAL_TOPUP_CODES: TopupCodeEntry[] = [
  { code: "YIXU50", amount: 5000, desc: "充值 ¥50", createdAt: "2026-06-14", used: false },
  { code: "YIXU100", amount: 10000, desc: "充值 ¥100", createdAt: "2026-06-14", used: false },
  { code: "YIXU200", amount: 20000, desc: "充值 ¥200", createdAt: "2026-06-14", used: false },
];

function TopupCodesTab() {
  const [codes, setCodes] = useState<TopupCodeEntry[]>(INITIAL_TOPUP_CODES);
  const [newAmount, setNewAmount] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleGenerate = () => {
    const amount = parseInt(newAmount);
    if (!amount || amount <= 0) return;

    const code = `YX${Date.now().toString(36).toUpperCase().slice(-6)}`;
    const entry: TopupCodeEntry = {
      code,
      amount: amount * 100, // 轉為分
      desc: newDesc || `充值 ¥${amount}`,
      createdAt: new Date().toISOString().split("T")[0],
      used: false,
    };
    setCodes([entry, ...codes]);
    setNewAmount("");
    setNewDesc("");
  };

  const handleDelete = (code: string) => {
    setCodes(codes.filter((c) => c.code !== code));
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 1500);
    });
  };

  // 統計
  const totalCodes = codes.length;
  const usedCodes = codes.filter((c) => c.used).length;
  const totalValue = codes.reduce((a, c) => a + c.amount, 0);

  return (
    <>
      {/* 統計 */}
      <div className="mt-4 grid grid-cols-3 gap-3">
        <div className="bg-white rounded-xl p-3 border border-[#e8e8e8] text-center">
          <p className="text-xl font-bold text-[#c9a84c]">{totalCodes}</p>
          <p className="text-[10px] text-[#999]">总码数</p>
        </div>
        <div className="bg-white rounded-xl p-3 border border-[#e8e8e8] text-center">
          <p className="text-xl font-bold text-[#10b981]">{usedCodes}</p>
          <p className="text-[10px] text-[#999]">已使用</p>
        </div>
        <div className="bg-white rounded-xl p-3 border border-[#e8e8e8] text-center">
          <p className="text-xl font-bold text-[#6366f1]">¥{(totalValue / 100).toFixed(0)}</p>
          <p className="text-[10px] text-[#999]">总面值</p>
        </div>
      </div>

      {/* 生成新碼 */}
      <div className="mt-4 bg-white rounded-xl p-4 border border-[#e8e8e8]">
        <h3 className="text-sm font-bold text-[#1a1a1a] mb-3 flex items-center gap-2">
          <Plus size={14} className="text-[#c9a84c]" />
          生成充值码
        </h3>
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="number"
              value={newAmount}
              onChange={(e) => setNewAmount(e.target.value)}
              placeholder="金额（元）"
              className="flex-1 px-3 py-2.5 rounded-lg border border-[#e8e8e8] text-sm outline-none focus:border-[#c9a84c] transition-colors"
            />
            <input
              type="text"
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              placeholder="备注（选填）"
              className="flex-1 px-3 py-2.5 rounded-lg border border-[#e8e8e8] text-sm outline-none focus:border-[#c9a84c] transition-colors"
            />
          </div>
          <button
            onClick={handleGenerate}
            className="w-full py-2.5 rounded-lg text-white text-sm font-bold active:scale-[0.98] transition-transform"
            style={{ background: "linear-gradient(135deg, #c9a84c, #b89430)" }}
          >
            生成充值码
          </button>
        </div>
      </div>

      {/* 充值码列表 */}
      <div className="mt-4 bg-white rounded-xl p-4 border border-[#e8e8e8]">
        <h3 className="text-sm font-bold text-[#1a1a1a] mb-3">充值码列表</h3>
        <div className="space-y-2">
          {codes.map((c) => (
            <div
              key={c.code}
              className={`flex items-center justify-between py-2.5 px-3 rounded-lg border ${
                c.used ? "bg-[#fafafa] border-[#e8e8e8]" : "bg-white border-[#c9a84c]/30"
              }`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-mono font-bold ${c.used ? "text-[#999]" : "text-[#1a1a1a]"}`}>
                    {c.code}
                  </span>
                  {c.used ? (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 font-medium">
                      已使用
                    </span>
                  ) : (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-green-100 text-green-700 font-medium">
                      可用
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-[#999] mt-0.5">
                  {c.desc} · 创建: {c.createdAt}
                  {c.usedBy && ` · 使用者: ${c.usedBy}`}
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                <span className="text-sm font-bold text-[#c9a84c]">¥{(c.amount / 100).toFixed(0)}</span>
                {!c.used && (
                  <>
                    <button
                      onClick={() => handleCopy(c.code)}
                      className="p-1.5 rounded-lg bg-[#fdf8ed] text-[#c9a84c] active:scale-95 transition-transform"
                      title="复制"
                    >
                      {copiedCode === c.code ? (
                        <span className="text-[10px] font-bold">✓</span>
                      ) : (
                        <Copy size={12} />
                      )}
                    </button>
                    <button
                      onClick={() => handleDelete(c.code)}
                      className="p-1.5 rounded-lg bg-red-50 text-red-400 active:scale-95 transition-transform"
                      title="删除"
                    >
                      <Trash2 size={12} />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
          {codes.length === 0 && (
            <p className="text-xs text-[#999] text-center py-4">暂无充值码</p>
          )}
        </div>
      </div>

      {/* 提示 */}
      <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-xl p-3">
        <p className="text-xs text-yellow-700">
          💡 Phase 1 充值码为前端硬编码管理。生成新码后，需手动同步到 <code className="bg-yellow-100 px-1 rounded">useWallet.ts</code> 中的 TOPUP_CODES 常量，方可生效。
        </p>
      </div>
    </>
  );
}
