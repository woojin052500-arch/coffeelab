"use client";

import { MARKET, PROBLEMS, SCOPE } from "@/lib/content";
import { Head, Rv, useInView } from "./util";

const MAX = 1786;

function MarketBars() {
  const [ref, seen] = useInView(0.3);
  return (
    <div className="chart" ref={ref}>
      <div className="chart__hd">
        <p className="chart__t">글로벌 스페셜티 커피 시장 규모</p>
        <p className="chart__src">단위 억 달러 · credence research</p>
      </div>

      <div className="mk">
        {MARKET.map((m) => {
          const w = (m.v / MAX) * 100;
          return (
            <div className="mk__row" key={m.y}>
              <span className="mk__y">
                {m.y}
                {m.forecast ? "E" : ""}
              </span>
              <span className="mk__track">
                <span
                  className={`mk__fill ${m.forecast ? "f" : ""}`}
                  style={{ width: seen ? `${w}%` : 0 }}
                />
                <span className={`mk__v ${seen ? "on" : ""} ${m.forecast ? "dark" : ""}`}>
                  {m.label}
                </span>
              </span>
            </div>
          );
        })}
      </div>

      <div className="legend">
        <span>
          <i style={{ background: "var(--ink)" }} />
          실적
        </span>
        <span>
          <i style={{ background: "var(--line-2)" }} />
          전망
        </span>
        <span style={{ color: "var(--ink)" }}>6년간 +75%</span>
      </div>
    </div>
  );
}

function Scope() {
  const [ref, seen] = useInView(0.3);
  const rings = [
    { r: 140, fill: "#eae8e3", text: "var(--ink)" },
    { r: 104, fill: "#d6d3cc", text: "var(--ink)" },
    { r: 70, fill: "#a8a49b", text: "#fff" },
    { r: 40, fill: "var(--ink)", text: "#fff" },
  ];
  const BOT = 292;

  return (
    <div className="chart" ref={ref}>
      <div className="chart__hd">
        <p className="chart__t">목표 시장</p>
        <p className="chart__src">TAM / SAM / SOM / LAM</p>
      </div>

      <svg viewBox="0 0 300 300" style={{ width: "100%", height: "auto", display: "block" }} role="img" aria-label="목표 시장 규모를 겹친 원으로 나타낸 그림">
        {rings.map((ring, i) => {
          const s = SCOPE[i];
          const cy = BOT - ring.r;
          return (
            <g
              className="sg"
              key={s.k}
              style={{
                opacity: seen ? 1 : 0,
                transform: seen ? "none" : "translateY(10px)",
                transition: `opacity .6s ease ${i * 120}ms, transform .6s cubic-bezier(.22,1,.36,1) ${i * 120}ms`,
              }}
            >
              <circle cx="150" cy={cy} r={ring.r} fill={ring.fill} />
              <text
                x="150"
                y={cy - ring.r + 24}
                textAnchor="middle"
                fill={ring.text}
                fontSize="13"
                letterSpacing="1.4"
              >
                {s.k}
              </text>
              <text
                x="150"
                y={cy - ring.r + 42}
                textAnchor="middle"
                fill={ring.text}
                fontSize="14.5"
                fontWeight="500"
              >
                {s.v}
              </text>
            </g>
          );
        })}
      </svg>

      <div style={{ marginTop: 14, display: "grid", gap: 7 }}>
        {SCOPE.map((s) => (
          <p
            key={s.k}
            style={{
              margin: 0,
              display: "flex",
              gap: 12,
              fontSize: 12.5,
              color: "var(--ink-2)",
              lineHeight: 1.6,
            }}
          >
            <span className="lbl" style={{ minWidth: 34 }}>
              {s.k}
            </span>
            {s.d}
          </p>
        ))}
      </div>
    </div>
  );
}

export default function Why() {
  return (
    <section className="sec" id="why">
      <div className="wrap">
        <Head
          ix="02 / 왜 지금인가"
          title={
            <>
              버려지는 과일과 <b>평범한 생두</b>가 만나는 지점
            </>
          }
          desc="수입 원료 의존, 농산물 폐기, 스페셜티 수급 불안. 서로 떨어져 보이는 세 가지 문제는 하나의 공정으로 이어집니다."
        />

        <div className="ps">
          {PROBLEMS.map((p, i) => (
            <Rv className="ps__r" key={p.n} delay={i * 80}>
              <span className="ps__n">{p.n}</span>
              <div>
                <span className="ps__k lbl">Problem</span>
                <p className="ps__x">{p.p}</p>
              </div>
              <div className="ps__s">
                <span className="ps__k lbl">Solution</span>
                <p className="ps__x">{p.s}</p>
              </div>
            </Rv>
          ))}
        </div>

        <div className="market">
          <Rv>
            <MarketBars />
          </Rv>
          <Rv delay={100}>
            <Scope />
          </Rv>
        </div>
      </div>
    </section>
  );
}
