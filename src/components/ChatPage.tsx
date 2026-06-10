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

const WELCOME_MESSAGE: Message = {
  id: "welcome",
  role: "assistant",
  content:
    "你好，我是亦须AI 🙏\n\n修行路上，有什么困扰你？\n\n你可以随意问，我用传统经学及Sino-NLP，多维角度陪你聊。",
};

/* ── 智慧建議輪替：按時段動態切換 ── */
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
    // 週末加一條特別
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

  // 晚間 18-22
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

/* ── localStorage 工具函數 ── */
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
  if (typeof window === "undefined") return 900;
  try {
    const saved = localStorage.getItem(TIMER_STORAGE_KEY);
    if (!saved) return 900;
    const val = parseInt(saved, 10);
    return isNaN(val) ? 900 : Math.max(0, val);
  } catch {
    return 900;
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
  const [timerLeft, setTimerLeft] = useState(900);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [speechLang, setSpeechLang] = useState<"zh-CN" | "zh-HK">("zh-HK");
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false); // WhatsApp 式按住錄音
  const [recordingSupported, setRecordingSupported] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // TTS 朗讀（瀏覽器原生 SpeechSynthesis，$0）
  const speakMessage = useCallback((text: string, id: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();

    if (speakingId === id) {
      setSpeakingId(null);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = speechLang;
    utterance.rate = 0.95; // 稍慢，更適合療癒對話
    utterance.pitch = 1.0;

    // 揀一把好聽嘅聲
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(v => v.lang.startsWith("zh-HK") || v.lang.startsWith("zh-CN") || v.lang.startsWith("zh-TW"));
    if (preferred) utterance.voice = preferred;

    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);

    setSpeakingId(id);
    window.speechSynthesis.speak(utterance);
  }, [speakingId, speechLang]);

  // 預載 voices（Safari/Chrome 需要異步加載）
  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
  }, []);

  // MediaRecorder 支援檢測（WhatsApp 式錄音）
  useEffect(() => {
    if (typeof window !== "undefined" && navigator.mediaDevices && typeof navigator.mediaDevices.getUserMedia === "function") {
      setRecordingSupported(true);
    }
  }, []);

  // WhatsApp 式按住錄音邏輯
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
        // 如果 Web Speech 冇結果，用 Whisper fallback（此處暫留）
      };

      mediaRecorder.start();
      setIsRecording(true);

      // 同時啟動 Web Speech Recognition
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

    // 錄音結束後，如果有 recognition 結果，自動 send
    setTimeout(() => {
      const transcript = (recognitionRef.current as any)?._lastTranscript;
      if (transcript && transcript.trim()) {
        setInput(transcript);
        // 標記自動發送
        (window as any).__yixuAutoSend = transcript.trim();
      }
    }, 300);
  }, []);

  // 抽出 send 邏輯，方便 handleSend 同錄音 auto-send 共用
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
              ? { ...m, content: generateMockResponse(text.trim()) }
              : m
          )
        );
      }
    } catch {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === aiId
            ? { ...m, content: generateMockResponse(text.trim()) }
            : m
        )
      );
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading, timerLeft]);

  // 錄音自動 send effect（必須在 doSend 定義之後）
  useEffect(() => {
    const autoSend = (window as any).__yixuAutoSend;
    if (autoSend && input === autoSend && !isLoading && timerLeft > 0) {
      delete (window as any).__yixuAutoSend;
      setTimeout(() => {
        doSend(autoSend);
      }, 200);
    }
  }, [input, doSend, isLoading, timerLeft]);

  // 語音辨識初始化（雙語支援：粵語+普通話）
  useEffect(() => {
    if (typeof window === "undefined") return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      setSpeechSupported(true);
    }
  }, []);

  // 每次切換語言重建 recognition 實例
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
      recognition.continuous = true; // 改為 continuous 避免手機自動結束
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
        // 手機常見 error: aborted, network, not-allowed
        if (event.error === "not-allowed" || event.error === "service-not-allowed") {
          setSpeechSupported(false);
        }
        // aborted 係正常（用戶停止/切換），唔使禁用
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
      // 手機需要用戶手勢後先可以 start
      try {
        recognition.start();
        setIsListening(true);
      } catch (e: any) {
        console.log("Speech start failed:", e);
        // iOS 有時會報 already started，試 stop 再 start
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

  // 頁面載入時恢復計時器（不跳過 landing page）
  useEffect(() => {
    const savedTimer = loadTimerLeft();
    setTimerLeft(savedTimer);
  }, []);

  // 對話變化時自動保存
  useEffect(() => {
    if (messages.length > 0) {
      saveHistory(messages);
    }
  }, [messages]);

  // 計時器變化時保存
  useEffect(() => {
    if (started && timerLeft > 0) {
      saveTimerLeft(timerLeft);
    }
  }, [timerLeft, started]);

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
    return `${mins}:${secs.toString().padStart(2, "0")}`;
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
        <header className="sticky top-0 z-10 bg-white/95 backdrop-blur-md px-4 py-3 border-b border-[#e8e8e8]">
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
        <div className="flex-1 flex flex-col items-center justify-center px-6 pb-16">
          {/* Greeting */}
          <p className="text-sm text-[#c9a84c] font-medium mb-8 tracking-wide">
            {getGreeting()}
          </p>

          {/* Large Cartoon Avatar — casual shirt with iPad */}
          <div className="relative mb-10 flex justify-center">
            <div className="absolute w-48 h-80 mx-auto rounded-full bg-gradient-to-b from-[#fdf8ed]/80 via-[#fdf8ed]/40 to-transparent" />
            <img
              src="/cartoon-casual.png?v=4"
              alt="亦须先生全身像"
              className="relative w-44 h-auto object-contain mx-auto drop-shadow-xl"
              style={{ filter: "drop-shadow(0 8px 24px rgba(201,168,76,0.2))" }}
            />
          </div>

          {/* Tagline */}
          <h2 className="text-xl font-bold text-[#1a1a1a] font-song mb-2 text-center">
            修行路上，有我陪你
          </h2>
          <p className="text-sm text-[#666666] mb-10 text-center max-w-xs leading-relaxed">
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
          <p className="mt-6 text-sm text-[#999999]">
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
              <span>{timerLeft > 0 ? `今日剩余 ${formatTime(timerLeft)}` : "今日限额已用完"}</span>
            </div>
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

        {/* Smart Suggestions — 按時段動態 */}
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
        {/* 語言切換 + 錄音狀態 */}
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
