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

## 홈 화면 주소

홈은 온보딩이 아니어서 `/onboarding` 밖에 둡니다. 화면 연결은 `src/app/HomeFlow.jsx`에 있습니다.

| 화면 | 주소 | 파일 |
| --- | --- | --- |
| 09 본인 홈 | `/home` (05에서 "본인") | `pages/home/SelfHomePage.jsx` |
| 09 가족 홈 | `/home` (05에서 "가족 · 보호 대상자") | `pages/home/FamilyHomePage.jsx` |

- 홈도 로그인한 뒤에 보는 화면이라, 로그인 아이디가 없으면(새로고침, 주소 직접 입력) 02 로그인으로 이동합니다.
- 05 선택이 없으면 본인 홈을 보여 줍니다. 인사말 아이디는 로그인 아이디입니다.
- 08 "홈으로 이동"을 누르면 홈으로 가고, 홈에서 뒤로가기를 누르면 08로 돌아가지 않고 앱을 벗어납니다.
- 로그인 아이디와 05 선택은 `src/app/SessionContext.jsx`에 메모리로만 보관합니다(온보딩과 홈이 함께 사용).
- 가족 목록은 `src/features/family/familyProfiles.js`의 예시 데이터입니다. 서버 API가 생기면 `HomeFlow.jsx`에서 받아 넘깁니다.
- 오른쪽 위 알림 종을 누르면 알림 화면(`/notifications`)으로 갑니다. 누르는 영역은 44×44이고, 누르는 동안 종 뒤에 연회색 원이 보인 뒤 0.15초 후 이동합니다.
- 새 알림 점은 `src/app/NotificationContext.jsx`가 판단합니다(아래 "새 알림 점").
- 본인 홈의 "키링 관리" 카드를 누르면 키링 관리 화면(`/keyrings`)으로 갑니다(아래 "키링 관리 화면 주소").

### 개발용 확인 주소 (`npm run dev`에서만)

로그인 없이 홈을 바로 볼 수 있습니다. 배포용 빌드(`npm run build`)에서는 이 값이 무시되고 로그인 확인 규칙이 그대로 적용됩니다.

| 주소 | 화면 |
| --- | --- |
| `/home?preview=self` | 본인 홈 |
| `/home?preview=family` | 가족 홈 |
| `/home?notice=new` | 본인 홈 (`preview`와 함께 사용 가능, 예: `/home?preview=family&notice=new`). 점은 실제와 같은 규칙으로, 알림 화면을 보기 전까지 보입니다 |

- 개발용 주소로 들어온 홈에서 종을 누르면 알림 화면도 같은 대상으로 열립니다(`/notifications?preview=self|family`). 돌아오면 들어올 때와 같은 홈 주소입니다.
- 개발용 주소로 들어온 본인 홈에서 "키링 관리"를 누르면 `/keyrings?preview=self`로 열립니다.
- 점이 없는 홈(`09-home-*-read.png`)은 알림 화면을 한 번 열었다가 돌아오면 볼 수 있습니다. 새로고침하면 다시 "본 적 없음"이 됩니다.

## 알림 화면 주소

알림도 `/onboarding` 밖에 둡니다. 화면 연결은 `src/app/NotificationFlow.jsx`에 있습니다.

| 화면 | 주소 | 파일 |
| --- | --- | --- |
| 10 본인 알림 | `/notifications` (05에서 "본인") | `pages/notification/SelfNotificationPage.jsx` |
| 10 가족 알림 | `/notifications` (05에서 "가족 · 보호 대상자") | `pages/notification/FamilyNotificationPage.jsx` |

- 알림도 로그인한 뒤에 보는 화면이라, 로그인 아이디가 없으면(새로고침, 주소 직접 입력) 02 로그인으로 이동합니다.
- 05 선택이 없으면 본인 알림을 보여 줍니다(홈과 같은 규칙).
- 뒤로가기
  - 홈에서 종을 눌러 왔으면: 화살표와 휴대폰·브라우저 뒤로가기 모두 홈으로 돌아갑니다(한 칸 뒤로). 홈에서 다시 뒤로가기를 누르면 앱을 벗어납니다.
  - 주소를 직접 입력해 들어왔으면: 화살표는 홈으로 가며 기록을 바꿉니다(replace). 홈에서 뒤로가기를 누르면 앱을 벗어납니다. 휴대폰·브라우저 뒤로가기는 들어오기 전 페이지로 갑니다.
