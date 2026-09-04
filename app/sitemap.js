import { SITE_URL } from "@/lib/site";
import { NAV } from "@/lib/content";

/* 원페이지 사이트라 URL은 하나다. 섹션 앵커를 함께 실어 크롤러가 문서
   구조를 알아보게 한다. */
export default function sitemap() {
  const now = new Date();
  return [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "monthly", priority: 1 },
    ...NAV.map((n) => ({
      url: `${SITE_URL}/#${n.id}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    })),
    { url: `${SITE_URL}/#faq`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
  ];
}
