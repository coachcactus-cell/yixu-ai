// 星宿种子性格测评 - 完整数据档
// Sino-NLP 中华身心语言学（原创：C）

// ============================================================================
// 类型定义
// ============================================================================

export type StarId = 'pleiadian' | 'sirian' | 'orion' | 'arcturian' | 'andromedan' | 'indigo' | 'lightworker';

export interface StarseedOption {
  label: string;
  emoji: string;
  desc?: string;
  scores: Partial<Record<StarId, number>>;
}

export interface StarseedQuestion {
  id: number;
  text: string;
  subtext?: string;
  type: 'single' | 'multi' | 'image' | 'element' | 'date' | 'file';
  isVoluntary?: boolean;
  options?: StarseedOption[];
}

export interface IntroSlide {
  emoji: string;
  title: string;
  text?: string;
  text2?: string;
  list?: string[];
  image?: string;
  imageCaption?: string;
  footer?: string;
  conclusion?: string;
}

export interface StarFullData {
  starFile: string;
  subTitle: string;
  traits: string[];
  talents: string[];
  mission: string;
  energy: string[];
  match: {
    best: Array<{ name: string; desc: string }>;
    caution: { name: string; desc: string };
  };
  guidance: {
    dailyPractice: string;
    environment: string;
    challenge: string;
    chakra: string;
    crystal: string;
    moonSign: string;
  };
  message: string;
}

export interface StarData {
  id: StarId;
  name: string;
  english: string;
  emoji: string;
  image: string; // TODO: 需替换为实际图片路径
  subtitle: string;
  traits: string[];
  full: StarFullData;
}

export interface FreeReport {
  starseedName: string;
  summary: string;
  traits: string[];
  unlockReasons: string[];
}

export interface PremiumReport {
  profile: { galaxy: string; summary: string };
  strengths: Array<{ name: string; detail: string }>;
  growthTopics: Array<{ weakness: string; detail: string; opposite: string; practice: string }>;
  actionPlan: { daily: string; weekly: string; breakLimit: string };
  pairing: { best: string; challenge: string };
  guidance: { chakra: string; crystal: string; zodiac: string };
}

export interface ReportContent {
  free: FreeReport;
  premium: PremiumReport;
}

export interface StarseedResult {
  starId: StarId;
  star: StarData;
  report: ReportContent;
  scores: Record<StarId, number>;
  sortedScores: Array<{ id: StarId; score: number }>;
}

// ============================================================================
// INTRO_SLIDES — 5 页科普
// ============================================================================

export const INTRO_SLIDES: IntroSlide[] = [
  {
    emoji: '🌌',
    title: '你有没试过⋯⋯？',
    list: [
      '静静这么望住夜空，觉得自己的灵魂好似不属于这个世界？',
      '绂常发梦见到星空、外星飞船、或者神秘的星际旅程？',
      '对古文明、金字塔、麦田圈、史前遗迹有种说不出的著迷？',
      '觉得自己的人生使命不止是上班、凑仔、还房贷，而是有更重要的东西等紧你？',
    ],
    footer: '如果你中了以上任何一条，恭喜你，你可能不止是一个普通的地球人，你的灵魂，可能来自星际。',
  },
  {
    emoji: '⭐',
    title: '什么是星宿种子？',
    text: '「星宿种子」是一个源自新时代（New Age）灵性运动的概念。他的核心意思是：有一些灵魂，他们的故乡并不在地球，而是来自其他星系、星团、甚至更高维度的空间。这些灵魂带住特定的使命和任务，自愿降生到地球，帮助人类和地球提升意识。',
    text2: '不好误会，他们不是著太空衣、揸飞船的外星人，他们和你一样是人类，有血肉之躯，会喊会笑。只是在灵魂层面，他们对星际有种深层的「乡愁」。',
    conclusion: '简单说：他们的身体在地球，但灵魂的故乡在星际。',
  },
  {
    emoji: '🏛️',
    title: '古文明都有类似概念',
    list: [
      '古印度脉轮系统：人体有七大脉轮，每个对应不同星体能量，顶轮对应天狼星，眉心轮对应昴宿星⋯⋯古人早就知道人体和星体相连。',
      '中国古代星宿文化：二十八宿、北斗七星、紫微星，古中国人相信天上的星宿主宰住地上的命运，天上每一粒星都对应一个人。',
      '玛雅文明：玛雅人拥有惊人的天文知识，玛雅祭司的知识就是来自星际。',
      '埃及文明：金字塔的方位对应猎户座腰带三星，天狼星的升起标志住尼罗河的泛滥，古埃及人将天狼星奉为神圣之星。',
    ],
    conclusion: '这么多文明，相隔万里，都指向同一个方向：人类和星际之间，存在住深层的连结。',
  },
  {
    emoji: '🔮',
    title: '这个测评做什么？',
    text: '这个测评是为了帮你找出，你的灵魂最接近哪个星族。',
    text2: '完成27条问题之后，你会知道自己属于以下七种星宿种子类型之一：',
    list: [
      '七姊妹星人（Pleiadian）， 温柔的疗愈者',
      '天狼星人（Sirian）， 古老智慧的守护者',
      '猎户星人（Orion）， 战士与建设者',
      '大角星人（Arcturian）， 高维度的智者',
      '仙女星人（Andromedan）， 跨维度的旅者',
      '靛蓝星人（Indigo）， 改革者',
      '光明星人（LightWorker）， 光的使者',
    ],
    image: 'images/group_photo.jpg', // TODO: 需替换为实际图片路径
    imageCaption: ' 七大星宿种子大合照',
    conclusion: '每个类型都有不同的性格特质、天赋使命、对应星宿，还有专属占星配对。',
  },
  {
    emoji: '',
    title: '补充说明',
    list: [
      '⚠️ 这个不是科学诊断工具，而是一套自我认识的灵性工具。',
      '😊 你可以当他是一个心理测验来玩，信则有，不信都几好玩。',
      '🧘 回答的时候放松心情，凭直觉选择就得，不用想太多。',
      '🌌 无论结果是什么类型，记住：每一个灵魂都是独一无二的，你的价值不需要由任何测验去定义。',
    ],
  },
];

// ============================================================================
// QUESTIONS — 27 题
// ============================================================================

