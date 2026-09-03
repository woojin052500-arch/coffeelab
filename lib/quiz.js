/* ==========================================================================
   커피 취향 매칭 테스트 — 질문 · 채점 · 매핑
   --------------------------------------------------------------------------
   MBTI처럼 10개 문항의 A/B 응답을 4개 성향 축(산미 · 바디 · 개성 · 단맛)에
   누적하고, 동시에 산지 · 가공방식 · 품종에 표를 던진다. 축 점수는 결과
   카드의 미터로 그대로 쓰이고, 최종 판정은 축 임계값 캐스케이드가 맡는다.
   임계값은 1,024가지(2^10) 응답 조합을 전수 계산해 여섯 유형이 모두
   나오도록 맞췄다. 검증: node scripts/verify-quiz.mjs
   ========================================================================== */

/** 산지 6 */
export const ORIGINS = [
  "에티오피아",
  "파나마",
  "콜롬비아",
  "브라질",
  "케냐",
  "코스타리카",
];

/** 가공방식 4 */
export const PROCESSINGS = [
  "내추럴 (Natural)",
  "워시드 (Washed)",
  "허니 (Honey)",
  "무산소 발효 (Anaerobic)",
];

/** 품종 8 */
export const VARIETIES = [
  "게이샤 (Geisha)",
  "티피카 (Typica)",
  "버번 (Bourbon)",
  "카투라 (Caturra)",
  "켄트 (Kent)",
  "SL28 / SL34",
  "카투아이 (Catuai)",
  "자바 (Java)",
];

/** 성향 축 4 — 결과 카드의 미터 */
export const AXES = [
  { key: "acid", label: "산미", lo: "은은함", hi: "화사함", max: 7 },
  { key: "body", label: "바디감", lo: "가벼움", hi: "무거움", max: 8, min: -2 },
  { key: "sweet", label: "단맛", lo: "드라이", hi: "달콤함", max: 5 },
  { key: "unique", label: "개성", lo: "클래식", hi: "유니크", max: 5 },
];

/* --------------------------------------------------------------------------
   10문항. e = 축 가감, o/p/v = 산지 · 가공 · 품종 투표
   -------------------------------------------------------------------------- */

