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
  Eye,
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

// ── Mock 数据（分销 / 内容模块尚未接入服务端，先保留占位；订单/用户/收入已接真实数据）──
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
  { id: "c5", title: "易经·乾卦解读", type: "易卦", status: "已上架", views: 234 },
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

// ── 总览 Tab（真实数据）──
function OverviewTab() {
  const [stats, setStats] = useState<{
    users: number; vip: number; revenue: number; pending: number;
    monthRevenue: number; monthCard: number; yearCard: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/users/list").then((r) => r.json()),
      fetch("/api/orders/list").then((r) => r.json()),
    ])
      .then(([uRes, oRes]) => {
        const users = uRes.success ? uRes.users : [];
        const orders = oRes.success ? oRes.data : [];
        const paid = orders.filter((o: any) => o.status === "paid");
        const thisMonth = new Date().toISOString().slice(0, 7);
        const monthPaid = paid.filter(
          (o: any) => (o.paidAt || o.createdAt).slice(0, 7) === thisMonth
        );
        setStats({
          users: users.length,
          vip: new Set(paid.map((o: any) => o.userId)).size,
          revenue: paid.reduce((s: number, o: any) => s + o.amount, 0),
          pending: orders.filter(
            (o: any) => o.status === "pending" || o.status === "short_paid"
          ).length,
          monthRevenue: monthPaid.reduce((s: number, o: any) => s + o.amount, 0),
          monthCard: monthPaid
            .filter((o: any) => o.plan === "month")
            .reduce((s: number, o: any) => s + o.amount, 0),
          yearCard: monthPaid
            .filter((o: any) => o.plan === "year")
            .reduce((s: number, o: any) => s + o.amount, 0),
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const s = stats;
  const lv = (v: number | string) => (loading ? "…" : v);

  return (
    <>
      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-3 mt-4">
        <KPICard label="总用戶" value={lv(s ? s.users : 0)} change={0} icon={Users} color="#c9a84c" />
        <KPICard label="付费VIP" value={lv(s ? s.vip : 0)} change={0} icon={Sparkles} color="#8b5cf6" />
        <KPICard label="累计收入" value={lv(s ? `¥${s.revenue}` : "¥0")} change={0} icon={DollarSign} color="#10b981" />
        <KPICard label="待确认" value={lv(s ? s.pending : 0)} change={0} icon={ShoppingCart} color="#f59e0b" />
      </div>

      {/* 本月收入构成 */}
      <div className="mt-4 bg-white rounded-xl p-4 border border-[#e8e8e8]">
        <h3 className="text-sm font-bold text-[#1a1a1a] mb-3 flex items-center gap-2">
          <DollarSign size={14} className="text-[#c9a84c]" />
          本月收入 ¥{loading ? "…" : s ? s.monthRevenue : 0}
        </h3>
        <div className="space-y-3">
          {[
            { label: "月卡 ¥68", value: s ? s.monthCard : 0, color: "#c9a84c" },
            { label: "年卡 ¥198", value: s ? s.yearCard : 0, color: "#8b5cf6" },
          ].map((item) => {
            const total = (s ? s.monthCard : 0) + (s ? s.yearCard : 0) || 1;
            const pct = Math.round((item.value / total) * 100);
            return (
              <div key={item.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-[#333]">{item.label}</span>
                  <span className="text-xs font-bold text-[#1a1a1a]">¥{item.value} ({pct}%)</span>
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

// ── 用戶 Tab（真实数据）──
function UsersTab() {
  const [users, setUsers] = useState<any[]>([]);
  const [vipIds, setVipIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/users/list").then((r) => r.json()),
      fetch("/api/orders/list").then((r) => r.json()),
    ])
      .then(([uRes, oRes]) => {
        const us = uRes.success ? uRes.users : [];
        const orders = oRes.success ? oRes.data : [];
        const paid = new Set<string>(
          orders.filter((o: any) => o.status === "paid").map((o: any) => o.userId)
        );
        setUsers(us);
        setVipIds(paid);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const vipCount = users.filter((u) => vipIds.has(u.id)).length;
  const boundCount = users.filter((u) => u.phone).length;

  return (
    <>
      <div className="mt-4 grid grid-cols-3 gap-3">
        <div className="bg-white rounded-xl p-3 border border-[#e8e8e8] text-center">
          <p className="text-xl font-bold text-[#c9a84c]">{users.length}</p>
          <p className="text-[10px] text-[#999]">总用戶</p>
        </div>
        <div className="bg-white rounded-xl p-3 border border-[#e8e8e8] text-center">
          <p className="text-xl font-bold text-[#10b981]">{vipCount}</p>
          <p className="text-[10px] text-[#999]">付费VIP</p>
        </div>
        <div className="bg-white rounded-xl p-3 border border-[#e8e8e8] text-center">
          <p className="text-xl font-bold text-[#6366f1]">{boundCount}</p>
          <p className="text-[10px] text-[#999]">已绑手机</p>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {loading ? (
          <div className="text-center py-8">
            <RefreshCw size={20} className="animate-spin mx-auto text-[#999]" />
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-8 text-sm text-[#999]">暂无用户</div>
        ) : (
          users.map((u) => (
            <div key={u.id} className="bg-white rounded-xl p-3 border border-[#e8e8e8] flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#fdf8ed] flex items-center justify-center flex-shrink-0">
                <span className="text-sm">🧘</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-[#1a1a1a] truncate">{u.nickname || "修行者"}</span>
                  {vipIds.has(u.id) && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#c9a84c] text-white font-bold">VIP</span>
                  )}
                </div>
                <p className="text-[10px] text-[#999]">
                  {u.phone ? `手机 ${u.phone}` : "未绑手机"}
                  {u.wechatId ? ` · 微信 ${u.wechatId}` : ""}
                </p>
                <p className="text-[10px] text-[#999]">加入: {(u.createdAt || "").slice(0, 10)}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}

// ── 收入 Tab（真实数据）──
function RevenueTab() {
  const [paid, setPaid] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/orders/list")
      .then((r) => r.json())
      .then((oRes) => {
        const orders = oRes.success ? oRes.data : [];
        setPaid(orders.filter((o: any) => o.status === "paid"));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const total = paid.reduce((s: number, o: any) => s + o.amount, 0);
  const monthCard = paid.filter((o: any) => o.plan === "month").reduce((s: number, o: any) => s + o.amount, 0);
  const yearCard = paid.filter((o: any) => o.plan === "year").reduce((s: number, o: any) => s + o.amount, 0);

  return (
    <>
      <div className="mt-4 bg-gradient-to-br from-[#1a1a2e] to-[#16213e] rounded-xl p-5 text-white">
        <p className="text-xs text-white/60 mb-1">累计确认收入</p>
        <p className="text-3xl font-bold">¥{total}</p>
        <p className="text-xs text-white/40 mt-1">{paid.length} 笔已确认订单</p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="bg-white rounded-xl p-3 border border-[#e8e8e8]">
          <p className="text-xs text-[#999]">月卡收入</p>
          <p className="text-lg font-bold text-[#c9a84c]">¥{monthCard}</p>
        </div>
        <div className="bg-white rounded-xl p-3 border border-[#e8e8e8]">
          <p className="text-xs text-[#999]">年卡收入</p>
          <p className="text-lg font-bold text-[#6366f1]">¥{yearCard}</p>
        </div>
      </div>

      <div className="mt-4 bg-white rounded-xl p-4 border border-[#e8e8e8]">
        <h3 className="text-sm font-bold text-[#1a1a1a] mb-3">已确认订单</h3>
        {loading ? (
          <div className="text-center py-6">
            <RefreshCw size={18} className="animate-spin mx-auto text-[#999]" />
          </div>
        ) : paid.length === 0 ? (
          <p className="text-xs text-[#999] text-center py-4">暂无确认收入</p>
        ) : (
          <div className="space-y-2">
            {paid.slice(0, 30).map((o: any) => (
              <div key={o.id} className="flex items-center justify-between py-2 border-b border-[#f5f5f5] last:border-0">
                <div>
                  <p className="text-xs font-bold text-[#1a1a1a]">
                    {o.userName}
                    {o.userPhone ? ` · ${o.userPhone}` : ""}
                  </p>
                  <p className="text-[10px] text-[#999]">
                    {o.plan === "month" ? "月卡" : "年卡"} · 确认于 {(o.paidAt || o.createdAt).slice(0, 10)}
                  </p>
                </div>
                <p className="text-sm font-bold text-[#c9a84c]">¥{o.amount}</p>
              </div>
            ))}
          </div>
        )}
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
  value: number | string;
  change: number;
  icon: any;
  color: string;
}) {
  const isPositive = change >= 0;
  return (
    <div className="bg-white rounded-xl p-3 border border-[#e8e8e8]">
      <div className="flex items-center justify-between mb-1">
        <Icon size={14} style={{ color }} />
        {change !== 0 && (
          <span
            className={`text-[9px] font-bold flex items-center gap-0.5 ${
              isPositive ? "text-green-500" : "text-red-500"
            }`}
          >
            {isPositive ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
            {Math.abs(change)}%
          </span>
        )}
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

// ── 订单管理 Tab（VIP付款确认 + 金额比对）──
function OrdersTab() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [confirmMsg, setConfirmMsg] = useState<{ text: string; success: boolean } | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectOrderId, setRejectOrderId] = useState<string | null>(null);
  // ── 确认收款：金额输入 ──
  const [confirmOrderId, setConfirmOrderId] = useState<string | null>(null);
  const [actualAmount, setActualAmount] = useState("");
  const [forceConfirmReason, setForceConfirmReason] = useState("");
  const [amountWarning, setAmountWarning] = useState<string | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const res = await fetch("/api/orders/list");
      const data = await res.json();
      if (data.success) {
        // 按优先级排序：pending > short_paid > paid > rejected
        const priority: Record<string, number> = { pending: 0, short_paid: 1, paid: 2, rejected: 3, expired: 4 };
        setOrders(data.data.sort((a: any, b: any) => {
          const pa = priority[a.status] ?? 5;
          const pb = priority[b.status] ?? 5;
          if (pa !== pb) return pa - pb;
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }));
      }
    } catch {}
    setLoading(false);
  };

  // ── 金额比对实时提示 ──
  const checkAmountWarning = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    const inputVal = parseFloat(actualAmount);
    if (!isNaN(inputVal) && inputVal < order.amount) {
      setAmountWarning(`⚠️ 订单 ¥${order.amount}，实收 ¥${inputVal}，差额 ¥${order.amount - inputVal}。如需强制激活请填写原因，否则将标记「收款不足」不激活VIP。`);
    } else {
      setAmountWarning(null);
    }
  };

  const handleConfirmSubmit = async () => {
    if (!confirmOrderId) return;
    const amt = parseFloat(actualAmount);
    if (isNaN(amt) || amt <= 0) {
      setConfirmMsg({ text: "请输入有效的收款金额", success: false });
      return;
    }

    try {
      const res = await fetch("/api/orders/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: confirmOrderId,
          adminPassword: "yixu2026",
          actualAmount: amt,
          forceConfirmReason: forceConfirmReason.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        const msg = data.warning
          ? `✓ VIP已强制激活（实收 ¥${amt}，原因已记录）`
          : `✓ 订单已确认，VIP已激活（实收 ¥${amt}）`;
        setConfirmMsg({ text: msg, success: true });
        setConfirmOrderId(null);
        setActualAmount("");
        setForceConfirmReason("");
        setAmountWarning(null);
        loadOrders();
        setTimeout(() => setConfirmMsg(null), 4000);
      } else {
        // short_paid 等
        setConfirmMsg({ text: data.message || "确认失败", success: false });
        loadOrders();
        if (data.data?.status === "short_paid") {
          // 保留输入框，让用户可以填强制确认原因
          setAmountWarning(data.message);
        }
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
    shortPaid: orders.filter((o) => o.status === "short_paid").length,
    paid: orders.filter((o) => o.status === "paid").length,
    rejected: orders.filter((o) => o.status === "rejected").length,
    totalRevenue: orders.filter((o) => o.status === "paid").reduce((s: number, o: any) => s + (o.actualAmount ? o.actualAmount / 100 : o.amount), 0),
  };

  return (
    <>
      {/* 统计卡片 */}
      <div className="mt-4 grid grid-cols-4 gap-2">
        <StatCard label="总订单" value={stats.total} color="#666" />
        <StatCard label="⚡待确认" value={stats.pending + stats.shortPaid} color="#f59e0b" highlight />
        <StatCard label="✓已激活" value={stats.paid} color="#10b981" />
        <StatCard label="💰实收" value={`¥${stats.totalRevenue.toFixed(2)}`} color="#c9a84c" />
      </div>

      {/* 筛选 */}
      <div className="mt-3 flex gap-2 flex-wrap">
        {["all", "pending", "short_paid", "paid", "rejected"].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              statusFilter === s
                ? "bg-[#c9a84c] text-white"
                : s === "short_paid"
                  ? "bg-orange-50 text-orange-600 hover:bg-orange-100"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {{ all: "全部", pending: "待确认", short_paid: "⚠收款不足", paid: "已激活", rejected: "已拒绝" }[s]}
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
              onConfirmStart={() => {
                setConfirmOrderId(order.id);
                setActualAmount(String(order.amount));
                setForceConfirmReason("");
                setAmountWarning(null);
              }}
              onRejectStart={() => { setRejectOrderId(order.id); }}
              // 确认收款输入框状态
              isConfirming={confirmOrderId === order.id}
              actualAmount={actualAmount}
              setActualAmount={(v) => { setActualAmount(v); checkAmountWarning(order.id); }}
              forceConfirmReason={forceConfirmReason}
              setForceConfirmReason={setForceConfirmReason}
              amountWarning={amountWarning}
              onConfirmSubmit={handleConfirmSubmit}
              onCancelConfirm={() => { setConfirmOrderId(null); setActualAmount(""); setForceConfirmReason(""); setAmountWarning(null); }}
              // 拒绝输入框状态
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

// ── 订单卡片组件（含金额输入）──
function OrderCard({
  order,
  onConfirmStart,
  onRejectStart,
  isConfirming,
  actualAmount,
  setActualAmount,
  forceConfirmReason,
  setForceConfirmReason,
  amountWarning,
  onConfirmSubmit,
  onCancelConfirm,
  isRejecting,
  rejectReason,
  setRejectReason,
  onSubmitReject,
  onCancelReject,
}: {
  order: any;
  onConfirmStart: () => void;
  onRejectStart: () => void;
  isConfirming: boolean;
  actualAmount: string;
  setActualAmount: (v: string) => void;
  forceConfirmReason: string;
  setForceConfirmReason: (v: string) => void;
  amountWarning: string | null;
  onConfirmSubmit: () => void;
  onCancelConfirm: () => void;
  isRejecting: boolean;
  rejectReason: string;
  setRejectReason: (v: string) => void;
  onSubmitReject: () => void;
  onCancelReject: () => void;
}) {
  const isPending = order.status === "pending";
  const isShortPaid = order.status === "short_paid";

  const statusStyle: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700",
    short_paid: "bg-orange-100 text-orange-700",
    paid: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-500",
  };
  const statusLabel: Record<string, string> = {
    pending: "待确认",
    short_paid: "⚠收款不足",
    paid: "已激活",
    rejected: "已拒绝",
  };

  return (
    <div className={`rounded-xl p-3 border ${
      isPending ? "bg-yellow-50/50 border-yellow-300/50" :
      isShortPaid ? "bg-orange-50/50 border-orange-300/50" :
      "bg-white border-[#e8e8e8]"
    }`}>
      <div className="flex justify-between items-start mb-2">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-bold text-[#1a1a1a]">{order.userName}</span>
            {order.userPhone && (
              <span className="text-[10px] text-[#999]">{order.userPhone}</span>
            )}
            <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${statusStyle[order.status] || "bg-gray-100 text-gray-600"}`}>
              {order.plan === "month" ? "月卡¥68" : "年卡¥198"}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${statusStyle[order.status]}`}>
              {statusLabel[order.status] || order.status}
            </span>
            <p className="text-[10px] text-[#999] font-mono">#{order.id.slice(0, 14)}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-[#c9a84c]">¥{order.amount}</p>
          {/* 已确认订单显示实收金额 */}
          {order.status === "paid" && order.actualAmount && (
            <p className="text-[10px] text-green-600 font-bold">
              实收 ¥{(order.actualAmount / 100).toFixed(2)}
            </p>
          )}
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

      {/* short_paid 提示 */}
      {isShortPaid && (
        <div className="mb-2 p-2 bg-orange-50 rounded-lg border border-orange-200">
          <p className="text-[11px] text-orange-700 font-bold">⚠️ 收款不足，VIP未激活</p>
          {order.note && (
            <p className="text-[10px] text-orange-600 mt-0.5">{order.note}</p>
          )}
        </div>
      )}

      {/* 拒绝原因显示 */}
      {(order.status === "rejected" || order.rejectReason) && (
        <div className="mb-2 p-2 bg-red-50 rounded-lg">
          <p className="text-[11px] text-red-600">🗙 原因: {order.rejectReason}</p>
        </div>
      )}

      {/* 强制确认原因显示 */}
      {order.forceConfirmReason && (
        <div className="mb-2 p-2 bg-yellow-50/50 rounded-lg border border-yellow-200/50">
          <p className="text-[10px] text-yellow-700">⚡ 强制确认原因: {order.forceConfirmReason}</p>
        </div>
      )}

      {/* 操作按钮：待确认 / 收款不足 */}
      {(isPending || isShortPaid) && !isConfirming && !isRejecting && (
        <div className="flex gap-2">
          <button
            onClick={onConfirmStart}
            className="flex-1 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white text-xs font-bold active:scale-[0.97] transition-all flex items-center justify-center gap-1"
          >
            <Check size={12} /> 确认收款
          </button>
          <button
            onClick={onRejectStart}
            className="py-2 px-4 rounded-lg border border-red-300 text-red-500 text-xs font-medium active:scale-[0.97] transition-all"
          >
            <XCircle size={12} /> 拒绝
          </button>
        </div>
      )}

      {/* 确认收款输入框 */}
      {isConfirming && (
        <div className="space-y-2 mt-1">
          <div className="p-2.5 bg-[#fafafa] rounded-lg border border-[#e8e8e8]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-[#666]">订单金额</span>
              <span className="text-sm font-bold text-[#1a1a1a]">¥{order.amount}</span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-[#666]">实收金额</span>
              <div className="flex items-center gap-1">
                <span className="text-[10px] text-[#999]">¥</span>
                <input
                  type="number"
                  step="0.01"
                  value={actualAmount}
                  onChange={(e) => setActualAmount(e.target.value)}
                  placeholder={String(order.amount)}
                  autoFocus
                  className="w-24 px-2 py-1.5 rounded-lg border border-[#c9a84c]/50 text-sm font-bold text-right outline-none focus:border-[#c9a84c]"
                />
              </div>
            </div>
            {amountWarning && (
              <div className="p-2 bg-orange-50 rounded-lg border border-orange-200 mb-2">
                <p className="text-[11px] text-orange-700 font-medium">{amountWarning}</p>
              </div>
            )}
            {/* 金额不足时显示强制确认输入 */}
            {parseFloat(actualAmount) < order.amount && (
              <div>
                <label className="text-[10px] text-orange-600 block mb-1">强制确认原因（必填）</label>
                <input
                  type="text"
                  value={forceConfirmReason}
                  onChange={(e) => setForceConfirmReason(e.target.value)}
                  placeholder="如：老学员优惠、特殊协商等"
                  className="w-full px-3 py-2 rounded-lg border border-orange-300 text-xs outline-none focus:border-orange-400"
                />
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={onConfirmSubmit}
              disabled={
                parseFloat(actualAmount) <= 0 ||
                (parseFloat(actualAmount) < order.amount && !forceConfirmReason.trim())
              }
              className="flex-1 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white text-xs font-bold disabled:opacity-40 active:scale-[0.97] transition-all flex items-center justify-center gap-1"
            >
              <Check size={12} />
              {parseFloat(actualAmount) >= order.amount ? "确认并激活 VIP" : "强制激活 VIP"}
            </button>
            <button
              onClick={onCancelConfirm}
              className="py-2 px-4 rounded-lg border border-gray-300 text-gray-500 text-xs active:scale-[0.97]"
            >
              取消
            </button>
          </div>
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

      {!isPending && !isShortPaid && order.status === "paid" && order.paidAt && (
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