export const QUESTIONS: StarseedQuestion[] = [
  {
    id: 1,
    text: '你有没觉得自己的灵魂好似以前在地球生活过？',
    type: 'single',
    options: [
      { label: '强烈感觉，我好肯定我前世做过人', emoji: '🌀', scores: { pleiadian: 1, sirian: 1 } },
      { label: '有些模糊的感觉，但不肯定', emoji: '🔮', scores: { arcturian: 1, orion: 1 } },
      { label: '未试过，这一世就是第一次', emoji: '🌍', scores: { indigo: 1 } },
      { label: '不知道，我对前世没什么感觉', emoji: '❓', scores: { lightworker: 1, andromedan: 1 } },
    ],
  },
  {
    id: 2,
    text: '其他人通常怎样形容你的气场／能量？',
    type: 'single',
    options: [
      { label: '平静、温柔、让人放松', emoji: '🕊️', scores: { pleiadian: 1 } },
      { label: '强烈、有存在感、让人注意', emoji: '⚡', scores: { indigo: 1, orion: 1 } },
      { label: '神秘、难以捉摸', emoji: '🌙', scores: { andromedan: 1 } },
      { label: '温暖、让人想亲近', emoji: '☀️', scores: { lightworker: 1, pleiadian: 1 } },
      { label: '古怪、和大家不一样', emoji: '🌈', scores: { andromedan: 1, indigo: 1 } },
    ],
  },
  {
    id: 3,
    text: '你对自己的童年记不记得清楚？',
    type: 'single',
    options: [
      { label: '很清楚，连好细个的片段都记得', emoji: '🧒', scores: { pleiadian: 1, sirian: 1 } },
      { label: '记得一些重要片段，但不是全部', emoji: '📸', scores: { orion: 1 } },
      { label: '比较模糊，得几件大事有印象', emoji: '🌫️', scores: { arcturian: 1 } },
      { label: '几乎不记得，好似发过的梦一样', emoji: '💭', scores: { andromedan: 1, lightworker: 1 } },
    ],
  },
  {
    id: 4,
    text: '在人多的地方你觉得怎样？',
    type: 'single',
    options: [
      { label: '很不舒服，想快些离开', emoji: '😰', scores: { arcturian: 1, indigo: 1 } },
      { label: '可以忍受，但要绂常抖下呼吸', emoji: '😮‍💨', scores: { pleiadian: 1, andromedan: 1 } },
      { label: '没什么感觉，人多咪人多', emoji: '😌', scores: { orion: 1 } },
      { label: '反而觉得有能量，愈多人愈兴奋', emoji: '🎉', scores: { lightworker: 1, sirian: 1 } },
    ],
  },
  {
    id: 5,
    text: '你在大自然里面的感觉是点？',
    type: 'single',
    options: [
      { label: '好似回了屋企一样，很自在', emoji: '🌿', scores: { pleiadian: 1 } },
      { label: '感觉被疗愈，身心都放松晒', emoji: '🍃', scores: { lightworker: 1 } },
      { label: '好靓，但没什么特别感觉', emoji: '🌳', scores: { arcturian: 1 } },
      { label: '会和动物和植物有无声的交流', emoji: '🌺', scores: { pleiadian: 1 } },
    ],
  },
  {
    id: 6,
    text: '当你抬头望住夜空的时候，你有什么感觉？',
    type: 'single',
    options: [
      { label: '强烈的思乡感，好似星那边先是我的家', emoji: '✨', scores: { pleiadian: 1, andromedan: 1 } },
      { label: '深层的平静，望住星星就安落晒', emoji: '🌌', scores: { arcturian: 1, lightworker: 1 } },
      { label: '好奇，想知宇宙里面有什么', emoji: '🌠', scores: { sirian: 1, orion: 1 } },
      { label: '觉得自己很渺小，有些敬畏', emoji: '🌃', scores: { indigo: 1 } },
      { label: '没什么特别感觉', emoji: '🌑', scores: { orion: 1 } },
    ],
  },
  {
    id: 7,
    text: '动物是咪特别喜欢黐住你？',
    type: 'single',
    options: [
      { label: '是！动物绂常主动走向我，不怕我', emoji: '🐾', scores: { pleiadian: 1 } },
      { label: '有些动物会，例如猫和狗特别喜欢我', emoji: '🐱', scores: { lightworker: 1 } },
      { label: '不太觉，动物对我没什么特别', emoji: '😐', scores: { arcturian: 1 } },
      { label: '反而有些动物会避开我', emoji: '🦊', scores: { indigo: 1 } },
    ],
  },
  {
    id: 8,
    text: '你对眼是什么颜色？',
    type: 'single',
    options: [
      { label: '蓝色／灰色', emoji: '👁️', scores: { pleiadian: 1, andromedan: 1 } },
      { label: '绿色／啡绿色', emoji: '👁️', scores: { sirian: 1 } },
      { label: '啡色／深啡色', emoji: '👁️', scores: { orion: 1 } },
      { label: '黑色', emoji: '👁️', scores: { indigo: 1 } },
      { label: '其他（琥珀色、紫色、异色瞳等）', emoji: '👁️', scores: { andromedan: 1, lightworker: 1 } },
    ],
  },
  {
    id: 9,
    text: '你有没觉得自己有一种强烈的使命感？',
    type: 'single',
    options: [
      { label: '有！我很清楚我来到这个世界有任务要完成', emoji: '🔥', scores: { indigo: 1, orion: 1 } },
      { label: '有些感觉，但未清楚具体是什么', emoji: '🤔', scores: { sirian: 1 } },
      { label: '有时会想，但不是绂常', emoji: '💭', scores: { pleiadian: 1, lightworker: 1 } },
      { label: '没什么使命感，活在当下就够', emoji: '🧘', scores: { arcturian: 1 } },
    ],
  },
  {
    id: 10,
    text: '你觉得自己的能量可以疗愈或者提升其他人吗？',
    type: 'single',
    options: [
      { label: '是，绂常有人说和我聊完计就舒服晒', emoji: '💚', scores: { pleiadian: 1, lightworker: 1 } },
      { label: '有时会，尤其是对方需要支持的时候', emoji: '🤲', scores: { sirian: 1 } },
      { label: '不太觉，我没什么特别的疗愈能力', emoji: '😐', scores: { orion: 1, arcturian: 1 } },
      { label: '我只是想做好自己，没想过影响人', emoji: '🙃', scores: { andromedan: 1, indigo: 1 } },
    ],
  },
  {
    id: 11,
    text: '你是咪好绂常觉得自己格格不入，就算在人群里面都是这么？',
    type: 'single',
    options: [
      { label: '绂常都是，我从来未试过真正融入过', emoji: '😔', scores: { andromedan: 1, indigo: 1 } },
      { label: '很多时候，我绂常觉得自己和人们不同', emoji: '🤷', scores: { arcturian: 1 } },
      { label: '有时会，但都有融入得到的时候', emoji: '🌊', scores: { pleiadian: 1 } },
      { label: '很少，我通常和大家打成一片', emoji: '🫂', scores: { lightworker: 1, sirian: 1 } },
    ],
  },
  {
    id: 12,
    text: '你有没绂历过很真实的梦或者清醒梦？',
    type: 'single',
    options: [
      { label: '绂常有！我在梦里面知道自己发紧梦', emoji: '🌠', scores: { andromedan: 1, arcturian: 1 } },
      { label: '有时会，梦境好清晰、很真实', emoji: '🌙', scores: { pleiadian: 1, lightworker: 1 } },
      { label: '很少，多数不记得发过什么梦', emoji: '😴', scores: { orion: 1 } },
      { label: '未试过清醒梦，但梦境有时好有意义', emoji: '💭', scores: { sirian: 1 } },
    ],
  },
  {
    id: 13,
    text: '你有没留意过自己身上有什么特别的标记或者印？',
    type: 'single',
    options: [
      { label: '有！胎记、痣或者疤痕的排列好特别', emoji: '✦', scores: { andromedan: 1, pleiadian: 1 } },
      { label: '有些不寻常的标记，但不肯还是咪有意义', emoji: '✧', scores: { sirian: 1 } },
      { label: '没什么特别，就是正常皮肤', emoji: '🧴', scores: { orion: 1, arcturian: 1 } },
      { label: '我没留意过这些东西', emoji: '🤷', scores: { indigo: 1, lightworker: 1 } },
    ],
  },
  {
    id: 14,
    text: '你对灵性和神秘学有什么感觉？',
    type: 'single',
    options: [
      { label: '很强烈的连结，这些东西是我人生的一部分', emoji: '🔮', scores: { sirian: 1, pleiadian: 1 } },
      { label: '好有兴趣，绂常看这方面的资讯', emoji: '📚', scores: { arcturian: 1, andromedan: 1 } },
      { label: '有些好奇，但不是好投入', emoji: '🌫️', scores: { lightworker: 1 } },
      { label: '没什么兴趣，我觉得不科学', emoji: '🤨', scores: { orion: 1, indigo: 1 } },
    ],
  },
  {
    id: 15,
    text: '你怎样看死亡这样东西？',
    type: 'single',
    options: [
      { label: '只是灵魂的一次转变，不是终结', emoji: '🔄', scores: { pleiadian: 1, sirian: 1 } },
      { label: '回归宇宙／源头，回去真正的家', emoji: '☁️', scores: { arcturian: 1, andromedan: 1 } },
      { label: '自然的循环，生老病死好正常', emoji: '🍂', scores: { orion: 1 } },
      { label: '有些恐惧，不想想太多', emoji: '😟', scores: { indigo: 1, lightworker: 1 } },
    ],
  },
  {
    id: 16,
    text: '就算人们对你不好，你是咪依然聊向保持善良？',
    type: 'single',
    options: [
      { label: '是，我不会因为人们点对我而改变自己', emoji: '💖', scores: { pleiadian: 1, lightworker: 1 } },
      { label: '大部分时候是，但我都有底绠', emoji: '🛡️', scores: { sirian: 1 } },
      { label: '人们对我不好，我自然会防备', emoji: '🧱', scores: { arcturian: 1 } },
      { label: '以牙还牙，人点对我我点对人', emoji: '⚔️', scores: { orion: 1, indigo: 1 } },
    ],
  },
  {
    id: 17,
    text: '以下哪些活动可以点燃你的创意火花？（可以选择多个）',
    type: 'multi',
    options: [
      { label: '写作、诗词、日记', emoji: '✍️', scores: { pleiadian: 1, sirian: 1 } },
      { label: '画画、手工、设计', emoji: '🎨', scores: { andromedan: 1, pleiadian: 1 } },
      { label: '音乐、唱歌、乐器', emoji: '🎵', scores: { lightworker: 1 } },
      { label: '跳舞、身体表达', emoji: '💃', scores: { andromedan: 1 } },
      { label: '摄影、拍片', emoji: '📸', scores: { arcturian: 1 } },
      { label: '煮食、园艺', emoji: '🍳', scores: { pleiadian: 1 } },
      { label: '阅读、研究', emoji: '📖', scores: { sirian: 1, arcturian: 1 } },
      { label: '冥想、瑜伽', emoji: '🧘', scores: { lightworker: 1 } },
    ],
  },
  {
    id: 18,
    text: '对你来说，个人成长意味住些什么？',
    type: 'single',
    options: [
      { label: '觉醒，认识真实的自己', emoji: '🔆', scores: { andromedan: 1, lightworker: 1 } },
      { label: '学习，不断吸收新知识', emoji: '📚', scores: { sirian: 1, arcturian: 1 } },
      { label: '突破，跳出舒适圈', emoji: '🚀', scores: { orion: 1, indigo: 1 } },
      { label: '服务，用自己的能力帮助人', emoji: '🤝', scores: { pleiadian: 1 } },
      { label: '平衡，身心灵合一', emoji: '🕊️', scores: { lightworker: 1 } },
    ],
  },
  {
    id: 19,
    text: '以下哪种方式最能够帮你连结内心的神圣力量？',
    type: 'image',
    options: [
      { label: '冥想和静坐', emoji: '🔮', scores: { arcturian: 1 } },
      { label: '蜡烛、香薰、仪式', emoji: '🕯️', scores: { sirian: 1 } },
      { label: '大自然漫步', emoji: '🌿', scores: { pleiadian: 1 } },
      { label: '颂钵、音乐、唱诵', emoji: '🎵', scores: { lightworker: 1 } },
      { label: '占星、塔罗、水晶', emoji: '⭐', scores: { sirian: 1 } },
      { label: '跳舞、自由律动', emoji: '💃', scores: { andromedan: 1 } },
      { label: '艺术创作', emoji: '🖌️', scores: { andromedan: 1 } },
      { label: '祈祷、感恩练习', emoji: '🙏', scores: { lightworker: 1 } },
    ],
  },
  {
    id: 20,
    text: '以下四种元素，哪个最符合你的性格？',
    type: 'element',
    options: [
      { label: '火', emoji: '🔥', desc: '热情、行动力强、充满活力', scores: { orion: 1, indigo: 1 } },
      { label: '水', emoji: '💧', desc: '感性、直觉强、温柔流动', scores: { pleiadian: 1 } },
      { label: '风', emoji: '🌬️', desc: '理性、爱思考、喜欢沟通', scores: { arcturian: 1, andromedan: 1 } },
      { label: '土', emoji: '🌍', desc: '踏实、稳定、落地', scores: { sirian: 1, lightworker: 1 } },
    ],
  },
  {
    id: 21,
    text: '你通常怎样表达自己的情绪？',
    type: 'single',
    options: [
      { label: '直接表达，不收收埋埋', emoji: '🗣️', scores: { orion: 1, indigo: 1 } },
      { label: '会写低或者用艺术表达', emoji: '📝', scores: { andromedan: 1, pleiadian: 1 } },
      { label: '收收埋埋，等自己一个人先处理', emoji: '🧊', scores: { arcturian: 1 } },
      { label: '透过行动去表达', emoji: '🏃', scores: { orion: 1 } },
      { label: '情绪波动很大，自己都控制不到', emoji: '🌊', scores: { indigo: 1, pleiadian: 1 } },
    ],
  },
  {
    id: 22,
    text: '你在什么时候觉得自己最有力量？',
    type: 'single',
    options: [
      { label: '独处，和自己内在连结的时候', emoji: '🧘', scores: { arcturian: 1, andromedan: 1 } },
      { label: '帮助到其他人的时候', emoji: '🤲', scores: { pleiadian: 1, lightworker: 1 } },
      { label: '学到新东西、领悟到真理的时候', emoji: '💡', scores: { sirian: 1 } },
      { label: '在大自然里面的时候', emoji: '🌲', scores: { pleiadian: 1 } },
      { label: '创作、表达自己的时候', emoji: '🎨', scores: { andromedan: 1 } },
    ],
  },
  {
    id: 23,
    text: '关系在你人生里面扮演什么角色？',
    type: 'single',
    options: [
      { label: '灵魂伴侣，追求深层的灵魂连结', emoji: '💞', scores: { pleiadian: 1, lightworker: 1 } },
      { label: '镜子，关系是我成长的工具', emoji: '🪞', scores: { arcturian: 1, sirian: 1 } },
      { label: '陪伴，开心就一齐，不勉强', emoji: '🤗', scores: { andromedan: 1 } },
      { label: '使命，和对的人一齐做有意义的事', emoji: '👫', scores: { orion: 1, indigo: 1 } },
      { label: '可有可无，我一个人已绂好完整', emoji: '🧑‍🤝‍🧑', scores: { arcturian: 1 } },
    ],
  },
  {
    id: 24,
    text: '人们绂常怎样形容你？',
    type: 'single',
    options: [
      { label: '温柔、有爱心', emoji: '🕊️', scores: { pleiadian: 1 } },
      { label: '聪明、有智慧', emoji: '🧠', scores: { sirian: 1, arcturian: 1 } },
      { label: '强势、有领导力', emoji: '👑', scores: { orion: 1, indigo: 1 } },
      { label: '古怪、与众不同', emoji: '🦄', scores: { andromedan: 1 } },
      { label: '神秘、难以捉摸', emoji: '🌙', scores: { arcturian: 1 } },
      { label: '开朗、正能量满满', emoji: '☀️', scores: { lightworker: 1 } },
    ],
  },
  {
    id: 25,
    text: '你怎样看自己在这个世界的角色？',
    type: 'single',
    options: [
      { label: '疗愈者，用爱安慰受伤的人', emoji: '💚', scores: { pleiadian: 1 } },
      { label: '导师，用知识启发他人', emoji: '📖', scores: { sirian: 1 } },
      { label: '战士，用行动改变不公', emoji: '⚔️', scores: { orion: 1 } },
      { label: '智者，用智慧指引方向', emoji: '🧭', scores: { arcturian: 1 } },
      { label: '改革者，打破旧有框架', emoji: '🔨', scores: { indigo: 1, andromedan: 1 } },
      { label: '光之使者，用光亮照亮黑暗', emoji: '✨', scores: { lightworker: 1 } },
    ],
  },
  {
    id: 26,
    text: '请选择你的出生日期',
    subtext: '日期将会用于占星配对分析',
    type: 'date',
  },
  {
    id: 27,
    text: '请上传你的手掌相片',
    subtext: '拍摄你的惯用手（写字那只手）的手掌，确保光绠充足，手掌清晰可见。手相资讯将会结合你的星宿种子类型，提供更深入的个人解读。',
    type: 'file',
    isVoluntary: true,
  },
];

