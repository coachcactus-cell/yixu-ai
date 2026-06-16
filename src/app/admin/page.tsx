"use client";

import { useState, useEffect } from "react";
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
  Check,
  ShoppingCart,
  XCircle,
} from "lucide-react";
import Link from "next/link";

type Tab = "overview" | "users" | "revenue" | "distributors" | "content" | "topup-codes" | "orders";

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
    { key: "orders", label: "订单", icon: ShoppingCart },
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
        {activeTab === "orders" && <OrdersTab />}
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

// ── 订单管理 Tab（VIP付款确认）──
function OrdersTab() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [confirmMsg, setConfirmMsg] = useState<{ text: string; success: boolean } | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectOrderId, setRejectOrderId] = useState<string | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const res = await fetch("/api/orders/list");
      const data = await res.json();
      if (data.success) {
        // 按 pending 排最前
        setOrders(data.data.sort((a: any, b: any) => {
          if (a.status === "pending" && b.status !== "pending") return -1;
          if (a.status !== "pending" && b.status === "pending") return 1;
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }));
      }
    } catch {}
    setLoading(false);
  };

  const handleConfirm = async (orderId: string) => {
    try {
      const res = await fetch("/api/orders/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, adminPassword: "yixu2026" }),
      });
      const data = await res.json();
      if (data.success) {
        setConfirmMsg({ text: `✓ ${data.message}`, success: true });
        loadOrders();
        setTimeout(() => setConfirmMsg(null), 3000);
      } else {
        setConfirmMsg({ text: data.message, success: false });
      }
    } catch {
      setConfirmMsg({ text: "网络错误", success: false });
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim() || !rejectOrderId) return;
    try {
      const res = await fetch("/api/orders/reject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: rejectOrderId, reason: rejectReason, adminPassword: "yixu2026" }),
      });
      const data = await res.json();
      if (data.success) {
        setConfirmMsg({ text: `✓ 已拒绝`, success: true });
        setRejectOrderId(null);
        setRejectReason("");
        loadOrders();
        setTimeout(() => setConfirmMsg(null), 3000);
      } else {
        setConfirmMsg({ text: data.message, success: false });
      }
    } catch {}
  };

  const filteredOrders = statusFilter === "all"
    ? orders
    : orders.filter((o) => o.status === statusFilter);

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    paid: orders.filter((o) => o.status === "paid").length,
    rejected: orders.filter((o) => o.status === "rejected").length,
    totalRevenue: orders.filter((o) => o.status === "paid").reduce((s: number, o: any) => s + o.amount, 0),
  };

  return (
    <>
      {/* 统计卡片 */}
      <div className="mt-4 grid grid-cols-4 gap-2">
        <StatCard label="总订单" value={stats.total} color="#666" />
        <StatCard label="⚡待确认" value={stats.pending} color="#f59e0b" highlight />
        <StatCard label="✓已激活" value={stats.paid} color="#10b981" />
        <StatCard label="💰收入" value={`¥${stats.totalRevenue}`} color="#c9a84c" />
      </div>

      {/* 筛选 */}
      <div className="mt-3 flex gap-2">
        {["all", "pending", "paid", "rejected"].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              statusFilter === s
                ? "bg-[#c9a84c] text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {{ all: "全部", pending: "待确认", paid: "已激活", rejected: "已拒绝" }[s]}
            {s !== "all" && (
              <span className="ml-1 opacity-70">
                ({orders.filter((o) => o.status === s).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {confirmMsg && (
        <div className={`mt-3 p-2 rounded-lg text-xs font-medium text-center ${confirmMsg.success ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-600 border border-red-200"}`}>
          {confirmMsg.text}
        </div>
      )}

      {/* 订单列表 */}
      {loading ? (
        <div className="text-center py-8">
          <RefreshCw size={20} className="animate-spin mx-auto text-[#999]" />
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-8 text-sm text-[#999]">暂无订单</div>
      ) : (
        <div className="mt-3 space-y-2">
          {filteredOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onConfirm={() => handleConfirm(order.id)}
              onReject={() => { setRejectOrderId(order.id); }}
              isRejecting={rejectOrderId === order.id}
              rejectReason={rejectReason}
              setRejectReason={setRejectReason}
              onSubmitReject={handleReject}
              onCancelReject={() => { setRejectOrderId(null); setRejectReason(""); }}
            />
          ))}
        </div>
      )}
    </>
  );
}

// ── 订单卡片组件 ──
function OrderCard({
  order,
  onConfirm,
  onReject,
  isRejecting,
  rejectReason,
  setRejectReason,
  onSubmitReject,
  onCancelReject,
}: {
  order: any;
  onConfirm: () => void;
  onReject: () => void;
  isRejecting: boolean;
  rejectReason: string;
  setRejectReason: (v: string) => void;
  onSubmitReject: () => void;
  onCancelReject: () => void;
}) {
  const isPending = order.status === "pending";

  return (
    <div className={`rounded-xl p-3 border ${
      isPending ? "bg-yellow-50/50 border-yellow-300/50" : "bg-white border-[#e8e8e8]"
    }`}>
      <div className="flex justify-between items-start mb-2">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-bold text-[#1a1a1a]">{order.userName}</span>
            {order.userPhone && (
              <span className="text-[10px] text-[#999]">{order.userPhone}</span>
            )}
            <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${
              order.status === "paid" ? "bg-green-100 text-green-700" :
              order.status === "rejected" ? "bg-red-100 text-red-500" :
              "bg-yellow-100 text-yellow-700"
            }`}>
              {order.plan === "month" ? "月卡¥68" : "年卡¥198"}
            </span>
          </div>
          <p className="text-[10px] text-[#999] mt-0.5 font-mono">#{order.id.slice(0, 14)}</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-[#c9a84c]">¥{order.amount}</p>
          <p className="text-[10px] text-[#999]">
            {new Date(order.createdAt).toLocaleString("zh-CN")}
          </p>
        </div>
      </div>

      {/* 支付方式 + 备注 */}
      <div className="flex items-center gap-2 mb-2">
        <span className={`text-[10px] px-1.5 py-0.5 rounded ${
          order.paymentMethod === "wechat" ? "bg-green-50 text-green-600" : "bg-blue-50 text-blue-600"
        }`}>
          {order.paymentMethod === "wechat" ? "微信" : "支付宝"}
        </span>
        {order.note && (
          <span className="text-[10px] text-gray-500 truncate flex-1">备注: {order.note}</span>
        )}
      </div>

      {/* 拒绝原因显示 */}
      {(order.status === "rejected" || order.rejectReason) && (
        <div className="mb-2 p-2 bg-red-50 rounded-lg">
          <p className="text-[11px] text-red-600">🗙 原因: {order.rejectReason}</p>
        </div>
      )}

      {/* 操作按钮 */}
      {isPending && !isRejecting && (
        <div className="flex gap-2">
          <button
            onClick={onConfirm}
            className="flex-1 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white text-xs font-bold active:scale-[0.97] transition-all flex items-center justify-center gap-1"
          >
            <Check size={12} /> 确认收款 ✓
          </button>
          <button
            onClick={onReject}
            className="py-2 px-4 rounded-lg border border-red-300 text-red-500 text-xs font-medium active:scale-[0.97] transition-all"
          >
            <XCircle size={12} /> 拒绝
          </button>
        </div>
      )}

      {/* 拒绝输入框 */}
      {isRejecting && (
        <div className="space-y-2">
          <input
            type="text"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="请填写拒绝原因..."
            autoFocus
            className="w-full px-3 py-2 rounded-lg border border-red-300 text-xs outline-none focus:border-red-400"
          />
          <div className="flex gap-2">
            <button
              onClick={onSubmitReject}
              disabled={!rejectReason.trim()}
              className="flex-1 py-1.5 rounded-lg bg-red-500 text-white text-xs font-bold disabled:opacity-40 active:scale-[0.97] transition-all"
            >
              提交拒绝
            </button>
            <button
              onClick={onCancelReject}
              className="py-1.5 px-4 rounded-lg border border-gray-300 text-gray-500 text-xs active:scale-[0.97]"
            >
              取消
            </button>
          </div>
        </div>
      )}

      {!isPending && order.status === "paid" && order.paidAt && (
        <p className="text-[10px] text-green-600">✅ 已于 {new Date(order.paidAt).toLocaleString("zh-CN")} 激活</p>
      )}
    </div>
  );
}

// ── 统计小卡片 ──
function StatCard({ label, value, color, highlight }: { label: string; value: any; color: string; highlight?: boolean }) {
  return (
    <div className={`rounded-xl p-2.5 border text-center ${highlight ? "border-yellow-400/60 bg-yellow-50/80" : "bg-white border-[#e8e8e8]"}`}>
      <p className="text-base font-bold" style={{ color }}>{value}</p>
      <p className="text-[9px] text-[#999]">{label}</p>
    </div>
  );
}

// ── 充值码管理 Tab ──
function TopupCodesTab() {
  const [confirmCode, setConfirmCode] = useState("");
  const [confirmUserId, setConfirmUserId] = useState("");
  const [confirmAmount, setConfirmAmount] = useState("");
  const [confirmMsg, setConfirmMsg] = useState<{ text: string; success: boolean } | null>(null);
  const [confirmedList, setConfirmedList] = useState<Record<string, { amount: number; userId: string; confirmedAt: string }>>({});
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // 读取已确认码列表
  const loadList = () => {
    try {
      const raw = localStorage.getItem("yixu-confirmed-topup-codes");
      if (raw) setConfirmedList(JSON.parse(raw));
      else setConfirmedList({});
    } catch { setConfirmedList({}); }
  };

  useState(() => { loadList(); });

  const handleConfirm = () => {
    const code = confirmCode.trim().toUpperCase();
    const userId = confirmUserId.trim();
    const amountFen = Math.round(parseFloat(confirmAmount) * 100);

    if (!code || !userId || !amountFen) {
      setConfirmMsg({ text: "请填写所有字段", success: false });
      return;
    }

    const current = confirmedList;
    if (current[code]) {
      setConfirmMsg({ text: "此码已确认，请勿重复操作", success: false });
      return;
    }

    current[code] = { amount: amountFen, userId, confirmedAt: new Date().toISOString() };
    localStorage.setItem("yixu-confirmed-topup-codes", JSON.stringify(current));
    setConfirmedList({ ...current });
    setConfirmMsg({ text: `已确认 ${code}，¥${(amountFen / 100).toFixed(2)} 到账用户 ${userId}`, success: true });
    setConfirmCode("");
    setConfirmUserId("");
    setConfirmAmount("");
    setTimeout(() => setConfirmMsg(null), 3000);
  };

  const handleDelete = (code: string) => {
    const current = { ...confirmedList };
    delete current[code];
    localStorage.setItem("yixu-confirmed-topup-codes", JSON.stringify(current));
    setConfirmedList(current);
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 1500);
    });
  };

  const entries = Object.entries(confirmedList);
  const totalValue = entries.reduce((a, [, v]) => a + v.amount, 0);

  return (
    <>
      {/* 统计 */}
      <div className="mt-4 grid grid-cols-3 gap-3">
        <div className="bg-white rounded-xl p-3 border border-[#e8e8e8] text-center">
          <p className="text-xl font-bold text-[#c9a84c]">{entries.length}</p>
          <p className="text-[10px] text-[#999]">已确认码</p>
        </div>
        <div className="bg-white rounded-xl p-3 border border-[#e8e8e8] text-center">
          <p className="text-xl font-bold text-[#10b981]">{entries.filter(([k]) => { const used = localStorage.getItem("yixu-used-topup-codes"); return used ? !JSON.parse(used).includes(k) : true; }).length}</p>
          <p className="text-[10px] text-[#999]">待兑换</p>
        </div>
        <div className="bg-white rounded-xl p-3 border border-[#e8e8e8] text-center">
          <p className="text-xl font-bold text-[#6366f1]">¥{(totalValue / 100).toFixed(0)}</p>
          <p className="text-[10px] text-[#999]">总面值</p>
        </div>
      </div>

      {/* 确认充值码 */}
      <div className="mt-4 bg-white rounded-xl p-4 border border-[#e8e8e8]">
        <h3 className="text-sm font-bold text-[#1a1a1a] mb-3 flex items-center gap-2">
          <Check size={14} className="text-[#10b981]" />
          确认充值码（收款后操作）
        </h3>
        <div className="space-y-2">
          <input
            type="text"
            value={confirmCode}
            onChange={(e) => { setConfirmCode(e.target.value.toUpperCase()); setConfirmMsg(null); }}
            placeholder="充值码（如 YX50-ABCD）"
            className="w-full px-3 py-2.5 rounded-lg border border-[#e8e8e8] text-sm font-mono outline-none focus:border-[#c9a84c] transition-colors"
          />
          <input
            type="text"
            value={confirmUserId}
            onChange={(e) => { setConfirmUserId(e.target.value); setConfirmMsg(null); }}
            placeholder="用户ID（如 yx_xxx）"
            className="w-full px-3 py-2.5 rounded-lg border border-[#e8e8e8] text-sm outline-none focus:border-[#c9a84c] transition-colors"
          />
          <input
            type="number"
            value={confirmAmount}
            onChange={(e) => { setConfirmAmount(e.target.value); setConfirmMsg(null); }}
            placeholder="金额（元，如 50）"
            className="w-full px-3 py-2.5 rounded-lg border border-[#e8e8e8] text-sm outline-none focus:border-[#c9a84c] transition-colors"
          />
          {confirmMsg && (
            <p className={`text-xs text-center ${confirmMsg.success ? "text-green-600" : "text-red-500"}`}>
              {confirmMsg.text}
            </p>
          )}
          <button
            onClick={handleConfirm}
            className="w-full py-2.5 rounded-lg text-white text-sm font-bold active:scale-[0.98] transition-transform"
            style={{ background: "linear-gradient(135deg, #10b981, #059669)" }}
          >
            确认到账
          </button>
        </div>
      </div>

      {/* 已确认码列表 */}
      <div className="mt-4 bg-white rounded-xl p-4 border border-[#e8e8e8]">
        <h3 className="text-sm font-bold text-[#1a1a1a] mb-3">已确认码列表</h3>
        <div className="space-y-2">
          {entries.length === 0 ? (
            <p className="text-xs text-[#999] text-center py-4">暂无已确认的充值码</p>
          ) : entries.map(([code, info]) => {
            // 检查是否已被用户兑换
            let isUsed = false;
            try {
              const used = localStorage.getItem("yixu-used-topup-codes");
              if (used) isUsed = JSON.parse(used).includes(code);
            } catch {}
            return (
              <div
                key={code}
                className={`flex items-center justify-between py-2.5 px-3 rounded-lg border ${
                  isUsed ? "bg-[#fafafa] border-[#e8e8e8]" : "bg-white border-[#10b981]/30"
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-mono font-bold ${isUsed ? "text-[#999]" : "text-[#1a1a1a]"}`}>
                      {code}
                    </span>
                    {isUsed ? (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 font-medium">已兑换</span>
                    ) : (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-green-100 text-green-700 font-medium">待兑换</span>
                    )}
                  </div>
                  <p className="text-[10px] text-[#999] mt-0.5">
                    ¥{(info.amount / 100).toFixed(2)} · 用户: {info.userId} · 确认: {new Date(info.confirmedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                  <span className="text-sm font-bold text-[#c9a84c]">¥{(info.amount / 100).toFixed(2)}</span>
                  {!isUsed && (
                    <>
                      <button
                        onClick={() => handleCopy(code)}
                        className="p-1.5 rounded-lg bg-[#fdf8ed] text-[#c9a84c] active:scale-95 transition-transform"
                      >
                        {copiedCode === code ? <span className="text-[10px] font-bold">✓</span> : <Copy size={12} />}
                      </button>
                      <button
                        onClick={() => handleDelete(code)}
                        className="p-1.5 rounded-lg bg-red-50 text-red-400 active:scale-95 transition-transform"
                      >
                        <Trash2 size={12} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 流程提示 */}
      <div className="mt-4 bg-[#fdf8ed] border border-[#c9a84c]/20 rounded-xl p-3">
        <p className="text-xs text-[#666] leading-relaxed">
          💡 充值流程：客户选金额 → 生成专属码 → 客户扫码付款备注码 → 你确认收款 → 在这里输入码+用户ID+金额 → 点「确认到账」→ 客户APP兑换码即到账。
        </p>
      </div>
    </>
  );
}
