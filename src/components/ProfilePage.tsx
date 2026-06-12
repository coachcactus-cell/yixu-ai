"use client";

import { useState } from "react";
import {
  Crown,
  MessageCircle,
  ClipboardList,
  BookOpen,
  Heart,
  ChevronRight,
  Star,
  Sparkles,
  Building2,
  Shield,
  Handshake,
  LogOut,
  Phone,
  TrendingUp,
  History,
  Download,
} from "lucide-react";
import { useUser } from "@/hooks/useUser";

const VIP_PLANS = [
  {
    name: "月会员",
    price: "¥29",
    period: "/月",
    features: ["无限 AI 对话", "独家修行内容", "所有测评免费", "优先线下活动报名"],
    popular: false,
  },
  {
    name: "年会员",
    price: "¥299",
    period: "/年",
    features: ["月会员全部权益", "个人化修行路径", "1对1 线上咨询 1 次", "线下活动 8 折"],
    popular: true,
    save: "省 ¥49",
  },
];

// ── 邀请码分流规则 ──
const INVITE_ROUTES: { pattern: string; label: string; path: string; icon: any; color: string }[] = [
  { pattern: "cactus-2026", label: "C老大后台", path: "/admin", icon: Shield, color: "#c9a84c" },
  { pattern: "yixu-founder", label: "C老大后台", path: "/admin", icon: Shield, color: "#c9a84c" },
  { pattern: "yixu-demo", label: "B2B 数据面板", path: "/b2b-dashboard?clientId=yixu-demo", icon: Building2, color: "#6366f1" },
];

function resolveInviteCode(code: string): { path: string; label: string; icon: any; color: string } | null {
  const trimmed = code.trim().toLowerCase();

  for (const route of INVITE_ROUTES) {
    if (trimmed === route.pattern.toLowerCase()) {
      return { path: route.path, label: route.label, icon: route.icon, color: route.color };
    }
  }

  if (trimmed.startsWith("dsp-") || trimmed.startsWith("dsp_")) {
    return { path: `/distributor?code=${encodeURIComponent(code.trim())}`, label: "分销商后台", icon: Handshake, color: "#10b981" };
  }

  if (trimmed.startsWith("b2b_") || trimmed.length > 5) {
    return { path: `/b2b-dashboard?clientId=${encodeURIComponent(code.trim())}`, label: "B2B 数据面板", icon: Building2, color: "#6366f1" };
  }

  return null;
}

// ─── 手机号登录组件 ───
function PhoneLogin({
  onLogin,
}: {
  onLogin: (phone: string, wechatId: string) => void;
}) {
  const [phone, setPhone] = useState("");
  const [wechatId, setWechatId] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    const trimmed = phone.trim();
    if (!trimmed) {
      setError("请输入手机号");
      return;
    }
    if (!/^1[3-9]\d{9}$/.test(trimmed)) {
      setError("请输入有效的11位手机号");
      return;
    }
    setError("");
    onLogin(trimmed, wechatId.trim());
  };

  return (
    <div className="card mt-4">
      <div className="text-center mb-4">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#fdf8ed] to-[#fef3d0] flex items-center justify-center mx-auto mb-3">
          <Phone size={28} className="text-[#c9a84c]" />
        </div>
        <h3 className="font-bold text-[#1a1a1a]">登录查看你的修行记录</h3>
        <p className="text-xs text-[#999999] mt-1">
          输入手机号，历史报告随时查看
        </p>
      </div>

      <div className="space-y-3">
        <input
          type="tel"
          value={phone}
          onChange={(e) => {
            setPhone(e.target.value.replace(/\D/g, "").slice(0, 11));
            setError("");
          }}
          placeholder="输入手机号"
          className="w-full px-4 py-3 rounded-xl border border-[#e8e8e8] text-center text-lg tracking-widest outline-none focus:border-[#c9a84c] transition-colors"
        />
        <input
          type="text"
          value={wechatId}
          onChange={(e) => setWechatId(e.target.value)}
          placeholder="微信号（选填）"
          className="w-full px-4 py-3 rounded-xl border border-[#e8e8e8] text-center text-base outline-none focus:border-[#c9a84c] transition-colors"
        />
        {error && <p className="text-xs text-red-500 text-center">{error}</p>}
        <button
          onClick={handleSubmit}
          className="w-full rounded-xl py-3 text-sm font-semibold text-white transition-all active:scale-[0.98]"
          style={{ background: "linear-gradient(135deg, #c9a84c, #b8943a)" }}
        >
          登录
        </button>
      </div>
    </div>
  );
}

