"use client";

import { useState, useEffect, useCallback } from "react";
import { BarChart3, Handshake, TrendingUp, Users, Clock, Download, LogOut, ChevronRight, Sparkles, Target, DollarSign, Heart, MessageCircle } from "lucide-react";
import Link from "next/link";

interface Stats {
  totalAssessments: number;
  byType: { enneagram: number; chakra: number; yijing: number };
  lastActivity: number;
}

type Tab = "partner" | "stats";

export default function B2BDashboardPage() {
  const [clientId, setClientId] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("partner");

  useEffect(() => {
    setMounted(true);
    const params = new URLSearchParams(window.location.search);
    const cid = params.get("clientId");
    if (cid) {
      setClientId(cid);
      doLogin(cid);
    }
  }, []);

  const doLogin = async (cid: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/b2b/stats?clientId=${cid}`);
      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
        setLoggedIn(true);
      } else {
        if (cid === "yixu-founder") {
          setStats({ totalAssessments: 0, byType: { enneagram: 0, chakra: 0, yijing: 0 }, lastActivity: 0 });
          setLoggedIn(true);
        }
      }
    } catch {
      if (cid === "yixu-founder") {
        setStats({ totalAssessments: 0, byType: { enneagram: 0, chakra: 0, yijing: 0 }, lastActivity: 0 });
        setLoggedIn(true);
      }
    }
    setLoading(false);
  };

  const handleLogin = useCallback(async () => {
    if (!clientId) return;
    doLogin(clientId);
  }, [clientId]);

  const refreshStats = useCallback(async () => {
    if (!clientId) return;
    try {
      const res = await fetch(`/api/b2b/stats?clientId=${clientId}`);
      const data = await res.json();
      if (data.success) setStats(data.stats);
    } catch { /* ignore */ }
  }, [clientId]);

  useEffect(() => {
    if (loggedIn) {
      refreshStats();
      const interval = setInterval(refreshStats, 30000);
      return () => clearInterval(interval);
    }
  }, [loggedIn, refreshStats]);

  const exportCSV = () => {
    if (!stats) return;
    const csv = [
      "類型,次數",
      `九型人格,${stats.byType.enneagram}`,
      `7脈輪,${stats.byType.chakra}`,
      `易經,${stats.byType.yijing}`,
      `總計,${stats.totalAssessments}`,
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `亦須AI_數據報表_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const fmtDate = (ts: number) => {
    if (!ts) return "暫無數據";
    return new Date(ts).toLocaleString("zh-HK");
  };

  if (!mounted) return null;

  // 登入頁
  if (!loggedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white px-6">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#c9a84c] to-[#b89430] flex items-center justify-center mb-4">
          <Handshake size={32} className="text-white" />
        </div>
        <h1 className="text-xl font-bold text-[#1a1a1a] mb-1">亦須AI 合作夥伴</h1>
        <p className="text-sm text-[#999] mb-6 text-center">
          輸入客戶 ID 登入
        </p>
        <input
          type="text"
          value={clientId}
          onChange={(e) => setClientId(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          placeholder="輸入客戶 ID"
          className="w-full max-w-xs px-4 py-3 rounded-xl border border-[#e8e8e8] text-center outline-none focus:border-[#c9a84c]"
        />
        <button
          onClick={handleLogin}
          disabled={loading}
          className="mt-4 px-8 py-2.5 rounded-full bg-gradient-to-r from-[#c9a84c] to-[#b89430] text-white font-bold disabled:opacity-50"
        >
          {loading ? "登入中..." : "登入"}
        </button>
        <p className="text-xs text-[#c9a84c] mt-3 font-mono">測試碼：yixu-demo</p>
      </div>
    );
  }

  // 登入後 — 招商主頁
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <header className="sticky top-0 z-10 bg-white/95 backdrop-blur-md px-4 py-3 border-b border-[#e8e8e8]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Handshake size={20} className="text-[#c9a84c]" />
            <h1 className="text-lg font-bold text-[#1a1a1a]">亦須AI 合作夥伴</h1>
          </div>
          <button onClick={() => { setLoggedIn(false); setStats(null); }} className="p-1 text-[#999]">
            <LogOut size={18} />
          </button>
        </div>
      </header>

      {/* Tab 切換 */}
      <div className="flex border-b border-[#e8e8e8]">
        <button
          onClick={() => setActiveTab("partner")}
          className={`flex-1 py-2.5 text-sm font-medium text-center transition-colors ${activeTab === "partner" ? "text-[#c9a84c] border-b-2 border-[#c9a84c]" : "text-[#999]"}`}
        >
          合作方案
        </button>
        <button
          onClick={() => setActiveTab("stats")}
          className={`flex-1 py-2.5 text-sm font-medium text-center transition-colors ${activeTab === "stats" ? "text-[#c9a84c] border-b-2 border-[#c9a84c]" : "text-[#999]"}`}
        >
          數據面板
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-8">
        {activeTab === "partner" ? (
          /* ============ 招商主頁 ============ */
          <>
            {/* Hero */}
            <div className="mt-4 rounded-2xl p-5 text-white" style={{ background: "linear-gradient(135deg, #c9a84c, #a88830)" }}>
              <p className="text-sm font-medium opacity-80 mb-1">亦須AI · 合作夥伴計劃</p>
              <h2 className="text-xl font-bold mb-2">讓療癒智慧，成為你的生意增長點</h2>
              <p className="text-sm opacity-80 leading-relaxed">
                整合 Sino-NLP 中華身心語言學 × 傳統經學 × 行為心理學，為你的客戶帶來深度測評體驗
              </p>
            </div>

            {/* 為什麼合作 */}
            <div className="mt-5">
              <h3 className="font-bold text-[#1a1a1a] mb-3 flex items-center gap-2">
                <Sparkles size={16} className="text-[#c9a84c]" />
                為什麼選擇亦須AI
              </h3>
              <div className="space-y-3">
                {[
                  { icon: Target, title: "專業測評工具", desc: "九型人格、7脈輪、易經占卜 — 每個測評都經 Sino-NLP 體系設計，不是網上免費貨色" },
                  { icon: Users, title: "為你的客戶增值", desc: "用測評做客戶破冰和深度連結，從「消費者」變成「追隨者」" },
                  { icon: DollarSign, title: "零成本啟動", desc: "無需開發、無需伺服器、無需技術人員。接入即用，你只管服務客戶" },
                  { icon: Heart, title: "品牌差異化", desc: "市場上獨此一家的中華經學 × 心理學測評體系，讓你脫穎而出" },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.title} className="card flex gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#fdf8ed] flex items-center justify-center flex-shrink-0">
                        <Icon size={20} className="text-[#c9a84c]" />
                      </div>
                      <div>
                        <p className="font-semibold text-[#1a1a1a] text-sm">{item.title}</p>
                        <p className="text-xs text-[#666] mt-0.5 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 適合誰 */}
            <div className="mt-5">
              <h3 className="font-bold text-[#1a1a1a] mb-3">適合這些行業</h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  "身心靈工作室",
                  "芳療 / 精油品牌",
                  "瑜伽 / 冥想導師",
                  "心理諮詢機構",
                  "中醫 / 養生館",
                  "企業培訓公司",
                ].map((item) => (
                  <div key={item} className="px-3 py-2.5 rounded-lg bg-[#fdf8ed] text-sm text-[#333] text-center">
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* 合作方案 */}
            <div className="mt-5">
              <h3 className="font-bold text-[#1a1a1a] mb-3 flex items-center gap-2">
                <TrendingUp size={16} className="text-[#c9a84c]" />
                合作方案
              </h3>
              <div className="space-y-3">
                {/* 體驗版 */}
                <div className="card border border-[#e8e8e8]">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-[#1a1a1a]">體驗版</h4>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-[#fdf8ed] text-[#c9a84c] font-medium">免費試用</span>
                  </div>
                  <p className="text-xs text-[#666] mb-2">7天免費體驗，了解平台功能</p>
                  <div className="text-xs text-[#999] space-y-0.5">
                    <p>✓ 九型人格測評</p>
                    <p>✓ 7脈輪評估</p>
                    <p>✓ 易經占卜</p>
                    <p>✓ 基礎數據面板</p>
                  </div>
                </div>
                {/* 專業版 */}
                <div className="card border-2 border-[#c9a84c] relative">
                  <div className="absolute -top-2.5 left-4 px-2 py-0.5 rounded-full bg-[#c9a84c] text-white text-[10px] font-bold">推薦</div>
                  <div className="flex items-center justify-between mb-2 mt-1">
                    <h4 className="font-bold text-[#1a1a1a]">專業版</h4>
                    <span className="text-sm font-bold text-[#c9a84c]">詳詢</span>
                  </div>
                  <p className="text-xs text-[#666] mb-2">完整功能 + 深度數據 + 品牌定制</p>
                  <div className="text-xs text-[#999] space-y-0.5">
                    <p>✓ 體驗版全部功能</p>
                    <p>✓ 孟子塔羅（即將推出）</p>
                    <p>✓ 進階數據分析</p>
                    <p>✓ 品牌專屬頁面定制</p>
                    <p>✓ 專屬客戶服務群</p>
                    <p>✓ 亦須先生每月線上指導</p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-5 card bg-[#fdf8ed]">
              <div className="flex items-center gap-2 mb-2">
                <MessageCircle size={18} className="text-[#c9a84c]" />
                <h4 className="font-bold text-[#1a1a1a]">立即洽談</h4>
              </div>
              <p className="text-sm text-[#666] mb-3">
                加微信 <span className="font-mono font-bold text-[#1a1a1a]">859022196</span>，備註「亦須AI合作」
              </p>
              <p className="text-xs text-[#999]">
                由亦須先生本人直接洽談，非客服機器人
              </p>
            </div>

            {/* 返回主App */}
            <Link
              href="/"
              className="mt-4 flex items-center justify-center gap-2 py-3 rounded-xl border border-[#e8e8e8] text-sm text-[#666] hover:bg-[#fafafa] active:scale-[0.98] transition-all"
            >
              返回亦須AI主頁
              <ChevronRight size={16} />
            </Link>
          </>
        ) : (
          /* ============ 數據面板（附屬 tab） ============ */
          <>
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="card text-center">
                <Users size={20} className="mx-auto text-[#c9a84c] mb-1" />
                <p className="text-3xl font-bold text-[#1a1a1a]">{stats?.totalAssessments || 0}</p>
                <p className="text-xs text-[#999]">總測評次數</p>
              </div>
              <div className="card text-center">
                <Clock size={20} className="mx-auto text-blue-500 mb-1" />
                <p className="text-sm font-bold text-[#1a1a1a] mt-1">
                  {stats?.lastActivity ? fmtDate(stats.lastActivity) : "暫無"}
                </p>
                <p className="text-xs text-[#999]">最後活動</p>
              </div>
            </div>

            <div className="mt-4 card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-[#1a1a1a] flex items-center gap-2">
                  <BarChart3 size={16} className="text-[#c9a84c]" />
                  測評分佈
                </h3>
                <button onClick={exportCSV} className="flex items-center gap-1 text-xs text-[#c9a84c] font-medium">
                  <Download size={14} /> 匯出
                </button>
              </div>
              <div className="space-y-3">
                {[
                  { label: "九型人格", count: stats?.byType.enneagram || 0, color: "bg-[#c9a84c]" },
                  { label: "7脈輪", count: stats?.byType.chakra || 0, color: "bg-purple-500" },
                  { label: "易經", count: stats?.byType.yijing || 0, color: "bg-blue-500" },
                ].map((item) => {
                  const max = Math.max(stats?.byType.enneagram || 1, stats?.byType.chakra || 1, stats?.byType.yijing || 1);
                  const pct = (item.count / max) * 100;
                  return (
                    <div key={item.label}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-[#333]">{item.label}</span>
                        <span className="text-sm font-bold text-[#1a1a1a]">{item.count} 次</span>
                      </div>
                      <div className="h-2 bg-[#f5f5f5] rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-500 ${item.color}`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 card">
              <h3 className="font-bold text-[#1a1a1a] mb-2">帳戶資訊</h3>
              <div className="text-sm text-[#666] space-y-1">
                <p>客戶 ID: <span className="text-[#333] font-mono text-xs">{clientId}</span></p>
                <p>方案: <span className="text-[#c9a84c] font-bold">試用中</span></p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
