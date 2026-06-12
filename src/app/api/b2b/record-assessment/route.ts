import { NextResponse } from "next/server";
import { saveAssessmentRecord, getB2BClient } from "@/lib/b2b-db";

const VALID_TYPES = ["enneagram", "chakra", "yijing"];

/**
 * POST /api/b2b/record-assessment
 * 记录测评结果
 */
export async function POST(request: Request) {
  try {
    const { clientId, userId, type, result } = await request.json();

    if (!clientId || !userId || !type || result === undefined) {
      return NextResponse.json({ success: false, error: "缺少參数" }, { status: 400 });
    }

    if (!VALID_TYPES.includes(type)) {
      return NextResponse.json({ success: false, error: "无效的测评类型" }, { status: 400 });
    }

    // 验证客戶是否存在
    const client = getB2BClient(clientId);
    if (!client) {
      return NextResponse.json({ success: false, error: "客戶不存在" }, { status: 404 });
    }

    const record = saveAssessmentRecord({ clientId, userId, type, result });

    return NextResponse.json({ success: true, record });
  } catch (error) {
    return NextResponse.json({ success: false, error: "记录失敗" }, { status: 500 });
  }
}
