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
      }
    } catch { /* ignore */ }
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
      "\u985E\u578B,\u6B21\u6578",
      `\u4E5D\u578B\u4EBA\u683C,${stats.byType.enneagram}`,
      `7\u8108\u8F2A,${stats.byType.chakra}`,
      `\u6613\u5366,${stats.byType.yijing}`,
      `\u7E3D\u8A08,${stats.totalAssessments}`,
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `\u4EA6\u9808AI_\u6578\u64DA\u5831\u8868_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const fmtDate = (ts: number) => {
    if (!ts) return "\u66AB\u7121\u6578\u64DA";
    return new Date(ts).toLocaleString("zh-HK");
  };

  if (!mounted) return null;

  if (!loggedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white px-6">
        <BarChart3 size={48} className="text-[#c9a84c] mb-4" />
        <h1 className="text-xl font-bold text-[#1a1a1a] mb-2">B2B \u6578\u64DA\u9762\u677F</h1>
        <p className="text-sm text-[#999] mb-6 text-center">
          \u8F38\u5165\u4F60\u7684\u5BA2\u6236 ID \u67E5\u770B\u6E2C\u8A55\u6578\u64DA
        </p>
        <input
          type="text"
          value={clientId}
          onChange={(e) => setClientId(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          placeholder="\u8F38\u5165\u5BA2\u6236 ID"
          className="w-full max-w-xs px-4 py-3 rounded-xl border border-[#e8e8e8] text-center outline-none focus:border-[#c9a84c]"
        />
        <button
          onClick={handleLogin}
          disabled={loading}
          className="mt-4 px-8 py-2.5 rounded-full bg-gradient-to-r from-[#c9a84c] to-[#b89430] text-white font-bold disabled:opacity-50"
        >
          {loading ? "\u767B\u5165\u4E2D..." : "\u67E5\u770B\u6578\u64DA"}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <header className="sticky top-0 z-10 bg-white/95 backdrop-blur-md px-4 py-3 border-b border-[#e8e8e8]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BarChart3 size={20} className="text-[#c9a84c]" />
            <h1 className="text-lg font-bold text-[#1a1a1a]">\u6578\u64DA\u9762\u677F</h1>
          </div>
          <button onClick={() => { setLoggedIn(false); setStats(null); }} className="p-1 text-[#999]">
            <LogOut size={18} />
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 pb-8">
        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="card text-center">
            <Users size={20} className="mx-auto text-[#c9a84c] mb-1" />
            <p className="text-3xl font-bold text-[#1a1a1a]">{stats?.totalAssessments || 0}</p>
            <p className="text-xs text-[#999]">\u7E3D\u6E2C\u8A55\u6B21\u6578</p>
          </div>
          <div className="card text-center">
            <Clock size={20} className="mx-auto text-blue-500 mb-1" />
            <p className="text-sm font-bold text-[#1a1a1a] mt-1">
              {stats?.lastActivity ? fmtDate(stats.lastActivity) : "\u66AB\u7121"}
            </p>
            <p className="text-xs text-[#999]">\u6700\u5F8C\u6D3B\u52D5</p>
          </div>
        </div>

        <div className="mt-4 card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-[#1a1a1a] flex items-center gap-2">
              <TrendingUp size={16} className="text-[#c9a84c]" />
              \u6E2C\u8A55\u5206\u4F48
            </h3>
            <button onClick={exportCSV} className="flex items-center gap-1 text-xs text-[#c9a84c] font-medium">
              <Download size={14} /> \u532F\u51FA
            </button>
          </div>
          <div className="space-y-3">
            {[
              { label: "\u4E5D\u578B\u4EBA\u683C", count: stats?.byType.enneagram || 0, color: "bg-[#c9a84c]" },
              { label: "7\u8108\u8F2A", count: stats?.byType.chakra || 0, color: "bg-purple-500" },
              { label: "\u6613\u5366", count: stats?.byType.yijing || 0, color: "bg-blue-500" },
            ].map((item) => {
              const max = Math.max(stats?.byType.enneagram || 1, stats?.byType.chakra || 1, stats?.byType.yijing || 1);
              const pct = (item.count / max) * 100;
              return (
                <div key={item.label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-[#333]">{item.label}</span>
                    <span className="text-sm font-bold text-[#1a1a1a]">{item.count} \u6B21</span>
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
          <h3 className="font-bold text-[#1a1a1a] mb-3">\u53EF\u7528\u529F\u80FD</h3>
          <div className="grid grid-cols-2 gap-2">
            {["\u4E5D\u578B\u4EBA\u683C", "7\u8108\u8F2A", "\u6613\u5366", "\u5B5F\u5B50\u5854\u7F85"].map((name) => (
              <div key={name} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#fdf8ed]">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-sm text-[#333]">{name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 card">
          <h3 className="font-bold text-[#1a1a1a] mb-2">\u5E33\u6236\u8CC7\u8A0A</h3>
          <div className="text-sm text-[#666] space-y-1">
            <p>\u5BA2\u6236 ID: <span className="text-[#333] font-mono text-xs">{clientId}</span></p>
            <p>\u65B9\u6848: <span className="text-[#c9a84c] font-bold">\u8A66\u7528\u4E2D</span></p>
            <p>\u5230\u671F\u65E5: \u8A66\u7528\u671F\u7D50\u675F\u5F8C\u986F\u793A</p>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-[#999]">
          \u5982\u9700\u7E8C\u8CBB\u6216\u5347\u7D1A\uFF0C\u8ACB\u52A0\u5FAE\u4FE1 859022196
        </p>
      </div>
    </div>
  );
}
