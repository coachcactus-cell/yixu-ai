"use client";

import { useCallback, useRef } from "react";
import html2canvas from "html2canvas";

// App URL for QR code / share link
const APP_URL = "https://yixu-ai.cn"; // Will need to update when domain is purchased
const APP_URL_FALLBACK = "https://yixu-app.vercel.app";

export function getShareUrl(): string {
  return APP_URL;
}

export function getShareText(type: string, detail: string): string {
  switch (type) {
    case "quote":
      return `${detail}\n\n—— 亦须AI · Sino-NLP 疗愈对话\n扫码体验 👇`;
    case "yijing":
      return `${detail}\n\n—— 亦须AI · 点卦问事\n扫码起卦 👇`;
    case "chakra":
      return `我的脉轮能量报告 ${detail}\n\n—— 亦须AI · 七脉轮测评\n扫码测测你的 👇`;
    case "enneagram":
      return `我是第${detail}型人格！\n\n—— 亦须AI · 九型人格测试\n扫码测测你是哪型 👇`;
    case "practice":
      return `修行打卡 Day ${detail}\n\n—— 亦须AI · 修行日课\n扫码一起修行 👇`;
    default:
      return `亦须AI · 修行路上有我陪你\n扫码体验 👇`;
  }
}

/**
 * Generate a share card image from a DOM element
 */
export async function generateShareImage(
  element: HTMLElement,
  options?: {
    scale?: number;
    backgroundColor?: string;
  }
): Promise<string | null> {
  try {
    const canvas = await html2canvas(element, {
      scale: options?.scale ?? 2,
      backgroundColor: options?.backgroundColor ?? "#ffffff",
      useCORS: true,
      allowTaint: true,
      logging: false,
      width: element.offsetWidth,
      height: element.offsetHeight,
    });
    return canvas.toDataURL("image/png", 0.95);
  } catch (err) {
    console.error("Share card generation failed:", err);
    return null;
  }
}

/**
 * Share via Web Share API (mobile), or fallback to copy link
 */
export async function shareContent(
  title: string,
  text: string,
  imageUrl?: string
): Promise<boolean> {
  // Try Web Share API first (works on mobile browsers)
  if (typeof navigator !== "undefined" && navigator.share) {
    try {
      if (imageUrl) {
        // Convert data URL to file for sharing
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const file = new File([blob], "share.png", { type: "image/png" });
        await navigator.share({
          title,
          text,
          files: [file],
        });
        return true;
      } else {
        await navigator.share({
          title,
          text,
          url: getShareUrl(),
        });
        return true;
      }
    } catch (err) {
      // User cancelled or API failed
      if (err instanceof Error && err.name === "AbortError") return false;
    }
  }

  // Fallback: copy to clipboard
  if (typeof navigator !== "undefined" && navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(`${text}\n${getShareUrl()}`);
      return true;
    } catch {
      return false;
    }
  }

  return false;
}

// ── Reusable Share Card Template ──

interface ShareCardTemplateProps {
  type: "quote" | "yijing" | "chakra" | "enneagram" | "practice";
  title: string;
  content: string;
  subtext?: string;
  accentColor?: string;
  children?: React.ReactNode;
}

/**
 * A hidden off-screen share card template that can be captured by html2canvas.
 * Render this component in the DOM (positioned off-screen), then call generateShareImage on its ref.
 */
export function ShareCardTemplate({
  type,
  title,
  content,
  subtext,
  accentColor = "#c9a84c",
  children,
}: ShareCardTemplateProps) {
  return (
    <div
      style={{
        width: 360,
        padding: 24,
        background: "#ffffff",
        fontFamily: "'PingFang SC', 'Noto Sans SC', sans-serif",
        position: "relative",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            background: `linear-gradient(135deg, ${accentColor}, #b89430)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: 16,
            fontWeight: 700,
          }}
        >
          亦
        </div>
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, color: accentColor }}>
            <span style={{ color: accentColor }}>亦须</span>
            <span style={{ color: "#8a9bae" }}>AI</span>
          </div>
          <div style={{ fontSize: 12, color: "#666" }}>Sino-NLP 中华身心语言学</div>
        </div>
      </div>

      {/* Content */}
      {children || (
        <div style={{ marginBottom: 16 }}>
          <div
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: accentColor,
              marginBottom: 8,
              padding: "4px 12px",
              background: "#fdf8ed",
              borderRadius: 12,
              display: "inline-block",
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: 15,
              lineHeight: 1.8,
              color: "#1a1a1a",
              whiteSpace: "pre-wrap",
              maxHeight: 200,
              overflow: "hidden",
            }}
          >
            {content}
          </div>
          {subtext && (
            <div style={{ fontSize: 12, color: "#888", marginTop: 8 }}>{subtext}</div>
          )}
        </div>
      )}

      {/* Footer */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 0",
          borderTop: `1px solid #e8e8e8`,
        }}
      >
        <div style={{ fontSize: 12, color: "#999" }}>
          扫码体验 亦须AI · {type === "quote" ? "疗愈对话" : type === "yijing" ? "点卦问事" : type === "chakra" ? "脉轮测评" : type === "enneagram" ? "九型人格" : "修行日课"}
        </div>
        <div
          style={{
            width: 80,
            height: 80,
            background: "#f5f5f5",
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 10,
            color: "#666",
          }}
        >
          QR Code
        </div>
      </div>
    </div>
  );
}

// ── Share Button Component ──

interface ShareButtonProps {
  type: "quote" | "yijing" | "chakra" | "enneagram" | "practice";
  title: string;
  content: string;
  subtext?: string;
  accentColor?: string;
  onShared?: () => void;
  size?: number;
  label?: string;
}

export function ShareButton({
  type,
  title,
  content,
  subtext,
  accentColor,
  onShared,
  size = 18,
  label,
}: ShareButtonProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleShare = useCallback(async () => {
    if (!cardRef.current) return;

    const imageUrl = await generateShareImage(cardRef.current);
    const shareText = getShareText(type, content.slice(0, 50));
    const shareTitle = `亦须AI · ${title}`;

    if (imageUrl) {
      const success = await shareContent(shareTitle, shareText, imageUrl);
      if (success && onShared) onShared();
    }
  }, [type, title, content, subtext, onShared]);

  return (
    <>
      {/* Off-screen card template for image generation */}
      <div
        ref={cardRef}
        style={{
          position: "fixed",
          left: -9999,
          top: -9999,
          zIndex: -1,
          opacity: 1,
        }}
      >
        <ShareCardTemplate
          type={type}
          title={title}
          content={content}
          subtext={subtext}
          accentColor={accentColor}
        />
      </div>

      {/* Share button */}
      <button
        onClick={handleShare}
        className="flex items-center gap-1 text-xs text-[#999999] hover:text-[#c9a84c] transition-colors"
        title="分享"
      >
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
        </svg>
        {label && <span>{label}</span>}
      </button>
    </>
  );
}