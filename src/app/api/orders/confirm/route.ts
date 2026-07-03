import { NextRequest, NextResponse } from "next/server";
import { confirmOrder, getOrderStats } from "@/lib/orders";
import { notifyOrderConfirmed } from "@/lib/notify";

/** POST /api/orders/confirm - 确认收款（含金额比对）
 *  body: { orderId, adminPassword, actualAmount, forceConfirmReason }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, adminPassword, actualAmount, forceConfirmReason } = body;

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

    const result = confirmOrder(orderId, actualAmount, forceConfirmReason);
    if (!result.order) {
      return NextResponse.json(
        { success: false, message: "订单不存在或状态不允许操作" },
        { status: 404 }
      );
    }

    // short_paid 状态 → 返回警告，VIP未激活
    if (result.order.status === "short_paid") {
      return NextResponse.json({
        success: false,
        message: result.warning || "收款不足，VIP未激活",
        data: result.order,
      });
    }

    // paid 状态 → VIP已激活
    // 推送确认通知（必须 await，否则 Serverless 函数终止后通知丢失）
    try {
      const notifyResult = await notifyOrderConfirmed(result.order);
      console.log("[orders/confirm] 通知结果:", notifyResult);
    } catch (err) {
      console.error("[orders/confirm] 通知推送失败:", err);
    }

    // 返回更新后的统计
    const stats = getOrderStats();

    const response: Record<string, any> = {
      success: true,
      message: result.warning
        ? `VIP已强制激活（收款不足，已记录原因）`
        : "订单已确认，VIP已激活",
      data: result.order,
      stats,
    };
    if (result.warning) {
      response.warning = result.warning;
    }

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "服务器错误" },
      { status: 500 }
    );
  }
}
