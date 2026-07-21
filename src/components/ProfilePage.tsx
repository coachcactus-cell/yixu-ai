"use client";

import { useState, useRef, useCallback } from "react";
import {
  Crown,
  MessageCircle,
  ClipboardList,
  ChevronRight,
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
  Pencil,
  X,
} from "lucide-react";
import Link from "next/link";
import { useUser } from "@/hooks/useUser";
import { useWallet, formatAmount, ASSESSMENT_NAMES, ASSESSMENT_PRICES } from "@/hooks/useWallet";
import TopupModal from "@/components/TopupModal";

// ── 邀请码 & 权限系统 ──

// C老大后台密码（可自行修改）
const ADMIN_PASSWORD = "yixu2026";

// 已发布的 B2B 邀请码（合作伙伴用，每码对应一个 clientId）
const B2B_INVITE_CODES: Record<string, { clientId: string; label: string; note: string }> = {
  "yixu-demo": { clientId: "yixu-demo", label: "亦须演示", note: "演示用B2B面板" },
  // 新增 B2B 合作伙伴在这里加，例如：
  // "healing-zen": { clientId: "healing-zen", label: "禅愈工作室", note: "张老师" },
};

// 已授权的 B2B 合作伙伴密码（正式合作后用密码登录）
const B2B_PASSWORDS: Record<string, string> = {
  "yixu-demo": "demo2026",
  // 正式合作伙伴的密码，例如：
  // "healing-zen": "zen2026",
};

// 永久VIP邀请码（工作人员/前贤专用）
const STAFF_VIP_CODE = "cactusvvip";

// 邀请码验证：严格模式，只有明确列出的码才有效
function resolveInviteCode(code: string): { path: string; label: string; icon: any; color: string } | null {
  const trimmed = code.trim();

  // 1. C老大后台：固定密码
  if (trimmed === ADMIN_PASSWORD) {
    return { path: "/admin", label: "管理后台", icon: Shield, color: "#c9a84c" };
  }

  // 2. 已发布的 B2B 邀请码
  const lower = trimmed.toLowerCase();
  if (B2B_INVITE_CODES[lower]) {
    const info = B2B_INVITE_CODES[lower];
    return { path: `/b2b-dashboard?clientId=${encodeURIComponent(info.clientId)}`, label: info.label, icon: Building2, color: "#6366f1" };
  }

  // 3. B2B 合作伙伴密码登录
  if (B2B_PASSWORDS[lower]) {
    // 通过密码反查 clientId
    const clientId = Object.entries(B2B_PASSWORDS).find(([_, pwd]) => pwd === lower)?.[0];
    if (clientId) {
      const info = B2B_INVITE_CODES[clientId];
      return { path: `/b2b-dashboard?clientId=${encodeURIComponent(clientId)}`, label: info?.label || "B2B 后台", icon: Building2, color: "#6366f1" };
    }
  }

  // 4. 分销商邀请码（以 dsp- 或 dsp_ 开头）
  if (lower.startsWith("dsp-") || lower.startsWith("dsp_")) {
    return { path: `/distributor?code=${encodeURIComponent(trimmed)}`, label: "分销商后台", icon: Handshake, color: "#10b981" };
  }

  // 其他一切输入：无效
  return null;
}

