"use client";

import { useState } from "react";
import { PLANS, type PlanType } from "@/lib/orders";
import {
  Crown,
  QrCode,
  CheckCircle2,
  Clock,
  ArrowLeft,
  Copy,
  MessageSquare,
  Download,
  Globe,
} from "lucide-react";
import Link from "next/link";

export default function MembershipPage() {
  const [selectedPlan, setSelectedPlan] = useState<PlanType | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"wechat" | "alipay">("wechat");
  const [currency, setCurrency] = useState<"CNY" | "HKD">("CNY");
  const [orderStatus, setOrderStatus] = useState<
    "idle" | "submitting" | "success"
  >("idle");
  const [orderId, setOrderId] = useState<string | null>(null);
  const [error, setError] = useState("");

  // ── 按 (currency, paymentMethod, plan) 选择对应二維碼 ──
  const getQrCode = (cur: "CNY" | "HKD", method: "wechat" | "alipay", plan: PlanType) => {
    const dir = cur === "CNY" ? "cny" : "hkd";
    const methodName = method === "wechat" ? "wechat" : "alipay";
    return `/pay/${dir}/${methodName}-${plan}.jpg`;
  };

  // ── 按币种显示金额 ──
  const getDisplayPrice = (plan: PlanType) => {
    if (currency === "HKD") {
      return plan === "month" ? 80 : 228;
    }
    return PLANS[plan].price;
  };

  const handlePurchase = async () => {
    if (!selectedPlan) {
      setError("请选择套餐");
      return;
    }

    setError("");
    setOrderStatus("submitting");

    try {
      // 获取用户信息（从 localStorage）
      const userStr = localStorage.getItem("yixu-user");
      let userId = "anonymous";
      let userName = "匿名用户";
      let userPhone = "";

      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          userId = user.id || "anonymous";
          userName = user.nickname || "匿名用户";
          userPhone = user.phone || "";
        } catch {
          // ignore
        }
      }

      // 创建订单（含去重）
      const res = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          userName,
          userPhone,
          plan: selectedPlan,
          paymentMethod,
          currency,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setOrderId(data.data.id);
        setOrderStatus("success");
      } else {
        setError(data.message || "订单创建失败");
        setOrderStatus("idle");
      }
    } catch {
      setError("网络错误，请重试");
      setOrderStatus("idle");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a1628] via-[#1a2744] to-[#0a1628] text-white px-4 py-8">
      {/* Header */}
      <div className="max-w-md mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-gray-400 mb-6 hover:text-[#c9a84c]"
        >
          <ArrowLeft className="w-4 h-4" />
          返回
        </Link>

        <div className="text-center mb-8">
          <Crown className="w-12 h-12 mx-auto mb-3 text-[#c9a84c]" />
          <h1 className="text-2xl font-bold mb-2">开通亦须VIP</h1>
          <p className="text-gray-400 text-sm">
            解锁全部付费测评 · AI深度对话 · 专属内容
          </p>
        </div>

        {/* 套餐选择 */}
        {(orderStatus === "idle" || orderStatus === "submitting") && (
          <>
            {/* 币种切换 */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Globe className="w-4 h-4 text-[#c9a84c]" />
                <span className="text-sm text-gray-300">选择币种</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setCurrency("CNY")}
                  className={`py-2.5 rounded-xl text-sm font-medium transition-all ${
                    currency === "CNY"
                      ? "bg-[#c9a84c] text-[#0a1628]"
                      : "bg-white/5 border border-gray-700 text-gray-300"
                  }`}
                >
                  人民币 ¥
                </button>
                <button
                  onClick={() => setCurrency("HKD")}
                  className={`py-2.5 rounded-xl text-sm font-medium transition-all ${
                    currency === "HKD"
                      ? "bg-[#c9a84c] text-[#0a1628]"
                      : "bg-white/5 border border-gray-700 text-gray-300"
                  }`}
                >
                  港币 HK$
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {(Object.entries(PLANS) as [PlanType, typeof PLANS.month][]).map(
                ([key, plan]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedPlan(key)}
                    className={`relative p-4 rounded-xl border transition-all ${
                      selectedPlan === key
                        ? "border-[#c9a84c] bg-[#c9a84c]/10 ring-1 ring-[#c9a84c]/30"
                        : "border-gray-700 bg-white/5 hover:border-gray-500"
                    }`}
                  >
                    {key === "year" && (
                      <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-[#c9a84c] text-[#0a1628] text-xs font-bold px-2 py-0.5 rounded-full">
                        最省
                      </span>
                    )}
                    <div className="text-lg font-bold mb-1">{plan.name}</div>
                    <div className="text-2xl font-bold text-[#c9a84c]">
                      {currency === "CNY" ? "¥" : "HK$"}{getDisplayPrice(key)}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {currency === "HKD" ? "港币支付" : plan.desc}
                    </div>
                  </button>
                )
              )}
            </div>

            {/* 支付方式 */}
            {selectedPlan && (
              <div className="mb-6">
                <label className="text-sm text-gray-300 mb-2 block">
                  选择支付方式
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setPaymentMethod("wechat")}
                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border transition-all ${
                      paymentMethod === "wechat"
                        ? "border-green-500 bg-green-500/10"
                        : "border-gray-700 bg-white/5"
                    }`}
                  >
                    <QrCode className="w-5 h-5 text-green-400" />
                    {currency === "HKD" ? "WeChat Pay" : "微信支付"}
                  </button>
                  <button
                    onClick={() => setPaymentMethod("alipay")}
                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border transition-all ${
                      paymentMethod === "alipay"
                        ? "border-blue-500 bg-blue-500/10"
                        : "border-gray-700 bg-white/5"
                    }`}
                  >
                    <QrCode className="w-5 h-5 text-blue-400" />
                    {currency === "HKD" ? "AlipayHK" : "支付宝"}
                  </button>
                </div>
              </div>
            )}

            {/* 提交按钮 */}
            {selectedPlan && (
              <button
                onClick={handlePurchase}
                disabled={orderStatus === "submitting"}
                className="w-full py-3 rounded-xl bg-[#c9a84c] hover:bg-[#b8983f] text-[#0a1628] font-bold text-lg transition-all disabled:opacity-50"
              >
                {orderStatus === "submitting" ? (
                  <span className="flex items-center justify-center gap-2">
                    <Clock className="w-5 h-5 animate-spin" />
                    创建订单中...
                  </span>
                ) : (
                  `确认下单 ${currency === "CNY" ? "¥" : "HK$"}${getDisplayPrice(selectedPlan)}`
                )}
              </button>
            )}

            {error && (
              <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* 说明文字 */}
            <div className="mt-6 p-4 rounded-xl bg-white/5 border border-gray-800">
              <h3 className="font-bold text-sm mb-2 flex items-center gap-1">
                <MessageSquare className="w-4 h-4 text-[#c9a84c]" />
                付款流程说明
              </h3>
              <ol className="text-xs text-gray-400 space-y-1 list-decimal list-inside">
                <li>选择套餐并点击「确认下单」</li>
                <li>扫描下方固定金额二维码完成付款</li>
                <li>C老大确认收款后，VIP自动激活</li>
                <li>通常 30 分钟内完成激活 ⚡</li>
              </ol>
            </div>
          </>
        )}

        {/* 订单创建成功 → 显示付款码 */}
        {orderStatus === "success" && orderId && selectedPlan && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="text-center p-4 rounded-xl bg-green-500/10 border border-green-500/30">
              <CheckCircle2 className="w-12 h-12 mx-auto mb-2 text-green-400" />
              <h2 className="text-lg font-bold text-green-300">订单已创建！</h2>
              <p className="text-sm text-gray-400 mt-1">
                请扫描下方二维码完成付款
              </p>
              <p className="text-xs text-gray-500 mt-1 font-mono">
                订单号：{orderId.slice(0, 16)}...
              </p>
            </div>

            {/* 显示对应的固定金额收款码 */}
            <div className="bg-white rounded-2xl p-4 shadow-lg relative">
              <img
                src={getQrCode(currency, paymentMethod, selectedPlan)}
                alt={`${currency === "HKD" ? "港币" : "人民币"}${paymentMethod === "wechat" ? (currency === "HKD" ? "WeChat Pay" : "微信") : (currency === "HKD" ? "AlipayHK" : "支付宝")} 收款码`}
                className="w-full h-auto rounded-lg"
                id="pay-qr-img"
              />
              {/* 下载按钮 */}
              <button
                onClick={() => {
                  const imgSrc = getQrCode(currency, paymentMethod, selectedPlan);
                  const filename = `亦须AI-${currency === "HKD" ? "港币" : "人民币"}-${selectedPlan === "month" ? "月卡" : "年卡"}.jpg`;
                  const a = document.createElement("a");
                  a.href = imgSrc;
                  a.download = filename;
                  a.click();
                }}
                className="absolute top-2 right-2 bg-[#c9a84c] hover:bg-[#b8983f] text-[#0a1628] p-2 rounded-full shadow-md transition-all"
                title="下载收款码"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>

            {/* 金额提示（固定） */}
            <div className="text-center p-4 rounded-xl bg-[#c9a84c]/10 border border-[#c9a84c]/20">
              <div className="text-3xl font-bold text-[#c9a84c] mb-1">
                {currency === "CNY" ? "¥" : "HK$"}{getDisplayPrice(selectedPlan)}
              </div>
              <div className="text-sm text-gray-400">
                {PLANS[selectedPlan].name}（{currency === "HKD" ? "港币" : "人民币"}）
              </div>
              <div className="text-xs text-green-400 mt-1">
                ✓ 固定金额，扫码即付
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/orders"
                className="py-3 rounded-xl bg-white/5 border border-gray-700 text-center text-sm hover:bg-white/10 transition-all"
              >
                查看我的订单
              </Link>
              <Link
                href="/"
                className="py-3 rounded-xl bg-[#c9a84c]/20 border border-[#c9a84c]/30 text-[#c9a84c] text-sm font-medium hover:bg-[#c9a84c]/30 transition-all text-center"
              >
                返回首页
              </Link>
            </div>

            {/* 温馨提示 */}
            <div className="p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
              <p className="text-xs text-yellow-200">
                ⏰ C老大会在收到付款后尽快确认，通常 30 分钟内完成 VIP 激活。如超过 1 小时未处理，请加微信联系。
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
