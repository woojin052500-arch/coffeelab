import { SITE_URL } from "@/lib/site";

/* 생성형 검색 노출(GEO)을 위해 AI 크롤러를 명시적으로 허용한다.
   기본 규칙만 두면 일부 크롤러는 "명시 허용 없음"으로 보수적으로 동작한다. */
const AI_BOTS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-User",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "Bingbot",
  "CCBot",
  "Amazonbot",
  "Meta-ExternalAgent",
  "cohere-ai",
  "YandexBot",
  "NaverBot",
  "Yeti",
  "Daumoa",
];

export default function robots() {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      ...AI_BOTS.map((ua) => ({ userAgent: ua, allow: "/" })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
