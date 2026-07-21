"use client";

import { useState, useRef } from "react";
import { ChevronDown, ChevronUp, Play, Phone, ArrowRight, Sparkles, Shield, RefreshCw, Users } from "lucide-react";

/* ── 学员见证视频（压缩版） ── */
const TESTIMONIAL_VIDEOS = [
  { src: "/videos/dianxin/video1-shaohui.mp4", poster: "/videos/dianxin/poster1.jpg", name: "嫊慧" },
  { src: "/videos/dianxin/video2-xiaodan.mp4", poster: "/videos/dianxin/poster2.jpg", name: "小丹" },
  { src: "/videos/dianxin/video3-huirong.mp4", poster: "/videos/dianxin/poster2.jpg", name: "惠容" },
  { src: "/videos/dianxin/video4-shijin.mp4", poster: "/videos/dianxin/poster1.jpg", name: "詩金" },
];

/* ── 12天课程大纲 ── */
const COURSE_DAYS = [
  {
    day: 1,
    title: "变局思维",
    icon: "☯️",
    content: "总觉得生活处处是坎？因为你看事情只有一面。我教你一体两面的阴阳原理，让你看懂硬币的反面全是机会。学学水的智慧，变成真正的强者，随时保持OK状态，我再给你一套化危为机的方法，让你能调控自我状态，从此没啥能难倒你！",
  },
  {
    day: 2,
    title: "超强感知力",
    icon: "👁️",
    content: "带你认识那个控制你90%行为的潜意识，让你搞懂它和意识是怎么打架的。我们通过感官训练，让你见微知著，一个眼神（眼球转向）一个动作（鉴貌辨色）就知道对方心里想什么。这不叫算命，这叫科学观察，是顶级高手的必备技能！",
  },
  {
    day: 3,
    title: "魅力开关",
    icon: "✨",
    content: "自信不是靠装，是建立一套牢不可破的自我价值系统。我们帮你从内到外创造一个全新的自我形象，把你的魅力开关彻底打开。到时不是你去找机会，是机会追着你跑！",
  },
  {
    day: 4,
    title: "沟通，说到点子上",
    icon: "💬",
    content: "给你沟通十大口诀，让你立刻上手。再教你看穿话语的表层和深层结构，配合身份定位和同步沟通术，不管对方是谁，你都能说到他心坎里。五种回应话术和身体语言，更是让你成为沟通场上的王者！",
  },
  {
    day: 5,
    title: "瞬间识人术",
    icon: "🔍",
    content: "想瞬间掌握别人的想法？你得懂他脑子里的那套BVR信念系统。我带你分析人性的底层代码，让你知道性格是怎么来的，以及怎么改变。你看人不再是靠猜，而是靠分析！",
  },
  {
    day: 6,
    title: "跟压力说拜拜",
    icon: "😮‍💨",
    content: `压力到底是个啥？我让你彻底看懂它的原理，知道它形成的真正原因。然后给你速效和彻底两种减压法，再结合脑电波放松练习，让你把压在心口的石头彻底搬开，晚上睡得香，白天状态好！`,
  },
  {
    day: 7,
    title: "把事情看透",
    icon: "🧩",
    content: "遇到复杂问题就头大？我教你，任何事情都有层次。给你三极妙道和理解层次这些思维工具，配合上堆下切法，再乱的事到你手里都能被理得清清楚楚，一眼看透什么能变，什么不必白费力气！",
  },
  {
    day: 8,
    title: "情绪的主人",
    icon: "🌊",
    content: `还在谈EQ？我直接告诉你，根本没有负面情绪！那些让你痛苦的所谓"负面"情绪，其实藏着巨大的正面价值。我教你情绪管理的治本之法，让你从情绪的奴隶变成主人，还能轻松处理别人的情绪炸弹！`,
  },
  {
    day: 9,
    title: "改写过去，重塑未来",
    icon: "🔄",
    content: `总被过去的事困扰？我带你认识大脑神经元，教你怎么解除过去的阴影，改变刻在脑子里的经验元素。这套改变命运的方法，能让你随时自我激励，还能用"心锚"技术，让别人永远记住你最好的那一面！`,
  },
  {
    day: 10,
    title: "让目标自己实现",
    icon: "🎯",
    content: "你定的目标为啥总完不成？我教你效果出众的深层目标制定法，配合时间线和心锚技术，让你的潜意识一天24小时帮你干活。到时候不是你追目标，是目标跑过来找你！",
  },
  {
    day: 11,
    title: "思维防火墙",
    icon: "🛡️",
    content: "给你大脑装个最强的免疫系统，也就是十二个前提假设。再给你人生十项和人生三度空间这两个超强框架，帮你彻底更新思维模式。从此，别人的闲言碎语、外界的负面信息，再也伤不到你！",
  },
  {
    day: 12,
    title: "必杀技：亲和力",
    icon: "🤝",
    content: "这天是王炸！教你一种比能力、关系都更高级的武器。让你搞懂共赢的真正内涵，不管走到哪，都能让人觉得舒服、信赖你，愿意帮你。这不光是每年不同的专题，更是让你成为真正赢家的临门一脚！",
  },
];

