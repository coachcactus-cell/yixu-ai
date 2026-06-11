"use client";

import { useState, useEffect, useCallback } from "react";
import { BarChart3, Users, TrendingUp, Clock, Download, LogOut, ArrowRight } from "lucide-react";
import Link from "next/link";

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
  const [mounted, setMounted] = useState(false);

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
        <p className="text-xs text-[#c9a84c] mt-3 font-mono">測試碼：yixu-demo</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <header className="sticky top-0 z-10 bg-white/95 backdrop-blur-md px-4 py-3 border-b border-[#e8e8e8]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BarChart3 size={20} className="text-[#c9a84c]" />
            <h1 className="text-lg font-bold text-[#1a1a1a]">B2B 數據面板</h1>
          </div>
          <button onClick={() => { setLoggedIn(false); setStats(null); }} className="p-1 text-[#999]">
            <LogOut size={18} />
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 pb-8">
        {/* Stats cards */}
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

        {/* 測評分佈 */}
        <div className="mt-4 card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-[#1a1a1a] flex items-center gap-2">
              <TrendingUp size={16} className="text-[#c9a84c]" />
              測評分佈
            </h3>
            <button onClick={exportCSV} className="flex items-center gap-1 text-xs text-[#c9a84c] font-medium">
              <Download size={14} /> 匯出
            </button>
          </div>
          <div className="space-y-3">
            {[
              { label: "九型人格", count: stats?.byType.enneagram || 0, color: "bg-[#c9a84c]", path: "/enneagram" },
              { label: "7脈輪", count: stats?.byType.chakra || 0, color: "bg-purple-500", path: "/chakra" },
              { label: "易經", count: stats?.byType.yijing || 0, color: "bg-blue-500", path: "/yijing" },
            ].map((item) => {
              const max = Math.max(stats?.byType.enneagram || 1, stats?.byType.chakra || 1, stats?.byType.yijing || 1);
              const pct = (item.count / max) * 100;
              return (
                <div key={item.label}>
                  <div className="flex items-center justify-between mb-1">
                    <Link href={item.path} className="text-sm text-[#333] hover:text-[#c9a84c] flex items-center gap-1 transition-colors">
                      {item.label} <ArrowRight size={12} />
                    </Link>
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

        {/* 可用功能 — NOW CLICKABLE with real links */}
        <div className="mt-4 card">
          <h3 className="font-bold text-[#1a1a1a] mb-3">可用功能</h3>
          <div className="grid grid-cols-2 gap-2">
            {[
              { name: "九型人格", path: "/enneagram", available: true },
              { name: "7脈輪", path: "/chakra", available: true },
              { name: "易經", path: "/yijing", available: true },
              { name: "孟子塔羅", path: "/tarot", available: false },
            ].map((item) => (
              item.available ? (
                <Link
                  key={item.name}
                  href={item.path}
                  className="flex items-center gap-2 px-3 py-3 rounded-lg bg-[#fdf8ed] hover:bg-[#f5e6c0] active:scale-[0.98] transition-all"
                >
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-sm text-[#333]">{item.name}</span>
                  <ArrowRight size={12} className="ml-auto text-[#c9a84c]" />
                </Link>
              ) : (
                <div
                  key={item.name}
                  className="flex items-center gap-2 px-3 py-3 rounded-lg bg-[#f5f5f5] opacity-60"
                >
                  <div className="w-2 h-2 rounded-full bg-gray-400" />
                  <span className="text-sm text-[#999]">{item.name}</span>
                  <span className="ml-auto text-[10px] text-[#999]">即將推出</span>
                </div>
              )
            ))}
          </div>
        </div>

        {/* 快速入口 — big buttons */}
        <div className="mt-4 card">
          <h3 className="font-bold text-[#1a1a1a] mb-3">快速測驗入口</h3>
          <div className="space-y-2">
            <Link
              href="/enneagram"
              className="flex items-center justify-between px-4 py-3 rounded-xl bg-gradient-to-r from-[#fdf8ed] to-[#faf3dd] hover:from-[#f5e6c0] hover:to-[#f0d890] active:scale-[0.98] transition-all"
            >
              <div>
                <p className="font-bold text-[#1a1a1a]">九型人格測驗</p>
                <p className="text-xs text-[#999]">36 題 · 約 15 分鐘</p>
              </div>
              <ArrowRight size={18} className="text-[#c9a84c]" />
            </Link>
            <Link
              href="/chakra"
              className="flex items-center justify-between px-4 py-3 rounded-xl bg-gradient-to-r from-[#f5f0ff] to-[#ede0ff] hover:from-[#e8d8ff] hover:to-[#dcc8ff] active:scale-[0.98] transition-all"
            >
              <div>
                <p className="font-bold text-[#1a1a1a]">7脈輪測驗</p>
                <p className="text-xs text-[#999]">49 題 · 約 20 分鐘</p>
              </div>
              <ArrowRight size={18} className="text-purple-500" />
            </Link>
            <Link
              href="/yijing"
              className="flex items-center justify-between px-4 py-3 rounded-xl bg-gradient-to-r from-[#f0f5ff] to-[#e0ecff] hover:from-[#d8e8ff] hover:to-[#c8dcff] active:scale-[0.98] transition-all"
            >
              <div>
                <p className="font-bold text-[#1a1a1a]">易經占卜</p>
                <p className="text-xs text-[#999]">6 爻起卦 · 即時解卦</p>
              </div>
              <ArrowRight size={18} className="text-blue-500" />
            </Link>
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
