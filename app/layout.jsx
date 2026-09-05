import "./globals.css";
import Schema from "./Schema";
import {
  SITE_URL,
  SITE_NAME,
  TITLE,
  DESC,
  KEYWORDS,
  OG_IMAGE,
  OG_IMAGE_W,
  OG_IMAGE_H,
} from "@/lib/site";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: `%s — ${SITE_NAME}`,
  },
  description: DESC,
  keywords: KEYWORDS,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "food & drink",
  alternates: {
    canonical: "/",
    languages: { "ko-KR": "/" },
  },
  formatDetection: { telephone: true, email: true, address: false },
  robots: {
    index: true,
    follow: true,
    "max-snippet": -1,
    "max-image-preview": "large",
    "max-video-preview": -1,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
    },
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: TITLE,
    description: DESC,
    images: [
      {
        url: OG_IMAGE,
        width: OG_IMAGE_W,
        height: OG_IMAGE_H,
        alt: `${SITE_NAME} 발효 실험실`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESC,
    images: [OG_IMAGE],
  },
  verification: {
    google: "b0Re8bRLomPAxLK_kvgfXX3lUafJtuijBWUQxdNVnTw",
    other: { "naver-site-verification": "15956d252675eebce05a587866e4e86681489939" },
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#ffffff" },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <head>
        {/* 첫 화면 사진을 먼저 받아 LCP를 앞당긴다 */}
        <link rel="preload" as="image" href="/img/lab.webp" fetchPriority="high" />
        <Schema />
      </head>
      <body>
        <a href="#top" className="skip">
          본문 바로가기
        </a>
        {children}
      </body>
    </html>
  );
}