/* ── 实战技巧 ── */
const TECHNIQUES = [
  "自我接受法", "三步借力法", "感知位置平衡法", "逐步抽离法",
  "信念植入法", "事业价值观", "各类换框法", "天龙百部", "小飞侠",
];

/* ── 有效范畴 ── */
const SCOPE = ["管理", "领导", "销售", "谈判", "夫妻关系", "教育孩子", "搞定父母", "辅导", "教育", "修行"];

/* ── 图片列表 ── */
const IMG = {
  groupAirplane: "/images/dianxin/1784620809153_cdaff55a.jpg",  // 集体放纸飞机
  groupPhoto: "/images/dianxin/1784620808984_8d6fb915.jpg",      // 大合照
  lecture: "/images/dianxin/1784620809124_c1c962ba.jpg",          // 课堂讲课
  vak: "/images/dianxin/1784620809104_9b81d53b.jpg",              // VAK练习
  drawing: "/images/dianxin/1784620809110_57060214.jpg",          // 学员讨论画图
  sharing: "/images/dianxin/1784620809135_b40c23ef.jpg",          // 学员开心分享
  pyramid: "/images/dianxin/1784620809107_9f07cb47.jpg",          // 金字塔图讲课
  standee: "/images/dianxin/1784620809170_af44ab4b.jpg",          // 点心易拉宝
  coach: "/images/dianxin/1784620809138_78d49a30.jpg",            // 先生讲Life Coach
};