export const QUESTIONS = [
  {
    q: "아침에 눈을 떴을 때 가장 먼저 마시고 싶은 음료는?",
    a: [
      { t: "상큼하고 청량한 과일 에이드", e: { acid: 2 }, tag: "산미 +2" },
      { t: "고소하고 부드러운 우유나 라떼", e: { body: 2 }, tag: "바디 +2" },
    ],
  },
  {
    q: "내가 선호하는 과일 취향은?",
    a: [
      {
        t: "딸기, 블루베리처럼 달콤함이 진한 베리류",
        e: { sweet: 1 },
        p: { "내추럴 (Natural)": 2 },
        tag: "내추럴",
      },
      {
        t: "레몬, 오렌지처럼 깔끔하고 시트러스한 과일",
        e: { acid: 2 },
        p: { "워시드 (Washed)": 2 },
        tag: "워시드 · 산미 +2",
      },
    ],
  },
  {
    q: "여행을 갈 때 내가 선호하는 스타일은?",
    a: [
      {
        t: "유명하고 검증된 전통 명소 탐방",
        o: { 브라질: 1, 콜롬비아: 1 },
        tag: "클래식",
      },
      {
        t: "아무도 모르는 독특한 숨은 맛집 찾기",
        e: { unique: 2 },
        o: { 파나마: 1, 케냐: 1 },
        tag: "개성 +2",
      },
    ],
  },
  {
    q: "디저트를 선택할 때 가장 끌리는 것은?",
    a: [
      {
        t: "상큼한 레몬 타르트나 과일 파이",
        e: { acid: 1 },
        p: { "워시드 (Washed)": 1 },
        tag: "산미 +1",
      },
      {
        t: "달콤하고 부드러운 카라멜 푸딩이나 꿀케이크",
        e: { sweet: 2 },
        p: { "허니 (Honey)": 2 },
        tag: "허니 · 단맛 +2",
      },
    ],
  },
  {
    q: "와인을 마신다면 어떤 타입을 선호하나요?",
    a: [
      {
        t: "향이 화사하고 입안에서 가볍게 도는 화이트 와인",
        e: { acid: 1 },
        v: { "게이샤 (Geisha)": 1, "티피카 (Typica)": 1 },
        tag: "게이샤 · 티피카",
      },
      {
        t: "묵직한 탄닌감이 느껴지는 레드 와인",
        e: { body: 2 },
        v: { "버번 (Bourbon)": 1, "카투아이 (Catuai)": 1 },
        tag: "버번 · 카투아이",
      },
    ],
  },
  {
    q: "평소 새로운 음식이나 요리에 도전하는 편인가요?",
    a: [
      {
        t: "실패 없는 익숙하고 정갈한 맛이 좋다",
        p: { "워시드 (Washed)": 1 },
        tag: "클래식",
      },
      {
        t: "한 번도 안 먹어본 독특하고 이색적인 맛이 좋다",
        e: { unique: 2 },
        p: { "무산소 발효 (Anaerobic)": 3 },
        tag: "무산소 발효 · 개성 +2",
      },
    ],
  },
  {
    q: "초콜릿을 먹을 때 나의 취향은?",
    a: [
      {
        t: "쌉싸름하고 진한 다크 초콜릿",
        e: { body: 1 },
        o: { 브라질: 1, 케냐: 1 },
        tag: "바디 +1",
      },
      {
        t: "입안에서 사르르 녹는 부드러운 밀크 초콜릿",
        e: { sweet: 2 },
        o: { 콜롬비아: 1, 코스타리카: 1 },
        tag: "단맛 +2",
      },
    ],
  },
  {
    q: "내가 생각하는 '완벽한 쉬는 시간'의 분위기는?",
    a: [
      {
        t: "햇살 밝은 야외 테라스에서 즐기는 싱그러운 시간",
        e: { acid: 1 },
        o: { 에티오피아: 2 },
        tag: "에티오피아",
      },
      {
        t: "아늑한 조명의 조용한 카페에서 보내는 편안한 시간",
        e: { body: 1 },
        o: { 콜롬비아: 1, 브라질: 1 },
        tag: "바디 +1",
      },
    ],
  },
  {
    q: "음료를 마실 때 가장 중요하게 생각하는 입안의 느낌은?",
    a: [
      {
        t: "차(Tea)처럼 깔끔하고 가볍게 넘어가는 느낌",
        e: { body: -2 },
        v: { "티피카 (Typica)": 1, "게이샤 (Geisha)": 1 },
        tag: "바디 −2",
      },
      {
        t: "시럽이나 꿀처럼 묵직하게 입안에 감도는 느낌",
        e: { body: 2 },
        v: { "버번 (Bourbon)": 1, "카투라 (Caturra)": 1 },
        tag: "바디 +2",
      },
    ],
  },
  {
    q: "오늘 하루, 나에게 주고 싶은 특별한 선물은?",
    a: [
      {
        t: "최고급 리조트에서의 파인 다이닝",
        e: { unique: 1 },
        o: { 파나마: 2 },
        v: { "게이샤 (Geisha)": 2 },
        tag: "파나마 게이샤",
      },
      {
        t: "마음이 편안해지는 집 앞 단골집에서의 따뜻한 한 끼",
        o: { 브라질: 2 },
        v: { "카투라 (Caturra)": 1, "버번 (Bourbon)": 1 },
        tag: "브라질",
      },
    ],
  },
];

/* --------------------------------------------------------------------------
   결과 유형 6종
   -------------------------------------------------------------------------- */

