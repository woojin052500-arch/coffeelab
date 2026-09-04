import { GALLERY } from "@/lib/content";
import { Rv } from "./util";

/* ==========================================================================
   사진 모자이크
   --------------------------------------------------------------------------
   한 섹션에 사진 한 장만 놓지 않고 세 장을 한 덩어리로 묶는다. 첫 장이 큰
   칸을 차지하고 나머지 둘이 옆에 쌓인다. 배치는 CSS grid 한 곳에서만
   바뀐다 — 데스크톱 2열(큰 칸이 두 줄) · 태블릿 3열 가로 · 폰 큰 칸 위에
   작은 칸 2열.
   flip 을 주면 큰 칸이 오른쪽으로 간다. 섹션마다 좌우를 번갈아 두면 같은
   구성을 반복해도 지루하지 않다.
   ========================================================================== */
export default function Mosaic({ name, flip = false, className = "" }) {
  const items = GALLERY[name];
  if (!items?.length) return null;

  return (
    <div className={`mos ${flip ? "mos--flip" : ""} ${className}`.trim()}>
      {items.map((g, i) => (
        <Rv
          as="figure"
          className={`mos__i ${i === 0 ? "mos__i--lg" : ""}`}
          key={g.img + i}
          delay={i * 90}
        >
          <span className="mos__f">
            <img
              src={g.img}
              alt={g.alt}
              loading="lazy"
              decoding="async"
              style={g.pos ? { objectPosition: g.pos } : undefined}
            />
          </span>
          <figcaption>{g.cap}</figcaption>
        </Rv>
      ))}
    </div>
  );
}
