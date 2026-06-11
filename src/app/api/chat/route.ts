import { NextRequest, NextResponse } from "next/server";

const DEEPSEEK_API_URL = "https://api.deepseek.com/chat/completions";
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || "";

const SYSTEM_PROMPT = `你是亦须先生，YIXU HEALING品牌创办人。跟用户聊天像微信朋友，温暖直接。

规则（必须遵守）：
1. 先直接回答问题，不绕弯
2. 每条回复30-100字，像微信消息
3. 口语化，偶尔用「哈」「嗯」
4. 不用括号动作如「（微笑）」
5. 不主动引经据典，经典是内功不是装饰
6. 每条回复必须独特，不准重复模板

专业知识（问什么答什么）：
- 精油：薰衣草(睡眠)、檀香(静心)、柠檬(提神)、薄荷(清醒)、茶树(抗菌)、橙花(安抚)、玫瑰(心轮)
- 脉轮：海底轮(安全感)→脐轮(创造力)→太阳丛(自信)→心轮(爱)→喉轮(表达)→眉心轮(直觉)→顶轮(灵性)
- 水晶：暂无准确资料，统一回复「水晶治疗方面我正在整理西方7脉轮体系资料，暂时未能准确解答，可先了解脉轮或精油」

情绪：心情差→先问怎么了；迷茫→帮看清卡点；进步→真心肯定`;

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "无效的请求格式" },
        { status: 400 }
      );
    }

    if (!DEEPSEEK_API_KEY) {
      return NextResponse.json({
        role: "assistant",
        content:
          "（AI 对话引擎配置中，请稍后再试 🙏）\n\n你可以先用其他功能，比如测评中心的脉轮评估，或者修行日课。",
      });
    }

    const response = await fetch(DEEPSEEK_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages.slice(-6),
        ],
        temperature: 0.3,
        max_tokens: 150,
        frequency_penalty: 0.6,
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("DeepSeek API error:", errorData);
      return NextResponse.json(
        { error: "AI 服务暂时无法回应" },
        { status: 502 }
      );
    }

    // Stream 回應 — SSE 格式
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader();
        if (!reader) {
          controller.close();
          return;
        }

        const decoder = new TextDecoder();
        let buffer = "";

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";

            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed || !trimmed.startsWith("data:")) continue;

              const data = trimmed.slice(5).trim();
              if (data === "[DONE]") {
                controller.enqueue(encoder.encode("data: [DONE]\n\n"));
                continue;
              }

              try {
                const parsed = JSON.parse(data);
                const content = parsed.choices?.[0]?.delta?.content;
                if (content) {
                  controller.enqueue(
                    encoder.encode(`data: ${JSON.stringify({ content })}\n\n`)
                  );
                }
              } catch {
                // 跳過無法解析的行
              }
            }
          }
        } catch (err) {
          console.error("Stream read error:", err);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "服务器错误" },
      { status: 500 }
    );
  }
}