- 알림 목록은 `src/features/notification/notifications.js`의 예시 데이터입니다. "오늘/이전 알림" 묶음과 시간 표시("방금 전", "오전 9:12", "어제", "11월 10일")는 알림 시각으로 계산합니다(`notificationTime.js`). 알림 목록과 기준 시각은 `src/app/NotificationContext.jsx` 한 곳에서 홈과 알림 화면에 나눠 줍니다. 서버 API가 생기면 이 파일에서 받은 목록과 현재 시각으로 바꿉니다.
- "오늘" 알림이 없으면 "오늘 받은 알림이 없어요."를 보여 주고, "이전 알림"이 없으면 그 묶음을 숨깁니다(본인·가족 공통).

### 새 알림 점

- 홈 종의 파란 점은 "새 알림 있음"일 때 보입니다. 본인 사용자는 본인 알림, 가족 사용자는 가족 알림을 기준으로 합니다.
- 알림 화면을 한 번도 보지 않았으면, 알림이 있으니 "새 알림 있음"입니다(08 → 홈에서 점이 보임).
- 알림 화면을 열면 "마지막으로 본 시각"을 지금으로 바꿉니다. 그 뒤로는 그보다 늦은 알림이 있을 때만 "새 알림 있음"입니다.
- 본 시각은 본인·가족 따로, 메모리에만 보관합니다(새로고침하면 처음으로).
- 판단 규칙은 `src/features/notification/notificationStatus.js`에 있습니다.

### 가족별 필터 (가족 알림)

- "오늘", "이전 알림" 제목 오른쪽에 "전체" + 가족 이름 칩이 있고, 처음에는 "전체"가 선택돼 있습니다.
- 두 묶음의 필터는 따로 움직입니다.
- 칩에는 그 묶음에 알림이 있는 가족만 나옵니다. 이름과 순서는 가족 홈과 같은 가족 목록(`src/features/family/familyProfiles.js`)을 따릅니다.
- 규칙은 `src/features/notification/familyFilter.js`에 있습니다.

### 테스트 실행

새 라이브러리 없이 Node에 들어 있는 테스트 기능(`node --test`)으로 실행합니다. Node 버전은 `package.json`의 `engines`(20.19 이상)를 따릅니다.

```sh
node --test src/features/notification/*.test.js
```

- `notificationTime.test.js`: 오늘/이전 묶기, 시간 표시
- `familyFilter.test.js`: 칩 목록(알림 없는 가족 제외, 가족 목록 순서), 가족별 거르기
- `notificationStatus.test.js`: 새 알림 있음/없음 (처음엔 있음, 본 뒤엔 없음, 더 새 알림이 오면 다시 있음)

### 개발용 확인 주소 (`npm run dev`에서만)

로그인 없이 알림 화면을 바로 볼 수 있습니다. 배포용 빌드에서는 무시되고 로그인 확인 규칙이 그대로 적용됩니다.

| 주소 | 화면 |
| --- | --- |
| `/notifications?preview=self` | 본인 알림 (직접 들어왔을 때 화살표 → `/home?preview=self`) |
| `/notifications?preview=family` | 가족 알림 (직접 들어왔을 때 화살표 → `/home?preview=family`) |

## 키링 관리 화면 주소

키링 관리도 `/onboarding` 밖에 둡니다. 화면 연결은 `src/app/KeyringFlow.jsx`에 있습니다.

