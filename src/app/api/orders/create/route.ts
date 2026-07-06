import { NextRequest, NextResponse } from "next/server";
import { createOrder } from "@/lib/orders";
import { notifyOrderCreated } from "@/lib/notify";

/** POST /api/orders/create - 创建订单（含去重） */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, userName, userPhone, plan, paymentMethod, note, currency } = body;

    // 基本校验
    if (!userId || !userName || !plan || !paymentMethod) {
      return NextResponse.json(
        { success: false, message: "缺少必要参数" },
        { status: 400 }
      );
    }

    if (!["month", "year"].includes(plan)) {
      return NextResponse.json(
        { success: false, message: "无效的套餐类型" },
        { status: 400 }
      );
    }

    if (!["wechat", "alipay"].includes(paymentMethod)) {
      return NextResponse.json(
        { success: false, message: "无效的支付方式" },
        { status: 400 }
      );
    }

    const result = createOrder({
      userId,
      userName,
      userPhone,
      plan,
      paymentMethod,
      note: note || "",
      currency: currency === "HKD" ? "HKD" : "CNY",
    });

    if (!result.order) {
      return NextResponse.json(
        { success: false, message: result.error || "订单创建失败" },
        { status: 400 }
      );
    }

    const order = result.order;

    // 推送通知到 C 老大微信（必须 await，否则 Vercel Serverless 函数会在 response 返回后终止进程）
    try {
      const notifyResult = await notifyOrderCreated(order);
      console.log("[orders/create] 通知结果:", notifyResult);
    } catch (err) {
      console.error("[orders/create] 通知推送失败:", err);
      // 通知失败不影响订单创建
    }

    return NextResponse.json({
      success: true,
      message: "订单创建成功，请扫码付款后等待确认",
      data: order,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "服务器错误" },
      { status: 500 }
    );
  }
}
