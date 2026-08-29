export const NAV = [
  { id: "brand", no: "01", label: "회사 소개" },
  { id: "process", no: "02", label: "발효 기술" },
  { id: "flavor", no: "03", label: "향미" },
  { id: "product", no: "04", label: "제품" },
  { id: "proof", no: "05", label: "성과" },
  { id: "contact", no: "06", label: "연락처" },
];

export const SLIDES = [
  {
    lbl: "Ferment Coffee Lab",
    t: ["향을 입히지 않고", "커피 안에서 기릅니다"],
    bold: 1,
    d: "지역 특산물과 효모로 생두 단계의 향미 구조를 재설계합니다. 과실·효모·당도·온도·시간 다섯 변수를 데이터로 관리해 같은 향미를 반복해서 만들어냅니다.",
    img: "/img/lab.webp",
    href: "#brand",
    cta: "회사 소개",
  },
  {
    lbl: "Local Edition",
    t: ["지역의 이름을 담은", "한정판 발효 커피"],
    bold: 1,
    d: "제주의 감귤커피, 논산의 딸기커피, 원주의 복숭아커피. 규격에 미달해 버려지던 지역 과실이 발효를 거쳐 그 지역의 커피가 됩니다.",
    img: "/img/package-all.webp",
    href: "#product",
    cta: "제품 보기",
  },
  {
    lbl: "Blind Test 2026",
    t: ["커피 전공자 20인 중", "13인이 선택했습니다"],
    bold: 1,
    d: "1kg당 3~6만 원대 타사 프리미엄 원두 6종과의 블라인드 테스트에서 산미·클린컵·복합미 세 부문의 우위를 확인했습니다.",
    img: "/img/brew.webp",
    href: "#proof",
    cta: "검증 결과",
  },
];

export const COMPANY = {
  name: "퍼먼트 커피랩",
  en: "Ferment Coffee Lab",
  ceo: "김종섭",
  role: "대표",
  tel: "010-4826-1290",
  telRaw: "01048261290",
  email: "topkjs07@naver.com",
  area: "강원도",
  biz: "지역 특산물 발효 기반 생두 향미 재설계 · 표준화",
};

export const FIGURES = [
  { v: 13, s: "/20", l: "블라인드 테스트에서 발효 원두를 고른 인원" },
  { v: 6, s: "단계", l: "기록·분석·정제·확정으로 표준화된 공정" },
  { v: 75, s: "%", l: "글로벌 스페셜티 시장 6년간 성장률" },
  { v: 5, s: "변수", l: "과실·효모·당도·온도·시간 제어 변수" },
];

export const PROBLEMS = [
  {
    n: "01",
    p: "이미 가공이 끝난 수입 생두에 의존해, 국내 소비자의 세분화된 취향을 반영한 독창적 향미를 만들 수 없습니다.",
    s: "생두에 국내 특산물의 천연 당분을 결합한 무산소 발효 공법을 적용해, 완전히 새로운 향미의 원두를 설계합니다.",
  },
  {
    n: "02",
    p: "맛과 향은 우수하지만 외관 규격에 미달했다는 이유로 매년 막대한 양의 농산물이 폐기되고 농가 손실이 발생합니다.",
    s: "폐기 예정인 비규격 농산물을 발효 공정의 핵심 주원료로 사용해, 농가 소득과 친환경 가치를 동시에 만듭니다.",
  },
  {
    n: "03",
    p: "기후위기와 생산량 감소로 고품질 스페셜티 커피의 수급이 불안정해지고 가격이 급등하고 있습니다.",
    s: "일반 생두에 정밀 발효 기술을 입혀 스페셜티 수준의 복합적인 향미 노트를 구현함으로써 공급 부족을 보완·대체합니다.",
  },
];

export const MARKET = [
  { y: "2018", v: 460.8, label: "460억 8천만 달러" },
  { y: "2024", v: 804.7, label: "804억 7천만 달러" },
  { y: "2032", v: 1786, label: "1,786억 달러", forecast: true },
];

export const SCOPE = [
  { k: "TAM", v: "700조", d: "글로벌 커피 시장 전체" },
  { k: "SAM", v: "2조", d: "국내 스페셜티·프리미엄 원두" },
  { k: "SOM", v: "100억", d: "강원권·전국 카페 B2B 발효 원두" },
  { k: "LAM", v: "6,000만", d: "초기 파트너사 실증·초도 공급" },
];

