import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import { Navigate, Outlet, useLocation, useNavigate, useOutletContext } from 'react-router'
import styled from 'styled-components'
import SplashPage from '../pages/onboarding/SplashPage'
import LoginPage from '../pages/onboarding/LoginPage'
import SignupPage from '../pages/onboarding/SignupPage'
import StartPage from '../pages/onboarding/StartPage'
import ProfileSetupPage from '../pages/onboarding/ProfileSetupPage'
import NfcGuidePage from '../pages/onboarding/NfcGuidePage'
import NfcCodePage from '../pages/onboarding/NfcCodePage'
import NfcCompletePage from '../pages/onboarding/NfcCompletePage'
import RequireLogin from './RequireLogin'
import { useSession } from './SessionContext'
import { HOME_PATH, LOGIN_PATH } from './paths'

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
//   08 → 홈: 한 칸 뒤로(04) 간 뒤 그 칸을 홈으로 replace (기록 [홈] → 홈에서 뒤로가기 = 앱을 벗어남)
// 그래서 휴대폰·브라우저 뒤로가기가 화면의 뒤로가기 화살표와 같은 곳으로 간다.
//
// 로그인 아이디, 05 선택, 07에서 등록한 키링은 앱 전체 정보(SessionContext)에 있다. (홈·키링 관리에서도 쓰기 때문)
// ─────────────────────────────────────────────────────────────

// path: 주소 / back: 뒤로가기 화살표 + 휴대폰·브라우저 뒤로가기를 누르면 갈 화면 (null: 화살표 없음 → 앱을 벗어남)
// needsLogin: 로그인 아이디가 없으면(새로고침, 주소 직접 입력) 02 로그인으로 보낸다
const SCREENS = {
  splash: { path: '/onboarding', title: 'MODI', back: null }, // 01
  login: { path: LOGIN_PATH, title: '로그인', back: null }, // 02
  signup: { path: '/onboarding/signup', title: '회원가입', back: 'login' }, // 03
  start: { path: '/onboarding/start', title: '시작하기', back: null, needsLogin: true }, // 04
  profile: { path: '/onboarding/profile', title: '접근성 프로필 설정', back: 'start', needsLogin: true }, // 05
  nfcGuide: { path: '/onboarding/nfc/guide', title: 'NFC 키링 등록 방법', back: 'start', needsLogin: true }, // 06
  nfcCode: { path: '/onboarding/nfc/code', title: 'NFC 키링 등록 코드 입력', back: 'start', needsLogin: true }, // 07
  nfcComplete: { path: '/onboarding/nfc/complete', title: 'NFC 키링 등록 완료', back: 'start', needsLogin: true }, // 08
}

const findScreenByPath = (pathname) => {
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname // 끝의 / 무시
  return Object.values(SCREENS).find((s) => s.path === path)
}

// 화면이 바뀌면 키보드 위치(포커스)를 받는 칸. 모양은 없다.
const ScreenFocus = styled.div`
  outline: none;
`

