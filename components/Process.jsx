"use client";

import { useState } from "react";
import { STEPS } from "@/lib/content";
import { Head, Rv } from "./util";

export default function Process() {
  const [i, setI] = useState(0);
  const s = STEPS[i];
  const canHover =
    typeof window !== "undefined" && window.matchMedia("(hover: hover)").matches;

  return (
    <section className="sec sec--panel" id="process">
      <div className="wrap">
        <Head
          ix="03 / 발효 공정"
          title={
            <>
              여섯 단계로 <b>표준화된</b> 향미 설계
            </>
          }
          desc="생두에서 향미 설계를 시작해, 로스팅 이후에도 목표한 향미가 그대로 재현되도록 기록·분석·정제·레시피 확정을 반복합니다."
        />

        <Rv className="flow">
          <div className="flow__track" role="tablist" aria-label="발효 공정 단계">
            {STEPS.map((x, n) => (
              <button
                key={x.n}
                type="button"
                role="tab"
                aria-selected={n === i}
                className={`flow__i ${n === i ? "on" : ""}`}
                onClick={() => setI(n)}
                onMouseEnter={canHover ? () => setI(n) : undefined}
              >
                <span className="flow__n">{x.n}</span>
                <span className="flow__t">{x.t}</span>
              </button>
            ))}
          </div>

          <div className="flow__body">
            <div>
              <p className="flow__no">{s.n}</p>
              <h3 className="flow__h">{s.t}</h3>
              <p className="flow__d">{s.d}</p>
              <div className="flow__vars">
                {s.vars.map((v) => (
                  <span key={v}>{v}</span>
                ))}
              </div>
            </div>

            <div className="flow__fig">
              {STEPS.map((x, n) => (
                <img
                  key={x.n}
                  src={x.img}
                  alt={`${x.n} ${x.t}`}
                  className={n === i ? "on" : ""}
                  loading="lazy"
                />
              ))}
            </div>
          </div>
        </Rv>
      </div>
    </section>
  );
}
