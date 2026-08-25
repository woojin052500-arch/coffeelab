import { Rv } from "./util";

export default function Brand() {
  return (
    <section className="sec sec--panel" id="brand">
      <div className="wrap">
        <div className="head">
          <Rv className="head__ix" as="p">
            01 / 브랜드
          </Rv>
          <Rv delay={60}>
            <p className="quote">
              한국은 커피를 잘 마시는 나라가 되었지만,
              <br />
              맛을 <em>설계하는 공정</em>은 아직 해외에 있습니다.
            </p>
          </Rv>
        </div>

        <div className="mani">
          <Rv delay={100}>
            <p>
              커피 향미를 결정하는 핵심은 로스팅이 아니라 그 앞 단계인{" "}
              <b>생두 발효</b>입니다. 국내 브랜드는 이미 가공이 끝난 원료를
              들여와 로스팅과 블렌딩만 조정할 수 있었고, 이는 제품 차별화와 맛의
              근본 설계에서 분명한 한계로 작용했습니다.
            </p>
            <p>
              한편 국내 농가에서는 맛과 향이 뛰어난데도 규격과 외관 문제로
              버려지는 비규격 농산물이 매년 막대하게 발생합니다. 저희는 이
              &lsquo;못난이 과일&rsquo;이 가진 발효 미생물과 천연 당분에
              주목했습니다.
            </p>
          </Rv>
          <Rv delay={180}>
            <p>
              지역 특산물을 커피 생두 가공 공정에 들여오면, 농가의 폐기 자원이
              고부가가치 소재로 바뀌는 동시에 커피에 지역 고유의 이야기가
              새겨집니다.
            </p>
            <p>
              퍼먼트 커피랩은 단순한 향 첨가를 넘어, 생두 단계에서 향미 구조
              자체를 다시 설계하고 그 조건을 <b>표준 공정으로 고정</b>하는 기술형
              브랜드입니다.
            </p>
          </Rv>
        </div>
      </div>
    </section>
  );
}
