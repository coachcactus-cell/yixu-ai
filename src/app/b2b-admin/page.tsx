"use client";

import { useState, useEffect, useCallback } from "react";
import { ArrowLeft, Users, Clock, BarChart3, Settings, Trash2, RefreshCw } from "lucide-react";
import type { B2BClient } from "@/lib/b2b-db";

const ADMIN_PASSWORD = "yixu2024"; // 簡單密碼保護

export default function B2BAdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [clients, setClients] = useState<B2BClient[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedClient, setSelectedClient] = useState<B2BClient | null>(null);
  const [stats, setStats] = useState<any>(null);

  // ── 登入 ──
  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
    } else {
      alert("密碼錯誤");
    }
  };

  // ── 載入客戶列表 ──
  const loadClients = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/b2b/clients");
      const data = await res.json();
      if (data.success) setClients(data.clients);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authenticated) loadClients();
  }, [authenticated, loadClients]);

  // ── 更新客戶 ──
  const handleUpdate = async (clientId: string, updates: any) => {
    try {
      const res = await fetch("/api/b2b/update-client", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientId, updates }),
      });
      const data = await res.json();
      if (data.success) {
        loadClients();
        alert("更新成功");
      }
    } catch (e) {
      alert("更新失敗");
    }
  };

  // ── 查看統計 ──
  const handleViewStats = async (clientId: string) => {
    try {
      const res = await fetch(`/api/b2b/stats?clientId=${clientId}`);
      const data = await res.json();
      if (data.success) setStats(data.stats);
    } catch (e) {
      console.error(e);
    }
  };

  // ── 格式化時間 ──
  const fmtDate = (ts: number) => {
    if (!ts) return "—";
    return new Date(ts).toLocaleDateString("zh-HK");
  };

  const fmtStatus = (client: B2BClient): { label: string; color: string } => {
    if (client.status === "suspended") return { label: "已停用", color: "text-red-500" };
    if (client.plan === "trial" && Date.now() > client.trialEnd) return { label: "試用過期", color: "text-orange-500" };
    if (client.plan === "trial") return { label: "試用中", color: "text-blue-500" };
    if (client.subscriptionEnd > 0 && Date.now() > client.subscriptionEnd) return { label: "訂閱過期", color: "text-orange-500" };
    return { label: "付費中", color: "text-green-500" };
  };

  // ── 登入畫面 ──
  if (!authenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white px-6">
        <Settings size={48} className="text-[#c9a84c] mb-4" />
        <h1 className="text-xl font-bold text-[#1a1a1a] mb-2">B2B 後台管理</h1>
        <p className="text-sm text-[#999] mb-6">請輸入管理密碼</p>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          placeholder="輸入密碼"
          className="w-full max-w-xs px-4 py-3 rounded-xl border border-[#e8e8e8] text-center text-lg tracking-widest outline-none focus:border-[#c9a84c]"
        />
        <button
          onClick={handleLogin}
          className="mt-4 px-8 py-2.5 rounded-full bg-[#c9a84c] text-white font-bold"
        >
          登入
        </button>
      </div>
    );
  }

  // ── 後台主畫面 ──
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/95 backdrop-blur-md px-4 py-3 border-b border-[#e8e8e8]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Settings size={20} className="text-[#c9a84c]" />
            <h1 className="text-lg font-bold text-[#1a1a1a]">B2B 後台</h1>
          </div>
          <button onClick={loadClients} className="p-1">
            <RefreshCw size={18} className={`text-[#999] ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 pb-8">
        {/* 摘要卡片 */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="card text-center">
            <Users size={20} className="mx-auto text-[#c9a84c] mb-1" />
            <p className="text-2xl font-bold text-[#1a1a1a]">{clients.length}</p>
            <p className="text-xs text-[#999]">總客戶</p>
          </div>
          <div className="card text-center">
            <Clock size={20} className="mx-auto text-blue-500 mb-1" />
            <p className="text-2xl font-bold text-[#1a1a1a]">
              {clients.filter((c) => c.plan === "trial" && Date.now() <= c.trialEnd).length}
            </p>
            <p className="text-xs text-[#999]">試用中</p>
          </div>
          <div className="card text-center">
            <BarChart3 size={20} className="mx-auto text-green-500 mb-1" />
            <p className="text-2xl font-bold text-[#1a1a1a]">
              {clients.filter((c) => c.plan !== "trial").length}
            </p>
            <p className="text-xs text-[#999]">付費</p>
          </div>
        </div>

        {/* 客戶列表 */}
        <h3 className="mt-6 font-bold text-[#1a1a1a] mb-3">客戶列表</h3>
        {clients.length === 0 && (
          <p className="text-sm text-[#999] text-center py-8">暫無客戶</p>
        )}
        <div className="space-y-3">
          {clients.map((client) => {
            const status = fmtStatus(client);
            return (
              <div key={client.id} className="card">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-bold text-[#1a1a1a]">{client.companyName}</h4>
                    <p className="text-xs text-[#999]">微信: {client.wechatId}</p>
                  </div>
                  <span className={`text-xs font-bold ${status.color}`}>{status.label}</span>
                </div>

                <div className="text-xs text-[#999] space-y-1 mb-3">
                  <p>試用期: {fmtDate(client.trialStart)} ~ {fmtDate(client.trialEnd)}</p>
                  {client.subscriptionEnd > 0 && (
                    <p>訂閱到期: {fmtDate(client.subscriptionEnd)}</p>
                  )}
                  <p>功能: {Object.entries(client.features).filter(([, v]) => v).map(([k]) => k).join(" / ")}</p>
                </div>

                <div className="flex gap-2 flex-wrap">
                  {/* 開通功能 */}
                  <select
                    className="text-xs px-2 py-1 rounded border border-[#e8e8e8]"
                    onChange={(e) => {
                      const feature = e.target.value;
                      if (!feature) return;
                      const newFeatures = { ...client.features, [feature]: true };
                      handleUpdate(client.id, { features: newFeatures });
                    }}
                    defaultValue=""
                  >
                    <option value="">+ 開通功能</option>
                    <option value="enneagram">九型人格</option>
                    <option value="chakra">7脈輪</option>
                    <option value="yijing">易卦</option>
                    <option value="tarot">孟子塔羅</option>
                  </select>

                  {/* 續費/升級 */}
                  <button
                    onClick={() => {
                      const newEnd = Date.now() + 365 * 24 * 60 * 60 * 1000;
                      handleUpdate(client.id, {
                        plan: "pro" as const,
                        subscriptionEnd: newEnd,
                        status: "active" as const,
                      });
                    }}
                    className="text-xs px-2 py-1 rounded bg-green-500 text-white font-bold"
                  >
                    續費一年
                  </button>

                  {/* 停用 */}
                  {client.status !== "suspended" && (
                    <button
                      onClick={() => handleUpdate(client.id, { status: "suspended" })}
                      className="text-xs px-2 py-1 rounded border border-red-300 text-red-500"
                    >
                      停用
                    </button>
                  )}

                  {/* 啟用 */}
                  {client.status === "suspended" && (
                    <button
                      onClick={() => handleUpdate(client.id, { status: "active" })}
                      className="text-xs px-2 py-1 rounded bg-green-500 text-white"
                    >
                      啟用
                    </button>
                  )}

                  {/* 查看統計 */}
                  <button
                    onClick={() => {
                      setSelectedClient(client);
                      handleViewStats(client.id);
                    }}
                    className="text-xs px-2 py-1 rounded border border-[#c9a84c] text-[#c9a84c]"
                  >
                    統計
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* 統計彈窗 */}
        {stats && selectedClient && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => { setStats(null); setSelectedClient(null); }}>
            <div className="bg-white rounded-2xl p-6 m-4 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
              <h3 className="font-bold text-[#1a1a1a] mb-1">{selectedClient.companyName}</h3>
              <p className="text-xs text-[#999] mb-4">測評統計</p>
              <div className="space-y-2 text-sm">
                <p>總測評次數: <span className="font-bold">{stats.totalAssessments}</span></p>
                <p>九型人格: {stats.byType.enneagram} 次</p>
                <p>7脈輪: {stats.byType.chakra} 次</p>
                <p>易卦: {stats.byType.yijing} 次</p>
                <p>最後活動: {stats.lastActivity ? fmtDate(stats.lastActivity) : "—"}</p>
              </div>
              <button
                onClick={() => { setStats(null); setSelectedClient(null); }}
                className="mt-4 w-full py-2 rounded-xl bg-[#c9a84c] text-white font-bold"
              >
                關閉
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
