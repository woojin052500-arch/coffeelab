import { Head, Rv } from "./util";
import TestButton from "./TestLauncher";
import { ORIGINS, PROCESSINGS, VARIETIES, TYPES } from "@/lib/quiz";

const CHIPS = [
  { k: "산지", v: ORIGINS.length, l: ORIGINS.join(" · ") },
  { k: "가공방식", v: PROCESSINGS.length, l: "내추럴 · 워시드 · 허니 · 무산소 발효" },
  { k: "품종", v: VARIETIES.length, l: "게이샤 · 티피카 · 버번 · 카투라 · 켄트 · SL28/34 · 카투아이 · 자바" },
];

/* 과실 컷아웃이 있는 세 유형만 미리보기로 건다 — 상자 사진과 섞이지 않게 */
const CARDS = ["kenya", "panama", "ethiopia"].map((k) => TYPES[k]);

export default function Taste() {
  return (
    <section className="sec taste" id="taste">
      <div className="wrap">
        <Head
          title={
            <>
              내 취향의 커피는 <b>어떤 얼굴일까</b>
            </>
          }
          desc="10개 문항이면 됩니다. 산미·바디감·단맛·개성 네 축으로 취향을 읽고 6개 산지, 4가지 가공방식, 8개 품종의 조합에서 가장 가까운 한 잔을 찾아드립니다."
        />

        <Rv className="taste__go">
          <TestButton className="btn btn--red taste__btn">
            커피 취향 테스트 시작하기
            <i className="btn__plus" aria-hidden="true" />
          </TestButton>
          <p className="taste__note">1분 · 브라우저에서만 계산되며 응답은 저장되지 않습니다</p>
        </Rv>

        <div className="tcards">
          {CARDS.map((t, i) => (
            <Rv className="tcard" key={t.id} delay={i * 80} style={{ "--c": t.color }}>
              <div className="tcard__f">
                <img src={t.img} alt="" aria-hidden="true" loading="lazy" />
              </div>
              <p className="tcard__k">{t.origin}</p>
              <h3 className="tcard__t">{t.name}</h3>
              <p className="tcard__d">{t.line}</p>
              <ul className="tcard__n">
                {t.notes.slice(0, 3).map((n) => (
                  <li key={n}>{n}</li>
                ))}
              </ul>
            </Rv>
          ))}
        </div>

        <dl className="tchips">
          {CHIPS.map((c) => (
            <div key={c.k}>
              <dt>
                {c.k} <b>{c.v}</b>
              </dt>
              <dd>{c.l}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
