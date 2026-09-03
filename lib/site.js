/* 사이트 전역 상수 — 배포 도메인이 정해지면 SITE_URL 한 줄만 바꾸면
   메타데이터 · 사이트맵 · 구조화 데이터 · llms.txt 가 모두 따라간다.
   Vercel에 올리면 NEXT_PUBLIC_SITE_URL 환경변수로 덮어쓸 수 있다. */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://fermentcoffeelab.kr"
).replace(/\/$/, "");

export const SITE_NAME = "퍼먼트 커피랩";
export const SITE_NAME_EN = "Ferment Coffee Lab";

export const TITLE = "퍼먼트 커피랩 — 생두에서 설계하는 향미";

export const DESC =
  "지역 특산물과 효모로 생두 단계에서 커피 향미를 재설계하고 표준화하는 기술 브랜드. 무산소 발효 공정, 지역 한정판 발효 원두, 1분 커피 취향 매칭 테스트.";

/* 대표 이미지 — 실제 사진을 쓴다. 1200x630 전용 컷을 따로 만들면
   OG_IMAGE 경로만 바꾸면 된다. */
export const OG_IMAGE = "/img/lab-wide.webp";
export const OG_IMAGE_W = 1600;
export const OG_IMAGE_H = 900;

export const KEYWORDS = [
  "퍼먼트 커피랩",
  "Ferment Coffee Lab",
  "생두 발효",
  "무산소 발효 커피",
  "아나에어로빅 커피",
  "스페셜티 커피",
  "발효 원두",
  "지역 특산물 커피",
  "커피 취향 테스트",
  "커피 MBTI",
  "감귤커피",
  "딸기커피",
  "B2B 원두 납품",
  "업사이클링 커피",
];
