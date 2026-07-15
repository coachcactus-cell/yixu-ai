/**
 * 易學辭典 — 數據層
 *
 * 結構：每條詞條統一格式
 * - id: 唯一標識
 * - term: 詞條名稱
 * - pinyin: 拼音
 * - category: 分類（基礎概念/六十四卦/爻辭術語/占筮術語）
 * - oneLiner: 一句話明白（10歲都睇得明）
 * - plainText: 白話解釋（生活化）
 * - classicText: 經典原文（可摺疊）
 * - source: 原文出處
 * - lifeExample: 生活例子
 * - related: 關聯詞條 id 列表
 */

export interface DictionaryEntry {
  id: string;
  term: string;
  pinyin: string;
  category: "基礎概念" | "六十四卦" | "爻辭術語" | "占筮術語";
  oneLiner: string;
  plainText: string;
  classicText?: string;
  source?: string;
  lifeExample?: string;
  related?: string[];
}

export const YIJING_DICTIONARY: DictionaryEntry[] = [
  // ─── 基礎概念 ───

  {
    id: "wuji",
    term: "無極",
    pinyin: "wú jí",
    category: "基礎概念",
    oneLiner: "宇宙最初的狀態，什麼都還沒分開之前的那個「·」。",
    plainText:
      "無極是太極之前的状态。什麼都沒有，連「有」和「無」都未分。不是空，而是一切可能性還未展開的原始狀態。打個比方，就像一粒種子，它還沒發芽的時候，你看不到根和葉，但根和葉的可能性都在裡面。無極就是那粒種子還未萌芽的最原始狀態。周敦頤說「無極而太極」，意思是無極靜到極點，自然就會生出太極。",
    classicText:
      "周敦頤《太極圖說》：「無極而太極。」",
    source: "周敦頤《太極圖說》",
    lifeExample:
      "你早上剛醒來、還沒開始想今天要做什麼的那一瞬間，腦子裡什麼都沒想但什麼都可能。那就是你一天的「無極」。",
    related: ["taiji", "yinyang", "liangyi"],
  },

  {
    id: "taiji",
    term: "太極",
    pinyin: "tài jí",
    category: "基礎概念",
    oneLiner: "宇宙最初的狀態，無極靜極初動時，動與未動之間的狀態，又叫「一」。",
    plainText:
      "無極靜到極點，開始有一絲動的念頭，這個「將動未動」的瞬間就是太極。它不是無極的空白，也不是兩儀的已分，而是「一」。一切從這個「一」開始。太極動起來就生出陽，靜下來就生出陰。太極不是某個具體的東西，而是「一切從這裡開始」的狀態。打個比方，種子開始萌芽的那一瞬間，根和葉還沒長出來，但生長的動力已經啟動了，那就是太極。",
    classicText:
      "《易傳·繫辭上》：「易有太極，是生兩儀，兩儀生四象，四象生八卦。」",
    source: "《易傳·繫辭上傳》",
    lifeExample:
      "你決定起身但身體還未郁的那一瞬間。意念已到，動作未出，那就是你行動的「太極」。",
    related: ["wuji", "liangyi", "siyang", "bagua", "yinyang"],
  },

  {
    id: "liangyi",
    term: "兩儀",
    pinyin: "liǎng yí",
    category: "基礎概念",
    oneLiner: "太極分出來的陰和陽，一動一靜，一剛一柔。",
    plainText:
      "太極動起來，就產生了陽；靜下來，就產生了陰。這一動一靜就是「兩儀」。陽代表主動、剛健、明亮、向外；陰代表承受、柔順、暗藏、向內。兩儀不是對立的敵人，而是一對搭檔。沒有陽就沒有動力，沒有陰就沒有承載。白天和黑夜、呼和吸、說話和聆聽，都是兩儀的體現。",
    classicText:
      "《易傳·繫辭上》：「是生兩儀。」朱熹註：「兩儀者，始為一畫以分陰陽。」",
    source: "《易傳·繫辭上傳》",
    lifeExample:
      "你同人傾偈，你講（陽）對方聽（陰），然後對方講（陽）你聽（陰）。一來一回，就是兩儀在運轉。如果淨係你講或淨係對方講，這個對話就死了。",
    related: ["taiji", "wuji", "yinyang", "siyang", "bagua"],
  },

  {
    id: "siyang",
    term: "四象",
    pinyin: "sì xiàng",
    category: "基礎概念",
    oneLiner: "陰陽再各自分一次，變出四種組合：太陽、少陰、少陽、太陰。",
    plainText:
      "兩儀（陰陽）各自再分一次，就產生了四象。陽上加陽 = 太陽（最熱最亮）；陽上加陰 = 少陰（剛開始轉涼）；陰上加陽 = 少陽（剛開始轉暖）；陰上加陰 = 太陰（最冷最暗）。四象對應四季（春夏秋冬）、四方（東南西北）、人生四階段（少壯老衰）。它告訴我們：事物不是只有「有」和「無」兩種狀態，而是有程度之分、過渡之態。",
    classicText:
      "《易傳·繫辭上》：「兩儀生四象。」",
    source: "《易傳·繫辭上傳》",
    lifeExample:
      "一日之中：早晨 = 少陽（剛暖），中午 = 太陽（最熱），傍晚 = 少陰（剛涼），半夜 = 太陰（最冷）。你身體的能量也跟著這個節奏走。",
    related: ["taiji", "wuji", "liangyi", "bagua", "yinyang"],
  },

  {
    id: "yinyang",
    term: "陰陽",
    pinyin: "yīn yáng",
    category: "基礎概念",
    oneLiner: "宇宙的兩股基本力量：陽是推動的力，陰是承載的體。",
    plainText:
      "陰陽是易經最核心的概念。陽不是「好」，陰不是「壞」，它們是一體兩面。陽主動、向外、剛健、溫熱、明亮；陰主靜、向內、柔順、寒涼、暗藏。兩者互相依存：沒有陰的承載，陽就無處施力；沒有陽的推動，陰就是死水一潭。易經的智慧在於：知道什麼時候該陽（進取），什麼時候該陰（退守），兩者配合得好，就通達。",
    classicText:
      "《易傳·繫辭上》：「一陰一陽之謂道。」",
    source: "《易傳·繫辭上傳》",
    lifeExample:
      "工作時你主動出擊（陽），回家後你安靜休息（陰）。如果一個人永遠在衝（陽過大），會燒盡；永遠在躺（陰過大），會腐。陰陽交替，才是活的。注意「純陽純陰」的「純」是指無極狀態，不能亂用。",
    related: ["taiji", "wuji", "liangyi", "siyang", "bagua"],
  },

  {
    id: "bagua",
    term: "八卦",
    pinyin: "bā guà",
    category: "基礎概念",
    oneLiner: "四象再分一次，變出八個基本符號，代表宇宙的八種力量。",
    plainText:
      "八卦是易經的基本「字母」。每個卦由三條線（爻）組成，陽爻是一條實線「—」，陰爻是中間斷開的「--」。三條線排列組合，形成八種可能：乾（天）、坤（地）、震（雷）、巽（風）、坎（水）、離（火）、艮（山）、兌（澤）。這八種力量不是死物，而是八種「運動方式」。天在轉、地在承、雷在震、風在吹、水在流、火在燃、山在止、澤在悅。六十四卦就是這八個基本卦兩兩疊合的結果。",
    classicText:
      "《易傳·說卦傳》：「乾為天，坤為地，震為雷，巽為風，坎為水，離為火，艮為山，兌為澤。」",
    source: "《易傳·說卦傳》",
    lifeExample:
      "一間屋有八個方位，每個方位對應一種卦的能量。你坐北朝南（離卦向陽），自然光線好、心情舒暢。風水不是迷信，是古人對環境能量的觀察。",
    related: ["taiji", "wuji", "liangyi", "siyang", "yinyang", "qian_gua", "kun_gua"],
  },

  {
    id: "guaci",
    term: "卦辭",
    pinyin: "guà cí",
    category: "基礎概念",
    oneLiner: "每個卦下面的一段話，講這個卦的整體吉凶和含義。",
    plainText:
      "卦辭是對整個卦的總判斷。六十四卦，每卦都有一段卦辭，通常幾個字到幾十個字。比如乾卦的卦辭是「元亨利貞」四個字，卻概括了乾卦的全部精神。卦辭像是一篇文章的標題和大綱，告訴你這個卦在說什麼、吉凶如何、應該怎麼做。讀易經，先看卦辭定大方向，再看爻辭看細節。",
    classicText:
      "例如乾卦卦辭：「乾：元亨利貞。」坤卦卦辭：「坤：元亨，利牝馬之貞。」",
    source: "《周易》六十四卦",
    lifeExample:
      "卦辭就像你打開一份體檢報告首頁的總結：「總體健康，注意血壓。」詳細的各項指標在後面（爻辭），但總結已經給了你大方向。",
    related: ["yaoci", "tuanzhuan", "xiangzhuan", "yuan_heng_li_zhen"],
  },

  {
    id: "yaoci",
    term: "爻辭",
    pinyin: "yáo cí",
    category: "基礎概念",
    oneLiner: "卦裡面每一條線（爻）的解釋，講具體情境下該怎麼做。",
    plainText:
      "一個卦有六條爻，從下到上編號：初、二、三、四、五、上。每條爻都有自己的爻辭，講在這個位置、這個時機應該怎麼做。卦辭是「大方向」，爻辭是「具體情境」。同一個卦，初爻和上爻的處境可以完全相反。比如乾卦初爻「潛龍勿用」（還不到時候，先別動），五爻「飛龍在天」（時機到了，全力發揮）。爻辭的智慧在於：位置不同，做法就不同。",
    classicText:
      "例如乾卦初九爻辭：「潛龍勿用。」九五爻辭：「飛龍在天，利見大人。」",
    source: "《周易》六十四卦",
    lifeExample:
      "你剛入職新公司（初爻），就算有能力都應該先觀察、低調（潛龍勿用）。等你站穩了、得到信任（五爻），先至可以大展拳腳（飛龍在天）。同樣是你，位置不同，策略就不同。",
    related: ["guaci", "tuanzhuan", "xiangzhuan", "qian_long_wu_yong", "fei_long_zai_tian"],
  },

  {
    id: "xiangzhuan",
    term: "象傳",
    pinyin: "xiàng zhuàn",
    category: "基礎概念",
    oneLiner: "解釋卦象和爻象的註解，分「大象」和「小象」。",
    plainText:
      "象傳是《易傳》（十翼）的一部分，專門解釋卦象。大象傳解釋整個卦的象徵意義，通常從自然現象出發，再引申到人事。比如乾卦大象：「天行健，君子以自強不息」。看到天在不斷運轉，君子就應該效法天道，自強不息。小象傳解釋每一條爻的象徵。象傳的特色是「取象」，從具體的自然圖像中提煉出做人做事的道理。",
    classicText:
      "乾卦大象：「天行健，君子以自強不息。」坤卦大象：「地勢坤，君子以厚德載物。」",
    source: "《易傳·象傳》",
    lifeExample:
      "你看到瀑布的水不斷往下流、匯聚成河，這就是「水往低處流」的象。象傳會說：君子效法水的精神，謙卑處下，反而能匯聚人心。這就是「取象」，從自然現象學做人。",
    related: ["guaci", "yaoci", "tuanzhuan", "wenyanzhuan"],
  },

  {
    id: "tuanzhuan",
    term: "彖傳",
    pinyin: "tuàn zhuàn",
    category: "基礎概念",
    oneLiner: "解釋卦辭的註解，講這個卦為什麼是這個意思。",
    plainText:
      "彖傳是《易傳》（十翼）的一部分，專門解釋卦辭。如果卦辭是「結論」，彖傳就是「推理過程」。它會分析這個卦的陰陽結構、上下卦的關係，解釋為什麼卦辭會這樣說。比如屯卦彖傳解釋為什麼屯卦「元亨利貞，勿用有攸往」，因為剛開始（初九陽爻在下面）有潛力但時機未到。彖傳偏哲學分析，比象傳更抽象。",
    classicText:
      "《易傳·彖傳》上下兩篇，各解釋三十二卦的卦辭。",
    source: "《易傳·彖傳》",
    lifeExample:
      "卦辭話你知「這件事可以做」，彖傳話你知「為什麼可以做」。就像醫生不只同你講「食呢隻藥」，仲同你解釋「因為你嘅情況係⋯⋯所以呢隻藥啱你」。",
    related: ["guaci", "yaoci", "xiangzhuan", "wenyanzhuan"],
  },

  {
    id: "yuan_heng_li_zhen",
    term: "元亨利貞",
    pinyin: "yuán hēng lì zhēn",
    category: "基礎概念",
    oneLiner: "乾卦卦辭四個字：開始、通達、適宜、正固。",
    plainText:
      "「元亨利貞」是乾卦的卦辭，也是易經最核心的四個字。元 = 開始、根源；亨 = 通達、順暢；利 = 適宜、有利；貞 = 正固、堅持。四個字連起來的意思是：從根源出發（元），道路通達（亨），做適宜的事（利），守住正道不偏離（貞）。古人把這四個字對應四季（春夏秋冬）、四德（仁義禮智）。簡單講，這是易經對「正確做事」的完整公式：找對起點，順勢而為，做對的事，堅持到底。",
    classicText:
      "《周易·乾卦》：「乾：元亨利貞。」《易傳·文言傳》：「元者，善之長也；亨者，嘉之會也；利者，義之和也；貞者，事之幹也。」",
    source: "《周易·乾卦》、《易傳·文言傳》",
    lifeExample:
      "你想創業：元 = 搵到你嘅初心同核心能力；亨 = 搵到順暢嘅路徑；利 = 做對市場有利嘅事；貞 = 困難時守住底線唔走歪。四步做齊，事就成了。",
    related: ["guaci", "qian_gua", "wenyanzhuan"],
  },
];

// ── 工具函數 ──

/** 按分類獲取詞條 */
export function getEntriesByCategory(category: DictionaryEntry["category"]): DictionaryEntry[] {
  return YIJING_DICTIONARY.filter((e) => e.category === category);
}

/** 搜尋詞條（按詞名、拼音、一句話） */
export function searchEntries(query: string): DictionaryEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) return YIJING_DICTIONARY;
  return YIJING_DICTIONARY.filter(
    (e) =>
      e.term.includes(query) ||
      e.pinyin.toLowerCase().includes(q) ||
      e.oneLiner.includes(query) ||
      e.plainText.includes(query)
  );
}

/** 按 id 獲取詞條 */
export function getEntryById(id: string): DictionaryEntry | undefined {
  return YIJING_DICTIONARY.find((e) => e.id === id);
}

/** 獲取所有分類 */
export const CATEGORIES: DictionaryEntry["category"][] = [
  "基礎概念",
  "六十四卦",
  "爻辭術語",
  "占筮術語",
];
