import { NextResponse } from "next/server";
import { updateB2BClient } from "@/lib/b2b-db";

const VALID_PLANS = ["trial", "basic", "pro"];
const VALID_STATUSES = ["active", "expired", "suspended"];

/**
 * POST /api/b2b/update-client
 * 後台：人手更新客戶狀態（開通/停用/續費）
 */
export async function POST(request: Request) {
  try {
    const { clientId, updates } = await request.json();

    if (!clientId || !updates || typeof updates !== "object") {
      return NextResponse.json({ success: false, error: "缺少參數" }, { status: 400 });
    }

    // 只允許這 4 個欄位
    const allowed = ["plan", "status", "subscriptionEnd", "features"] as const;
    const sanitized: Record<string, unknown> = {};
    for (const key of allowed) {
      if (key in updates) {
        sanitized[key] = updates[key];
      }
    }

    // 驗證具體值
    if (sanitized["plan"] && !VALID_PLANS.includes(sanitized["plan"] as string)) {
      return NextResponse.json({ success: false, error: "無效的方案類型" }, { status: 400 });
    }
    if (sanitized["status"] && !VALID_STATUSES.includes(sanitized["status"] as string)) {
      return NextResponse.json({ success: false, error: "無效的狀態" }, { status: 400 });
    }
    if (sanitized["subscriptionEnd"] !== undefined && typeof sanitized["subscriptionEnd"] !== "number") {
      return NextResponse.json({ success: false, error: "subscriptionEnd 必須為數字" }, { status: 400 });
    }
    if (sanitized["features"] && typeof sanitized["features"] !== "object") {
      return NextResponse.json({ success: false, error: "features 格式無效" }, { status: 400 });
    }

    const client = updateB2BClient(clientId, sanitized as any);
    if (!client) {
      return NextResponse.json({ success: false, error: "客戶不存在" }, { status: 404 });
    }

    return NextResponse.json({ success: true, client });
  } catch (error) {
    return NextResponse.json({ success: false, error: "更新失敗" }, { status: 500 });
  }
}