// fit: "contain" — 과실·패키지 컷아웃은 원본이 300px 안팎이라 꽉 채워 자르면
// 뭉개진다. 잘라내지 않고 바탕 위에 온전히 얹는다.
export const STEPS = [
  {
    n: "01",
    t: "생두 선별",
    d: "지역 고품질 생두를 향미 설계의 기초 자산으로 선별합니다. 밀도·수분율·결점두 기준을 통과한 로트만 공정에 투입합니다.",
    vars: ["밀도", "수분율", "결점두"],
    img: "/img/lab.webp",
  },
  {
    n: "02",
    t: "과실·효모 선정",
    d: "제주 감귤, 논산 딸기, 원주 복숭아 같은 지역 특산물과 목표 향미에 맞는 효모를 짝지어 발효의 방향을 결정합니다.",
    vars: ["과실 종류", "효모 균주", "배합비"],
    img: "/img/cutout/fruit-strawberry.webp",
    fit: "contain",
    tint: "var(--berry)",
  },
  {
    n: "03",
    t: "조건 디자인",
    d: "당도·온도·시간·수분율·pH를 핵심 변수로 두고, 목표 향미 프로파일을 달성하기 위한 발효 설계 시트를 작성합니다.",
    vars: ["Brix", "온도", "시간", "pH"],
    img: "/img/cutout/fruit-grape.webp",
    fit: "contain",
    tint: "var(--grape)",
  },
  {
    n: "04",
    t: "통제된 발효",
    d: "무산소 환경에서 실시간 모니터링을 거쳐 설계된 조건으로만 발효가 진행되도록 관리합니다. 이탈한 로트는 데이터로 남기고 폐기합니다.",
    vars: ["무산소", "실시간 모니터링", "로트 관리"],
    img: "/img/lab-wide.webp",
  },
  {
    n: "05",
    t: "향미 재현",
    d: "발효로 형성된 향미가 로스팅 이후에도 남도록 프로파일을 맞춥니다. 향을 겉에 입히지 않고 생두 내부에서 만들어진 향미를 살립니다.",
    vars: ["로스팅 프로파일", "관능평가"],
    img: "/img/brew.webp",
  },
  {
    n: "06",
    t: "제품 확장",
    d: "확정된 레시피를 원두·드립백·콜드브루·지역 한정판으로 전개합니다. 표준 공정이 있기에 같은 맛을 반복 생산할 수 있습니다.",
    vars: ["SOP", "배치 재현성"],
    img: "/img/crop/pkg-nonsan.webp",
    fit: "contain",
    bg: "linear-gradient(#ffedd4, #fce8e6)",
  },
];

export const FLAVORS = [
  {
    key: "strawberry",
    ko: "딸기",
    en: "Strawberry",
    tag: "Vibrant & Juicy",
    color: "var(--berry)",
    region: "논산",
    yeast: "과실계 효모",
    img: "/img/cutout/fruit-strawberry.webp",
    d: "밝고 선명한 딸기 아로마에 경쾌한 산미가 얹히고, 깨끗하고 달콤한 피니시로 마무리됩니다. 논산 딸기의 비규격 과실을 주원료로 씁니다.",
    m: [
      ["Aroma", 92],
      ["Acidity", 86],
      ["Body", 62],
      ["Finish", 78],
    ],
  },
  {
    key: "grape",
    ko: "포도",
    en: "Grape",
    tag: "Elegant & Complex",
    color: "var(--grape)",
    region: "영동",
    yeast: "와인계 효모",
    img: "/img/cutout/fruit-grape.webp",
    d: "플로럴한 포도 노트가 밝은 산미와 함께 층을 이루고, 길고 정제된 여운을 남깁니다. 복합미가 가장 두드러지는 라인입니다.",
    m: [
      ["Aroma", 88],
      ["Acidity", 74],
      ["Body", 80],
      ["Finish", 90],
    ],
  },
  {
    key: "apple",
    ko: "청사과",
    en: "Green Apple",
    tag: "Crisp & Refreshing",
    color: "var(--apple)",
    region: "홍천",
    yeast: "저온 발효 효모",
    img: "/img/cutout/fruit-apple.webp",
    d: "청사과 특유의 아삭한 아로마에 밝은 산미와 맑고 산뜻한 피니시. 콜드브루와 아이스 메뉴에서 특히 강점을 보입니다.",
    m: [
      ["Aroma", 84],
      ["Acidity", 90],
      ["Body", 56],
      ["Finish", 72],
    ],
  },
];

export const SIM_FRUITS = [
  { key: "strawberry", ko: "딸기", color: "var(--berry)", base: [86, 84, 58, 72], note: ["잘 익은 딸기", "딸기잼", "붉은 과실"] },
  { key: "grape", ko: "포도", color: "var(--grape)", base: [84, 72, 76, 84], note: ["머스캣", "와인 리덕션", "플로럴"] },
  { key: "apple", ko: "청사과", color: "var(--apple)", base: [80, 88, 52, 68], note: ["청사과", "배", "화이트 그레이프"] },
  { key: "citrus", ko: "감귤", color: "var(--citrus)", base: [88, 90, 50, 66], note: ["감귤 껍질", "오렌지 블로섬", "베르가못"] },
];

export const CHAIN = [
  { n: "01", t: "지역 농가", d: "비정형·흠집·과잉 수확분을 정기 매입" },
  { n: "02", t: "비규격 과실", d: "폐기 예정 자원을 발효 원료로 전환" },
  { n: "03", t: "발효 처리", d: "무산소 발효로 향미 구조를 형성" },
  { n: "04", t: "로스팅·포장", d: "품질 관리를 거쳐 향미를 고정" },
  { n: "05", t: "카페·소비자", d: "지역의 이야기가 담긴 한 잔으로" },
];

