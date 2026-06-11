import { NextResponse } from "next/server";
import { saveAssessmentRecord, getB2BClient } from "@/lib/b2b-db";

const VALID_TYPES = ["enneagram", "chakra", "yijing"];

/**
 * POST /api/b2b/record-assessment
 * 記錄測評結果
 */
export async function POST(request: Request) {
  try {
    const { clientId, userId, type, result } = await request.json();

    if (!clientId || !userId || !type || result === undefined) {
      return NextResponse.json({ success: false, error: "缺少參數" }, { status: 400 });
    }

    if (!VALID_TYPES.includes(type)) {
      return NextResponse.json({ success: false, error: "無效的測評類型" }, { status: 400 });
    }

    // 驗證客戶是否存在
    const client = getB2BClient(clientId);
    if (!client) {
      return NextResponse.json({ success: false, error: "客戶不存在" }, { status: 404 });
    }

    const record = saveAssessmentRecord({ clientId, userId, type, result });

    return NextResponse.json({ success: true, record });
  } catch (error) {
    return NextResponse.json({ success: false, error: "記錄失敗" }, { status: 500 });
  }
}
