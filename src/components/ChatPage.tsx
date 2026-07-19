"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Send, Clock, Sparkles, ArrowRight, Trash2, Volume2, VolumeX } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const STORAGE_KEY = "yixu-chat-history";
const MAX_HISTORY = 50;
const TIMER_STORAGE_KEY = "yixu-timer-left";
const MAX_DAILY_SECONDS = 600; // 10 分鐘每日免费
const DAILY_RESET_KEY = "yixu-last-reset-date";

const WELCOME_MESSAGE: Message = {
  id: "welcome",
  role: "assistant",
  content:
    "你好，我是亦须AI 🙏\n\n修行路上，有什么困扰你？\n\n我们有 10 分钟免费对话时间，之后要等明日重置，或者你升级 VIP。",
};

/* ── 智慧建议轮替：按时段动態切換 ── */
function getSmartSuggestions(): { icon: string; text: string }[] {
  const hour = new Date().getHours();
  const dayOfWeek = new Date().getDay(); // 0=日, 1-6

  // 深夜 22-6
  if (hour < 6) {
    return [
      { icon: "🌙", text: "睡不着，怎么办？" },
      { icon: "💫", text: "夜深人静，想聊聊吗？" },
      { icon: "😮‍💨", text: "怎样放下今天的烦恼？" },
      { icon: "🕯️", text: "如何让心安静下来？" },
    ];
  }

  // 早晨 6-12
  if (hour < 12) {
    const morningSuggestions = [
      { icon: "☀️", text: "今天想做什么修行？" },
      { icon: "🧘", text: "怎样开始一天的静心？" },
      { icon: "🌅", text: "早上醒来心很乱，怎么办？" },
      { icon: "✨", text: "今天该怎样调整自己的状态？" },
    ];
    // 週末加一条特別
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      morningSuggestions[3] = { icon: "🌿", text: "周末怎样真正休息充电？" };
    }
    return morningSuggestions;
  }

  // 下午 12-18
  if (hour < 18) {
    return [
      { icon: "💼", text: "工作中如何保持觉察？" },
      { icon: "🌊", text: "怎样在忙碌中修行？" },
      { icon: "😤", text: "和同事有摩擦，怎么化解？" },
      { icon: "🎯", text: "怎样在压力中保持从容？" },
    ];
  }

  // 晚间 18-22
  return [
    { icon: "🌆", text: "今天有什么放不下的？" },
    { icon: "💭", text: "怎样安顿情绪入睡？" },
    { icon: "❤️", text: "和家人关系紧张，怎么处理？" },
    { icon: "🧘", text: "怎样可以放下执念？" },
  ];
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 6) return "夜深了 🌙";
  if (hour < 12) return "早上好 ☀️";
  if (hour < 18) return "下午好 🌿";
  return "晚上好 ✨";
}

/* ── localStorage 工具函数 ── */
function loadHistory(): Message[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.slice(-MAX_HISTORY);
  } catch {
    return [];
  }
}

function saveHistory(messages: Message[]) {
  if (typeof window === "undefined") return;
  try {
    const toSave = messages.slice(-MAX_HISTORY);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch { /* quota exceeded, ignore */ }
}

function loadTimerLeft(): number {
  if (typeof window === "undefined") return MAX_DAILY_SECONDS;
  try {
    const today = new Date().toISOString().slice(0, 10);
    const lastReset = localStorage.getItem(DAILY_RESET_KEY);
    if (lastReset !== today) {
      // 新的一天，重置计时器
      localStorage.setItem(DAILY_RESET_KEY, today);
      localStorage.setItem(TIMER_STORAGE_KEY, String(MAX_DAILY_SECONDS));
      return MAX_DAILY_SECONDS;
    }
    const saved = localStorage.getItem(TIMER_STORAGE_KEY);
    if (!saved) return MAX_DAILY_SECONDS;
    const val = parseInt(saved, 10);
    return isNaN(val) ? MAX_DAILY_SECONDS : Math.max(0, val);
  } catch {
    return MAX_DAILY_SECONDS;
  }
}

function saveTimerLeft(seconds: number) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(TIMER_STORAGE_KEY, String(seconds));
  } catch { /* ignore */ }
}

