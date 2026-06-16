import { NextRequest, NextResponse } from "next/server";
import { getAllOrders } from "@/lib/orders";

/** GET /api/orders/list - 订单列表（后台用） */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") as any;
    const limit = parseInt(searchParams.get("limit") || "100", 10);

    const orders = getAllOrders({
      status: ["pending", "paid", "rejected", "expired"].includes(status)
        ? status
        : undefined,
      limit: limit || undefined,
    });

    return NextResponse.json({
      success: true,
      data: orders,
      count: orders.length,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "服务器错误" },
      { status: 500 }
    );
  }
}
