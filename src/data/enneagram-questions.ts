// 九型人格測驗題庫
// 基於 Eclectic Energies Classical Enneagram Test 結構
// 每題對應一個或多個型號，用於計分

export interface EnneagramQuestion {
  id: number;
  text: string;
  /** 該題對應的型號加權：{ type: weight } */
  types: Record<number, number>;
}

// 型號特質速查：
// Type 1: perfectionist, strict, correcting, organized, principled, self-critical, angry at imperfection
// Type 2: helper, caring, warm, generous, need to be needed, proud, relationship-focused
// Type 3: achiever, success, admired, competitive, image-conscious, networking, efficient
// Type 4: individualistic, sensitive, melancholic, romantic, unique, emotional depth, longing
// Type 5: observer, thinker, detached, private, knowledge, minimalist, avoid emotions, fear intrusion
// Type 6: loyalist, anxious, suspicious, security, worst-case, trustworthy, authority-ambivalent
// Type 7: enthusiast, pleasure, adventure, restless, options-open, avoid pain, future-oriented
// Type 8: challenger, domineering, tough, confrontational, powerful, protective, physical appetites
// Type 9: peacemaker, easygoing, conflict-avoidant, merge, comfortable, procrastinate, self-effacing

export const enneagramQuestions: EnneagramQuestion[] = [
  // ═══ PAGE 1 ═══
  { id: 1, text: "我比大多数人更敏感；有时候这个世界似乎太残酷了。", types: { 4: 2, 5: 1 } },
  { id: 2, text: "我常常因为害怕被压垮而不敢行动。", types: { 5: 2, 6: 1, 9: 1 } },
  { id: 3, text: "我喜欢照顾别人，而且我很擅长。", types: { 2: 3 } },
  { id: 4, text: "我对自己和别人都太严格了。", types: { 1: 3 } },
  { id: 5, text: "成功、声望和认可对我来说真的很重要。", types: { 3: 3 } },
  { id: 6, text: "我不太容易沮丧，甚至几乎不会。", types: { 7: 2, 8: 1, 9: 1 } },
  { id: 7, text: "我倾向于信任大多数人。", types: { 9: 2, 2: 1 } },
  { id: 8, text: "我还没完成当前的冒险，就已经在计划下一个了。", types: { 7: 3 } },
  { id: 9, text: "我想要赢得权威人物的认可，有时即使我并不真正喜欢他们。", types: { 3: 2, 6: 1 } },

  // ═══ PAGE 2 ═══
  { id: 10, text: "被别人仰慕对我来说很重要——而且确实很多人仰慕我。", types: { 3: 3 } },
  { id: 11, text: "当别人想要我做出情感回应时，我会感到不舒服。", types: { 5: 2, 1: 1, 8: 1 } },
  { id: 12, text: "我总能看到需要纠正的地方。", types: { 1: 3 } },
  { id: 13, text: "在大多数亲密关系中，我付出多于索取。", types: { 2: 2, 9: 1 } },
  { id: 14, text: "我可能可以再多一点野心。", types: { 9: 2, 4: 1 } },
  { id: 15, text: "我很难把感受放在一边，即使是为了完成工作。", types: { 4: 3 } },
  { id: 16, text: "我相当霸道/强势。", types: { 8: 3 } },
  { id: 17, text: "我不觉得沉溺于负面情绪有多大意义。当我开始感到焦虑时，我倾向于投入分散注意力的活动中。", types: { 7: 3 } },
  { id: 18, text: "我多疑、猜忌、爱怀疑。", types: { 6: 3 } },

  // ═══ PAGE 3 ═══
  { id: 19, text: "人际关系是我生命中最重要的东西。", types: { 2: 3 } },
  { id: 20, text: "我不介意冒险；我真的很喜欢打破常规。", types: { 7: 2, 8: 1 } },
  { id: 21, text: "我是一个真正的浪漫主义者。", types: { 4: 3 } },
  { id: 22, text: "我避免表达强烈的情绪。", types: { 5: 2, 1: 1, 9: 1 } },
  { id: 23, text: "我很容易接纳别人，他们在我身边很自在，因为我不评判他们。", types: { 9: 3 } },
  { id: 24, text: "尽管这常常是不理性的，我有时会担心别人在背后议论我。", types: { 6: 3 } },
  { id: 25, text: "我比大多数人更有条理。", types: { 1: 2, 3: 1 } },
  { id: 26, text: "你的快乐和感受是你自己的责任，不是我的。", types: { 5: 2, 8: 1 } },
  { id: 27, text: "不管好坏，我会把自己和别人比较来评估自己的处境。", types: { 3: 2, 4: 1 } },

  // ═══ PAGE 4 ═══
  { id: 28, text: "我比大多数人更正式/拘谨。", types: { 1: 2, 5: 1 } },
  { id: 29, text: "规则让我烦。", types: { 7: 2, 8: 2 } },
  { id: 30, text: "我想先观察和思考，不暴露自己，然后再行动。", types: { 5: 3 } },
  { id: 31, text: "我比大多数人更有爱心。", types: { 2: 3 } },
  { id: 32, text: "虽然我自己很忠诚，但我经常担心别人对我不忠诚。", types: { 6: 3 } },
  { id: 33, text: "我相当低调，容易相处。", types: { 9: 3 } },
  { id: 34, text: "我是一个善于交际的人；我知道如何建立人脉。", types: { 3: 3 } },
  { id: 35, text: "我比大多数人更容易感到无聊；我总是在寻找新的体验。", types: { 7: 3 } },
  { id: 36, text: "我非常个人主义。", types: { 4: 3 } },

  // ═══ PAGE 5 ═══
  { id: 37, text: "我对任何可能有危险的事物都很警觉，而且我很有安全意识。", types: { 6: 3 } },
  { id: 38, text: "我不喜欢承诺。谁想被锁在某件事上，特别是如果有更好的东西出现？", types: { 7: 3 } },
  { id: 39, text: "我比大多数人更情绪化，但那是因为我的感受太强烈了。", types: { 4: 3 } },
  { id: 40, text: "当我看到别人做事马虎时，我常常感到不满。", types: { 1: 3 } },
  { id: 41, text: "我顺从别人的意愿，除非我自己有非常强烈的愿望——而我通常没有。", types: { 9: 3 } },
  { id: 42, text: "我通过慷慨地付出时间和精力来接近别人。", types: { 2: 3 } },
  { id: 43, text: "没人喜欢被侵入，但我讨厌被侵入！", types: { 5: 2, 8: 1 } },
  { id: 44, text: "我气势很强，有时会吓到别人。", types: { 8: 3 } },
  { id: 45, text: "人们被我吸引，因为我能给他们留下深刻印象。", types: { 3: 3 } },

  // ═══ PAGE 6 ═══
  { id: 46, text: "做决定时，我经常问自己「哪个选择能带来最大的享受？」", types: { 7: 3 } },
  { id: 47, text: "如果我不小心，我可能会与他人过于疏远。", types: { 5: 2, 4: 1 } },
  { id: 48, text: "我倾向于避免冲突。", types: { 9: 3 } },
  { id: 49, text: "我被情感的深度所吸引，不害怕探索内心深处。", types: { 4: 3 } },
  { id: 50, text: "我很有竞争心和野心，但我不认为自己是不择手段的人。", types: { 3: 2, 8: 1 } },
  { id: 51, text: "我对细节一丝不苟，即使是别人觉得微不足道的细节。", types: { 1: 3 } },
  { id: 52, text: "有时我在试图帮助别人时过度付出了。", types: { 2: 3 } },
  { id: 53, text: "我把人生看作一场我打算赢的战斗。", types: { 8: 3 } },
  { id: 54, text: "对我来说，感觉自己「属于某个群体」很重要。", types: { 6: 2, 9: 1 } },

  // ═══ PAGE 7 ═══
  { id: 55, text: "我是一个严重的拖延者。", types: { 9: 2, 4: 1, 7: 1 } },
  { id: 56, text: "被看作失败者会是最糟糕的事。", types: { 3: 3 } },
  { id: 57, text: "说来奇怪，但我认为悲伤中有某种美丽。", types: { 4: 3 } },
  { id: 58, text: "为了应对我一直有的恐惧，我对每个人都尽可能友善和温暖。", types: { 6: 3 } },
  { id: 59, text: "我很难省钱，因为我倾向于超支。", types: { 7: 3 } },
  { id: 60, text: "我紧紧控制着自己的脾气。", types: { 1: 2, 9: 1 } },
  { id: 61, text: "没人会说我自私！", types: { 2: 2, 9: 1 } },
  { id: 62, text: "我不倾向于过度承诺——我的时间和精力有限。", types: { 5: 2, 1: 1 } },
  { id: 63, text: "我欢迎一场好的战斗，因为它能澄清局面。", types: { 8: 3 } },

  // ═══ PAGE 8 ═══
  { id: 64, text: "如果事情不如我意，我能从中找到积极的一面。", types: { 9: 2, 7: 1 } },
  { id: 65, text: "我比大多数人更感性/多愁善感。", types: { 4: 3 } },
  { id: 66, text: "我认为在对抗中退缩是软弱的表现。", types: { 8: 3 } },
  { id: 67, text: "我几乎从不会失控。", types: { 1: 2, 5: 1 } },
  { id: 68, text: "我想被注意，但这也让我不舒服。", types: { 4: 2, 3: 1 } },
  { id: 69, text: "我积累大量知识来弥补我的不自信。", types: { 5: 2, 6: 1 } },
  { id: 70, text: "我擅长把事情做好。", types: { 3: 2, 1: 1 } },
  { id: 71, text: "通常我只关注人的积极面，因为关注消极特质或事件无助于让关系更和谐。", types: { 9: 2, 2: 1 } },
  { id: 72, text: "我总是在留意可能出错的事情。", types: { 6: 3 } },

  // ═══ PAGE 9 ═══
  { id: 73, text: "我相当坚强。", types: { 8: 2, 1: 1 } },
  { id: 74, text: "我是个头脑风暴者。每个问题我都能想出十种解决方案。", types: { 7: 2, 5: 1 } },
  { id: 75, text: "我不爱炫耀，事实上我可能太谦虚了。", types: { 9: 2, 6: 1 } },
  { id: 76, text: "赢得他人的尊重对我来说很重要。", types: { 3: 2, 8: 1 } },
  { id: 77, text: "我不表现出来，但如果我跟一个和我一样独特的人在一起，我会有点嫉妒。", types: { 4: 3 } },
  { id: 78, text: "大多数人不知道我其实很敏感，因为我倾向于隐藏自己的情绪。", types: { 5: 2, 4: 1, 1: 1 } },
  { id: 79, text: "变化——无论是换新工作还是新学校——比大多数人更容易让我焦虑。", types: { 6: 3 } },
  { id: 80, text: "别人比我更需要我的帮助，而不是我需要他们的帮助。", types: { 2: 3 } },
  { id: 81, text: "工作没做完我就无法休息。", types: { 1: 2, 3: 1 } },

  // ═══ PAGE 10 ═══
  { id: 82, text: "我有一种强迫症，即使不划算也要把事情做对。", types: { 1: 3 } },
  { id: 83, text: "我比大多数人更戏剧化。", types: { 4: 3 } },
  { id: 84, text: "我经常失去专注，因为我的注意力倾向于从主要问题上飘走。", types: { 7: 2, 9: 1 } },
  { id: 85, text: "我做重要决定需要花费相当多的时间和精力，而且我经常事后怀疑自己。", types: { 6: 3 } },
  { id: 86, text: "我想要享受生活，所以我不是很自律。", types: { 7: 3 } },
  { id: 87, text: "即使在巨大的压力下，我通常也显得平静和沉稳。", types: { 9: 2, 1: 1 } },
  { id: 88, text: "有人说我缺乏圆滑，但我认为重要的是说实话。", types: { 8: 2, 1: 1 } },
  { id: 89, text: "人们觉得我是一个温暖和富有同情心的人。", types: { 2: 2, 9: 1 } },
  { id: 90, text: "我倾向于不向别人求助，即使是对我爱的人。", types: { 5: 2, 8: 1 } },

  // ═══ PAGE 11 ═══
  { id: 91, text: "我倾向于逃入理想化的幻想世界来逃避现实。", types: { 4: 3, 9: 1 } },
  { id: 92, text: "人生就是付出和收获，所以给予爱是我生命中最重要的事。", types: { 2: 3 } },
  { id: 93, text: "我告诉别人哪里错了、他们该怎么做，这个习惯有时会惹恼他们。", types: { 1: 2, 8: 1 } },
  { id: 94, text: "我不太愿意自我袒露。", types: { 5: 2, 8: 1 } },
  { id: 95, text: "我比大多数人有更多的精力和力量。", types: { 8: 2, 3: 1 } },
  { id: 96, text: "即使我不能做到面面俱到，至少我要看起来能做到。", types: { 3: 3 } },
  { id: 97, text: "很难保持热情和专注。", types: { 7: 2, 9: 1 } },
  { id: 98, text: "人们往往不是表面上看起来的样子，所以我真的会怀疑他们的动机。", types: { 6: 3 } },
  { id: 99, text: "我通常不喜欢长时间停留在一项任务上。我会变得不安，想换到别的事情上。", types: { 7: 3 } },

  // ═══ PAGE 12 ═══
  { id: 100, text: "有时我要经过思考才知道自己真正的感受。", types: { 5: 2, 9: 1 } },
  { id: 101, text: "我为很多人依赖我而感到自豪。", types: { 2: 2, 8: 1 } },
  { id: 102, text: "我通常很容易入睡，即使在压力大时也能小睡。", types: { 9: 3 } },
  { id: 103, text: "为了成功，我愿意做任何需要做的事。", types: { 3: 3 } },
  { id: 104, text: "我行动比思考更快，所以我倾向于在还没想清楚之前就开始行动。", types: { 8: 2, 7: 1 } },
  { id: 105, text: "周围环境的美感强烈地影响我的情绪。", types: { 4: 3 } },
  { id: 106, text: "有人说我是完美主义者，我想这确实是真的。", types: { 1: 3 } },
  { id: 107, text: "我很擅长把握大局，但对细节工作没有太多耐心。", types: { 7: 2, 8: 1 } },
  { id: 108, text: "我对很多人都有复杂的感受。", types: { 6: 2, 4: 1 } },

  // ═══ PAGE 13 ═══
  { id: 109, text: "我有时会忘记做别人一直催我做的事。", types: { 9: 2, 7: 1 } },
  { id: 110, text: "虽然我珍视亲密关系，但我常常在独处时最能感受到真正的自己。", types: { 5: 2, 4: 1 } },
  { id: 111, text: "我能轻易想象所有可能出错的事情，因为我有非常生动的想象力。", types: { 6: 3 } },
  { id: 112, text: "当我到场时，派对才真正开始。", types: { 7: 2, 3: 1, 8: 1 } },
  { id: 113, text: "我对自己的表达如何影响他人有真正的敏感度，必要的话我可以调整。", types: { 3: 2, 2: 1 } },
  { id: 114, text: "我喜欢回忆过去，即使带点忧郁。", types: { 4: 3 } },
  { id: 115, text: "别人不说谢谢时，我真的很困扰。", types: { 2: 2, 1: 1 } },
  { id: 116, text: "我很少在原则上妥协。", types: { 1: 2, 8: 1 } },
  { id: 117, text: "我才不在乎道德呢，但我有我自己的一套准则。", types: { 8: 2, 7: 1 } },

  // ═══ PAGE 14 ═══
  { id: 118, text: "当我真正投入到一个激发我的智力问题时，我倾向于从情绪中抽离。", types: { 5: 3 } },
  { id: 119, text: "我暗地里害怕匮乏，害怕失去生活中美好的东西。", types: { 7: 2, 6: 1 } },
  { id: 120, text: "有时我对别人太挑剔了，但我对自己比对人更苛刻。", types: { 1: 3 } },
  { id: 121, text: "我的人生充满了一种渴望感。", types: { 4: 3 } },
  { id: 122, text: "我有时候希望别人也能照顾我一下。", types: { 2: 2, 9: 1 } },
  { id: 123, text: "我擅长激励别人。", types: { 3: 2, 8: 1 } },
  { id: 124, text: "在有争议时我能看到各方观点，所以很难选边站。", types: { 9: 3 } },
  { id: 125, text: "我有强烈的身体欲望/食欲。", types: { 8: 3 } },
  { id: 126, text: "我倾向于要么完全顺从，要么彻底反抗。", types: { 6: 2, 8: 1 } },
];
