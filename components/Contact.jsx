import { Head, Rv } from "./util";

export default function Contact() {
  return (
    <section className="cta" id="contact">
      <div className="wrap">
        <Head
          ix="10 / 문의"
          title={
            <>
              시그니처가 필요한 <b>카페와 함께합니다</b>
            </>
          }
          desc="차별화된 메뉴를 구성하려는 로스터리·베이커리·개인 카페를 위한 B2B 발효 원두 공급과 향미 컨설팅. 지역 농가·지자체 협업 문의도 환영합니다."
        />

        <div className="cta__g">
          <Rv>
            <p className="cta__k">B2B 원두 납품</p>
            <p className="cta__v">
              샘플 로트 · 향미 프로파일 시트 제공
              <br />
              최소 물량 협의 가능
            </p>
          </Rv>
          <Rv delay={80}>
            <p className="cta__k">협업 · 제휴</p>
            <p className="cta__v">
              지역 농가 비규격 농산물 매입
              <br />
              지자체 · 관광 상품 공동 기획
            </p>
          </Rv>
          <Rv delay={160}>
            <p className="cta__k">연락처</p>
            <p className="cta__v">
              <a href="mailto:hello@fermentcoffeelab.kr">hello@fermentcoffeelab.kr</a>
              <br />
              강원도 · Ferment Coffee Lab
            </p>
          </Rv>
        </div>
      </div>
    </section>
  );
}
