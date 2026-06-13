// 心念执念检测 — 唯识学 × Sino-NLP
// 5 维度 × 4 题 · 0-4 计分 · 总分 0-80
// 理论依据：《成唯识论》《百法明门论》

export interface AttachmentQuestion {
  id: number;
  dimension: "self-view" | "self-love" | "self-pride" | "self-ignorance" | "dharma-grasp";
  dimensionLabel: string;
  text: string;
  tip: string; // 亦须小语
}

export interface AttachmentOption {
  score: number;
  label: string;
}

export interface AttachmentDimensionResult {
  dimension: string;
  dimensionLabel: string;
  score: number;
  maxScore: number;
}

export interface AttachmentResult {
  totalScore: number;
  severity: string;
  severityClass: "free" | "light" | "bound" | "deep-bound" | "trapped";
  advice: string;
  dimensions: AttachmentDimensionResult[];
  extendedLearning: string[];
  ctaText: string;
}

export const ATTACHMENT_DIMENSIONS = [
  { key: "self-view", label: "我见执（自我固化）" },
  { key: "self-love", label: "我爱执（情感黏着）" },
  { key: "self-pride", label: "我慢执（比较优越）" },
  { key: "self-ignorance", label: "我痴执（无明重复）" },
  { key: "dharma-grasp", label: "法执（外物依赖）" },
] as const;

