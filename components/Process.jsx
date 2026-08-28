"use client";

import { STEPS } from "@/lib/content";
import { Head } from "./util";
import { usePin } from "./usePin";

const pad = (n) => String(n).padStart(2, "0");

export default function Process() {
  const { wrap, stage, i, goTo, setI } = usePin(STEPS.length);

  const hover = () =>
    typeof window !== "undefined" && window.matchMedia("(hover: hover)").matches;

  return (
    <section className="sec sec--w" id="process">
      <div className="wrap">
        <Head
          title={
            <>
              여섯 단계로 <b>표준화된</b> 향미 설계
            </>
          }
          desc="생두에서 향미 설계를 시작해, 로스팅 이후에도 목표한 향미가 그대로 재현되도록 기록·분석·정제·레시피 확정을 반복합니다."
        />

        <div className="flow pin" style={{ "--n": STEPS.length }} ref={wrap}>
          <div className="pin__stage" ref={stage}>
            <div className="flow__track" role="tablist" aria-label="발효 공정 단계">
              {STEPS.map((x, n) => (
                <button
                  key={x.n}
                  type="button"
                  role="tab"
                  aria-selected={n === i}
                  className={`flow__i ${n === i ? "on" : ""}`}
                  onClick={() => (hover() ? setI(n) : goTo(n))}
                  onMouseEnter={hover() ? () => setI(n) : undefined}
                >
                  <span className="flow__n">{x.n}</span>
                  <span className="flow__t">{x.t}</span>
                </button>
              ))}
            </div>

            <div className="pin__bar" aria-hidden="true">
              <span className="pin__c">
                {pad(i + 1)} / {pad(STEPS.length)}
              </span>
              <span className="pin__segs">
                {STEPS.map((x, n) => (
                  <span key={x.n} className={`pin__seg ${n <= i ? "f" : ""}`} />
                ))}
              </span>
              <span className={`pin__hint ${i === 0 ? "on" : ""}`}>
                스크롤
                <i />
              </span>
            </div>

            <div className="pin__panels">
              {STEPS.map((x, n) => (
                <article className={`flow__panel ${n === i ? "on" : ""}`} key={x.n}>
                  <div className="flow__fig">
                    <img src={x.img} alt={`${x.n} ${x.t}`} loading="lazy" />
                  </div>
                  <div className="flow__tx">
                    <h3 className="flow__h">{x.t}</h3>
                    <p className="flow__d">{x.d}</p>
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
