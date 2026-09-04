import { BANDS } from "@/lib/content";

/* 전면 사진 밴드 — 삼양식품 홈페이지처럼 섹션 사이에 사진을 화면 폭 전체로
   깔고 그 위에 한 문장을 얹는다. 모바일에서는 높이를 줄이고 글자를 아래로
   붙여 사진이 가려지지 않게 한다. */
export default function Band({ name, priority = false }) {
  const b = BANDS[name];
  if (!b) return null;
  return (
    <section className="band" aria-label={b.t.join(" ")}>
      <img
        className="band__img"
        src={b.img}
        alt={b.alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
      />
      <div className="band__in">
        <p className="band__k">{b.k}</p>
        <p className="band__t">
          {b.t[0]}
          <br />
          <b>{b.t[1]}</b>
        </p>
        <p className="band__d">{b.d}</p>
      </div>
    </section>
  );
}
