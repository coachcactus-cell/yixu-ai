import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://yixu-ai.online"),
  title: "亦须AI — Cactus AI",
  description: "Sino-NLP 中华身心语言学 × 传统经学 × 行为心理学 — 你的随身疗愈修行伙伴",
  openGraph: {
    title: "亦须AI — Cactus AI",
    description: "Sino-NLP 中华身心语言学 × 传统经学 × 行为心理学 — 你的随身疗愈修行伙伴",
    url: "https://yixu-ai.online",
    siteName: "亦须AI",
    images: [
      {
        url: "https://yixu-ai.online/og-image.png?v=4",
        width: 1200,
        height: 630,
        alt: "亦须AI — 你的随身疗愈修行伙伴",
      },
    ],
    locale: "zh_HK",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "亦须AI — Cactus AI",
    description: "Sino-NLP 中华身心语言学 × 传统经学 — 随身疗愈修行伙伴",
    images: ["https://yixu-ai.online/og-image.png?v=4"],
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
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
