"use client";

/* ==========================================================================
   커피 취향 매칭 테스트 — 팝업(모달)
   --------------------------------------------------------------------------
   시작 화면 → 10문항(한 번에 한 문항) → 결과 카드. 모달은 데스크톱에서 가운데
   카드, 900px 이하에서는 화면을 꽉 채우는 시트로 열린다. 열려 있는 동안
   body 스크롤을 잠그고, 스크롤바가 사라지며 생기는 폭 변화는 padding으로
   메운다. Esc·배경 클릭으로 닫히고, Tab은 모달 안에서만 순환한다.
   ========================================================================== */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { QUESTIONS, calculateCoffeeMatch, shareText, PROC_DESC } from "@/lib/quiz";
import { COMPANY } from "@/lib/content";

const TOTAL = QUESTIONS.length;

function useLockBody(on) {
  useEffect(() => {
    if (!on) return;
    const body = document.body;
    const prevOverflow = body.style.overflow;
    const prevPad = body.style.paddingRight;
    const gap = window.innerWidth - document.documentElement.clientWidth;
    body.style.overflow = "hidden";
    if (gap > 0) body.style.paddingRight = `${gap}px`;
    return () => {
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPad;
    };
  }, [on]);
}

function Meters({ meters }) {
  return (
    <ul className="qz-mt">
      {meters.map((m) => (
        <li key={m.key}>
          <span className="qz-mt__k">{m.label}</span>
          <span className="qz-mt__b">
            <i style={{ width: `${m.v}%` }} />
          </span>
          <span className="qz-mt__x">{m.v >= 55 ? m.hi : m.lo}</span>
        </li>
      ))}
    </ul>
  );
}

