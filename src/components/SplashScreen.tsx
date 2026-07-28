"use client";

import { useEffect, useState } from "react";

/**
 * 自定義啟動閃屏 — 取代 PWA 原生黑底閃屏
 * - 白底（#faf7f0）+ 透明底大頭像（cartoon-head.png）
 * - 顯示 1.5 秒後淡出
 * - 每次打開 App 都會顯示（sessionStorage 控制，同一 session 不重複）
 */
export default function SplashScreen() {
  const [show, setShow] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // 同一 session 只顯示一次
    if (sessionStorage.getItem("yixu-splash-shown")) {
      setShow(false);
      return;
    }

    sessionStorage.setItem("yixu-splash-shown", "1");

    // 1.2 秒後開始淡出
    const fadeTimer = setTimeout(() => setFadeOut(true), 1200);
    // 1.7 秒後完全移除
    const hideTimer = setTimeout(() => setShow(false), 1700);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center transition-opacity duration-500"
      style={{
        backgroundColor: "#faf7f0",
        opacity: fadeOut ? 0 : 1,
        pointerEvents: fadeOut ? "none" : "auto",
      }}
    >
      <div className="flex flex-col items-center">
        <img
          src="/cartoon-head.png"
          alt="亦须AI"
          className="w-32 h-32 object-contain"
          style={{
            filter: "drop-shadow(0 4px 12px rgba(201,168,76,0.15))",
            animation: "splashPulse 1.2s ease-in-out",
          }}
        />
        <h1
          className="font-song tracking-widest mt-4"
          style={{
            fontSize: "22px",
            fontWeight: 900,
          }}
        >
          <span style={{ color: "#c9a84c" }}>亦须</span>
          <span style={{ color: "#8a9bae" }}>AI</span>
        </h1>
      </div>
      <style>{`
        @keyframes splashPulse {
          0% { transform: scale(0.85); opacity: 0; }
          50% { transform: scale(1.05); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
