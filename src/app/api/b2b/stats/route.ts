import { NextResponse } from "next/server";
import { getClientStats } from "@/lib/b2b-db";

/**
 * GET /api/b2b/stats?clientId=xxx
 * 查詢某客戶嘅測評統計
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get("clientId");

    if (!clientId) {
      return NextResponse.json({ error: "缺少 clientId" }, { status: 400 });
    }

    const stats = getClientStats(clientId);
    return NextResponse.json({ success: true, stats });
  } catch (error) {
    return NextResponse.json({ error: "查詢失敗" }, { status: 500 });
  }
}
