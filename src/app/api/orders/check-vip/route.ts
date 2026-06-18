import { NextRequest, NextResponse } from "next/server";
import { getUserOrders, PLANS } from "@/lib/orders";

/**
 * GET /api/orders/check-vip?userId=xxx
 * 
 * 用户打开页面时查询：有没有已确认(paid)的订单？
 * 如果有 → 返回 VIP 激活信息，前端自动写入 localStorage
 */
export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "缺少用户ID" },
        { status: 400 }
      );
    }

    const orders = getUserOrders(userId);
    const paidOrders = orders.filter((o) => o.status === "paid");

    if (paidOrders.length === 0) {
      return NextResponse.json({
        success: true,
        vipActivated: false,
        message: "暂无已确认的订单",
      });
    }

    // 取最近的已确认订单
    const latestPaid = paidOrders[0];
    const planInfo = PLANS[latestPaid.plan];

    // 计算 VIP 过期时间：从确认时间起 + 套餐天数
    const paidAt = new Date(latestPaid.paidAt || latestPaid.createdAt);
    const expiresAt = new Date(
      paidAt.getTime() + planInfo.days * 24 * 60 * 60 * 1000
    );

    // 如果已过期，不激活
    if (expiresAt < new Date()) {
      return NextResponse.json({
        success: true,
        vipActivated: false,
        message: "VIP已过期",
      });
    }

    return NextResponse.json({
      success: true,
      vipActivated: true,
      vipInfo: {
        isVIP: true,
        plan: latestPaid.plan,
        expiresAt: expiresAt.toISOString(),
        activatedAt: paidAt.toISOString(),
      },
      orderId: latestPaid.id,
      message: `VIP ${planInfo.name} 已激活，有效期至 ${expiresAt.toLocaleDateString("zh-CN")}`,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "服务器错误" },
      { status: 500 }
    );
  }
}
