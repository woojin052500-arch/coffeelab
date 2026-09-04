"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { SLIDES } from "@/lib/content";
import { openTest } from "./TestLauncher";

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
              {/* h1은 문서에 하나만 둔다. 나머지 슬라이드 제목은 같은 모양의 문단. */}
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

            {/* 메인 사진 + 오른쪽 제품 컷 두 장 */}
            <div className="slide__media">
              <figure className="slide__fig">
                <img
                  src={s.img}
                  alt={s.t.join(" ")}
                  loading={k === 0 ? "eager" : "lazy"}
                  fetchPriority={k === 0 ? "high" : "auto"}
                />
              </figure>

              {s.thumbs?.length ? (
                <div className="slide__thumbs">
                  {s.thumbs.map((t) => (
                    <figure className="sthumb" key={t.img + t.cap} style={{ "--bg": t.bg }}>
                      <span className="sthumb__f">
                        <img src={t.img} alt={t.cap} loading="lazy" decoding="async" />
                      </span>
                      <figcaption>{t.cap}</figcaption>
                    </figure>
                  ))}
                </div>
              ) : null}
            </div>
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
