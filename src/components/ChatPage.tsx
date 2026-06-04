"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Clock, Sparkles, ArrowRight } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const WELCOME_MESSAGE: Message = {
  id: "welcome",
  role: "assistant",
  content:
    "你好，我是亦须AI 🙏\n\n修行路上，有什么困扰你？\n\n你可以随意问，我用传统经学及Sino-NLP，多维角度陪你聊。",
};

const SUGGESTIONS = [
  { icon: "💭", text: "我最近心好乱，怎么办？" },
  { icon: "🧘", text: "怎样可以放下执念？" },
  { icon: "🌿", text: "工作压力大，有什么方法？" },
  { icon: "❤️", text: "和家人关系紧张，怎么处理？" },
];

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 6) return "夜深了 🌙";
  if (hour < 12) return "早上好 ☀️";
  if (hour < 18) return "下午好 🌿";
  return "晚上好 ✨";
}

export default function ChatPage() {
  const [started, setStarted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [timerLeft, setTimerLeft] = useState(900);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Countdown timer
  useEffect(() => {
    if (!started || timerLeft <= 0) return;
    const interval = setInterval(() => {
      setTimerLeft((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [started, timerLeft]);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleStart = () => {
    setStarted(true);
    setMessages([WELCOME_MESSAGE]);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading || timerLeft <= 0) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await response.json();

      if (data.error) {
        const aiMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: generateMockResponse(input.trim()),
        };
        setMessages((prev) => [...prev, aiMsg]);
      } else {
        const aiMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.content,
        };
        setMessages((prev) => [...prev, aiMsg]);
      }
    } catch {
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: generateMockResponse(input.trim()),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (text: string) => {
    setInput(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // ─── LANDING SCREEN ────────────────────────────────
  if (!started) {
    return (
      <div className="flex flex-col h-screen bg-white">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-white/95 backdrop-blur-md px-4 py-3 border-b border-[#e8e8e8]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-[#c9a84c]/40 flex-shrink-0 bg-[#fdf8ed]">
                <img
                  src="/cartoon-head.png"
                  alt="亦须先生"
                  className="w-full h-full object-cover"
                  style={{ objectPosition: "50% 15%" }}
                />
              </div>
              <div>
                <h1 className="text-lg font-black font-song tracking-wide">
                  <span className="text-[#c9a84c]">亦须</span><span className="text-[#8a9bae]">AI</span>
                </h1>
                <p className="text-xs text-[#888888]">Cactus AI</p>
              </div>
            </div>
          </div>
        </header>

        {/* Landing Body */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 pb-16">
          {/* Greeting */}
          <p className="text-sm text-[#c9a84c] font-medium mb-8 tracking-wide">
            {getGreeting()}
          </p>

          {/* Large Cartoon Avatar — casual shirt with iPad */}
          <div className="relative mb-10">
            <div className="absolute inset-0 w-64 h-64 mx-auto rounded-full bg-gradient-to-b from-[#fdf8ed]/80 via-[#fdf8ed]/40 to-transparent" />
            <img
              src="/cartoon-casual.png"
              alt="亦须先生"
              className="relative w-56 h-56 object-contain mx-auto drop-shadow-xl"
              style={{ filter: "drop-shadow(0 8px 24px rgba(201,168,76,0.2))" }}
            />
          </div>

          {/* Tagline */}
          <h2 className="text-xl font-bold text-[#1a1a1a] font-song mb-2 text-center">
            修行路上，有我陪你
          </h2>
          <p className="text-sm text-[#888888] mb-10 text-center max-w-xs leading-relaxed">
            传统经学 × Sino-NLP<br />多维角度，聊聊你的困扰
          </p>

          {/* CTA Button */}
          <button
            onClick={handleStart}
            className="flex items-center gap-2 px-10 py-3.5 rounded-full bg-gradient-to-r from-[#c9a84c] to-[#b89430] text-white font-bold text-base shadow-lg shadow-[#c9a84c]/25 active:scale-95 transition-transform"
          >
            开始对话
            <ArrowRight size={18} />
          </button>

          {/* Footer hint */}
          <p className="mt-6 text-xs text-[#cccccc]">
            点击上方按钮，开始与亦须先生对话
          </p>
        </div>
      </div>
    );
  }

  // ─── CHAT SCREEN ────────────────────────────────────
  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/95 backdrop-blur-md px-4 py-3 border-b border-[#e8e8e8]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-[#c9a84c]/40 flex-shrink-0 bg-[#fdf8ed]">
                <img
                  src="/cartoon-head.png"
                  alt="亦须先生"
                  className="w-full h-full object-cover"
                  style={{ objectPosition: "50% 15%" }}
                />
              </div>
            <div>
              <h1 className="text-lg font-black font-song tracking-wide">
                <span className="text-[#c9a84c]">亦须</span><span className="text-[#8a9bae]">AI</span>
              </h1>
              <p className="text-xs text-[#888888]">Sino-NLP 疗愈对话</p>
            </div>
          </div>
          <div className="timer-badge">
            <Clock size={14} />
            <span>{timerLeft > 0 ? `今日剩余 ${formatTime(timerLeft)}` : "今日限额已用完"}</span>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-fade-in-up`}
          >
            {msg.role === "assistant" && (
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#c9a84c] to-[#a88830] flex items-center justify-center mr-2 mt-1 flex-shrink-0">
                <Sparkles size={14} className="text-white" />
              </div>
            )}
            <div className={`chat-bubble ${msg.role === "user" ? "user" : "ai"}`}>
              <p className="whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-start animate-fade-in-up">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#c9a84c] to-[#a88830] flex items-center justify-center mr-2 mt-1 flex-shrink-0">
              <Sparkles size={14} className="text-white" />
            </div>
            <div className="chat-bubble ai">
              <div className="flex gap-1.5">
                <span className="typing-dot w-2 h-2 rounded-full bg-[#c9a84c] inline-block" />
                <span className="typing-dot w-2 h-2 rounded-full bg-[#c9a84c] inline-block" />
                <span className="typing-dot w-2 h-2 rounded-full bg-[#c9a84c] inline-block" />
              </div>
            </div>
          </div>
        )}

        {/* Suggestions */}
        {messages.length === 1 && (
          <div className="mt-4 space-y-2">
            <p className="text-xs text-[#999999] px-1 font-medium">试着问：</p>
            <div className="grid grid-cols-2 gap-2">
              {SUGGESTIONS.map((s, i) => (
                <button
                  key={i}
                  onClick={() => handleSuggestionClick(s.text)}
                  className="text-left px-3 py-3 rounded-xl bg-white border border-[#eeece8] hover:border-[#c9a84c] hover:bg-[#fdfaf2] transition-all active:scale-[0.98]"
                >
                  <span className="text-base">{s.icon}</span>
                  <p className="text-xs text-[#333333] mt-1 leading-snug font-medium">{s.text}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="sticky bottom-0 bg-white/95 backdrop-blur-md px-4 py-3 border-t border-[#e8e8e8]">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={timerLeft > 0 ? "说出你的困扰..." : "今日对话限额已用完"}
            disabled={timerLeft <= 0}
            className="chat-input flex-1"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading || timerLeft <= 0}
            className="w-11 h-11 rounded-full bg-gradient-to-br from-[#c9a84c] to-[#a88830] flex items-center justify-center disabled:opacity-40 transition-opacity flex-shrink-0"
          >
            <Send size={18} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Temporary mock response — will be replaced with real DeepSeek API
function generateMockResponse(input: string): string {
  const responses = [
    "你这个问题，让我想起庄子讲的一句话：「泉涸，鱼相与处于陆，相呴以湿，相濡以沫，不如相忘于江湖。」\n\n有时候我们越用力去抓住一些东西，越把自己困住。不如试着退一步，用「观照」的角度去看看你当下的状况。\n\n你可以试着做一个简单的练习：闭上眼，想象你的困扰是一片云，你只是看着它飘过，不需要抓住它，也不需要推开它。\n\n感觉怎么样？",
    "谢谢你愿意说出来 🙏\n\n从 Sino-NLP 的角度看，情绪不是敌人，而是信差。你现在感受到的，是内心深处有些东西想要告诉你。\n\n我建议你先做几下深呼吸，然后问自己三个问题：\n1. 这个感觉，身体哪个位置最强烈？\n2. 如果这个感觉可以说话，它想告诉我什么？\n3. 我需要什么，才能放松一些？\n\n慢慢来，不用急。",
    "明白你的感受。\n\n儒家讲「修身齐家」，但修身之前，要先「诚意正心」。你现在的困扰，可能是内心有些东西还没诚实面对。\n\n我邀请你做一个小练习：找个安静的地方，写下你真正怕的是什么。不用修饰，直接写。写完之后，看着你写的东西，问自己：「这是事实，还是我的想象？」\n\n很多时候，我们害怕的东西，写出来之后就没那么可怕了。",
  ];
  return responses[Math.floor(Math.random() * responses.length)];
}