export const ATTACHMENT_QUESTIONS: AttachmentQuestion[] = [
  // ─── 维度一：我见执（自我固化） ───
  {
    id: 1,
    dimension: "self-view",
    dimensionLabel: "我见执",
    text: "当有人否定你的观点时，你很难只是听听就算，总觉得必须证明自己是对的。",
    tip: "唯识学称之为「我见」——末那识恒审思量，执着于「我的观点就是对的」。《成唯识论》说我见如暗夜行路，只见自己脚下一寸，不见天地开阔。",
  },
  {
    id: 2,
    dimension: "self-view",
    dimensionLabel: "我见执",
    text: "你对自己有一套很明确的形象定义（例如「我是个坚强的人」「我是个好人」），一旦有人挑战这个形象，你会非常不安。",
    tip: "我见的深层运作是「身份固化」——你将自己锁定在某个形象里，然后用一生去捍卫它。唯识学说，真正的「我」如流水，从不被任何形状定住。",
  },
  {
    id: 3,
    dimension: "self-view",
    dimensionLabel: "我见执",
    text: "你做决定时，很难接受别人的建议，因为你觉得那是对你判断力的质疑。",
    tip: "末那识的「恒审思量」让你持续地、不自觉地维护「我」的边界。接受建议不是输，而是让「我」的围墙透一扇窗。",
  },
  {
    id: 4,
    dimension: "self-view",
    dimensionLabel: "我见执",
    text: "在讨论中，你常常觉得「被误解」，然后花很多精力去解释自己，希望对方完全理解你的立场。",
    tip: "执着于「被理解」本身就是我见的变奏。《成唯识论》指出，我见的另一面是「他见」——你以为在沟通，其实在确认「我」的存在感。真正的沟通，是先放下「我需要你懂我」。",
  },

  // ─── 维度二：我爱执（情感黏着） ───
  {
    id: 5,
    dimension: "self-love",
    dimensionLabel: "我爱执",
    text: "你对某些人或关系有一种「离不开」的感觉，即使你知道这段关系对你不好，也很难抽身。",
    tip: "唯识学中的「我爱」并非一般意义的爱，而是末那识对「我所」的攀缘——将外在的人事物视为「我的」，失去时便如失自身。《百法明门论》说贪心「于有有具染着为性」，正是此意。",
  },
  {
    id: 6,
    dimension: "self-love",
    dimensionLabel: "我爱执",
    text: "当你与重视的人分开一段时间，你会感到强烈的不安，需要反复确认对方还在。",
    tip: "我爱执的本质是「依附即安全感」的错觉。唯识学认为，末那识将安稳感寄托于外境，外境一变，安稳便碎。真正的安全感，从来不在外面。",
  },
  {
    id: 7,
    dimension: "self-love",
    dimensionLabel: "我爱执",
    text: "你对某些物品或习惯有很强的依赖（例如特定的摆设、仪式感、每日必做的事），一旦被打乱就非常焦躁。",
    tip: "我爱执不仅指向人，也指向「我所」——我的空间、我的习惯、我的秩序。当「我的」成了安全感的唯一来源，你便成为了它的囚徒。",
  },
  {
    id: 8,
    dimension: "self-love",
    dimensionLabel: "我爱执",
    text: "分手或失去重要的人之后，你很长时间无法接受新的可能性，心里一直留着那个位置。",
    tip: "我爱执最深的表现是「心位不让」——即使人已不在，末那识仍守着那个位置不肯腾空。唯识学说「种子生现行」，旧的种子不转化，新的可能性便无处着根。",
  },

  // ─── 维度三：我慢执（比较优越） ───
  {
    id: 9,
    dimension: "self-pride",
    dimensionLabel: "我慢执",
    text: "你常常将自己与别人比较，无论是成就、外貌、关系还是物质，总觉得自己「不能输」。",
    tip: "「我慢」是末那识四烦恼中最具比较性的执着。《成唯识论》列出七种慢——过慢、增上慢、卑劣慢等，本质都是将自我价值建立在「比」之上。不比，便不知道自己是谁。",
  },
  {
    id: 10,
    dimension: "self-pride",
    dimensionLabel: "我慢执",
    text: "当别人称赞你时，你会觉得开心但同时也焦虑——因为你担心下次做不到那么好。",
    tip: "我慢与我见交织时，称赞成了新的枷锁——你必须持续「够好」才能维持那个形象。唯识学说我慢如高山，站在高处的同时也困在了高处。",
  },
  {
    id: 11,
    dimension: "self-pride",
    dimensionLabel: "我慢执",
    text: "你不太能接受别人比你做得好，即使嘴上说恭喜，心里总有一丝不舒服。",
    tip: "《成唯识论》卷六说「慢谓恃己高举」，我慢的本质是高举自我。当别人的光芒刺到你，不是对方太亮，是你把自己放在了需要亮的位置。",
  },
  {
    id: 12,
    dimension: "self-pride",
    dimensionLabel: "我慢执",
    text: "你对自己的弱点或失败非常敏感，会尽量避免让别人看到你「不行」的那一面。",
    tip: "我慢的反面不是谦虚，而是「卑劣慢」——因为害怕被看低而掩饰。唯识学提醒我们，真正的自信不需要舞台，正如真正的山不惧被看到低谷。",
  },

  // ─── 维度四：我痴执（无明重复） ───
  {
    id: 13,
    dimension: "self-ignorance",
    dimensionLabel: "我痴执",
    text: "你发现自己总是陷入类似的困境——换了工作、换了伴侣、换了环境，问题好像还是同一个。",
    tip: "唯识学称此为「种子生现行，现行熏种子」——旧的习气像种子般潜伏，遇到相似因缘便自动发芽，而你的反应又反过来强化了那颗种子。这就是为什么换了场景，剧本却没换。",
  },
  {
    id: 14,
    dimension: "self-ignorance",
    dimensionLabel: "我痴执",
    text: "你有些坏习惯明知要改，但每次到了那个情境就好像被「自动驾驶」接管，事后才后悔。",
    tip: "我痴即是无明，《成唯识论》说「痴谓无明，于诸理事迷暗为性」。无明不是不懂，而是「懂了却做不到」——因为驱动你的不是理智，而是阿赖耶识里深埋的习气种子。",
  },
  {
    id: 15,
    dimension: "self-ignorance",
    dimensionLabel: "我痴执",
    text: "朋友或伴侣指出你的某个重复模式时，你会下意识地否认或回避，即使你隐约知道他们说的是对的。",
    tip: "无明最善于伪装成「这次不一样」。唯识学的「遍计所执性」指出，我们会在相同的执着上包裹不同的故事，让自己以为这是新问题。看穿「不一样的外衣，一样的骨头」，是我痴松动的起点。",
  },
  {
    id: 16,
    dimension: "self-ignorance",
    dimensionLabel: "我痴执",
    text: "你很少静下来观察自己的内在状态，总是被外在的事情牵着走，直到出问题才停下来。",
    tip: "我痴的温床是「不觉察」。《成唯识论》说末那识「恒审思量我」，但你却浑然不觉。唯识的修行从「作意」开始——刻意地将注意力转向内在，让无意识的运作进入意识的光中。",
  },

  // ─── 维度五：法执（外物依赖） ───
  {
    id: 17,
    dimension: "dharma-grasp",
    dimensionLabel: "法执",
    text: "你觉得只有达到某个目标（例如某个收入、某个职位、某段关系）之后，你才能真正快乐。",
    tip: "「法执」是唯识学中与「我执」并列的两大根本执着。《成唯识论》说「缘自心所现似法」，我们将外在条件当作安稳的基础，却忘了外境如云，从不为谁停留。",
  },
  {
    id: 18,
    dimension: "dharma-grasp",
    dimensionLabel: "法执",
    text: "当你失去某个重要的外在条件（例如工作、地位、财务安全感）时，你会觉得整个人都要崩溃了。",
    tip: "法执最痛的时刻是「所执之法消失」——你以为失去的是那个东西，其实失去的是你建构自我的地基。唯识学提醒：你从来不是那个职位、那个数字、那个身份。",
  },
  {
    id: 19,
    dimension: "dharma-grasp",
    dimensionLabel: "法执",
    text: "你习惯用外在标准来衡量自己的价值——收入、学历、社交圈、他人的评价——很难从内在找到自我肯定。",
    tip: "法执的日常面貌是「外包自我价值」——把定义自己的权力交给了外在标准。《成唯识论》的「三性」说：遍计所执性让你将标签当成本质。撕掉标签，不是否定成就，而是不被标签绑架。",
  },
  {
    id: 20,
    dimension: "dharma-grasp",
    dimensionLabel: "法执",
    text: "你很难接受「顺其自然」，总觉得必须掌控局面、把握一切，否则就是不负责。",
    tip: "法执的极致表现是「掌控即安全」的信念。唯识学的「依他起性」指出，一切现象皆是因缘和合，从无一物可被独占掌控。放下掌控，不是放弃努力，而是承认「努力之外，还有因缘」。",
  },
];

