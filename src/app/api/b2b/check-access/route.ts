import { NextResponse } from "next/server";
import { checkFeatureAccess } from "@/lib/b2b-db";

/**
 * POST /api/b2b/check-access
 * 檢查 B 端客戶嘅功能權限
 */
export async function POST(request: Request) {
  try {
    const { clientId, feature } = await request.json();

    if (!clientId || !feature) {
      return NextResponse.json({ error: "缺少參數" }, { status: 400 });
    }

    const result = checkFeatureAccess(clientId, feature);

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: "檢查失敗" }, { status: 500 });
  }
}
