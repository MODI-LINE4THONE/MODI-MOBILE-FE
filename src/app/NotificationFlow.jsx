import { useLayoutEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import SelfNotificationPage from '../pages/notification/SelfNotificationPage'
import FamilyNotificationPage from '../pages/notification/FamilyNotificationPage'
import {
  SAMPLE_NOW,
  sampleFamilyNotifications,
  sampleSelfNotifications,
} from '../features/notification/notifications'
import { sampleFamilyProfiles } from '../features/family/familyProfiles'
import RequireLogin from './RequireLogin'
import { useSession } from './SessionContext'
import { HOME_PATH, NOTIFICATION_PATH } from './paths'

// ─────────────────────────────────────────────────────────────
// 알림 화면 연결 (/notifications)
//
// - 로그인 아이디가 없으면(새로고침, 주소 직접 입력) 02 로그인으로 (RequireLogin)
// - 05에서 '가족 · 보호 대상자'(family)를 골랐으면 가족 알림, 그 밖(값이 없는 경우 포함)은 본인 알림
//   (홈과 같은 규칙)
// - 알림 목록은 지금 예시 데이터(sampleSelfNotifications / sampleFamilyNotifications, 기준 시각 SAMPLE_NOW).
//   서버 API가 생기면 여기서 받은 목록과 실제 현재 시각(new Date())을 넘긴다.
// - 가족 필터 칩 이름·순서는 가족 홈과 같은 가족 목록(sampleFamilyProfiles)
// - 뒤로가기 화살표: 홈(/home)으로
//
// 개발용 확인 주소 (npm run dev에서만 동작, 배포용 빌드에서는 무시되고 로그인 확인 규칙 적용)
//   ?preview=self | family → 로그인 없이 본인 알림 / 가족 알림 (05 선택보다 먼저 적용)
//   뒤로가기는 /home?preview=self | family (로그인 화면으로 가지 않도록)
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
  const { profile } = useSession()

  useLayoutEffect(() => {
    document.title = NOTIFICATION_TITLE
    window.scrollTo(0, 0)
  }, [])

  // replace: 홈에서 브라우저 뒤로가기를 눌렀을 때 알림 화면으로 다시 돌아오지 않도록
  const homePath = devPreview ? `${HOME_PATH}?preview=${devPreview.target}` : HOME_PATH
  const goHome = () => navigate(homePath, { replace: true })

  const target = devPreview?.target ?? profile.target
  if (target === 'family') {
    return (
      <FamilyNotificationPage
        notifications={sampleFamilyNotifications}
        profiles={sampleFamilyProfiles}
        now={SAMPLE_NOW}
        onBack={goHome}
      />
    )
  }
  return (
    <SelfNotificationPage
      notifications={sampleSelfNotifications}
      now={SAMPLE_NOW}
      onBack={goHome}
    />
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
