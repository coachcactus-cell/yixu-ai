import { NextResponse } from "next/server";
import { createB2BClient, getB2BClientByWechat } from "@/lib/b2b-db";

/**
 * POST /api/b2b/register
 * B 端客戶註冊（自動開通 7 日試用）
 */
export async function POST(request: Request) {
  try {
    const { wechatId, companyName } = await request.json();

    if (!wechatId || !companyName) {
      return NextResponse.json({ error: "請填寫微信號和公司名稱" }, { status: 400 });
    }

    // 檢查是否已註冊
    const existing = getB2BClientByWechat(wechatId);
    if (existing) {
      return NextResponse.json({
        success: true,
        client: existing,
        message: "你已註冊，以下是你的帳戶資訊",
      });
    }

    const client = createB2BClient({ wechatId, companyName });

    return NextResponse.json({
      success: true,
      client,
      message: "註冊成功！你已獲得 7 日免費試用",
    });
  } catch (error) {
    return NextResponse.json({ error: "註冊失敗" }, { status: 500 });
  }
}
