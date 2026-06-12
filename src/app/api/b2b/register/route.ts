import { NextResponse } from "next/server";
import { createB2BClient, getB2BClientByWechat } from "@/lib/b2b-db";

/**
 * POST /api/b2b/register
 * B 端客戶註册（自动开通 7 日试用）
 */
export async function POST(request: Request) {
  try {
    const { wechatId, companyName } = await request.json();

    if (!wechatId || !companyName) {
      return NextResponse.json({ success: false, error: "请填写微信号和公司名稱" }, { status: 400 });
    }

    // 檢查是否已註册
    const existing = getB2BClientByWechat(wechatId);
    if (existing) {
      return NextResponse.json({
        success: true,
        isExisting: true,
        client: existing,
        message: "你已註册，以下是你的帳戶资讯",
      });
    }

    const client = createB2BClient({ wechatId, companyName });

    return NextResponse.json({
      success: true,
      isExisting: false,
      client,
      message: "註册成功！你已獲得 7 日免费试用",
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: "註册失敗" }, { status: 500 });
  }
}
