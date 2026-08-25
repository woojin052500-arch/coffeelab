# 퍼먼트 커피랩 (Ferment Coffee Lab)

지역 특산물 발효 기반 생두 향미 재설계·표준화 기술 브랜드 소개 사이트.
Next.js 16 (App Router) + React 19 반응형 인터랙티브 원페이지.

## 실행

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

## 배포

Vercel에 그대로 올리면 됩니다. 정적 호스팅이 필요하면 `next.config.mjs`에
`output: "export"`를 추가하고 빌드 후 생성되는 `out/` 폴더를 올리세요.

## 특징

- **문서 이미지 없음.** 원본 HWP의 표·인포그래픽(공정도, 밸류체인, 시장 규모,
  TAM/SAM/SOM, 관능 레이더, 로드맵)은 전부 HTML·SVG로 다시 그렸습니다.
  사진(실험실, 과실, 패키지, 블라인드 테스트)만 원본에서 크롭해 webp로 씁니다.
- **자체 호스팅 폰트.** IBM Plex Sans KR / IBM Plex Mono를 `public/fonts`에
  포함했습니다. 외부 CDN 의존이 없어 어디에 올려도 글꼴이 깨지지 않습니다.
- **인터랙션.** 발효 공정 6단계 스테퍼, 향미 설계 시뮬레이터(슬라이더 3종),
  향미 라인업 탭, 스크롤 등장, 카운트업, 차트 애니메이션, 스크롤 진행바,
  현재 섹션 표시 내비, 모바일 드로어.
- **모바일.** 360 / 390 / 820 / 1440px에서 가로 스크롤 0 확인.
  터치 타깃 40px 이상, 타임라인은 가로 스와이프, 폭 좁을 때 그리드 재배치.

## 구조

```
app/
  layout.jsx      메타데이터 · 폰트 preload
  page.jsx        섹션 조립
  globals.css     디자인 시스템 전체 (@font-face · 토큰 · 컴포넌트 · 반응형)
components/
  util.jsx        useInView 훅, Rv(스크롤 등장), Head(섹션 헤더)
  Header.jsx      고정 헤더 · 진행바 · 현재 섹션 · 모바일 드로어
  Hero.jsx        히어로 · 발효 프로파일 SVG 차트 · 카운트업 지표
  Brand.jsx       01 브랜드
  Why.jsx         02 문제/해법 · 시장 규모 바차트 · TAM 원형도
  Process.jsx     03 발효 공정 6단계 스테퍼
  Design.jsx      04 향미 설계 시뮬레이터
  Flavor.jsx      05 향미 라인업 탭
  Local.jsx       06 지역 상생 밸류체인
  Products.jsx    07 제품 · 지역 에디션 · 비즈니스 모델
  Proof.jsx       08 검증 (관능 레이더 SVG · 13/20 도트 · 현장 사진)
  Roadmap.jsx     09 타임라인 · 3단계 페이즈
  Contact.jsx     10 문의
lib/content.js    사이트 문구·수치 데이터 (여기만 고치면 내용이 바뀝니다)
public/img/       원본 HWP에서 추출·크롭·webp 변환한 사진
public/fonts/     IBM Plex Sans KR / Mono woff2
```

## 수정 가이드

- 문구·수치: `lib/content.js`
- 색·타이포·간격: `app/globals.css` 상단 `:root` 토큰
  - `--ink` 먹색, `--panel` 웜 그레이 패널, `--line` 헤어라인
  - `--berry` `--grape` `--apple` `--citrus` 는 차트·미터 전용 데이터 컬러
- 시뮬레이터 계산식: `components/Design.jsx` 상단 (개념 데모용 근사식)

## 확인 필요

`components/Contact.jsx`의 이메일 `hello@fermentcoffeelab.kr`은 예시입니다.
실제 연락처로 교체해 주세요.

## 출처

사진·수치는 제공된 HWP 문서(퍼먼트 커피랩 소개서, PSSD 사업계획서)에서
가져왔습니다. 시장 규모는 credence research 인용분입니다.