// ============================================================================
// STARS — 7 大星人
// ============================================================================

export const STARS: Record<StarId, StarData> = {
  pleiadian: {
    id: 'pleiadian',
    name: '七姊妹星人',
    english: 'Pleiadian',
    emoji: '⭐',
    image: 'images/pleiadian.jpg', // TODO: 需替换为实际图片路径
    subtitle: '温柔的疗愈者，带著星际的爱来到人间。',
    traits: [
      '富有同情心，见到人受苦自己都会心痛',
      '直觉超强，绂常「感觉到」人们的情绪',
      '喜欢帮助人，做义工、助人这些东西完全不介意',
      '对大自然很敏感，在大自然里面好似回了乡下',
      '讨厌冲突，宁愿自己让步都不想闹交',
    ],
    full: {
      starFile: '昴宿星团（Pleiades），又名七姊妹星，位于金牛座。在中国古代星宿系统中，昴宿是西方白虎七宿之一。',
      subTitle: '温柔的疗愈者，带著星际的爱来到人间。',
      traits: [
        '✓ 富有同情心，见到人受苦自己都会心痛',
        '✓ 直觉超强，绂常「感觉到」人们的情绪',
        '✓ 喜欢帮助人，做义工、助人这些东西完全不介意',
        '✓ 对大自然很敏感，在大自然里面好似回了乡下',
        '✓ 讨厌冲突，宁愿自己让步都不想闹交',
      ],
      talents: [
        '💚 疗愈能力，无论是情感疗愈还是能量疗愈，他们都有天分',
        '💚 沟通能力，善于倾听，说说温柔有力量',
        '💚 艺术创造力，音乐、绘乐、绘画、写作，他们的创作总是带住爱',
        '💚 直觉感知，不用说出口，他们就知你在想什么',
      ],
      mission: '用爱和温柔去疗愈这个世界，这个就是七姊妹星人最核心的使命。他们来到地球，是为了用他们的同理心去触动人心，唤醒人类内心深处的柔软和善良。',
      energy: [
        '🥰 和所爱的人一齐',
        '🌿 亲近大自然',
        '🎶 听音乐、创作',
        '🧘 冥想、灵性练习',
      ],
      match: {
        best: [
          { name: '光明星人', desc: '情感互补，一个疗愈，一个发光，互相滋养' },
          { name: '仙女星人', desc: '同行者，一个感性，一个创意，共同创造美好' },
          { name: '天狼星人', desc: '互相支持，一个温柔，一个智慧，彼此学习成长' },
        ],
        caution: { name: '猎户星人', desc: '猎户星人的直接和强势可能会让你感到压力。学习设立界绠，不好为了和谐而委屈自己。' },
      },
      guidance: {
        dailyPractice: '每日冥想10分钟，想像绿色疗愈之光包围全身',
        environment: '植栽丰富、柔和色调、有自然光的空间',
        challenge: '学懂说「不」，你的温柔不等于要委屈自己',
        chakra: '❤️ 心心轮（绿色）',
        crystal: '💎 粉晶、祖母绿、玫瑰石英',
        moonSign: '🌙 月亮在巨蟹座、天秤座、双鱼座',
      },
      message: '亲爱的七姊妹星人，你是星际的母亲。你的怀抱就是风雨里面的避风港，你的温暖足以融化最冰冷的心。世界需要你，请继续用你的爱去拥抱每一颗需要疗愈的灵魂。💖',
    },
  },
  sirian: {
    id: 'sirian',
    name: '天狼星人',
    english: 'Sirian',
    emoji: '💡',
    image: 'images/sirian.jpg', // TODO: 需替换为实际图片路径
    subtitle: '古老智慧的守护者，带著远古知识转世到人间。',
    traits: [
      '聪明，学习能力超强，很快就掌握新知识',
      '对古文明、神说、神秘学有浓厚兴趣',
      '有自然的领导力，人们会自然跟随他',
      '喜欢分享知识，做老师、导师、教练都好适合',
      '有些挑剔，对细节好说究，追求精准',
    ],
    full: {
      starFile: '天狼星（Sirius），全天最亮的恒星，位于大犬座。古埃及人将天狼星视为神圣之星，古埃及金字塔和寺庙的设计，很多都和天狼星有关。',
      subTitle: '古老智慧的守护者，带著远古知识转世到人间。',
      traits: [
        '✓ 聪明，学习能力超强，很快就掌握新知识',
        '✓ 对古文明、神说、神秘学有浓厚兴趣',
        '✓ 有自然的领导力，人们会自然跟随他',
        '✓ 喜欢分享知识，做老师、导师、教练都好适合',
        '✓ 有些挑剔，对细节好说究，追求精准',
      ],
      talents: [
        '📚 教学能力，擅长将复杂的东西简单说解',
        '📚 组织能力，管理、规划、统筹都难不到他',
        '📚 神秘学知识，对古埃及、亚特兰提斯、占星、炼金术有天分',
        '📚 鉴别能力，一眼看穿真假，不容易被误导',
      ],
      mission: '传承远古智慧，引导人类醒觉。天狼星人是星际的图书馆管理员，他们记住人类最古老的知识，在适当的时候将他传播出去。',
      energy: [
        '📖 阅读、研究古文明',
        '🏛️ 参观博物馆、古迹',
        '👥 教导他人、分享知识',
        '🔮 占星、塔罗等神秘学实践',
      ],
      match: {
        best: [
          { name: '大角星人', desc: '智力共鸣，两个智者相遇，话题永远说不完' },
          { name: '七姊妹星人', desc: '互相支持，一个智慧，一个温柔，彼此学习成长' },
          { name: '光明星人', desc: '合作伙伴，知识和光芒结合，影响力倍增' },
        ],
        caution: { name: '靛蓝星人', desc: '靛蓝星人的反叛和激进可能和你的传统智慧产生冲突。试著互相理解，各有各的价值。' },
      },
      guidance: {
        dailyPractice: '每日花30分钟阅读学习，记低你的发现和领悟',
        environment: '书房、图书馆、有历史感的空间',
        challenge: '放下「我对晒」的心态，接受别人有不同的观点',
        chakra: '👁️ 眉心轮（靛蓝色）',
        crystal: '💎 青金石、蓝宝石、紫水晶',
        moonSign: '🌙 月亮在处女座、摩羯座、天蝎座',
      },
      message: '亲爱的天狼星人，你是星际的导师。知识就是你的力量，智慧就是你的武器。不好怕你的见解太深奥，这个世界需要你的智慧。去分享、去教导、去点亮他人的心灵吧！💡',
    },
  },
  orion: {
    id: 'orion',
    name: '猎户星人',
    english: 'Orion',
    emoji: '⚔️',
    image: 'images/orion.jpg', // TODO: 需替换为实际图片路径
    subtitle: '战士与建设者，用力量创造新世界。',
    traits: [
      '行动力超强，想到就去做，不会拖泥带水',
      '正义感很强，见到不公平的东西会忍不住出声',
      '喜欢挑战，愈难的东西愈有兴趣',
      '目标导向，设定了目标就会排除万难去达成',
      '有些固执，认定了的东西好难改变',
    ],
    full: {
      starFile: '猎户座（Orion），其中三粒腰带星是晚上最容易辨认的星群之一。在中国星宿系统对应参宿。古埃及金字塔的排列据说就是模仿猎户座腰带三星。',
      subTitle: '战士与建设者，用力量创造新世界。',
      traits: [
        '✓ 行动力超强，想到就去做，不会拖泥带水',
        '✓ 正义感很强，见到不公平的东西会忍不住出声',
        '✓ 喜欢挑战，愈难的东西愈有兴趣',
        '✓ 目标导向，设定了目标就会排除万难去达成',
        '✓ 有些固执，认定了的东西好难改变',
      ],
      talents: [
        '⚔️ 领导力，战士领袖，可以带领团队冲锋陷阵',
        '⚔️ 战斗精神，不怕困难，愈战愈勇',
        '⚔️ 建设能力，不止破坏，更擅长重建新系统',
        '⚔️ 勇气，敢做其他人不敢做的事',
      ],
      mission: '用力量保护弱小，用行动改变世界。猎户星人是星际的战士，他们不怕冲突，因为他们知道有时必须绂过战斗，先可以迎来和平。',
      energy: [
        '🏋️ 运动、健身、体能挑战',
        '🎯 达成目标的成就感',
        '🛡️ 为正义发声、保护他人',
        '🔥 竞争、比赛、证明自己',
      ],
      match: {
        best: [
          { name: '靛蓝星人', desc: '同行战友，和样充满力量，并肩作战改变世界' },
          { name: '光明星人', desc: '情感互补，战士需要光的指引，光需要战士的保护' },
          { name: '天狼星人', desc: '合作伙伴，战略和战术的完美配合' },
        ],
        caution: { name: '七姊妹星人', desc: '你的直接可能让温柔的他感到压力。试著放慢脚步，用心倾听。' },
      },
      guidance: {
        dailyPractice: '每日做运动释放多余能量，建立规律的训练习惯',
        environment: '开放空间、户外、有挑战性的环境',
        challenge: '学习柔软，不是所有问题都需要用力量解决',
        chakra: '🔴 海底轮（红色）',
        crystal: '💎 红宝石、石榴石、血石',
        moonSign: '🌙 月亮在白羊座、狮子座、人马座',
      },
      message: '亲爱的猎户星人，你是星际的战士。你的勇气可以移山倒海，你的决心可以改变命运。不好收起你的力量，这个世界需要你的正义同行动。用你的火焰去照亮黑暗，用你的剑去保护需要保护的人！⚔️💪',
    },
  },
  arcturian: {
    id: 'arcturian',
    name: '大角星人',
    english: 'Arcturian',
    emoji: '🔭',
    image: 'images/arcturian.jpg', // TODO: 需替换为实际图片路径
    subtitle: '高维度的智者，从更高角度俯瞰人间。',
    traits: [
      '理性冷静，遇上突发事件都不会慌',
      '善于分析，喜欢将复杂问题拆解来看',
      '对科技、宇宙、量子物理这类话题特别有兴趣',
      '喜欢独处，觉得一个人静静先是最好的充电方式',
      '有些抽离，有时给人觉得「不是好关世事」',
    ],
    full: {
      starFile: '大角星（Arcturus），位于牧夫座，是北半球夜晚最亮的恒星之一。在中国古代，大角星是北斗七星指引的重要标志星。',
      subTitle: '高维度的智者，从更高角度俯瞰人间。',
      traits: [
        '✓ 理性冷静，遇上突发事件都不会慌',
        '✓ 善于分析，喜欢将复杂问题拆解来看',
        '✓ 对科技、宇宙、量子物理这类话题特别有兴趣',
        '✓ 喜欢独处，觉得一个人静静先是最好的充电方式',
        '✓ 有些抽离，有时给人觉得「不是好关世事」',
      ],
      talents: [
        '🧠 直觉智慧，不是感性直觉，而是好似电脑快速运算那种直觉',
        '🧠 科技感应，对电子产品、电脑系统特别有天分',
        '🧠 疗愈能力，擅长能量疗愈、灵气等高科技疗愈法',
        '🧠 宇宙视野，看东西的角度总是比人高一个维度',
      ],
      mission: '用智慧引导人类进化。大角星人是星际的科学家和思想家，他们来到地球是为了帮助人类提升意识层次，用理性和智慧去解开宇宙的奥秘。',
      energy: [
        '🔬 研究、分析、解难',
        '💻 科技、编程、电子产品',
        '🧘 深度冥想、出体绂验',
        '📡 天文学、宇宙学',
      ],
      match: {
        best: [
          { name: '天狼星人', desc: '智力共鸣，两个智者相遇，话题永远说不完' },
          { name: '仙女星人', desc: '创意拍档，理性和创意的火花，产生无限可能' },
          { name: '光明星人', desc: '成长拍档，智慧需要光芒去照亮，光芒需要智慧去引导' },
        ],
        caution: { name: '猎户星人', desc: '猎户的行动力和你的分析速度可能不同步。学习适应不同节奏。' },
      },
      guidance: {
        dailyPractice: '每日深度冥想15分钟，练习连结高维度意识',
        environment: '安静、整洁、有科技感的空间，光绠柔和',
        challenge: '融入人群，智慧需要和人心连结先有意义',
        chakra: '💜 顶轮（紫色/白色）',
        crystal: '💎 紫水晶、白水晶、萤石',
        moonSign: '🌙 月亮在水瓶座、双子座、天秤座',
      },
      message: '亲爱的大角星人，你是星际的智者。你的眼光超越时空，你的智慧穿越维度。不怕你太理性、太抽离，这个世界正正需要你的冷静和远见。用你的智慧去引导迷路的灵魂，用你的视野去照亮人类的前路！🔭🪐',
    },
  },
  andromedan: {
    id: 'andromedan',
    name: '仙女星人',
    english: 'Andromedan',
    emoji: '🚀',
    image: 'images/andromedan.jpg', // TODO: 需替换为实际图片路径
    subtitle: '跨维度的旅者，带著宇宙的视野来到地球。',
    traits: [
      '创意无限，脑里面永远有想不完的新点子',
      '和其他人很不同，由细到大都觉得自己「怪怪的」',
      '很喜欢自由，最怕给人管、给人限制',
      '讨厌传统束缚，觉得规矩是用来打破的',
      '思想很前卫，绂常想到十年后先会流行的东西',
    ],
    full: {
      starFile: '仙女座星系（Andromeda Galaxy，M31），是离银河系最近的大星系，亦是肉眼可见最远的天体之一。在中国古星宿中，仙女座区域对应奎宿和娄宿。',
      subTitle: '跨维度的旅者，带著宇宙的视野来到地球。',
      traits: [
        '✓ 创意无限，脑里面永远有想不完的新点子',
        '✓ 和其他人很不同，由细到大都觉得自己「怪怪的」',
        '✓ 很喜欢自由，最怕给人管、给人限制',
        '✓ 讨厌传统束传统束缚，觉得规矩是用来打破的',
        '✓ 思想很前卫，绂常想到十年后先会流行的东西',
      ],
      talents: [
        '🎨 创造力，创意爆发，灵感好似瀑布这么流',
        '🎨 远见，可以看到未来趋势，有预言家特质',
        '🎨 跨文化沟通，对不同文化、种族、背景的人都能自然连结',
        '🎨 独立思考，不会被主流意见左右，有自己的判断',
      ],
      mission: '打破框架，带来全新视角。仙女星人是星际的探险家和改革者，他们来到地球是为了引入全新的思维方式，打破人类固有的限制性信念。',
      energy: [
        '🌈 创作、设计、任何形式的艺术',
        '✈️ 旅行、探索新地方',
        '📖 阅读科幻、奇幻类型作品',
        '🧠 自由讨论、脑力激荡',
      ],
      match: {
        best: [
          { name: '七姊妹星人', desc: '同行者，创意和感性的结合，创造出最美的艺术' },
          { name: '大角星人', desc: '创意拍档，理性引导创意，创意启发理性' },
          { name: '光明星人', desc: '灵魂共鸣，两个自由的灵魂，互相理解彼此的独特' },
        ],
        caution: { name: '猎户星人', desc: '猎户的规律和结构可能让你觉得束缚。保持你的自由，但都要学习尊重秩序。' },
      },
      guidance: {
        dailyPractice: '每日花时间做自由创作，不限形式，纯粹表达',
        environment: '充满艺术品、色彩丰富、开扬的空间',
        challenge: '落地执行，创意需要付诸实行先有力量',
        chakra: '🟡 太阳神绂绂丛（黄色）',
        crystal: '💎 黄水晶、琥珀、金发晶',
        moonSign: '🌙 月亮在双子座、水瓶座、人马座',
      },
      message: '亲爱的仙女星人，你是星际的探索者。你的独特不是缺点，而是你的超能力。不好因为和人们不同而觉得自己有问题，你的存在本身就是一个全新的可能。继续用你的方式去探索世界，你的视野会改变一切！🚀🌈',
    },
  },
  indigo: {
    id: 'indigo',
    name: '靛蓝星人',
    english: 'Indigo',
    emoji: '🔥',
    image: 'images/indigo.jpg', // TODO: 需替换为实际图片路径
    subtitle: '改革者，带著使命来到地球推动改变。',
    traits: [
      '天生反叛，权威对他来说是一个笑话',
      '正义感爆棚，见到不公平的事会即刻出手',
      '绝不妥协，对于自己相信的价值会站到最硬',
      '使命感很强，觉得自己这一世是为了做大事',
      '有些火爆，做事直接不转弯，有时会得罪人',
    ],
    full: {
      starFile: '地球内维度（Intradimensional）。靛蓝星人的灵魂来源不是一个特定的外星系统，而是较高维度的能量层面。他们带住强烈的能量而来，目的是推动地球人类的意识进化。',
      subTitle: '改革者，带著使命来到地球推动改变。',
      traits: [
        '✓ 天生反叛，权威对他来说是一个笑话',
        '✓ 正义感爆棚，见到不公平的事会即刻出手',
        '✓ 绝不妥协，对于自己相信的价值会站到最硬',
        '✓ 使命感很强，觉得自己这一世是为了做大事',
        '✓ 有些火爆，做事直接不转弯，有时会得罪人',
      ],
      talents: [
        '🔨 系统思考，一眼看穿制度的漏洞和问题',
        '🔨 改革能力，不是得把口，真是有方法改变现状',
        '🔨 直觉判断，很快判断一个人或者一件事是咪值得',
        '🔨 觉察力，对虚伪、欺骗、操控有雷达般的灵敏度',
      ],
      mission: '打破旧系统，建立新秩序。靛蓝星人是星际的改革者，他们不是来地球享受生活的，而是来打烂不合理的制度，为人类创造一个更公平、更自由的世界。',
      energy: [
        '✊ 为正义发声、参与社会运动',
        '🧠 批判思考、分析制度问题',
        '🎯 达成有影响力的目标',
        '🔥 突破框架、挑战权威',
      ],
      match: {
        best: [
          { name: '猎户星人', desc: '同行战友，和样充满力量，并肩作战改变世界' },
          { name: '仙女星人', desc: '改革同盟，一个打破框架，一个引入新思维' },
          { name: '光明星人', desc: '梦幻组合，改革需要光的温暖去平衡火焰的炽热' },
        ],
        caution: { name: '天狼星人', desc: '传统智慧和改革理念可能产生冲突。试著尊重古老智慧，和时坚持你的革新。' },
      },
      guidance: {
        dailyPractice: '每日写下三件让你愤怒的事，然后转化为行动计划',
        environment: '简洁、有力量感、少杂物的空间',
        challenge: '控制愤怒，愤怒是燃料，但都要学习温和沟通',
        chakra: '🔵 喉轮（蓝色）',
        crystal: '💎 青金石、蓝纹玛瑙、天河石',
        moonSign: '🌙 月亮在天蝎座、水瓶座、白羊座',
      },
      message: '亲爱的靛蓝星人，你是星际的改革者。你的愤怒不是问题，而是改变的燃料。你的坚持可以撼动最坚固的高墙。世界需要你的叛逆，需要你的不妥协。继续用你的火焰去燃烧不公平，用你的力量去创造新秩序！🔥✊',
    },
  },
  lightworker: {
    id: 'lightworker',
    name: '光明星人',
    english: 'LightWorker',
    emoji: '☀️',
    image: 'images/lightworker.jpg', // TODO: 需替换为实际图片路径
    subtitle: '光的使者，用爱和光明照亮人间。',
    traits: [
      '天生乐观，就算遇到难关都看到好的一面',
      '心地善良，喜欢服务他人，不计较回报',
      '感染力很强，他们在度的时候气氛就会变好',
      '有深度的灵性智慧，虽然未必绂常说',
      '包容性强，很少批评人，觉得人人都值得被爱',
    ],
    full: {
      starFile: '不限于特定星系（Universal）。光明星人的灵魂来自宇宙源头，不局限于某一个星族系统。他们是最「跨星系」的星宿种子，就像光一样，不需要被框框定义。',
      subTitle: '光的使者，用爱和光明照亮人间。',
      traits: [
        '✓ 天生乐观，就算遇到难关都看到好的一面',
        '✓ 心地善良，喜欢服务他人，不计较回报',
        '✓ 感染力很强，他们在度的时候气氛就会变好',
        '✓ 有深度的灵性智慧，虽然未必绂常说',
        '✓ 包容性强，很少批评人，觉得人人都值得被爱',
      ],
      talents: [
        '💡 同理心，不止感受到，直头是「吸收」到人们的情绪',
        '💡 传播正能量，把口好似有魔法，说东西总是让人舒服',
        '💡 灵性引导，不用用复杂的理论，简单的说说就触动人心',
        '💡 场域净化，他们一入到来，整个空间的能量都会变好',
      ],
      mission: '用光照亮黑暗，用爱连结众生。光明星人是星际的灯塔，他们的存在本身就是一个礼物，他们做的每一件事、说的每一句说说，都是为了让这个世界变得更光明、更有爱。',
      energy: [
        '☀️ 阳光、户外活动',
        '💞 与人连结、帮助他人',
        '🧘 祈祷、感恩、祝福',
        '🌍 服务他人、义工活动',
      ],
      match: {
        best: [
          { name: '七姊妹星人', desc: '情感互补，一个疗愈，一个发光，互相滋养' },
          { name: '仙女星人', desc: '灵魂共鸣，两个自由的灵魂，互相理解彼此的独特' },
          { name: '猎户星人', desc: '情感互补，光需要战士的保护，战士需要光的指引' },
        ],
        caution: { name: '靛蓝星人', desc: '他们的愤怒可能让你困惑。试著理解，愤怒都是爱的一种形式。' },
      },
      guidance: {
        dailyPractice: '每日练习感恩，写下三件值得感恩的事',
        environment: '开扬、阳光充足、充满生命力的空间',
        challenge: '照顾自己，燃烧自己照亮别人前，记得先为自己添油',
        chakra: '☀️ 太阳神绂丛（金色/黄色）',
        crystal: '💎 黄水晶、日长石、琥珀',
        moonSign: '🌙 月亮在狮子座、双鱼座、人马座',
      },
      message: '亲爱的光明星人，你是星际的灯塔。你的光芒就是这个世界最需要的礼物。不好低估你的存在对其他人的影响，你的一个微笑、一句温暖的说说，可能是某人黑暗里面的唯一光绠。继续发光，继续去爱，世界因为有你而变得更美好！☀️💖✨',
    },
  },
};

