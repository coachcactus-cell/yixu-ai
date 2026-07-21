import { NextRequest, NextResponse } from "next/server";
import { listUsers } from "@/lib/users";

/**
 * GET /api/users/list
 * 后台「用户」Tab 拉取真实用户列表（与 /api/orders/list 同权限策略）。
 */
export async function GET(req: NextRequest) {
  try {
    const users = await listUsers();
    return NextResponse.json({
      success: true,
      users,
      total: users.length,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "服务器错误" },
      { status: 500 }
    );
  }
}
