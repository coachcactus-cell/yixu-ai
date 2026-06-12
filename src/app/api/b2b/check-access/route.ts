import { NextResponse } from "next/server";
import { checkFeatureAccess } from "@/lib/b2b-db";

const VALID_FEATURES = ["enneagram", "chakra", "yijing", "tarot"];

/**
 * POST /api/b2b/check-access
 * 檢查 B 端客戶的功能权限
 */
export async function POST(request: Request) {
  try {
    const { clientId, feature } = await request.json();

    if (!clientId || !feature) {
      return NextResponse.json({ success: false, allowed: false, error: "缺少參数" }, { status: 400 });
    }

    if (!VALID_FEATURES.includes(feature)) {
      return NextResponse.json({ success: false, allowed: false, error: "无效的功能名稱" }, { status: 400 });
    }

    const result = checkFeatureAccess(clientId, feature);

    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    return NextResponse.json({ success: false, allowed: false, error: "檢查失敗" }, { status: 500 });
  }
}
