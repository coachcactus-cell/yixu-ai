"use client";

import { useState, useEffect, useCallback } from "react";
import { BarChart3, Users, TrendingUp, Clock, Download, LogOut } from "lucide-react";

interface Stats {
  totalAssessments: number;
  byType: { enneagram: number; chakra: number; yijing: number };
  lastActivity: number;
}

export default function B2BDashboardPage() {
  const [clientId, setClientId] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);

  // ── 登入 ──
  const handleLogin = useCallback(async () => {
    if (!clientId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/b2b/stats?clientId=${clientId}`);
      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
        setLoggedIn(true);
      } else {
        alert("客戶 ID 無效");
      }
    } catch {
      alert("登入失敗");
    } finally {
      setLoading(false);
    }
  }, [clientId]);

  // ── 刷新數據 ──
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

  // ── 匯出 CSV ──
  const exportCSV = () => {
    if (!stats) return;
    const csv = [
      "類型,次數",
      `九型人格,${stats.byType.enneagram}`,
      `7脈輪,${stats.byType.chakra}`,
      `易卦,${stats.byType.yijing}`,
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

  // ── 登入畫面 ──
  if (!loggedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white px-6">
        <BarChart3 size={48} className="text-[#c9a84c] mb-4" />
        <h1 className="text-xl font-bold text-[#1a1a1a] mb-2">B2B 數據面板</h1>
        <p className="text-sm text-[#999] mb-6 text-center">
          輸入你的客戶 ID 查看測評數據
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
          {loading ? "登入中..." : "查看數據"}
        </button>
      </div>
    );
  }

  // ── Dashboard ──
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/95 backdrop-blur-md px-4 py-3 border-b border-[#e8e8e8]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BarChart3 size={20} className="text-[#c9a84c]" />
            <h1 className="text-lg font-bold text-[#1a1a1a]">數據面板</h1>
          </div>
          <button
            onClick={() => { setLoggedIn(false); setStats(null); }}
            className="p-1 text-[#999]"
          >
            <LogOut size={18} />
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 pb-8">
        {/* 摘要卡片 */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="card text-center">
            <Users size={20} className="mx-auto text-[#c9a84c] mb-1" />
            <p className="text-3xl font-bold text-[#1a1a1a]">
              {stats?.totalAssessments || 0}
            </p>
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

        {/* 測評分佈 */}
        <div className="mt-4 card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-[#1a1a1a] flex items-center gap-2">
              <TrendingUp size={16} className="text-[#c9a84c]" />
              測評分佈
            </h3>
            <button
              onClick={exportCSV}
              className="flex items-center gap-1 text-xs text-[#c9a84c] font-medium"
            >
              <Download size={14} /> 匯出
            </button>
          </div>

          <div className="space-y-3">
            {[
              { label: "九型人格", count: stats?.byType.enneagram || 0, color: "bg-[#c9a84c]" },
              { label: "7脈輪", count: stats?.byType.chakra || 0, color: "bg-purple-500" },
              { label: "易卦", count: stats?.byType.yijing || 0, color: "bg-blue-500" },
            ].map((item) => {
              const max = Math.max(
                stats?.byType.enneagram || 1,
                stats?.byType.chakra || 1,
                stats?.byType.yijing || 1
              );
              const pct = (item.count / max) * 100;
              return (
                <div key={item.label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-[#333]">{item.label}</span>
                    <span className="text-sm font-bold text-[#1a1a1a]">{item.count} 次</span>
                  </div>
                  <div className="h-2 bg-[#f5f5f5] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${item.color}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 功能狀態 */}
        <div className="mt-4 card">
          <h3 className="font-bold text-[#1a1a1a] mb-3">可用功能</h3>
          <div className="grid grid-cols-2 gap-2">
            {[
              { name: "九型人格", key: "enneagram" },
              { name: "7脈輪", key: "chakra" },
              { name: "易卦", key: "yijing" },
              { name: "孟子塔羅", key: "tarot" },
            ].map((item) => (
              <div
                key={item.key}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#fdf8ed]"
              >
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-sm text-[#333]">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 帳戶資訊 */}
        <div className="mt-4 card">
          <h3 className="font-bold text-[#1a1a1a] mb-2">帳戶資訊</h3>
          <div className="text-sm text-[#666] space-y-1">
            <p>客戶 ID: <span className="text-[#333] font-mono text-xs">{clientId}</span></p>
            <p>方案: <span className="text-[#c9a84c] font-bold">試用中</span></p>
            <p>到期日: 試用期結束後顯示</p>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-[#999]">
          如需續費或升級，請加微信 859022196
        </p>
      </div>
    </div>
  );
}
