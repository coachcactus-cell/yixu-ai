// 星宿種子性格測評 - 完整數據檔
// Sino-NLP 中華身心語言學（原創：C）

// ============================================================================
// 類型定義
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
  image: string; // TODO: 需替換為實際圖片路徑
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
// INTRO_SLIDES — 5 頁科普
// ============================================================================

export const INTRO_SLIDES: IntroSlide[] = [
  {
    emoji: '🌌',
    title: '你有沒試過⋯⋯？',
    list: [
      '靜靜這麼望住夜空，覺得自己的靈魂好似不屬於這個世界？',
      '經常發夢見到星空、外星飛船、或者神秘的星際旅程？',
      '對古文明、金字塔、麥田圈、史前遺跡有種說不出的著迷？',
      '覺得自己的人生使命不止是上班、湊仔、還房貸，而是有更重要的東西等緊你？',
    ],
    footer: '如果你中了以上任何一條，恭喜你，你可能不止是一個普通的地球人，你的靈魂，可能來自星際。',
  },
  {
    emoji: '⭐',
    title: '什麼是星宿種子？',
    text: '「星宿種子」是一個源自新時代（New Age）靈性運動的概念。他的核心意思是：有一些靈魂，他們的故鄉並不在地球，而是來自其他星系、星團、甚至更高維度的空間。這些靈魂帶住特定的使命和任務，自願降生到地球，幫助人類和地球提升意識。',
    text2: '不好誤會，他們不是著太空衣、揸飛船的外星人，他們和你一樣是人類，有血肉之軀，會喊會笑。只是在靈魂層面，他們對星際有種深層的「鄉愁」。',
    conclusion: '簡單說：他們的身體在地球，但靈魂的故鄉在星際。',
  },
  {
    emoji: '🏛️',
    title: '古文明都有類似概念',
    list: [
      '古印度脈輪系統：人體有七大脈輪，每個對應不同星體能量，頂輪對應天狼星，眉心輪對應昴宿星⋯⋯古人早就知道人體和星體相連。',
      '中國古代星宿文化：二十八宿、北斗七星、紫微星，古中國人相信天上的星宿主宰住地上的命運，天上每一粒星都對應一個人。',
      '瑪雅文明：瑪雅人擁有驚人的天文知識，瑪雅祭司的知識就是來自星際。',
      '埃及文明：金字塔的方位對應獵戶座腰帶三星，天狼星的升起標誌住尼羅河的泛濫，古埃及人將天狼星奉為神聖之星。',
    ],
    conclusion: '這麼多文明，相隔萬里，都指向同一個方向：人類和星際之間，存在住深層的連結。',
  },
  {
    emoji: '🔮',
    title: '這個測評做什麼？',
    text: '這個測評是為了幫你找出，你的靈魂最接近哪個星族。',
    text2: '完成27條問題之後，你會知道自己屬於以下七種星宿種子類型之一：',
    list: [
      '七姊妹星人（Pleiadian）， 溫柔的療癒者',
      '天狼星人（Sirian）， 古老智慧的守護者',
      '獵戶星人（Orion）， 戰士與建設者',
      '大角星人（Arcturian）， 高維度的智者',
      '仙女星人（Andromedan）， 跨維度的旅者',
      '靛藍星人（Indigo）， 改革者',
      '光明星人（LightWorker）， 光的使者',
    ],
    image: 'images/group_photo.jpg', // TODO: 需替換為實際圖片路徑
    imageCaption: ' 七大星宿種子大合照',
    conclusion: '每個類型都有不同的性格特質、天賦使命、對應星宿，還有專屬占星配對。',
  },
  {
    emoji: '',
    title: '補充說明',
    list: [
      '⚠️ 這個不是科學診斷工具，而是一套自我認識的靈性工具。',
      '😊 你可以當他是一個心理測驗來玩，信則有，不信都幾好玩。',
      '🧘 回答的時候放鬆心情，憑直覺選擇就得，不用想太多。',
      '🌌 無論結果是什麼類型，記住：每一個靈魂都是獨一無二的，你的價值不需要由任何測驗去定義。',
    ],
  },
];

// ============================================================================
// QUESTIONS — 27 題
// ============================================================================

