"use client";

import { useEffect, useState } from "react";
import { FLAVORS } from "@/lib/content";
import { Head, Rv, useInView } from "./util";

export default function Flavor() {
  const [i, setI] = useState(0);
  const f = FLAVORS[i];
  const [box, seen] = useInView(0.25);
  const [fill, setFill] = useState(false);

  useEffect(() => {
    if (!seen) return;
    setFill(false);
    const t = setTimeout(() => setFill(true), 60);
    return () => clearTimeout(t);
  }, [seen, i]);

  return (
    <section className="sec sec--panel" id="flavor">
      <div className="wrap">
        <Head
          ix="05 / 라인업"
          title={
            <>
              과일이 바뀌면 <b>커피가 바뀝니다</b>
            </>
          }
          desc="인위적인 가향으로는 흉내 낼 수 없는 결. 각 라인은 지역 농가의 비규격 과실과 그에 맞는 효모를 짝지어 만들어집니다."
        />

        <div className="tabs" role="tablist" aria-label="향미 라인업">
          {FLAVORS.map((x, n) => (
            <button
              key={x.key}
              type="button"
              role="tab"
              aria-selected={n === i}
              className={`tab ${n === i ? "on" : ""}`}
              onClick={() => setI(n)}
            >
              {x.ko} · {x.en}
            </button>
          ))}
        </div>

        <div className="fl" ref={box}>
          <figure className="fl__fig">
            <img key={f.key} src={f.img} alt={`${f.ko} 발효 원두`} loading="lazy" />
          </figure>

          <div>
            <p className="fl__en">
              {f.en} — {f.tag}
            </p>
            <h3 className="fl__ko">{f.ko} 발효 원두</h3>
            <p className="fl__d">{f.d}</p>

            <div className="mt" style={{ marginTop: 22 }}>
              {f.m.map(([k, v]) => (
                <div className="mt__r" key={k}>
                  <span className="mt__k">{k}</span>
                  <span className="mt__b">
                    <span
                      className="mt__f"
                      style={{ width: fill ? `${v}%` : 0, "--c": f.color }}
                    />
                  </span>
                  <span className="mt__v">{v}</span>
                </div>
              ))}
            </div>

            <div className="fl__pair">
              <div>
                <span className="lbl">산지</span>
                <p>{f.region}</p>
              </div>
              <div>
                <span className="lbl">효모</span>
                <p>{f.yeast}</p>
              </div>
              <div>
                <span className="lbl">권장</span>
                <p>{f.key === "apple" ? "콜드브루 · 아이스" : "핸드드립 · 드립백"}</p>
              </div>
            </div>
          </div>
        </div>

        <Rv style={{ marginTop: "clamp(26px,3.4vw,44px)" }}>
          <p className="lbl">
            시즌 한정 — 제주 감귤, 원주 복숭아 라인은 수확기에 맞춰 운영합니다.
          </p>
        </Rv>
      </div>
    </section>
  );
}
