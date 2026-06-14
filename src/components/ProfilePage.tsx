"use client";

import { useState, useRef, useCallback } from "react";
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
  Wallet,
  Camera,
  Check,
} from "lucide-react";
import { useUser } from "@/hooks/useUser";
import { useWallet, formatAmount, ASSESSMENT_NAMES, ASSESSMENT_PRICES } from "@/hooks/useWallet";
import TopupModal from "@/components/TopupModal";

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
  const [agreed, setAgreed] = useState(false);

  const handleSubmit = () => {
    const trimmed = phone.trim();
    if (!trimmed) {
      setError("请输入手机号");
      return;
    }
    // 接受任意位数的手机号（大陆11位/港澳8位/其他地区均可）
    if (!/^\d{6,15}$/.test(trimmed)) {
      setError("请输入有效的手机号（6-15位数字）");
      return;
    }
    if (!agreed) {
      setError("请先同意用户协议和隐私政策");
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
        <h3 className="font-bold text-[#1a1a1a]">注册 / 登录</h3>
        <p className="text-xs text-[#999999] mt-1">
          输入手机号即可注册，已有账号直接登录
        </p>
      </div>

      <div className="space-y-3">
        <input
          type="tel"
          value={phone}
          onChange={(e) => {
            setPhone(e.target.value.replace(/\D/g, "").slice(0, 15));
            setError("");
          }}
          placeholder="手机号（6-15位数字）"
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
        <label className="flex items-start gap-2 text-xs text-[#999] px-1">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 shrink-0"
          />
          <span>注册即同意《用户协议》和《隐私政策》，我们不会把你的数据卖给任何人。</span>
        </label>
        <button
          onClick={handleSubmit}
          className="w-full rounded-xl py-3 text-sm font-semibold text-white transition-all active:scale-[0.98] disabled:opacity-50"
          style={{ background: "linear-gradient(135deg, #c9a84c, #b8943a)" }}
          disabled={!agreed}
        >
          注册 / 登录
        </button>
      </div>
    </div>
  );
};

