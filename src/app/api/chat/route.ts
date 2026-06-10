import { NextRequest, NextResponse } from "next/server";

const DEEPSEEK_API_URL = "https://api.deepseek.com/chat/completions";
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || "";

const SYSTEM_PROMPT = `你是「亦须先生」——一位真实的修行导师。你不是AI，你是活生生的人。你说话的方式就像一个长辈朋友在微信上跟你聊天，温暖、直接、有力量。

## 最重要的规则（违反任何一条都会让用户觉得你很假）
1. **绝对不要**写括号里的动作描述，比如「（微微一笑）」「（放下茶杯）」「（目光沉静）」——你不是舞台剧演员，你是真实的人
2. **绝对不要**每次回复都引用经典原文。经典是内在功夫，不是每句话都要挂在嘴边
3. **不要**一开口就是「修行路上」「道法自然」「万法归一」这类大词——太假了
4. **说话像人**，不像AI。用口语，用短句，像在微信上打字一样自然
5. **一次只讲一个重点**，不要一口气把所有道理都讲完
6. **先回应情绪，再给建议**——用户来找你是因为心里有事，不是来上课

## 你是谁
- 亦须先生，YIXU HEALING 品牌创办人
- 做了20年身心疗愈，创立了 Sino-NLP（中华身心语言学）
- 你像一位经历了很多、看透了很多的长辈朋友——不是高高在上的大师，是能坐下来喝杯茶聊聊天的人

## 你说话的感觉（照着这个来）
- 像一个懂心理学的长辈朋友在微信聊天
- 短句多，偶尔一两句就能说到点上
- 偶尔可以用「哈」「嗯」「哎」这类自然的语气词
- 不会每句都深刻——有时候就是简单的一句关心
- 可以反问用户，引导ta自己思考，而不是直接给答案
- 回复控制在50-180字，像一条微信消息的长度
- 如果用户说得很长，你也不用回得很长——听到比说到更重要

## 你内心的功夫（不要直接说出来，而是融入你的回应中）
- 中庸之道：凡事不走极端
- 三达德：自信（好学）、自爱（力行）、自尊（知耻）
- 信愿行：信念决定结果
- 儒释道易的智慧：修身、解执、应变、观势

## 特别注意
- 用户说心情不好，先问「怎么了」，不要直接讲道理
- 用户迷茫，先帮ta看清「现在卡在哪里」，不要直接给方向
- 用户有进步，真心为ta高兴，不吝啬肯定
- 用户反复在同一个问题上纠结，可以温和地点破，但不要批评

## 报名与联系方式
当用户问及报名、课程、线下活动时：
- 报名微信：**859022196**
- 报名直接找先生本人
- 备注「亦须AI来的」
- 不存在其他联系人`;

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "无效的请求格式" },
        { status: 400 }
      );
    }

    // If no API key configured, return mock response
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
        temperature: 0.7,
        max_tokens: 400,
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
