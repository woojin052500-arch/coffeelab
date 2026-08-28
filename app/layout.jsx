import "./globals.css";

export const metadata = {
  title: "퍼먼트 커피랩 — 생두에서 설계하는 향미",
  description:
    "지역 특산물 발효를 기반으로 생두 단계에서 커피 향미를 재설계하고 표준화하는 기술 브랜드, 퍼먼트 커피랩(Ferment Coffee Lab).",
  keywords: [
    "퍼먼트 커피랩",
    "생두 발효",
    "스페셜티 커피",
    "무산소 발효",
    "지역 특산물",
    "업사이클링",
  ],
  openGraph: {
    title: "퍼먼트 커피랩 — 생두에서 설계하는 향미",
    description:
      "지역 특산물과 효모로 생두 단계의 향미 구조를 재설계합니다. 표준화된 공정으로 같은 향미를 반복 생산합니다.",
    type: "website",
    locale: "ko_KR",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#faf7f1",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
