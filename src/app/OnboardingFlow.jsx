import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import { Navigate, Outlet, useLocation, useNavigate, useOutletContext } from 'react-router'
import styled from 'styled-components'
import SplashPage from '../pages/onboarding/SplashPage'
import LoginPage from '../pages/onboarding/LoginPage'
import SignupPage from '../pages/onboarding/SignupPage'
import HomePage from '../pages/onboarding/HomePage'
import ProfileSetupPage from '../pages/onboarding/ProfileSetupPage'
import NfcGuidePage from '../pages/onboarding/NfcGuidePage'
import NfcCodePage from '../pages/onboarding/NfcCodePage'
import NfcCompletePage from '../pages/onboarding/NfcCompletePage'

// ─────────────────────────────────────────────────────────────
// 온보딩 화면 01~08 연결 (react-router)
//
// 화면 이동 규칙은 모두 이 파일에 있다.
//   - SCREENS: 화면 목록, 주소, 브라우저 탭 제목, 뒤로가기(화살표·휴대폰·브라우저) 규칙
//   - 화면별 연결 부품(SplashScreen ~ NfcCompleteScreen): 버튼을 누르면 어디로 가는지
//   - onboardingRoutes: 주소와 연결 부품 묶기 (App.jsx에서 사용)
// 각 화면은 어디로 가는지 모르고 onNext, onBack 같은 신호만 보낸다.
//
// 뒤로가기 규칙: 브라우저 기록에서 "바로 아래 칸 = 화살표 목적지"가 항상 되도록 이동한다.
//   01 → 02, 02 → 04: replace (기록에 남기지 않음 → 02·04에서 뒤로가기 = 앱을 벗어남)
//   02 → 03, 04 → 05·06: push (뒤로가기 = 02 또는 04)
//   05·06·07·08 사이 이동: replace (기록은 항상 [04, 지금 화면] → 뒤로가기 = 04)
// 그래서 휴대폰·브라우저 뒤로가기가 화면의 뒤로가기 화살표와 같은 곳으로 간다.
// ─────────────────────────────────────────────────────────────

// path: 주소 / back: 뒤로가기 화살표 + 휴대폰·브라우저 뒤로가기를 누르면 갈 화면 (null: 화살표 없음 → 앱을 벗어남)
// needsLogin: 로그인 아이디가 없으면(새로고침, 주소 직접 입력) 02 로그인으로 보낸다
const SCREENS = {
  splash: { path: '/onboarding', title: 'MODI', back: null }, // 01
  login: { path: '/onboarding/login', title: '로그인', back: null }, // 02
  signup: { path: '/onboarding/signup', title: '회원가입', back: 'login' }, // 03
  home: { path: '/onboarding/home', title: '홈', back: null, needsLogin: true }, // 04
  profile: { path: '/onboarding/profile', title: '접근성 프로필 설정', back: 'home', needsLogin: true }, // 05
  nfcGuide: { path: '/onboarding/nfc/guide', title: 'NFC 키링 등록 방법', back: 'home', needsLogin: true }, // 06
  nfcCode: { path: '/onboarding/nfc/code', title: 'NFC 키링 등록 코드 입력', back: 'home', needsLogin: true }, // 07
  nfcComplete: { path: '/onboarding/nfc/complete', title: 'NFC 키링 등록 완료', back: 'home', needsLogin: true }, // 08
}

const findScreenByPath = (pathname) => {
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname // 끝의 / 무시
  return Object.values(SCREENS).find((s) => s.path === path)
}

// 화면이 바뀌면 키보드 위치(포커스)를 받는 칸. 모양은 없다.
const ScreenFocus = styled.div`
  outline: none;
`

// 온보딩 화면 전체를 감싸는 틀: 화면 사이에 넘기는 정보 + 화면이 바뀔 때 할 일
function OnboardingFlow() {
  // 화면 사이에 넘기는 정보 (메모리에만 보관 → 새로고침하면 사라짐)
  const [userId, setUserId] = useState(null) // 02 로그인 아이디 → 04 인사말
  const [profile, setProfile] = useState({ target: null, nickname: '' }) // 05 선택 기억
  const [nfcGuideFrom, setNfcGuideFrom] = useState('home') // 06에 들어온 화면 ('home' | 'profile')
  const [nfcResult, setNfcResult] = useState(null) // 07 → 08 { keyringId, registeredAt }

  // 화면이 바뀌면: 탭 제목 변경, 맨 위로 스크롤, 화면 읽기 프로그램이 새 화면 처음부터 읽도록 포커스 이동
  const { pathname } = useLocation()
  const focusRef = useRef(null)
  const isFirstRender = useRef(true)
  useLayoutEffect(() => {
    const screen = findScreenByPath(pathname)
    if (!screen) return // 다른 주소로 보내는 중
    document.title = screen.title === 'MODI' ? screen.title : `${screen.title} - MODI`
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    window.scrollTo(0, 0)
    focusRef.current?.focus({ preventScroll: true })
  }, [pathname])

  const flow = {
    userId,
    setUserId,
    profile,
    setProfile,
    nfcGuideFrom,
    setNfcGuideFrom,
    nfcResult,
    setNfcResult,
  }

  return (
    <ScreenFocus ref={focusRef} tabIndex={-1}>
      <Outlet context={flow} />
    </ScreenFocus>
  )
}

// 04~08 공통: 로그인 아이디가 없으면 02 로그인으로
function RequireLogin() {
  const flow = useOutletContext()
  if (!flow.userId) return <Navigate to={SCREENS.login.path} replace />
  return <Outlet context={flow} />
}