function Result({ r, onRestart, onClose }) {
  const [copied, setCopied] = useState(false);

  const share = async () => {
    const text = shareText(r);
    const url = typeof window !== "undefined" ? window.location.origin : "";
    try {
      if (navigator.share) {
        await navigator.share({ title: "커피 취향 테스트 결과", text, url });
        return;
      }
      await navigator.clipboard.writeText(`${text}\n${url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      /* 사용자가 공유를 취소한 경우 — 아무것도 하지 않는다 */
    }
  };

  return (
    <div className="qz-res">
      <div className="qz-res__hd" style={{ "--c": r.type.color }}>
        <p className="qz-res__k">당신의 커피 취향은</p>
        <h3 className="qz-res__name">{r.type.name}</h3>
        <p className="qz-res__line">{r.type.line}</p>
      </div>

      <div className="qz-res__body">
        <figure className="qz-res__fig" style={{ "--c": r.type.color }}>
          <img src={r.type.img} alt="" aria-hidden="true" loading="lazy" />
        </figure>

        <dl className="qz-res__specs">
          <div>
            <dt>산지</dt>
            <dd>{r.origin}</dd>
          </div>
          <div>
            <dt>품종</dt>
            <dd>{r.variety}</dd>
          </div>
          <div>
            <dt>가공방식</dt>
            <dd>{r.processing}</dd>
          </div>
        </dl>
      </div>

      <ul className="qz-notes" aria-label="컵노트">
        {r.notes.map((n) => (
          <li key={n}>{n}</li>
        ))}
      </ul>

      <p className="qz-res__d">{r.type.d}</p>

      <Meters meters={r.meters} />

      <div className="qz-res__rows">
        <div>
          <span>가공 노트</span>
          <p>{PROC_DESC[r.processing]}</p>
        </div>
        <div>
          <span>추천 추출</span>
          <p>{r.type.pair}</p>
        </div>
        <div>
          <span>퍼먼트 커피랩 추천</span>
          <p>{r.type.match}</p>
        </div>
      </div>

      <div className="qz-act">
        <button type="button" className="btn btn--red" onClick={share}>
          {copied ? "결과가 복사되었습니다" : "결과 공유하기"}
        </button>
        <button type="button" className="btn" onClick={onRestart}>
          다시 테스트하기
        </button>
      </div>

      <a
        href={`tel:${COMPANY.telRaw}`}
        className="qz-res__cta"
        onClick={onClose}
      >
        이 취향에 맞는 발효 원두 문의하기
      </a>
    </div>
  );
}

export default function CoffeeTest({ open, onClose }) {
  const [step, setStep] = useState(-1); // -1 시작화면, 0~9 문항, TOTAL 결과
  const [answers, setAnswers] = useState([]);
  const panelRef = useRef(null);
  const scrollRef = useRef(null);

  useLockBody(open);

  const reset = useCallback(() => {
    setStep(-1);
    setAnswers([]);
  }, []);

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => panelRef.current?.focus(), 40);
    return () => clearTimeout(t);
  }, [open]);

  // 문항이 바뀔 때마다 내용 맨 위로
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: "instant" });
  }, [step]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const box = panelRef.current;
      if (!box) return;
      const f = box.querySelectorAll(
        'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
      );
      if (!f.length) return;
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const pick = (i) => {
    const next = [...answers];
    next[step] = i;
    setAnswers(next);
    setStep(step + 1);
  };

  const back = () => {
    if (step <= -1) return;
    setStep(step - 1);
  };

  const result = useMemo(
    () => (step >= TOTAL ? calculateCoffeeMatch(answers) : null),
    [step, answers]
  );

  const q = step >= 0 && step < TOTAL ? QUESTIONS[step] : null;
  const prog = step < 0 ? 0 : Math.min(1, step / TOTAL) * 100;

  return (
    <div
      className={`qz ${open ? "on" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label="커피 취향 매칭 테스트"
      aria-hidden={!open}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="qz__panel" ref={panelRef} tabIndex={-1}>
        <div className="qz__top">
          {step >= 0 && step < TOTAL ? (
            <button type="button" className="qz__back" onClick={back} aria-label="이전 문항">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </button>
          ) : (
            <span className="qz__mark">Coffee Taste Test</span>
          )}

          {step >= 0 && step < TOTAL ? (
            <span className="qz__count">
              <b>{String(step + 1).padStart(2, "0")}</b> / {TOTAL}
            </span>
          ) : null}

          <button type="button" className="qz__x" onClick={onClose} aria-label="테스트 닫기">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>
        </div>

        <div className="qz__prog" aria-hidden="true">
          <i style={{ width: `${prog}%` }} />
        </div>

        <div className="qz__scroll" ref={scrollRef}>
          {step === -1 ? (
            <div className="qz-intro">
              <figure className="qz-intro__fig">
                <img
                  src="/img/cupping.webp"
                  alt="번호로만 구분된 커핑 볼이 놓인 테이블"
                  loading="lazy"
                />
              </figure>
              <p className="qz-intro__k">10문항 · 1분</p>
              <h2 className="qz-intro__t">
                내 취향의 커피는
                <br />
                <b>어떤 얼굴을 하고 있을까</b>
              </h2>
              <p className="qz-intro__d">
                산미 · 바디감 · 단맛 · 개성 네 가지 축으로 취향을 읽고, 6개 산지 ·
                4가지 가공방식 · 8개 품종의 조합에서 가장 가까운 한 잔을
                찾아드립니다. 결과에는 그 취향에 맞는 퍼먼트 커피랩 발효 라인도
                함께 담깁니다.
              </p>
              <button type="button" className="btn btn--red qz-intro__go" onClick={() => setStep(0)}>
                테스트 시작하기
                <i className="btn__plus" aria-hidden="true" />
              </button>
              <p className="qz-intro__note">
                응답은 브라우저에서만 계산되며 어디에도 저장·전송되지 않습니다.
              </p>
            </div>
          ) : null}

          {q ? (
            <div className="qz-q" key={step}>
              <h2 className="qz-q__t">{q.q}</h2>
              <div className="qz-q__a">
                {q.a.map((a, i) => (
                  <button
                    type="button"
                    key={a.t}
                    className={`qz-opt ${answers[step] === i ? "on" : ""}`}
                    onClick={() => pick(i)}
                  >
                    <span className="qz-opt__i">{i === 0 ? "A" : "B"}</span>
                    <span className="qz-opt__t">{a.t}</span>
                    <span className="qz-opt__g">{a.tag}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {result ? <Result r={result} onRestart={reset} onClose={onClose} /> : null}
        </div>
      </div>
    </div>
  );
}
