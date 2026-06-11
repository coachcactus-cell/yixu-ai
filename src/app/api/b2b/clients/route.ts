import { NextResponse } from "next/server";
import { listB2BClients } from "@/lib/b2b-db";

/**
 * GET /api/b2b/clients
 * 後台：列出所有 B 端客戶
 */
export async function GET() {
  try {
    const clients = listB2BClients();
    return NextResponse.json({ success: true, clients });
  } catch (error) {
    return NextResponse.json({ error: "查詢失敗" }, { status: 500 });
  }
}