export default function ChatPage() {
  const [started, setStarted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [timerLeft, setTimerLeft] = useState(MAX_DAILY_SECONDS);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [speechLang, setSpeechLang] = useState<"zh-CN" | "zh-HK">("zh-HK");
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false); // WhatsApp 式按住录音
  const [recordingSupported, setRecordingSupported] = useState(false);
  const [showGift, setShowGift] = useState(false);
  const [giftCard, setGiftCard] = useState<{ name: string; advice: string } | null>(null);
  const lastMsgTimeRef = useRef<number>(Date.now());
  const giftTimerRef = useRef<NodeJS.Timeout | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // TTS 朗读（瀏览器原生 SpeechSynthesis，$0）
  const speakMessage = useCallback((text: string, id: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();

    if (speakingId === id) {
      setSpeakingId(null);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = speechLang;
    utterance.rate = 0.95; // 稍慢，更适合疗愈对话
    utterance.pitch = 1.0;

    // 揀一把好听的声
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(v => v.lang.startsWith("zh-HK") || v.lang.startsWith("zh-CN") || v.lang.startsWith("zh-TW"));
    if (preferred) utterance.voice = preferred;

    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);

    setSpeakingId(id);
    window.speechSynthesis.speak(utterance);
  }, [speakingId, speechLang]);

  // 预载 voices（Safari/Chrome 需要異步加载）
  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
  }, []);

  // MediaRecorder 支援檢测（WhatsApp 式录音）
  useEffect(() => {
    if (typeof window !== "undefined" && navigator.mediaDevices && typeof navigator.mediaDevices.getUserMedia === "function") {
      setRecordingSupported(true);
    }
  }, []);

  // WhatsApp 式按住录音邏輯
  const startRecording = useCallback(async () => {
    if (!recordingSupported) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
          ? "audio/webm;codecs=opus"
          : "audio/webm",
      });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        // 停止所有音軌
        stream.getTracks().forEach((t) => t.stop());
        // 如果 Web Speech 没结果，用 Whisper fallback（此处暫留）
      };

      mediaRecorder.start();
      setIsRecording(true);

      // 同时启动 Web Speech Recognition
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
          setIsListening(true);
        } catch { /* recognition may already be started */ }
      }
    } catch (e) {
      console.log("Recording start failed:", e);
      setRecordingSupported(false);
    }
  }, [recordingSupported]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch { /* ignore */ }
    }
    setIsRecording(false);
    setIsListening(false);

    // 录音结束后，如果有 recognition 结果，自动 send
    setTimeout(() => {
      const transcript = (recognitionRef.current as any)?._lastTranscript;
      if (transcript && transcript.trim()) {
        setInput(transcript);
        // 标记自动发送
        (window as any).__yixuAutoSend = transcript.trim();
      }
    }, 300);
  }, []);

  // 抽出 send 邏輯，方便 handleSend 同录音 auto-send 共用
  const doSend = useCallback(async (text: string) => {
    if (!text.trim() || isLoading || timerLeft <= 0) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text.trim(),
    };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    const aiId = (Date.now() + 1).toString();
    setMessages((prev) => [...prev, { id: aiId, role: "assistant", content: "" }]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) throw new Error("API error");

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No stream");

      const decoder = new TextDecoder();
      let buffer = "";
      let fullContent = "";

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
          if (data === "[DONE]") continue;
          try {
            const parsed = JSON.parse(data);
            if (parsed.content) {
              fullContent += parsed.content;
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === aiId ? { ...m, content: fullContent } : m
                )
              );
            }
          } catch {}
        }
      }

      if (!fullContent) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === aiId
              ? { ...m, content: "抱歉，AI暂时未能回应，请稍后再试 🙏" }
              : m
          )
        );
      }
    } catch {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === aiId
            ? { ...m, content: "网络不太稳定，请稍后再试 🙏" }
            : m
        )
      );
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading, timerLeft]);

  // 录音自动 send effect（必须在 doSend 定義之后）
  useEffect(() => {
    const autoSend = (window as any).__yixuAutoSend;
    if (autoSend && input === autoSend && !isLoading && timerLeft > 0) {
      delete (window as any).__yixuAutoSend;
      setTimeout(() => {
        doSend(autoSend);
      }, 200);
    }
  }, [input, doSend, isLoading, timerLeft]);

  // 语音辨识初始化（双语支援：粵语+普通话）
  useEffect(() => {
    if (typeof window === "undefined") return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      setSpeechSupported(true);
    }
  }, []);

  // 每次切換语言重建 recognition 实例
  useEffect(() => {
    if (!speechSupported) return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechSupported(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = speechLang;
      recognition.interimResults = true;
      recognition.continuous = true; // 改为 continuous 避免手机自动结束
      recognition.maxAlternatives = 1;

      recognition.onresult = (event: any) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setInput(transcript);
        // Store latest transcript for auto-send on recording end
        (recognition as any)._lastTranscript = transcript;
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onerror = (event: any) => {
        console.log("Speech error:", event.error);
        setIsListening(false);
        // 手机常见 error: aborted, network, not-allowed
        if (event.error === "not-allowed" || event.error === "service-not-allowed") {
          setSpeechSupported(false);
        }
        // aborted 是正常（用戶停止/切換），不用禁用
      };

      recognitionRef.current = recognition;
    } catch {
      setSpeechSupported(false);
    }
  }, [speechLang, speechSupported]);

  const toggleListening = useCallback(() => {
    const recognition = recognitionRef.current;
    if (!recognition) {
      setSpeechSupported(false);
      return;
    }
    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      // 手机需要用戶手勢后先可以 start
      try {
        recognition.start();
        setIsListening(true);
      } catch (e: any) {
        console.log("Speech start failed:", e);
        // iOS 有时会报 already started，试 stop 再 start
        if (e.name === "InvalidStateError") {
          try {
            recognition.stop();
            setTimeout(() => {
              try {
                recognition.start();
                setIsListening(true);
              } catch {
                setSpeechSupported(false);
              }
            }, 100);
          } catch {
            setSpeechSupported(false);
          }
        } else {
          setSpeechSupported(false);
        }
      }
    }
  }, [isListening]);

  // 页面载入时恢復计时器（不跳过 landing page）
  useEffect(() => {
    const savedTimer = loadTimerLeft();
    setTimerLeft(savedTimer);
  }, []);

  // 对话变化时自动保存
  useEffect(() => {
    if (messages.length > 0) {
      saveHistory(messages);
    }
  }, [messages]);

  // 计时器变化时保存
  useEffect(() => {
    if (started && timerLeft > 0) {
      saveTimerLeft(timerLeft);
    }
  }, [timerLeft, started]);

  // Countdown timer — 每日重置
  useEffect(() => {
    if (!started || timerLeft <= 0) return;
    const interval = setInterval(() => {
      setTimerLeft((prev) => {
        const next = Math.max(0, prev - 1);
        saveTimerLeft(next);
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [started, timerLeft]);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    // 每次有新消息，重设 dead air 计时器
    lastMsgTimeRef.current = Date.now();
    if (giftTimerRef.current) clearTimeout(giftTimerRef.current);
    giftTimerRef.current = setTimeout(() => {
      // 90 秒无新消息 → 送塔羅牌
      const cards = [
        { name: "初心", advice: "保持初心，不忘来时路。" },
        { name: "突破", advice: "勇敢踏出舒适圈，突破就在当下。" },
        { name: "放下", advice: "放下執念，才能看见新的可能。" },
        { name: "观照", advice: "不评判、不跟随，只是观照。" },
        { name: "從容", advice: "事緩则圓，人緩则安。" },
        { name: "守中", advice: "居中守正，不偏不倚。" },
      ];
      setGiftCard(cards[Math.floor(Math.random() * cards.length)]);
      setShowGift(true);
    }, 90000);
    return () => {
      if (giftTimerRef.current) clearTimeout(giftTimerRef.current);
    };
  }, [messages]);

  const handleStart = useCallback(() => {
    setStarted(true);
    const history = loadHistory();
    if (history.length > 0) {
      setMessages(history);
    } else {
      setMessages([WELCOME_MESSAGE]);
    }
  }, []);

  const clearHistory = useCallback(() => {
    setMessages([WELCOME_MESSAGE]);
    saveHistory([WELCOME_MESSAGE]);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins} 分 ${secs.toString().padStart(2, "0")} 秒`;
  };

  const handleSend = () => {
    doSend(input);
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

  const smartSuggestions = getSmartSuggestions();

  // ─── LANDING SCREEN ────────────────────────────────
  if (!started) {
    return (
      <div className="flex flex-col h-screen bg-white">
        {/* Header */}
        <header className="sticky-header bg-white/95 backdrop-blur-md px-4 py-3 border-b border-[#e8e8e8]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-[#c9a84c]/40 flex-shrink-0 bg-[#fdf8ed]">
                <img
                  src="/app-avatar.png"
                  alt="亦须先生"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h1 className="text-lg font-black font-song tracking-wide">
                  <span className="text-[#c9a84c]">亦须</span><span className="text-[#8a9bae]">AI</span>
                </h1>
                <p className="text-sm text-[#666666]">Cactus AI</p>
              </div>
            </div>
          </div>
        </header>

        {/* Landing Body */}
        <div className="flex-1 flex flex-col items-center px-6 pb-40 content-below-header overflow-y-auto">
          {/* Greeting */}
          <p className="text-sm text-[#c9a84c] font-medium mt-4 mb-4 tracking-wide shrink-0">
            {getGreeting()}
          </p>

          {/* Large Cartoon Avatar — casual shirt with iPad */}
          <div className="flex-1 flex items-center justify-center min-h-0 w-full max-w-[240px] py-2">
            <img
              src="/cartoon-casual.png?v=4"
              alt="亦须先生全身像"
              className="w-full h-auto max-h-[42vh] object-contain drop-shadow-xl"
              style={{ filter: "drop-shadow(0 8px 24px rgba(201,168,76,0.2))" }}
            />
          </div>

          {/* Tagline */}
          <div className="text-center shrink-0 mb-6">
            <h2 className="text-xl font-bold text-[#1a1a1a] font-song mb-2 text-center">
              修行路上，有我陪你
            </h2>
            <p className="text-sm text-[#666666] text-center max-w-xs leading-relaxed">
              传统经学 × Sino-NLP<br />多维角度，聊聊你的困扰
            </p>
          </div>

          {/* CTA Button */}
          <button
            onClick={handleStart}
            className="shrink-0 flex items-center gap-2 px-10 py-3.5 rounded-full bg-gradient-to-r from-[#c9a84c] to-[#b89430] text-white font-bold text-base shadow-lg shadow-[#c9a84c]/25 active:scale-95 transition-transform mb-2"
          >
            开始对话
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  // ─── CHAT SCREEN ────────────────────────────────────
  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="sticky-header bg-white/95 backdrop-blur-md px-4 py-3 border-b border-[#e8e8e8]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-[#c9a84c]/40 flex-shrink-0 bg-[#fdf8ed]">
              <img
                src="/app-avatar.png"
                alt="亦须先生"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-lg font-black font-song tracking-wide">
                <span className="text-[#c9a84c]">亦须</span><span className="text-[#8a9bae]">AI</span>
              </h1>
              <p className="text-sm text-[#666666]">Sino-NLP 疗愈对话</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {messages.length > 1 && (
              <button
                onClick={clearHistory}
                className="w-7 h-7 rounded-full flex items-center justify-center text-[#999999] hover:text-[#666666] active:bg-[#f5f5f5] transition-colors"
                title="清除对话记录"
              >
                <Trash2 size={15} />
              </button>
            )}
            <div className="timer-badge">
              <Clock size={14} />
              <span>{timerLeft > 0 ? `今天剩余 ${formatTime(timerLeft)}` : "今天限额已用完"}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-4 content-below-header">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-fade-in-up`}
          >
            {msg.role === "assistant" && (
              <div className="w-7 h-7 rounded-full overflow-hidden border border-[#c9a84c]/30 mr-2 mt-1 flex-shrink-0 bg-[#fdf8ed]">
                <img
                  src="/app-avatar.png"
                  alt="亦须先生"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className={`chat-bubble ${msg.role === "user" ? "user" : "ai"}`}>
              <p className="whitespace-pre-wrap">{msg.content}</p>
              {msg.role === "assistant" && (
                <button
                  onClick={() => speakMessage(msg.content, msg.id)}
                  className={`mt-1.5 flex items-center gap-1 text-xs transition-colors ${
                    speakingId === msg.id
                      ? "text-[#c9a84c] font-medium"
                      : "text-[#999999] hover:text-[#c9a84c]"
                  }`}
                >
                  {speakingId === msg.id ? (
                    <>
                      <VolumeX size={13} />
                      停止朗读
                    </>
                  ) : (
                    <>
                      <Volume2 size={13} />
                      朗读
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-start animate-fade-in-up">
            <div className="w-7 h-7 rounded-full overflow-hidden border border-[#c9a84c]/30 mr-2 mt-1 flex-shrink-0 bg-[#fdf8ed]">
              <img
                src="/app-avatar.png"
                alt="亦须先生"
                className="w-full h-full object-cover"
              />
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

        {/* Smart Suggestions — 按时段动態 */}
        {messages.length === 1 && (
          <div className="mt-4 space-y-2">
            <p className="text-sm text-[#777777] px-1 font-medium">试着问：</p>
            <div className="grid grid-cols-2 gap-2">
              {smartSuggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => handleSuggestionClick(s.text)}
                  className="text-left px-3 py-3 rounded-xl bg-white border border-[#eeece8] hover:border-[#c9a84c] hover:bg-[#fdfaf2] transition-all active:scale-[0.98]"
                >
                  <span className="text-base">{s.icon}</span>
                  <p className="text-sm text-[#333333] mt-1 leading-snug font-medium">{s.text}</p>
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
            placeholder={timerLeft > 0 ? "说出你的困扰..." : "今天对话限额已用完"}
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
        {/* 语言切換 + 录音狀態 */}
      </div>

      {/* 90秒无对话送塔羅牌 */}
      {showGift && giftCard && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40" onClick={() => setShowGift(false)}>
          <div
            className="w-full max-w-md bg-white rounded-t-2xl p-6 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <div className="text-4xl mb-2">🙏</div>
              <h3 className="text-lg font-bold text-[#1a1a1a] mb-1">再见！送你一个小錦囊</h3>
              <p className="text-sm text-[#999] mb-4">亦须先生給你的小禮物</p>

              <div className="card mb-4">
                <div className="text-2xl mb-2">🃏</div>
                <h4 className="font-bold text-[#c9a84c] mb-1">{giftCard.name}</h4>
                <p className="text-sm text-[#333] leading-relaxed">{giftCard.advice}</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={async () => {
                    const canvas = document.createElement("canvas");
                    const ctx = canvas.getContext("2d");
                    if (ctx) {
                      canvas.width = 400;
                      canvas.height = 300;
                      ctx.fillStyle = "#fdf8ed";
                      ctx.fillRect(0, 0, 400, 300);
                      ctx.fillStyle = "#c9a84c";
                      ctx.font = "bold 24px serif";
                      ctx.textAlign = "center";
                      ctx.fillText(giftCard.name, 200, 140);
                      ctx.font = "14px sans-serif";
                      ctx.fillStyle = "#333";
                      ctx.fillText(giftCard.advice.slice(0, 30), 200, 180);
                      canvas.toBlob((blob) => {
                        if (blob) {
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement("a");
                          a.href = url;
                          a.download = `亦须AI_${giftCard.name}.png`;
                          a.click();
                          URL.revokeObjectURL(url);
                        }
                      });
                    }
                  }}
                  className="flex-1 py-2.5 rounded-xl border border-[#c9a84c] text-[#c9a84c] text-sm font-bold"
                >
                  保存图片
                </button>
                <button
                  onClick={() => setShowGift(false)}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#c9a84c] to-[#b89430] text-white text-sm font-bold"
                >
                  谢谢先生
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

