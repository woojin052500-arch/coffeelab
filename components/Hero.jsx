"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { FIGURES, SLIDES } from "@/lib/content";
import { useInView } from "./util";

/* ---------- fermentation profile ---------- */

const TEMP = [20, 22.5, 25, 27, 28, 28.4, 28.2, 27.5, 26, 23.5, 21, 19.5, 18.6];
const BRIX = [18, 17.4, 16.3, 14.6, 12.8, 11.2, 9.9, 8.9, 8.1, 7.5, 7.0, 6.6, 6.3];

const VW = 1000;
const VH = 200;
const PX = 4;
const PY = 20;

function path(vals, min, max) {
  const pts = vals.map((v, i) => [
    PX + (i / (vals.length - 1)) * (VW - PX * 2),
    PY + (1 - (v - min) / (max - min)) * (VH - PY * 2),
  ]);
  let d = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] || p2;
    d += ` C${(p1[0] + (p2[0] - p0[0]) / 6).toFixed(1)},${(p1[1] + (p2[1] - p0[1]) / 6).toFixed(1)} ${(p2[0] - (p3[0] - p1[0]) / 6).toFixed(1)},${(p2[1] - (p3[1] - p1[1]) / 6).toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
  }
  return d;
}

export function Profile() {
  const [ref, seen] = useInView(0.25);
  return (
    <section className="band" ref={ref}>
      <div className="wrap band__in">
        <svg
          className="prof"
          viewBox={`0 0 ${VW} ${VH}`}
          preserveAspectRatio="none"
          role="img"
          aria-label="72시간 동안 온도는 오르내리고 당도는 계속 낮아지는 발효 프로파일 그래프"
        >
          {[0, 0.5, 1].map((t) => (
            <line
              key={t}
              x1="0"
              x2={VW}
              y1={PY + t * (VH - PY * 2)}
              y2={PY + t * (VH - PY * 2)}
              stroke="var(--line)"
              strokeWidth="1"
              strokeDasharray={t === 1 ? "0" : "2 5"}
              vectorEffect="non-scaling-stroke"
            />
          ))}
          <path
            className="pl"
            d={path(BRIX, 4, 20)}
            fill="none"
            stroke="var(--berry)"
            strokeWidth="1.6"
            vectorEffect="non-scaling-stroke"
            strokeDasharray="2600"
            strokeDashoffset={seen ? 0 : 2600}
            style={{ transition: "stroke-dashoffset 2s cubic-bezier(0.22,1,0.36,1) 0.25s" }}
          />
          <path
            className="pl"
            d={path(TEMP, 16, 30)}
            fill="none"
            stroke="var(--gold)"
            strokeWidth="1.8"
            vectorEffect="non-scaling-stroke"
            strokeDasharray="2600"
            strokeDashoffset={seen ? 0 : 2600}
            style={{ transition: "stroke-dashoffset 2s cubic-bezier(0.22,1,0.36,1)" }}
          />
        </svg>
      </div>
    </section>
  );
}

/* ---------- key figures ---------- */

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

export function Figures() {
  return (
    <section className="sec" style={{ paddingBlock: "clamp(44px, 5.5vw, 78px)" }}>
      <div className="wrap">
        <div className="figs">
          {FIGURES.map((f) => (
            <Fig key={f.l} {...f} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- hero slider ---------- */

export default function Hero() {
  const [i, setI] = useState(0);
  const n = SLIDES.length;
  const timer = useRef();

  const go = useCallback(
    (next) => setI(((next % n) + n) % n),
    [n]
  );

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    clearTimeout(timer.current);
    timer.current = setTimeout(() => go(i + 1), 6500);
    return () => clearTimeout(timer.current);
  }, [i, go]);

  const touch = useRef(null);
  const onTouchStart = (e) => {
    touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const onTouchEnd = (e) => {
    if (!touch.current) return;
    const dx = e.changedTouches[0].clientX - touch.current.x;
    const dy = e.changedTouches[0].clientY - touch.current.y;
    if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy)) go(i + (dx < 0 ? 1 : -1));
    touch.current = null;
  };

  return (
    <section className="hero" id="top" aria-roledescription="carousel">
      <div className="hero__stage" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        {SLIDES.map((s, k) => (
          <div
            className={`slide ${k === i ? "on" : ""}`}
            key={s.lbl}
            aria-hidden={k !== i}
          >
            <div>
              <h1 className="slide__t">
                {s.t[0]}
                <br />
                <b>{s.t[1]}</b>
              </h1>
              <p className="slide__d">{s.d}</p>
              <div className="slide__a">
                <a href={s.href} className="btn">
                  {s.cta}
                  <i className="btn__plus" aria-hidden="true" />
                </a>
              </div>
            </div>

            <figure className="slide__fig">
              <img
                src={s.img}
                alt={s.t.join(" ")}
                loading={k === 0 ? "eager" : "lazy"}
                fetchPriority={k === 0 ? "high" : "auto"}
              />
            </figure>
          </div>
        ))}
      </div>

      <div className="hero__ctl">
        <div className="dots2" role="tablist" aria-label="히어로 슬라이드">
          {SLIDES.map((s, k) => (
            <button
              key={s.lbl}
              type="button"
              role="tab"
              aria-selected={k === i}
              aria-label={`${k + 1}번 슬라이드`}
              className={k === i ? "on" : ""}
              onClick={() => go(k)}
            />
          ))}
        </div>

        <div className="arrows">
          <button type="button" aria-label="이전 슬라이드" onClick={() => go(i - 1)}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M8.5 2.5L4 7l4.5 4.5" stroke="currentColor" strokeWidth="1.4" />
            </svg>
          </button>
          <button type="button" aria-label="다음 슬라이드" onClick={() => go(i + 1)}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M5.5 2.5L10 7l-4.5 4.5" stroke="currentColor" strokeWidth="1.4" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
