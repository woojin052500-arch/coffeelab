"use client";

/* 테스트 팝업 열기 신호 —— 헤더 · 히어로 · 전용 섹션 · 모바일 바 등 어디서든
   같은 이벤트를 던진다. 컨텍스트를 끌고 다니지 않아도 되고, page.jsx는
   서버 컴포넌트로 남는다. */

export const OPEN_TEST = "ferment:open-test";

export function openTest() {
  if (typeof window !== "undefined") window.dispatchEvent(new Event(OPEN_TEST));
}

export default function TestButton({ className = "btn", children, ...rest }) {
  return (
    <button type="button" className={className} onClick={openTest} {...rest}>
      {children}
    </button>
  );
}
