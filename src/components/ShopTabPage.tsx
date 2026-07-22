"use client";

import { Store, Sparkles, Leaf, Package, GraduationCap, MapPin, Clock } from "lucide-react";

/* ── 商品分类（预览结构，暂未接数据） ── */
const CATEGORIES = [
  { key: "incense", label: "香品", icon: Leaf },
  { key: "course", label: "疗愈课程", icon: GraduationCap },
  { key: "goods", label: "香道周边", icon: Package },
];

/* ── 示例商品（DEMO 占位，等你提供真实香品图与文案后替换） ── */
const SAMPLE_PRODUCTS = [
  { emoji: "🌿", name: "【示例】海南沉香线香", desc: "天然沉香 · 静心凝神", price: "¥ --", tag: "即将上架" },
  { emoji: "🕯️", name: "【示例】古法和香香丸", desc: "手作合香 · 随身佩戴", price: "¥ --", tag: "即将上架" },
  { emoji: "🔥", name: "【示例】篆香体验套装", desc: "含香粉 · 香篆 · 灰押", price: "¥ --", tag: "即将上架" },
  { emoji: "📿", name: "【示例】祈福香牌", desc: "可佩戴 · 车载 · 家居", price: "¥ --", tag: "即将上架" },
  { emoji: "📚", name: "【示例】香道入门课", desc: "线上 · 12讲 · 终身回看", price: "¥ --", tag: "即将上架" },
  { emoji: "🧘", name: "【示例】身心疗愈工作坊", desc: "线下 · 限额小班", price: "¥ --", tag: "即将上架" },
];

export default function ShopTabPage() {
  return (
    <div className="min-h-screen bg-[#fafafa] pb-20">
      {/* ── Hero 头部 ── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#1a1a1a] via-[#221d12] to-[#1a1a1a] px-5 pt-8 pb-7">
        {/* 柔光装饰 */}
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-[#c9a84c]/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-8 w-44 h-44 rounded-full bg-[#8a9bae]/10 blur-3xl pointer-events-none" />

        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#c9a84c]/15 border border-[#c9a84c]/30 flex items-center justify-center">
              <Store size={20} className="text-[#c9a84c]" />
            </div>
            <div>
              <h1 className="text-2xl font-black font-song text-white leading-none">香舖</h1>
              <p className="text-[11px] text-[#8a9bae] mt-1 tracking-wider">SHOP · YIXU HEALING</p>
            </div>
          </div>

          {/* Coming Soon 状态标 */}
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#c9a84c]/15 border border-[#c9a84c]/30 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c9a84c] animate-pulse" />
            <span className="text-[#c9a84c] text-xs font-semibold tracking-wide">即将上线</span>
          </span>
        </div>

        <p className="relative text-sm text-white/80 mt-4 leading-relaxed">
          传统香品 · 身心灵疗愈课程<br/>
          <span className="text-[#c9a84c]">中 · 港</span> 私域直送，安心之选
        </p>
      </div>

      {/* ── 上线预告卡 ── */}
      <div className="px-5 -mt-4 relative z-10">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#f0ede5] flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#c9a84c]/10 flex items-center justify-center flex-shrink-0">
            <Clock size={18} className="text-[#c9a84c]" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-[#1a1a1a]">香舖正在筹建中</h3>
            <p className="text-xs text-[#666] mt-1 leading-relaxed">
              这是栏目的结构预览。下方为示例商品与分类框架，<strong className="text-[#c9a84c]">等你提供真实香品图片与文案</strong>后，即可替换上线。
            </p>
          </div>
        </div>
      </div>

      {/* ── 分类预览（结构展示） ── */}
      <div className="px-5 pt-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="accent-line" />
          <h2 className="text-base font-bold font-song text-[#1a1a1a]">商品分类</h2>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.key}
                className="bg-white rounded-2xl p-4 flex flex-col items-center gap-2 border border-[#f0ede5] shadow-sm"
              >
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#c9a84c]/15 to-[#8a9bae]/15 flex items-center justify-center">
                  <Icon size={20} className="text-[#c9a84c]" />
                </div>
                <span className="text-sm font-medium text-[#333]">{cat.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 示例商品网格（结构展示） ── */}
      <div className="px-5 pt-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="accent-line" />
            <h2 className="text-base font-bold font-song text-[#1a1a1a]">香品一览</h2>
          </div>
          <span className="text-[11px] text-[#999]">示例 · DEMO</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {SAMPLE_PRODUCTS.map((p, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl overflow-hidden border border-[#f0ede5] shadow-sm flex flex-col"
            >
              {/* 图片占位（真实图接入后替换为 <img>） */}
              <div className="relative aspect-square bg-gradient-to-br from-[#fdf8ed] to-[#eef1f4] flex items-center justify-center">
                <span className="text-5xl opacity-60">{p.emoji}</span>
                <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-[#c9a84c]/90 text-white text-[10px] font-medium">
                  {p.tag}
                </span>
              </div>
              <div className="p-3 flex-1 flex flex-col">
                <h3 className="text-sm font-semibold text-[#1a1a1a] leading-snug line-clamp-2">{p.name}</h3>
                <p className="text-xs text-[#999] mt-1 leading-relaxed flex-1">{p.desc}</p>
                <div className="flex items-center justify-between mt-2.5">
                  <span className="text-base font-bold text-[#c9a84c]">{p.price}</span>
                  <span className="text-[10px] text-[#aaa]">上架后开放</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 私域销售说明 ── */}
      <div className="px-5 pt-6">
        <div className="bg-gradient-to-r from-[#c9a84c]/8 to-[#8a9bae]/8 rounded-2xl p-5 border border-[#c9a84c]/15">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={18} className="text-[#c9a84c]" />
            <h3 className="text-sm font-bold text-[#1a1a1a]">私域安心购</h3>
          </div>
          <div className="space-y-2.5 text-xs text-[#555] leading-relaxed">
            <div className="flex items-start gap-2">
              <MapPin size={14} className="text-[#8a9bae] flex-shrink-0 mt-0.5" />
              <span>主力服务<strong className="text-[#c9a84c]">中、港</strong>市场客户，支持两地配送。</span>
            </div>
            <div className="flex items-start gap-2">
              <Leaf size={14} className="text-[#8a9bae] flex-shrink-0 mt-0.5" />
              <span>所有香品源自非遗和香工艺，天然原料，安心可溯。</span>
            </div>
            <div className="flex items-start gap-2">
              <Clock size={14} className="text-[#8a9bae] flex-shrink-0 mt-0.5" />
              <span>上线后可于此直接浏览、下单，或由亦须先生一对一推荐。</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── 底部预告 ── */}
      <div className="px-5 pt-6 pb-2 text-center">
        <p className="text-sm font-song text-[#c9a84c]">一炉好香，静待知音</p>
        <p className="text-xs text-[#999] mt-1.5 leading-relaxed">
          香舖即将开放<br/>
          有意成为首批体验者，可先联系亦须先生
        </p>
      </div>
    </div>
  );
}
