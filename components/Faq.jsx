import { FAQ } from "@/lib/content";
import { Head, Rv } from "./util";

/* 검색엔진과 생성형 검색(AI)이 그대로 인용할 수 있도록, 답변 한 문단이
   질문 하나에 대해 독립적으로 완결되게 썼다. 같은 내용이 FAQPage 구조화
   데이터로도 나간다(app/Schema.jsx). */
export default function Faq() {
  return (
    <section className="sec sec--soft" id="faq">
      <div className="wrap">
        <Head
          title="자주 묻는 질문"
          desc="발효 커피와 가향 커피의 차이, 무산소 발효 공정, 원두 납품 문의까지 가장 많이 받는 질문을 모았습니다."
        />

        <div className="faq">
          {FAQ.map((f, i) => (
            <Rv as="details" className="faq__i" key={f.q} delay={i * 40} open={i === 0}>
              <summary>
                <span>{f.q}</span>
                <i aria-hidden="true" />
              </summary>
              <p>{f.a}</p>
            </Rv>
          ))}
        </div>
      </div>
    </section>
  );
}
