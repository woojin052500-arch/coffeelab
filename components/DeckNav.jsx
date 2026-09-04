"use client";

/* 단계 뷰어의 조작부 — 카운터 · 진행 막대 · 좌우 화살표.
   공정(6단계)과 향미(3종)가 같은 부품을 쓴다. */

const pad = (n) => String(n).padStart(2, "0");

export default function DeckNav({ i, count, onPrev, onNext, canPrev, canNext, onDot }) {
  return (
    <div className="deck__nav">
      <span className="deck__c">
        <b>{pad(i + 1)}</b> / {pad(count)}
      </span>

      <span className="deck__segs">
        {Array.from({ length: count }).map((_, n) => (
          <button
            key={n}
            type="button"
            className={`deck__seg ${n === i ? "on" : ""} ${n < i ? "f" : ""}`}
            aria-label={`${n + 1}번으로 이동`}
            aria-current={n === i}
            onClick={() => onDot(n)}
          />
        ))}
      </span>

      <span className="deck__arrows">
        <button type="button" aria-label="이전" onClick={onPrev} disabled={!canPrev}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          </svg>
        </button>
        <button type="button" aria-label="다음" onClick={onNext} disabled={!canNext}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          </svg>
        </button>
      </span>
    </div>
  );
}
