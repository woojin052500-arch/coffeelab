"use client";

import { RADAR_AXES, RADAR_OTHER, RADAR_OURS, TIMELINE } from "@/lib/content";
import { Head, Rv, useInView } from "./util";

const CX = 160;
const CY = 152;
const R = 100;

const pt = (i, v, n) => {
  const a = -Math.PI / 2 + (i / n) * Math.PI * 2;
  const r = (v / 100) * R;
  return [CX + Math.cos(a) * r, CY + Math.sin(a) * r];
};

const poly = (vals) =>
  vals.map((v, i) => pt(i, v, vals.length).map((x) => x.toFixed(1)).join(",")).join(" ");

function Radar() {
  const [ref, seen] = useInView(0.3);
  const n = RADAR_AXES.length;

  return (
    <div className="chart" ref={ref}>
      <div className="chart__hd">
        <h3 className="chart__t">관능 평가 비교</h3>
      </div>

      <svg
        className="radar"
        viewBox="0 0 320 300"
        role="img"
        aria-label="산미·단맛·쓴맛·바디감·가격 다섯 축에서 발효 원두와 타사 원두를 비교한 레이더 차트"
      >
        {[25, 50, 75, 100].map((g) => (
          <polygon
            key={g}
            points={poly(Array(n).fill(g))}
            fill="none"
            stroke="var(--line)"
            strokeWidth="1"
          />
        ))}
        {RADAR_AXES.map((a, i) => {
          const [x, y] = pt(i, 100, n);
          const [lx, ly] = pt(i, 128, n);
          return (
            <g key={a}>
              <line x1={CX} y1={CY} x2={x} y2={y} stroke="var(--line)" strokeWidth="1" />
              <text
                x={lx}
                y={ly + 4}
                textAnchor={Math.abs(lx - CX) < 8 ? "middle" : lx > CX ? "start" : "end"}
                fontSize="13.5"
                fontWeight="500"
                fill="var(--ink-2)"
              >
                {a}
              </text>
            </g>
          );
        })}

        <g
          className="rg"
          style={{
            transformOrigin: `${CX}px ${CY}px`,
            transform: seen ? "scale(1)" : "scale(0.25)",
            opacity: seen ? 1 : 0,
            transition: "transform .9s cubic-bezier(.22,1,.36,1), opacity .5s ease",
          }}
        >
          <polygon
            points={poly(RADAR_OTHER)}
            fill="none"
            stroke="var(--line-2)"
            strokeWidth="1.6"
            strokeDasharray="4 3"
          />
        </g>
        <g
          className="rg"
          style={{
            transformOrigin: `${CX}px ${CY}px`,
            transform: seen ? "scale(1)" : "scale(0.25)",
            opacity: seen ? 1 : 0,
            transition:
              "transform .9s cubic-bezier(.22,1,.36,1) .12s, opacity .5s ease .12s",
          }}
        >
          <polygon
            points={poly(RADAR_OURS)}
            fill="rgba(190,46,46,0.08)"
            stroke="var(--red)"
            strokeWidth="1.8"
          />
          {RADAR_OURS.map((v, i) => {
            const [x, y] = pt(i, v, n);
            return <circle key={i} cx={x} cy={y} r="3" fill="var(--red)" />;
          })}
        </g>
      </svg>

      <div className="legend">
        <span>
          <i style={{ background: "var(--red)" }} />
          퍼먼트 발효 원두
        </span>
        <span>
          <i style={{ background: "var(--line-2)" }} />
          타사 프리미엄 원두 (1kg 3~6만 원대)
        </span>
      </div>
    </div>
  );
}

function Score() {
  const [ref, seen] = useInView(0.4);
  return (
    <div ref={ref}>
      <div className="score">
        <span className="score__n">13</span>
        <span className="score__d">
          커피 전공자 20인 중
          <br />
          발효 원두를 고른 인원
        </span>
      </div>

      <div className={`dots ${seen ? "on" : ""}`} aria-hidden="true">
        {Array.from({ length: 20 }).map((_, i) => (
          <i
            key={i}
            className={i < 13 ? "f" : ""}
            style={{ transitionDelay: `${i * 32}ms` }}
          />
        ))}
      </div>

      <div className="proof__t">
      <p>
        2026년 4월, 전 국가대표 바리스타 도형수 교수와 커피 전공자 20인이 참여한
        블라인드 테스트에서 타사 프리미엄 원두 6종과 비교했습니다. 산미·클린컵·복합미
        세 부문에서 고르게 우위를 확인했습니다.
      </p>
      <p>
        대학 내 미생물학·바리스타 전공 교수진의 기술 자문을 거쳐 실현 가능성을
        검증했고, 캡스톤 디자인 과제로 초기 MVP를 제작했습니다. 이후
        &lsquo;모두의창업&rsquo;에 선정되어 공정 고도화용 기자재를 확충하고,
        엘리스토리커피에 초도 생두를 납품하며 첫 매출을 만들었습니다.
      </p>
      </div>
    </div>
  );
}

export default function Proof() {
  return (
    <section className="sec" id="proof">
      <div className="wrap">
        <Head
          title={
            <>
              라벨을 가리고 <b>20명에게 물었습니다</b>
            </>
          }
        />

        <div className="proof">
          <Rv>
            <Radar />
          </Rv>
          <Rv delay={100}>
            <Score />
          </Rv>
        </div>

        <div className="ph">
          <Rv as="figure" style={{ margin: 0 }}>
            <div className="ph__i">
              <img src="/img/test-room.webp" alt="커피 전공자들이 참여한 블라인드 테스트 현장" loading="lazy" />
            </div>
          </Rv>
          <Rv as="figure" style={{ margin: 0 }} delay={90}>
            <div className="ph__i">
              <img src="/img/cupping.webp" alt="번호로만 구분된 커핑 볼이 놓인 테이블" loading="lazy" />
            </div>
          </Rv>
        </div>

        <div className="hist">
          <div className="tl">
            <div className="tl__in">
              {TIMELINE.map((t) => (
                <div className={`tl__i ${t.done ? "done" : ""}`} key={t.q}>
                  <span className="tl__q">{t.q}</span>
                  <p className="tl__t">{t.t}</p>
                  {t.now ? <span className="tl__now">NOW</span> : null}
                </div>
              ))}
            </div>
          </div>
          <p className="tl__hint">← 좌우로 밀어서 전체 일정 보기</p>
        </div>
      </div>
    </section>
  );
}
