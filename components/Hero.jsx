"use client";

import { useEffect, useRef, useState } from "react";
import { FIGURES } from "@/lib/content";
import { useInView } from "./util";

/* ---------- fermentation profile ---------- */

const H = [0, 6, 12, 18, 24, 30, 36, 42, 48, 54, 60, 66, 72];
const TEMP = [20, 22.5, 25, 27, 28, 28.4, 28.2, 27.5, 26, 23.5, 21, 19.5, 18.6];
const BRIX = [18, 17.4, 16.3, 14.6, 12.8, 11.2, 9.9, 8.9, 8.1, 7.5, 7.0, 6.6, 6.3];

const VW = 1000;
const VH = 200;
const PADX = 6;
const PADY = 22;

function path(vals, min, max) {
  const pts = vals.map((v, i) => {
    const x = PADX + (i / (vals.length - 1)) * (VW - PADX * 2);
    const y = PADY + (1 - (v - min) / (max - min)) * (VH - PADY * 2);
    return [x, y];
  });
  // catmull-rom → bezier for a smooth trace
  let d = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] || p2;
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C${c1x.toFixed(1)},${c1y.toFixed(1)} ${c2x.toFixed(1)},${c2y.toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
  }
  return d;
}

function Profile() {
  const [ref, seen] = useInView(0.3);
  const tempD = path(TEMP, 16, 30);
  const brixD = path(BRIX, 4, 20);

  return (
    <div className="profile" ref={ref}>
      <div className="profile__hd">
        <p className="lbl">Fermentation Profile — 딸기 로트 · 72시간</p>
        <div className="legend" style={{ margin: 0 }}>
          <span>
            <i style={{ background: "var(--ink)" }} />
            온도 °C
          </span>
          <span>
            <i style={{ background: "var(--berry)" }} />
            당도 Brix
          </span>
        </div>
      </div>

      <svg
        className="profile__svg"
        viewBox={`0 0 ${VW} ${VH}`}
        preserveAspectRatio="none"
        role="img"
        aria-label="72시간 동안 온도는 오르내리고 당도는 지속적으로 낮아지는 발효 프로파일 그래프"
      >
        {[0.25, 0.5, 0.75].map((t) => (
          <line
            key={t}
            x1="0"
            x2={VW}
            y1={PADY + t * (VH - PADY * 2)}
            y2={PADY + t * (VH - PADY * 2)}
            stroke="var(--line)"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
        ))}
        <path
          className="pl"
          d={brixD}
          fill="none"
          stroke="var(--berry)"
          strokeWidth="1.6"
          vectorEffect="non-scaling-stroke"
          strokeDasharray="2600"
          strokeDashoffset={seen ? 0 : 2600}
          style={{ transition: "stroke-dashoffset 1.9s cubic-bezier(0.22,1,0.36,1) 0.2s" }}
        />
        <path
          className="pl"
          d={tempD}
          fill="none"
          stroke="var(--ink)"
          strokeWidth="1.6"
          vectorEffect="non-scaling-stroke"
          strokeDasharray="2600"
          strokeDashoffset={seen ? 0 : 2600}
          style={{ transition: "stroke-dashoffset 1.9s cubic-bezier(0.22,1,0.36,1)" }}
        />
      </svg>

      <div className="hero__cap" style={{ marginTop: 4 }}>
        <span>0h</span>
        <span>24h</span>
        <span>48h</span>
        <span>72h</span>
      </div>
    </div>
  );
}

/* ---------- counter ---------- */

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
      const p = Math.min(1, (t - t0) / 1000);
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

/* ---------- hero ---------- */

export default function Hero() {
  return (
    <section className="hero" id="top">
      <div className="wrap">
        <div className="hero__top">
          <p className="hero__ix">
            FCL — 001
            <br />
            강원 · 발효 생두
          </p>
          <h1>
            향을 입히지 않고
            <br />
            생두 <span className="u">안에서</span> 기릅니다
          </h1>
        </div>

        <div className="hero__cols">
          <div>
            <p className="hero__p">
              퍼먼트 커피랩은 지역 특산물과 효모로 생두 단계의 향미 구조를
              재설계합니다. 시럽도 향료도 쓰지 않습니다. 과실·효모·당도·온도·시간
              다섯 변수를 데이터로 관리해 같은 향미를 반복해서 만들어냅니다.
            </p>
            <div className="hero__act">
              <a href="#process" className="btn btn--fill">
                발효 공정 보기
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
                  <path d="M2.5 10.5L10.5 2.5M10.5 2.5H4.5M10.5 2.5v6" stroke="currentColor" strokeWidth="1.2" />
                </svg>
              </a>
              <a href="#design" className="btn btn--out">
                향미 설계 시뮬레이터
              </a>
            </div>
          </div>

          <figure className="hero__fig">
            <img
              src="/img/lab.webp"
              alt="지역 과일과 효모로 생두를 발효시키는 퍼먼트 커피랩 실험실"
              width="1448"
              height="1086"
              fetchPriority="high"
            />
            <figcaption className="hero__cap">
              <span>Fermentation Lab</span>
              <span>Green Bean Flavor Design</span>
            </figcaption>
          </figure>
        </div>

        <Profile />

        <div className="figs">
          {FIGURES.map((f) => (
            <Fig key={f.l} {...f} />
          ))}
        </div>
      </div>
    </section>
  );
}
