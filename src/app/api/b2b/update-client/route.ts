import { NextResponse } from "next/server";
import { updateB2BClient } from "@/lib/b2b-db";

/**
 * POST /api/b2b/update-client
 * 後台：人手更新客戶狀態（開通/停用/續費）
 */
export async function POST(request: Request) {
  try {
    const { clientId, updates } = await request.json();

    if (!clientId || !updates) {
      return NextResponse.json({ error: "缺少參數" }, { status: 400 });
    }

    const client = updateB2BClient(clientId, updates);
    if (!client) {
      return NextResponse.json({ error: "客戶不存在" }, { status: 404 });
    }

    return NextResponse.json({ success: true, client });
  } catch (error) {
    return NextResponse.json({ error: "更新失敗" }, { status: 500 });
  }
}
