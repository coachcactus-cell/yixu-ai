"use client";

import { useState, useMemo } from "react";
import {
  WEISHI_DICTIONARY,
  WEISHI_CATEGORIES,
  searchWeishiEntries,
  type WeishiEntry,
} from "@/data/weishi-dictionary";
import { Search, ChevronDown, ChevronUp, ArrowLeft, Link2 } from "lucide-react";
import Link from "next/link";

export default function WeishiDictionaryPage() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("全部");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedEntry, setSelectedEntry] = useState<WeishiEntry | null>(null);
  const [displayCount, setDisplayCount] = useState(50);

  // 搜尋 + 篩選
  const filteredEntries = useMemo(() => {
    let result = query.trim() ? searchWeishiEntries(query) : WEISHI_DICTIONARY;
    if (activeCategory !== "全部") {
      result = result.filter((e) => e.category === activeCategory);
    }
    return result;
  }, [query, activeCategory]);

  // 當搜尋或篩選變化時，重置顯示數量
  useMemo(() => {
    setDisplayCount(50);
  }, [query, activeCategory]);

  // 統計
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    WEISHI_DICTIONARY.forEach((e) => {
      counts[e.category] = (counts[e.category] || 0) + 1;
    });
    return counts;
  }, []);

  // 詳情頁
  if (selectedEntry) {
    return (
      <EntryDetailView
        entry={selectedEntry}
        onBack={() => setSelectedEntry(null)}
        onSelectRelated={(id) => {
          const related = WEISHI_DICTIONARY.find((e) => e.id === id);
          if (related) {
            setSelectedEntry(related);
            window.scrollTo(0, 0);
          }
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f6f2]">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-gradient-to-r from-[#1a1a2e] to-[#1e1538] px-4 py-4">
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-2 mb-3">
            <Link href="/" className="text-white/60 hover:text-white">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6b8f9e] to-[#4a6b7a] flex items-center justify-center text-base">
                🪷
              </div>
              <div>
                <h1 className="text-base font-bold text-white font-song">唯识辞典</h1>
                <p className="text-[10px] text-white/50">公益免费 · 亦须AI出品</p>
              </div>
            </div>
          </div>

          {/* 搜尋框 */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b8f9e]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="搜索唯识术语、八识、百法…"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-[#6b8f9e]/30 text-[#1a1a1a] text-sm placeholder:text-[#999] focus:outline-none focus:border-[#6b8f9e] focus:ring-2 focus:ring-[#6b8f9e]/20 transition-all"
            />
          </div>
        </div>
      </header>

      {/* 分類篩選 */}
      <div className="sticky top-[120px] z-[5] bg-[#f8f6f2] border-b border-[#e8e8e8]">
        <div className="max-w-md mx-auto px-4 py-2.5 flex gap-2 overflow-x-auto">
          {["全部", ...WEISHI_CATEGORIES].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? "bg-[#6b8f9e] text-white"
                  : "bg-white text-[#666] border border-[#e8e8e8] hover:border-[#6b8f9e]"
              }`}
            >
              {cat}
              {cat !== "全部" && (
                <span className="ml-1 opacity-60">({categoryCounts[cat] || 0})</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 詞條列表 */}
      <div className="max-w-md mx-auto px-4 py-4 pb-20">
        {/* 統計 */}
        <p className="text-xs text-[#999] mb-3">
          {query || activeCategory !== "全部"
            ? `找到 ${filteredEntries.length} 条结果`
            : `共 ${WEISHI_DICTIONARY.length} 条词条`}
        </p>

        {filteredEntries.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-4xl mb-3 opacity-30">🪷</div>
            <p className="text-sm text-[#999]">未找到相关词条</p>
            <p className="text-xs text-[#ccc] mt-1">试试搜索「八识」「百法」「阿赖耶」</p>
          </div>
        ) : (
          <>
            <div className="space-y-2.5">
              {filteredEntries.slice(0, displayCount).map((entry) => (
                <EntryCard
                  key={entry.id}
                  entry={entry}
                  isExpanded={expandedId === entry.id}
                  onToggle={() =>
                    setExpandedId(expandedId === entry.id ? null : entry.id)
                  }
                  onClickDetail={() => {
                    setSelectedEntry(entry);
                    window.scrollTo(0, 0);
                  }}
                />
              ))}
            </div>
            {displayCount < filteredEntries.length && (
              <button
                onClick={() => setDisplayCount((c) => c + 50)}
                className="w-full mt-4 py-3 rounded-xl bg-[#f0f4f5] text-[#6b8f9e] text-sm font-medium hover:bg-[#e0e8ea] transition-colors"
              >
                加载更多（剩余 {filteredEntries.length - displayCount} 条）
              </button>
            )}
          </>
        )}

        {/* 底部说明 */}
        <div className="mt-8 p-4 rounded-xl bg-[#f0f4f5] border border-[#6b8f9e]/20">
          <p className="text-xs text-[#666] leading-relaxed text-center">
            🪷 唯识辞典 · 亦须AI 公益项目
            <br />
            知识精准 · 一看就明 · 持续更新中
          </p>
        </div>
      </div>
    </div>
  );
}

// ── 詞條卡片（列表用）──
function EntryCard({
  entry,
  isExpanded,
  onToggle,
  onClickDetail,
}: {
  entry: WeishiEntry;
  isExpanded: boolean;
  onToggle: () => void;
  onClickDetail: () => void;
}) {
  return (
    <div className="bg-white rounded-xl border border-[#e8e8e8] overflow-hidden transition-all">
      {/* 頭部 */}
      <button
        onClick={onToggle}
        className="w-full px-4 py-3 flex items-start justify-between text-left"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="text-base font-bold text-[#1a1a1a] font-song">{entry.term}</h3>
            <span className="text-[10px] text-[#999]">{entry.pinyin}</span>
          </div>
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#f0f4f5] text-[#6b8f9e] font-medium">
            {entry.category}
          </span>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-[#999] flex-shrink-0 mt-1" />
        ) : (
          <ChevronDown className="w-4 h-4 text-[#999] flex-shrink-0 mt-1" />
        )}
      </button>

      {/* 展開內容 */}
      {isExpanded && (
        <div className="px-4 pb-3 space-y-3">
          {/* 一句話明白 */}
          <div>
            <p className="text-[10px] font-bold text-[#6b8f9e] mb-1">📍 一句话明白</p>
            <p className="text-sm text-[#1a1a1a] leading-relaxed">{entry.oneLiner}</p>
          </div>

          {/* 白話解釋（截斷） */}
          <div>
            <p className="text-[10px] font-bold text-[#8a9bae] mb-1">📖 白话解释</p>
            <p className="text-xs text-[#444] leading-relaxed line-clamp-3">
              {entry.plainText}
            </p>
          </div>

          {/* 查看詳情按鈕 */}
          <button
            onClick={onClickDetail}
            className="w-full py-2 rounded-lg bg-[#f0f4f5] text-[#6b8f9e] text-xs font-medium hover:bg-[#e0e8ea] transition-colors"
          >
            查看完整释义 →
          </button>
        </div>
      )}
    </div>
  );
}

// ── 詞條詳情頁 ──
function EntryDetailView({
  entry,
  onBack,
  onSelectRelated,
}: {
  entry: WeishiEntry;
  onBack: () => void;
  onSelectRelated: (id: string) => void;
}) {
  return (
    <div className="min-h-screen bg-[#f8f6f2]">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-gradient-to-r from-[#1a1a2e] to-[#1e1538] px-4 py-4">
        <div className="max-w-md mx-auto flex items-center gap-2">
          <button onClick={onBack} className="text-white/60 hover:text-white">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-base font-bold text-white font-song">{entry.term}</h1>
            <p className="text-[10px] text-white/50">{entry.pinyin} · {entry.category}</p>
          </div>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 py-4 pb-20 space-y-4">
        {/* 一句話明白 */}
        <div className="bg-white rounded-xl p-4 border border-[#e8e8e8]">
          <p className="text-[10px] font-bold text-[#6b8f9e] mb-1.5">📍 一句话明白</p>
          <p className="text-base text-[#1a1a1a] leading-relaxed font-medium">{entry.oneLiner}</p>
        </div>

        {/* 白話解釋 */}
        <div className="bg-white rounded-xl p-4 border border-[#e8e8e8]">
          <p className="text-[10px] font-bold text-[#8a9bae] mb-1.5">📖 白话解释</p>
          <p className="text-sm text-[#333] leading-relaxed">{entry.plainText}</p>
        </div>

        {/* 經典原文 */}
        {entry.classicText && (
          <div className="bg-[#f0f4f5] rounded-xl p-4 border border-[#6b8f9e]/20">
            <p className="text-[10px] font-bold text-[#6b8f9e] mb-1.5">🔬 经典原文</p>
            <p className="text-sm text-[#444] leading-relaxed font-song">{entry.classicText}</p>
            {entry.source && (
              <p className="text-[10px] text-[#999] mt-2">—— {entry.source}</p>
            )}
          </div>
        )}

        {/* 亦須接地氣 */}
        {entry.lifeExample && (
          <div className="bg-white rounded-xl p-4 border border-[#e8e8e8]">
            <p className="text-[10px] font-bold text-[#10b981] mb-1.5">🌿 亦须接地气</p>
            <p className="text-sm text-[#333] leading-relaxed">{entry.lifeExample}</p>
          </div>
        )}

        {/* 關聯詞條 */}
        {entry.related && entry.related.length > 0 && (
          <div className="bg-white rounded-xl p-4 border border-[#e8e8e8]">
            <p className="text-[10px] font-bold text-[#999] mb-2 flex items-center gap-1">
              <Link2 className="w-3 h-3" /> 关联词条
            </p>
            <div className="flex flex-wrap gap-2">
              {entry.related.map((id) => {
                const related = WEISHI_DICTIONARY.find((e) => e.id === id);
                if (!related) return null;
                return (
                  <button
                    key={id}
                    onClick={() => onSelectRelated(id)}
                    className="px-3 py-1.5 rounded-lg bg-[#f5f5f5] text-xs text-[#444] hover:bg-[#f0f4f5] hover:text-[#6b8f9e] transition-colors"
                  >
                    {related.term}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 底部 */}
        <div className="pt-4 text-center">
          <p className="text-[10px] text-[#ccc]">亦须AI · 唯识辞典 · 公益免费</p>
        </div>
      </div>
    </div>
  );
}