export const QUESTIONS: StarseedQuestion[] = [
  {
    id: 1,
    text: '你有沒覺得自己的靈魂好似以前在地球生活過？',
    type: 'single',
    options: [
      { label: '強烈感覺，我好肯定我前世做過人', emoji: '🌀', scores: { pleiadian: 1, sirian: 1 } },
      { label: '有些模糊的感覺，但不肯定', emoji: '🔮', scores: { arcturian: 1, orion: 1 } },
      { label: '未試過，這一世就是第一次', emoji: '🌍', scores: { indigo: 1 } },
      { label: '不知道，我對前世沒什麼感覺', emoji: '❓', scores: { lightworker: 1, andromedan: 1 } },
    ],
  },
  {
    id: 2,
    text: '其他人通常怎樣形容你的氣場／能量？',
    type: 'single',
    options: [
      { label: '平靜、溫柔、讓人放鬆', emoji: '🕊️', scores: { pleiadian: 1 } },
      { label: '強烈、有存在感、讓人注意', emoji: '⚡', scores: { indigo: 1, orion: 1 } },
      { label: '神秘、難以捉摸', emoji: '🌙', scores: { andromedan: 1 } },
      { label: '溫暖、讓人想親近', emoji: '☀️', scores: { lightworker: 1, pleiadian: 1 } },
      { label: '古怪、和大家不一樣', emoji: '🌈', scores: { andromedan: 1, indigo: 1 } },
    ],
  },
  {
    id: 3,
    text: '你對自己的童年記不記得清楚？',
    type: 'single',
    options: [
      { label: '很清楚，連好細個的片段都記得', emoji: '🧒', scores: { pleiadian: 1, sirian: 1 } },
      { label: '記得一些重要片段，但不是全部', emoji: '📸', scores: { orion: 1 } },
      { label: '比較模糊，得幾件大事有印象', emoji: '🌫️', scores: { arcturian: 1 } },
      { label: '幾乎不記得，好似發過的夢一樣', emoji: '💭', scores: { andromedan: 1, lightworker: 1 } },
    ],
  },
  {
    id: 4,
    text: '在人多的地方你覺得怎樣？',
    type: 'single',
    options: [
      { label: '很不舒服，想快些離開', emoji: '😰', scores: { arcturian: 1, indigo: 1 } },
      { label: '可以忍受，但要經常抖下呼吸', emoji: '😮‍💨', scores: { pleiadian: 1, andromedan: 1 } },
      { label: '沒什麼感覺，人多咪人多', emoji: '😌', scores: { orion: 1 } },
      { label: '反而覺得有能量，愈多人愈興奮', emoji: '🎉', scores: { lightworker: 1, sirian: 1 } },
    ],
  },
  {
    id: 5,
    text: '你在大自然裡面的感覺是點？',
    type: 'single',
    options: [
      { label: '好似回了屋企一樣，很自在', emoji: '🌿', scores: { pleiadian: 1 } },
      { label: '感覺被療癒，身心都放鬆晒', emoji: '🍃', scores: { lightworker: 1 } },
      { label: '好靚，但沒什麼特別感覺', emoji: '🌳', scores: { arcturian: 1 } },
      { label: '會和動物和植物有無聲的交流', emoji: '🌺', scores: { pleiadian: 1 } },
    ],
  },
  {
    id: 6,
    text: '當你抬頭望住夜空的時候，你有什麼感覺？',
    type: 'single',
    options: [
      { label: '強烈的思鄉感，好似星那邊先是我的家', emoji: '✨', scores: { pleiadian: 1, andromedan: 1 } },
      { label: '深層的平靜，望住星星就安落晒', emoji: '🌌', scores: { arcturian: 1, lightworker: 1 } },
      { label: '好奇，想知宇宙裡面有什麼', emoji: '🌠', scores: { sirian: 1, orion: 1 } },
      { label: '覺得自己很渺小，有些敬畏', emoji: '🌃', scores: { indigo: 1 } },
      { label: '沒什麼特別感覺', emoji: '🌑', scores: { orion: 1 } },
    ],
  },
  {
    id: 7,
    text: '動物是咪特別喜歡黐住你？',
    type: 'single',
    options: [
      { label: '是！動物經常主動走向我，不怕我', emoji: '🐾', scores: { pleiadian: 1 } },
      { label: '有些動物會，例如貓和狗特別喜歡我', emoji: '🐱', scores: { lightworker: 1 } },
      { label: '不太覺，動物對我沒什麼特別', emoji: '😐', scores: { arcturian: 1 } },
      { label: '反而有些動物會避開我', emoji: '🦊', scores: { indigo: 1 } },
    ],
  },
  {
    id: 8,
    text: '你對眼是什麼顏色？',
    type: 'single',
    options: [
      { label: '藍色／灰色', emoji: '👁️', scores: { pleiadian: 1, andromedan: 1 } },
      { label: '綠色／啡綠色', emoji: '👁️', scores: { sirian: 1 } },
      { label: '啡色／深啡色', emoji: '👁️', scores: { orion: 1 } },
      { label: '黑色', emoji: '👁️', scores: { indigo: 1 } },
      { label: '其他（琥珀色、紫色、異色瞳等）', emoji: '👁️', scores: { andromedan: 1, lightworker: 1 } },
    ],
  },
  {
    id: 9,
    text: '你有沒覺得自己有一種強烈的使命感？',
    type: 'single',
    options: [
      { label: '有！我很清楚我來到這個世界有任務要完成', emoji: '🔥', scores: { indigo: 1, orion: 1 } },
      { label: '有些感覺，但未清楚具體是什麼', emoji: '🤔', scores: { sirian: 1 } },
      { label: '有時會想，但不是經常', emoji: '💭', scores: { pleiadian: 1, lightworker: 1 } },
      { label: '沒什麼使命感，活在當下就夠', emoji: '🧘', scores: { arcturian: 1 } },
    ],
  },
  {
    id: 10,
    text: '你覺得自己的能量可以療癒或者提升其他人嗎？',
    type: 'single',
    options: [
      { label: '是，經常有人說和我聊完計就舒服晒', emoji: '💚', scores: { pleiadian: 1, lightworker: 1 } },
      { label: '有時會，尤其是對方需要支持的時候', emoji: '🤲', scores: { sirian: 1 } },
      { label: '不太覺，我沒什麼特別的療癒能力', emoji: '😐', scores: { orion: 1, arcturian: 1 } },
      { label: '我只是想做好自己，沒想過影響人', emoji: '🙃', scores: { andromedan: 1, indigo: 1 } },
    ],
  },
  {
    id: 11,
    text: '你是咪好經常覺得自己格格不入，就算在人群裡面都是這麼？',
    type: 'single',
    options: [
      { label: '經常都是，我從來未試過真正融入過', emoji: '😔', scores: { andromedan: 1, indigo: 1 } },
      { label: '很多時候，我經常覺得自己和人們不同', emoji: '🤷', scores: { arcturian: 1 } },
      { label: '有時會，但都有融入得到的時候', emoji: '🌊', scores: { pleiadian: 1 } },
      { label: '很少，我通常和大家打成一片', emoji: '🫂', scores: { lightworker: 1, sirian: 1 } },
    ],
  },
  {
    id: 12,
    text: '你有沒經歷過很真實的夢或者清醒夢？',
    type: 'single',
    options: [
      { label: '經常有！我在夢裡面知道自己發緊夢', emoji: '🌠', scores: { andromedan: 1, arcturian: 1 } },
      { label: '有時會，夢境好清晰、很真實', emoji: '🌙', scores: { pleiadian: 1, lightworker: 1 } },
      { label: '很少，多數不記得發過什麼夢', emoji: '😴', scores: { orion: 1 } },
      { label: '未試過清醒夢，但夢境有時好有意義', emoji: '💭', scores: { sirian: 1 } },
    ],
  },
  {
    id: 13,
    text: '你有沒留意過自己身上有什麼特別的標記或者印？',
    type: 'single',
    options: [
      { label: '有！胎記、痣或者疤痕的排列好特別', emoji: '✦', scores: { andromedan: 1, pleiadian: 1 } },
      { label: '有些不尋常的標記，但不肯還是咪有意義', emoji: '✧', scores: { sirian: 1 } },
      { label: '沒什麼特別，就是正常皮膚', emoji: '🧴', scores: { orion: 1, arcturian: 1 } },
      { label: '我沒留意過這些東西', emoji: '🤷', scores: { indigo: 1, lightworker: 1 } },
    ],
  },
  {
    id: 14,
    text: '你對靈性和神秘學有什麼感覺？',
    type: 'single',
    options: [
      { label: '很強烈的連結，這些東西是我人生的一部分', emoji: '🔮', scores: { sirian: 1, pleiadian: 1 } },
      { label: '好有興趣，經常看這方面的資訊', emoji: '📚', scores: { arcturian: 1, andromedan: 1 } },
      { label: '有些好奇，但不是好投入', emoji: '🌫️', scores: { lightworker: 1 } },
      { label: '沒什麼興趣，我覺得不科學', emoji: '🤨', scores: { orion: 1, indigo: 1 } },
    ],
  },
  {
    id: 15,
    text: '你怎樣看死亡這樣東西？',
    type: 'single',
    options: [
      { label: '只是靈魂的一次轉變，不是終結', emoji: '🔄', scores: { pleiadian: 1, sirian: 1 } },
      { label: '回歸宇宙／源頭，回去真正的家', emoji: '☁️', scores: { arcturian: 1, andromedan: 1 } },
      { label: '自然的循環，生老病死好正常', emoji: '🍂', scores: { orion: 1 } },
      { label: '有些恐懼，不想想太多', emoji: '😟', scores: { indigo: 1, lightworker: 1 } },
    ],
  },
  {
    id: 16,
    text: '就算人們對你不好，你是咪依然聊向保持善良？',
    type: 'single',
    options: [
      { label: '是，我不會因為人們點對我而改變自己', emoji: '💖', scores: { pleiadian: 1, lightworker: 1 } },
      { label: '大部分時候是，但我都有底線', emoji: '🛡️', scores: { sirian: 1 } },
      { label: '人們對我不好，我自然會防備', emoji: '🧱', scores: { arcturian: 1 } },
      { label: '以牙還牙，人點對我我點對人', emoji: '⚔️', scores: { orion: 1, indigo: 1 } },
    ],
  },
  {
    id: 17,
    text: '以下哪些活動可以點燃你的創意火花？（可以選擇多個）',
    type: 'multi',
    options: [
      { label: '寫作、詩詞、日記', emoji: '✍️', scores: { pleiadian: 1, sirian: 1 } },
      { label: '畫畫、手工、設計', emoji: '🎨', scores: { andromedan: 1, pleiadian: 1 } },
      { label: '音樂、唱歌、樂器', emoji: '🎵', scores: { lightworker: 1 } },
      { label: '跳舞、身體表達', emoji: '💃', scores: { andromedan: 1 } },
      { label: '攝影、拍片', emoji: '📸', scores: { arcturian: 1 } },
      { label: '煮食、園藝', emoji: '🍳', scores: { pleiadian: 1 } },
      { label: '閱讀、研究', emoji: '📖', scores: { sirian: 1, arcturian: 1 } },
      { label: '冥想、瑜伽', emoji: '🧘', scores: { lightworker: 1 } },
    ],
  },
  {
    id: 18,
    text: '對你來說，個人成長意味住些什麼？',
    type: 'single',
    options: [
      { label: '覺醒，認識真實的自己', emoji: '🔆', scores: { andromedan: 1, lightworker: 1 } },
      { label: '學習，不斷吸收新知識', emoji: '📚', scores: { sirian: 1, arcturian: 1 } },
      { label: '突破，跳出舒適圈', emoji: '🚀', scores: { orion: 1, indigo: 1 } },
      { label: '服務，用自己的能力幫助人', emoji: '🤝', scores: { pleiadian: 1 } },
      { label: '平衡，身心靈合一', emoji: '🕊️', scores: { lightworker: 1 } },
    ],
  },
  {
    id: 19,
    text: '以下哪種方式最能夠幫你連結內心的神聖力量？',
    type: 'image',
    options: [
      { label: '冥想和靜坐', emoji: '🔮', scores: { arcturian: 1 } },
      { label: '蠟燭、香薰、儀式', emoji: '🕯️', scores: { sirian: 1 } },
      { label: '大自然漫步', emoji: '🌿', scores: { pleiadian: 1 } },
      { label: '頌缽、音樂、唱誦', emoji: '🎵', scores: { lightworker: 1 } },
      { label: '占星、塔羅、水晶', emoji: '⭐', scores: { sirian: 1 } },
      { label: '跳舞、自由律動', emoji: '💃', scores: { andromedan: 1 } },
      { label: '藝術創作', emoji: '🖌️', scores: { andromedan: 1 } },
      { label: '祈禱、感恩練習', emoji: '🙏', scores: { lightworker: 1 } },
    ],
  },
  {
    id: 20,
    text: '以下四種元素，哪個最符合你的性格？',
    type: 'element',
    options: [
      { label: '火', emoji: '🔥', desc: '熱情、行動力強、充滿活力', scores: { orion: 1, indigo: 1 } },
      { label: '水', emoji: '💧', desc: '感性、直覺強、溫柔流動', scores: { pleiadian: 1 } },
      { label: '風', emoji: '🌬️', desc: '理性、愛思考、喜歡溝通', scores: { arcturian: 1, andromedan: 1 } },
      { label: '土', emoji: '🌍', desc: '踏實、穩定、落地', scores: { sirian: 1, lightworker: 1 } },
    ],
  },
  {
    id: 21,
    text: '你通常怎樣表達自己的情緒？',
    type: 'single',
    options: [
      { label: '直接表達，不收收埋埋', emoji: '🗣️', scores: { orion: 1, indigo: 1 } },
      { label: '會寫低或者用藝術表達', emoji: '📝', scores: { andromedan: 1, pleiadian: 1 } },
      { label: '收收埋埋，等自己一個人先處理', emoji: '🧊', scores: { arcturian: 1 } },
      { label: '透過行動去表達', emoji: '🏃', scores: { orion: 1 } },
      { label: '情緒波動很大，自己都控制不到', emoji: '🌊', scores: { indigo: 1, pleiadian: 1 } },
    ],
  },
  {
    id: 22,
    text: '你在什麼時候覺得自己最有力量？',
    type: 'single',
    options: [
      { label: '獨處，和自己內在連結的時候', emoji: '🧘', scores: { arcturian: 1, andromedan: 1 } },
      { label: '幫助到其他人的時候', emoji: '🤲', scores: { pleiadian: 1, lightworker: 1 } },
      { label: '學到新東西、領悟到真理的時候', emoji: '💡', scores: { sirian: 1 } },
      { label: '在大自然裡面的時候', emoji: '🌲', scores: { pleiadian: 1 } },
      { label: '創作、表達自己的時候', emoji: '🎨', scores: { andromedan: 1 } },
    ],
  },
  {
    id: 23,
    text: '關係在你人生裡面扮演什麼角色？',
    type: 'single',
    options: [
      { label: '靈魂伴侶，追求深層的靈魂連結', emoji: '💞', scores: { pleiadian: 1, lightworker: 1 } },
      { label: '鏡子，關係是我成長的工具', emoji: '🪞', scores: { arcturian: 1, sirian: 1 } },
      { label: '陪伴，開心就一齊，不勉強', emoji: '🤗', scores: { andromedan: 1 } },
      { label: '使命，和對的人一齊做有意義的事', emoji: '👫', scores: { orion: 1, indigo: 1 } },
      { label: '可有可無，我一個人已經好完整', emoji: '🧑‍🤝‍🧑', scores: { arcturian: 1 } },
    ],
  },
  {
    id: 24,
    text: '人們經常怎樣形容你？',
    type: 'single',
    options: [
      { label: '溫柔、有愛心', emoji: '🕊️', scores: { pleiadian: 1 } },
      { label: '聰明、有智慧', emoji: '🧠', scores: { sirian: 1, arcturian: 1 } },
      { label: '強勢、有領導力', emoji: '👑', scores: { orion: 1, indigo: 1 } },
      { label: '古怪、與眾不同', emoji: '🦄', scores: { andromedan: 1 } },
      { label: '神秘、難以捉摸', emoji: '🌙', scores: { arcturian: 1 } },
      { label: '開朗、正能量滿滿', emoji: '☀️', scores: { lightworker: 1 } },
    ],
  },
  {
    id: 25,
    text: '你怎樣看自己在這個世界的角色？',
    type: 'single',
    options: [
      { label: '療癒者，用愛安慰受傷的人', emoji: '💚', scores: { pleiadian: 1 } },
      { label: '導師，用知識啟發他人', emoji: '📖', scores: { sirian: 1 } },
      { label: '戰士，用行動改變不公', emoji: '⚔️', scores: { orion: 1 } },
      { label: '智者，用智慧指引方向', emoji: '🧭', scores: { arcturian: 1 } },
      { label: '改革者，打破舊有框架', emoji: '🔨', scores: { indigo: 1, andromedan: 1 } },
      { label: '光之使者，用光亮照亮黑暗', emoji: '✨', scores: { lightworker: 1 } },
    ],
  },
  {
    id: 26,
    text: '請選擇你的出生日期',
    subtext: '日期將會用於占星配對分析',
    type: 'date',
  },
  {
    id: 27,
    text: '請上載你的手掌相片',
    subtext: '拍攝你的慣用手（寫字那隻手）的手掌，確保光線充足，手掌清晰可見。手相資訊將會結合你的星宿種子類型，提供更深入的個人解讀。',
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
    image: 'images/pleiadian.jpg', // TODO: 需替換為實際圖片路徑
    subtitle: '溫柔的療癒者，帶著星際的愛來到人間。',
    traits: [
      '富有同情心，見到人受苦自己都會心痛',
      '直覺超強，經常「感覺到」人們的情緒',
      '喜歡幫助人，做義工、助人這些東西完全不介意',
      '對大自然很敏感，在大自然裡面好似回了鄉下',
      '討厭衝突，寧願自己讓步都不想鬧交',
    ],
    full: {
      starFile: '昴宿星團（Pleiades），又名七姊妹星，位於金牛座。在中國古代星宿系統中，昴宿是西方白虎七宿之一。',
      subTitle: '溫柔的療癒者，帶著星際的愛來到人間。',
      traits: [
        '✓ 富有同情心，見到人受苦自己都會心痛',
        '✓ 直覺超強，經常「感覺到」人們的情緒',
        '✓ 喜歡幫助人，做義工、助人這些東西完全不介意',
        '✓ 對大自然很敏感，在大自然裡面好似回了鄉下',
        '✓ 討厭衝突，寧願自己讓步都不想鬧交',
      ],
      talents: [
        '💚 療癒能力，無論是情感療癒還是能量療癒，他們都有天分',
        '💚 溝通能力，善於傾聽，說說溫柔有力量',
        '💚 藝術創造力，音樂、繪樂、繪畫、寫作，他們的創作總是帶住愛',
        '💚 直覺感知，不用說出口，他們就知你在想什麼',
      ],
      mission: '用愛和溫柔去療癒這個世界，這個就是七姊妹星人最核心的使命。他們來到地球，是為了用他們的同理心去觸動人心，喚醒人類內心深處的柔軟和善良。',
      energy: [
        '🥰 和所愛的人一齊',
        '🌿 親近大自然',
        '🎶 聽音樂、創作',
        '🧘 冥想、靈性練習',
      ],
      match: {
        best: [
          { name: '光明星人', desc: '情感互補，一個療癒，一個發光，互相滋養' },
          { name: '仙女星人', desc: '同行者，一個感性，一個創意，共同創造美好' },
          { name: '天狼星人', desc: '互相支持，一個溫柔，一個智慧，彼此學習成長' },
        ],
        caution: { name: '獵戶星人', desc: '獵戶星人的直接和強勢可能會讓你感到壓力。學習設立界線，不好為了和諧而委屈自己。' },
      },
      guidance: {
        dailyPractice: '每日冥想10分鐘，想像綠色療癒之光包圍全身',
        environment: '植栽豐富、柔和色調、有自然光的空間',
        challenge: '學懂說「不」，你的溫柔不等於要委屈自己',
        chakra: '❤️ 心心輪（綠色）',
        crystal: '💎 粉晶、祖母綠、玫瑰石英',
        moonSign: '🌙 月亮在巨蟹座、天秤座、雙魚座',
      },
      message: '親愛的七姊妹星人，你是星際的母親。你的懷抱就是風雨裡面的避風港，你的溫暖足以融化最冰冷的心。世界需要你，請繼續用你的愛去擁抱每一顆需要療癒的靈魂。💖',
    },
  },
  sirian: {
    id: 'sirian',
    name: '天狼星人',
    english: 'Sirian',
    emoji: '💡',
    image: 'images/sirian.jpg', // TODO: 需替換為實際圖片路徑
    subtitle: '古老智慧的守護者，帶著遠古知識轉世到人間。',
    traits: [
      '聰明，學習能力超強，很快就掌握新知識',
      '對古文明、神說、神秘學有濃厚興趣',
      '有自然的領導力，人們會自然跟隨他',
      '喜歡分享知識，做老師、導師、教練都好適合',
      '有些挑剔，對細節好說究，追求精準',
    ],
    full: {
      starFile: '天狼星（Sirius），全天最亮的恆星，位於大犬座。古埃及人將天狼星視為神聖之星，古埃及金字塔和寺廟的設計，很多都和天狼星有關。',
      subTitle: '古老智慧的守護者，帶著遠古知識轉世到人間。',
      traits: [
        '✓ 聰明，學習能力超強，很快就掌握新知識',
        '✓ 對古文明、神說、神秘學有濃厚興趣',
        '✓ 有自然的領導力，人們會自然跟隨他',
        '✓ 喜歡分享知識，做老師、導師、教練都好適合',
        '✓ 有些挑剔，對細節好說究，追求精準',
      ],
      talents: [
        '📚 教學能力，擅長將複雜的東西簡單說解',
        '📚 組織能力，管理、規劃、統籌都難不到他',
        '📚 神秘學知識，對古埃及、亞特蘭提斯、占星、鍊金術有天分',
        '📚 鑑別能力，一眼看穿真假，不容易被誤導',
      ],
      mission: '傳承遠古智慧，引導人類醒覺。天狼星人是星際的圖書館管理員，他們記住人類最古老的知識，在適當的時候將他傳播出去。',
      energy: [
        '📖 閱讀、研究古文明',
        '🏛️ 參觀博物館、古蹟',
        '👥 教導他人、分享知識',
        '🔮 占星、塔羅等神秘學實踐',
      ],
      match: {
        best: [
          { name: '大角星人', desc: '智力共鳴，兩個智者相遇，話題永遠說不完' },
          { name: '七姊妹星人', desc: '互相支持，一個智慧，一個溫柔，彼此學習成長' },
          { name: '光明星人', desc: '合作夥伴，知識和光芒結合，影響力倍增' },
        ],
        caution: { name: '靛藍星人', desc: '靛藍星人的反叛和激進可能和你的傳統智慧產生衝突。試著互相理解，各有各的價值。' },
      },
      guidance: {
        dailyPractice: '每日花30分鐘閱讀學習，記低你的發現和領悟',
        environment: '書房、圖書館、有歷史感的空間',
        challenge: '放下「我對晒」的心態，接受別人有不同的觀點',
        chakra: '👁️ 眉心輪（靛藍色）',
        crystal: '💎 青金石、藍寶石、紫水晶',
        moonSign: '🌙 月亮在處女座、摩羯座、天蠍座',
      },
      message: '親愛的天狼星人，你是星際的導師。知識就是你的力量，智慧就是你的武器。不好怕你的見解太深奧，這個世界需要你的智慧。去分享、去教導、去點亮他人的心靈吧！💡',
    },
  },
  orion: {
    id: 'orion',
    name: '獵戶星人',
    english: 'Orion',
    emoji: '⚔️',
    image: 'images/orion.jpg', // TODO: 需替換為實際圖片路徑
    subtitle: '戰士與建設者，用力量創造新世界。',
    traits: [
      '行動力超強，想到就去做，不會拖泥帶水',
      '正義感很強，見到不公平的東西會忍不住出聲',
      '喜歡挑戰，愈難的東西愈有興趣',
      '目標導向，設定了目標就會排除萬難去達成',
      '有些固執，認定了的東西好難改變',
    ],
    full: {
      starFile: '獵戶座（Orion），其中三粒腰帶星是晚上最容易辨認的星群之一。在中國星宿系統對應參宿。古埃及金字塔的排列據說就是模仿獵戶座腰帶三星。',
      subTitle: '戰士與建設者，用力量創造新世界。',
      traits: [
        '✓ 行動力超強，想到就去做，不會拖泥帶水',
        '✓ 正義感很強，見到不公平的東西會忍不住出聲',
        '✓ 喜歡挑戰，愈難的東西愈有興趣',
        '✓ 目標導向，設定了目標就會排除萬難去達成',
        '✓ 有些固執，認定了的東西好難改變',
      ],
      talents: [
        '⚔️ 領導力，戰士領袖，可以帶領團隊衝鋒陷陣',
        '⚔️ 戰鬥精神，不怕困難，愈戰愈勇',
        '⚔️ 建設能力，不止破壞，更擅長重建新系統',
        '⚔️ 勇氣，敢做其他人不敢做的事',
      ],
      mission: '用力量保護弱小，用行動改變世界。獵戶星人是星際的戰士，他們不怕衝突，因為他們知道有時必須經過戰鬥，先可以迎來和平。',
      energy: [
        '🏋️ 運動、健身、體能挑戰',
        '🎯 達成目標的成就感',
        '🛡️ 為正義發聲、保護他人',
        '🔥 競爭、比賽、證明自己',
      ],
      match: {
        best: [
          { name: '靛藍星人', desc: '同行戰友，和樣充滿力量，並肩作戰改變世界' },
          { name: '光明星人', desc: '情感互補，戰士需要光的指引，光需要戰士的保護' },
          { name: '天狼星人', desc: '合作夥伴，戰略和戰術的完美配合' },
        ],
        caution: { name: '七姊妹星人', desc: '你的直接可能讓溫柔的他感到壓力。試著放慢腳步，用心傾聽。' },
      },
      guidance: {
        dailyPractice: '每日做運動釋放多餘能量，建立規律的訓練習慣',
        environment: '開放空間、戶外、有挑戰性的環境',
        challenge: '學習柔軟，不是所有問題都需要用力量解決',
        chakra: '🔴 海底輪（紅色）',
        crystal: '💎 紅寶石、石榴石、血石',
        moonSign: '🌙 月亮在白羊座、獅子座、人馬座',
      },
      message: '親愛的獵戶星人，你是星際的戰士。你的勇氣可以移山倒海，你的決心可以改變命運。不好收起你的力量，這個世界需要你的正義同行動。用你的火焰去照亮黑暗，用你的劍去保護需要保護的人！⚔️💪',
    },
  },
  arcturian: {
    id: 'arcturian',
    name: '大角星人',
    english: 'Arcturian',
    emoji: '🔭',
    image: 'images/arcturian.jpg', // TODO: 需替換為實際圖片路徑
    subtitle: '高維度的智者，從更高角度俯瞰人間。',
    traits: [
      '理性冷靜，遇上突發事件都不會慌',
      '善於分析，喜歡將複雜問題拆解來看',
      '對科技、宇宙、量子物理這類話題特別有興趣',
      '喜歡獨處，覺得一個人靜靜先是最好的充電方式',
      '有些抽離，有時給人覺得「不是好關世事」',
    ],
    full: {
      starFile: '大角星（Arcturus），位於牧夫座，是北半球夜晚最亮的恆星之一。在中國古代，大角星是北斗七星指引的重要標誌星。',
      subTitle: '高維度的智者，從更高角度俯瞰人間。',
      traits: [
        '✓ 理性冷靜，遇上突發事件都不會慌',
        '✓ 善於分析，喜歡將複雜問題拆解來看',
        '✓ 對科技、宇宙、量子物理這類話題特別有興趣',
        '✓ 喜歡獨處，覺得一個人靜靜先是最好的充電方式',
        '✓ 有些抽離，有時給人覺得「不是好關世事」',
      ],
      talents: [
        '🧠 直覺智慧，不是感性直覺，而是好似電腦快速運算那種直覺',
        '🧠 科技感應，對電子產品、電腦系統特別有天分',
        '🧠 療癒能力，擅長能量療癒、靈氣等高科技療癒法',
        '🧠 宇宙視野，看東西的角度總是比人高一個維度',
      ],
      mission: '用智慧引導人類進化。大角星人是星際的科學家和思想家，他們來到地球是為了幫助人類提升意識層次，用理性和智慧去解開宇宙的奧秘。',
      energy: [
        '🔬 研究、分析、解難',
        '💻 科技、編程、電子產品',
        '🧘 深度冥想、出體經驗',
        '📡 天文學、宇宙學',
      ],
      match: {
        best: [
          { name: '天狼星人', desc: '智力共鳴，兩個智者相遇，話題永遠說不完' },
          { name: '仙女星人', desc: '創意拍檔，理性和創意的火花，產生無限可能' },
          { name: '光明星人', desc: '成長拍檔，智慧需要光芒去照亮，光芒需要智慧去引導' },
        ],
        caution: { name: '獵戶星人', desc: '獵戶的行動力和你的分析速度可能不同步。學習適應不同節奏。' },
      },
      guidance: {
        dailyPractice: '每日深度冥想15分鐘，練習連結高維度意識',
        environment: '安靜、整潔、有科技感的空間，光線柔和',
        challenge: '融入人群，智慧需要和人心連結先有意義',
        chakra: '💜 頂輪（紫色/白色）',
        crystal: '💎 紫水晶、白水晶、螢石',
        moonSign: '🌙 月亮在水瓶座、雙子座、天秤座',
      },
      message: '親愛的大角星人，你是星際的智者。你的眼光超越時空，你的智慧穿越維度。不怕你太理性、太抽離，這個世界正正需要你的冷靜和遠見。用你的智慧去引導迷路的靈魂，用你的視野去照亮人類的前路！🔭🪐',
    },
  },
  andromedan: {
    id: 'andromedan',
    name: '仙女星人',
    english: 'Andromedan',
    emoji: '🚀',
    image: 'images/andromedan.jpg', // TODO: 需替換為實際圖片路徑
    subtitle: '跨維度的旅者，帶著宇宙的視野來到地球。',
    traits: [
      '創意無限，腦裡面永遠有想不完的新點子',
      '和其他人很不同，由細到大都覺得自己「怪怪的」',
      '很喜歡自由，最怕給人管、給人限制',
      '討厭傳統束縛，覺得規矩是用來打破的',
      '思想很前衛，經常想到十年後先會流行的東西',
    ],
    full: {
      starFile: '仙女座星系（Andromeda Galaxy，M31），是離銀河系最近的大星系，亦是肉眼可見最遠的天體之一。在中國古星宿中，仙女座區域對應奎宿和婁宿。',
      subTitle: '跨維度的旅者，帶著宇宙的視野來到地球。',
      traits: [
        '✓ 創意無限，腦裡面永遠有想不完的新點子',
        '✓ 和其他人很不同，由細到大都覺得自己「怪怪的」',
        '✓ 很喜歡自由，最怕給人管、給人限制',
        '✓ 討厭傳統束傳統束縛，覺得規矩是用來打破的',
        '✓ 思想很前衛，經常想到十年後先會流行的東西',
      ],
      talents: [
        '🎨 創造力，創意爆發，靈感好似瀑布這麼流',
        '🎨 遠見，可以看到未來趨勢，有預言家特質',
        '🎨 跨文化溝通，對不同文化、種族、背景的人都能自然連結',
        '🎨 獨立思考，不會被主流意見左右，有自己的判斷',
      ],
      mission: '打破框架，帶來全新視角。仙女星人是星際的探險家和改革者，他們來到地球是為了引入全新的思維方式，打破人類固有的限制性信念。',
      energy: [
        '🌈 創作、設計、任何形式的藝術',
        '✈️ 旅行、探索新地方',
        '📖 閱讀科幻、奇幻類型作品',
        '🧠 自由討論、腦力激盪',
      ],
      match: {
        best: [
          { name: '七姊妹星人', desc: '同行者，創意和感性的結合，創造出最美的藝術' },
          { name: '大角星人', desc: '創意拍檔，理性引導創意，創意啟發理性' },
          { name: '光明星人', desc: '靈魂共鳴，兩個自由的靈魂，互相理解彼此的獨特' },
        ],
        caution: { name: '獵戶星人', desc: '獵戶的規律和結構可能讓你覺得束縛。保持你的自由，但都要學習尊重秩序。' },
      },
      guidance: {
        dailyPractice: '每日花時間做自由創作，不限形式，純粹表達',
        environment: '充滿藝術品、色彩豐富、開揚的空間',
        challenge: '落地執行，創意需要付諸實行先有力量',
        chakra: '🟡 太陽神經經叢（黃色）',
        crystal: '💎 黃水晶、琥珀、金發晶',
        moonSign: '🌙 月亮在雙子座、水瓶座、人馬座',
      },
      message: '親愛的仙女星人，你是星際的探索者。你的獨特不是缺點，而是你的超能力。不好因為和人們不同而覺得自己有問題，你的存在本身就是一個全新的可能。繼續用你的方式去探索世界，你的視野會改變一切！🚀🌈',
    },
  },
  indigo: {
    id: 'indigo',
    name: '靛藍星人',
    english: 'Indigo',
    emoji: '🔥',
    image: 'images/indigo.jpg', // TODO: 需替換為實際圖片路徑
    subtitle: '改革者，帶著使命來到地球推動改變。',
    traits: [
      '天生反叛，權威對他來說是一個笑話',
      '正義感爆棚，見到不公平的事會即刻出手',
      '絕不妥協，對於自己相信的價值會站到最硬',
      '使命感很強，覺得自己這一世是為了做大事',
      '有些火爆，做事直接不轉彎，有時會得罪人',
    ],
    full: {
      starFile: '地球內維度（Intradimensional）。靛藍星人的靈魂來源不是一個特定的外星系統，而是較高維度的能量層面。他們帶住強烈的能量而來，目的是推動地球人類的意識進化。',
      subTitle: '改革者，帶著使命來到地球推動改變。',
      traits: [
        '✓ 天生反叛，權威對他來說是一個笑話',
        '✓ 正義感爆棚，見到不公平的事會即刻出手',
        '✓ 絕不妥協，對於自己相信的價值會站到最硬',
        '✓ 使命感很強，覺得自己這一世是為了做大事',
        '✓ 有些火爆，做事直接不轉彎，有時會得罪人',
      ],
      talents: [
        '🔨 系統思考，一眼看穿制度的漏洞和問題',
        '🔨 改革能力，不是得把口，真是有方法改變現狀',
        '🔨 直覺判斷，很快判斷一個人或者一件事是咪值得',
        '🔨 覺察力，對虛偽、欺騙、操控有雷達般的靈敏度',
      ],
      mission: '打破舊系統，建立新秩序。靛藍星人是星際的改革者，他們不是來地球享受生活的，而是來打爛不合理的制度，為人類創造一個更公平、更自由的世界。',
      energy: [
        '✊ 為正義發聲、參與社會運動',
        '🧠 批判思考、分析制度問題',
        '🎯 達成有影響力的目標',
        '🔥 突破框架、挑戰權威',
      ],
      match: {
        best: [
          { name: '獵戶星人', desc: '同行戰友，和樣充滿力量，並肩作戰改變世界' },
          { name: '仙女星人', desc: '改革同盟，一個打破框架，一個引入新思維' },
          { name: '光明星人', desc: '夢幻組合，改革需要光的溫暖去平衡火焰的熾熱' },
        ],
        caution: { name: '天狼星人', desc: '傳統智慧和改革理念可能產生衝突。試著尊重古老智慧，和時堅持你的革新。' },
      },
      guidance: {
        dailyPractice: '每日寫下三件讓你憤怒的事，然後轉化為行動計劃',
        environment: '簡潔、有力量感、少雜物的空間',
        challenge: '控制憤怒，憤怒是燃料，但都要學習溫和溝通',
        chakra: '🔵 喉輪（藍色）',
        crystal: '💎 青金石、藍紋瑪瑙、天河石',
        moonSign: '🌙 月亮在天蠍座、水瓶座、白羊座',
      },
      message: '親愛的靛藍星人，你是星際的改革者。你的憤怒不是問題，而是改變的燃料。你的堅持可以撼動最堅固的高牆。世界需要你的叛逆，需要你的不妥協。繼續用你的火焰去燃燒不公平，用你的力量去創造新秩序！🔥✊',
    },
  },
  lightworker: {
    id: 'lightworker',
    name: '光明星人',
    english: 'LightWorker',
    emoji: '☀️',
    image: 'images/lightworker.jpg', // TODO: 需替換為實際圖片路徑
    subtitle: '光的使者，用愛和光明照亮人間。',
    traits: [
      '天生樂觀，就算遇到難關都看到好的一面',
      '心地善良，喜歡服務他人，不計較回報',
      '感染力很強，他們在度的時候氣氛就會變好',
      '有深度的靈性智慧，雖然未必經常說',
      '包容性強，很少批評人，覺得人人都值得被愛',
    ],
    full: {
      starFile: '不限於特定星系（Universal）。光明星人的靈魂來自宇宙源頭，不局限於某一個星族系統。他們是最「跨星系」的星宿種子，就像光一樣，不需要被框框定義。',
      subTitle: '光的使者，用愛和光明照亮人間。',
      traits: [
        '✓ 天生樂觀，就算遇到難關都看到好的一面',
        '✓ 心地善良，喜歡服務他人，不計較回報',
        '✓ 感染力很強，他們在度的時候氣氛就會變好',
        '✓ 有深度的靈性智慧，雖然未必經常說',
        '✓ 包容性強，很少批評人，覺得人人都值得被愛',
      ],
      talents: [
        '💡 同理心，不止感受到，直頭是「吸收」到人們的情緒',
        '💡 傳播正能量，把口好似有魔法，說東西總是讓人舒服',
        '💡 靈性引導，不用用複雜的理論，簡單的說說就觸動人心',
        '💡 場域淨化，他們一入到來，整個空間的能量都會變好',
      ],
      mission: '用光照亮黑暗，用愛連結眾生。光明星人是星際的燈塔，他們的存在本身就是一個禮物，他們做的每一件事、說的每一句說說，都是為了讓這個世界變得更光明、更有愛。',
      energy: [
        '☀️ 陽光、戶外活動',
        '💞 與人連結、幫助他人',
        '🧘 祈禱、感恩、祝福',
        '🌍 服務他人、義工活動',
      ],
      match: {
        best: [
          { name: '七姊妹星人', desc: '情感互補，一個療癒，一個發光，互相滋養' },
          { name: '仙女星人', desc: '靈魂共鳴，兩個自由的靈魂，互相理解彼此的獨特' },
          { name: '獵戶星人', desc: '情感互補，光需要戰士的保護，戰士需要光的指引' },
        ],
        caution: { name: '靛藍星人', desc: '他們的憤怒可能讓你困惑。試著理解，憤怒都是愛的一種形式。' },
      },
      guidance: {
        dailyPractice: '每日練習感恩，寫下三件值得感恩的事',
        environment: '開揚、陽光充足、充滿生命力的空間',
        challenge: '照顧自己，燃燒自己照亮別人前，記得先為自己添油',
        chakra: '☀️ 太陽神經叢（金色/黃色）',
        crystal: '💎 黃水晶、日長石、琥珀',
        moonSign: '🌙 月亮在獅子座、雙魚座、人馬座',
      },
      message: '親愛的光明星人，你是星際的燈塔。你的光芒就是這個世界最需要的禮物。不好低估你的存在對其他人的影響，你的一個微笑、一句溫暖的說說，可能是某人黑暗裡面的唯一光線。繼續發光，繼續去愛，世界因為有你而變得更美好！☀️💖✨',
    },
  },
};

