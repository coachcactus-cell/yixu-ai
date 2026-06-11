import { NextResponse } from "next/server";

export async function GET() {
  const key = process.env.DEEPSEEK_API_KEY;
  return NextResponse.json({
    exists: !!key,
    length: key?.length || 0,
    prefix: key ? key.slice(0, 6) + "..." : "EMPTY",
    // 不返回完整 key
  });
}
