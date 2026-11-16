import { userApi } from '../features/onboarding/userApi.js'
import { onboardingApi } from '../features/onboarding/onboardingApi.js'
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
//   - OnboardingFlow: 주소로 들어왔을 때 다른 화면으로 보내는 규칙 (온보딩 완료, 05 프로필)
//   - 화면별 연결 부품(SplashScreen ~ NfcCompleteScreen): 버튼을 누르면 어디로 가는지
//   - onboardingRoutes: 주소와 연결 부품 묶기 (App.jsx에서 사용)
// 각 화면은 어디로 가는지 모르고 onNext, onBack 같은 신호만 보낸다.
//
// 순서: 01 → 02 → (03) → 04 → 05 → 06 → 07 → 08 → 홈
//
// 온보딩 완료(onboardingCompleted, SessionContext):
//   05에서 프로필을 만든 뒤 06 "나중에"(키링 건너뜀) 또는 08 "홈으로 이동"을 누르면 완료
//   로그인할 때 서버가 준 값이 true면 홈, false면 04
//
// 뒤로가기 규칙: 브라우저 기록에서 "바로 아래 칸 = 화살표 목적지"가 항상 되도록 이동한다.
//   01 → 02, 02 → 04·홈: replace (기록에 남기지 않음 → 02·04·홈에서 뒤로가기 = 앱을 벗어남)
//   02 → 03, 04 → 05: push (뒤로가기 = 02 또는 04)
//   05·06·07·08 사이 이동: replace (기록은 항상 [04, 지금 화면] → 뒤로가기 = 04)
//   06 "나중에"·08 "홈으로 이동" → 홈: 한 칸 뒤로(04) 간 뒤 그 칸을 홈으로 replace
//     (기록 [홈] → 홈에서 뒤로가기 = 앱을 벗어남)
// 그래서 휴대폰·브라우저 뒤로가기가 화면의 뒤로가기 화살표와 같은 곳으로 간다.
//
// 주소로 들어왔을 때 (모두 replace)
//   - 로그인 아이디가 없으면(새로고침, 주소 직접 입력) 04~08 → 02 로그인 (RequireLogin)
//   - 온보딩을 이미 마쳤으면 04~08 → 홈
//   - 05 프로필을 아직 만들지 않았으면 06~08 → 05
//   - 08인데 07 코드·시각이 없으면 → 07
//
// 로그인 아이디, 온보딩 완료, 05 선택, 07에서 등록한 키링은 앱 전체 정보(SessionContext)에 있다.
// (홈·키링 관리에서도 쓰기 때문)
// ─────────────────────────────────────────────────────────────

