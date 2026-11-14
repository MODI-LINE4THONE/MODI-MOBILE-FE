import { useLayoutEffect } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router'
import SelfKeyringPage from '../pages/keyring/SelfKeyringPage'
import RequireLogin from './RequireLogin'
import { useSession } from './SessionContext'
import { HOME_PATH, KEYRING_ISSUANCE_PATH, KEYRING_LOST_PATH, KEYRING_PATH } from './paths'

// ─────────────────────────────────────────────────────────────
// 키링 관리 화면 연결 (/keyrings)
//
// - 로그인 아이디가 없으면(새로고침, 주소 직접 입력) 02 로그인으로 (RequireLogin)
// - 지금은 본인 키링 관리만 있다. (가족 키링 관리는 다음 작업)
// - 제목 아이디: 로그인 아이디
// - 키링 ID·등록 일시: 07에서 등록한 키링(SessionContext의 keyring). 본인 사용자일 때만 쓴다.
//   07 정보가 없거나 05에서 가족을 골랐으면 08과 같은 기본값(AB1234, 2026년 11월 3일 15시 29분)
//   (가족 사용자가 07에서 등록한 키링이 누구 것인지는 다음 이슈에서 정한다)
// - "새 키링 연결하기" → 새 키링 발급(/keyrings/issuance), "키링을 분실하셨나요?" → 키링 분실(/keyrings/lost)
//   새 기록을 쌓아 이동 → 두 화면에서 뒤로가기(한 칸 뒤)를 누르면 키링 관리로 돌아온다
// - 뒤로가기 화살표
//   홈에서 "키링 관리" 카드를 눌러 왔으면(state.from === 'home'): 한 칸 뒤로 → 기록 [홈], 휴대폰 뒤로가기와 같은 결과
//   주소를 직접 입력해 들어왔으면: 홈으로 replace → 기록 [홈] (홈에서 뒤로가기 = 앱을 벗어남)
//
// 개발용 확인 주소 (npm run dev에서만 동작, 배포용 빌드에서는 무시되고 로그인 확인 규칙 적용)
//   ?preview=self → 로그인 없이 본인 키링 관리
//   직접 입력해 들어왔을 때 화살표는 /home?preview=self (로그인 화면으로 가지 않도록)
//   홈에서 카드를 눌러 왔으면 한 칸 뒤로 → 들어올 때와 같은 홈 주소
// ─────────────────────────────────────────────────────────────

const KEYRING_TITLE = '키링 관리 - MODI'
const PREVIEW_TARGETS = ['self']

// 개발용 확인 값. import.meta.env.DEV는 배포용 빌드에서 false로 바뀌어 이 값은 항상 null이 된다.
function useDevPreview() {
  const [searchParams] = useSearchParams()
  if (!import.meta.env.DEV) return null
  const preview = searchParams.get('preview')
  return PREVIEW_TARGETS.includes(preview) ? { target: preview } : null
}

function KeyringScreen({ devPreview }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { userId, profile, keyring } = useSession()

  useLayoutEffect(() => {
    document.title = KEYRING_TITLE
    window.scrollTo(0, 0)
  }, [])

  // 본인 사용자일 때만 07 정보 (05 선택이 없으면 본인으로 본다)
  const target = devPreview?.target ?? profile.target
  const ownKeyring = target === 'family' ? null : keyring

  const cameFromHome = location.state?.from === 'home'
  const homePath = devPreview ? `${HOME_PATH}?preview=${devPreview.target}` : HOME_PATH
  const goHome = () => {
    if (cameFromHome) navigate(-1)
    else navigate(homePath, { replace: true })
  }

  return (
    <SelfKeyringPage
      userId={userId ?? undefined}
      keyringId={ownKeyring?.keyringId}
      registeredAt={ownKeyring?.registeredAt}
      onBack={goHome}
      onConnectClick={() => navigate(KEYRING_ISSUANCE_PATH)}
      onLostClick={() => navigate(KEYRING_LOST_PATH)}
    />
  )
}

// 개발용 확인 주소면 로그인 확인을 건너뛰고, 아니면 로그인 확인 뒤 키링 관리
function KeyringGate() {
  const devPreview = useDevPreview()
  if (devPreview) return <KeyringScreen devPreview={devPreview} />
  return <RequireLogin />
}

// /keyrings 만 맡는다. 팀원 화면(/keyrings/lost, /keyrings/issuance)은 App.jsx에 따로 있다.
export const keyringRoutes = {
  path: KEYRING_PATH,
  element: <KeyringGate />,
  children: [{ index: true, element: <KeyringScreen /> }],
}
