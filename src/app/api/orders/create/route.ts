import { NextRequest, NextResponse } from "next/server";
import { createOrder } from "@/lib/orders";

/** POST /api/orders/create - 创建订单 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, userName, userPhone, plan, paymentMethod, note } = body;

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

    const order = createOrder({
      userId,
      userName,
      userPhone,
      plan,
      paymentMethod,
      note: note || "",
    });

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
