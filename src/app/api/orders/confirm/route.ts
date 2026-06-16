import { NextRequest, NextResponse } from "next/server";
import { confirmOrder, getOrderStats } from "@/lib/orders";

/** POST /api/orders/confirm - 确认收款 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, adminPassword } = body;

    // 简单的后台密码验证
    if (adminPassword !== process.env.ADMIN_PASSWORD && adminPassword !== "yixu2026") {
      return NextResponse.json(
        { success: false, message: "后台密码错误" },
        { status: 403 }
      );
    }

    if (!orderId) {
      return NextResponse.json(
        { success: false, message: "缺少订单ID" },
        { status: 400 }
      );
    }

    const order = confirmOrder(orderId);
    if (!order) {
      return NextResponse.json(
        { success: false, message: "订单不存在或状态不允许操作" },
        { status: 404 }
      );
    }

    // 返回更新后的统计
    const stats = getOrderStats();

    return NextResponse.json({
      success: true,
      message: "订单已确认，VIP已激活",
      data: order,
      stats,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "服务器错误" },
      { status: 500 }
    );
  }
}