export const ATTACHMENT_OPTIONS: AttachmentOption[] = [
  { score: 0, label: "从不" },
  { score: 1, label: "偶尔" },
  { score: 2, label: "有时" },
  { score: 3, label: "经常" },
  { score: 4, label: "总是" },
];

export const TOTAL_ATTACHMENT = ATTACHMENT_QUESTIONS.length;

export function calcAttachmentResult(answers: Record<number, number>): AttachmentResult {
  const totalScore = ATTACHMENT_QUESTIONS.reduce((sum, q) => sum + (answers[q.id] ?? 0), 0);

  // 各维度得分
  const dimensions: AttachmentDimensionResult[] = ATTACHMENT_DIMENSIONS.map((dim) => {
    const dimQuestions = ATTACHMENT_QUESTIONS.filter((q) => q.dimension === dim.key);
    const dimScore = dimQuestions.reduce((sum, q) => sum + (answers[q.id] ?? 0), 0);
    return {
      dimension: dim.key,
      dimensionLabel: dim.label,
      score: dimScore,
      maxScore: dimQuestions.length * 4,
    };
  });

  let severity: string;
  let severityClass: AttachmentResult["severityClass"];
  let advice: string;
  let extendedLearning: string[];
  let ctaText: string;

  if (totalScore <= 16) {
    severity = "自在行者";
    severityClass = "free";
    advice = "你的执念极轻，觉察力强，对自我、情感、比较、习气、外物皆能保持适度距离。你未必没有执着，但你总能在执着升起时看见它，并选择不跟它走。这份自在，是修习而来的智慧。";
    extendedLearning = [
      "唯识学的「转识成智」——当执念不再缠缚，末那识转为「平等性智」，你不再需要比较，因为你已安住于平等",
      "自在不是终点，而是持续修习的状态。Sino-NLP 的进阶技术可以帮助你深化觉察的精微度",
    ];
    ctaText = "想让这份自在更深更稳？欢迎了解 Sino-NLP 进阶课程 → [课程详情]";
  } else if (totalScore <= 32) {
    severity = "轻安行者";
    severityClass = "light";
    advice = "你偶有执着，但整体上能自我调节。在某些特定情境中，你会感受到执念的拉力——也许是某个观点被挑战时、也许是某段关系的拉扯——但你总能在一段时间后找回平衡。你需要的不是大改造，而是更精准的觉察练习。";
    extendedLearning = [
      "《成唯识论》的「四寻思观」——通过名、事、自性、差别四个层面来观察执念，可以帮助你更快地看见「我到底在执着什么」",
      "执念的松动不需要对抗，只需要看见。Sino-NLP 的觉察技术可以加速这个过程",
    ];
    ctaText = "想让偶发的执念更快松开？欢迎了解 Sino-NLP 实践课程 → [课程详情]";
  } else if (totalScore <= 48) {
    severity = "缠缚行者";
    severityClass = "bound";
    advice = "你的执念已形成了可见的模式，在生活中反复出现。你可能在某些维度特别明显——也许是情感上的黏着、也许是比较中的焦虑、也许是重复中不自觉——这些模式让你反复经历类似的困境，但你也开始看见了它们。这份看见，就是转化的起点。";
    extendedLearning = [
      "唯识学的「三性」——遍计所执性（你在上面加了故事）、依他起性（因缘和合而生）、圆成实性（放下执着后的本来面目）——可以帮助你区分「事情本身」和「你加在上面的执着」",
      "执念缠缚的核心是「种子生现行」的循环，Sino-NLP 提供系统化的方法来转化这些深层种子",
    ];
    ctaText = "想开始系统性地松动执念模式？欢迎了解 Sino-NLP 核心课程 → [课程详情]";
  } else if (totalScore <= 64) {
    severity = "深缚行者";
    severityClass = "deep-bound";
    advice = "你的执念已经深入多个层面，不同维度之间相互牵动——我见强化了我慢、我爱加深了我痴、法执让整个系统更难松动。你可能常常感到「又来了」——同样的争执、同样的不安、同样的纠结。但请记住：你会在这里做这份测评，说明你内在已经有一个不愿再被困住的力量。";
    extendedLearning = [
      "唯识学认为，深层执念的转化需要「闻思修」——先听闻理解（闻），再深入观察（思），最后在实修中转化（修）。单靠理解是不够的，需要在实践中一层层松开",
      "《成唯识论》的「四如实智」是深层转化的路径，Sino-NLP 将此转化为可操作的系统方法",
    ];
    ctaText = "想在系统引导下逐步松开深层执念？欢迎了解 Sino-NLP 系统课程 → [课程详情]";
  } else {
    severity = "困缚行者";
    severityClass = "trapped";
    advice = "你的执念已在多个层面深入缠绕，你可能常常觉得「被困住了」——在观点里被困住、在关系里被困住、在比较里被困住、在重复里被困住、在外物里被困住。五种执念相互编织成网，让你难以呼吸。但请记住：你能够如实回答这20道题，说明你的觉察力比你想象的更强。";
    extendedLearning = [
      "深层执念往往与早年的经历和信念紧密相连，这不是你的错。唯识学说阿赖耶识中的种子需要因缘才能转化，而「寻求帮助」本身就是最好的因缘",
      "Sino-NLP 在创伤知情（Trauma-Informed）的框架下，提供温和且有效的深层转化路径",
    ];
    ctaText = "你不需要独自面对。欢迎了解 Sino-NLP 深度修习计划 → [课程详情]";
  }

  return { totalScore, severity, severityClass, advice, dimensions, extendedLearning, ctaText };
}