// ============================================================================
// REPORT_CONTENT — 7 個星人 × (free + premium)
// ============================================================================

export const REPORT_CONTENT: Record<StarId, ReportContent> = {
  pleiadian: {
    free: {
      starseedName: '七姊妹星人（Pleiadian）',
      summary: '你是天生的療癒者，擁有溫柔的力量去撫慰人心。',
      traits: [
        '直覺敏銳，能感知他人情緒，自然成為身邊人的依靠',
        '富有同情心，樂於付出，用愛和溫暖照亮周遭',
        '對大自然和藝術有強烈連結，能量場純淨而療癒',
      ],
      unlockReasons: [
        ' 你知不知自己的同理心天賦在哪個場景最容易變成「能量黑洞」？',
        ' 你可能沒意識到，「幫人幫到忘記自己」這個模式正慢慢消耗你，Sino-NLP 7日練習幫你重新設立能量邊界',
        ' 你和哪個星人的配搭會是最強療癒組合？哪個星人會不自覺這樣榨乾你？',
        ' 七姊妹星人的終極成長路徑：怎樣從「犧牲者」變成「智慧的療癒者」？',
      ],
    },
    premium: {
      profile: {
        galaxy: '昴宿星團（Pleiades / M45）',
        summary: '你是天生的療癒者，擁有溫柔的力量去撫慰人心。',
      },
      strengths: [
        {
          name: '深度同理心',
          detail: '你擁有超凡的情緒感知能力，能自然感受到別人的喜怒哀樂。朋友喊你聊天，不用說太多你就明他想說什麼。你的存在本身已經是一種安慰，同事失戀，你靜靜遞上一杯暖茶，他已經覺得沒這麼孤單。',
        },
        {
          name: '療癒直覺',
          detail: '你對能量場很敏感，走進一個空間能即刻感覺到「這裡不妥」。你的雙手好似有記憶，幫人按摩頭痛、用精油紓緩焦慮、甚至只是握住對方隻手，對方就會覺得整個人放鬆下來。你是朋友群中的「天然急救站」。',
        },
        {
          name: '自然連結力',
          detail: '你和大自然有很深的連結。爬山、種植物、看海、聽雨聲，這些不是嗜好，而是你的充電方式。你直覺知道哪種植物適合放在哪個角落，亦會自然這樣引導身邊人更關注環境和生命。',
        },
      ],
      growthTopics: [
        {
          weakness: '過度犧牲自己',
          detail: '你太習慣將別人需要放在自己前面。「沒所謂，你開心就得」，這句口頭禪是你，但其實你不是沒所謂，你只是不想讓對方失望。久而久之，你的能量被掏空，甚至會出現「同情疲勞」：明明很想幫人，但身體已經受不了。',
          opposite: '「一體兩面」視角：這個弱點的另一面，是你擁有無私奉獻的高貴品質。你有能力為摯愛付出一切，這份深度連結是人類最珍貴的禮物。只是需要學會：先斟滿自己杯水，先有餘力斟給人。',
          practice: '行動練習：每日設定「神聖1小時」，這個鐘完全屬於你，不好見人、不回信息、不幫任何人解決問題。用這段時間做純粹讓自己快樂的事：看書、浸浴、畫畫、發呆。守住這個習慣7日，你會發現自己的能量反彈得很快。',
        },
        {
          weakness: '太感性不夠果斷',
          detail: '做決定對你來說很痛苦，因為你見到每條路都會影響到人。你想讓所有人開心，結果到最後哪個都不滿意。工作上你是很好的同事，但你不擅長做「衰人」，叫你解僱人、拒絕人、堅持立場，你會周身不聚財。',
          opposite: '「一體兩面」視角：這個弱點的另一面，是你強大的連結力和包容心。你不是不夠果斷，你只是太重視關係。當關係建立得夠穩固，你的溫柔反而最有力的說服工具。',
          practice: '行動練習：每星期最少做一次「溫柔的拒絕」。練習說：「謝謝你想起我，不過這次我幫不到手。」記錄對方的反應，你會驚訝地發現，世界沒崩塌，關係亦沒破裂，而你獲得了前所未有的自由。',
        },
      ],
      actionPlan: {
        daily: '每日起床和睡覺前，閉眼深呼吸3次，說：「我的能量屬於我自己，我願意先照顧好自己。」',
        weekly: '每週問自己一次：「這個星期有沒哪次幫人是出於內疚而不是真心想幫？」如果答案是有，寫低那個情況，和自己說：「下次我可以選擇不幫。」',
        breakLimit: '破框練習：打破「我不幫人就會沒人喜歡我」這個限制性信念。你的價值不在於你幫了幾多人，而在於你是一個怎樣的人。',
      },
      pairing: {
        best: '仙女星人 — 七姊妹星人的溫柔療癒配仙女星人的創造力，會形成一個充滿愛和靈感的世界。仙女星人負責天馬行空，七姊妹星人負責落地關懷，互相補足。',
        challenge: '靛藍星人 — 靛藍星人的激烈反叛會讓七姊妹星人感到壓力。七姊妹星人想用溫柔改變世界，靛藍星人想用革命摧毀再重建。這個配對充滿火花，但需要互相學習對方的節奏。',
      },
      guidance: {
        chakra: '心輪（第四脈輪）',
        crystal: '粉晶（Rose Quartz）、祖母綠（Emerald）',
        zodiac: '雙魚座、巨蟹座、天秤座',
      },
    },
  },
  sirian: {
    free: {
      starseedName: '天狼星人（Sirian）',
      summary: '你是古老智慧的傳承者，知識和領導力是你的天賦。',
      traits: [
        '頭腦清晰，學習力強，任何領域一學就上手',
        '天生領袖，能組織規劃，帶領團隊走向正確方向',
        '對神秘學、哲學、古代智慧有濃厚興趣和天賦',
      ],
      unlockReasons: [
        ' 你知不知自己的知識優勢在哪種場合最易變成「離地圍牆」？',
        ' 你可能沒發現，「聰明到沒朋友」不是形容詞，而是你真正面對的困局，Sino-NLP幫你由「高處不勝寒」變成「智慧的橋樑」',
        ' 哪個星人能夠真正和你做靈魂級的深度對說？哪個星人的能量會讓你想掉頭走？',
        ' 天狼星人怎樣從「孤高智者」進化成「接地氣的導師」？答案可能讓你驚訝。',
      ],
    },
    premium: {
      profile: {
        galaxy: '天狼星（Sirius / 大犬座α星）',
        summary: '你是古老智慧的傳承者，知識和領導力是你的天賦。',
      },
      strengths: [
        {
          name: '超凡學習力',
          detail: '你讀書、工作、掌握新技能的速度比人快幾倍。同事學緊基礎操作的時候，你已經摸熟晒系統架構，甚至想到怎樣優化。你不是炫耀，你只是⋯⋯個腦轉得快。你是團隊裡面的「行走百科全書」，大家有什麼不明第一時間會來問你。',
        },
        {
          name: '卓越領導力',
          detail: '你天生知道怎樣組織人。混亂的局面你一到就自然清晰，這個人適合做什麼、那個人應該站在邊、成件事應該怎樣排優先次序。你不需要大嗌都壓得住場，因為你說東西有根據、有邏輯，人們自然信服你。',
        },
        {
          name: '神秘學天賦',
          detail: '你對一般人都覺得難明的東西，占星、塔羅、命理、哲學、古文明，有種與生俱來的理解力。你不是背書式學習，而是「一看就明」那種。你直覺知道古埃及的金字塔不只是墳墓、易經的卦象不只是占卜。這些智慧在你手上可以變成現代人都用得著的工具。',
        },
      ],
      growthTopics: [
        {
          weakness: '容易看不起慢的人',
          detail: '你的聰明讓你沒什耐性。你不明為什麼人們要用這麼耐先明，你解釋完一次對方還要問，你內心會翻白眼。你不是惡意，但你的不耐煩會讓身邊人覺得自己好蠢。久而久之，人們不敢再問你問題，你變成了孤獨的天才。',
          opposite: '「一體兩面」視角：這個弱點的另一面，是你對卓越有極高要求。你不是想看低人，你是想成件事做到最好。這份追求完美的心意，如果加上耐性和引導，你可以成為改變人一生的好老師。',
          practice: '行動練習：當你想說「這麼簡單你都不明」的時候，改成：「不緊要，我換個說法試下。」每次教人前，先深呼吸一次，提醒自己：教學不是展示自己幾叻，而是幫對方行到和你一樣的高度。',
        },
        {
          weakness: '太理性忽略情感',
          detail: '你習慣用邏輯處理一切。朋友和你說感情困擾，你第一時間幫他分析責任歸屬和解決方案。但他想聽的可能只是：「我明你不開心。」你不是冷漠，你只是覺得解決問題先最好的安慰。但在人際關係中，有時候「共情」比「解決」更重要。',
          opposite: '「一體兩面」視角：這個弱點的另一面，是你強大的分析和解決問題能力。當危機出現時，個個慌晒，只有你能保持冷靜想辦法。這個是很珍貴的力量，只需要加上情感的溫度，你就無敵。',
          practice: '行動練習：每星期最少一次，和親密的人練習「純粹聆聽」，聽到對方分享感受，你不給意見、不分析、不解決，只是回應：「我聽到了，這件事真是好難頂。」就是這麼簡單。',
        },
      ],
      actionPlan: {
        daily: '每日用5分鐘寫「感恩日記」，不是感恩成就，而是感恩一個讓你覺得溫暖的人際互動。',
        weekly: '每週反思：「這個星期我有沒一次讓到人覺得和我說東西好舒服？」如果沒，下星期嘗試主動關心一個人的心情，而不是解決他的問題。',
        breakLimit: '破框練習：打破「我夠叻就自然有人欣賞我」這個信念。能力吸引人，但溫度留住人。',
      },
      pairing: {
        best: '大角星人 — 一個是古老智慧，一個是高維科技，兩個理性靈魂可以進行最深層次的知識交流。天狼星人負責「為什麼」，大角星人負責「怎樣」，互補到極致。',
        challenge: '仙女星人 — 天狼星人的結構感和仙女星人的自由奔放完全撞到應一應。仙女星人覺得你太死板，你覺得他太混亂。但這個配對正正是學習「包容差異」的最佳功課。',
      },
      guidance: {
        chakra: '眉心輪（第三眼脈輪 / 第六脈輪）',
        crystal: '青金石（Lapis Lazuli）、紫水晶（Amethyst）',
        zodiac: '人馬座、水瓶座、處女座',
      },
    },
  },
  orion: {
    free: {
      starseedName: '獵戶星人（Orion）',
      summary: '你是天生的戰士，行動力和正義感是你的核心力量。',
      traits: [
        '行動力超強，想到就做，不會拖泥帶水',
        '正義感爆棚，見不公平一定會出聲',
        '目標明確，決定了要做的事就會堅持到底',
      ],
      unlockReasons: [
        ' 你知不知自己的行動力優勢在哪種情況下反而變成最大的阻礙？',
        ' 你可能沒發現，「非黑即白」的思維模式正讓你錯過很多珍貴的灰色地帶，Sino-NLP幫你由硬碰硬變成以柔制剛',
        ' 哪個星人可以站在你身邊成為最強戰友？哪個星人是你的「柔軟功課」？',
        ' 獵戶星人怎樣從「用力量解決一切」升級到「文武兼備的真正強者」？',
      ],
    },
    premium: {
      profile: {
        galaxy: '獵戶座（Orion）',
        summary: '你是天生的戰士，行動力和正義感是你的核心力量。',
      },
      strengths: [
        {
          name: '極強行動力',
          detail: '你是個「行動派」，不是想，是做。同事還開緊會討論可行性，你已經開始整prototype；朋友說想學新東西，你第二日已經幫他報了名。你的口頭禪是：「做了先說。」你這份行動力讓你成為團隊裡面的引擎，很多東西都是因為你「推郁」先有成果。',
        },
        {
          name: '天生正義感',
          detail: '你見不到不公平的事會全身不舒服。見到有人被欺凌你會即刻衝過去；見到制度不合理你會大聲說出來。你不是為出風頭，你是真心覺得「這件事不對就要糾正。」你是弱勢群體的天然保護者，有你在場，大家覺得安心。',
        },
        {
          name: '目標執行力',
          detail: '一旦決定了目標，你不會放棄。跑步要跑到達標、project要做到最好、關係要修復到你滿意為止。你的意志力是你最大武器，當個個都說「算啦」的時候，你還在度堅持緊。你不是死牛一面頸，你是真是信得過「堅持到底」的力量。',
        },
      ],
      growthTopics: [
        {
          weakness: '太衝動，非黑即白',
          detail: '你看世界得兩種色：對和錯、好和壞、朋友和敵人。你反應很快，但快得滯會沒想清楚就出手。以為朋友出賣你，即刻斷交；以為同事偷懶，即刻開火。結果很多時候是你看錯了，但你的衝動已經傷害了關係。你不是想傷害人，你只是太快行動。',
          opposite: '「一體兩面」視角：這個弱點的另一面，是你的真誠和勇氣。你不會陰濕收埋、不會扮東西、不會看人說東西。白色就白色，黑色就黑色，這份純粹是很珍貴的品質，只需要多加一點耐心同一點彈性。',
          practice: '行動練習：下次想即刻行動之前，和自己說：「數10聲，先再做。」由1數到10，比個腦有時間過濾衝動。數完你依然覺得要做就做，但多數情況你會發現，數完之後見到的世界多了層灰色。',
        },
        {
          weakness: '不識放鬆',
          detail: '你習慣長期處於「作戰狀態」。放鬆對你來說等於浪費時間。放假你會周身不自在，覺得自己「應該做些東西」。你的身體和精神長期緊繃，結果很容易burn out、失眠、或者身體出毛病。你不是不想休息，你是不記得了怎樣休息。',
          opposite: '「一體兩面」視角：這個弱點的另一面，是你強大的自律和責任感。你不是工作狂，你只是太認真看待自己的使命。這份認真值得respect，但要明白，最強的戰士都知幾時要收劍。',
          practice: '行動練習：每日強制安排30分鐘「零生產力時間」，不做任何有目的的事。坐在窗邊看街、聽音樂發吽哣、漫無目的散步。記住：休息不是偷懶，休息是為了打仗時更有力。',
        },
      ],
      actionPlan: {
        daily: '每日做5分鐘深呼吸練習，將注意力放在呼氣，呼氣是「放低武裝」的動作，練習放鬆。',
        weekly: '每週問自己：「這個星期有沒哪個情況，其實可以有第三個選擇？」用筆寫低你平時「非A即B」的決定，逼自己想出第三條路。',
        breakLimit: '破框練習：打破「休息等於軟弱」這個信念。真正的強者知幾時出手，亦知幾時收手。',
      },
      pairing: {
        best: '天狼星人 — 獵戶星人的行動力配合天狼星人的智慧，形成「謀定而後動」的完美組合。天狼星人幫你停一停、想一想，你幫天狼星人將計劃變為現實。',
        challenge: '仙女星人 — 獵戶星人的直線思維遇著仙女星人的跳躍思維，會覺得對方「亂噏」。但這個配對教曉你：這個世界不是得一條路行。',
      },
      guidance: {
        chakra: '太陽神經叢輪（第三脈輪）',
        crystal: '黃鐵礦（Pyrite）、紅瑪瑙（Carnelian）',
        zodiac: '白羊座、獅子座、天蠍座',
      },
    },
  },
  arcturian: {
    free: {
      starseedName: '大角星人（Arcturian）',
      summary: '你是高維度的觀察者，理性和直覺的完美結合讓人驚嘆。',
      traits: [
        '頭腦清晰冷靜，分析能力極強，看東西看得好透徹',
        '對科技、系統、抽象概念有自然的敏感度',
        '直覺準確，有時連自己都解釋不到為什麼會知道',
      ],
      unlockReasons: [
        ' 你知不知自己的理性優勢在哪個生活領域不知不覺變了「情感絕緣體」？',
        ' 你可能沒發現，「離地」不是你性格缺點，而是一種需要重新連接地氣的靈魂課題，Sino-NLP幫你由高維回歸人間',
        ' 哪個星人可以和你進行最深層次的靈魂對說？哪個星人會逼你面對最不擅長的情感交流？',
        ' 大角星人怎樣從「高高在上的觀察者」變成「落地又智慧的人生顧問」？',
      ],
    },
    premium: {
      profile: {
        galaxy: '大角星（Arcturus / 牧夫座α星）',
        summary: '你是高維度的觀察者，理性和直覺的完美結合讓人驚嘆。',
      },
      strengths: [
        {
          name: '穿透式分析力',
          detail: '你看問題不看表面，一句就點出核心。專案出了問題，個個還在度追責怪人，你已經畫了張系統圖，指出是流程設計的漏洞。你的分析力好似X光，什麼東西在你面前都無所遁形。同事說你「好串」，但他們心底是佩服你。',
        },
        {
          name: '科技自然感應',
          detail: '你對科技東西有種不用學就識的感覺。新軟件上手快過人、系統bug你可以靠直覺估到問題所在、AI提示工程你一試就知點prompt先有效。你不是geek，你是天生和科技頻率對得上。元宇宙、量子力學、高維數學對你來說是讓人興奮的遊樂場。',
        },
        {
          name: '超凡直覺',
          detail: '奇怪的是，你明明很理性，但直覺其實還勁。你經常有種「就是知道」的感覺，知道這個電說要聽、知道今日不好坐那班車、知道這個人信得過。你解釋不到，但你的直覺從來沒呃過你。這個是高維智慧在你身上的體現。',
        },
      ],
      growthTopics: [
        {
          weakness: '過度理性變冷漠',
          detail: '你習慣抽離自己，用第三者角度看一切，包括自己的人生。朋友喊緊，你想的是「眼淚含有壓力荷爾蒙，喊完會舒服些」，但你不識攬住他。你不是沒感情，你只是將情感收埋得太好，好到連自己都以為自己不需要。結果是：你看得透個世界，但世界看不透你。',
          opposite: '「一體兩面」視角：這個弱點的另一面，是你強大的客觀判斷力。在危機中你不會被情緒牽住走，是團隊裡面最可靠的「定海神針」。這種冷靜是天賦，只需要再加上溫暖的外殼。',
          practice: '行動練習：每日對一個熟人做一次「情感連線」，不是分析他的問題，而是說出你對他的感受。例如：「我見你今日好似好累，我有些擔心你。」就是這麼簡單，練習將內心的感受說出口。',
        },
        {
          weakness: '離地，和現實脫節',
          detail: '你喜歡想哲學問題、宇宙結構、未來預測。但你會忘記交水電費、約了人但遲到、現實生活安排一團糟。你不是沒能力處理現實，你只是覺得現實好「無聊」。結果是：你可以說解黑洞的形成，但搞不掂一張信用卡賬單。',
          opposite: '「一體兩面」視角：這個弱點的另一面，是你強大的宏觀視野。你能夠跳出現世的枷鎖，看到更遠的可能性。歷史上很多重大突破都是來自你這種人，只需要學會將vision和reality對齊。',
          practice: '行動練習：每星期選擇一件「最無聊的現實任務」專心做好他，例如整理櫃桶、準時交費、清空email inbox。將這個任務當成冥想，訓練自己將高維能量落地。',
        },
      ],
      actionPlan: {
        daily: '每日用5分鐘「身體掃描」冥想，將注意力由腦轉移到身體，感受腳板踩住地板的感覺，練習接地氣。',
        weekly: '每週問自己：「這個星期我有沒和任何人分享過情感而不是想法？」如果沒，找一個信任的人練習分享一個感受。',
        breakLimit: '破框練習：打破「理性先最高級的存在方式」這個信念。真正的智慧是理性和感性的平衡。',
      },
      pairing: {
        best: '天狼星人 — 兩個都是高智力型，大角星人的高維視野配合天狼星人的古老智慧，形成宇宙級的知識共振。他們可以聊三日三夜不停。',
        challenge: '七姊妹星人 — 大角星人理性到讓人覺得凍，七姊妹星人溫柔到讓人覺得甜。這個配對是理性vs感性的極致考驗，但是最治愈你冷漠的解藥。',
      },
      guidance: {
        chakra: '眉心輪（第三眼脈輪 / 第六脈輪），頂輪（第七脈輪）',
        crystal: '紫龍晶（Charoite）、月光石（Moonstone）',
        zodiac: '水瓶座、天秤座、雙子座',
      },
    },
  },
  andromedan: {
    free: {
      starseedName: '仙女星人（Andromedan）',
      summary: '你是星際的自由靈魂，創意和視野超越常規想像。',
      traits: [
        '創意無限，經常有讓人眼前一亮的新奇想法',
        '自由奔放，討厭被框架局限，追求獨特的生活方式',
        '視野廣闊，看到別人看不到的可能性和未來趨勢',
      ],
      unlockReasons: [
        ' 你知不知自己的創意天賦在哪個時候最易變成「空中樓閣」？',
        ' 你可能沒發現，「不落地」不是你的缺點，而是你的靈魂需要學會的平衡課，Sino-NLP幫你將天馬行空變成真是做到出來的現實',
        ' 哪個星人可以幫你的創意變為現實？哪個星人會說你「發夢」但其實是你最大的鏡子？',
        ' 仙女星人怎樣從「永遠的夢想家」變成「創造現實的魔法師」？',
      ],
    },
    premium: {
      profile: {
        galaxy: '仙女座星系（Andromeda Galaxy / M31）',
        summary: '你是星際的自由靈魂，創意和視野超越常規想像。',
      },
      strengths: [
        {
          name: '無限創造力',
          detail: '你個腦好似永遠不停這麼想東西，開會明明正在聊A計劃，你已經跳了去Z計劃，還要中間有晒新奇的連結。同事說你「跳掣」，但你的「跳掣」經常是團隊最有價值的idea。你是那種會將會議室變成創意實驗室的人。',
        },
        {
          name: '突破框架的視野',
          detail: '你見到一個行業，會自然想到「為什麼不可以反轉來做？」你見到一個模式，會想「如果將A領域的邏輯搬去B領域會點？」你的視野不是橫向思維，是多維度思維。你是公司裡面的「局外人視角」，因為你本來就不屬於任何框架。',
        },
        {
          name: '跨文化融合力',
          detail: '你對不同文化、不同背景的人自然有包容心。外國朋友和你聊天覺得舒服，因為你不會有偏見。你的世界觀天生就是全球化、星際化的。你學語言快、適應新環境快、和不同圈子的人都聊得埋。你是這個世界上的「公民」。',
        },
      ],
      growthTopics: [
        {
          weakness: '不落地，難堅持',
          detail: '你的問題不是沒想法，你的想法多到用不晒。問題是：你很快就對一個想法厭倦，然後跳去下一個。你開了很多project，但完成的很少。你有100個偉大計劃，但每一樣都只是做到頭三步。不是你沒能力，是你太喜歡「開始」的新鮮感，不享受「完成」的重複勞動。',
          opposite: '「一體兩面」視角：這個弱點的另一面，是你驚人的發想能力和適應力。你是天生的夢想家和開拓者，每一次「跳掣」都可能帶來新的可能性。你需要的不是壓抑創意，而是學會將一條創意線跑到終點。',
          practice: '行動練習：選擇一個你最想完成的project，用「番茄工作法」，每日只做25分鐘，但要求自己連續做30日不停。不用做多，但要保持不斷。30日後，你會有第一個「完成」的經驗。',
        },
        {
          weakness: '討厭規則到影響生活',
          detail: '你不是普通這樣不喜歡規則，你是見到規則就想打破。公司制度、社會規範、甚至朋友間約定俗成的東西，你都覺得「為什麼要跟？」這個讓你在主流社會很難適應。你會因為「不喜歡上班時間」而辭職、因為「這個form太愚蠢」而不填、因為「無聊」而skip重要的deadline。自由有代價，而你經常低估了。',
          opposite: '「一體兩面」視角：這個弱點的另一面，是你的獨立精神和革命意識。你不是反社會，你是靈魂深處追求真實的自由。每條規則背後都有他存在的原因，你的使命是分辨：哪些規則需要打破，哪些規則其實保護緊你。',
          practice: '行動練習：每日選擇一條你討厭的規則，和自己解釋「這條規則最初是為了解決什麼問題而存在的」。了解規則背後的意圖，然後決還是「智慧這麼跟從」還是「智慧這麼打破」，而不是本能地反抗。',
        },
      ],
      actionPlan: {
        daily: '每日起床做1件事：寫低今日最想完成的1個具體行動，然後在完成之前不好開始新東西。',
        weekly: '每週回顧：「這個星期我有沒完成到一樣東西由頭到尾？」如果有，獎勵自己；如果沒，選擇一個「未完成」的project設定一個完經常期。',
        breakLimit: '破框練習：打破「自由就是沒規則」這個信念。真正的自由是有能力選擇規則，而不是被規則綁架。',
      },
      pairing: {
        best: '七姊妹星人 — 仙女星人的創意被七姊妹星人的溫柔和實際性平衡到。七姊妹星人會幫你將idea變成有溫度的現實，而你會帶他飛離舒適區。',
        challenge: '獵戶星人 — 仙女星人的跳躍思維和獵戶星人的直線思維是經典的衝突。你會覺得他死板，他會覺得你亂來。但這個組合最可能創造出「破格而又可行」的成果。',
      },
      guidance: {
        chakra: '喉輪（第五脈輪）',
        crystal: '天使石（Angelite）、海藍寶（Aquamarine）',
        zodiac: '雙子座、人馬座、水瓶座',
      },
    },
  },
  indigo: {
    free: {
      starseedName: '靛藍星人（Indigo）',
      summary: '你是改革者，天生對系統問題敏感，使命感比任何人都強。',
      traits: [
        '反叛精神，不接受不合理，永遠想改變現狀',
        '正義感使命感強，對不公平有超強雷達',
        '系統思考，一眼看穿制度裡面的問題和漏洞',
      ],
      unlockReasons: [
        ' 你知不知自己的改革天賦在哪個時候最易變成「與世界為敵」的孤軍作戰？',
        ' 你可能沒發現，你的「不妥協」正讓你錯過了真正改變的機會，Sino-NLP幫你由「革命」升級到「改革」',
        ' 哪個星人可以做你改變世界的最強盟友？哪個星人是你的「憤怒鏡子」？',
        ' 靛藍星人怎樣從「燃燒自己去對抗世界」變成「智慧地改變系統」？',
      ],
    },
    premium: {
      profile: {
        galaxy: '無固定對應星系（靛藍種子屬於新一代星際靈魂）',
        summary: '你是改革者，天生對系統問題敏感，使命感比任何人都強。',
      },
      strengths: [
        {
          name: '系統洞察力',
          detail: '你走進一間公司，很快就看到權力結構裡面的問題；看一個社會議題，你一眼就見到制度漏洞。你不是表面這樣批評，你是真是看到整個系統怎樣運作、哪個環節壞了、怎樣可以修復。你的能力是「拆解系統結構」，這個是改革者最核心的天賦。',
        },
        {
          name: '強烈使命感',
          detail: '你不是為了自己而活。你覺得這個世界有很多東西需要改變，而你是其中一個要負責的人。這份使命感讓你不會隨波逐流，不會「隨便啦」，不會「關我什麼事」。你需要一個比你更大的意義去推動你。不是人人都理解你，但你不需要他們理解。',
        },
        {
          name: '革命的勇氣',
          detail: '你敢說、敢做、敢站出來。當全世界都說「算啦不好搞這麼多東西」，你會說：「為什麼？」你不怕成為異類，不怕被討厭，不怕失敗。你這份勇氣是社會進步的引擎。很多改變都是因為有你這種人先發生。',
        },
      ],
      growthTopics: [
        {
          weakness: '太偏激，與世界為敵',
          detail: '你覺得不對的事，你會站到好硬，不會退讓半步。你認為讓步是背叛、妥協是軟弱。結果你變成了「凡事反對」的人，同事有不同意見你即刻foul、上級的合理決定你都說有陰謀、甚至朋友之間的小事你都想到「是咪系統壓迫」。你不是想孤獨，你是逼走了身邊的人。',
          opposite: '「一體兩面」視角：這個弱點的另一面，是你對真理的堅持和對正義的承諾。你不是喜歡爭拗，你是無法忍受虛偽和不公平。這份堅持很珍貴，只需要加上智慧的策略和柔軟的溝通方式，你就不是「反對者」，而是「建設者」。',
          practice: '行動練習：下次你要反對之前，停一停，問自己3個問題：1）我是咪100%肯定我對？2）這件事值不值得用晒我些credibility去堅持？3）如果用另一種方式表達，會不會效果更好？如果三個答案都是「是」，先好出手。如果有一個不是，就收一收。',
        },
        {
          weakness: '容易burn out',
          detail: '你長期處於作戰狀態，覺得放鬆是奢侈。見到世界這麼多問題，你覺得自己沒資格停下來。你的憤怒和使命感是燃料，但燃料會燒盡。結果你每隔一段時間就會徹底崩潰，不是普通累，而是整個人熄機。你burn out之後會內疚，覺得自己浪費時間，然後又再燃燒自己，形成惡性循環。',
          opposite: '「一體兩面」視角：這個弱點的另一面，是你非凡的熱情和投入。你不是容易累，你是願意為信念付出一切。這種全心全意的投入是極少人擁有的品質，只需要加上可持續的節奏，你就可以燃燒一輩子而不是三個月。',
          practice: '行動練習：每日設定「熄機時間」，30分鐘完全不看新聞、不想社會問題、不討論不公平事件。用這段時間純粹照顧自己：食好東西、沖涼、聽音樂。這個不是逃避，是戰略性回氣。',
        },
      ],
      actionPlan: {
        daily: '每日起床問自己：「今日我的能量可以怎樣分配，先可以持續作戰而不burn out？」然後根據答案決定今日做幾多、停幾多。',
        weekly: '每週回顧：「這個星期我有沒一次成功用溫柔的方式去表達我的不滿？」如果有，記錄當時的做法；如果沒，計劃下星期怎樣「軟性抗爭」。',
        breakLimit: '破框練習：打破「妥協就是背叛」這個信念。真正的改革者是智慧的策略家，不是烈士。劉備可以三顧茅廬，不代表他放棄了統一天下。',
      },
      pairing: {
        best: '仙女星人 — 靛藍星人的系統思考配上仙女星人的創造力，可以創造出真正顛覆性的改革方案。仙女星人幫你跳出框架想新方法，你幫仙女星人落地執行。',
        challenge: '七姊妹星人 — 靛藍星人的激烈會嚇親溫柔的七姊妹星人，而你亦會覺得他太軟弱。但這個配對是一個重要功課：沒溫柔的改革只是另一種暴力。',
      },
      guidance: {
        chakra: '海底輪（第一脈輪）、太陽神經叢輪（第三脈輪）',
        crystal: '黑碧璽（Black Tourmaline）、孔雀石（Malachite）',
        zodiac: '天蠍座、水瓶座、摩羯座',
      },
    },
  },
  lightworker: {
    free: {
      starseedName: '光明星人（Lightworker）',
      summary: '你是光之使者，用樂觀和善良照亮身邊每一個人。',
      traits: [
        '樂觀善良，你的笑容和正能量會感染身邊每一個人',
        '感染力強，自然成為團體裡面的凝聚核心',
        '樂於服務他人，真心希望世界變得更好',
      ],
      unlockReasons: [
        ' 你知不知自己的正能量天賦在哪種情況下會變成「情感吸血鬼的提款機」？',
        ' 你可能沒發現，「照亮所有人」這個使命正讓你一步一步熄滅，Sino-NLP幫你由「犧牲式發光」升級到「可持續的光芒」',
        ' 哪個星人是你的最佳拍檔，可以和你一齊發光發亮？哪個星人會在你不為意的時候抽乾你的光？',
        ' 光明星人怎樣從「燃燒自己照亮他人」變成「自帶光芒又不會熄滅」的真正光之使者？',
      ],
    },
    premium: {
      profile: {
        galaxy: '無固定對應星系（光之種子來自多重宇宙的光源）',
        summary: '你是光之使者，用樂觀和善良照亮身邊每一個人。',
      },
      strengths: [
        {
          name: '天生感染力',
          detail: '你走進一個空間，個氣氛就會變。你不用做些什麼特別，只是在度笑一笑，身邊人就會覺得放鬆。你是聚會裡面的磁石，大家都想企近你。你的正能量不是扮出來的，是真心的。你相信世界是美好的，而你這份信念讓人覺得這個世界真是沒這麼差。',
        },
        {
          name: '無條件的善良',
          detail: '你幫人不是為了回報。見到流浪貓你會買東西給他食、同事不開心你會陪他聊到收工、朋友有困難你會二說不說瞓身幫手。你這份善良在爾虞我詐的世界裡面好似傻，但其實是最珍貴的。你是這個世界的良心。',
        },
        {
          name: '靈性引導力',
          detail: '你天生有種讓人「醒一醒」的能力。你不一還是老師，但你說的說、做的事，往往在關鍵時候點醒人。朋友覺得迷惘會來搵你，你不需要說大道理，只是分享你的角度，對方就已經搵到方向。你是一條天然的靈魂通道，光透過你流到其他人身上。',
        },
      ],
      growthTopics: [
        {
          weakness: '太理想化，忽略現實',
          detail: '你相信一切都會好起來，所以你經常忽略現實的警告信號。朋友借錢不還，你覺得「他下次會給回」結果沒；同事偷懶你幫他頂更，你覺得「他會感激」結果他變本加厲；伴侶對你不好，你覺得「他會變好」結果拖了幾年。你不是蠢，你只是太相信人性的光明面。',
          opposite: '「一體兩面」視角：這個弱點的另一面，是你非凡的信任和希望。世界裡面太多憤世嫉俗的人，而你仍然選擇相信美好。這份願意相信的勇氣，是這個世界最需要的力量。只需要加上一點現實感，你的善良就會變得有智慧。',
          practice: '行動練習：每次決定幫人之前，先問自己3個現實問題：1）這個人過去有沒珍惜過我的幫忙？2）我幫了之後，他會成長還是依賴？3）如果我不幫，最壞的結果是什麼？行完這3個問題先決定點做。',
        },
        {
          weakness: '不識保護自己，容易被人消耗',
          detail: '你對所有人都好，但不是所有人都值得你的好。你太容易信人，太好說說，太難say no。結果是：你經常被情緒勒索、被利用、被當成「好人卡」，人們需要幫忙先搵你，不需要的時候不見人影。你付出了很多，但攞回的很少。你不是沒感覺，你只是不想出聲。',
          opposite: '「一體兩面」視角：這個弱點的另一面，是你的慷慨和包容。你有能力無條件這樣付出愛和關懷，這個是很高尚的品質。你需要的不是收起你的光，而是學會過濾，將光照向值得的人，而不是照亮每一條陰暗的坑渠。',
          practice: '行動練習：設立「能量過濾器」，每星期和自己約定：1）不主動幫人解決問題，等人開口先。2）人開口之後，先問自己「這件事值不值得用我的能量？」3）如果不值得，溫柔但堅定這樣說：「對不住，這次我幫不到手。」',
        },
      ],
      actionPlan: {
        daily: '每日起床對住鏡子說：「我的光源自內心，我選擇將光照向值得的地方。我不需要照亮每一個人，我只需要忠於自己。」',
        weekly: '每週反思：「這個星期有沒哪個人是攞了我的能量而沒給回任何東西我？」如果有，下星期減少對那個人的付出。',
        breakLimit: '破框練習：打破「好人就要幫所有人」這個信念。真正的光是溫暖而不是灼傷自己。耶穌都有趕走聖殿裡面的兌換商人的時候。',
      },
      pairing: {
        best: '天狼星人 — 光明星人的溫柔善良配上天狼星人的智慧保護，形成完美的「光與盾」組合。天狼星人幫你分辨哪些人值得幫，你幫天狼星人打開心扉。',
        challenge: '靛藍星人 — 光明星人的樂觀理想和靛藍星人的激烈憤怒形成強烈反差。靛藍星人會覺得你太天真，你會覺得他太負面。但這個配對可以教曉你：真正的光不怕黑暗，反而需要黑暗先顯得珍貴。',
      },
      guidance: {
        chakra: '心輪（第四脈輪）、頂輪（第七脈輪）',
        crystal: '檸檬晶（Citrine）、白水晶（Clear Quartz）',
        zodiac: '獅子座、雙魚座、射手座',
      },
    },
  },
};

// ============================================================================
// 常量導出
// ============================================================================

export const TOTAL_STARSEED = QUESTIONS.length;

export const STAR_IDS: StarId[] = ['pleiadian', 'sirian', 'orion', 'arcturian', 'andromedan', 'indigo', 'lightworker'];

// ============================================================================
// 計分函數
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