// 온보딩 화면 전체를 감싸는 틀: 온보딩 화면 사이에 넘기는 정보 + 화면이 바뀔 때 할 일
function OnboardingFlow() {
  // 온보딩 화면 사이에 넘기는 정보 (메모리에만 보관 → 새로고침하면 사라짐)
  // 로그인 아이디·05 선택·07 키링은 앱 전체 정보(useSession)에 있다.
  const [nfcGuideFrom, setNfcGuideFrom] = useState('start') // 06에 들어온 화면 ('start' | 'profile')
  const [goingHome, setGoingHome] = useState(false) // 08 "홈으로 이동": 04로 돌아간 뒤 홈으로 바꾸는 중

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
    nfcGuideFrom,
    setNfcGuideFrom,
    setGoingHome,
  }

  // 08 "홈으로 이동": 한 칸 뒤로 간 칸(04)에 도착하면 화면을 그리지 않고 그 칸을 홈으로 바꾼다
  if (goingHome && findScreenByPath(pathname) !== SCREENS.nfcComplete) {
    return <Navigate to={HOME_PATH} replace />
  }

  return (
    <ScreenFocus ref={focusRef} tabIndex={-1}>
      <Outlet context={flow} />
    </ScreenFocus>
  )
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
  const { setUserId } = useSession()
  const { go } = useScreenNav()
  return (
    <LoginPage
      onSignup={() => go('signup')}
      onLogin={({ userId: id }) => {
        setUserId(id)
        go('start', { replace: true })
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

// 04 시작: "접근성 프로필 설정" → 05 / "NFC 키링 등록" → 06
function StartScreen() {
  const { userId } = useSession()
  const { setNfcGuideFrom } = useOutletContext()
  const { go } = useScreenNav()
  return (
    <StartPage
      userId={userId}
      onProfileClick={() => go('profile')}
      onNfcClick={() => {
        setNfcGuideFrom('start')
        go('nfcGuide')
      }}
    />
  )
}

// 05 접근성 프로필 설정: 화살표 → 04 / "다음" → 06 / "이전으로" → 04
function ProfileScreen() {
  const { profile, setProfile } = useSession()
  const { setNfcGuideFrom } = useOutletContext()
  const { go, goBackTo } = useScreenNav()
  const toStart = () => goBackTo('start')
  return (
    <ProfileSetupPage
      initialTarget={profile.target}
      initialNickname={profile.nickname}
      onBack={toStart}
      onNext={(value) => {
        setProfile(value)
        setNfcGuideFrom('profile')
        go('nfcGuide', { replace: true })
      }}
      onPrevious={toStart}
    />
  )
}

// 06 NFC 등록 방법: 화살표 → 04 / "다음" → 07 / "이전으로" → 들어온 화면(05 또는 04)
function NfcGuideScreen() {
  const { nfcGuideFrom } = useOutletContext()
  const { go, goBackTo } = useScreenNav()
  return (
    <NfcGuidePage
      onBack={() => goBackTo('start')}
      onNext={() => go('nfcCode', { replace: true })}
      onPrevious={() =>
        nfcGuideFrom === 'profile' ? go('profile', { replace: true }) : goBackTo('start')
      }
    />
  )
}

// 07 등록 코드: 화살표 → 04 / "다음" → 08 (코드와 누른 시각을 앱 전체 정보에 저장) / "이전으로" → 06
function NfcCodeScreen() {
  const { setKeyring } = useSession()
  const { go, goBackTo } = useScreenNav()
  return (
    <NfcCodePage
      onBack={() => goBackTo('start')}
      onNext={({ code, registeredAt }) => {
        setKeyring({ keyringId: code, registeredAt })
        go('nfcComplete', { replace: true })
      }}
      onPrevious={() => go('nfcGuide', { replace: true })}
    />
  )
}

// 08 등록 완료: 코드와 시각이 없으면(새로고침 등) → 07 / 화살표 → 04
// "홈으로 이동" → 홈. 기록 [04, 08]에서 한 칸 뒤로(04) 간 뒤 04가 그 칸을 홈으로 replace → 기록 [홈]
//   (앱 안의 이전 기록이 없으면 바로 홈으로 replace)
function NfcCompleteScreen() {
  const { keyring } = useSession()
  const { setGoingHome } = useOutletContext()
  const { goBackTo } = useScreenNav()
  const navigate = useNavigate()
  const hasPrevious = useLocation().key !== 'default'
  if (!keyring) return <Navigate to={SCREENS.nfcCode.path} replace />
  const goHome = () => {
    if (!hasPrevious) {
      navigate(HOME_PATH, { replace: true })
      return
    }
    setGoingHome(true)
    navigate(-1)
  }
  return (
    <NfcCompletePage
      keyringId={keyring.keyringId}
      registeredAt={keyring.registeredAt}
      onBack={() => goBackTo('start')}
      onHome={goHome}
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
        { path: SCREENS.start.path, element: <StartScreen /> },
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
