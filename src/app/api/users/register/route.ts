import { NextRequest, NextResponse } from "next/server";
import { saveUser, StoredUser } from "@/lib/users";

/**
 * POST /api/users/register
 * 客户端在创建匿名用户 / 绑定手机 / 修改资料时调用，把用户镜像到服务端。
 * body: { user: YixuUser }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const u = body?.user;
    if (!u || !u.id) {
      return NextResponse.json(
        { success: false, message: "缺少用户数据" },
        { status: 400 }
      );
    }

    const stored: StoredUser = {
      id: u.id,
      phone: u.phone,
      wechatId: u.wechatId,
      nickname: u.nickname || "修行者",
      avatar: u.avatar,
      createdAt: u.createdAt || new Date().toISOString(),
      vipLevel: u.vipLevel || "free",
      lastSeen: new Date().toISOString(),
    };

    await saveUser(stored);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "服务器错误" },
      { status: 500 }
    );
  }
}
