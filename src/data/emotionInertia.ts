// 情绪惯性模式 — Sino-NLP × 四体模型
// 5 维度 × 4 题 · 0-4 计分 · 总分 0-80
// 理论依据：Sino-NLP 心锚/表象系统/后设程序、Kuppens 情绪惯性研究、四体模型

export interface EmotionQuestion {
  id: number;
  dimension: "trigger" | "stickiness" | "representation" | "metaprogram" | "imbalance";
  dimensionLabel: string;
  text: string;
  tip: string; // 亦须小语
}

export interface EmotionOption {
  score: number;
  label: string;
}

export interface EmotionDimensionResult {
  dimension: string;
  dimensionLabel: string;
  score: number;
  maxScore: number;
}

export interface EmotionResult {
  totalScore: number;
  severity: string;
  severityClass: "flowing" | "ripple" | "wave" | "vortex" | "deep-vortex";
  advice: string;
  dimensions: EmotionDimensionResult[];
  extendedLearning: string[];
  ctaText: string;
}

export const EMOTION_DIMENSIONS = [
  { key: "trigger", label: "情绪触发模式（心锚效应）" },
  { key: "stickiness", label: "情绪黏着指数（惯性持续）" },
  { key: "representation", label: "表象系统偏执（感官锁定）" },
  { key: "metaprogram", label: "后设程序惯性（思维自动导航）" },
  { key: "imbalance", label: "情绪体失衡（四体模型）" },
] as const;

