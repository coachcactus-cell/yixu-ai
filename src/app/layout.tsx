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
      { url: "/icon-144.png", sizes: "144x144", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
      { url: "/apple-touch-icon-180.png", sizes: "180x180", type: "image/png" },
      { url: "/apple-touch-icon-167.png", sizes: "167x167", type: "image/png" },
      { url: "/apple-touch-icon-152.png", sizes: "152x152", type: "image/png" },
      { url: "/apple-touch-icon-120.png", sizes: "120x120", type: "image/png" },
    ],
    shortcut: "/icon-192.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#c9a84c",
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
