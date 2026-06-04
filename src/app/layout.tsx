import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "亦须AI — Cactus AI",
  description: "Sino-NLP 中华身心语言学 × 传统经学 × 行为心理学 — 你的随身疗愈修行伙伴",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-white text-[#1a1a1a] antialiased">
        {children}
      </body>
    </html>
  );
}
