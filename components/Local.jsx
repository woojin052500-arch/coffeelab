"use client";

import { CHAIN, CHAIN_OUT } from "@/lib/content";
import { Head, Rv, useInView } from "./util";

export default function Local() {
  const [ref, seen] = useInView(0.25);

  return (
    <section className="sec sec--soft" id="local">
      <div className="wrap">
        <Head
          title={
            <>
              지역의 들에서 <b>특별한 한 잔</b>까지
            </>
          }
          desc="맛과 향은 뛰어나지만 외관이나 유통 문제로 버려지던 지역 특산물이 발효의 핵심 동력이 됩니다. 농가의 폐기 자원은 수익원이 되고, 커피는 그 지역의 이야기를 얻습니다."
        />

        <div className="chain" ref={ref}>
          <div className="chain__l">
            {CHAIN.map((c, i) => (
              <div
                className={`chain__i ${seen ? "on" : ""}`}
                key={c.n}
                style={{ "--d": `${i * 110}ms` }}
              >
                <span className="chain__n">{c.n}</span>
                <p className="chain__t">{c.t}</p>
                <p className="chain__d">{c.d}</p>
              </div>
            ))}
          </div>

          <div className="chain__out">
            {CHAIN_OUT.map((o, i) => (
              <Rv className="chain__o" key={o.k} delay={i * 80}>
                <span className="lbl">{o.k}</span>
                <p>{o.v}</p>
              </Rv>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
