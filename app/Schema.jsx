import { SITE_URL, SITE_NAME, SITE_NAME_EN, TITLE, DESC, OG_IMAGE } from "@/lib/site";
import { COMPANY, FAQ, PRODUCTS, EDITIONS, STEPS, FLAVORS } from "@/lib/content";
import { ORIGINS, PROCESSINGS, VARIETIES } from "@/lib/quiz";

/* ==========================================================================
   구조화 데이터 (JSON-LD)
   --------------------------------------------------------------------------
   검색엔진용 리치 결과와 생성형 검색(GEO)의 인용 근거를 함께 노린다.
   @graph 하나에 Organization · WebSite · WebPage · FAQPage · HowTo ·
   ItemList(제품) · Quiz 를 담고 @id 로 서로 연결한다.
   ========================================================================== */

const u = (p) => `${SITE_URL}${p}`;

export default function Schema() {
  const org = {
    "@type": ["Organization", "Brand"],
    "@id": u("/#org"),
    name: SITE_NAME,
    alternateName: SITE_NAME_EN,
    url: SITE_URL,
    logo: u("/icon.svg"),
    image: u(OG_IMAGE),
    description:
      "지역 특산물과 효모를 이용해 생두 단계에서 커피 향미를 재설계하고 표준 공정으로 고정하는 기술 브랜드입니다. 무산소 발효를 핵심 공정으로 사용합니다.",
    slogan: "향을 입히지 않고, 커피 안에서 기릅니다",
    email: COMPANY.email,
    telephone: `+82-10-4826-1290`,
    founder: { "@type": "Person", name: COMPANY.ceo, jobTitle: COMPANY.role },
    address: {
      "@type": "PostalAddress",
      addressCountry: "KR",
      addressRegion: COMPANY.area,
    },
    areaServed: { "@type": "Country", name: "대한민국" },
    knowsAbout: [
      "생두 발효",
      "무산소 발효 (Anaerobic Fermentation)",
      "스페셜티 커피",
      "향미 프로파일 설계",
      "비규격 농산물 업사이클링",
      ...ORIGINS,
      ...PROCESSINGS,
      ...VARIETIES,
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      telephone: "+82-10-4826-1290",
      email: COMPANY.email,
      availableLanguage: ["ko", "en"],
    },
  };

  const site = {
    "@type": "WebSite",
    "@id": u("/#website"),
    url: SITE_URL,
    name: TITLE,
    description: DESC,
    inLanguage: "ko-KR",
    publisher: { "@id": u("/#org") },
  };

  const page = {
    "@type": "WebPage",
    "@id": u("/#webpage"),
    url: SITE_URL,
    name: TITLE,
    description: DESC,
    isPartOf: { "@id": u("/#website") },
    about: { "@id": u("/#org") },
    primaryImageOfPage: u(OG_IMAGE),
    inLanguage: "ko-KR",
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "홈", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "커피 취향 테스트", item: u("/#taste") },
        { "@type": "ListItem", position: 3, name: "자주 묻는 질문", item: u("/#faq") },
      ],
    },
  };

  const faq = {
    "@type": "FAQPage",
    "@id": u("/#faq-schema"),
    mainEntity: FAQ.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const howto = {
    "@type": "HowTo",
    "@id": u("/#process"),
    name: "퍼먼트 커피랩 생두 발효 6단계 공정",
    description:
      "지역 특산물과 효모로 생두 단계의 향미를 설계하고 배치마다 같은 맛으로 재현하기 위한 표준 공정입니다.",
    totalTime: "P7D",
    step: STEPS.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.t,
      text: s.d,
      image: u(s.img),
    })),
  };

  const products = {
    "@type": "ItemList",
    "@id": u("/#products"),
    name: "퍼먼트 커피랩 제품",
    itemListElement: [
      ...PRODUCTS.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "Product",
          name: `퍼먼트 커피랩 ${p.t}`,
          description: p.d,
          image: u(p.img),
          brand: { "@id": u("/#org") },
          category: "발효 커피",
        },
      })),
      ...EDITIONS.map((e, i) => ({
        "@type": "ListItem",
        position: PRODUCTS.length + i + 1,
        item: {
          "@type": "Product",
          name: e.t,
          description: e.d,
          image: u(e.img),
          brand: { "@id": u("/#org") },
          category: "지역 한정판 발효 커피",
        },
      })),
    ],
  };

  const flavors = {
    "@type": "ItemList",
    "@id": u("/#flavors"),
    name: "발효 향미 라인업",
    itemListElement: FLAVORS.map((f, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Product",
        name: `${f.ko} 발효 원두`,
        description: f.d,
        image: u(f.img),
        brand: { "@id": u("/#org") },
        material: `${f.region} ${f.ko} · ${f.yeast}`,
      },
    })),
  };

  const quiz = {
    "@type": "WebApplication",
    "@id": u("/#taste-test"),
    name: "커피 취향 매칭 테스트",
    url: u("/#taste"),
    applicationCategory: "LifestyleApplication",
    operatingSystem: "Web",
    browserRequirements: "JavaScript",
    description:
      "10개 문항의 응답을 산미·바디감·단맛·개성 네 축으로 계산해 6개 산지, 4가지 가공방식, 8개 품종 가운데 가장 가까운 커피를 추천하는 무료 테스트입니다. 응답은 브라우저에서만 계산되며 저장되지 않습니다.",
    inLanguage: "ko-KR",
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" },
    publisher: { "@id": u("/#org") },
  };

  const graph = {
    "@context": "https://schema.org",
    "@graph": [org, site, page, faq, howto, products, flavors, quiz],
  };

  return (
    <script
      type="application/ld+json"
      // JSON.stringify 결과만 넣는다 — 사용자 입력이 섞이지 않는다
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
