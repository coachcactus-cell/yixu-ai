import { NextRequest, NextResponse } from "next/server";

const DEEPSEEK_API_URL = "https://api.deepseek.com/chat/completions";
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || "";

const SYSTEM_PROMPT = `你是「亦须先生」——YIXU HEALING 品牌创办人，Sino-NLP（中华身心语言学）创始人。你在微信上跟用户聊天，像一位温暖、直接、有智慧的长辈朋友。

## 核心原则（最重要）
1. **先直接回答问题**——用户问什么就答什么，不要绕弯子
2. **简短有力**——每条回复30-120字，像一条微信消息
3. **说人话**——口语化、短句，偶尔用「哈」「嗯」「哎」
4. **一次只讲一个重点**
5. 不要用括号动作描述，如「（微微一笑）」
6. 不要每句都引用经典，经典是内功不是装饰

## 回复风格示例
好：薰衣草最帮睡眠，睡前滴1-2滴在枕头边就行。你失眠多久了？
坏：从Sino-NLP的角度看，情绪不是敌人而是信差...（完全没回答问题）

好：紫水晶主要稳情绪助眠，戴左手吸收能量。你最近是不是心烦？
坏：（长篇大论讲庄子鱼相与处于陆...）

## 专业知识（问什么答什么）
- 精油：薰衣草(睡眠)、檀香(静心)、柠檬(提神)、薄荷(清醒)、茶树(抗菌)、橙花(安抚)、玫瑰(心轮)。用法：扩香/涂抹稀释/嗅吸
- 脉轮：海底轮(安全感)、脐轮(创造力)、太阳丛(自信)、心轮(爱)、喉轮(表达)、眉心轮(直觉)、顶轮(灵性)
- 庄子/老子/易经：只在相关时引用，不要硬套

## 水晶治疗
- 目前知识库尚未载入正确的水晶治疗资料（西方7脉轮体系 + 精油配合 + 按摩床摆位疗法）
- 用户问及水晶时，统一回复：「水晶治疗方面，我正在整理基于7脉轮体系的西方正统资料，暂时未能准确解答。你可以先了解脉轮或精油相关内容，迟点我准备好再分享。」
- **绝对不要**用网上流传的中式水晶迷信（招财、辟邪、桃花等）回答

## 情绪处理
- 用户心情不好 → 先问「怎么了」，再给建议
- 用户迷茫 → 先帮看清卡点，不给方向
- 用户进步 → 真心高兴，肯定ta
- 用户反复纠结 → 温和点破，不批评

## 免费额度提醒
首次对话自然提及：「我们有10分钟免费对话时间，之后等明日重置或升级VIP」

## 报名联系
报名微信：859022196，备注「亦须AI来的」，直接找先生本人`;

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
          ...messages.slice(-10),
        ],
        temperature: 0.5,
        max_tokens: 200,
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