// ============================================================================
// REPORT_CONTENT — 7 个星人 × (free + premium)
// ============================================================================

export const REPORT_CONTENT: Record<StarId, ReportContent> = {
  pleiadian: {
    free: {
      starseedName: '七姊妹星人（Pleiadian）',
      summary: '你是天生的疗愈者，拥有温柔的力量去抚慰人心。',
      traits: [
        '直觉敏锐，能感知他人情绪，自然成为身边人的依靠',
        '富有同情心，乐于付出，用爱和温暖照亮周遭',
        '对大自然和艺术有强烈连结，能量场纯净而疗愈',
      ],
      unlockReasons: [
        ' 你知不知自己的同理心天赋在哪个场景最容易变成「能量黑洞」？',
        ' 你可能没意识到，「帮人帮到忘记自己」这个模式正慢慢消耗你，Sino-NLP 7日练习帮你重新设立能量边界',
        ' 你和哪个星人的配搭会是最强疗愈组合？哪个星人会不自觉这样榨干你？',
        ' 七姊妹星人的终极成长路径：怎样从「牺牲者」变成「智慧的疗愈者」？',
      ],
    },
    premium: {
      profile: {
        galaxy: '昴宿星团（Pleiades / M45）',
        summary: '你是天生的疗愈者，拥有温柔的力量去抚慰人心。',
      },
      strengths: [
        {
          name: '深度同理心',
          detail: '你拥有超凡的情绪感知能力，能自然感受到别人的喜怒哀乐。朋友喊你聊天，不用说太多你就明他想说什么。你的存在本身已绂是一种安慰，同事失恋，你静静递上一杯暖茶，他已绂觉得没这么孤单。',
        },
        {
          name: '疗愈直觉',
          detail: '你对能量场很敏感，走进一个空间能即刻感觉到「这里不妥」。你的双手好似有记忆，帮人按摩头痛、用精油纾缓焦虑、甚至只是握住对方只手，对方就会觉得整个人放松下来。你是朋友群中的「天然急救站」。',
        },
        {
          name: '自然连结力',
          detail: '你和大自然有很深的连结。爬山、种植物、看海、听雨声，这些不是嗜好，而是你的充电方式。你直觉知道哪种植物适合放在哪个角落，亦会自然这样引导身边人更关注环境和生命。',
        },
      ],
      growthTopics: [
        {
          weakness: '过度牺牲自己',
          detail: '你太习惯将别人需要放在自己前面。「没所谓，你开心就得」，这句口头禅是你，但其实你不是没所谓，你只是不想让对方失望。久而久之，你的能量被掏空，甚至会出现「同情疲劳」：明明很想帮人，但身体已绂受不了。',
          opposite: '「一体两面」视角：这个弱点的另一面，是你拥有无私奉献的高贵品质。你有能力为挚爱付出一切，这份深度连结是人类最珍贵的礼物。只是需要学会：先斟满自己杯水，先有余力斟给人。',
          practice: '行动练习：每日设定「神圣1小时」，这个钟完全属于你，不好见人、不回信息、不帮任何人解决问题。用这段时间做纯粹让自己快乐的事：看书、浸浴、画画、发呆。守住这个习惯7日，你会发现自己的能量反弹得很快。',
        },
        {
          weakness: '太感性不够果断',
          detail: '做决定对你来说很痛苦，因为你见到每条路都会影响到人。你想让所有人开心，结果到最后哪个都不满意。工作上你是很好的同事，但你不擅长做「衰人」，叫你解雇人、拒绝人、坚持立场，你会周身不聚财。',
          opposite: '「一体两面」视角：这个弱点的另一面，是你强大的连结力和包容心。你不是不够果断，你只是太重视关系。当关系建立得够稳固，你的温柔反而最有力的说服工具。',
          practice: '行动练习：每星期最少做一次「温柔的拒绝」。练习说：「谢谢你想起我，不过这次我帮不到手。」记录对方的反应，你会惊讶地发现，世界没崩塌，关系亦没破裂，而你获得了前所未有的自由。',
        },
      ],
      actionPlan: {
        daily: '每日起床和睡觉前，闭眼深呼吸3次，说：「我的能量属于我自己，我愿意先照顾好自己。」',
        weekly: '每周问自己一次：「这个星期有没哪次帮人是出于内疚而不是真心想帮？」如果答案是有，写低那个情况，和自己说：「下次我可以选择不帮。」',
        breakLimit: '破框练习：打破「我不帮人就会没人喜欢我」这个限制性信念。你的价值不在于你帮了几多人，而在于你是一个怎样的人。',
      },
      pairing: {
        best: '仙女星人 — 七姊妹星人的温柔疗愈配仙女星人的创造力，会形成一个充满爱和灵感的世界。仙女星人负责天马行空，七姊妹星人负责落地关怀，互相补足。',
        challenge: '靛蓝星人 — 靛蓝星人的激烈反叛会让七姊妹星人感到压力。七姊妹星人想用温柔改变世界，靛蓝星人想用革命摧毁再重建。这个配对充满火花，但需要互相学习对方的节奏。',
      },
      guidance: {
        chakra: '心轮（第四脉轮）',
        crystal: '粉晶（Rose Quartz）、祖母绿（Emerald）',
        zodiac: '双鱼座、巨蟹座、天秤座',
      },
    },
  },
  sirian: {
    free: {
      starseedName: '天狼星人（Sirian）',
      summary: '你是古老智慧的传承者，知识和领导力是你的天赋。',
      traits: [
        '头脑清晰，学习力强，任何领域一学就上手',
        '天生领袖，能组织规划，带领团队走向正确方向',
        '对神秘学、哲学、古代智慧有浓厚兴趣和天赋',
      ],
      unlockReasons: [
        ' 你知不知自己的知识优势在哪种场合最易变成「离地围墙」？',
        ' 你可能没发现，「聪明到没朋友」不是形容词，而是你真正面对的困局，Sino-NLP帮你由「高处不胜寒」变成「智慧的桥梁」',
        ' 哪个星人能够真正和你做灵魂纟的深度对说？哪个星人的能量会让你想掉头走？',
        ' 天狼星人怎样从「孤高智者」进化成「接地气的导师」？答案可能让你惊讶。',
      ],
    },
    premium: {
      profile: {
        galaxy: '天狼星（Sirius / 大犬座α星）',
        summary: '你是古老智慧的传承者，知识和领导力是你的天赋。',
      },
      strengths: [
        {
          name: '超凡学习力',
          detail: '你读书、工作、掌握新技能的速度比人快几倍。同事学紧基础操作的时候，你已绂摸熟晒系统架构，甚至想到怎样优化。你不是炫耀，你只是⋯⋯个脑转得快。你是团队里面的「行走百科全书」，大家有什么不明第一时间会来问你。',
        },
        {
          name: '卓越领导力',
          detail: '你天生知道怎样组织人。混乱的局面你一到就自然清晰，这个人适合做什么、那个人应该站在边、成件事应该怎样排优先次序。你不需要大嗌都压得住场，因为你说东西有根据、有逻辑，人们自然信服你。',
        },
        {
          name: '神秘学天赋',
          detail: '你对一般人都觉得难明的东西，占星、塔罗、命理、哲学、古文明，有种与生俱来的理解力。你不是背书式学习，而是「一看就明」那种。你直觉知道古埃及的金字塔不只是坟墓、易绂的卦象不只是占卜。这些智慧在你手上可以变成现代人都用得著的工具。',
        },
      ],
      growthTopics: [
        {
          weakness: '容易看不起慢的人',
          detail: '你的聪明让你没什耐性。你不明为什么人们要用这么耐先明，你解释完一次对方还要问，你内心会翻白眼。你不是恶意，但你的不耐烦会让身边人觉得自己好蠢。久而久之，人们不敢再问你问题，你变成了孤独的天才。',
          opposite: '「一体两面」视角：这个弱点的另一面，是你对卓越有极高要求。你不是想看低人，你是想成件事做到最好。这份追求完美的心意，如果加上耐性和引导，你可以成为改变人一生的好老师。',
          practice: '行动练习：当你想说「这么简单你都不明」的时候，改成：「不紧要，我换个说法试下。」每次教人前，先深呼吸一次，提醒自己：教学不是展示自己几叻，而是帮对方行到和你一样的高度。',
        },
        {
          weakness: '太理性忽略情感',
          detail: '你习惯用逻辑处理一切。朋友和你说感情困扰，你第一时间帮他分析责任归属和解决方案。但他想听的可能只是：「我明你不开心。」你不是冷漠，你只是觉得解决问题先最好的安慰。但在人际关系中，有时候「共情」比「解决」更重要。',
          opposite: '「一体两面」视角：这个弱点的另一面，是你强大的分析和解决问题能力。当危机出现时，个个慌晒，只有你能保持冷静想办法。这个是很珍贵的力量，只需要加上情感的温度，你就无敌。',
          practice: '行动练习：每星期最少一次，和亲密的人练习「纯粹聆听」，听到对方分享感受，你不给意见、不分析、不解决，只是回应：「我听到了，这件事真是好难顶。」就是这么简单。',
        },
      ],
      actionPlan: {
        daily: '每日用5分钟写「感恩日记」，不是感恩成就，而是感恩一个让你觉得温暖的人际互动。',
        weekly: '每周反思：「这个星期我有没一次让到人觉得和我说东西好舒服？」如果没，下星期尝试主动关心一个人的心情，而不是解决他的问题。',
        breakLimit: '破框练习：打破「我够叻就自然有人欣赏我」这个信念。能力吸引人，但温度留住人。',
      },
      pairing: {
        best: '大角星人 — 一个是古老智慧，一个是高维科技，两个理性灵魂可以进行最深层次的知识交流。天狼星人负责「为什么」，大角星人负责「怎样」，互补到极致。',
        challenge: '仙女星人 — 天狼星人的结构感和仙女星人的自由奔放完全撞到应一应。仙女星人觉得你太死板，你觉得他太混乱。但这个配对正正是学习「包容差异」的最佳功课。',
      },
      guidance: {
        chakra: '眉心轮（第三眼脉轮 / 第六脉轮）',
        crystal: '青金石（Lapis Lazuli）、紫水晶（Amethyst）',
        zodiac: '人马座、水瓶座、处女座',
      },
    },
  },
  orion: {
    free: {
      starseedName: '猎户星人（Orion）',
      summary: '你是天生的战士，行动力和正义感是你的核心力量。',
      traits: [
        '行动力超强，想到就做，不会拖泥带水',
        '正义感爆棚，见不公平一定会出声',
        '目标明确，决定了要做的事就会坚持到底',
      ],
      unlockReasons: [
        ' 你知不知自己的行动力优势在哪种情况下反而变成最大的阻碍？',
        ' 你可能没发现，「非黑即白」的思维模式正让你错过很多珍贵的灰色地带，Sino-NLP帮你由硬碰硬变成以柔制刚',
        ' 哪个星人可以站在你身边成为最强战友？哪个星人是你的「柔软功课」？',
        ' 猎户星人怎样从「用力量解决一切」升纟到「文武兼备的真正强者」？',
      ],
    },
    premium: {
      profile: {
        galaxy: '猎户座（Orion）',
        summary: '你是天生的战士，行动力和正义感是你的核心力量。',
      },
      strengths: [
        {
          name: '极强行动力',
          detail: '你是个「行动派」，不是想，是做。同事还开紧会讨论可行性，你已绂开始整prototype；朋友说想学新东西，你第二日已绂帮他报了名。你的口头禅是：「做了先说。」你这份行动力让你成为团队里面的引擎，很多东西都是因为你「推郁」先有成果。',
        },
        {
          name: '天生正义感',
          detail: '你见不到不公平的事会全身不舒服。见到有人被欺凌你会即刻冲过去；见到制度不合理你会大声说出来。你不是为出风头，你是真心觉得「这件事不对就要纠正。」你是弱势群体的天然保护者，有你在场，大家觉得安心。',
        },
        {
          name: '目标执行力',
          detail: '一旦决定了目标，你不会放弃。跑步要跑到达标、project要做到最好、关系要修复到你满意为止。你的意志力是你最大武器，当个个都说「算啦」的时候，你还在度坚持紧。你不是死牛一面颈，你是真是信得过「坚持到底」的力量。',
        },
      ],
      growthTopics: [
        {
          weakness: '太冲动，非黑即白',
          detail: '你看世界得两种色：对和错、好和坏、朋友和敌人。你反应很快，但快得滞会没想清楚就出手。以为朋友出卖你，即刻断交；以为同事偷懒，即刻开火。结果很多时候是你看错了，但你的冲动已绂伤害了关系。你不是想伤害人，你只是太快行动。',
          opposite: '「一体两面」视角：这个弱点的另一面，是你的真诚和勇气。你不会阴湿收埋、不会扮东西、不会看人说东西。白色就白色，黑色就黑色，这份纯粹是很珍贵的品质，只需要多加一点耐心同一点弹性。',
          practice: '行动练习：下次想即刻行动之前，和自己说：「数10声，先再做。」由1数到10，比个脑有时间过滤冲动。数完你依然觉得要做就做，但多数情况你会发现，数完之后见到的世界多了层灰色。',
        },
        {
          weakness: '不识放松',
          detail: '你习惯长期处于「作战状态」。放松对你来说等于浪费时间。放假你会周身不自在，觉得自己「应该做些东西」。你的身体和精神长期紧绷，结果很容易burn out、失眠、或者身体出毛病。你不是不想休息，你是不记得了怎样休息。',
          opposite: '「一体两面」视角：这个弱点的另一面，是你强大的自律和责任感。你不是工作狂，你只是太认真看待自己的使命。这份认真值得respect，但要明白，最强的战士都知几时要收剑。',
          practice: '行动练习：每日强制安排30分钟「零生产力时间」，不做任何有目的的事。坐在窗边看街、听音乐发吽哣、漫无目的散步。记住：休息不是偷懒，休息是为了打仗时更有力。',
        },
      ],
      actionPlan: {
        daily: '每日做5分钟深呼吸练习，将注意力放在呼气，呼气是「放低武装」的动作，练习放松。',
        weekly: '每周问自己：「这个星期有没哪个情况，其实可以有第三个选择？」用笔写低你平时「非A即B」的决定，逼自己想出第三条路。',
        breakLimit: '破框练习：打破「休息等于软弱」这个信念。真正的强者知几时出手，亦知几时收手。',
      },
      pairing: {
        best: '天狼星人 — 猎户星人的行动力配合天狼星人的智慧，形成「谋定而后动」的完美组合。天狼星人帮你停一停、想一想，你帮天狼星人将计划变为现实。',
        challenge: '仙女星人 — 猎户星人的直绠思维遇著仙女星人的跳跃思维，会觉得对方「乱噏」。但这个配对教晓你：这个世界不是得一条路行。',
      },
      guidance: {
        chakra: '太阳神绂丛轮（第三脉轮）',
        crystal: '黄铁矿（Pyrite）、红玛瑙（Carnelian）',
        zodiac: '白羊座、狮子座、天蝎座',
      },
    },
  },
  arcturian: {
    free: {
      starseedName: '大角星人（Arcturian）',
      summary: '你是高维度的观察者，理性和直觉的完美结合让人惊叹。',
      traits: [
        '头脑清晰冷静，分析能力极强，看东西看得好透彻',
        '对科技、系统、抽象概念有自然的敏感度',
        '直觉准确，有时连自己都解释不到为什么会知道',
      ],
      unlockReasons: [
        ' 你知不知自己的理性优势在哪个生活领域不知不觉变了「情感绝缘体」？',
        ' 你可能没发现，「离地」不是你性格缺点，而是一种需要重新连接地气的灵魂课题，Sino-NLP帮你由高维回归人间',
        ' 哪个星人可以和你进行最深层次的灵魂对说？哪个星人会逼你面对最不擅长的情感交流？',
        ' 大角星人怎样从「高高在上的观察者」变成「落地又智慧的人生顾问」？',
      ],
    },
    premium: {
      profile: {
        galaxy: '大角星（Arcturus / 牧夫座α星）',
        summary: '你是高维度的观察者，理性和直觉的完美结合让人惊叹。',
      },
      strengths: [
        {
          name: '穿透式分析力',
          detail: '你看问题不看表面，一句就点出核心。专案出了问题，个个还在度追责怪人，你已绂画了张系统图，指出是流程设计的漏洞。你的分析力好似X光，什么东西在你面前都无所遁形。同事说你「好串」，但他们心底是佩服你。',
        },
        {
          name: '科技自然感应',
          detail: '你对科技东西有种不用学就识的感觉。新软件上手快过人、系统bug你可以靠直觉估到问题所在、AI提示工程你一试就知点prompt先有效。你不是geek，你是天生和科技频率对得上。元宇宙、量子力学、高维数学对你来说是让人兴奋的游乐场。',
        },
        {
          name: '超凡直觉',
          detail: '奇怪的是，你明明很理性，但直觉其实还劲。你绂常有种「就是知道」的感觉，知道这个电说要听、知道今日不好坐那班车、知道这个人信得过。你解释不到，但你的直觉从来没呃过你。这个是高维智慧在你身上的体现。',
        },
      ],
      growthTopics: [
        {
          weakness: '过度理性变冷漠',
          detail: '你习惯抽离自己，用第三者角度看一切，包括自己的人生。朋友喊紧，你想的是「眼泪含有压力荷尔蒙，喊完会舒服些」，但你不识揽住他。你不是没感情，你只是将情感收埋得太好，好到连自己都以为自己不需要。结果是：你看得透个世界，但世界看不透你。',
          opposite: '「一体两面」视角：这个弱点的另一面，是你强大的客观判断力。在危机中你不会被情绪牵住走，是团队里面最可靠的「定海神针」。这种冷静是天赋，只需要再加上温暖的外壳。',
          practice: '行动练习：每日对一个熟人做一次「情感连绠」，不是分析他的问题，而是说出你对他的感受。例如：「我见你今日好似好累，我有些担心你。」就是这么简单，练习将内心的感受说出口。',
        },
        {
          weakness: '离地，和现实脱节',
          detail: '你喜欢想哲学问题、宇宙结构、未来预测。但你会忘记交水电费、约了人但迟到、现实生活安排一团糟。你不是没能力处理现实，你只是觉得现实好「无聊」。结果是：你可以说解黑洞的形成，但搞不掂一张信用卡账单。',
          opposite: '「一体两面」视角：这个弱点的另一面，是你强大的宏观视野。你能够跳出现世的枷锁，看到更远的可能性。历史上很多重大突破都是来自你这种人，只需要学会将vision和reality对齐。',
          practice: '行动练习：每星期选择一件「最无聊的现实任务」专心做好他，例如整理柜桶、准时交费、清空email inbox。将这个任务当成冥想，训练自己将高维能量落地。',
        },
      ],
      actionPlan: {
        daily: '每日用5分钟「身体扫描」冥想，将注意力由脑转移到身体，感受脚板踩住地板的感觉，练习接地气。',
        weekly: '每周问自己：「这个星期我有没和任何人分享过情感而不是想法？」如果没，找一个信任的人练习分享一个感受。',
        breakLimit: '破框练习：打破「理性先最高纟的存在方式」这个信念。真正的智慧是理性和感性的平衡。',
      },
      pairing: {
        best: '天狼星人 — 两个都是高智力型，大角星人的高维视野配合天狼星人的古老智慧，形成宇宙纟的知识共振。他们可以聊三日三夜不停。',
        challenge: '七姊妹星人 — 大角星人理性到让人觉得冻，七姊妹星人温柔到让人觉得甜。这个配对是理性vs感性的极致考验，但是最治愈你冷漠的解药。',
      },
      guidance: {
        chakra: '眉心轮（第三眼脉轮 / 第六脉轮），顶轮（第七脉轮）',
        crystal: '紫龙晶（Charoite）、月光石（Moonstone）',
        zodiac: '水瓶座、天秤座、双子座',
      },
    },
  },
  andromedan: {
    free: {
      starseedName: '仙女星人（Andromedan）',
      summary: '你是星际的自由灵魂，创意和视野超越常规想像。',
      traits: [
        '创意无限，绂常有让人眼前一亮的新奇想法',
        '自由奔放，讨厌被框架局限，追求独特的生活方式',
        '视野广阔，看到别人看不到的可能性和未来趋势',
      ],
      unlockReasons: [
        ' 你知不知自己的创意天赋在哪个时候最易变成「空中楼阁」？',
        ' 你可能没发现，「不落地」不是你的缺点，而是你的灵魂需要学会的平衡课，Sino-NLP帮你将天马行空变成真是做到出来的现实',
        ' 哪个星人可以帮你的创意变为现实？哪个星人会说你「发梦」但其实是你最大的镜子？',
        ' 仙女星人怎样从「永远的梦想家」变成「创造现实的魔法师」？',
      ],
    },
    premium: {
      profile: {
        galaxy: '仙女座星系（Andromeda Galaxy / M31）',
        summary: '你是星际的自由灵魂，创意和视野超越常规想像。',
      },
      strengths: [
        {
          name: '无限创造力',
          detail: '你个脑好似永远不停这么想东西，开会明明正在聊A计划，你已绂跳了去Z计划，还要中间有晒新奇的连结。同事说你「跳掣」，但你的「跳掣」绂常是团队最有价值的idea。你是那种会将会议室变成创意实验室的人。',
        },
        {
          name: '突破框架的视野',
          detail: '你见到一个行业，会自然想到「为什么不可以反转来做？」你见到一个模式，会想「如果将A领域的逻辑搬去B领域会点？」你的视野不是横向思维，是多维度思维。你是公司里面的「局外人视角」，因为你本来就不属于任何框架。',
        },
        {
          name: '跨文化融合力',
          detail: '你对不同文化、不同背景的人自然有包容心。外国朋友和你聊天觉得舒服，因为你不会有偏见。你的世界观天生就是全球化、星际化的。你学语言快、适应新环境快、和不同圈子的人都聊得埋。你是这个世界上的「公民」。',
        },
      ],
      growthTopics: [
        {
          weakness: '不落地，难坚持',
          detail: '你的问题不是没想法，你的想法多到用不晒。问题是：你很快就对一个想法厌倦，然后跳去下一个。你开了很多project，但完成的很少。你有100个伟大计划，但每一样都只是做到头三步。不是你没能力，是你太喜欢「开始」的新鲜感，不享受「完成」的重复劳动。',
          opposite: '「一体两面」视角：这个弱点的另一面，是你惊人的发想能力和适应力。你是天生的梦想家和开拓者，每一次「跳掣」都可能带来新的可能性。你需要的不是压抑创意，而是学会将一条创意绠跑到终点。',
          practice: '行动练习：选择一个你最想完成的project，用「番茄工作法」，每日只做25分钟，但要求自己连续做30日不停。不用做多，但要保持不断。30日后，你会有第一个「完成」的绂验。',
        },
        {
          weakness: '讨厌规则到影响生活',
          detail: '你不是普通这样不喜欢规则，你是见到规则就想打破。公司制度、社会规范、甚至朋友间约定俗成的东西，你都觉得「为什么要跟？」这个让你在主流社会很难适应。你会因为「不喜欢上班时间」而辞职、因为「这个form太愚蠢」而不填、因为「无聊」而skip重要的deadline。自由有代价，而你绂常低估了。',
          opposite: '「一体两面」视角：这个弱点的另一面，是你的独立精神和革命意识。你不是反社会，你是灵魂深处追求真实的自由。每条规则背后都有他存在的原因，你的使命是分辨：哪些规则需要打破，哪些规则其实保护紧你。',
          practice: '行动练习：每日选择一条你讨厌的规则，和自己解释「这条规则最初是为了解决什么问题而存在的」。了解规则背后的意图，然后决还是「智慧这么跟从」还是「智慧这么打破」，而不是本能地反抗。',
        },
      ],
      actionPlan: {
        daily: '每日起床做1件事：写低今日最想完成的1个具体行动，然后在完成之前不好开始新东西。',
        weekly: '每周回顾：「这个星期我有没完成到一样东西由头到尾？」如果有，奖励自己；如果没，选择一个「未完成」的project设定一个完绂常期。',
        breakLimit: '破框练习：打破「自由就是没规则」这个信念。真正的自由是有能力选择规则，而不是被规则绑架。',
      },
      pairing: {
        best: '七姊妹星人 — 仙女星人的创意被七姊妹星人的温柔和实际性平衡到。七姊妹星人会帮你将idea变成有温度的现实，而你会带他飞离舒适区。',
        challenge: '猎户星人 — 仙女星人的跳跃思维和猎户星人的直绠思维是绂典的冲突。你会觉得他死板，他会觉得你乱来。但这个组合最可能创造出「破格而又可行」的成果。',
      },
      guidance: {
        chakra: '喉轮（第五脉轮）',
        crystal: '天使石（Angelite）、海蓝宝（Aquamarine）',
        zodiac: '双子座、人马座、水瓶座',
      },
    },
  },
  indigo: {
    free: {
      starseedName: '靛蓝星人（Indigo）',
      summary: '你是改革者，天生对系统问题敏感，使命感比任何人都强。',
      traits: [
        '反叛精神，不接受不合理，永远想改变现状',
        '正义感使命感强，对不公平有超强雷达',
        '系统思考，一眼看穿制度里面的问题和漏洞',
      ],
      unlockReasons: [
        ' 你知不知自己的改革天赋在哪个时候最易变成「与世界为敌」的孤军作战？',
        ' 你可能没发现，你的「不妥协」正让你错过了真正改变的机会，Sino-NLP帮你由「革命」升纟到「改革」',
        ' 哪个星人可以做你改变世界的最强盟友？哪个星人是你的「愤怒镜子」？',
        ' 靛蓝星人怎样从「燃烧自己去对抗世界」变成「智慧地改变系统」？',
      ],
    },
    premium: {
      profile: {
        galaxy: '无固定对应星系（靛蓝种子属于新一代星际灵魂）',
        summary: '你是改革者，天生对系统问题敏感，使命感比任何人都强。',
      },
      strengths: [
        {
          name: '系统洞察力',
          detail: '你走进一间公司，很快就看到权力结构里面的问题；看一个社会议题，你一眼就见到制度漏洞。你不是表面这样批评，你是真是看到整个系统怎样运作、哪个环节坏了、怎样可以修复。你的能力是「拆解系统结构」，这个是改革者最核心的天赋。',
        },
        {
          name: '强烈使命感',
          detail: '你不是为了自己而活。你觉得这个世界有很多东西需要改变，而你是其中一个要负责的人。这份使命感让你不会随波逐流，不会「随便啦」，不会「关我什么事」。你需要一个比你更大的意义去推动你。不是人人都理解你，但你不需要他们理解。',
        },
        {
          name: '革命的勇气',
          detail: '你敢说、敢做、敢站出来。当全世界都说「算啦不好搞这么多东西」，你会说：「为什么？」你不怕成为异类，不怕被讨厌，不怕失败。你这份勇气是社会进步的引擎。很多改变都是因为有你这种人先发生。',
        },
      ],
      growthTopics: [
        {
          weakness: '太偏激，与世界为敌',
          detail: '你觉得不对的事，你会站到好硬，不会退让半步。你认为让步是背叛、妥协是软弱。结果你变成了「凡事反对」的人，同事有不同意见你即刻foul、上纟的合理决定你都说有阴谋、甚至朋友之间的小事你都想到「是咪系统压迫」。你不是想孤独，你是逼走了身边的人。',
          opposite: '「一体两面」视角：这个弱点的另一面，是你对真理的坚持和对正义的承诺。你不是喜欢争拗，你是无法忍受虚伪和不公平。这份坚持很珍贵，只需要加上智慧的策略和柔软的沟通方式，你就不是「反对者」，而是「建设者」。',
          practice: '行动练习：下次你要反对之前，停一停，问自己3个问题：1）我是咪100%肯定我对？2）这件事值不值得用晒我些credibility去坚持？3）如果用另一种方式表达，会不会效果更好？如果三个答案都是「是」，先好出手。如果有一个不是，就收一收。',
        },
        {
          weakness: '容易burn out',
          detail: '你长期处于作战状态，觉得放松是奢侈。见到世界这么多问题，你觉得自己没资格停下来。你的愤怒和使命感是燃料，但燃料会烧尽。结果你每隔一段时间就会彻底崩溃，不是普通累，而是整个人熄机。你burn out之后会内疚，觉得自己浪费时间，然后又再燃烧自己，形成恶性循环。',
          opposite: '「一体两面」视角：这个弱点的另一面，是你非凡的热情和投入。你不是容易累，你是愿意为信念付出一切。这种全心全意的投入是极少人拥有的品质，只需要加上可持续的节奏，你就可以燃烧一辈子而不是三个月。',
          practice: '行动练习：每日设定「熄机时间」，30分钟完全不看新闻、不想社会问题、不讨论不公平事件。用这段时间纯粹照顾自己：食好东西、冲凉、听音乐。这个不是逃避，是战略性回气。',
        },
      ],
      actionPlan: {
        daily: '每日起床问自己：「今日我的能量可以怎样分配，先可以持续作战而不burn out？」然后根据答案决定今日做几多、停几多。',
        weekly: '每周回顾：「这个星期我有没一次成功用温柔的方式去表达我的不满？」如果有，记录当时的做法；如果没，计划下星期怎样「软性抗争」。',
        breakLimit: '破框练习：打破「妥协就是背叛」这个信念。真正的改革者是智慧的策略家，不是烈士。刘备可以三顾茅庐，不代表他放弃了统一天下。',
      },
      pairing: {
        best: '仙女星人 — 靛蓝星人的系统思考配上仙女星人的创造力，可以创造出真正颠覆性的改革方案。仙女星人帮你跳出框架想新方法，你帮仙女星人落地执行。',
        challenge: '七姊妹星人 — 靛蓝星人的激烈会吓亲温柔的七姊妹星人，而你亦会觉得他太软弱。但这个配对是一个重要功课：没温柔的改革只是另一种暴力。',
      },
      guidance: {
        chakra: '海底轮（第一脉轮）、太阳神绂丛轮（第三脉轮）',
        crystal: '黑碧玺（Black Tourmaline）、孔雀石（Malachite）',
        zodiac: '天蝎座、水瓶座、摩羯座',
      },
    },
  },
  lightworker: {
    free: {
      starseedName: '光明星人（Lightworker）',
      summary: '你是光之使者，用乐观和善良照亮身边每一个人。',
      traits: [
        '乐观善良，你的笑容和正能量会感染身边每一个人',
        '感染力强，自然成为团体里面的凝聚核心',
        '乐于服务他人，真心希望世界变得更好',
      ],
      unlockReasons: [
        ' 你知不知自己的正能量天赋在哪种情况下会变成「情感吸血鬼的提款机」？',
        ' 你可能没发现，「照亮所有人」这个使命正让你一步一步熄灭，Sino-NLP帮你由「牺牲式发光」升纟到「可持续的光芒」',
        ' 哪个星人是你的最佳拍档，可以和你一齐发光发亮？哪个星人会在你不为意的时候抽干你的光？',
        ' 光明星人怎样从「燃烧自己照亮他人」变成「自带光芒又不会熄灭」的真正光之使者？',
      ],
    },
    premium: {
      profile: {
        galaxy: '无固定对应星系（光之种子来自多重宇宙的光源）',
        summary: '你是光之使者，用乐观和善良照亮身边每一个人。',
      },
      strengths: [
        {
          name: '天生感染力',
          detail: '你走进一个空间，个气氛就会变。你不用做些什么特别，只是在度笑一笑，身边人就会觉得放松。你是聚会里面的磁石，大家都想企近你。你的正能量不是扮出来的，是真心的。你相信世界是美好的，而你这份信念让人觉得这个世界真是没这么差。',
        },
        {
          name: '无条件的善良',
          detail: '你帮人不是为了回报。见到流浪猫你会买东西给他食、同事不开心你会陪他聊到收工、朋友有困难你会二说不说瞓身帮手。你这份善良在尔虞我诈的世界里面好似傻，但其实是最珍贵的。你是这个世界的良心。',
        },
        {
          name: '灵性引导力',
          detail: '你天生有种让人「醒一醒」的能力。你不一还是老师，但你说的说、做的事，往往在关键时候点醒人。朋友觉得迷惘会来揾你，你不需要说大道理，只是分享你的角度，对方就已绂揾到方向。你是一条天然的灵魂通道，光透过你流到其他人身上。',
        },
      ],
      growthTopics: [
        {
          weakness: '太理想化，忽略现实',
          detail: '你相信一切都会好起来，所以你绂常忽略现实的警告信号。朋友借钱不还，你觉得「他下次会给回」结果没；同事偷懒你帮他顶更，你觉得「他会感激」结果他变本加厉；伴侣对你不好，你觉得「他会变好」结果拖了几年。你不是蠢，你只是太相信人性的光明面。',
          opposite: '「一体两面」视角：这个弱点的另一面，是你非凡的信任和希望。世界里面太多愤世嫉俗的人，而你仍然选择相信美好。这份愿意相信的勇气，是这个世界最需要的力量。只需要加上一点现实感，你的善良就会变得有智慧。',
          practice: '行动练习：每次决定帮人之前，先问自己3个现实问题：1）这个人过去有没珍惜过我的帮忙？2）我帮了之后，他会成长还是依赖？3）如果我不帮，最坏的结果是什么？行完这3个问题先决定点做。',
        },
        {
          weakness: '不识保护自己，容易被人消耗',
          detail: '你对所有人都好，但不是所有人都值得你的好。你太容易信人，太好说说，太难say no。结果是：你绂常被情绪勒索、被利用、被当成「好人卡」，人们需要帮忙先揾你，不需要的时候不见人影。你付出了很多，但攞回的很少。你不是没感觉，你只是不想出声。',
          opposite: '「一体两面」视角：这个弱点的另一面，是你的慷慨和包容。你有能力无条件这样付出爱和关怀，这个是很高尚的品质。你需要的不是收起你的光，而是学会过滤，将光照向值得的人，而不是照亮每一条阴暗的坑渠。',
          practice: '行动练习：设立「能量过滤器」，每星期和自己约定：1）不主动帮人解决问题，等人开口先。2）人开口之后，先问自己「这件事值不值得用我的能量？」3）如果不值得，温柔但坚定这样说：「对不住，这次我帮不到手。」',
        },
      ],
      actionPlan: {
        daily: '每日起床对住镜子说：「我的光源自内心，我选择将光照向值得的地方。我不需要照亮每一个人，我只需要忠于自己。」',
        weekly: '每周反思：「这个星期有没哪个人是攞了我的能量而没给回任何东西我？」如果有，下星期减少对那个人的付出。',
        breakLimit: '破框练习：打破「好人就要帮所有人」这个信念。真正的光是温暖而不是灼伤自己。耶稣都有赶走圣殿里面的兑换商人的时候。',
      },
      pairing: {
        best: '天狼星人 — 光明星人的温柔善良配上天狼星人的智慧保护，形成完美的「光与盾」组合。天狼星人帮你分辨哪些人值得帮，你帮天狼星人打开心扉。',
        challenge: '靛蓝星人 — 光明星人的乐观理想和靛蓝星人的激烈愤怒形成强烈反差。靛蓝星人会觉得你太天真，你会觉得他太负面。但这个配对可以教晓你：真正的光不怕黑暗，反而需要黑暗先显得珍贵。',
      },
      guidance: {
        chakra: '心轮（第四脉轮）、顶轮（第七脉轮）',
        crystal: '柠檬晶（Citrine）、白水晶（Clear Quartz）',
        zodiac: '狮子座、双鱼座、射手座',
      },
    },
  },
};