| 화면 | 주소 | 파일 |
| --- | --- | --- |
| 11 본인 키링 관리 | `/keyrings` | `pages/keyring/SelfKeyringPage.jsx` |
| 11 가족 키링 관리 | `/keyrings/family/:familyId` (예: `/keyrings/family/mother`) | `pages/keyring/FamilyKeyringPage.jsx` |
| 새 키링 발급 (팀원 화면, #6) | `/keyrings/issuance` | `pages/KeyringIssuancePage.jsx` |
| 키링 분실 (팀원 화면, #4) | `/keyrings/lost` | `pages/KeyringLostPage.jsx` |

- 키링 관리도 로그인한 뒤에 보는 화면이라, 로그인 아이디가 없으면(새로고침, 주소 직접 입력) 02 로그인으로 이동합니다.
- 제목 아이디는 로그인 아이디입니다.
- 키링 ID와 등록 일시는 07에서 입력한 코드와 "다음"을 누른 시각입니다. `src/app/SessionContext.jsx`의 `keyring`에 메모리로만 보관합니다(08과 키링 관리가 함께 사용).
  - 본인 사용자일 때만 07 정보를 보여 줍니다. 07 정보가 없거나 05에서 "가족 · 보호 대상자"를 골랐으면 08과 같은 기본값(AB1234, 2026년 11월 3일 15시 29분)을 보여 줍니다.
- 키링 정보 카드는 08과 같은 부품(`components/keyring/KeyringInfoCard.jsx`)입니다. 크기만 다릅니다(08: 높이 171, 원 115 / 키링 관리: 높이 176, 원 120).
- 본인과 가족 키링 관리는 같은 틀(`components/keyring/KeyringManageLayout.jsx`)을 씁니다. 가족은 제목("어머니의 키링"), 정보 카드의 가족 사진(원 가운데, 가로 120.73), 키링 정보만 다릅니다.
- "새 키링 연결하기"를 누르면 새 키링 발급 화면으로, "키링을 분실하셨나요?"를 누르면 키링 분실 화면으로 갑니다. 두 화면에서 뒤로 가면 키링 관리로 돌아옵니다.
- 뒤로가기
  - 홈에서 "키링 관리" 카드를 눌러 왔으면: 화살표와 휴대폰·브라우저 뒤로가기 모두 홈으로 돌아갑니다(한 칸 뒤로). 홈에서 다시 뒤로가기를 누르면 앱을 벗어납니다.
  - 주소를 직접 입력해 들어왔으면: 화살표는 홈으로 가며 기록을 바꿉니다(replace). 홈에서 뒤로가기를 누르면 앱을 벗어납니다.

### 가족 키링 관리

- 가족 이름, 사진, 키링 정보는 `src/features/family/familyProfiles.js`(가족 홈과 같은 목록)의 `name`, `avatar`, `keyring`입니다. 등록 대기 가족은 `keyring: null`입니다.
- 없는 `familyId`이거나 키링이 없는(등록 대기) 가족이면 홈으로 이동합니다(replace). 판단은 `src/features/family/familyKeyring.js`에 있습니다.
- 뒤로가기: 앱 안에서 왔으면 화살표와 휴대폰·브라우저 뒤로가기 모두 한 칸 뒤로 갑니다. 주소를 직접 입력해 들어왔으면 화살표는 홈으로 가며 기록을 바꿉니다(replace).
- 05 선택과 상관없이 열립니다(가족 목록이 지금은 예시 데이터라서 본인 사용자도 막지 않음).
- 이 화면으로 들어오는 가족 프로필 상세 화면은 아직 없습니다. 연결할 때는 `src/app/paths.js`의 `familyKeyringPath(familyId)`로 주소를 만듭니다.

테스트(새 라이브러리 없이 `node --test`):

```sh
node --test src/features/family/*.test.js
```

- `familyKeyring.test.js`: 키링 있는 가족 찾기 (있음 / 등록 대기 / 없는 id)

### 개발용 확인 주소 (`npm run dev`에서만)

로그인 없이 키링 관리 화면을 바로 볼 수 있습니다. 배포용 빌드에서는 무시되고 로그인 확인 규칙이 그대로 적용됩니다.

| 주소 | 화면 |
| --- | --- |
| `/keyrings?preview=self` | 본인 키링 관리, 기본값 표시 (직접 들어왔을 때 화살표 → `/home?preview=self`) |
| `/keyrings/family/mother?preview=family` | 어머니 키링 관리 (직접 들어왔을 때 화살표 → `/home?preview=family`) |
| `/keyrings/family/grandmother?preview=family` | 키링 없는 가족 → `/home?preview=family` |
