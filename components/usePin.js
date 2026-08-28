"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * 세로 스크롤로 단계가 넘어가는 고정(pin) 섹션.
 *
 * 모바일에서 `.stage`가 화면에 고정되는 동안 바깥 래퍼의 남은 높이만큼
 * 스크롤이 소비되고, 그 진행률이 그대로 단계 인덱스가 된다. 데스크톱에서는
 * 래퍼에 여분 높이가 없어(=travel 0) 자동으로 꺼지고 클릭·호버로 돌아간다.
 */
export function usePin(count) {
  const wrap = useRef(null);
  const stage = useRef(null);
  const [i, setI] = useState(0);

  const metrics = useCallback(() => {
    const w = wrap.current;
    const s = stage.current;
    if (!w || !s) return null;
    const travel = w.offsetHeight - s.offsetHeight;
    if (travel <= 8) return null;
    const top = w.getBoundingClientRect().top + window.scrollY;
    const pin = parseFloat(getComputedStyle(s).top) || 0;
    return { travel, top, pin };
  }, []);

  useEffect(() => {
    let raf = 0;
    const read = () => {
      raf = 0;
      const m = metrics();
      if (!m) return; // 데스크톱: pin 비활성, 클릭·호버가 인덱스를 잡는다
      const p = (window.scrollY - m.top + m.pin) / m.travel;
      const n = Math.min(count - 1, Math.max(0, Math.floor(p * count)));
      setI((prev) => (prev === n ? prev : n));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(read);
    };
    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [count, metrics]);

  /** 인덱스를 눌렀을 때: 해당 단계의 한가운데로 스크롤 */
  const goTo = useCallback(
    (n) => {
      const m = metrics();
      if (!m) {
        setI(n);
        return;
      }
      window.scrollTo({
        top: m.top - m.pin + ((n + 0.5) / count) * m.travel,
        behavior: "smooth",
      });
    },
    [count, metrics]
  );

  return { wrap, stage, i, goTo, setI };
}
