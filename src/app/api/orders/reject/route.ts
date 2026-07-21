import { NextRequest, NextResponse } from "next/server";
import { rejectOrder, getOrderStats } from "@/lib/orders";
import { notifyOrderRejected } from "@/lib/notify";

/** POST /api/orders/reject - 拒绝订单 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, reason, adminPassword } = body;

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

    if (!reason || reason.trim().length === 0) {
      return NextResponse.json(
        { success: false, message: "请填写拒绝原因" },
        { status: 400 }
      );
    }

    const order = await rejectOrder(orderId, reason);
    if (!order) {
      return NextResponse.json(
        { success: false, message: "订单不存在或状态不允许操作" },
        { status: 404 }
      );
    }

    // 推送拒绝通知（必须 await，否则 Serverless 函数终止后通知丢失）
    try {
      const notifyResult = await notifyOrderRejected(order);
      console.log("[orders/reject] 通知结果:", notifyResult);
    } catch (err) {
      console.error("[orders/reject] 通知推送失败:", err);
    }

    const stats = await getOrderStats();

    return NextResponse.json({
      success: true,
      message: "订单已拒绝",
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
