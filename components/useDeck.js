"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * 좌우로 넘기는 단계 뷰어.
 *
 * 세로 스크롤을 붙잡아 단계를 넘기던 방식(usePin)을 대신한다. 화면을 잡아두지
 * 않으므로 사용자가 페이지를 그냥 지나쳐 내려갈 수 있고, 넘기는 동작도
 * 스와이프 · 화살표 버튼 · 키보드 좌우키 셋 다 통한다.
 *
 * 반환값의 `bind`를 뷰 컨테이너에 펼쳐 붙이면 스와이프가 붙는다.
 */
export function useDeck(count, { loop = false } = {}) {
  const [i, setI] = useState(0);
  const view = useRef(null);
  const touch = useRef(null);

  const goTo = useCallback(
    (n) => {
      setI(loop ? ((n % count) + count) % count : Math.min(count - 1, Math.max(0, n)));
    },
    [count, loop]
  );

  const next = useCallback(() => goTo(i + 1), [goTo, i]);
  const prev = useCallback(() => goTo(i - 1), [goTo, i]);

  const canPrev = loop || i > 0;
  const canNext = loop || i < count - 1;

  /* 좌우 방향키 — 뷰에 포커스가 있을 때만 (페이지 전체 키 입력을 가로채지 않는다) */
  const onKeyDown = useCallback(
    (e) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        next();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        prev();
      }
    },
    [next, prev]
  );

  /* 스와이프 — 가로 이동이 세로보다 뚜렷할 때만 단계를 넘긴다.
     그러지 않으면 세로 스크롤 중에도 단계가 넘어간다. */
  const onTouchStart = useCallback((e) => {
    touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }, []);

  const onTouchEnd = useCallback(
    (e) => {
      const t = touch.current;
      touch.current = null;
      if (!t) return;
      const dx = e.changedTouches[0].clientX - t.x;
      const dy = e.changedTouches[0].clientY - t.y;
      if (Math.abs(dx) < 44 || Math.abs(dx) < Math.abs(dy) * 1.2) return;
      if (dx < 0) next();
      else prev();
    },
    [next, prev]
  );

  /* 단계 수가 줄면 인덱스를 범위 안으로 되돌린다 */
  useEffect(() => {
    setI((n) => Math.min(n, count - 1));
  }, [count]);

  return {
    i,
    setI: goTo,
    goTo,
    next,
    prev,
    canPrev,
    canNext,
    view,
    bind: { ref: view, onTouchStart, onTouchEnd, onKeyDown, tabIndex: 0 },
  };
}