export const EMOTION_QUESTIONS: EmotionQuestion[] = [
  // ─── 维度一：情绪触发模式（心锚效应） ───
  {
    id: 1,
    dimension: "trigger",
    dimensionLabel: "心锚效应",
    text: "你听到某首旧歌或某种声音，情绪就瞬间被拉回过去的某个时刻，即使你当下其实过得还不错。",
    tip: "在 Sino-NLP 中，这称为「心锚」（Anchoring）——当某个刺激与强烈情绪曾同时出现，大脑便会将两者绑定，日后再遇同样刺激，情绪便自动重播。了解心锚，是拆解情绪自动播放的第一步。",
  },
  {
    id: 2,
    dimension: "trigger",
    dimensionLabel: "心锚效应",
    text: "你走进某个空间（例如老家、医院、某间餐厅），身体还没反应过来，心情就已经变了。",
    tip: "心锚不只需要语言，空间、气味、光线都可以成为触发媒介。巴甫洛夫的条件反射研究早已证实，环境线索能绕过意识，直接唤醒身体记忆。",
  },
  {
    id: 3,
    dimension: "trigger",
    dimensionLabel: "心锚效应",
    text: "有人对你说某句话——语气或用词似曾相识——你立刻感到不舒服，但理智上知道对方没有恶意。",
    tip: "语言心锚是日常生活中最隐微的触发源。一句「你怎么又……」可能精准触碰你童年被指责的神经回路，让你瞬间回到那个无助的状态。这不是你太敏感，而是心锚在运作。",
  },
  {
    id: 4,
    dimension: "trigger",
    dimensionLabel: "心锚效应",
    text: "某种特定的气味（如某种香水、食物、消毒水味）一出现，你的情绪就像被按下了某个按钮，你自己也说不清为什么。",
    tip: "嗅觉是唯一不经过视丘而直接连结边缘系统的感官，这意味着气味心锚绕过了理性的过滤闸门，直达情绪中枢。这也是为什么气味触发的情绪往往最突然、最强烈、最难用理智压下。",
  },

  // ─── 维度二：情绪黏着指数（惯性持续） ───
  {
    id: 5,
    dimension: "stickiness",
    dimensionLabel: "惯性持续",
    text: "一件让你不开心的小事发生后，你会反复想很久，即使别人觉得那已经过去了。",
    tip: "Kuppens 与 Verduyn 的情绪惯性研究指出，情绪一旦启动，有些人会像进入一条单向隧道——反刍思考（rumination）让情绪不断自我增强，形成惯性持续。你不是不想放下，是大脑的惯性回路还没松开。",
  },
  {
    id: 6,
    dimension: "stickiness",
    dimensionLabel: "惯性持续",
    text: "你早上醒来心情不好，整个上午甚至整天都会被那个情绪拖着走，很难靠自己切换频道。",
    tip: "情绪惯性的核心特征是「低转换力」——情绪启动后，从一个状态过渡到另一个状态的能力降低。研究显示，情绪调节困难与情绪惯性高度相关，这不是意志力不足，而是调节策略需要更新。",
  },
  {
    id: 7,
    dimension: "stickiness",
    dimensionLabel: "惯性持续",
    text: "别人跟你的争执或误会已经解决了，但你的心里还在反复播放那段对话，情绪久久无法归零。",
    tip: "当事件的外在压力源已消失，内在的情绪却仍在运转，这正是惯性持续的典型表现。Sino-NLP 称此为「情绪回路未完成关闭」——身体的战斗或逃跑反应还没收到「安全了」的信号。",
  },
  {
    id: 8,
    dimension: "stickiness",
    dimensionLabel: "惯性持续",
    text: "你明知继续想下去没有用，却还是停不下来，像被卷入一个情绪的漩涡里。",
    tip: "「明知却停不下来」是情绪惯性最令人挫折的体验。Kuppens 等人的研究发现，高情绪惯性者的大脑预设模式网络（DMN）活动更强，让反刍思考自动运行。觉察到「我在漩涡里」，本身就是松动的第一步。",
  },

  // ─── 维度三：表象系统偏执（感官锁定） ───
  {
    id: 9,
    dimension: "representation",
    dimensionLabel: "感官锁定",
    text: "当你回想一件不愉快的事，脑中总是先浮现鲜明的画面，但你不太记得当时的身体感受或听到了什么。",
    tip: "Sino-NLP 表象系统理论指出，我们透过视觉（V）、听觉（A）、动觉（K）、嗅觉（O）、味觉（G）五感来编码经验。当你惯用视觉通道，画面会特别鲜明，但身体感受和声音线索却像被静音了——这不是遗漏，是感官偏好造成的遮蔽。",
  },
  {
    id: 10,
    dimension: "representation",
    dimensionLabel: "感官锁定",
    text: "你跟人沟通时，特别在意对方的语气和用词，但不太注意对方的表情或自己的身体感觉。",
    tip: "惯用听觉通道的人，对声音的质地极度敏锐，却可能忽略视觉与动觉的信息。Bandler 与 Grinder 发现，当我们过度依赖某一感官通道，其他通道的信息就像被调低了音量——不是不存在，而是你没有调频去接收。",
  },
  {
    id: 11,
    dimension: "representation",
    dimensionLabel: "感官锁定",
    text: "你习惯用「感觉」来判断事情好不好，但很难用具体的画面或语言向别人描述清楚。",
    tip: "惯用动觉（Kinesthetic）通道的人，身体感受是最主要的决策依据，但将感受转译为画面或语言时，往往觉得「说不清楚」。Sino-NLP 的次感元技术可以帮助你将模糊的感受细致拆解，让内在经验变得可操作。",
  },
  {
    id: 12,
    dimension: "representation",
    dimensionLabel: "感官锁定",
    text: "当你试着理解自己的情绪时，你总是用同一种方式去想——例如一直在脑中播放画面，或一直在心里自言自语——但你很少切换到其他方式。",
    tip: "表象系统偏执最核心的表现不是「你用哪个感官」，而是「你只用那个感官」。当情绪被困在单一感官通道里，切换通道往往是打破情绪惯性最快的路——例如从画面切到身体感受，或从内在对话切到视觉想象。",
  },

  // ─── 维度四：后设程序惯性（思维自动导航） ───
  {
    id: 13,
    dimension: "metaprogram",
    dimensionLabel: "思维自动导航",
    text: "面对新的事情或改变，你会先想到可能出什么问题，而不是可能带来什么好处。",
    tip: "这是 Sino-NLP 后设程序中「避开模式」（Away From）的表现——你的大脑自动优先扫描风险与威胁，而非机会与资源。避开模式在演化上具有保护功能，但当它成为唯一的滤镜，你会错过许多可能性。",
  },
  {
    id: 14,
    dimension: "metaprogram",
    dimensionLabel: "思维自动导航",
    text: "你做决定时，常需要别人的认可或意见才觉得安心，很难单凭自己的感觉就下判断。",
    tip: "后设程序中的「外参考」（External Reference）倾向，让你习惯将判断的标准放在自身之外。Cameron-Bandler 指出，外参考本身不是问题，但当它成为自动导航的默认模式，你与内在声音的联结便会逐渐变弱。",
  },
  {
    id: 15,
    dimension: "metaprogram",
    dimensionLabel: "思维自动导航",
    text: "遇到意见不同的时候，你习惯先退让或避开冲突，即使你心里其实不认同。",
    tip: "这反映了后设程序中「趋向和谐」（Toward Harmony）的强烈偏好。避开冲突短期换来平静，长期却让真实的自我表达被压抑，未表达的情绪会转为身体的紧绷或内在的委屈。真正的和谐，是能够说出自己之后的和谐。",
  },
  {
    id: 16,
    dimension: "metaprogram",
    dimensionLabel: "思维自动导航",
    text: "你常常觉得事情「应该」要怎样，当现实跟你想要的不一样时，情绪就会很大波动。",
    tip: "后设程序中的「匹配模式」（Matching）让你倾向关注事情与预期的落差，而非发掘其中的可能性。当「应该」变成铁律，你的情绪便被绑在了现实与预期的缝隙里。松动「应该」，不是放弃标准，而是让心有弹性。",
  },

  // ─── 维度五：情绪体失衡（四体模型） ───
  {
    id: 17,
    dimension: "imbalance",
    dimensionLabel: "情绪体失衡",
    text: "当你情绪低落时，你的身体也会跟着出问题——头痛、胃痛、肩颈僵硬、睡不好——好像情绪直接住进了身体里。",
    tip: "四体模型中，情绪体与物理体密切相连。心身医学研究早已证实，未处理的情绪会转化为身体症状——这不是「心理作用」，而是情绪体的负荷溢出到了物理体。当你学会读懂身体的情绪语言，两个体便能重新对话。",
  },
  {
    id: 18,
    dimension: "imbalance",
    dimensionLabel: "情绪体失衡",
    text: "你明知道某个担心是不合理的，理智上想得通，但情绪就是过不去，好像心里住着另一个不听话的自己。",
    tip: "这是情绪体压过心智体的经验——理智的声音在，但情绪的音量更大。四体模型提醒我们，逻辑说服不了感觉，因为它们运作在不同的频率上。与其用脑去压心，不如先承认心有它自己的节奏。",
  },
  {
    id: 19,
    dimension: "imbalance",
    dimensionLabel: "情绪体失衡",
    text: "你觉得自己很难感受到平静、感恩或与什么更大的存在联结，好像被情绪的噪音盖住了内在的安静。",
    tip: "当情绪体长期处于高负荷状态，灵性体的信号就像被遮蔽的星光——不是不在，是太吵了听不见。四体模型认为，灵性体的本质是联结与意义感，而情绪的喧嚣会让人失去与深层宁静的接触。安静下来，不是消灭情绪，是让情绪回归它该有的音量。",
  },
  {
    id: 20,
    dimension: "imbalance",
    dimensionLabel: "情绪体失衡",
    text: "你发现自己的情绪反应总是比事件本身「大」——一件小事引发很大的波澜，好像情绪的容量早已超载。",
    tip: "情绪体失衡时，反应会不成比例地放大——这不是你「反应过度」，而是情绪体中积压的未处理经验，让新的事件叠加在旧的伤口上。四体模型指出，当情绪体长期失衡，它会向物理体借症状、向心智体借理由、向灵性体借意义，直到整个人都在为情绪服务。",
  },
];

