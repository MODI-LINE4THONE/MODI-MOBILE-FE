# MODI 키오스크

React, Vite, JavaScript, styled-components 기반 키오스크 프론트엔드입니다.

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
| `src/components/kiosk/` | 키오스크 전용 UI |
| `src/components/onboarding/` | 온보딩 전용 UI |
| `src/features/personalization/` | 접근성 개인화 |
| `src/pages/` | 화면 단위 구성 |
| `src/styles/` | 공통 스타일 |
| `src/hooks/`, `src/utils/` | 공통 훅과 유틸리티 |

`src/main.jsx`에서 React 앱을 시작하고 `src/App.jsx`에서 구동 확인용 제목을 표시합니다.