// 화면 이동 도구
//   go(화면): 새 기록을 쌓으며 이동 (push)
//   go(화면, { replace: true }): 지금 기록을 바꾸며 이동
//   goBackTo(화면): 바로 아래 칸(= 목적지)으로 한 칸 돌아감.
//     주소를 직접 입력해 들어와서 앱 안의 이전 기록이 없으면 목적지로 replace.
function useScreenNav() {
  const navigate = useNavigate()
  const location = useLocation()
  const hasPrevious = location.key !== 'default'

  const go = useCallback(
    (name, { replace = false } = {}) => navigate(SCREENS[name].path, { replace }),
    [navigate],
  )
  const goBackTo = useCallback(
    (name) => {
      if (hasPrevious) navigate(-1)
      else navigate(SCREENS[name].path, { replace: true })
    },
    [navigate, hasPrevious],
  )
  return { go, goBackTo }
}

// ── 화면별 연결 ──────────────────────────────────────────────

// 01 스플래시: 2초 뒤 → 02 (replace: 뒤로가기로 스플래시에 돌아오지 않음)
function SplashScreen() {
  const { go } = useScreenNav()
  const finishSplash = useCallback(() => go('login', { replace: true }), [go])
  return <SplashPage onFinish={finishSplash} />
}

// 02 로그인: "회원가입" → 03 / "로그인" → 04 (입력한 아이디를 04로, replace)
function LoginScreen() {
  const { setUserId } = useOutletContext()
  const { go } = useScreenNav()
  return (
    <LoginPage
      onSignup={() => go('signup')}
      onLogin={({ userId: id }) => {
        setUserId(id)
        go('home', { replace: true })
      }}
    />
  )
}

// 03 회원가입: 화살표 → 02 / 팝업 "로그인 화면으로 돌아가기" → 02
function SignupScreen() {
  const { goBackTo } = useScreenNav()
  const toLogin = () => goBackTo('login')
  return <SignupPage onBack={toLogin} onGoToLogin={toLogin} />
}

// 04 홈: "접근성 프로필 설정" → 05 / "NFC 키링 등록" → 06
function HomeScreen() {
  const { userId, setNfcGuideFrom } = useOutletContext()
  const { go } = useScreenNav()
  return (
    <HomePage
      userId={userId}
      onProfileClick={() => go('profile')}
      onNfcClick={() => {
        setNfcGuideFrom('home')
        go('nfcGuide')
      }}
    />
  )
}

// 05 접근성 프로필 설정: 화살표 → 04 / "다음" → 06 / "이전으로" → 04
function ProfileScreen() {
  const { profile, setProfile, setNfcGuideFrom } = useOutletContext()
  const { go, goBackTo } = useScreenNav()
  const toHome = () => goBackTo('home')
  return (
    <ProfileSetupPage
      initialTarget={profile.target}
      initialNickname={profile.nickname}
      onBack={toHome}
      onNext={(value) => {
        setProfile(value)
        setNfcGuideFrom('profile')
        go('nfcGuide', { replace: true })
      }}
      onPrevious={toHome}
    />
  )
}

// 06 NFC 등록 방법: 화살표 → 04 / "다음" → 07 / "이전으로" → 들어온 화면(05 또는 04)
function NfcGuideScreen() {
  const { nfcGuideFrom } = useOutletContext()
  const { go, goBackTo } = useScreenNav()
  return (
    <NfcGuidePage
      onBack={() => goBackTo('home')}
      onNext={() => go('nfcCode', { replace: true })}
      onPrevious={() =>
        nfcGuideFrom === 'profile' ? go('profile', { replace: true }) : goBackTo('home')
      }
    />
  )
}

// 07 등록 코드: 화살표 → 04 / "다음" → 08 (코드와 누른 시각을 08로) / "이전으로" → 06
function NfcCodeScreen() {
  const { setNfcResult } = useOutletContext()
  const { go, goBackTo } = useScreenNav()
  return (
    <NfcCodePage
      onBack={() => goBackTo('home')}
      onNext={({ code, registeredAt }) => {
        setNfcResult({ keyringId: code, registeredAt })
        go('nfcComplete', { replace: true })
      }}
      onPrevious={() => go('nfcGuide', { replace: true })}
    />
  )
}

// 08 등록 완료: 코드와 시각이 없으면(새로고침 등) → 07 / 화살표 → 04
// "홈으로 이동"은 아직 동작 없음 (실제 홈 화면이 생기면 onHome 연결)
function NfcCompleteScreen() {
  const { nfcResult } = useOutletContext()
  const { goBackTo } = useScreenNav()
  if (!nfcResult) return <Navigate to={SCREENS.nfcCode.path} replace />
  return (
    <NfcCompletePage
      keyringId={nfcResult.keyringId}
      registeredAt={nfcResult.registeredAt}
      onBack={() => goBackTo('home')}
    />
  )
}

// ── 주소 묶기 (/onboarding/...) ──────────────────────────────
export const onboardingRoutes = {
  path: SCREENS.splash.path,
  element: <OnboardingFlow />,
  children: [
    { index: true, element: <SplashScreen /> },
    { path: SCREENS.login.path, element: <LoginScreen /> },
    { path: SCREENS.signup.path, element: <SignupScreen /> },
    {
      element: <RequireLogin />, // needsLogin 화면(04~08)
      children: [
        { path: SCREENS.home.path, element: <HomeScreen /> },
        { path: SCREENS.profile.path, element: <ProfileScreen /> },
        { path: SCREENS.nfcGuide.path, element: <NfcGuideScreen /> },
        { path: SCREENS.nfcCode.path, element: <NfcCodeScreen /> },
        { path: SCREENS.nfcComplete.path, element: <NfcCompleteScreen /> },
      ],
    },
    // /onboarding/없는주소 → 01
    { path: '*', element: <Navigate to={SCREENS.splash.path} replace /> },
  ],
}