export const EMOTION_OPTIONS: EmotionOption[] = [
  { score: 0, label: "从不" },
  { score: 1, label: "偶尔" },
  { score: 2, label: "有时" },
  { score: 3, label: "经常" },
  { score: 4, label: "总是" },
];

export const TOTAL_EMOTION = EMOTION_QUESTIONS.length;

export function calcEmotionResult(answers: Record<number, number>): EmotionResult {
  const totalScore = EMOTION_QUESTIONS.reduce((sum, q) => sum + (answers[q.id] ?? 0), 0);

  const dimensions: EmotionDimensionResult[] = EMOTION_DIMENSIONS.map((dim) => {
    const dimQuestions = EMOTION_QUESTIONS.filter((q) => q.dimension === dim.key);
    const dimScore = dimQuestions.reduce((sum, q) => sum + (answers[q.id] ?? 0), 0);
    return {
      dimension: dim.key,
      dimensionLabel: dim.label,
      score: dimScore,
      maxScore: dimQuestions.length * 4,
    };
  });

  let severity: string;
  let severityClass: EmotionResult["severityClass"];
  let advice: string;
  let extendedLearning: string[];
  let ctaText: string;

  if (totalScore <= 16) {
    severity = "流动者";
    severityClass = "flowing";
    advice = "你的情绪像溪水一样灵活，来去自如。触发、黏着、偏执、自动导航、失衡——这些词离你很远。你对自己的情绪有相当的觉察力，能够在不同状态间自然切换。你的四体运作和谐，情绪是你生命的流动感，而非阻碍。";
    extendedLearning = [
      "心锚不只是触发器，也可以是资源锚——你可以刻意为自己安装「信心锚」「平静锚」，让正向状态随时可唤",
      "表象系统的灵活切换是 Sino-NLP 进阶技术的基础，你的天赋在此，可以进一步发展次感元精微操作能力",
    ];
    ctaText = "想让这份流动力更上层楼？欢迎了解 Sino-NLP 进阶课程 → [课程详情]";
  } else if (totalScore <= 32) {
    severity = "轻波者";
    severityClass = "ripple";
    advice = "你的情绪偶有波纹，但大体上仍能自行回稳。在某些特定情境下，你会感受到惯性的拉力——也许是某个心锚偶尔被触发，也许是某些思维模式偶尔自动启动——但你总能在一段时间后找回自己。你需要的不是大改造，而是更精准的微调。";
    extendedLearning = [
      "Sino-NLP 中的「中断模式」（Pattern Interrupt）技术，可以帮助你在惯性刚启动时就温和地打断它",
      "后设程序没有好坏之分，觉察到自己的默认模式后，重点是增加选择，而非否定自己",
    ];
    ctaText = "想让情绪波纹更快平息？欢迎了解 Sino-NLP 实践课程 → [课程详情]";
  } else if (totalScore <= 48) {
    severity = "起伏者";
    severityClass = "wave";
    advice = "你的情绪惯性已经形成了可见的轨迹。你可能在某些维度特别明显——也许是心锚容易被触发、也许是情绪容易黏着、也许是思维总走同一条路。这些模式让你在生活中反复经历类似的情绪困境，但你也开始隐约看见了它们。这份看见，就是转化的起点。";
    extendedLearning = [
      "情绪惯性的研究显示，觉察练习（如正念、身体扫描）能有效降低情绪黏着指数，因为它训练大脑在情绪与反应之间插入一个「暂停空间」",
      "四体模型提醒：当某一个维度得分特别高，那正是你的情绪体向其他三体「借贷」最多的地方，也是修复的优先入口",
    ];
    ctaText = "想开始系统性地觉察与松动情绪惯性？欢迎了解 Sino-NLP 核心课程 → [课程详情]";
  } else if (totalScore <= 64) {
    severity = "漩涡者";
    severityClass = "vortex";
    advice = "你的情绪惯性已经形成了较深的漩涡，在不同的维度之间相互牵动——心锚触发了黏着，黏着加深了偏执，偏执强化了自动导航，失衡让整个系统更难自行回稳。你可能在生活中经常感到「又被卷进去了」，但请知道：看见漩涡的人，已经站在漩涡之外了。";
    extendedLearning = [
      "Sino-NLP 的「重新框架」（Reframing）与「次感元改变」（Submodality Shift）技术，是从表层到深层拆解情绪漩涡的系统方法，建议在专业引导下学习",
      "情绪惯性研究指出，高惯性者最需要的不是「压抑情绪」，而是「增加情绪调节策略的多样性」——你需要的不只是忍，而是更多的工具",
    ];
    ctaText = "漩涡可以被拆解。欢迎了解 Sino-NLP 系统课程 → [课程详情]";
  } else {
    severity = "深漩者";
    severityClass = "deep-vortex";
    advice = "你的情绪惯性已经深入生活的多个层面，你可能常常觉得自己「困在里面」，甚至分不清哪些是真正的感受、哪些是惯性的自动播放。五个维度的惯性相互缠绕，让情绪像一张密网。但请记住：你会做这份测评，说明你内在已经有一个不愿再被困住的力量在觉醒。";
    extendedLearning = [
      "深层情绪惯性往往源自早年形成的依附模式与创伤经验，这不是你的错，也不是你「不够努力」。四体模型建议从物理体的安顿开始——先让身体安全了，情绪体才有空间松动",
      "深漩者需要的不是自助工具，而是有品质的陪伴与系统性的深度修习。Sino-NLP 在创伤知情（Trauma-Informed）的框架下，提供温和且有效的改变路径",
    ];
    ctaText = "你不需要独自面对深漩。欢迎了解 Sino-NLP 深度修习计划 → [课程详情]";
  }

  return { totalScore, severity, severityClass, advice, dimensions, extendedLearning, ctaText };
}
