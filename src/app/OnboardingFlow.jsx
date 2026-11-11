import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import useBrowserBack from '../hooks/useBrowserBack'
import SplashPage from '../pages/onboarding/SplashPage'
import LoginPage from '../pages/onboarding/LoginPage'
import SignupPage from '../pages/onboarding/SignupPage'
import HomePage from '../pages/onboarding/HomePage'
import ProfileSetupPage from '../pages/onboarding/ProfileSetupPage'
import NfcGuidePage from '../pages/onboarding/NfcGuidePage'
import NfcCodePage from '../pages/onboarding/NfcCodePage'
import NfcCompletePage from '../pages/onboarding/NfcCompletePage'

// ─────────────────────────────────────────────────────────────
// 온보딩 화면 01~08 연결 (화면 이동 라이브러리 없이)
//
// 화면 이동 규칙은 모두 이 파일에 있다.
//   - SCREENS: 화면 목록, 브라우저 탭 제목, 뒤로가기(화살표·휴대폰·브라우저) 규칙
//   - renderScreen(): 화면마다 버튼을 누르면 어디로 가는지
// 각 화면은 어디로 가는지 모르고 onNext, onBack 같은 신호만 보낸다.
// ─────────────────────────────────────────────────────────────

// back: 뒤로가기 화살표 + 휴대폰·브라우저 뒤로가기를 누르면 갈 화면 (null: 화살표 없음 → 앱을 벗어남)
const SCREENS = {
  splash: { title: 'MODI', back: null }, // 01
  login: { title: '로그인', back: null }, // 02
  signup: { title: '회원가입', back: 'login' }, // 03
  home: { title: '홈', back: null }, // 04
  profile: { title: '접근성 프로필 설정', back: 'home' }, // 05
  nfcGuide: { title: 'NFC 키링 등록 방법', back: 'home' }, // 06
  nfcCode: { title: 'NFC 키링 등록 코드 입력', back: 'home' }, // 07
  nfcComplete: { title: 'NFC 키링 등록 완료', back: 'home' }, // 08
}

const FIRST_SCREEN = 'splash'

// 화면이 바뀌면 키보드 위치(포커스)를 받는 칸. 모양은 없다.
const ScreenFocus = styled.div`
  outline: none;
`

export default function OnboardingFlow() {
  const [screen, setScreen] = useState(FIRST_SCREEN)

  // 화면 사이에 넘기는 정보
  const [userId, setUserId] = useState(null) // 02 로그인 아이디 → 04 인사말
  const [profile, setProfile] = useState({ target: null, nickname: '' }) // 05 선택 기억
  const [nfcGuideFrom, setNfcGuideFrom] = useState('home') // 06에 들어온 화면 ('home' | 'profile')
  const [nfcResult, setNfcResult] = useState(null) // 07 → 08 { keyringId, registeredAt }

  const go = useCallback((next) => setScreen(next), [])
  const backTarget = SCREENS[screen].back
  const goBack = backTarget ? () => go(backTarget) : null

  // 휴대폰·브라우저 뒤로가기 = 화면의 뒤로가기 화살표
  useBrowserBack(goBack)

  // 화면이 바뀌면: 탭 제목 변경, 맨 위로 스크롤, 화면 읽기 프로그램이 새 화면 처음부터 읽도록 포커스 이동
  const focusRef = useRef(null)
  const isFirstRender = useRef(true)
  useLayoutEffect(() => {
    const { title } = SCREENS[screen]
    document.title = title === 'MODI' ? title : `${title} - MODI`
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    window.scrollTo(0, 0)
    focusRef.current?.focus({ preventScroll: true })
  }, [screen])

  const finishSplash = useCallback(() => go('login'), [go])

  const renderScreen = () => {
    switch (screen) {
      // 01 스플래시: 2초 뒤 → 02
      case 'splash':
        return <SplashPage onFinish={finishSplash} />

      // 02 로그인: "회원가입" → 03 / "로그인" → 04 (입력한 아이디를 04로)
      case 'login':
        return (
          <LoginPage
            onSignup={() => go('signup')}
            onLogin={({ userId: id }) => {
              setUserId(id)
              go('home')
            }}
          />
        )

      // 03 회원가입: 화살표 → 02 / 팝업 "로그인 화면으로 돌아가기" → 02
      case 'signup':
        return <SignupPage onBack={goBack} onGoToLogin={() => go('login')} />

      // 04 홈: "접근성 프로필 설정" → 05 / "NFC 키링 등록" → 06
      case 'home':
        return (
          <HomePage
            userId={userId ?? undefined}
            onProfileClick={() => go('profile')}
            onNfcClick={() => {
              setNfcGuideFrom('home')
              go('nfcGuide')
            }}
          />
        )

      // 05 접근성 프로필 설정: 화살표 → 04 / "다음" → 06 / "이전으로" → 04
      case 'profile':
        return (
          <ProfileSetupPage
            initialTarget={profile.target}
            initialNickname={profile.nickname}
            onBack={goBack}
            onNext={(value) => {
              setProfile(value)
              setNfcGuideFrom('profile')
              go('nfcGuide')
            }}
            onPrevious={() => go('home')}
          />
        )

      // 06 NFC 등록 방법: 화살표 → 04 / "다음" → 07 / "이전으로" → 들어온 화면(05 또는 04)
      case 'nfcGuide':
        return (
          <NfcGuidePage
            onBack={goBack}
            onNext={() => go('nfcCode')}
            onPrevious={() => go(nfcGuideFrom)}
          />
        )

      // 07 등록 코드: 화살표 → 04 / "다음" → 08 (코드와 누른 시각을 08로) / "이전으로" → 06
      case 'nfcCode':
        return (
          <NfcCodePage
            onBack={goBack}
            onNext={({ code, registeredAt }) => {
              setNfcResult({ keyringId: code, registeredAt })
              go('nfcComplete')
            }}
            onPrevious={() => go('nfcGuide')}
          />
        )

      // 08 등록 완료: 화살표 → 04 / "홈으로 이동"은 아직 동작 없음 (실제 홈 화면이 생기면 onHome 연결)
      case 'nfcComplete':
        return (
          <NfcCompletePage
            keyringId={nfcResult?.keyringId}
            registeredAt={nfcResult?.registeredAt}
            onBack={goBack}
          />
        )

      default:
        return null
    }
  }

  return (
    <ScreenFocus ref={focusRef} tabIndex={-1}>
      {renderScreen()}
    </ScreenFocus>
  )
}