// path: 주소 / back: 뒤로가기 화살표 + 휴대폰·브라우저 뒤로가기를 누르면 갈 화면 (null: 화살표 없음 → 앱을 벗어남)
// needsLogin: 로그인 아이디가 없으면 02 로그인으로, 온보딩을 마쳤으면 홈으로 보낸다 (04~08)
// needsProfile: 05 프로필이 없으면 05로 보낸다 (06~08)
const SCREENS = {
  splash: { path: '/onboarding', title: 'MODI', back: null }, // 01
  login: { path: LOGIN_PATH, title: '로그인', back: null }, // 02
  signup: { path: '/onboarding/signup', title: '회원가입', back: 'login' }, // 03
  start: { path: '/onboarding/start', title: '시작하기', back: null, needsLogin: true }, // 04
  profile: { path: '/onboarding/profile', title: '프로필 만들기', back: 'start', needsLogin: true }, // 05
  nfcGuide: {
    path: '/onboarding/nfc/guide',
    title: '키링 등록 방법',
    back: 'start',
    needsLogin: true,
    needsProfile: true,
  }, // 06
  nfcCode: {
    path: '/onboarding/nfc/code',
    title: '키링 등록 코드 입력',
    back: 'start',
    needsLogin: true,
    needsProfile: true,
  }, // 07
  nfcComplete: {
    path: '/onboarding/nfc/complete',
    title: '키링 등록 완료',
    back: 'start',
    needsLogin: true,
    needsProfile: true,
  }, // 08
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
  const { userId, onboardingCompleted, profile } = useSession()
  // 06 "나중에"·08 "홈으로 이동": 홈으로 가려고 떠나는 화면 (SCREENS 값). 메모리에만 보관
  const [leavingScreen, setLeavingScreen] = useState(null)

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

  const screen = findScreenByPath(pathname)

  // 06 "나중에"·08 "홈으로 이동": 한 칸 뒤로 간 칸(04)에 도착하면 화면을 그리지 않고 그 칸을 홈으로 바꾼다.
  // 떠나는 화면 자신은 그대로 둔다 (완료 표시 직후 아래 규칙으로 먼저 홈에 가 버리지 않도록)
  if (leavingScreen) {
    if (screen !== leavingScreen) return <Navigate to={HOME_PATH} replace />
  } else if (userId && screen?.needsLogin) {
    // 주소로 들어왔을 때 (로그인 아이디가 없으면 RequireLogin이 02로 보낸다)
    if (onboardingCompleted) return <Navigate to={HOME_PATH} replace />
    if (screen === SCREENS.profile && profile.profileId && profile.target) {
      return <Navigate to={SCREENS.nfcGuide.path} replace />
    }
    if (screen.needsProfile && !profile.target) {
      return <Navigate to={SCREENS.profile.path} replace />
    }
  }

  return (
    <ScreenFocus ref={focusRef} tabIndex={-1}>
      <Outlet context={{ setLeavingScreen }} />
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

// 온보딩 완료 후 홈으로 (06 "나중에", 08 "홈으로 이동")
// 기록 [04, 지금 화면]에서 한 칸 뒤로(04) 간 뒤 OnboardingFlow가 그 칸을 홈으로 replace → 기록 [홈]
// 앱 안의 이전 기록이 없으면(주소 직접 입력) 바로 홈으로 replace
function useFinishOnboarding(screenName) {
  const { completeOnboarding } = useSession()
  const { setLeavingScreen } = useOutletContext()
  const navigate = useNavigate()
  const hasPrevious = useLocation().key !== 'default'
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const busy = useRef(false)
  const finish = async () => {
    if (busy.current) return
    busy.current = true; setPending(true); setError('')
    try {
      await completeOnboarding()
      setLeavingScreen(SCREENS[screenName])
      if (hasPrevious) navigate(-1)
      else navigate(HOME_PATH, { replace: true })
    } catch (err) { setError(err.message || '온보딩 완료를 저장하지 못했습니다. 다시 시도해주세요.') }
    finally { busy.current = false; setPending(false) }
  }
  return { finish, pending, error }
}

// ── 화면별 연결 ──────────────────────────────────────────────

// 01 스플래시: 2초 뒤 → 02 (replace: 뒤로가기로 스플래시에 돌아오지 않음)
function SplashScreen() {
  const { go } = useScreenNav()
  const finishSplash = useCallback(() => go('login', { replace: true }), [go])
  return <SplashPage onFinish={finishSplash} />
}

// 02 로그인: "회원가입" → 03
// "로그인" → 서버 로그인(지금은 흉내) 뒤 온보딩을 마쳤으면 홈, 아니면 04 (둘 다 replace)
function LoginScreen() {
  const { logIn } = useSession()
  const { go } = useScreenNav()
  const navigate = useNavigate()
  const loggingIn = useRef(false) // 서버 응답을 기다리는 동안 다시 눌러도 무시
  const handleLogin = async (credentials) => {
    if (loggingIn.current) return
    loggingIn.current = true
    try {
      const { onboardingCompleted, profile } = await logIn(credentials)
      if (onboardingCompleted) navigate(HOME_PATH, { replace: true })
      else if (profile.profileId) go('nfcGuide', { replace: true })
      else go('start', { replace: true })
    } finally {
      loggingIn.current = false
    }
  }
  return <LoginPage onSignup={() => go('signup')} onLogin={handleLogin} />
}

// 03 회원가입: 화살표 → 02 / 팝업 "로그인 화면으로 돌아가기" → 02
function SignupScreen() {
  const { goBackTo } = useScreenNav()
  const toLogin = () => goBackTo('login')
  return <SignupPage onBack={toLogin} onGoToLogin={toLogin} />
}

// 04 시작: "시작하기" → 05
function StartScreen() {
  const { userId, profile } = useSession()
  const { go } = useScreenNav()
  return <StartPage userId={userId} onStart={() => go(profile.profileId ? 'nfcGuide' : 'profile')} />
}

// 05 프로필 만들기: 화살표 → 04 / "다음" → 06 / "이전으로" → 04
function ProfileScreen() {
  const { userId, profile, setProfile } = useSession()
  const { go, goBackTo } = useScreenNav()
  const toStart = () => goBackTo('start')
  return (
    <ProfileSetupPage
      initialTarget={profile.target}
      initialNickname={profile.nickname}
      onBack={toStart}
      onNext={async (value) => {
        const saved = await userApi.start(value, userId)
        setProfile(saved)
        go('nfcGuide', { replace: true })
      }}
      onPrevious={toStart}
    />
  )
}

// 06 키링 등록 방법: 화살표 → 04 / "다음" → 07 / "나중에" → 온보딩 완료 + 홈 (키링 없음)
function NfcGuideScreen() {
  const { go, goBackTo } = useScreenNav()
  const completion = useFinishOnboarding('nfcGuide')
  return (
    <NfcGuidePage
      onBack={() => goBackTo('start')}
      onNext={() => go('nfcCode', { replace: true })}
      onLater={completion.finish}
      pending={completion.pending}
      error={completion.error}
    />
  )
}

// 07 등록 코드: 서버 등록 및 프로필 연결 성공 후 08로 이동. 연결 실패 시 등록 ID를 보관해 재시도한다.
function NfcCodeScreen() {
  const { profile, keyring, setKeyring } = useSession()
  const registered = useRef(keyring)
  const { go, goBackTo } = useScreenNav()
  return (
    <NfcCodePage
      initialCode={keyring?.registrationCode ?? ''}
      onBack={() => goBackTo('start')}
      onNext={async ({ code }) => {
        if (!profile.profileId) throw new Error('프로필을 먼저 생성해주세요.')
        // 등록 성공 후 연결만 실패하면 재시도할 때 등록 요청을 반복하지 않는다.
        if (registered.current && registered.current.registrationCode !== code) {
          throw new Error('이미 등록한 코드로 연결을 다시 시도해주세요.')
        }
        if (!registered.current) {
          registered.current = await onboardingApi.registerKeyring(code)
          setKeyring(registered.current)
        }
        await onboardingApi.connectKeyring(registered.current.keyringId, profile.profileId)
        setKeyring({ ...registered.current, connected: true })
        go('nfcComplete', { replace: true })
      }}
      onPrevious={() => go('nfcGuide', { replace: true })}
    />
  )
}

// 08 등록 완료: 코드와 시각이 없으면(새로고침 등) → 07 / 화살표 → 04
// "홈으로 이동" → 온보딩 완료 + 홈
function NfcCompleteScreen() {
  const { keyring } = useSession()
  const { goBackTo } = useScreenNav()
  const completion = useFinishOnboarding('nfcComplete')
  if (!keyring?.connected) return <Navigate to={SCREENS.nfcCode.path} replace />
  return (
    <NfcCompletePage
      keyringId={keyring.keyringId}
      registeredAt={keyring.registeredAt}
      onBack={() => goBackTo('start')}
      onHome={completion.finish}
      pending={completion.pending}
      error={completion.error}
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