// ─── 头像组件 ───
function Avatar({
  src,
  size = 56,
  onClick,
}: {
  src?: string;
  size?: number;
  onClick?: () => void;
}) {
  return (
    <div
      className="relative shrink-0"
      style={{ width: size, height: size }}
      onClick={onClick}
    >
      <div
        className="w-full h-full rounded-full overflow-hidden border-2 border-[#c9a84c] bg-[#fdf8ed] flex items-center justify-center"
      >
        {src ? (
          <img src={src} alt="头像" className="w-full h-full object-cover" />
        ) : (
          <img
            src="/app-avatar.png"
            alt="亦须先生"
            className="w-full h-full object-cover"
          />
        )}
      </div>
      {onClick && (
        <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-[#c9a84c] rounded-full flex items-center justify-center">
          <Camera size={10} className="text-white" />
        </div>
      )}
    </div>
  );
}

// ─── 主组件 ───
export default function ProfilePage() {
  const { user, history, isLoggedIn, loginWithPhone, setWechatId, setAvatar, logout } = useUser();
  const { balance, transactions, isUnlocked, grantWelcomeBonus } = useWallet();
  const [showVIP, setShowVIP] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showTopup, setShowTopup] = useState(false);
  const [showWelcomeBonus, setShowWelcomeBonus] = useState(false);
  const [inviteCode, setInviteCode] = useState("");
  const [inviteError, setInviteError] = useState("");
  const [resolvedRoute, setResolvedRoute] = useState<{
    path: string;
    label: string;
    icon: any;
    color: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── 手机号登录 ──
  const handlePhoneLogin = (phone: string, wechat: string) => {
    const isNewUser = loginWithPhone(phone);
    if (wechat) setWechatId(wechat);
    setShowLogin(false);
    // 新用戶 → 彈紅包選擇
    if (isNewUser) {
      setShowWelcomeBonus(true);
    }
  };

  // ── 头像上传 ──
  const handleAvatarClick = () => {
    if (isLoggedIn) {
      fileInputRef.current?.click();
    }
  };

  const handleAvatarFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 壓縮圖片
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const size = 200;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // 裁剪為正方形
        const minDim = Math.min(img.width, img.height);
        const sx = (img.width - minDim) / 2;
        const sy = (img.height - minDim) / 2;
        ctx.drawImage(img, sx, sy, minDim, minDim, 0, 0, size, size);

        // 壓縮為 JPEG
        let quality = 0.7;
        let dataUrl = canvas.toDataURL("image/jpeg", quality);

        // 確保不超過 100KB
        while (dataUrl.length > 100 * 1024 * 1.37 && quality > 0.1) {
          quality -= 0.1;
          dataUrl = canvas.toDataURL("image/jpeg", quality);
        }

        if (dataUrl.length <= 100 * 1024 * 1.37) {
          setAvatar(dataUrl);
        } else {
          alert("图片过大，请选择更小的图片");
        }
      };
      img.src = ev.target?.result as string;
    };
    reader.readAsDataURL(file);

    // 重置 input 以便再次選擇同一文件
    e.target.value = "";
  }, [setAvatar]);

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

  // 已解鎖測評
  const unlockedList = Object.keys(ASSESSMENT_PRICES).filter(
    (id) => ASSESSMENT_PRICES[id] > 0 && isUnlocked(id)
  );

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <header className="sticky-header bg-white/95 backdrop-blur-md px-4 py-4 border-b border-[#e8e8e8]">
        <h1 className="text-xl font-bold text-[#1a1a1a] font-song">我的</h1>
      </header>

      <div className="flex-1 px-4 pb-20 content-below-header">
        {/* 隱藏的文件上傳 input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="user"
          className="hidden"
          onChange={handleAvatarFile}
        />

        {/* ── 未登录：显示注册/登录入口 ── */}
        {!isLoggedIn && !showLogin && (
          <>
            {/* 用户卡（匿名） */}
            <div className="card mt-4">
              <div className="flex items-center gap-3">
                <Avatar />
                <div>
                  <h2 className="font-bold text-lg text-[#1a1a1a] font-song">修行者</h2>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="gold-tag">未登录</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 注册/登录大按钮 */}
            <button
              onClick={() => setShowLogin(true)}
              className="w-full mt-4 rounded-2xl py-4 text-base font-bold text-white active:scale-[0.98] transition-transform"
              style={{ background: "linear-gradient(135deg, #c9a84c, #b8943a)" }}
            >
              注册 / 登录
            </button>

            {/* 功能提示 */}
            <div className="mt-3 px-1">
              <p className="text-xs text-[#999] text-center">
                注册即送 🧧 新学员红包，可抵扣测评解锁
              </p>
            </div>

            {/* 其他入口 */}
            <button
              onClick={() => setShowLogin(true)}
              className="w-full mt-3 card flex items-center justify-between py-4"
            >
              <div className="flex items-center gap-3">
                <Phone size={20} className="text-[#c9a84c]" />
                <div className="text-left">
                  <p className="text-sm font-medium text-[#1a1a1a]">手机号注册</p>
                  <p className="text-xs text-[#999999]">登录后查看历史记录与报告</p>
                </div>
              </div>
              <ChevronRight size={16} className="text-[#999999]" />
            </button>
          </>
        )}

        {/* ── 登录表单 ── */}
        {showLogin && (
          <PhoneLogin onLogin={handlePhoneLogin} />
        )}

        {/* ── 已登录状态 ── */}
        {isLoggedIn && (
          <>
            {/* 用户卡（已登录）— 帶頭像上載 */}
            <div className="card mt-4">
              <div className="flex items-center gap-3">
                <Avatar
                  src={user?.avatar}
                  onClick={handleAvatarClick}
                />
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

            {/* ── 钱包卡片 ── */}
            <div className="card mt-3 bg-gradient-to-br from-[#fdf8ed] to-[#fefaf0] border border-[#c9a84c]/20">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Wallet size={18} className="text-[#c9a84c]" />
                  <span className="text-sm font-semibold text-[#1a1a1a]">我的余额</span>
                </div>
                <button
                  onClick={() => setShowTopup(true)}
                  className="text-xs py-1 px-3 rounded-full bg-[#c9a84c] text-white font-semibold active:scale-[0.96] transition-transform"
                >
                  充值
                </button>
              </div>
              <p className="text-3xl font-bold text-[#c9a84c] font-song">
                {formatAmount(balance)}
              </p>
              {/* 最近交易 */}
              {transactions.length > 0 && (
                <div className="mt-2 pt-2 border-t border-[#c9a84c]/10">
                  {transactions.slice(0, 3).map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between py-1">
                      <span className="text-xs text-[#666] truncate flex-1 mr-2">{tx.description}</span>
                      <span className={`text-xs font-semibold ${tx.type === "topup" ? "text-green-600" : "text-[#c9a84c]"}`}>
                        {tx.type === "topup" ? "+" : "-"}{formatAmount(tx.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
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
                  <p className="text-2xl font-bold text-[#c9a84c] font-song">{unlockedList.length}</p>
                  <p className="text-sm text-[#666666] mt-1">已解锁测评</p>
                </div>
              </div>
            </div>

            {/* ── 已解锁测评 ── */}
            {unlockedList.length > 0 && (
              <div className="mt-4">
                <h3 className="section-header">已解锁测评</h3>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {unlockedList.map((id) => (
                    <span
                      key={id}
                      className="text-xs px-2.5 py-1 rounded-full bg-[#fdf8ed] text-[#c9a84c] font-medium flex items-center gap-1"
                    >
                      <Check size={10} />
                      {ASSESSMENT_NAMES[id] || id}
                    </span>
                  ))}
                </div>
              </div>
            )}

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

        {/* ── 充值彈窗 ── */}
        <TopupModal
          visible={showTopup}
          onClose={() => setShowTopup(false)}
        />

        {/* ── 新學員紅包彈窗 ── */}
        {showWelcomeBonus && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            onClick={() => setShowWelcomeBonus(false)}
          >
            <div
              className="bg-white rounded-2xl p-6 m-6 max-w-sm w-full animate-fade-in-up text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-5xl mb-3">🧧</div>
              <h3 className="text-xl font-bold text-[#1a1a1a] font-song mb-2">新学员红包</h3>
              <p className="text-sm text-[#666] mb-1">恭喜你注册成功！</p>
              <p className="text-3xl font-bold text-[#c9a84c] font-song mb-1">¥12.30</p>
              <p className="text-xs text-[#999] mb-4">可抵扣任意测评解锁</p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowWelcomeBonus(false)}
                  className="flex-1 py-3 rounded-xl border border-[#e8e8e8] text-sm text-[#666] font-semibold active:scale-[0.98] transition-transform"
                >
                  不用了
                </button>
                <button
                  onClick={() => {
                    grantWelcomeBonus();
                    setShowWelcomeBonus(false);
                  }}
                  className="flex-1 py-3 rounded-xl text-white text-sm font-bold active:scale-[0.98] transition-transform"
                  style={{ background: "linear-gradient(135deg, #c9a84c, #b89430)" }}
                >
                  🧧 领取红包
                </button>
              </div>
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
