"use client";

import { useState } from "react";
import { X, Gift, Phone } from "lucide-react";
import { useWallet, formatAmount } from "@/hooks/useWallet";

interface TopupModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function TopupModal({ visible, onClose }: TopupModalProps) {
  const { balance, redeemCode } = useWallet();
  const [code, setCode] = useState("");
  const [message, setMessage] = useState<{ text: string; success: boolean } | null>(null);
  const [redeeming, setRedeeming] = useState(false);

  if (!visible) return null;

  const handleRedeem = async () => {
    if (!code.trim()) {
      setMessage({ text: "请输入充值码", success: false });
      return;
    }
    setRedeeming(true);
    await new Promise((r) => setTimeout(r, 300));
    const result = redeemCode(code);
    setRedeeming(false);
    setMessage({ text: result.message, success: result.success });
    if (result.success) {
      setCode("");
      // 2 秒後自動關閉
      setTimeout(() => {
        setMessage(null);
      }, 2000);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-sm animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-[#fdf8ed] flex items-center justify-center">
              <Gift size={18} className="text-[#c9a84c]" />
            </div>
            <h3 className="text-lg font-bold text-[#1a1a1a]">充值余额</h3>
          </div>
          <button onClick={onClose} className="p-1 text-[#999]">
            <X size={20} />
          </button>
        </div>

        {/* 內容 */}
        <div className="px-5 pb-5">
          {/* 當前餘額 */}
          <div className="bg-[#fdf8ed] rounded-xl p-4 mb-4 text-center">
            <p className="text-xs text-[#999] mb-1">当前余额</p>
            <p className="text-3xl font-bold text-[#c9a84c] font-song">
              {formatAmount(balance)}
            </p>
          </div>

          {/* 充值碼輸入 */}
          <div className="mb-4">
            <label className="text-sm font-medium text-[#1a1a1a] mb-2 block">
              输入充值码
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value.toUpperCase());
                  setMessage(null);
                }}
                onKeyDown={(e) => e.key === "Enter" && handleRedeem()}
                placeholder="输入充值码"
                className="flex-1 px-4 py-3 rounded-xl border border-[#e8e8e8] text-center text-base tracking-widest outline-none focus:border-[#c9a84c] transition-colors"
                autoFocus
              />
              <button
                onClick={handleRedeem}
                disabled={redeeming}
                className="px-5 py-3 rounded-xl text-white text-sm font-semibold active:scale-[0.98] transition-transform disabled:opacity-50"
                style={{ background: "linear-gradient(135deg, #c9a84c, #b89430)" }}
              >
                {redeeming ? "..." : "兑换"}
              </button>
            </div>
            {message && (
              <p className={`text-xs mt-2 text-center ${message.success ? "text-green-600" : "text-red-500"}`}>
                {message.text}
              </p>
            )}
          </div>

          {/* 獲取充值碼 */}
          <div className="bg-[#f9f9f9] rounded-xl p-4">
            <p className="text-sm font-semibold text-[#1a1a1a] mb-2">获取充值码</p>
            <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-2.5 mb-2">
              <Phone size={16} className="text-[#c9a84c]" />
              <span className="text-base font-mono text-[#1a1a1a]">859022196</span>
            </div>
            <p className="text-xs text-[#999]">
              微信联系亦须先生，转账后发送截图，先生确认后即时到账并发送充值码
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
