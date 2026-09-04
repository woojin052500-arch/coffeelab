"use client";

import { CHAIN, FIGURES } from "@/lib/content";
import { Head, Rv, useInView } from "./util";
import Mosaic from "./Mosaic";
import { useEffect, useRef, useState } from "react";

function Fig({ v, s, l }) {
  const [ref, seen] = useInView(0.4);
  const [n, setN] = useState(0);
  const raf = useRef();

  useEffect(() => {
    if (!seen) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setN(v);
      return;
    }
    const t0 = performance.now();
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / 1100);
      setN(Math.round(v * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [seen, v]);

  return (
    <div className="fig" ref={ref}>
      <p className="fig__n">
        {n}
        <span>{s}</span>
      </p>
      <p className="fig__l">{l}</p>
    </div>
  );
}

export default function Brand() {
  const [ref, seen] = useInView(0.2);

  return (
    <section className="sec sec--w" id="brand">
      <div className="wrap">
        <Head
          k="회사 소개"
          title="한국의 커피를 찾아서"
          desc="오늘날 한국은 세계적인 수준의 커피 소비국으로 성장했습니다. 그러나 현장에서 바리스타, 로스터, 그리고 커퍼로 활동해 온 저희는 늘 한 가지 의문을 품고 있었습니다."
        />

        <div className="story">
          <Rv delay={80}>
            <p>
              &lsquo;스페셜티&rsquo;라는 이름으로 다양성과 투명성을 이야기해
              왔지만, 정작 <b>&ldquo;한국을 대표할 수 있는 커피는 과연
              무엇인가?&rdquo;</b>라는 질문에는 대답할 수 없었습니다. 그 엄격한
              원칙들이 어쩌면 우리의 영역과 한계를 스스로 규정짓는 벽이었을지도
              모릅니다.
            </p>
            <p>
              이 물음에 답을 제시하고자, 저희 <em>퍼먼트 커피랩</em>이
              시작되었습니다.
            </p>
          </Rv>
          <Rv delay={160}>
            <p>
              커피 향미를 결정하는 핵심은 로스팅이 아니라 그 앞 단계인{" "}
              <b>생두 발효</b>입니다. 국내 브랜드는 이미 가공이 끝난 원료를
              들여와 로스팅과 블렌딩만 조정할 수 있었고, 이는 맛의 근본 설계에서
              분명한 한계로 작용했습니다.
            </p>
            <p>
              퍼먼트 커피랩은 지역 특산물과 효모로 생두 단계의 향미 구조를 다시
              설계하고, 그 조건을 <b>표준 공정으로 고정</b>합니다. 지역의 이야기가
              담긴 커피를 언제나 같은 맛으로 만들어내는 일이 저희가 하는
              일입니다.
            </p>
          </Rv>
        </div>

        <Mosaic name="brand" />

        <Rv>
          <p className="pull">
            향을 입히지 않고, <b>커피 안에서 기릅니다</b>
          </p>
        </Rv>

        <div className="figs">
          {FIGURES.map((f) => (
            <Fig key={f.l} {...f} />
          ))}
        </div>

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
        </div>
      </div>
    </section>
  );
}
