import { useEffect, useLayoutEffect } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router'
import SelfNotificationPage from '../pages/notification/SelfNotificationPage'
import FamilyNotificationPage from '../pages/notification/FamilyNotificationPage'
import { sampleFamilyProfiles } from '../features/family/familyProfiles'
import RequireLogin from './RequireLogin'
import { useSession } from './SessionContext'
import { toNotificationTarget, useNotifications } from './NotificationContext'
import { HOME_PATH, NOTIFICATION_PATH } from './paths'

// ─────────────────────────────────────────────────────────────
// 알림 화면 연결 (/notifications)
//
// - 로그인 아이디가 없으면(새로고침, 주소 직접 입력) 02 로그인으로 (RequireLogin)
// - 05에서 '가족 · 보호 대상자'(family)를 골랐으면 가족 알림, 그 밖(값이 없는 경우 포함)은 본인 알림
//   (홈과 같은 규칙)
// - 알림 목록과 기준 시각은 NotificationContext에서 받는다 (지금은 예시 데이터, 서버 API는 그곳에 붙인다)
// - 화면이 열리면 "본 시각"을 지금으로 바꾼다 → 홈으로 돌아가면 새 알림 점이 사라진다
// - 가족 필터 칩 이름·순서는 가족 홈과 같은 가족 목록(sampleFamilyProfiles)
// - 뒤로가기 화살표
//   홈에서 종을 눌러 왔으면(state.from === 'home'): 한 칸 뒤로 → 기록 [홈], 휴대폰 뒤로가기와 같은 결과
//   주소를 직접 입력해 들어왔으면: 홈으로 replace → 기록 [홈] (홈에서 뒤로가기 = 앱을 벗어남)
//
// 개발용 확인 주소 (npm run dev에서만 동작, 배포용 빌드에서는 무시되고 로그인 확인 규칙 적용)
//   ?preview=self | family → 로그인 없이 본인 알림 / 가족 알림 (05 선택보다 먼저 적용)
//   직접 입력해 들어왔을 때 화살표는 /home?preview=self | family (로그인 화면으로 가지 않도록)
//   홈에서 종을 눌러 왔으면 한 칸 뒤로 → 들어올 때와 같은 홈 주소
// ─────────────────────────────────────────────────────────────

const NOTIFICATION_TITLE = '알림 - MODI'
const PREVIEW_TARGETS = ['self', 'family']

// 개발용 확인 값. import.meta.env.DEV는 배포용 빌드에서 false로 바뀌어 이 값은 항상 null이 된다.
function useDevPreview() {
  const [searchParams] = useSearchParams()
  if (!import.meta.env.DEV) return null
  const preview = searchParams.get('preview')
  return PREVIEW_TARGETS.includes(preview) ? { target: preview } : null
}

function NotificationScreen({ devPreview }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { profile } = useSession()
  const { notifications, now, markSeen } = useNotifications()
  const target = toNotificationTarget(devPreview?.target ?? profile.target)

  useLayoutEffect(() => {
    document.title = NOTIFICATION_TITLE
    window.scrollTo(0, 0)
  }, [])

  // 화면이 열리면 이 사용자 쪽 알림을 본 것으로
  useEffect(() => {
    markSeen(target)
  }, [markSeen, target])

  const cameFromHome = location.state?.from === 'home'
  const homePath = devPreview ? `${HOME_PATH}?preview=${devPreview.target}` : HOME_PATH
  const goHome = () => {
    if (cameFromHome) navigate(-1)
    else navigate(homePath, { replace: true })
  }

  if (target === 'family') {
    return (
      <FamilyNotificationPage
        notifications={notifications.family}
        profiles={sampleFamilyProfiles}
        now={now}
        onBack={goHome}
      />
    )
  }
  return (
    <SelfNotificationPage notifications={notifications.self} now={now} onBack={goHome} />
  )
}

// 개발용 확인 주소면 로그인 확인을 건너뛰고, 아니면 로그인 확인 뒤 알림
function NotificationGate() {
  const devPreview = useDevPreview()
  if (devPreview) return <NotificationScreen devPreview={devPreview} />
  return <RequireLogin />
}

export const notificationRoutes = {
  path: NOTIFICATION_PATH,
  element: <NotificationGate />,
  children: [{ index: true, element: <NotificationScreen /> }],
}
