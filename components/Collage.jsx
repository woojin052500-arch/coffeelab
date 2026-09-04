import { COLLAGE } from "@/lib/content";
import { Head, Rv } from "./util";

/* ==========================================================================
   사진 콜라주 섹션
   --------------------------------------------------------------------------
   여섯 장을 크기가 서로 다른 칸에 끼워 한 판으로 읽히게 한다. 자리는
   grid-template-areas 가 잡고, 화면이 좁아지면 6열 → 3열 → 2열로 area 지도만
   다시 그린다. 큰 칸(a)에만 설명 문구를 얹는다.
   ========================================================================== */
export default function Collage() {
  return (
    <section className="sec collage" id="gallery">
      <div className="wrap">
        <Head
          k="현장"
          title={
            <>
              버려지던 지역 과실이 <b>그 지역의 커피가</b> 됩니다
            </>
          }
          desc="제주 감귤, 논산 딸기, 원주 복숭아. 규격에 미달해 폐기되던 과실이 발효를 거쳐 지역의 이름을 단 커피가 되기까지."
        />

        <div className="cg">
          {COLLAGE.map((g, i) => (
            <Rv
              as="figure"
              className={`cg__i cg--${g.a} ${g.tint ? "cg__i--obj" : ""}`}
              key={g.img + g.a}
              delay={i * 70}
              style={{ gridArea: g.a, "--bg": g.tint }}
            >
              <span className="cg__f">
                <img
                  src={g.img}
                  alt={g.alt}
                  loading="lazy"
                  decoding="async"
                  style={g.pos ? { objectPosition: g.pos } : undefined}
                />
              </span>
              <figcaption className="cg__cap">
                <b>{g.cap}</b>
                {g.sub ? <span>{g.sub}</span> : null}
              </figcaption>
            </Rv>
          ))}
        </div>
      </div>
    </section>
  );
}