export const TYPES = {
  panama: {
    id: "panama",
    code: "GSH",
    name: "화려한 탐미가",
    line: "한 잔에서 꽃밭이 열리는 커피",
    origin: "파나마",
    variety: "게이샤 (Geisha)",
    varietyAlt: "게이샤 (Geisha)",
    notes: ["Jasmine", "Bergamot", "Peach", "Bright Acidity"],
    color: "var(--rose)",
    img: "/img/cutout/fruit-grape.webp",
    fit: "contain",
    d: "화사한 아로마와 선명한 산미를 동시에 좇는 취향입니다. 익숙한 맛보다 처음 만나는 향에 반응하고, 한 잔의 경험 자체를 중요하게 여깁니다.",
    pair: "핸드드립 · 92℃ · 1:16",
    match: "포도 발효 라인 (영동 · 와인계 효모)",
    matchKey: "grape",
  },
  ethiopia: {
    id: "ethiopia",
    code: "TPC",
    name: "산뜻한 로맨티스트",
    line: "햇살 좋은 오후의 홍차 같은 커피",
    origin: "에티오피아",
    variety: "티피카 (Typica)",
    varietyAlt: "자바 (Java)",
    notes: ["Floral", "Lemon Tea", "Apricot", "Clean Cup"],
    color: "var(--citrus)",
    img: "/img/cutout/fruit-apple.webp",
    fit: "contain",
    d: "가볍고 맑게 넘어가는 질감에 은은한 꽃향과 시트러스가 얹히는 잔을 좋아합니다. 무겁게 눌러 앉는 맛보다 산뜻하게 지나가는 여운을 택합니다.",
    pair: "핸드드립 · 93℃ · 1:16.5",
    match: "청사과 발효 라인 (홍천 · 저온 발효 효모)",
    matchKey: "apple",
  },
  kenya: {
    id: "kenya",
    code: "SL2",
    name: "선명한 직진러",
    line: "첫 모금부터 또렷한 커피",
    origin: "케냐",
    variety: "SL28 / SL34",
    varietyAlt: "켄트 (Kent)",
    notes: ["Blackcurrant", "Grapefruit", "Tomato", "Juicy Body"],
    color: "var(--berry)",
    img: "/img/cutout/fruit-strawberry.webp",
    fit: "contain",
    d: "강한 산미와 단단한 바디가 함께 오는 잔을 좋아합니다. 은은한 맛보다 존재감이 확실한 맛, 흐릿한 표현보다 또렷한 캐릭터에 끌립니다.",
    pair: "핸드드립 · 91℃ · 1:15",
    match: "딸기 발효 라인 (논산 · 과실계 효모)",
    matchKey: "strawberry",
  },
  brazil: {
    id: "brazil",
    code: "CTA",
    name: "든든한 클래식",
    line: "매일 마셔도 물리지 않는 커피",
    origin: "브라질",
    variety: "카투아이 (Catuai)",
    varietyAlt: "카투아이 (Catuai)",
    notes: ["Roasted Nut", "Dark Chocolate", "Brown Sugar", "Heavy Body"],
    color: "var(--gold)",
    img: "/img/cutout/pkg-wonju.webp",
    fit: "contain",
    d: "고소하고 묵직한 맛에 안정감을 느낍니다. 유행보다 검증된 것을, 자극보다 매일 반복할 수 있는 편안함을 택하는 취향입니다.",
    pair: "에스프레소 · 라떼 · 1:2",
    match: "원두 · 드립백 (밸런스 로스팅)",
    matchKey: "strawberry",
  },
  colombia: {
    id: "colombia",
    code: "BRB",
    name: "균형의 조율가",
    line: "어느 한쪽으로도 기울지 않는 커피",
    origin: "콜롬비아",
    variety: "버번 (Bourbon)",
    varietyAlt: "버번 (Bourbon)",
    notes: ["Milk Chocolate", "Red Apple", "Caramel", "Balanced"],
    color: "var(--red)",
    img: "/img/cutout/pkg-nonsan.webp",
    fit: "contain",
    d: "산미도 단맛도 바디도 어느 한쪽으로 기울지 않는 잔을 좋아합니다. 누구에게 내어도 실패하지 않는 균형점을 본능적으로 찾아냅니다.",
    pair: "핸드드립 · 92℃ · 1:16",
    match: "원두 · 콜드브루 (밸런스 라인)",
    matchKey: "strawberry",
  },
  costarica: {
    id: "costarica",
    code: "CTR",
    name: "달콤한 안정주의자",
    line: "끝맛이 오래 달게 남는 커피",
    origin: "코스타리카",
    variety: "카투라 (Caturra)",
    varietyAlt: "카투라 (Caturra)",
    notes: ["Honey", "Orange", "Smooth", "Sweet Finish"],
    color: "var(--gold)",
    img: "/img/cutout/pkg-jeju.webp",
    fit: "contain",
    d: "부드럽게 시작해 달게 끝나는 잔을 좋아합니다. 날카로운 산미나 쓴맛보다 시럽 같은 단맛과 매끈한 목넘김이 취향의 중심입니다.",
    pair: "콜드브루 · 아이스 · 1:10",
    match: "감귤 발효 라인 (제주 · 시트러스 아로마)",
    matchKey: "apple",
  },
};

