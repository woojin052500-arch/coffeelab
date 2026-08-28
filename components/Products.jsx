import { EDITIONS, PRODUCTS } from "@/lib/content";
import { Head, Rv } from "./util";

export default function Products() {
  return (
    <section className="sec sec--w" id="product">
      <div className="wrap">
        <Head
          title={
            <>
              하나의 레시피, <b>네 가지 형태</b>
            </>
          }
          desc="표준 공정이 있으면 제품은 확장됩니다. 카페 납품용 원두부터 관광 상품과 명절 선물 세트까지, 같은 향미를 다른 그릇에 담습니다."
        />

        <div className="pr">
          {PRODUCTS.map((p, i) => (
            <Rv className="pr__i" key={p.n} delay={i * 70}>
              <h3 className="pr__t">{p.t}</h3>
              <p className="pr__d">{p.d}</p>
            </Rv>
          ))}
        </div>

        <div className="eds">
          {EDITIONS.map((e, i) => (
            <Rv className="ed" key={e.t} delay={i * 90}>
              <div className="ed__f">
                <img src={e.img} alt={`${e.t} 패키지`} loading="lazy" className="photo" />
              </div>
              <div className="ed__b">
                <h3 className="ed__t">{e.t}</h3>
              </div>
              <p className="ed__d">{e.d}</p>
            </Rv>
          ))}
        </div>

      </div>
    </section>
  );
}
