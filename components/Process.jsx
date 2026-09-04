"use client";

import { STEPS } from "@/lib/content";
import { Head } from "./util";
import { useDeck } from "./useDeck";
import DeckNav from "./DeckNav";

export default function Process() {
  const n = STEPS.length;
  const { i, setI, next, prev, canPrev, canNext, bind } = useDeck(n);

  return (
    <section className="sec sec--w" id="process">
      <div className="wrap">
        <Head
          k="발효 기술"
          title={
            <>
              여섯 단계로 <b>표준화된</b> 향미 설계
            </>
          }
          desc="생두에서 향미 설계를 시작해, 로스팅 이후에도 목표한 향미가 그대로 재현되도록 기록·분석·정제·레시피 확정을 반복합니다."
        />

        <div className="deck flow">
          {/* 데스크톱·태블릿: 여섯 칸을 한눈에 두고 눌러서 이동 */}
          <div className="flow__track" role="tablist" aria-label="발효 공정 단계">
            {STEPS.map((x, k) => (
              <button
                key={x.n}
                type="button"
                role="tab"
                aria-selected={k === i}
                className={`flow__i ${k === i ? "on" : ""}`}
                onClick={() => setI(k)}
              >
                <span className="flow__n">{x.n}</span>
                <span className="flow__t">{x.t}</span>
              </button>
            ))}
          </div>

          <DeckNav
            i={i}
            count={n}
            onPrev={prev}
            onNext={next}
            canPrev={canPrev}
            canNext={canNext}
            onDot={setI}
          />

          {/* 옆으로 넘기는 레일 — 스와이프·화살표·좌우키 */}
          <div className="deck__view" aria-roledescription="carousel" {...bind}>
            <div className="deck__rail" style={{ transform: `translateX(-${i * 100}%)` }}>
              {STEPS.map((x, k) => (
                <article
                  className="deck__panel flow__panel"
                  key={x.n}
                  aria-hidden={k !== i}
                  aria-label={`${k + 1} / ${n} ${x.t}`}
                >
                  <div
                    className={`flow__fig ${x.fit === "contain" ? "fig--object" : ""}`}
                    style={x.tint ? { "--c": x.tint } : x.bg ? { "--bg": x.bg } : undefined}
                  >
                    <img
                      src={x.img}
                      alt={`${x.n} ${x.t}`}
                      loading={k === 0 ? "eager" : "lazy"}
                      decoding="async"
                    />
                  </div>
                  <div className="flow__tx">
                    <span className="flow__step">STEP {x.n}</span>
                    <h3 className="flow__h">{x.t}</h3>
                    <p className="flow__d">{x.d}</p>
                    {x.vars?.length ? (
                      <ul className="flow__vars">
                        {x.vars.map((v) => (
                          <li key={v}>{v}</li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
