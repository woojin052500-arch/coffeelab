import { PHASES, TIMELINE } from "@/lib/content";
import { Head, Rv } from "./util";

export default function Roadmap() {
  return (
    <section className="sec sec--soft" id="roadmap">
      <div className="wrap">
        <Head
          title={
            <>
              레시피에서 <b>플랫폼</b>으로
            </>
          }
          desc="한 가지 맛을 잘 만드는 일에서 시작해, 어떤 지역 특산물에도 적용할 수 있는 향미 설계 솔루션으로 넓혀갑니다."
        />

        <Rv className="tl">
          <div className="tl__in">
            {TIMELINE.map((t) => (
              <div className={`tl__i ${t.done ? "done" : ""}`} key={t.q}>
                <span className="tl__q">{t.q}</span>
                <p className="tl__t">{t.t}</p>
                <p className="tl__d">{t.d}</p>
                {t.now ? <span className="tl__now">NOW</span> : null}
              </div>
            ))}
          </div>
        </Rv>
        <p className="tl__hint">← 좌우로 밀어서 전체 일정 보기</p>

        <div className="phase">
          {PHASES.map((p, i) => (
            <Rv className="phase__i" key={p.p} delay={i * 90}>
              <span className="phase__p">{p.p}</span>
              <h3 className="phase__t">{p.t}</h3>
              <ul className="phase__l">
                {p.l.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </Rv>
          ))}
        </div>
      </div>
    </section>
  );
}
