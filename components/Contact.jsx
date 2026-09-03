import { BG, COMPANY } from "@/lib/content";
import { Head, Rv } from "./util";

export default function Contact() {
  const c = COMPANY;
  return (
    <section
      className="cta sec--photo"
      id="contact"
      style={{ "--bgimg": `url(${BG.contact})` }}
    >
      <div className="wrap">
        <Head
          k="문의"
          title="시그니처가 필요한 카페와 함께합니다"
          desc="차별화된 메뉴를 구성하려는 로스터리·베이커리·개인 카페를 위한 B2B 발효 원두 공급과 향미 컨설팅. 지역 농가·지자체 협업 문의도 환영합니다."
        />

        <Rv className="card">
          <div>
            <p className="card__en">{c.en}</p>
            <p className="card__brand">{c.name}</p>

            <div className="card__who">
              <p className="card__name">{c.ceo}</p>
              <p className="card__role">{c.role}</p>
            </div>

            <p className="card__tag">{c.biz}</p>
          </div>

          <div>
            <div className="card__rows">
              <div className="card__row">
                <span className="card__k">전화</span>
                <span className="card__v">
                  <a href={`tel:${c.telRaw}`}>{c.tel}</a>
                </span>
              </div>
              <div className="card__row">
                <span className="card__k">이메일</span>
                <span className="card__v">
                  <a href={`mailto:${c.email}`}>{c.email}</a>
                </span>
              </div>
              <div className="card__row">
                <span className="card__k">소재지</span>
                <span className="card__v">{c.area}</span>
              </div>
              <div className="card__row">
                <span className="card__k">사업 분야</span>
                <span className="card__v" style={{ fontWeight: 500, fontSize: 15 }}>
                  B2B 발효 원두 납품 · 로컬 카페 컨설팅 · B2C 패키지
                </span>
              </div>
            </div>

            <div className="card__act">
              <a href={`tel:${c.telRaw}`} className="btn btn--red">
                전화 문의
              </a>
              <a href={`mailto:${c.email}`} className="btn">
                이메일 보내기
                <i className="btn__plus" aria-hidden="true" />
              </a>
            </div>
          </div>
        </Rv>
      </div>
    </section>
  );
}
