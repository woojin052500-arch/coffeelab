"use client";

import { useEffect, useState } from "react";
import { FLAVORS } from "@/lib/content";
import { Head, Rv, useInView } from "./util";
import { useDeck } from "./useDeck";
import DeckNav from "./DeckNav";

export default function Flavor() {
  const n = FLAVORS.length;
  const { i, setI, next, prev, canPrev, canNext, bind } = useDeck(n);
  const f = FLAVORS[i];
  const [box, seen] = useInView(0.15);
  const [fill, setFill] = useState(false);

  useEffect(() => {
    if (!seen) return undefined;
    const t = setTimeout(() => setFill(true), 80);
    return () => clearTimeout(t);
  }, [seen]);

  return (
    <section
      className="sec sec--tint"
      id="flavor"
      style={{ background: `color-mix(in srgb, ${f.color} 6%, #ffffff)` }}
    >
      <div className="wrap">
        <Head
          k="향미 라인업"
          title={
            <>
              과일이 바뀌면 <b>커피가 바뀝니다</b>
            </>
          }
          desc="인위적인 가향으로는 흉내 낼 수 없는 결. 각 라인은 지역 농가의 비규격 과실과 그에 맞는 효모를 짝지어 만들어집니다."
        />

        <div className="deck fl__deck">
          <div className="tabs" role="tablist" aria-label="향미 라인업">
            {FLAVORS.map((x, k) => (
              <button
                key={x.key}
                type="button"
                role="tab"
                aria-selected={k === i}
                className={`tab ${k === i ? "on" : ""}`}
                onClick={() => setI(k)}
              >
                {x.ko}
                <span className="tab__en"> · {x.en}</span>
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

          <div className="deck__view" aria-roledescription="carousel" {...bind}>
            <div
              className="deck__rail"
              ref={box}
              style={{ transform: `translateX(-${i * 100}%)` }}
            >
              {FLAVORS.map((x, k) => (
                <div className="deck__panel fl" key={x.key} aria-hidden={k !== i}>
                  {/* 과실 컷아웃 + 공정 사진 두 장. 데스크톱은 위아래,
                      폰은 좌우로 붙는다. */}
                  <div className="fl__figs">
                    <figure className="fl__fig fig--object" style={{ "--c": x.color }}>
                      <img src={x.img} alt={`${x.ko} 발효 원두의 주원료`} loading="lazy" />
                    </figure>
                    <figure className="fl__sub">
                      <img src={x.photo} alt={`${x.ko} 발효 원두 ${x.photoCap}`} loading="lazy" />
                      <figcaption>{x.photoCap}</figcaption>
                    </figure>
                  </div>

                  <div className="fl__tx">
                    <h3 className="fl__ko">{x.ko} 발효 원두</h3>
                    <div className="fl__rule" style={{ "--c": x.color }} />
                    <p className="fl__d">{x.d}</p>

                    <div className="mt">
                      {x.m.map(([k, v]) => (
                        <div className="mt__r" key={k}>
                          <span className="mt__k">{k}</span>
                          <span className="mt__b">
                            <span
                              className="mt__f"
                              style={{ width: fill ? `${v}%` : 0, "--c": x.color }}
                            />
                          </span>
                          <span className="mt__v">{v}</span>
                        </div>
                      ))}
                    </div>

                    <div className="fl__pair">
                      <div>
                        <span className="lbl">주원료</span>
                        <p>{x.src}</p>
                      </div>
                      <div>
                        <span className="lbl">효모</span>
                        <p>{x.yeast}</p>
                      </div>
                      <div>
                        <span className="lbl">권장</span>
                        <p>{x.brew}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Rv style={{ marginTop: "clamp(26px,3.4vw,44px)" }}>
          <p className="lbl">
            시즌 한정 — 제주 감귤, 원주 복숭아 라인은 수확기에 맞춰 운영합니다.
          </p>
        </Rv>
      </div>
    </section>
  );
}
