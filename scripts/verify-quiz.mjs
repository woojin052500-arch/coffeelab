/* 1,024가지(2^10) 응답 조합을 전수 계산해 결과 분포를 확인한다.
   실행: node scripts/verify-quiz.mjs */
import { calculateCoffeeMatch, QUESTIONS, TYPES, PROCESSINGS, VARIETIES } from "../lib/quiz.js";

const n = QUESTIONS.length;
const total = 2 ** n;
const byType = {}, byProc = {}, byVar = {}, byOrigin = {};
let minAcid = 9, maxAcid = -9, minBody = 9, maxBody = -9;

for (let m = 0; m < total; m++) {
  const ans = Array.from({ length: n }, (_, i) => (m >> i) & 1);
  const r = calculateCoffeeMatch(ans);
  byType[r.type.name] = (byType[r.type.name] || 0) + 1;
  byOrigin[r.origin] = (byOrigin[r.origin] || 0) + 1;
  byProc[r.processing] = (byProc[r.processing] || 0) + 1;
  byVar[r.variety] = (byVar[r.variety] || 0) + 1;
  minAcid = Math.min(minAcid, r.score.acid); maxAcid = Math.max(maxAcid, r.score.acid);
  minBody = Math.min(minBody, r.score.body); maxBody = Math.max(maxBody, r.score.body);
  r.meters.forEach((x) => { if (x.v < 0 || x.v > 100) throw new Error("meter out of range " + x.v); });
}

const pct = (v) => ((v / total) * 100).toFixed(1).padStart(5) + "%";
const table = (title, bag, expected) => {
  console.log("\n" + title);
  const keys = Object.keys(bag).sort((a, b) => bag[b] - bag[a]);
  keys.forEach((k) => console.log("  " + k.padEnd(22) + String(bag[k]).padStart(5) + "  " + pct(bag[k])));
  const missing = expected.filter((e) => !(e in bag));
  if (missing.length) console.log("  ⚠ 미출현: " + missing.join(", "));
};

console.log(`총 조합 ${total} · acid ${minAcid}~${maxAcid} · body ${minBody}~${maxBody}`);
table("유형", byType, Object.values(TYPES).map((t) => t.name));
table("산지", byOrigin, Object.values(TYPES).map((t) => t.origin));
table("가공방식", byProc, PROCESSINGS);
table("품종", byVar, VARIETIES);