// ─── 注册组件（微信扫码 / 邮箱 / 手机号 三选一）───
function RegisterForm({
  onRegister,
}: {
  onRegister: (method: string, identifier: string, wechatId?: string) => void;
}) {
  const [method, setMethod] = useState<"wechat" | "email" | "phone">("wechat");
  const [identifier, setIdentifier] = useState("");
  const [wechatId, setWechatId] = useState("");
  const [error, setError] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = () => {
    const trimmed = identifier.trim();
    if (!trimmed) {
      setError(method === "email" ? "请输入邮箱" : "请输入手机号");
      return;
    }
    // 验证
    if (method === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError("请输入有效的邮箱地址");
      return;
    }
    if (method === "phone" && !/^\d{6,15}$/.test(trimmed)) {
      setError("请输入有效的手机号（6-15位数字）");
      return;
    }
    if (!agreed) {
      setError("请先同意用户协议和隐私政策");
      return;
    }
    setError("");
    onRegister(method, trimmed, wechatId.trim());
  };

  // 模拟邮箱验证码发送
  const sendEmailCode = () => {
    const trimmed = identifier.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError("请输入有效的邮箱地址");
      return;
    }
    setEmailSent(true);
    setError("");
  };

  return (
    <div className="card mt-4">
      <div className="text-center mb-4">
        <h3 className="font-bold text-[#1a1a1a]">注册 / 登录</h3>
        <p className="text-xs text-[#999999] mt-1">选择一种方式开始</p>
      </div>

      {/* 方式选择 */}
      <div className="flex gap-1 mb-4 bg-[#f5f5f5] rounded-xl p-1">
        {[
          { key: "wechat", label: "微信", icon: "💬" },
          { key: "email", label: "邮箱", icon: "📧" },
          { key: "phone", label: "手机号", icon: "📱" },
        ].map((opt) => (
          <button
            key={opt.key}
            onClick={() => { setMethod(opt.key as any); setIdentifier(""); setError(""); setEmailSent(false); }}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
              method === opt.key ? "bg-white text-[#1a1a1a] shadow-sm" : "text-[#999]"
            }`}
          >
            {opt.icon} {opt.label}
          </button>
        ))}
      </div>

      {/* 微信扫码 */}
      {method === "wechat" && (
        <div className="space-y-3">
          <div className="bg-[#fdf8ed] rounded-xl p-5 text-center">
            <div className="w-16 h-16 rounded-full bg-[#07c160] flex items-center justify-center mx-auto mb-3">
              <span className="text-white text-2xl font-bold">微</span>
            </div>
            <p className="text-sm text-[#1a1a1a] font-semibold">扫码关注亦须先生</p>
            <p className="text-xs text-[#999] mt-1">微信扫码后自动完成注册</p>
          </div>
          <div className="bg-[#f9f9f9] rounded-xl p-3 space-y-2">
            <p className="text-xs text-[#999] text-center leading-relaxed">
              扫码关注公众号「亦须先生」→ 点击菜单「进入亦须AI」→ 自动登录<br />
              <b className="text-[#666]">目前为演示版，正式版上线后接入微信 OAuth</b>
            </p>
          </div>
          {/* 演示版：手动输入微信号注册 */}
          <input
            type="text"
            value={wechatId}
            onChange={(e) => setWechatId(e.target.value)}
            placeholder="输入你的微信号（演示版直接注册）"
            className="w-full px-4 py-3 rounded-xl border border-[#e8e8e8] text-center text-base outline-none focus:border-[#07c160] transition-colors"
          />
          {error && <p className="text-xs text-red-500 text-center">{error}</p>}
          <label className="flex items-start gap-2 text-xs text-[#999] px-1">
            <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-0.5 shrink-0" />
            <span>注册即同意《用户协议》和《隐私政策》，我们不会把你的数据卖给任何人。</span>
          </label>
          <button
            onClick={() => {
              if (!wechatId.trim()) { setError("请输入微信号"); return; }
              if (!agreed) { setError("请先同意用户协议"); return; }
              onRegister("wechat", wechatId.trim());
            }}
            className="w-full rounded-xl py-3 text-sm font-semibold text-white transition-all active:scale-[0.98] disabled:opacity-50"
            style={{ background: "linear-gradient(135deg, #07c160, #06ad56)" }}
            disabled={!agreed}
          >
            微信注册
          </button>
        </div>
      )}

      {/* 邮箱注册 */}
      {method === "email" && (
        <div className="space-y-3">
          {!emailSent ? (
            <>
              <input
                type="email"
                value={identifier}
                onChange={(e) => { setIdentifier(e.target.value); setError(""); }}
                placeholder="输入邮箱地址"
                className="w-full px-4 py-3 rounded-xl border border-[#e8e8e8] text-center text-base outline-none focus:border-[#c9a84c] transition-colors"
              />
              {error && <p className="text-xs text-red-500 text-center">{error}</p>}
              <label className="flex items-start gap-2 text-xs text-[#999] px-1">
                <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-0.5 shrink-0" />
                <span>注册即同意《用户协议》和《隐私政策》，我们不会把你的数据卖给任何人。</span>
              </label>
              <button
                onClick={sendEmailCode}
                className="w-full rounded-xl py-3 text-sm font-semibold text-white transition-all active:scale-[0.98] disabled:opacity-50"
                style={{ background: "linear-gradient(135deg, #c9a84c, #b8943a)" }}
                disabled={!agreed}
              >
                发送验证链接
              </button>
            </>
          ) : (
            <>
              <div className="bg-[#fdf8ed] rounded-xl p-4 text-center">
                <div className="text-4xl mb-2">📧</div>
                <p className="text-sm font-semibold text-[#1a1a1a]">验证链接已发送</p>
                <p className="text-xs text-[#999] mt-1">{identifier}</p>
                <p className="text-xs text-[#999] mt-2 leading-relaxed">请检查邮箱，点击验证链接完成注册。</p>
              </div>
              {/* 演示版：直接完成 */}
              <button
                onClick={handleSubmit}
                className="w-full rounded-xl py-3 text-sm font-semibold text-white transition-all active:scale-[0.98]"
                style={{ background: "linear-gradient(135deg, #c9a84c, #b8943a)" }}
              >
                演示版：直接完成注册
              </button>
            </>
          )}
          <div className="bg-[#f9f9f9] rounded-xl p-2 text-center">
            <p className="text-[10px] text-[#999]">海内外邮箱均可使用</p>
          </div>
        </div>
      )}

      {/* 手机号注册 */}
      {method === "phone" && (
        <div className="space-y-3">
          <input
            type="tel"
            value={identifier}
            onChange={(e) => {
              setIdentifier(e.target.value.replace(/\D/g, "").slice(0, 15));
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
            <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-0.5 shrink-0" />
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
          <div className="bg-[#f9f9f9] rounded-xl p-2 text-center">
            <p className="text-[10px] text-[#999]">大陆11位 / 港澳8位 / 海外均可</p>
          </div>
        </div>
      )}
    </div>
  );
}

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
  const { user, history, isLoggedIn, loginWithPhone, setWechatId, setAvatar, setNickname, activateStaffVip, logout } = useUser();
  const { balance, transactions, isUnlocked, grantWelcomeBonus } = useWallet();
  const [showInvite, setShowInvite] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showTopup, setShowTopup] = useState(false);
  const [showWelcomeBonus, setShowWelcomeBonus] = useState(false);
  const [showWechatQR, setShowWechatQR] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [staffVipToast, setStaffVipToast] = useState<string | null>(null);
  const [inviteCode, setInviteCode] = useState("");
  const [inviteError, setInviteError] = useState("");
  const [resolvedRoute, setResolvedRoute] = useState<{
    path: string;
    label: string;
    icon: any;
    color: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── 注册（微信/邮箱/手机号）───
  const handleRegister = (method: string, identifier: string, wechat?: string) => {
    // 用 identifier 作为登录标识
    const isNewUser = loginWithPhone(identifier);
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
    const trimmed = inviteCode.trim();

    // 永久VIP邀请码（工作人员/前贤专用）
    if (trimmed.toLowerCase() === STAFF_VIP_CODE) {
      if (!isLoggedIn) {
        setInviteError("请先登录手机号，再激活VIP");
        return;
      }
      if (user?.vipLevel === "staff") {
        setInviteError("您已是永久VIP。如需进入管理后台，请输入管理密码。");
        return;
      }
      activateStaffVip();
      setStaffVipToast("🎉 永久VIP已激活！感谢您的支持。");
      setInviteCode("");
      setTimeout(() => setStaffVipToast(null), 5000);
      return;
    }

    const route = resolveInviteCode(trimmed);
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
          <RegisterForm onRegister={handleRegister} />
        )}

        {/* ── 已登录状态 ── */}
        {isLoggedIn && (
          <>
            {/* 用户卡（已登录）— 帶頭像上載 + 暱稱編輯 */}
            <div className="card mt-4">
              <div className="flex items-center gap-3">
                <Avatar
                  src={user?.avatar}
                  onClick={handleAvatarClick}
                />
                <div className="flex-1 min-w-0">
                  {editingName ? (
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        value={nameInput}
                        onChange={(e) => setNameInput(e.target.value)}
                        maxLength={12}
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && nameInput.trim()) {
                            setNickname(nameInput.trim());
                            setEditingName(false);
                          }
                          if (e.key === "Escape") setEditingName(false);
                        }}
                        className="text-lg font-bold font-song text-[#1a1a1a] bg-transparent border-b border-[#c9a84c] outline-none flex-1 min-w-0"
                        placeholder="输入昵称"
                      />
                      <button
                        onClick={() => {
                          if (nameInput.trim()) {
                            setNickname(nameInput.trim());
                            setEditingName(false);
                          }
                        }}
                        className="p-1 rounded-lg bg-[#c9a84c] text-white flex-shrink-0"
                      >
                        <Check size={14} />
                      </button>
                      <button
                        onClick={() => setEditingName(false)}
                        className="p-1 rounded-lg bg-gray-100 text-gray-500 flex-shrink-0"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <h2 className="font-bold text-lg text-[#1a1a1a] font-song">
                        {user?.nickname || "修行者"}
                      </h2>
                      <button
                        onClick={() => {
                          setNameInput(user?.nickname || "");
                          setEditingName(true);
                        }}
                        className="p-1 rounded-lg text-[#999] hover:text-[#c9a84c] hover:bg-[#fdf8ed] transition-colors"
                        title="修改昵称"
                      >
                        <Pencil size={13} />
                      </button>
                    </div>
                  )}
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#fdf8ed] text-[#c9a84c] font-medium">
                      {user?.vipLevel === "free" ? "免费会员" :
                       user?.vipLevel === "monthly" ? "月会员" :
                       user?.vipLevel === "yearly" ? "年会员" :
                       user?.vipLevel === "staff" ? "⭐ 永久VIP" : "免费会员"}
                    </span>
                  </div>
                  {user?.phone && (
                    <p className="text-xs text-[#999999] mt-1">
                      📱 {user.phone.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2")}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-1 flex-shrink-0">
                  {user?.vipLevel !== "staff" && (
                    <Link
                      href="/membership"
                      target="_blank"
                      className="btn-primary text-xs py-1.5 px-3 inline-flex items-center gap-1"
                    >
                      <Crown size={12} />
                      升级 VIP
                    </Link>
                  )}
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

            {/* 工作人员VIP激活成功提示 */}
            {staffVipToast && (
              <div className="mt-3 p-3 rounded-xl bg-gradient-to-r from-[#c9a84c]/10 to-[#fdf8ed] border border-[#c9a84c]/30 text-center">
                <p className="text-sm font-bold text-[#c9a84c]">{staffVipToast}</p>
              </div>
            )}

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
              <button
                className="w-full card flex items-center justify-between py-3"
              >
                <div className="flex items-center gap-3">
                  <MessageCircle size={18} className="text-[#c9a84c]" />
                  <span className="text-sm text-[#1a1a1a]">我的对话记录</span>
                </div>
                <ChevronRight size={16} className="text-[#999999]" />
              </button>
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
                <h3 className="text-lg font-bold text-[#1a1a1a]">邀请码 / 后台入口</h3>
                <p className="text-xs text-[#999] mt-1">输入邀请码或密码进入对应后台</p>
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
                    placeholder="输入邀请码或密码"
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
                      <Shield size={10} className="inline -mt-0.5" /> 管理密码 → 管理后台
                    </p>
                    <p className="text-[10px] text-[#999]">
                      <Building2 size={10} className="inline -mt-0.5" /> B2B邀请码 / 合作密码 → B2B面板
                    </p>
                    <p className="text-[10px] text-[#999]">
                      <Handshake size={10} className="inline -mt-0.5" /> DSP-xxx → 分销商后台
                    </p>
                    <p className="text-[10px] text-[#ccc] mt-2">无邀请码？请加微信 859022196 申请</p>
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

        {/* 联系方式卡片 */}
        <div className="mt-3 card bg-gradient-to-br from-[#fdf8ed] to-[#fefaf0] border border-[#c9a84c]/20">
          <div className="text-center py-2">
            <p className="text-sm font-bold text-[#c9a84c] font-song mb-1">🙏 联系先生</p>
            <p className="text-xs text-[#666666] mb-3">报名咨询 / 疗愈预约</p>
            <div className="flex items-center justify-center gap-3">
              {/* 微信二维码按钮 */}
              <button
                onClick={() => setShowWechatQR(true)}
                className="flex flex-col items-center gap-1.5 active:scale-[0.96] transition-transform"
              >
                <div className="w-12 h-12 rounded-full bg-[#07c160] flex items-center justify-center">
                  <span className="text-white text-xl">💬</span>
                </div>
                <span className="text-xs text-[#666] font-medium">微信扫码</span>
              </button>

              {/* WhatsApp按钮 */}
              <a
                href="https://wa.me/85293103003"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-1.5 active:scale-[0.96] transition-transform"
              >
                <div className="w-12 h-12 rounded-full bg-[#25D366] flex items-center justify-center">
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="white">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                </div>
                <span className="text-xs text-[#666] font-medium">WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {/* 微信二维码弹窗 */}
        {showWechatQR && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            onClick={() => setShowWechatQR(false)}
          >
            <div
              className="bg-white rounded-2xl p-6 m-4 max-w-xs w-full animate-fade-in-up text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-bold text-[#1a1a1a] font-song mb-1">微信扫码加先生</h3>
              <p className="text-xs text-[#999] mb-4">扫描下方二维码，添加微信</p>
              <div className="rounded-xl overflow-hidden border-2 border-[#c9a84c]/20 mb-4">
                <img
                  src="/images/wechat-qr.png"
                  alt="微信二维码"
                  className="w-full"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement!.innerHTML = '<div class="py-12 text-[#999] text-sm">二维码图片待上传<br/>请暂加微信 859022196</div>';
                  }}
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowWechatQR(false)}
                  className="flex-1 py-2.5 rounded-xl border border-[#e8e8e8] text-sm text-[#666] font-semibold active:scale-[0.98] transition-transform"
                >
                  关闭
                </button>
                <a
                  href="/images/wechat-qr.png"
                  download="亦须先生微信二维码.png"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#c9a84c] to-[#b89430] text-white text-sm font-bold active:scale-[0.98] transition-transform inline-flex items-center justify-center gap-1.5"
                >
                  <Download size={14} />
                  下载二维码
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
