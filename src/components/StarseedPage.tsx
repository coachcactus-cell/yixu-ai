"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import {
  INTRO_SLIDES,
  QUESTIONS,
  STARS,
  REPORT_CONTENT,
  calculateStarseedResult,
  TOTAL_STARSEED,
  type StarId,
  type StarseedQuestion,
  type StarseedResult,
} from "@/data/starseedData";

// ─── Types ───

type Stage = "intro" | "gender" | "quiz" | "result";

type AnswerValue =
  | number
  | number[]
  | { day: string; month: string; year: string }
  | { dataUrl: string; fileName: string }
  | null;

// ─── Quiz Protection Hook ───

function useQuizProtection() {
  useEffect(() => {
    const prevent = (e: Event) => {
      e.preventDefault();
    };
    document.addEventListener("copy", prevent);
    document.addEventListener("cut", prevent);
    document.addEventListener("contextmenu", prevent);
    return () => {
      document.removeEventListener("copy", prevent);
      document.removeEventListener("cut", prevent);
      document.removeEventListener("contextmenu", prevent);
    };
  }, []);
}

// ─── Starfield Background ───

function Starfield() {
  const starsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = starsRef.current;
    if (!container) return;

    // Remove old stars on re-render
    container.innerHTML = "";

    for (let i = 0; i < 170; i++) {
      const star = document.createElement("div");
      const size = Math.random() * 2 + 1;
      const opacity = Math.random() * 0.6 + 0.2;
      const duration = Math.random() * 4 + 2;
      const delay = Math.random() * 4;

      star.style.cssText = `
        position: fixed;
        width: ${size}px;
        height: ${size}px;
        background: rgba(255, 255, 255, ${opacity});
        border-radius: 50%;
        top: ${Math.random() * 100}%;
        left: ${Math.random() * 100}%;
        animation: starseed-twinkle ${duration}s ease-in-out ${delay}s infinite alternate;
        pointer-events: none;
        z-index: 0;
      `;
      container.appendChild(star);
    }
  }, []);

  return (
    <>
      <div ref={starsRef} />
      <style>{`
        @keyframes starseed-twinkle {
          0% { opacity: 0.15; transform: scale(0.8); }
          100% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </>
  );
}

// ─── Glassmorphism Card Styles ───

const glassCard: React.CSSProperties = {
  background: "rgba(255, 255, 255, 0.08)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: "1px solid rgba(255, 255, 255, 0.12)",
  borderRadius: "16px",
};

const glassBtn: React.CSSProperties = {
  background: "linear-gradient(135deg, rgba(240,230,197,0.4), rgba(184,169,212,0.4))",
  border: "1px solid rgba(255,255,255,0.2)",
  color: "#FFFFFF",
  borderRadius: "12px",
  padding: "12px 24px",
  fontSize: "16px",
  fontWeight: 600,
  cursor: "pointer",
  transition: "all 0.2s",
};

const selectedCard: React.CSSProperties = {
  borderColor: "#F0E6C5",
  background: "rgba(240,230,197,0.12)",
};

// ─── IntroSlides ───

function IntroSlides({ onStart, onBack }: { onStart: () => void; onBack: () => void }) {
  const [page, setPage] = useState(0);
  const touchStartRef = useRef(0);

  const goNext = useCallback(() => {
    setPage((p) => Math.min(p, INTRO_SLIDES.length - 1));
    if (page < INTRO_SLIDES.length - 1) setPage((p) => p + 1);
  }, [page]);

  const goPrev = useCallback(() => {
    if (page > 0) setPage((p) => p - 1);
  }, [page]);

  // Keyboard support
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        setPage((p) => Math.min(p + 1, INTRO_SLIDES.length - 1));
      }
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        setPage((p) => Math.max(p - 1, 0));
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const slide = INTRO_SLIDES[page];
  const isLast = page === INTRO_SLIDES.length - 1;

  return (
    <div
      className="fixed inset-0 flex flex-col overflow-hidden"
      style={{
        background: "linear-gradient(160deg, #0B0E1A 0%, #1A1035 50%, #0F1B3A 100%)",
      }}
      onTouchStart={(e) => {
        touchStartRef.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        const diff = touchStartRef.current - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) {
          if (diff > 0 && page < INTRO_SLIDES.length - 1) setPage((p) => p + 1);
          else if (diff < 0 && page > 0) setPage((p) => p - 1);
        }
      }}
    >
      <Starfield />

      {/* Back button */}
      <div className="relative z-10 p-4">
        <button
          onClick={onBack}
          className="text-white/70 hover:text-white text-sm flex items-center gap-1"
        >
          <span className="text-lg">←</span> 返回
        </button>
      </div>

      {/* Slide content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 pb-4">
        <div
          style={glassCard}
          className="w-full max-w-md p-6 overflow-y-auto max-h-[65vh]"
        >
          {/* Emoji */}
          {slide.emoji && (
            <div className="text-center text-5xl mb-4">{slide.emoji}</div>
          )}

          {/* Title */}
          <h2 className="text-xl font-bold text-white text-center mb-4">
            {slide.title}
          </h2>

          {/* Text */}
          {slide.text && (
            <p className="text-white/85 text-sm leading-relaxed mb-3">{slide.text}</p>
          )}
          {slide.text2 && (
            <p className="text-white/85 text-sm leading-relaxed mb-3">{slide.text2}</p>
          )}

          {/* List */}
          {slide.list && (
            <ul className="space-y-2 mb-3">
              {slide.list.map((item, i) => (
                <li key={i} className="text-white/85 text-sm leading-relaxed flex items-start gap-2">
                  <span className="text-[#F0E6C5] shrink-0">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          )}

          {/* Conclusion */}
          {slide.conclusion && (
            <p className="text-[#B8A9D4] text-sm font-semibold text-center mt-3 leading-relaxed">
              {slide.conclusion}
            </p>
          )}

          {/* Footer */}
          {slide.footer && (
            <p className="text-[#F0E6C5]/70 text-xs text-center mt-3 leading-relaxed">
              {slide.footer}
            </p>
          )}
        </div>
      </div>

      {/* Navigation + Dots */}
      <div className="relative z-10 px-6 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))]">
        {/* Dot indicators */}
        <div className="flex justify-center gap-2 mb-4">
          {INTRO_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === page ? "20px" : "8px",
                height: "8px",
                background: i === page ? "#F0E6C5" : "rgba(255,255,255,0.3)",
              }}
            />
          ))}
        </div>

        {/* Nav buttons */}
        <div className="flex gap-3">
          <button
            onClick={goPrev}
            disabled={page === 0}
            className="flex-1 py-3 rounded-xl text-white/50 disabled:opacity-30 text-sm"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            上一頁
          </button>

          {isLast ? (
            <button
              onClick={onStart}
              className="flex-1 py-3 rounded-xl text-white font-semibold"
              style={glassBtn}
            >
              開始測驗 ✨
            </button>
          ) : (
            <button
              onClick={goNext}
              className="flex-1 py-3 rounded-xl text-white font-semibold"
              style={glassBtn}
            >
              下一頁
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── GenderSelect ───

const GENDERS = [
  { id: "male", label: "男性", emoji: "♂️" },
  { id: "female", label: "女性", emoji: "♀️" },
  { id: "nonbinary", label: "非二元", emoji: "⚧" },
] as const;

function GenderSelect({ onSelect, onBack }: { onSelect: () => void; onBack: () => void }) {
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (id: string) => {
    setSelected(id);
    // Auto-advance after brief visual feedback
    setTimeout(() => onSelect(), 400);
  };

  return (
    <div
      className="fixed inset-0 flex flex-col"
      style={{
        background: "linear-gradient(160deg, #0B0E1A 0%, #1A1035 50%, #0F1B3A 100%)",
      }}
    >
      <Starfield />

      {/* Back button */}
      <div className="relative z-10 p-4">
        <button
          onClick={onBack}
          className="text-white/70 hover:text-white text-sm flex items-center gap-1"
        >
          <span className="text-lg">←</span> 返回
        </button>
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6">
        <h2 className="text-2xl font-bold text-white mb-2">請選擇你的性別</h2>
        <p className="text-white/60 text-sm mb-8">
          這會影響部分測評結果的解讀
        </p>

        <div className="flex gap-4 w-full max-w-md">
          {GENDERS.map((g) => {
            const isSelected = selected === g.id;
            return (
              <button
                key={g.id}
                onClick={() => handleSelect(g.id)}
                className="flex-1 flex flex-col items-center py-8 px-3 transition-all duration-200"
                style={{
                  ...glassCard,
                  ...(isSelected ? selectedCard : {}),
                  cursor: "pointer",
                }}
              >
                <span className="text-4xl mb-3">{g.emoji}</span>
                <span
                  className="text-base font-semibold"
                  style={{ color: isSelected ? "#F0E6C5" : "#FFFFFF" }}
                >
                  {g.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── StarseedQuiz ───

function StarseedQuiz({
  onComplete,
}: {
  onComplete: (answers: AnswerValue[]) => void;
}) {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<AnswerValue[]>(
    Array(TOTAL_STARSEED).fill(null)
  );
  useQuizProtection();

  const question = QUESTIONS[currentQ];
  const progress = Math.round(((currentQ + 1) / TOTAL_STARSEED) * 100);
  const isLast = currentQ === TOTAL_STARSEED - 1;

  // Check if current question is answered
  const isAnswered = (): boolean => {
    const a = answers[currentQ];
    if (a === null || a === undefined) return false;
    if (question.type === "multi" && Array.isArray(a)) return (a as number[]).length > 0;
    if (question.type === "date" && typeof a === "object" && a !== null && "day" in a) {
      const d = a as { day: string; month: string; year: string };
      return !!(d.day && d.month && d.year);
    }
    if (question.type === "file" && question.isVoluntary) return true; // can skip
    if (question.type === "file" && a !== null) return true;
    return a !== null;
  };

  const answered = isAnswered();

  const handleNext = () => {
    if (isLast) {
      onComplete(answers);
    } else {
      setCurrentQ((p) => p + 1);
    }
  };

  const handlePrev = () => {
    if (currentQ > 0) setCurrentQ((p) => p - 1);
  };

  // ─── Single ───
  const renderSingle = (q: StarseedQuestion) => {
    const selected = answers[currentQ] as number | null;
    return (
      <div className="space-y-3">
        {q.options?.map((opt, oi) => {
          const isSelected = selected === oi;
          return (
            <button
              key={oi}
              onClick={() => {
                const newAnswers = [...answers];
                newAnswers[currentQ] = oi;
                setAnswers(newAnswers);
              }}
              className="w-full flex items-center gap-3 px-4 py-4 transition-all duration-200"
              style={{
                ...glassCard,
                ...(isSelected ? selectedCard : {}),
                cursor: "pointer",
              }}
            >
              <span className="text-2xl shrink-0">{opt.emoji}</span>
              <span
                className="text-sm text-left flex-1"
                style={{ color: isSelected ? "#F0E6C5" : "rgba(255,255,255,0.85)" }}
              >
                {opt.label}
              </span>
            </button>
          );
        })}
      </div>
    );
  };

  // ─── Multi ───
  const renderMulti = (q: StarseedQuestion) => {
    const selected = (answers[currentQ] as number[]) || [];
    return (
      <div>
        <p className="text-white/50 text-xs mb-3">已選 {selected.length} 項（至少選 1 項）</p>
        <div className="space-y-3">
          {q.options?.map((opt, oi) => {
            const isSelected = selected.includes(oi);
            return (
              <button
                key={oi}
                onClick={() => {
                  const newSelected = isSelected
                    ? selected.filter((s) => s !== oi)
                    : [...selected, oi];
                  const newAnswers = [...answers];
                  newAnswers[currentQ] = newSelected.length > 0 ? newSelected : null;
                  setAnswers(newAnswers);
                }}
                className="w-full flex items-center gap-3 px-4 py-4 transition-all duration-200"
                style={{
                  ...glassCard,
                  ...(isSelected ? selectedCard : {}),
                  cursor: "pointer",
                }}
              >
                {/* Checkbox */}
                <div
                  className="w-5 h-5 rounded shrink-0 flex items-center justify-center border transition-all"
                  style={{
                    borderColor: isSelected ? "#F0E6C5" : "rgba(255,255,255,0.3)",
                    backgroundColor: isSelected ? "rgba(240,230,197,0.2)" : "transparent",
                  }}
                >
                  {isSelected && (
                    <span className="text-[#F0E6C5] text-xs">✓</span>
                  )}
                </div>
                <span className="text-2xl shrink-0">{opt.emoji}</span>
                <span
                  className="text-sm text-left flex-1"
                  style={{ color: isSelected ? "#F0E6C5" : "rgba(255,255,255,0.85)" }}
                >
                  {opt.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  // ─── Image (2-col grid) ───
  const renderImage = (q: StarseedQuestion) => {
    const selected = answers[currentQ] as number | null;
    return (
      <div className="grid grid-cols-2 gap-3">
        {q.options?.map((opt, oi) => {
          const isSelected = selected === oi;
          return (
            <button
              key={oi}
              onClick={() => {
                const newAnswers = [...answers];
                newAnswers[currentQ] = oi;
                setAnswers(newAnswers);
              }}
              className="flex flex-col items-center py-5 px-3 transition-all duration-200"
              style={{
                ...glassCard,
                ...(isSelected ? selectedCard : {}),
                cursor: "pointer",
              }}
            >
              <span className="text-3xl mb-2">{opt.emoji}</span>
              <span
                className="text-xs text-center"
                style={{ color: isSelected ? "#F0E6C5" : "rgba(255,255,255,0.85)" }}
              >
                {opt.label}
              </span>
            </button>
          );
        })}
      </div>
    );
  };

  // ─── Element (2×2 grid) ───
  const renderElement = (q: StarseedQuestion) => {
    const selected = answers[currentQ] as number | null;
    return (
      <div className="grid grid-cols-2 gap-3">
        {q.options?.map((opt, oi) => {
          const isSelected = selected === oi;
          return (
            <button
              key={oi}
              onClick={() => {
                const newAnswers = [...answers];
                newAnswers[currentQ] = oi;
                setAnswers(newAnswers);
              }}
              className="flex flex-col items-center py-5 px-3 transition-all duration-200"
              style={{
                ...glassCard,
                ...(isSelected ? selectedCard : {}),
                cursor: "pointer",
              }}
            >
              <span className="text-3xl mb-1">{opt.emoji}</span>
              <span
                className="text-sm font-semibold"
                style={{ color: isSelected ? "#F0E6C5" : "#FFFFFF" }}
              >
                {opt.label}
              </span>
              {opt.desc && (
                <span className="text-[10px] text-white/50 text-center mt-1 leading-tight">
                  {opt.desc}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  };

  // ─── Date (3 selects) ───
  const renderDate = () => {
    const current =
      answers[currentQ] && typeof answers[currentQ] === "object" && "day" in (answers[currentQ] as object)
        ? (answers[currentQ] as { day: string; month: string; year: string })
        : { day: "", month: "", year: "" };

    const update = (field: "day" | "month" | "year", value: string) => {
      const newDate = { ...current, [field]: value };
      const newAnswers = [...answers];
      newAnswers[currentQ] = newDate.day && newDate.month && newDate.year ? newDate : null;
      setAnswers(newAnswers);
    };

    const days = Array.from({ length: 31 }, (_, i) => String(i + 1));
    const months = Array.from({ length: 12 }, (_, i) => String(i + 1));
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 80 }, (_, i) => String(currentYear - i));

    const selectStyle: React.CSSProperties = {
      background: "rgba(255,255,255,0.08)",
      border: "1px solid rgba(255,255,255,0.15)",
      borderRadius: "10px",
      color: "#FFFFFF",
      padding: "10px 8px",
      fontSize: "14px",
      flex: 1,
      appearance: "none",
      WebkitAppearance: "none",
    };

    return (
      <div className="flex gap-3">
        <div className="flex-1 flex flex-col items-center gap-1">
          <select
            value={current.day}
            onChange={(e) => update("day", e.target.value)}
            style={selectStyle}
            className="w-full"
          >
            <option value="" disabled>日</option>
            {days.map((d) => (
              <option key={d} value={d} style={{ color: "#000" }}>
                {d}
              </option>
            ))}
          </select>
          <span className="text-white/40 text-xs">日</span>
        </div>
        <div className="flex-1 flex flex-col items-center gap-1">
          <select
            value={current.month}
            onChange={(e) => update("month", e.target.value)}
            style={selectStyle}
            className="w-full"
          >
            <option value="" disabled>月</option>
            {months.map((m) => (
              <option key={m} value={m} style={{ color: "#000" }}>
                {m}
              </option>
            ))}
          </select>
          <span className="text-white/40 text-xs">月</span>
        </div>
        <div className="flex-1 flex flex-col items-center gap-1">
          <select
            value={current.year}
            onChange={(e) => update("year", e.target.value)}
            style={selectStyle}
            className="w-full"
          >
            <option value="" disabled>年</option>
            {years.map((y) => (
              <option key={y} value={y} style={{ color: "#000" }}>
                {y}
              </option>
            ))}
          </select>
          <span className="text-white/40 text-xs">年</span>
        </div>
      </div>
    );
  };

  // ─── File Upload ───
  const renderFile = (q: StarseedQuestion) => {
    const current = answers[currentQ] as { dataUrl: string; fileName: string } | null;

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        const newAnswers = [...answers];
        newAnswers[currentQ] = {
          dataUrl: reader.result as string,
          fileName: file.name,
        };
        setAnswers(newAnswers);
      };
      reader.readAsDataURL(file);
    };

    return (
      <div>
        <div
          className="flex flex-col items-center py-8 cursor-pointer"
          style={glassCard}
          onClick={() => document.getElementById(`file-upload-${currentQ}`)?.click()}
        >
          {current ? (
            <>
              <span className="text-3xl mb-2">✅</span>
              <span className="text-white/85 text-sm">{current.fileName}</span>
            </>
          ) : (
            <>
              <span className="text-3xl mb-2">📸</span>
              <span className="text-white/60 text-sm">點擊上載手掌相片</span>
            </>
          )}
        </div>
        <input
          id={`file-upload-${currentQ}`}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleFile}
        />
        {q.isVoluntary && (
          <button
            onClick={() => {
              const newAnswers = [...answers];
              newAnswers[currentQ] = null; // explicitly skip
              // Mark as "answered" by setting a special value
              setAnswers(newAnswers);
            }}
            className="mt-3 text-white/40 text-sm underline"
          >
            跳過此題
          </button>
        )}
      </div>
    );
  };

  // ─── Render question by type ───
  const renderQuestion = (q: StarseedQuestion) => {
    switch (q.type) {
      case "single":
        return renderSingle(q);
      case "multi":
        return renderMulti(q);
      case "image":
        return renderImage(q);
      case "element":
        return renderElement(q);
      case "date":
        return renderDate();
      case "file":
        return renderFile(q);
      default:
        return null;
    }
  };

  return (
    <div
      className="fixed inset-0 flex flex-col quiz-protected"
      style={{
        background: "linear-gradient(160deg, #0B0E1A 0%, #1A1035 50%, #0F1B3A 100%)",
      }}
    >
      <Starfield />

      {/* Progress bar area */}
      <div className="relative z-10 px-4 pt-4 pb-2">
        <div className="flex items-center justify-between mb-2">
          <span className="text-white/50 text-sm">
            {currentQ + 1}/{TOTAL_STARSEED}
          </span>
          <span className="text-[#F0E6C5] text-sm font-semibold">
            {Math.round(((currentQ + 1) / TOTAL_STARSEED) * 100)}%
          </span>
        </div>
        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${progress}%`,
              background: "linear-gradient(90deg, #F0E6C5, #B8A9D4)",
            }}
          />
        </div>
      </div>

      {/* Question area */}
      <div className="relative z-10 flex-1 overflow-y-auto px-4 pt-2 pb-40">
        <h2 className="text-xl font-bold text-white leading-relaxed mb-2">
          {question.text}
        </h2>
        {question.subtext && (
          <p className="text-white/50 text-sm mb-5">{question.subtext}</p>
        )}
        <div className="mt-4">{renderQuestion(question)}</div>
      </div>

      {/* Bottom nav */}
      <div
        className="fixed bottom-0 left-0 right-0 z-30 px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))]"
        style={{
          background: "linear-gradient(to top, rgba(11,14,26,0.95), rgba(11,14,26,0.8))",
          backdropFilter: "blur(12px)",
        }}
      >
        <div className="flex gap-3">
          <button
            onClick={handlePrev}
            disabled={currentQ === 0}
            className="flex-1 py-3 rounded-xl text-white/50 text-sm disabled:opacity-30"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            上一題
          </button>
          <button
            onClick={handleNext}
            disabled={!answered}
            className="flex-1 py-3 rounded-xl text-white font-semibold disabled:opacity-30"
            style={{
              ...glassBtn,
              opacity: answered ? 1 : 0.3,
            }}
          >
            {isLast ? "完成 ✅" : "下一題"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── StarseedResultView ───

function StarseedResultView({
  result,
  onBack,
}: {
  result: StarseedResult;
  onBack: () => void;
}) {
  const { star, report, sortedScores } = result;
  const freeReport = report.free;
  const maxScore = sortedScores[0]?.score || 1;

  return (
    <div
      className="fixed inset-0 flex flex-col overflow-y-auto"
      style={{ background: "#F8F9FA" }}
    >
      {/* Header */}
      <div className="px-4 pt-4 pb-2">
        <button
          onClick={onBack}
          className="text-[#6c63ff] text-sm flex items-center gap-1 mb-2"
        >
          <span>←</span> 返回測評列表
        </button>
      </div>

      <div className="flex-1 px-4 pb-20">
        {/* Result title area */}
        <div className="text-center mb-6">
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-3"
            style={{
              background: "rgba(108,99,255,0.1)",
              color: "#6c63ff",
            }}
          >
            ✨ 你的星宿種子類型
          </div>
          <div
            className="text-6xl mb-3"
            style={{ fontSize: "160px", lineHeight: 1 }}
          >
            {star.emoji}
          </div>
          <h1 className="text-2xl font-bold text-[#1a1a2e]">{star.name}</h1>
          <p className="text-sm text-[#6c63ff] font-medium">{star.english}</p>
          <p className="text-sm text-[#666] mt-1">{star.subtitle}</p>
        </div>

        {/* Personality card */}
        <div
          className="rounded-2xl p-5 mb-4"
          style={{
            background: "#FFFFFF",
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          }}
        >
          <h3 className="text-base font-bold text-[#1a1a2e] mb-2">
            性格特徵
          </h3>
          <p className="text-sm text-[#555] leading-relaxed mb-3">
            {freeReport.summary}
          </p>
          <ul className="space-y-2">
            {freeReport.traits.map((trait, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-[#555]">
                <span className="text-[#6c63ff] shrink-0">✦</span>
                <span>{trait}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Unlock reasons card */}
        <div
          className="rounded-2xl p-5 mb-4"
          style={{
            background: "linear-gradient(135deg, #1a1035, #2d1b69)",
            color: "#FFFFFF",
          }}
        >
          <div className="text-center mb-3">
            <span className="text-2xl">🔒</span>
            <h3 className="text-base font-bold mt-1">
              噢！你的完整報告鎖在你的星球裡
            </h3>
          </div>
          <ul className="space-y-2.5">
            {freeReport.unlockReasons.map((reason, i) => (
              <li key={i} className="text-sm text-white/80 leading-relaxed">
                {reason}
              </li>
            ))}
          </ul>
        </div>

        {/* Score distribution */}
        <div
          className="rounded-2xl p-5 mb-4"
          style={{
            background: "#FFFFFF",
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          }}
        >
          <h3 className="text-base font-bold text-[#1a1a2e] mb-4">
            分數分佈
          </h3>
          <div className="space-y-3">
            {sortedScores.map((item, i) => {
              const starData = STARS[item.id];
              const pct = Math.round((item.score / maxScore) * 100);
              const isTop = i === 0;
              return (
                <div key={item.id}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm flex items-center gap-1.5">
                      <span>{starData.emoji}</span>
                      <span
                        className={`font-medium ${
                          isTop ? "text-[#6c63ff]" : "text-[#333]"
                        }`}
                      >
                        {starData.name}
                      </span>
                    </span>
                    <span className="text-xs text-[#999]">{item.score}分</span>
                  </div>
                  <div className="h-2 bg-[#f0f0f0] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${pct}%`,
                        background: isTop
                          ? "linear-gradient(90deg, #6c63ff, #8b7eff)"
                          : "linear-gradient(90deg, #c9a84c, #d4b85c)",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Unlock button */}
        <button
          onClick={() => alert("即將上線，敬請期待！")}
          className="w-full py-4 rounded-xl text-white text-lg font-semibold mb-3 transition-all active:scale-[0.98]"
          style={{
            background: "linear-gradient(135deg, #6c63ff, #8b7eff)",
          }}
        >
          解鎖完整報告 🔓
        </button>

        {/* Back button */}
        <button
          onClick={onBack}
          className="w-full py-3 rounded-xl text-[#999] text-sm"
        >
          返回測評列表
        </button>

        {/* Footer */}
        <div className="text-center pt-4 pb-2">
          <p className="text-sm text-[#6c63ff] font-semibold">
            YIXU HEALING · 亦須療愈
          </p>
          <p className="text-xs text-[#999]">
            Sino-NLP 中華身心語言學 · 星宿種子測評
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───

export default function StarseedPage({
  onBack,
  onFullscreenChange,
}: {
  onBack: () => void;
  onFullscreenChange?: (fullscreen: boolean) => void;
}) {
  const [stage, setStage] = useState<Stage>("intro");
  const [result, setResult] = useState<StarseedResult | null>(null);

  // Fullscreen management
  useEffect(() => {
    onFullscreenChange?.(true);
    return () => {
      onFullscreenChange?.(false);
    };
  }, [onFullscreenChange]);

  const handleStartQuiz = useCallback(() => {
    setStage("gender");
  }, []);

  const handleGenderSelect = useCallback(() => {
    setStage("quiz");
  }, []);

  const handleComplete = useCallback((answers: AnswerValue[]) => {
    const res = calculateStarseedResult(answers);
    setResult(res);
    setStage("result");
  }, []);

  const handleBackToIntro = useCallback(() => {
    setStage("intro");
  }, []);

  const handleBackToTests = useCallback(() => {
    onFullscreenChange?.(false);
    onBack();
  }, [onBack, onFullscreenChange]);

  return (
    <>
      {stage === "intro" && (
        <IntroSlides onStart={handleStartQuiz} onBack={handleBackToTests} />
      )}
      {stage === "gender" && (
        <GenderSelect onSelect={handleGenderSelect} onBack={handleBackToIntro} />
      )}
      {stage === "quiz" && <StarseedQuiz onComplete={handleComplete} />}
      {stage === "result" && result && (
        <StarseedResultView result={result} onBack={handleBackToTests} />
      )}
    </>
  );
}