export default function DianXinTabPage() {
  const [expandedDay, setExpandedDay] = useState<number | null>(1);
  const [playingVideo, setPlayingVideo] = useState<number | null>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const toggleDay = (day: number) => {
    setExpandedDay(expandedDay === day ? null : day);
  };

  const handlePlayClick = (index: number) => {
    videoRefs.current.forEach((v, i) => {
      if (v && i !== index) v.pause();
    });
    setPlayingVideo(index);
    setTimeout(() => {
      videoRefs.current[index]?.play();
    }, 100);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] pb-20">
      {/* ── Banner 视频Hero ── */}
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: "9/16", maxHeight: "70vh" }}>
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="/videos/dianxin/banner-poster.jpg"
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/videos/dianxin/banner.mp4" type="video/mp4" />
        </video>
        {/* 渐变遮罩 + 文字叠加 */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/70" />
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-8 px-5">
          <span className="inline-block px-3 py-1 rounded-full bg-[#c9a84c]/20 backdrop-blur-sm text-[#c9a84c] text-xs font-medium mb-3">
            Sino-NLP 身心语言 · since 2004
          </span>
          <h1 className="text-4xl font-black font-song text-white mb-2 drop-shadow-lg">
            <span className="text-[#c9a84c]">点</span>
            <span className="text-[#8a9bae]">心</span>
          </h1>
          <p className="text-sm text-white/90 drop-shadow-md">12天 · 120小时 · 终身强大工具</p>
        </div>
      </div>

      {/* ── 集体放纸飞机大图 ── */}
      <div className="w-full px-5 pt-5">
        <img
          src={IMG.groupAirplane}
          alt="Sino-NLP点心读书会集体活动"
          className="w-full rounded-2xl shadow-lg object-cover"
        />
        <p className="text-center text-xs text-[#999] mt-2">Sino-NLP《点心》读书会 · 学员留影</p>
      </div>

      {/* ── 痛点引子 ── */}
      <div className="px-5 py-6">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#f0ede5]">
          <h2 className="text-base font-bold text-[#1a1a1a] mb-3 leading-snug">
            你不是不够努力，<br/>只是劲儿没用对地方！
          </h2>
          <div className="space-y-2.5 text-sm text-[#555] leading-relaxed">
            <p>有没有感觉，自己像个陀螺，每天被事情追着转，停不下来，却又不知道自己转了个啥？</p>
            <div className="space-y-1.5 pt-1">
              <p>📌 开会时，想法挺好，但说出来总没人当回事？！</p>
              <p>📌 跟人沟通，掏心掏肺，换来的却是误解和争吵？！</p>
              <p>📌 好不容易熬到深夜，想歇会，脑子里还是一堆事，翻来覆去睡不着？！</p>
            </div>
            <p className="text-[#999] pt-1">你觉得累，觉得委屈，觉得不该是这样的？！………</p>
          </div>
        </div>
      </div>

      {/* ── 转折 + 金字塔图 ── */}
      <div className="px-5 py-4">
        <div className="text-center mb-5">
          <p className="text-sm text-[#666] leading-relaxed">
            我办这个课快20年了，见了太多被这种感觉困住的人。<br/>
            她们聪明、上进，但就是活得拧巴…
          </p>
          <p className="text-base font-bold text-[#c9a84c] mt-4">
            其实，你缺的不是什么大道理，<br/>而是几个能让你"四两拨千斤"的巧劲儿！
          </p>
        </div>

        <div className="bg-gradient-to-r from-[#c9a84c]/5 to-[#8a9bae]/5 rounded-2xl p-5 border border-[#c9a84c]/15 mb-5">
          <p className="text-sm text-[#444] leading-relaxed">
            这个《点心》课，就是教你这个巧劲儿的地方！
          </p>
          <p className="text-sm text-[#444] leading-relaxed mt-2">
            它不玄乎，就是把老祖宗的智慧，跟西方最实用的心理学方法捏在一起，变成你能立刻上手用的<strong className="text-[#c9a84c]">终身强大工具</strong>！
          </p>
        </div>

        {/* 金字塔图讲课 */}
        <img
          src={IMG.pyramid}
          alt="Sino-NLP理解层次金字塔"
          className="w-full rounded-xl shadow-md object-cover mb-2"
        />
        <p className="text-center text-xs text-[#999] mb-4">理解层次贯通技术 · 课堂讲授</p>
      </div>

      {/* ── 学完你会发现 + VAK图 ── */}
      <div className="px-5 py-4">
        <h3 className="text-sm font-bold text-[#999] mb-3 text-center tracking-wider">学完你会发现</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3 bg-white rounded-xl p-4 border border-[#f0ede5]">
            <span className="text-xl flex-shrink-0">👂</span>
            <p className="text-sm text-[#444] leading-relaxed">
              你能<strong className="text-[#c9a84c]">听懂别人没说出口的话</strong>，看明白那些藏在脸色后面的真实想法！
            </p>
          </div>
          <div className="flex items-start gap-3 bg-white rounded-xl p-4 border border-[#f0ede5]">
            <span className="text-xl flex-shrink-0">🎤</span>
            <p className="text-sm text-[#444] leading-relaxed">
              你说话开始<strong className="text-[#c9a84c]">有分量，有温度</strong>，别人自然就愿意听，愿意信！
            </p>
          </div>
          <div className="flex items-start gap-3 bg-white rounded-xl p-4 border border-[#f0ede5]">
            <span className="text-xl flex-shrink-0">🕊️</span>
            <p className="text-sm text-[#444] leading-relaxed">
              心里那个总跟自己较劲的小人，终于跟你<strong className="text-[#c9a84c]">和解了</strong>，不再内耗，人也松弛了！
            </p>
          </div>
        </div>

        {/* VAK练习图 */}
        <img
          src={IMG.vak}
          alt="VAK感官训练"
          className="w-full rounded-xl shadow-md object-cover mt-4 mb-2"
        />
        <p className="text-center text-xs text-[#999] mb-4">VAK感官训练 · 见微知著</p>
      </div>

      {/* ── 口碑承诺 + 大合照 ── */}
      <div className="px-5 py-6">
        <div className="bg-[#1a1a1a] rounded-2xl p-5 text-center">
          <p className="text-sm text-[#fdf8ed] leading-relaxed mb-4">
            这课没投过一分钱广告，就靠着一届届学员的口口相传，从2004年开始办了今天，内容技巧与时俱进。<br/>
            <span className="text-[#c9a84c] font-medium">因为真东西，自己会说话！</span>
          </p>
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-center gap-2 text-[#fdf8ed]/90">
              <Shield size={16} className="text-[#c9a84c]" />
              <span className="text-xs">第一天上完，你觉得哪怕有一点不值，<strong className="text-[#c9a84c]">全额退款，不问理由！</strong></span>
            </div>
            <div className="flex items-center justify-center gap-2 text-[#fdf8ed]/90">
              <RefreshCw size={16} className="text-[#c9a84c]" />
              <span className="text-xs">只要你来过，以后任何一届，想回来听，<strong className="text-[#c9a84c]">终身免费！</strong></span>
            </div>
          </div>
        </div>

        {/* 大合照 */}
        <img
          src={IMG.groupPhoto}
          alt="Sino-NLP点心读书会大合照"
          className="w-full rounded-xl shadow-md object-cover mt-4 mb-2"
        />
        <p className="text-center text-xs text-[#999] mb-4">历届学员大合照</p>

        <p className="text-center text-sm font-bold text-[#1a1a1a] mt-5">
          这不只是个课，更是个机会，<br/>让你跟那个"拧巴"的自己，做个了断！！
        </p>
        <p className="text-center text-[#c9a84c] font-song mt-2 text-base">想通了，就来吧~</p>
      </div>

      {/* ── 上课安排 + 课堂图 ── */}
      <div className="px-5 py-4">
        <div className="bg-white rounded-2xl p-5 border border-[#f0ede5] text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Users size={18} className="text-[#c9a84c]" />
            <h3 className="text-sm font-bold text-[#1a1a1a]">上课安排</h3>
          </div>
          <p className="text-sm text-[#555] leading-relaxed">
            每月一次周末两天封闭上课，连续六个月，合共12天
          </p>
          <p className="text-xs text-[#999] mt-2">
            当今这样的倾囊传授式课程，你往哪里找？
          </p>
        </div>

        {/* 课堂讲课图 */}
        <img
          src={IMG.lecture}
          alt="Sino-NLP课堂讲授"
          className="w-full rounded-xl shadow-md object-cover mt-4 mb-2"
        />
        <p className="text-center text-xs text-[#999] mb-4">课堂讲授 · 亲身示范</p>
      </div>

      {/* ── 12天课程大纲 ── */}
      <div className="px-5 py-6">
        <div className="text-center mb-5">
          <h2 className="text-xl font-bold font-song text-[#1a1a1a]">12天课程大纲</h2>
          <p className="text-xs text-[#999] mt-1">点击展开每一天的精彩内容</p>
        </div>

        <div className="space-y-2.5">
          {COURSE_DAYS.map((day) => (
            <div
              key={day.day}
              className="bg-white rounded-xl border border-[#f0ede5] overflow-hidden transition-all"
            >
              <button
                onClick={() => toggleDay(day.day)}
                className={`w-full flex items-center gap-3 p-4 text-left transition-colors ${
                  expandedDay === day.day ? "bg-[#fdf8ed]" : "hover:bg-[#fdfaf2]"
                }`}
              >
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 text-sm font-bold ${
                  expandedDay === day.day
                    ? "bg-[#c9a84c] text-white"
                    : "bg-[#c9a84c]/10 text-[#c9a84c]"
                }`}>
                  {day.day}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base">{day.icon.trim()}</span>
                    <h4 className="text-sm font-bold text-[#1a1a1a]">{day.title}</h4>
                  </div>
                </div>
                {expandedDay === day.day ? (
                  <ChevronUp size={18} className="text-[#999] flex-shrink-0" />
                ) : (
                  <ChevronDown size={18} className="text-[#999] flex-shrink-0" />
                )}
              </button>
              {expandedDay === day.day && (
                <div className="px-4 pb-4 pt-1">
                  <p className="text-sm text-[#555] leading-relaxed pl-12">
                    {day.content}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── 实战技巧 + 学员画图 ── */}
      <div className="px-5 py-6">
        <div className="bg-gradient-to-br from-[#fdf8ed] to-white rounded-2xl p-5 border border-[#c9a84c]/15">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={18} className="text-[#c9a84c]" />
            <h3 className="text-sm font-bold text-[#1a1a1a]">还不够！12天里穿插的实战技巧</h3>
          </div>
          <p className="text-xs text-[#666] mb-3">即学即用，明天上班就能用的独门武器！！！</p>
          <div className="flex flex-wrap gap-2">
            {TECHNIQUES.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1.5 rounded-full bg-white border border-[#c9a84c]/20 text-xs text-[#c9a84c] font-medium"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* 学员讨论画图 */}
        <img
          src={IMG.drawing}
          alt="学员演练讨论"
          className="w-full rounded-xl shadow-md object-cover mt-4 mb-2"
        />
        <p className="text-center text-xs text-[#999] mb-4">学员演练 · 即学即用</p>
      </div>

      {/* ── 三大游戏 ── */}
      <div className="px-5 py-4">
        <div className="bg-[#1a1a1a] rounded-2xl p-5 text-center">
          <h3 className="text-sm font-bold text-[#c9a84c] mb-2">🎯 三大国际级集体游戏</h3>
          <p className="text-xs text-[#fdf8ed]/80 leading-relaxed">
            这可不是闹着玩的，这是要彻底颠覆你石头一样顽固的旧思想，<br/>
            让你在笑和泪中，亲身体验什么叫<span className="text-[#c9a84c] font-medium">脱胎换骨</span>！！！
          </p>
        </div>
      </div>

      {/* ── 用在哪 ── */}
      <div className="px-5 py-6">
        <div className="text-center mb-4">
          <h3 className="text-sm font-bold text-[#1a1a1a]">这套东西有心法有剑法，能用在哪？</h3>
          <p className="text-xs text-[#999] mt-1">只要是需要用脑子的地方，它都能派上用场</p>
        </div>
        <div className="flex flex-wrap gap-2 justify-center">
          {SCOPE.map((item) => (
            <span
              key={item}
              className="px-3 py-1.5 rounded-lg bg-white border border-[#e8e8e8] text-xs text-[#555] font-medium"
            >
              {item}
            </span>
          ))}
        </div>
        <p className="text-center text-xs text-[#999] mt-4 leading-relaxed">
          我们不搞虚的，讲授、示范、讨论，<br/>
          更多的是让你亲自演练、比赛，在玩儿中就把东西学到骨子里！
        </p>
      </div>

      {/* ── 学员心声 + 分享图 ── */}
      <div className="px-5 py-6">
        {/* 学员开心分享图 */}
        <img
          src={IMG.sharing}
          alt="学员开心分享"
          className="w-full rounded-xl shadow-md object-cover mb-5"
        />

        <div className="text-center mb-5">
          <h2 className="text-xl font-bold font-song text-[#1a1a1a]">学员心声</h2>
          <p className="text-xs text-[#999] mt-1">点击播放，听听她们的真实分享</p>
        </div>

        {/* 由上至下排列4个视频 */}
        <div className="space-y-4">
          {TESTIMONIAL_VIDEOS.map((video, index) => (
            <div key={index} className="relative rounded-xl overflow-hidden bg-black shadow-sm">
              <video
                ref={(el) => { videoRefs.current[index] = el; }}
                src={video.src}
                poster={video.poster}
                preload="none"
                controls={playingVideo === index}
                playsInline
                className="w-full aspect-video object-cover"
                onEnded={() => setPlayingVideo(null)}
              />
              {playingVideo !== index && (
                <button
                  onClick={() => handlePlayClick(index)}
                  className="absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity"
                >
                  <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center active:scale-90 transition-transform">
                    <Play size={24} className="text-[#c9a84c] ml-1" fill="currentColor" />
                  </div>
                </button>
              )}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-3 py-1.5 pointer-events-none">
                <span className="text-sm text-white font-medium">{video.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 亲自授课 + 先生图 ── */}
      <div className="px-5 py-4">
        {/* 先生讲Life Coach图 */}
        <img
          src={IMG.coach}
          alt="亦须先生亲自授课"
          className="w-full rounded-xl shadow-md object-cover mb-4"
        />
        <div className="bg-gradient-to-r from-[#c9a84c]/8 to-[#8a9bae]/8 rounded-2xl p-5 text-center border border-[#c9a84c]/15">
          <p className="text-sm text-[#444] leading-relaxed">
            我亲自授课，历届学员回炉助你成就！<br/>
            <strong className="text-[#c9a84c]">何必犹豫？立即联系</strong>
          </p>
        </div>
      </div>

      {/* ── 易拉宝 + CTA ── */}
      <div className="px-5 py-6">
        {/* 点心易拉宝 */}
        <img
          src={IMG.standee}
          alt="Sino-NLP点心课程"
          className="w-full rounded-xl shadow-md object-cover mb-5"
        />

        <a
          href="https://m.yxcactus.com/nd.jsp?mid=532&id=389"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3.5 rounded-full bg-gradient-to-r from-[#c9a84c] to-[#b89430] text-white font-bold text-sm shadow-lg shadow-[#c9a84c]/25 active:scale-95 transition-transform"
        >
          了解更多 · 报名咨询
          <ArrowRight size={16} />
        </a>
        <a
          href="tel:4007776637"
          className="flex items-center justify-center gap-2 w-full py-3 mt-3 rounded-full border border-[#c9a84c] text-[#c9a84c] font-bold text-sm active:scale-95 transition-transform"
        >
          <Phone size={15} />
          致电咨询：4007776637
        </a>
        <p className="text-center text-xs text-[#999] mt-4 leading-relaxed">
          学员持有效证书可免费终身复读<br/>
          <span className="text-[#aaa]">拒绝「鸡血」· 谢绝「鸡汤」· 绝非「教练技术」</span>
        </p>
      </div>

      {/* ── 底部 ── */}
      <div className="px-5 pt-4 pb-2 text-center">
        <p className="text-xs text-[#c9a84c] font-song">
          一个自2004年起持续举办了迈向三十届的读书会
        </p>
        <p className="text-xs text-[#999] mt-1">
          没有更改过名称、没有特别的宣传手法<br/>
          这样一个只靠口碑的课程，信誉自然是无需怀疑的了
        </p>
        <p className="text-sm text-[#8a9bae] font-song mt-4">
          亦须（Cactus Yixu）· 生命教育哲学博士
        </p>
      </div>
    </div>
  );
}
