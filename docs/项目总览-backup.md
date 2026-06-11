# 亦須AI — 項目總覽 (Backup)

> 最後更新: 2026-06-11
> Session: C老大 + 小B

---

## 🔗 關鍵連接

| 項目 | 值 |
|------|-----|
| App URL | `yixu-ai.online` |
| Vercel Dashboard | vercel.com → coachcactus-4808 |
| GitHub | github.com/coachcactus-cell/yixu-ai |
| 本地路徑 | /workspace/yixu-app |
| 最新 commit | d051caf |

---

## 🎨 品牌

| 項目 | 值 |
|------|-----|
| App 名稱 | 亦须AI / Cactus AI |
| 品牌方 | YIXU HEALING · 亦须疗愈 |
| 創始人 | 亦須先生（C老大） |
| 主色 | 金 #c9a84c |
| 輔色 | 銀 #8a9bae |
| 灰 | #888888 |
| 標題字體 | 宋體 (font-song) |
| 內文字體 | 黑體 (PingFang SC / Noto Sans SC) |
| 語言 | 簡體中文 (zh-CN) |

---

## 🖼️ 卡通形象

| 文件 | 用途 |
|------|------|
| cartoon-casual.png | Landing 頁全身（現代襯衫+iPad，吸引年輕人） |
| cartoon-head.png | Header logo（唐裝長衫大頭） |
| cartoon-formal.jpg | 個人頁（唐裝長衫全身） |
| icon-192.png / icon-512.png | PWA icon（卡通頭像） |
| apple-touch-icon.png | iOS 主屏 icon |
| favicon-32.png | 瀏覽器 favicon |

---

## 🏗️ 技術棧

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS v4
- DeepSeek API (deepseek-chat, temp=0.6, max_tokens=500)
- Vercel 部署（GitHub 自動）
- PWA ready (manifest.json)

---

## 📱 App 結構（4 Tab）

| Tab | 路徑 | 功能 | 狀態 |
|-----|------|------|------|
| 首頁 | ChatPage.tsx | Landing → AI 對話（15分/日限額） | ✅ |
| 修行 | CalendarPage.tsx | 六經日課（目前5天靜態） | ⚠️ 需擴充 |
| 測評 | AssessmentPage.tsx | 脈輪/執念/情緒（只有脈輪有入口） | ⚠️ 需接入題目 |
| 我的 | ProfilePage.tsx | VIP/記錄/設定 | ⚠️ 需真實化 |

---

## 🤖 AI System Prompt 要點

- 身份: 亦須先生的分身
- 風格: 慈父般的修行導師，溫暖沉穩，智慧的化身
- 惜字如金，字字珠璣，100-250字
- 簡體中文，不炫學，不油滑，不說教
- Sino-NLP: 儒釋道易心唯識 × NLP × 行為心理學

---

## 📋 待辦任務（優先級）

| # | 任務 | 狀態 |
|---|------|------|
| 1 | 對話歷史 localStorage | 待做 |
| 2 | 智慧建議按時段輪替 | 待做 |
| 3 | 七脈輪56題接入 + 結果頁 | 待做 |
| 4 | 分享金句卡 | 待做 |
| 5 | 修行日課擴充至30天 + 打卡 | 待做 |
| 6 | AI推薦用香邏輯 | 待做 |
| 7 | 易卦問事tab（Gemini代碼待提供） | 待做 |
| 8 | 個人頁真實化（收藏/記錄/群二維碼） | 待做 |
| 9 | 測評結果分享卡 | 待做 |
| 10 | 微信支付接入 | 待做 |

---

## 💰 變現設計

- VIP月: ¥29/月（無限對話 + 全部測評）
- VIP年: ¥299/年（+1對1諮詢 + 線下8折）
- 單次測評: ¥9.90
- 加時包: ¥6.90/30分鐘
- 1對1諮詢: ¥299-599/次

---

## 🏢 C老大兩間公司整合

1. **香文化公司** — 非遺和香、篆香班、香囊、制香體驗
2. **心理培訓公司** — 冥想、頌唱、水晶、芳香療愈

→ AI推薦用香 + 活動報名 + 課程商城

---

## 🔑 Token 記錄

| 用途 | Token | 備註 |
|------|-------|------|
| DeepSeek API | (已設於 .env.local, gitignored) | 需重新提供 |
| GitHub | (需重新提供 Personal Access Token) | push 用 |
| Vercel | (需重新提供 Personal Access Token) | CLI/部署用 |