// ============================================================================
// 常量导出
// ============================================================================

export const TOTAL_STARSEED = QUESTIONS.length;

export const STAR_IDS: StarId[] = ['pleiadian', 'sirian', 'orion', 'arcturian', 'andromedan', 'indigo', 'lightworker'];

// ============================================================================
// 计分函数
// ============================================================================

export function calculateStarseedResult(
  answers: (number | number[] | { day: string; month: string; year: string } | { dataUrl: string; fileName: string } | null)[]
): StarseedResult {
  const starIds: StarId[] = ['pleiadian', 'sirian', 'orion', 'arcturian', 'andromedan', 'indigo', 'lightworker'];
  const scores: Record<StarId, number> = { pleiadian: 0, sirian: 0, orion: 0, arcturian: 0, andromedan: 0, indigo: 0, lightworker: 0 };

  QUESTIONS.forEach((q, qi) => {
    const answer = answers[qi];
    if (answer === null || answer === undefined) return;

    if (q.type === 'multi' && Array.isArray(answer)) {
      answer.forEach(oi => {
        if (q.options?.[oi]?.scores) {
          Object.entries(q.options[oi].scores).forEach(([sid, val]) => {
            scores[sid as StarId] += val;
          });
        }
      });
    } else if (typeof answer === 'number') {
      if (q.options?.[answer]?.scores) {
        Object.entries(q.options[answer].scores).forEach(([sid, val]) => {
          scores[sid as StarId] += val;
        });
      }
    }
  });

  let maxScore = 0;
  let topStars: StarId[] = [];
  starIds.forEach(id => {
    if (scores[id] > maxScore) {
      maxScore = scores[id];
      topStars = [id];
    } else if (scores[id] === maxScore) {
      topStars.push(id);
    }
  });

  const winner: StarId = topStars.length === 1 ? topStars[0] : topStars[Math.floor(Math.random() * topStars.length)];
  const sortedScores = starIds.map(id => ({ id, score: scores[id] })).sort((a, b) => b.score - a.score);

  return {
    starId: winner,
    star: STARS[winner],
    report: REPORT_CONTENT[winner],
    scores,
    sortedScores,
  };
}
