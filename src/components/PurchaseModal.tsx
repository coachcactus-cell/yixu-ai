"use client";

import { useState } from "react";
import { Lock, Wallet, ChevronRight, X } from "lucide-react";
import { useWallet, formatAmount, ASSESSMENT_NAMES } from "@/hooks/useWallet";

interface PurchaseModalProps {
  assessmentId: string;
  assessmentName?: string;
  visible: boolean;
  onPurchased: () => void;
  onClose: () => void;
  onTopup?: () => void;
}

export default function PurchaseModal({
  assessmentId,
  assessmentName,
  visible,
  onPurchased,
  onClose,
  onTopup,
}: PurchaseModalProps) {
  const { balance, getPrice, canAfford, purchase } = useWallet();
  const [purchasing, setPurchasing] = useState(false);

  if (!visible) return null;

  const name = assessmentName || ASSESSMENT_NAMES[assessmentId] || assessmentId;
  const price = getPrice(assessmentId);
  const affordable = canAfford(assessmentId);

  const handlePurchase = async () => {
    setPurchasing(true);
    // 小延遲模擬處理，體驗更好
    await new Promise((r) => setTimeout(r, 300));
    const result = purchase(assessmentId);
    setPurchasing(false);
    if (result.success) {
      onPurchased();
    } else {
      alert(result.message);
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
              <Lock size={18} className="text-[#c9a84c]" />
            </div>
            <h3 className="text-lg font-bold text-[#1a1a1a]">解锁完整报告</h3>
          </div>
          <button onClick={onClose} className="p-1 text-[#999]">
            <X size={20} />
          </button>
        </div>

        {/* 內容 */}
        <div className="px-5 pb-5">
          {/* 測評信息 */}
          <div className="bg-[#f9f9f9] rounded-xl p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-[#666]">测评项目</span>
              <span className="text-sm font-semibold text-[#1a1a1a]">{name}</span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-[#666]">解锁价格</span>
              <span className="text-sm font-bold text-[#c9a84c]">{formatAmount(price)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#666]">当前余额</span>
              <span className="text-sm font-semibold text-[#1a1a1a]">{formatAmount(balance)}</span>
            </div>
          </div>

          {/* 餘額不足提示 */}
          {!affordable && (
            <div className="bg-red-50 border border-red-100 rounded-xl p-3 mb-4">
              <p className="text-xs text-red-600 text-center">
                余额不足，需要 {formatAmount(price)}，当前余额 {formatAmount(balance)}
              </p>
              {onTopup && (
                <button
                  onClick={onTopup}
                  className="w-full mt-2 py-2 rounded-lg bg-red-500 text-white text-sm font-semibold active:scale-[0.98] transition-transform"
                >
                  去充值
                </button>
              )}
            </div>
          )}

          {/* 確認購買 */}
          {affordable && (
            <button
              onClick={handlePurchase}
              disabled={purchasing}
              className="w-full py-3.5 rounded-xl text-white font-bold text-base active:scale-[0.98] transition-transform disabled:opacity-50"
              style={{ background: "linear-gradient(135deg, #c9a84c, #b89430)" }}
            >
              {purchasing ? "处理中..." : `确认解锁 ${formatAmount(price)}`}
            </button>
          )}

          {/* 充值入口 */}
          {affordable && onTopup && (
            <button
              onClick={onTopup}
              className="w-full mt-2 py-2.5 rounded-xl border border-[#e8e8e8] text-sm text-[#666] flex items-center justify-center gap-1"
            >
              <Wallet size={14} />
              充值余额
              <ChevronRight size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
