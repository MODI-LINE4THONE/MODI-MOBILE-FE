# MODI 사용자 모바일 웹

MODI는 사용자가 정한 접근성 설정에 맞게 키오스크 화면을 바꿔 주는 서비스입니다.
이 저장소는 사용자가 휴대폰에서 회원가입, 접근성 프로필 설정, NFC 키링 등록을 하는 모바일 웹입니다.
React, Vite, JavaScript, styled-components로 만들었습니다.
키오스크 화면(데모 웹)은 다른 저장소에서 따로 관리합니다.

## 실행

```sh
npm install
npm run dev
```

`npm run build`로 배포용 파일을 만들고 `npm run preview`로 확인합니다.

## 폴더 구조

| 경로 | 용도 |
| --- | --- |
| `public/` | 그대로 제공하는 정적 파일 |
| `src/app/` | 앱 전역 구성 |
| `src/assets/` | 이미지, 아이콘, 폰트 |
| `src/components/common/` | 공통 UI |
| `src/components/onboarding/` | 온보딩 전용 UI |
| `src/features/personalization/` | 접근성 개인화 |
| `src/pages/` | 화면 단위 구성 |
| `src/styles/` | 공통 스타일 |
| `src/hooks/`, `src/utils/` | 공통 훅과 유틸리티 |

`src/main.jsx`에서 React 앱을 시작하고 `src/App.jsx`에서 화면 주소(react-router)를 연결합니다.

## 접근성 설정 화면

- `/accessibility`: 추천 조합 3종 선택, 직접 설정 옵션 4개, 저장 완료 팝업.
- 추천/직접 설정 탭은 방향키 및 Home/End로 전환할 수 있습니다.
- 현재는 API 연동 전 UI 구현으로, 설정은 이 브라우저의 localStorage에만 저장됩니다.
- 추천 조합과 개별 옵션의 서버 매핑은 아직 확정하지 않았으며 별도로 보관합니다.
- 홈 화면 진입 버튼 및 서버 API 연동은 후속 작업입니다.
- 뒤로가기는 이전 화면으로 이동하며, 주소 직접 진입 시 온보딩으로 이동합니다.

## 온보딩 화면 주소

온보딩 화면은 앞으로 추가될 홈 등 다른 화면과 겹치지 않도록 `/onboarding/...` 아래에 둡니다. 화면 이동 규칙은 `src/app/OnboardingFlow.jsx` 한 파일에 모여 있습니다.

| 화면 | 주소 | 파일 |
| --- | --- | --- |
| 01 스플래시 | `/onboarding` | `SplashPage.jsx` |
| 02 로그인 | `/onboarding/login` | `LoginPage.jsx` |
| 03 회원가입 | `/onboarding/signup` | `SignupPage.jsx` |
| 04 시작하기 | `/onboarding/start` | `StartPage.jsx` |
| 05 접근성 프로필 설정 | `/onboarding/profile` | `ProfileSetupPage.jsx` |
| 06 NFC 키링 등록 방법 | `/onboarding/nfc/guide` | `NfcGuidePage.jsx` |
| 07 NFC 키링 등록 코드 입력 | `/onboarding/nfc/code` | `NfcCodePage.jsx` |
| 08 NFC 키링 등록 완료 | `/onboarding/nfc/complete` | `NfcCompletePage.jsx` |

- `/`로 들어오면 `/onboarding`(01 스플래시)으로 이동합니다.
- 04~08은 로그인한 뒤에 보는 화면이라, 로그인 아이디가 없으면(새로고침, 주소 직접 입력) 02 로그인으로 이동합니다.
- 08은 07에서 입력한 코드와 시각이 없으면 07로 이동합니다.
- 배포할 때는 서버가 모든 주소에 `index.html`을 돌려주도록(SPA fallback) 설정해야 `/onboarding/start` 같은 주소에서 새로고침해도 화면이 열립니다.
