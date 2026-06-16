"use client";

import { useState, useEffect } from "react";
import {
  Clock,
  CheckCircle2,
  XCircle,
  Package,
  ArrowLeft,
  Crown,
} from "lucide-react";
import Link from "next/link";

interface Order {
  id: string;
  plan: string;
  amount: number;
  status: "pending" | "paid" | "rejected" | "expired";
  paymentMethod: string;
  note: string;
  createdAt: string;
  paidAt?: string;
  rejectReason?: string;
}

const STATUS_CONFIG = {
  pending: {
    icon: Clock,
    label: "待确认",
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/20",
  },
  paid: {
    icon: CheckCircle2,
    label: "已激活",
    color: "text-green-400",
    bg: "bg-green-500/10",
    border: "border-green-500/20",
  },
  rejected: {
    icon: XCircle,
    label: "已拒绝",
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
  },
  expired: {
    icon: XCircle,
    label: "已过期",
    color: "text-gray-400",
    bg: "bg-gray-500/10",
    border: "border-gray-500/20",
  },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      // 从 localStorage 获取用户ID
      const userStr = localStorage.getItem("yixu-user");
      let userId = "anonymous";
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          userId = user.id || "anonymous";
        } catch {}
      }

      // 调用 API 获取所有订单，前端过滤
      const res = await fetch("/api/orders/list");
      const data = await res.json();
      if (data.success) {
        setOrders(data.data.filter((o: Order) => o.userId === userId));
      }
    } catch {
      // ignore
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a1628] flex items-center justify-center">
        <Clock className="w-8 h-8 text-[#c9a84c] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a1628] via-[#1a2744] to-[#0a1628] text-white px-4 py-6">
      <div className="max-w-md mx-auto">
        <Link
          href="/profile"
          className="inline-flex items-center gap-1 text-sm text-gray-400 mb-4 hover:text-[#c9a84c]"
        >
          <ArrowLeft className="w-4 h-4" />
          返回
        </Link>

        <h1 className="text-xl font-bold mb-2 flex items-center gap-2">
          <Package className="w-5 h-5 text-[#c9a84c]" />
          我的订单
        </h1>
        <p className="text-sm text-gray-400 mb-6">共 {orders.length} 个订单</p>

        {/* 订单列表 */}
        {orders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 mx-auto mb-3 text-gray-600" />
            <p className="text-gray-400">暂无订单</p>
            <Link
              href="/membership"
              className="inline-flex items-center gap-1 mt-4 px-4 py-2 rounded-xl bg-[#c9a84c] text-[#0a1628] font-medium text-sm"
            >
              <Crown className="w-4 h-4" />
              去开通VIP
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => {
              const config = STATUS_CONFIG[order.status];
              const Icon = config.icon;

              return (
                <div
                  key={order.id}
                  className={`p-4 rounded-xl border ${config.bg} ${config.border}`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className={`flex items-center gap-1.5 text-sm font-bold ${config.color}`}>
                        <Icon className="w-4 h-4" />
                        {config.label}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5 font-mono">
                        #{order.id.slice(0, 12)}...
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-white">
                        ¥{order.amount}
                      </div>
                      <div className="text-xs text-gray-400">
                        {order.plan === "month" ? "月卡" : "年卡"}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1 text-xs text-gray-400">
                    <div>下单时间：{new Date(order.createdAt).toLocaleString("zh-CN")}</div>
                    {order.paidAt && (
                      <div className="text-green-400">
                        激活时间：{new Date(order.paidAt).toLocaleString("zh-CN")}
                      </div>
                    )}
                    {order.note && (
                      <div>备注：{order.note}</div>
                    )}
                    {order.rejectReason && (
                      <div className="text-red-300 mt-2 p-2 bg-red-500/10 rounded-lg">
                        原因：{order.rejectReason}
                      </div>
                    )}
                  </div>

                  {order.status === "pending" && (
                    <Link
                      href="/membership"
                      className="mt-3 block text-center py-2 rounded-lg bg-yellow-500/20 text-yellow-300 text-xs font-medium hover:bg-yellow-500/30 transition-all"
                    >
                      查看付款码 →
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* 底部操作 */}
        {orders.length > 0 && (
          <Link
            href="/membership"
            className="mt-6 flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#c9a84c]/10 border border-[#c9a84c]/30 text-[#c9a84c] font-medium text-sm hover:bg-[#c9a84c]/20 transition-all"
          >
            <Crown className="w-4 h-4" />
            续费或开通VIP
          </Link>
        )}
      </div>
    </div>
  );
}
