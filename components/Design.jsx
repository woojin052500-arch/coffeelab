"use client";

import { useMemo, useState } from "react";
import { SIM_FRUITS } from "@/lib/content";
import { Head, Rv } from "./util";

const bell = (x, c, w = 0.09) => Math.exp(-((x - c) ** 2) / (2 * w));
const clamp = (v) => Math.max(24, Math.min(99, Math.round(v)));

function Slider({ label, unit, min, max, step = 1, value, onChange }) {
  return (
    <div>
      <div className="sl__hd">
        <span className="lbl">{label}</span>
        <span className="sl__v">
          {value}
          {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={label}
      />
      <div className="sl__sc">
        <span>
          {min}
          {unit}
        </span>
        <span>
          {max}
          {unit}
        </span>
      </div>
    </div>
  );
}

export default function Design() {
  const [fi, setFi] = useState(0);
  const [temp, setTemp] = useState(26);
  const [time, setTime] = useState(48);
  const [brix, setBrix] = useState(15);

  const fruit = SIM_FRUITS[fi];

  const { m, note, sub } = useMemo(() => {
    const tN = (temp - 18) / 14;
    const hN = (time - 12) / 60;
    const bN = (brix - 8) / 12;
    const [a0, c0, b0, f0] = fruit.base;

    const aroma = clamp(a0 - 26 + 24 * bell(hN, 0.62) + 14 * bN);
    const acidity = clamp(c0 - 20 + 20 * (1 - tN) + 10 * bell(hN, 0.45));
    const body = clamp(b0 - 12 + 16 * tN + 16 * hN);
    const finish = clamp(f0 - 14 + 16 * bN + 12 * bell(tN, 0.5, 0.12));

    const tags = [];
    if (acidity >= 82) tags.push("선명한 산미");
    else if (acidity <= 55) tags.push("둥근 산미");
    if (body >= 78) tags.push("묵직한 바디");
    else if (body <= 52) tags.push("가벼운 바디");
    if (aroma >= 85) tags.push("향이 앞서는 컵");
    if (finish >= 82) tags.push("긴 여운");
    if (!tags.length) tags.push("균형 잡힌 컵");

    const idx = bN > 0.66 ? 1 : bN > 0.33 ? 0 : 2;

    return {
      m: [
        ["Aroma", aroma],
        ["Acidity", acidity],
        ["Body", body],
        ["Finish", finish],
      ],
      note: `${fruit.note[idx]}, ${fruit.note[(idx + 1) % 3]}`,
      sub: tags.join(" · "),
    };
  }, [fruit, temp, time, brix]);

  return (
    <section className="sec" id="design">
      <div className="wrap">
        <Head
          title={
            <>
              조건을 바꾸면 <b>컵이 바뀝니다</b>
            </>
          }
          desc="같은 생두라도 어떤 과실을 쓰고 몇 도에서 몇 시간을 두느냐에 따라 다른 컵이 나옵니다. 실제 설계 시트가 다루는 변수를 직접 움직여 보세요."
        />

        <Rv className="sim">
          <div className="sim__ctl">
            <div>
              <p className="lbl" style={{ marginBottom: 12 }}>
                지역 과실
              </p>
              <div className="sim__fruit">
                {SIM_FRUITS.map((f, i) => (
                  <button
                    key={f.key}
                    type="button"
                    className={i === fi ? "on" : ""}
                    onClick={() => setFi(i)}
                    aria-pressed={i === fi}
                  >
                    {f.ko}
                  </button>
                ))}
              </div>
            </div>

            <Slider label="발효 온도" unit="°C" min={18} max={32} value={temp} onChange={setTemp} />
            <Slider label="발효 시간" unit="h" min={12} max={72} step={2} value={time} onChange={setTime} />
            <Slider label="과실 당도" unit=" Brix" min={8} max={20} value={brix} onChange={setBrix} />
          </div>

          <div className="sim__out">
            <p className="lbl">예상 향미 노트</p>
            <p className="sim__note" style={{ marginTop: 10 }}>
              {note}
            </p>
            <p className="sim__sub">{sub}</p>

            <div className="mt">
              {m.map(([k, v]) => (
                <div className="mt__r" key={k}>
                  <span className="mt__k">{k}</span>
                  <span className="mt__b">
                    <span className="mt__f" style={{ width: `${v}%`, "--c": fruit.color }} />
                  </span>
                  <span className="mt__v">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </Rv>
      </div>
    </section>
  );
}