/** 가공방식이 컵노트에 더하는 한 마디 */
const PROC_NOTE = {
  "내추럴 (Natural)": "Ripe Berry",
  "워시드 (Washed)": "Clean Finish",
  "허니 (Honey)": "Honey Sweetness",
  "무산소 발효 (Anaerobic)": "Wine-like Complexity",
};

/** 가공방식 한 줄 설명 */
export const PROC_DESC = {
  "내추럴 (Natural)":
    "과육을 그대로 둔 채 건조해 과실의 단맛과 무게가 잔에 그대로 남습니다.",
  "워시드 (Washed)":
    "점액질을 물로 씻어내 산미와 클린컵이 또렷하게 드러나는 방식입니다.",
  "허니 (Honey)":
    "점액질을 일부만 남겨 건조해 시럽 같은 단맛과 부드러운 질감을 만듭니다.",
  "무산소 발효 (Anaerobic)":
    "산소를 차단한 탱크에서 발효해 일반 가공으로는 나오지 않는 향미를 만듭니다. 퍼먼트 커피랩의 핵심 공정입니다.",
};

/* --------------------------------------------------------------------------
   채점
   -------------------------------------------------------------------------- */

const add = (bag, obj, w = 1) => {
  if (!obj) return;
  for (const k in obj) bag[k] = (bag[k] || 0) + obj[k] * w;
};

const top = (bag, fallback) => {
  let best = fallback;
  let bv = -Infinity;
  for (const k in bag) {
    if (bag[k] > bv) {
      bv = bag[k];
      best = k;
    }
  }
  return best;
};

/**
 * @param {(0|1)[]} answers 10문항의 선택 인덱스
 * @returns 결과 카드에 필요한 모든 값
 */
export function calculateCoffeeMatch(answers) {
  const score = { acid: 0, body: 0, unique: 0, sweet: 0 };
  const oVote = {};
  const pVote = {};
  const vVote = {};

  answers.forEach((pick, i) => {
    const a = QUESTIONS[i]?.a[pick];
    if (!a) return;
    add(score, a.e);
    add(oVote, a.o);
    add(pVote, a.p);
    add(vVote, a.v);
  });

  /* 1. 가공방식 — 개성이 높으면 무조건 무산소 발효, 그다음은 투표 우세 */
  let processing;
  if (score.unique >= 4) processing = "무산소 발효 (Anaerobic)";
  else if (score.sweet >= 3) processing = "허니 (Honey)";
  else if (score.acid >= 3) processing = "워시드 (Washed)";
  else processing = "내추럴 (Natural)";
  // 투표가 압도적이면(2표 이상 차이) 투표를 따른다
  const pTop = top(pVote, processing);
  if ((pVote[pTop] || 0) - (pVote[processing] || 0) >= 2) processing = pTop;

  /* 2. 산지 · 품종 — 축 캐스케이드 */
  let key;
  if (score.acid >= 5 && score.unique >= 3) key = "panama";
  else if (score.acid >= 4 && score.body <= 1) key = "ethiopia";
  else if (score.acid >= 4 && score.body >= 4) key = "kenya";
  else if (score.body >= 5) key = "brazil";
  else if (score.sweet >= 3 && score.body >= 3) key = "colombia";
  else if (score.sweet >= 3) key = "costarica";
  else if (score.acid >= 4) key = "kenya";
  else if (score.acid >= 3 && score.body <= 2) key = "ethiopia";
  else if (score.body >= 3) key = "brazil";
  else key = "colombia";

  const type = TYPES[key];
  const variety = score.unique >= 2 ? type.varietyAlt : type.variety;

  const notes = [...type.notes.slice(0, 3), PROC_NOTE[processing]];

  return {
    key,
    type,
    score,
    origin: type.origin,
    variety,
    processing,
    notes,
    votes: { origin: oVote, processing: pVote, variety: vVote },
    // 미터용 0~100 정규화
    meters: AXES.map((ax) => {
      const min = ax.min ?? 0;
      const v = Math.round(((score[ax.key] - min) / (ax.max - min)) * 100);
      return { ...ax, v: Math.max(4, Math.min(100, v)) };
    }),
  };
}

/** 공유 문구 */
export function shareText(r) {
  return `내 커피 취향은 「${r.type.name}」 · ${r.origin} ${r.variety} / ${r.processing} — 퍼먼트 커피랩 커피 취향 테스트`;
}
