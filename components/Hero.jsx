"use client";

/* ==========================================================================
   히어로 — 제품을 늘어놓은 한 장면
   --------------------------------------------------------------------------
   소개서에 붙은 삼양라면 메인 비주얼을 기준으로 잡았다. 사진을 네모 칸에
   나눠 담지 않고, 따뜻한 바닥 위에 컷아웃을 크기·깊이를 달리해 배치해 한
   장면으로 읽히게 한다. 좌측에 라벨 · 큰 제목 · 알약 버튼, 우측이 장면.
   ========================================================================== */

import { useCallback, useEffect, useRef, useState } from "react";
import { SLIDES } from "@/lib/content";
import { openTest } from "./TestLauncher";

const pad = (n) => String(n).padStart(2, "0");

export default function Hero() {
  const [i, setI] = useState(0);
  const n = SLIDES.length;
  const timer = useRef();

  const go = useCallback((next) => setI(((next % n) + n) % n), [n]);

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
          <div className={`slide ${k === i ? "on" : ""}`} key={s.lbl} aria-hidden={k !== i}>
            <div className="slide__tx">
              <p className="slide__lbl">{s.lbl}</p>
              {k === 0 ? (
                <h1 className="slide__t">
                  {s.t[0]}
                  <br />
                  <b>{s.t[1]}</b>
                </h1>
              ) : (
                <p className="slide__t">
                  {s.t[0]}
                  <br />
                  <b>{s.t[1]}</b>
                </p>
              )}
              <p className="slide__d">{s.d}</p>

              <div className="slide__a">
                {s.test ? (
                  <button
                    type="button"
                    className="btn btn--red"
                    onClick={openTest}
                    tabIndex={k === i ? 0 : -1}
                  >
                    {s.cta}
                    <i className="btn__plus" aria-hidden="true" />
                  </button>
                ) : (
                  <a href={s.href} className="btn" tabIndex={k === i ? 0 : -1}>
                    {s.cta}
                    <i className="btn__plus" aria-hidden="true" />
                  </a>
                )}
              </div>
            </div>

            {/* 제품을 늘어놓은 장면 — 컷아웃이 바닥 위에 겹쳐 선다 */}
            <div className="scene" role="img" aria-label={`${s.t.join(" ")} 제품 이미지`}>
              <span className="scene__floor" aria-hidden="true" />
              {s.scene.map((o, m) => (
                <img
                  key={o.img + m}
                  className="scene__o"
                  src={o.img}
                  alt=""
                  aria-hidden="true"
                  loading={k === 0 ? "eager" : "lazy"}
                  fetchPriority={k === 0 && m === 2 ? "high" : "auto"}
                  decoding="async"
                  style={{
                    "--w": `${o.w}%`,
                    "--l": `${o.l}%`,
                    "--b": `${o.b}%`,
                    "--z": o.z,
                    "--d": `${m * 90}ms`,
                  }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="hero__ctl">
        <span className="hero__c">
          <b>{pad(i + 1)}</b> / {pad(n)}
        </span>

        <span className="hero__line" aria-hidden="true">
          <i style={{ transform: `scaleX(${(i + 1) / n})` }} />
        </span>

        <span className="arrows">
          <button type="button" aria-label="이전 슬라이드" onClick={() => go(i - 1)}>
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
              <path d="M9.5 2.5L4.5 7.5l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
          <button type="button" aria-label="다음 슬라이드" onClick={() => go(i + 1)}>
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
              <path d="M5.5 2.5l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        </span>
      </div>
    </section>
  );
}
