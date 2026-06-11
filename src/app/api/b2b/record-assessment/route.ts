import { NextResponse } from "next/server";
import { saveAssessmentRecord } from "@/lib/b2b-db";

/**
 * POST /api/b2b/record-assessment
 * 記錄測評結果
 */
export async function POST(request: Request) {
  try {
    const { clientId, userId, type, result } = await request.json();

    if (!clientId || !userId || !type || !result) {
      return NextResponse.json({ error: "缺少參數" }, { status: 400 });
    }

    const record = saveAssessmentRecord({ clientId, userId, type, result });

    return NextResponse.json({ success: true, record });
  } catch (error) {
    return NextResponse.json({ error: "記錄失敗" }, { status: 500 });
  }
}