export const CHAIN_OUT = [
  { k: "농가", v: "폐기 자원의 수익화" },
  { k: "환경", v: "식품 폐기물 감축" },
  { k: "지역", v: "로컬 브랜드 자산 축적" },
  { k: "소비자", v: "가향 아닌 천연 향미" },
];

export const PRODUCTS = [
  { n: "01", t: "원두", d: "카페·로스터리 납품용 발효 원두. 배치마다 동일한 목표 향미를 재현합니다." },
  { n: "02", t: "드립백", d: "언제 어디서나 간편하게. 일관된 향미를 그대로 옮겨 담았습니다." },
  { n: "03", t: "콜드브루", d: "부드럽고 상쾌하게 마시기 편한 보틀 형태의 발효 커피." },
  { n: "04", t: "지역 한정판", d: "지역 테루아와 계절감을 강조한 관광·선물용 에디션." },
];

export const EDITIONS = [
  { r: "Jeju", t: "제주의 감귤커피", d: "감귤 발효 · 시트러스 아로마", img: "/img/crop/pkg-jeju.webp", bg: "linear-gradient(#fffdeb, #fffff9)" },
  { r: "Nonsan", t: "논산의 딸기커피", d: "딸기 발효 · 선명한 산미", img: "/img/crop/pkg-nonsan.webp", bg: "linear-gradient(#ffedd4, #fce8e6)" },
  { r: "Wonju", t: "원주의 복숭아커피", d: "복숭아 발효 · 부드러운 단맛", img: "/img/crop/pkg-wonju.webp", bg: "linear-gradient(#fce3cd, #f6e9e8)" },
];

export const BIZ = [
  {
    k: "Revenue 01",
    t: "B2B 원두 납품",
    d: "발효 프로세싱을 거친 스페셜티 원두를 전국 카페·베이커리에 안정적으로 공급해 고정 수익을 만듭니다.",
  },
  {
    k: "Revenue 02",
    t: "로컬 카페 토탈 케어",
    d: "구독형 서비스로 머신 세팅·추출 컨설팅, 시그니처 메뉴 개발, 마케팅 노하우까지 함께 제공합니다.",
  },
  {
    k: "Revenue 03",
    t: "B2C 직접 판매",
    d: "드립백·원두 패키지·홈카페 라인업을 온라인과 팝업 스토어로 판매해 수익원을 다각화합니다.",
  },
];

export const RADAR_AXES = ["산미", "단맛", "쓴맛", "바디감", "가격"];
export const RADAR_OTHER = [50, 44, 85, 72, 42];
export const RADAR_OURS = [95, 90, 48, 52, 66];

export const TIMELINE = [
  { q: "2025 Q1–Q2", t: "문제 인식", d: "바리스타 전공 지식 기반으로 수입 의존·자원 낭비 구조 분석", done: true },
  { q: "2025 Q4", t: "기술 자문", d: "미생물학·바리스타 전공 교수진 자문으로 실현 가능성 검증", done: true },
  { q: "2026 Q1", t: "MVP 제작", d: "캡스톤 디자인 과제로 생두 발효 초기 시제품 제작", done: true },
  { q: "2026 Q2", t: "블라인드 테스트", d: "커피 전공자 20인 중 13인이 발효 원두 선택", done: true },
  { q: "2026 Q3–Q4", t: "모두의창업 선정", d: "기자재 확충 및 엘리스토리커피 초도 생두 납품", done: true, now: true },
  { q: "2027 Q1", t: "법적 기반 확립", d: "사업자 등록·식품제조가공업 인허가·공정 표준화" },
  { q: "2027 Q2–Q3", t: "생산 확대", d: "대량생산 설비 확충, QC 시스템 도입, B2B 영업 본격화" },
  { q: "2027 Q4", t: "B2C 확장", d: "연간 실적 리뷰 및 홈카페용 패키지 상품 출시 검토" },
];

export const PHASES = [
  {
    p: "Phase 01",
    t: "기술 표준화와 발효 DB",
    l: [
      "과실·효모·당도·온도·수분율 변수를 데이터화한 SOP 완성",
      "발효 공정 레시피 특허 출원 및 브랜드 상표권 등록",
      "원두·드립백·콜드브루 대표 시제품 라인업 검증",
    ],
  },
  {
    p: "Phase 02",
    t: "지역 상생 생태계",
    l: [
      "비규격 농산물 정기 매입 체계 정례화로 원가 경쟁력 확보",
      "강원권 로컬 카페·관광지·지자체 협업 네트워크 구축",
      "발효 부산물 재활용을 포함한 친환경 공정 도입",
    ],
  },
  {
    p: "Phase 03",
    t: "향미 솔루션과 글로벌",
    l: [
      "로스터리·프랜차이즈 대상 맞춤형 발효 생두 B2B 납품",
      "축적된 레시피 DB 기반 향미 설계 솔루션 플랫폼화",
      "K-푸드 흐름에 맞춘 발효 생두·드립백 해외 수출",
    ],
  },
];
