# 亦須AI — 項目總覽 (Backup)

> 最後更新: 2026-06-15
> Session: C老大 + 小B

---

## 🔗 關鍵連接

| 項目 | 值 |
|------|-----|
| App URL | `yixu-ai.online` |
| Vercel Dashboard | vercel.com → coachcactus-4808 |
| GitHub | github.com/coachcactus-cell/yixu-ai |
| 本地路徑 | /workspace/yixu-app |
| 最新 commit | 04f0f6b |

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
| cartoon-casual.png | Landing 頁全身（現代襯衫+iPad） |
| cartoon-head.png | Header logo（唐裝長衫大頭） |
| cartoon-formal.jpg | 個人頁（唐裝長衫全身） |
| app-avatar.png | App 頭像（同 cartoon-head.png） |
| icon-192/512.png | PWA icon（卡通頭像） |
| apple-touch-icon.png | iOS 主屏 icon |
| favicon-32.png | 瀏覽器 favicon |
| og-image.png | 微信分享預覽圖 |

---

## 🏗️ 技術棧

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS v4
- DeepSeek API (deepseek-chat, temp=0.5, max_tokens=200)
- Vercel 部署（GitHub 自動）
- PWA ready (manifest.json)

---

## 📱 App 結構（5 Tab）

| Tab | 組件 | 功能 | 狀態 |
|-----|------|------|------|
| 首頁 | ChatPage.tsx | Landing → AI 對話（15分/日限額） | ✅ |
| 修行 | CalendarPage.tsx | 六經日課 | ⚠️ 需擴充 |
| 測評 | AssessmentPage.tsx | 脈輪/九型/執念/情緒入口 | ✅ 有入口 |
| 易卦 | YijingPage.tsx | 掛住心掛卦 + 孟子塔羅5張 | ✅ |
| 我的 | ProfilePage.tsx | VIP/記錄/B2B入口 | ✅ |

---

## 🧩 功能組件

| 組件 | 功能 | 狀態 |
|------|------|------|
| ChakraAssessmentPage.tsx | 七脈輪測評（已整合入App） | ✅ |
| EnneagramPage.tsx | 九型人格測評 | ✅ |
| ShareCard.tsx | 分享金句卡 | ✅ 已建，待整合入ChatPage |
| YijingPage.tsx | 易卦問事 + 孟子塔羅 | ✅ |

---

## 🔌 API 路由

| 路由 | 功能 |
|------|------|
| /api/chat | DeepSeek AI 對話 |
| /api/b2b/register | B2B 合作夥伴註冊 |
| /api/b2b/check-access | B2B 訪問權限檢查 |
| /api/b2b/clients | B2B 客戶列表 |
| /api/b2b/record-assessment | B2B 測評記錄 |
| /api/b2b/stats | B2B 統計數據 |
| /api/b2b/update-client | B2B 客戶更新 |

---

## 🤖 AI System Prompt 要點

- 身份: 亦須先生的分身
- 風格: 慈父般的修行導師，溫暖沉穩，智慧的化身
- 惜字如金，字字珠璣，temp=0.5, max_tokens=200
- 簡體中文，不炫學，不油滑，不說教
- Sino-NLP: 儒釋道易心唯識 × NLP × 行為心理學

---

## 🏢 B2B 系統

- Dashboard: /b2b-dashboard
- 註冊頁: /b2b-register
- 管理頁: /b2b-admin
- 永久邀請碼: founder + demo
- 功能: 客戶數據面板、測評分佈圖表、CSV匯出

---

## 📋 待辦任務

| # | 任務 | 優先級 |
|---|------|--------|
| 1 | 微信掃碼註冊 + 郵箱註冊（二選一） | 🔴高 |
| 2 | 充值碼半自動系統 | 🔴高 |
| 3 | C人外賣推送（晨間/宵夜） | 🟡中 |
| 4 | 塔羅孟子補完 | 🟡中 |
| 5 | ShareCard 整合到 ChatPage | 🟢低 |
| 6 | 對話歷史 localStorage | 🟡中 |
| 7 | 智慧建議按時段輪替 | 🟡中 |
| 8 | AI推薦用香邏輯 | 🟡中 |
| 9 | 修行日課擴充至30天 + 打卡 | 🟢低 |
| 10 | 微信支付接入 | 🟢低 |

---

## 💰 變現設計

- VIP月: ¥29/月（無限對話 + 全部測評）
- VIP年: ¥299/年（+1對1諮詢 + 線下8折）
- 單次測評: ¥9.90
- 加時包: ¥6.90/30分鐘
- 1對1諮詢: ¥299-599/次
- 紅包: ¥12.30 新學員
- 邀請碼後台密碼: yixu2026

---

## 🏢 C老大兩間公司整合

1. **香文化公司** — 非遺和香、篆香班、香囊、制香體驗
2. **心理培訓公司** — 冥想、頌唱、水晶、芳香療愈

→ AI推薦用香 + 活動報名 + 課程商城

---

## 🔑 Token 記錄

| 用途 | 備註 |
|------|------|
| DeepSeek API | 已設於 .env.local (gitignored)，需重新提供 |
| GitHub | 需重新提供 Personal Access Token |
| Vercel | 需重新提供 Personal Access Token |
