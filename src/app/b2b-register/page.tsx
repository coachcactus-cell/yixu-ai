"use client";

import { useState } from "react";
import { Building2, CheckCircle, ArrowRight } from "lucide-react";

export default function B2BRegisterPage() {
  const [wechatId, setWechatId] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const handleRegister = async () => {
    if (!wechatId || !companyName) {
      setError("請填寫所有欄位");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/b2b/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wechatId, companyName }),
      });
      const data = await res.json();
      if (data.success) {
        setResult(data);
      } else {
        setError(data.error || "註冊失敗");
      }
    } catch {
      setError("網絡錯誤，請重試");
    } finally {
      setLoading(false);
    }
  };

  if (result) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white px-6">
        <CheckCircle size={56} className="text-green-500 mb-4" />
        <h1 className="text-xl font-bold text-[#1a1a1a] mb-2">註冊成功！</h1>
        <p className="text-sm text-[#666] text-center mb-6">
          你已獲得 <span className="font-bold text-[#c9a84c]">7 日免費試用</span><br />
          試用期內可無限使用所有測評功能
        </p>
        <div className="card w-full max-w-xs text-left space-y-2 mb-6">
          <p className="text-sm"><span className="text-[#999]">公司：</span>{companyName}</p>
          <p className="text-sm"><span className="text-[#999]">微信：</span>{wechatId}</p>
          <p className="text-sm"><span className="text-[#999]">試用到期：</span>{new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString("zh-HK")}</p>
        </div>
        <p className="text-xs text-[#999] mb-6">
          試用期結束後，請加微信 <span className="font-bold text-[#c9a84c]">859022196</span> 續費
        </p>
        <button
          onClick={() => window.location.href = "/"}
          className="flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-[#c9a84c] to-[#b89430] text-white font-bold"
        >
          開始使用 <ArrowRight size={18} />
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-6">
      <Building2 size={48} className="text-[#c9a84c] mb-4" />
      <h1 className="text-xl font-bold text-[#1a1a1a] mb-1">B2B 合作註冊</h1>
      <p className="text-sm text-[#666] text-center mb-8">
        註冊即享 7 日免費試用，體驗全部測評功能
      </p>

      <div className="w-full max-w-xs space-y-4">
        <div>
          <label className="text-sm text-[#666] mb-1 block">公司/機構名稱</label>
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="例如：靜心心理咨詢中心"
            className="w-full px-4 py-3 rounded-xl border border-[#e8e8e8] outline-none focus:border-[#c9a84c]"
          />
        </div>
        <div>
          <label className="text-sm text-[#666] mb-1 block">微信號</label>
          <input
            type="text"
            value={wechatId}
            onChange={(e) => setWechatId(e.target.value)}
            placeholder="你的微信號"
            className="w-full px-4 py-3 rounded-xl border border-[#e8e8e8] outline-none focus:border-[#c9a84c]"
          />
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button
          onClick={handleRegister}
          disabled={loading}
          className="w-full py-3 rounded-full bg-gradient-to-r from-[#c9a84c] to-[#b89430] text-white font-bold disabled:opacity-50"
        >
          {loading ? "註冊中..." : "免費註冊 · 7 日試用"}
        </button>
      </div>

      <div className="mt-8 text-xs text-[#999] text-center space-y-1">
        <p>試用期內全功能開放</p>
        <p>到期後請加微信 859022196 續費</p>
      </div>
    </div>
  );
}