// ─── 主组件 ───
export default function ProfilePage() {
  const { user, history, isLoggedIn, loginWithPhone, setWechatId, logout } = useUser();
  const [showVIP, setShowVIP] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [inviteCode, setInviteCode] = useState("");
  const [inviteError, setInviteError] = useState("");
  const [resolvedRoute, setResolvedRoute] = useState<{
    path: string;
    label: string;
    icon: any;
    color: string;
  } | null>(null);

  // ── 手机号登录 ──
  const handlePhoneLogin = (phone: string, wechat: string) => {
    loginWithPhone(phone);
    if (wechat) setWechatId(wechat);
    setShowLogin(false);
  };

  // ── 邀请码验证 + 分流 ──
  const handleInviteSubmit = () => {
    if (!inviteCode.trim()) {
      setInviteError("请输入邀请码");
      return;
    }
    const route = resolveInviteCode(inviteCode);
    if (route) {
      setResolvedRoute(route);
      setInviteError("");
    } else {
      setInviteError("邀请码无效，请检查后重试");
    }
  };

  const handleConfirmRoute = () => {
    if (resolvedRoute) {
      window.location.href = resolvedRoute.path;
    }
  };

  // 统计数据
  const chakraCount = history.chakraRecords.length;
  const yijingCount = history.yijingRecords.length;

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/95 backdrop-blur-md px-4 py-4 border-b border-[#e8e8e8]">
        <h1 className="text-xl font-bold text-[#1a1a1a] font-song">我的</h1>
      </header>

      <div className="flex-1 px-4 pb-20">
        {/* ── 未登录：显示登录入口 ── */}
        {!isLoggedIn && !showLogin && (
          <>
            {/* 用户卡（匿名） */}
            <div className="card mt-4">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[#c9a84c] flex items-center justify-center bg-[#fdf8ed]">
                  <img
                    src="/app-avatar.png"
                    alt="亦须先生"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h2 className="font-bold text-lg text-[#1a1a1a] font-song">修行者</h2>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="gold-tag">未登录</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 登录入口 */}
            <button
              onClick={() => setShowLogin(true)}
              className="w-full mt-3 card flex items-center justify-between py-4"
            >
              <div className="flex items-center gap-3">
                <Phone size={20} className="text-[#c9a84c]" />
                <div className="text-left">
                  <p className="text-sm font-medium text-[#1a1a1a]">手机号登录</p>
                  <p className="text-xs text-[#999999]">登录后查看历史记录与报告</p>
                </div>
              </div>
              <ChevronRight size={16} className="text-[#999999]" />
            </button>

            {/* Stats（匿名） */}
            <div className="card mt-3">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-[#c9a84c] font-song">{chakraCount}</p>
                  <p className="text-sm text-[#666666] mt-1">测评记录</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#c9a84c] font-song">0</p>
                  <p className="text-sm text-[#666666] mt-1">收藏对话</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#c9a84c] font-song">0</p>
                  <p className="text-sm text-[#666666] mt-1">完成练习</p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ── 登录表单 ── */}
        {showLogin && (
          <PhoneLogin onLogin={handlePhoneLogin} />
        )}

        {/* ── 已登录状态 ── */}
        {isLoggedIn && (
          <>
            {/* 用户卡（已登录） */}
            <div className="card mt-4">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[#c9a84c] flex items-center justify-center bg-[#fdf8ed]">
                  <img
                    src="/app-avatar.png"
                    alt="亦须先生"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h2 className="font-bold text-lg text-[#1a1a1a] font-song">
                    {user?.nickname || "修行者"}
                  </h2>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="gold-tag">
                      {user?.vipLevel === "free" ? "免费会员" : user?.vipLevel === "monthly" ? "月会员" : "年会员"}
                    </span>
                  </div>
                  {user?.phone && (
                    <p className="text-xs text-[#999999] mt-1">
                      📱 {user.phone.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2")}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => setShowVIP(!showVIP)}
                    className="btn-primary text-xs py-1.5 px-3"
                  >
                    <Crown size={12} />
                    升级 VIP
                  </button>
                  <button
                    onClick={logout}
                    className="text-xs text-[#999999] flex items-center gap-1 py-1.5 px-3"
                  >
                    <LogOut size={12} />
                    退出
                  </button>
                </div>
              </div>
            </div>

            {/* VIP Plans (expandable) */}
            {showVIP && (
              <div className="mt-3 space-y-3 animate-fade-in-up">
                <h3 className="section-header">选择你的修行计划</h3>
                {VIP_PLANS.map((plan, i) => (
                  <div
                    key={i}
                    className={`card relative ${
                      plan.popular
                        ? "border-2 border-[#c9a84c] bg-[#fdf8ed]"
                        : ""
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-2 right-4 bg-[#c9a84c] text-white text-xs px-3 py-0.5 rounded-full font-bold">
                        最多人选择
                      </div>
                    )}
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-bold text-[#1a1a1a]">{plan.name}</h4>
                      <div className="text-right">
                        <span className="text-2xl font-bold text-[#c9a84c] font-song">
                          {plan.price}
                        </span>
                        <span className="text-sm text-[#888888]">{plan.period}</span>
                      </div>
                    </div>
                    <ul className="space-y-2 mb-3">
                      {plan.features.map((f, j) => (
                        <li key={j} className="flex items-center gap-2 text-sm text-[#1a1a1a]">
                          <Star size={14} className="text-[#c9a84c] flex-shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    {plan.save && (
                      <p className="text-sm text-[#666666] mb-2">{plan.save}</p>
                    )}
                    <button className="w-full btn-primary">立即订阅</button>
                  </div>
                ))}
              </div>
            )}

            {/* Stats（已登录） */}
            <div className="card mt-3">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-[#c9a84c] font-song">{chakraCount}</p>
                  <p className="text-sm text-[#666666] mt-1">测评记录</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#c9a84c] font-song">{yijingCount}</p>
                  <p className="text-sm text-[#666666] mt-1">占卜记录</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#c9a84c] font-song">0</p>
                  <p className="text-sm text-[#666666] mt-1">收藏对话</p>
                </div>
              </div>
            </div>

            {/* ── 历史记录 ── */}
            <div className="mt-4">
              <h3 className="section-header">我的记录</h3>

              {/* 脉轮测评历史 */}
              <div className="space-y-1 mt-2">
                <button className="w-full card flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <ClipboardList size={18} className="text-[#c9a84c]" />
                    <div className="text-left">
                      <span className="text-sm text-[#1a1a1a]">脉轮测评报告</span>
                      {chakraCount > 0 && (
                        <p className="text-xs text-[#999999]">最近 {chakraCount} 次</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-[#c9a84c] font-medium">{chakraCount}</span>
                    <ChevronRight size={16} className="text-[#999999]" />
                  </div>
                </button>

                {/* 最近脉轮记录摘要 */}
                {history.chakraRecords.slice(0, 3).map((record) => (
                  <div key={record.id} className="card py-3 px-4 ml-2 border-l-2 border-[#c9a84c]">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs text-[#999999]">{record.date}</span>
                      <div className="flex gap-1">
                        {record.results.slice(0, 5).map((r, i) => (
                          <div
                            key={i}
                            className="size-1.5 rounded-full"
                            style={{ backgroundColor: r.color }}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {record.results.map((r, i) => (
                        <span
                          key={i}
                          className="text-xs px-1.5 py-0.5 rounded-full bg-[#f5f5f5] text-[#666666]"
                        >
                          {r.nameZh} {r.percentage}%
                        </span>
                      ))}
                    </div>
                  </div>
                ))}

                {chakraCount === 0 && (
                  <p className="text-xs text-[#999999] text-center py-4">
                    暂无记录，完成测评后自动保存
                  </p>
                )}
              </div>

              {/* 占卜历史 */}
              <div className="mt-3 space-y-1">
                <button className="w-full card flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <TrendingUp size={18} className="text-[#c9a84c]" />
                    <div className="text-left">
                      <span className="text-sm text-[#1a1a1a]">易卦占卜记录</span>
                      {yijingCount > 0 && (
                        <p className="text-xs text-[#999999]">最近 {yijingCount} 次</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-[#c9a84c] font-medium">{yijingCount}</span>
                    <ChevronRight size={16} className="text-[#999999]" />
                  </div>
                </button>
              </div>

              {/* 下载的报告 */}
              <div className="mt-3 space-y-1">
                <button className="w-full card flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <Download size={18} className="text-[#c9a84c]" />
                    <span className="text-sm text-[#1a1a1a]">已下载的报告</span>
                  </div>
                  <ChevronRight size={16} className="text-[#999999]" />
                </button>
              </div>
            </div>

            {/* Menu Items */}
            <div className="mt-4 space-y-1">
              {[
                { icon: MessageCircle, label: "我的对话记录", badge: null },
                { icon: BookOpen, label: "修行练习记录", badge: null },
                { icon: Heart, label: "收藏内容", badge: null },
              ].map((item, i) => (
                <button
                  key={i}
                  className="w-full card flex items-center justify-between py-3"
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={18} className="text-[#c9a84c]" />
                    <span className="text-sm text-[#1a1a1a]">{item.label}</span>
                  </div>
                  <ChevronRight size={16} className="text-[#999999]" />
                </button>
              ))}
            </div>
          </>
        )}

        {/* ── 统一邀请入口（始终可见）── */}
        <div className="mt-4 space-y-1">
          <button
            onClick={() => {
              setShowInvite(true);
              setInviteCode("");
              setInviteError("");
              setResolvedRoute(null);
            }}
            className="w-full card flex items-center justify-between py-3"
          >
            <div className="flex items-center gap-3">
              <Sparkles size={18} className="text-[#c9a84c]" />
              <span className="text-sm text-[#1a1a1a]">邀请登入</span>
            </div>
            <ChevronRight size={16} className="text-[#999999]" />
          </button>
        </div>

        {/* ── 统一邀请码弹窗 ── */}
        {showInvite && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
            onClick={() => {
              setShowInvite(false);
              setInviteError("");
              setInviteCode("");
              setResolvedRoute(null);
            }}
          >
            <div
              className="bg-white rounded-2xl p-6 m-4 max-w-sm w-full animate-fade-in-up"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-4">
                <div className="w-12 h-12 rounded-full bg-[#fdf8ed] flex items-center justify-center mx-auto mb-2">
                  <Sparkles size={24} className="text-[#c9a84c]" />
                </div>
                <h3 className="text-lg font-bold text-[#1a1a1a]">邀请登入</h3>
                <p className="text-xs text-[#999] mt-1">输入邀请码进入对应后台</p>
              </div>

              {!resolvedRoute ? (
                <>
                  <input
                    type="text"
                    value={inviteCode}
                    onChange={(e) => {
                      setInviteCode(e.target.value);
                      setInviteError("");
                    }}
                    onKeyDown={(e) => e.key === "Enter" && handleInviteSubmit()}
                    placeholder="输入邀请码"
                    className="w-full px-4 py-3 rounded-xl border border-[#e8e8e8] text-center text-lg tracking-widest outline-none focus:border-[#c9a84c] transition-colors"
                    autoFocus
                  />
                  {inviteError && (
                    <p className="text-xs text-red-500 mt-2 text-center">{inviteError}</p>
                  )}
                  <button
                    onClick={handleInviteSubmit}
                    className="mt-4 w-full py-3 rounded-xl bg-gradient-to-r from-[#c9a84c] to-[#b89430] text-white font-bold active:scale-[0.98] transition-transform"
                  >
                    验证
                  </button>

                  <div className="mt-4 space-y-1.5 text-center">
                    <p className="text-[10px] text-[#999]">
                      <Shield size={10} className="inline -mt-0.5" /> 超级码 → C老大后台
                    </p>
                    <p className="text-[10px] text-[#999]">
                      <Handshake size={10} className="inline -mt-0.5" /> DSP-xxx → 分销商后台
                    </p>
                    <p className="text-[10px] text-[#999]">
                      <Building2 size={10} className="inline -mt-0.5" /> 其他码 → B2B 数据面板
                    </p>
                  </div>

                  <p className="text-xs text-[#ccc] mt-3 text-center">
                    未有邀请码？请加微信 859022196 申请
                  </p>
                </>
              ) : (
                <>
                  <div className="bg-[#fdf8ed] rounded-xl p-4 text-center">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2"
                      style={{ backgroundColor: resolvedRoute.color + "20" }}
                    >
                      <resolvedRoute.icon size={20} style={{ color: resolvedRoute.color }} />
                    </div>
                    <p className="text-sm font-bold text-[#1a1a1a]">
                      即将进入：{resolvedRoute.label}
                    </p>
                    <p className="text-xs text-[#999] mt-1">
                      邀请码：{inviteCode}
                    </p>
                  </div>
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() => {
                        setResolvedRoute(null);
                        setInviteCode("");
                      }}
                      className="flex-1 py-2.5 rounded-xl border border-[#e8e8e8] text-sm text-[#666] font-bold active:scale-[0.98] transition-transform"
                    >
                      返回
                    </button>
                    <button
                      onClick={handleConfirmRoute}
                      className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#c9a84c] to-[#b89430] text-white text-sm font-bold active:scale-[0.98] transition-transform"
                    >
                      确认进入
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center pb-4">
          <p className="text-xs text-[#999999] font-song">
            YIXU HEALING · 亦须疗愈
          </p>
          <p className="text-xs text-[#999999] mt-1">
            Sino-NLP 中华身心语言学 © 2026
          </p>
        </div>

        {/* 报名联系卡片 */}
        <div className="mt-3 card bg-gradient-to-br from-[#fdf8ed] to-[#fefaf0] border border-[#c9a84c]/20">
          <div className="text-center py-2">
            <p className="text-sm font-bold text-[#c9a84c] font-song mb-1">🙏 报名咨询</p>
            <p className="text-xs text-[#666666] mb-2">报名直接找先生</p>
            <div className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-2 border border-[#c9a84c]/30">
              <span className="text-base">💬</span>
              <span className="text-lg font-bold text-[#1a1a1a] font-mono tracking-wider">859022196</span>
            </div>
            <p className="text-xs text-[#999999] mt-2">微信扫码 / 搜索号码添加</p>
          </div>
        </div>
      </div>
    </div>
  );
}
