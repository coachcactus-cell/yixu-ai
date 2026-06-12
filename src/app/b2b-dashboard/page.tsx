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
      "类型,次数",
      `九型人格,${stats.byType.enneagram}`,
      `7脉轮,${stats.byType.chakra}`,
      `易经,${stats.byType.yijing}`,
      `总计,${stats.totalAssessments}`,
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `亦须AI_数据报表_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const fmtDate = (ts: number) => {
    if (!ts) return "暫无数据";
    return new Date(ts).toLocaleString("zh-HK");
  };

  if (!mounted) return null;

  // 登入页
  if (!loggedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white px-6">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#c9a84c] to-[#b89430] flex items-center justify-center mb-4">
          <Handshake size={32} className="text-white" />
        </div>
        <h1 className="text-xl font-bold text-[#1a1a1a] mb-1">亦须AI 合作夥伴</h1>
        <p className="text-sm text-[#999] mb-6 text-center">
          输入客戶 ID 登入
        </p>
        <input
          type="text"
          value={clientId}
          onChange={(e) => setClientId(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          placeholder="输入客戶 ID"
          className="w-full max-w-xs px-4 py-3 rounded-xl border border-[#e8e8e8] text-center outline-none focus:border-[#c9a84c]"
        />
        <button
          onClick={handleLogin}
          disabled={loading}
          className="mt-4 px-8 py-2.5 rounded-full bg-gradient-to-r from-[#c9a84c] to-[#b89430] text-white font-bold disabled:opacity-50"
        >
          {loading ? "登入中..." : "登入"}
        </button>
        <p className="text-xs text-[#c9a84c] mt-3 font-mono">测试码：yixu-demo</p>
      </div>
    );
  }

  // 登入后 — 招商主页
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <header className="sticky top-0 z-10 bg-white/95 backdrop-blur-md px-4 py-3 border-b border-[#e8e8e8]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Handshake size={20} className="text-[#c9a84c]" />
            <h1 className="text-lg font-bold text-[#1a1a1a]">亦须AI 合作夥伴</h1>
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
          数据面板
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-8">
        {activeTab === "partner" ? (
          /* ============ 招商主页 ============ */
          <>
            {/* Hero */}
            <div className="mt-4 rounded-2xl p-5 text-white" style={{ background: "linear-gradient(135deg, #c9a84c, #a88830)" }}>
              <p className="text-sm font-medium opacity-80 mb-1">亦须AI · 合作夥伴计划</p>
              <h2 className="text-xl font-bold mb-2">让疗愈智慧，成为你的生意增长点</h2>
              <p className="text-sm opacity-80 leading-relaxed">
                整合 Sino-NLP 中華身心语言学 × 传统经学 × 行为心理学，为你的客戶帶来深度测评体验
              </p>
            </div>

            {/* 为什麼合作 */}
            <div className="mt-5">
              <h3 className="font-bold text-[#1a1a1a] mb-3 flex items-center gap-2">
                <Sparkles size={16} className="text-[#c9a84c]" />
                为什麼选择亦须AI
              </h3>
              <div className="space-y-3">
                {[
                  { icon: Target, title: "专业测评工具", desc: "九型人格、7脉轮、易经占卜 — 每个测评都经 Sino-NLP 体系设计，不是网上免费货色" },
                  { icon: Users, title: "为你的客戶增值", desc: "用测评做客戶破冰和深度连结，從「消费者」变成「追随者」" },
                  { icon: DollarSign, title: "零成本启动", desc: "无需开发、无需伺服器、无需技术人員。接入即用，你只管服务客戶" },
                  { icon: Heart, title: "品牌差異化", desc: "市场上独此一家的中華经学 × 心理学测评体系，让你脫穎而出" },
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

            {/* 适合谁 */}
            <div className="mt-5">
              <h3 className="font-bold text-[#1a1a1a] mb-3">适合這些行业</h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  "身心灵工作室",
                  "芳疗 / 精油品牌",
                  "瑜伽 / 冥想导師",
                  "心理諮询机构",
                  "中医 / 养生馆",
                  "企业培訓公司",
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
                {/* 体验版 */}
                <div className="card border border-[#e8e8e8]">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-[#1a1a1a]">体验版</h4>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-[#fdf8ed] text-[#c9a84c] font-medium">免费试用</span>
                  </div>
                  <p className="text-xs text-[#666] mb-2">7天免费体验，了解平台功能</p>
                  <div className="text-xs text-[#999] space-y-0.5">
                    <p>✓ 九型人格测评</p>
                    <p>✓ 7脉轮评估</p>
                    <p>✓ 易经占卜</p>
                    <p>✓ 基礎数据面板</p>
                  </div>
                </div>
                {/* 专业版 */}
                <div className="card border-2 border-[#c9a84c] relative">
                  <div className="absolute -top-2.5 left-4 px-2 py-0.5 rounded-full bg-[#c9a84c] text-white text-[10px] font-bold">推薦</div>
                  <div className="flex items-center justify-between mb-2 mt-1">
                    <h4 className="font-bold text-[#1a1a1a]">专业版</h4>
                    <span className="text-sm font-bold text-[#c9a84c]">詳询</span>
                  </div>
                  <p className="text-xs text-[#666] mb-2">完整功能 + 深度数据 + 品牌定制</p>
                  <div className="text-xs text-[#999] space-y-0.5">
                    <p>✓ 体验版全部功能</p>
                    <p>✓ 孟子塔羅（即將推出）</p>
                    <p>✓ 进阶数据分析</p>
                    <p>✓ 品牌专屬页面定制</p>
                    <p>✓ 专屬客戶服务群</p>
                    <p>✓ 亦须先生每月线上指导</p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-5 card bg-[#fdf8ed]">
              <div className="flex items-center gap-2 mb-2">
                <MessageCircle size={18} className="text-[#c9a84c]" />
                <h4 className="font-bold text-[#1a1a1a]">立即洽谈</h4>
              </div>
              <p className="text-sm text-[#666] mb-3">
                加微信 <span className="font-mono font-bold text-[#1a1a1a]">859022196</span>，備註「亦须AI合作」
              </p>
              <p className="text-xs text-[#999]">
                由亦须先生本人直接洽谈，非客服机器人
              </p>
            </div>

            {/* 返回主App */}
            <Link
              href="/"
              className="mt-4 flex items-center justify-center gap-2 py-3 rounded-xl border border-[#e8e8e8] text-sm text-[#666] hover:bg-[#fafafa] active:scale-[0.98] transition-all"
            >
              返回亦须AI主页
              <ChevronRight size={16} />
            </Link>
          </>
        ) : (
          /* ============ 数据面板（附屬 tab） ============ */
          <>
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="card text-center">
                <Users size={20} className="mx-auto text-[#c9a84c] mb-1" />
                <p className="text-3xl font-bold text-[#1a1a1a]">{stats?.totalAssessments || 0}</p>
                <p className="text-xs text-[#999]">总测评次数</p>
              </div>
              <div className="card text-center">
                <Clock size={20} className="mx-auto text-blue-500 mb-1" />
                <p className="text-sm font-bold text-[#1a1a1a] mt-1">
                  {stats?.lastActivity ? fmtDate(stats.lastActivity) : "暫无"}
                </p>
                <p className="text-xs text-[#999]">最后活动</p>
              </div>
            </div>

            <div className="mt-4 card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-[#1a1a1a] flex items-center gap-2">
                  <BarChart3 size={16} className="text-[#c9a84c]" />
                  测评分佈
                </h3>
                <button onClick={exportCSV} className="flex items-center gap-1 text-xs text-[#c9a84c] font-medium">
                  <Download size={14} /> 匯出
                </button>
              </div>
              <div className="space-y-3">
                {[
                  { label: "九型人格", count: stats?.byType.enneagram || 0, color: "bg-[#c9a84c]" },
                  { label: "7脉轮", count: stats?.byType.chakra || 0, color: "bg-purple-500" },
                  { label: "易经", count: stats?.byType.yijing || 0, color: "bg-blue-500" },
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
              <h3 className="font-bold text-[#1a1a1a] mb-2">帳戶资讯</h3>
              <div className="text-sm text-[#666] space-y-1">
                <p>客戶 ID: <span className="text-[#333] font-mono text-xs">{clientId}</span></p>
                <p>方案: <span className="text-[#c9a84c] font-bold">试用中</span></p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
