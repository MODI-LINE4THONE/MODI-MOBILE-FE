import { useLayoutEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import SelfNotificationPage from '../pages/notification/SelfNotificationPage'
import { SAMPLE_NOW, sampleSelfNotifications } from '../features/notification/notifications'
import RequireLogin from './RequireLogin'
import { HOME_PATH, NOTIFICATION_PATH } from './paths'

// ─────────────────────────────────────────────────────────────
// 알림 화면 연결 (/notifications)
//
// - 로그인 아이디가 없으면(새로고침, 주소 직접 입력) 02 로그인으로 (RequireLogin)
// - 지금은 본인 알림만 있다. 가족 알림은 다음 작업에서 05 선택(profile.target)으로 나눈다. (홈과 같은 방식)
// - 알림 목록은 지금 예시 데이터(sampleSelfNotifications, 기준 시각 SAMPLE_NOW).
//   서버 API가 생기면 여기서 받은 목록과 실제 현재 시각(new Date())을 넘긴다.
// - 뒤로가기 화살표: 홈(/home)으로
//
// 개발용 확인 주소 (npm run dev에서만 동작, 배포용 빌드에서는 무시되고 로그인 확인 규칙 적용)
//   ?preview=self → 로그인 없이 본인 알림. 뒤로가기는 /home?preview=self (로그인 화면으로 가지 않도록)
// ─────────────────────────────────────────────────────────────

const NOTIFICATION_TITLE = '알림 - MODI'
const PREVIEW_TARGETS = ['self']

// 개발용 확인 값. import.meta.env.DEV는 배포용 빌드에서 false로 바뀌어 이 값은 항상 null이 된다.
function useDevPreview() {
  const [searchParams] = useSearchParams()
  if (!import.meta.env.DEV) return null
  const preview = searchParams.get('preview')
  return PREVIEW_TARGETS.includes(preview) ? { target: preview } : null
}

function NotificationScreen({ devPreview }) {
  const navigate = useNavigate()

  useLayoutEffect(() => {
    document.title = NOTIFICATION_TITLE
    window.scrollTo(0, 0)
  }, [])

  // replace: 홈에서 브라우저 뒤로가기를 눌렀을 때 알림 화면으로 다시 돌아오지 않도록
  const homePath = devPreview ? `${HOME_PATH}?preview=${devPreview.target}` : HOME_PATH
  const goHome = () => navigate(homePath, { replace: true })

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
