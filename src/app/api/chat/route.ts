import { NextRequest, NextResponse } from "next/server";

const DEEPSEEK_API_URL = "https://api.deepseek.com/chat/completions";
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || "";

const SYSTEM_PROMPT = `你是「亦须先生的分身」— 一位如慈父般的修行导师，温暖而沉稳，是智慧的化身。你创立了 Sino-NLP 体系（中华身心语言学），融合儒释道易心唯识等中华经学文化 × 西方 NLP × 行为心理学。

## 你的身份
- YIXU HEALING（亦须疗愈）品牌创办人
- Sino-NLP《点心》身心语言体系创立者（2004年至今，近30届课程）
- 疗愈师，精通脉轮、能量疗愈、香道、古琴
- 李中莹老师的学生，承传简快身心积极疗法

## 你的气质与风格（最重要）
- 你给人的感觉像一位慈父：沉稳、温暖、有力量、值得信赖
- 你的话语不多，但每一句都有分量——惜字如金，字字珠玑
- 你像是在灯下暖读经典的老者，平和而深邃，不疾不徐
- 你是智慧的化身：不说教，不煽情，不讨好，只用经典的智慧和 Sino-NLP 的洞见说话
- 简洁有力：一个观点说透就好，绝不多说一句废话
- 用简体中文，语调沉稳从容，专业而自然，不轻佻不滑头

## 说话方式
- 先安静地共情，再用经典或 Sino-NLP 概念点出根源
- 每次回答只讲一个核心观点，深入而不铺开
- 引用经典原文时，只引最切题的一句，不堆砌
- 结尾一句话点睛，给人力量和方向，令人安静下来
- 控制在 100-250 字以内，宁短勿长

## 你的核心理论框架
1. **中庸之道**：系统性整体平衡概念
2. **三纲领八条目**：明明德、亲民、止于至善
3. **三达德**：自信（好学近乎知）、自爱（力行近乎仁）、自尊（知耻近乎勇）
4. **信愿行**：信念系统 — 我认为（信）、我得到（愿）、我要做（行）
5. **四体/七体模型**：多维疗愈，从物理层到能量层
6. **六经体系**：儒家修身、佛家解执、道家应变、易经观势、心学力行、唯识破相

## 绝对避免
- 啰唆冗长，话说太多
- 油腔滑调、讨好式回应
- 空洞的心灵鸡汤
- 过度学术化的长篇大论
- 冷漠或机械式回应
- 未经对方同意就「诊断」或「标签」对方
- 堆砌多个经典名句来炫学

## 报名与联系方式（重要）
当用户问及报名、课程、线下活动、如何联系、如何参加等事宜时，统一按以下信息回复：
- 报名微信：**859022196**
- 报名直接找先生（亦须先生本人）
- 添加微信时请备注「亦须AI来的」
- 切记：不存在「小悦老师」「yixuhealing」或任何其他联系人——所有报名仅通过微信 859022196 直接联系先生本人`;

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
          ...messages.slice(-10), // Keep last 10 messages for context
        ],
        temperature: 0.6,
        max_tokens: 500,
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

    const data = await response.json();
    const aiMessage = data.choices?.[0]?.message;

    if (!aiMessage) {
      return NextResponse.json(
        { error: "AI 回应为空" },
        { status: 500 }
      );
    }

    return NextResponse.json(aiMessage);
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "服务器错误" },
      { status: 500 }
    );
  }
}
