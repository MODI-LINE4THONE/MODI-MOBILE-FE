import { useLayoutEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import SelfHomePage from '../pages/home/SelfHomePage'
import FamilyHomePage from '../pages/home/FamilyHomePage'
import { sampleFamilyProfiles } from '../features/family/familyProfiles'
import RequireLogin from './RequireLogin'
import { useSession } from './SessionContext'
import { toNotificationTarget, useNotifications } from './NotificationContext'
import { HOME_PATH, NOTIFICATION_PATH } from './paths'

// ─────────────────────────────────────────────────────────────
// 홈 화면 연결 (/home)
//
// - 로그인 아이디가 없으면(새로고침, 주소 직접 입력) 02 로그인으로 (RequireLogin)
// - 05에서 '가족 · 보호 대상자'(family)를 골랐으면 가족 홈, 그 밖(값이 없는 경우 포함)은 본인 홈
// - 인사말 아이디: 로그인 아이디
// - 가족 목록은 지금 예시 데이터(sampleFamilyProfiles). 서버 API가 생기면 여기서 받아 넘긴다.
// - 새 알림 점: NotificationContext가 판단 (알림 화면을 본 적 없거나, 본 뒤 새 알림이 오면 점)
//   본인 사용자는 본인 알림, 가족 사용자는 가족 알림 기준
// - 종을 누르면 알림 화면(/notifications)으로. 새 기록을 쌓고 "홈에서 왔음"(state.from)을 넘겨서
//   알림 화면의 화살표·휴대폰 뒤로가기가 모두 한 칸 뒤(이 홈)로 돌아온다.
//
// 개발용 확인 주소 (npm run dev에서만 동작, 배포용 빌드에서는 무시되고 로그인 확인 규칙 적용)
//   ?preview=self | family → 로그인 없이 본인 홈 / 가족 홈 (05 선택보다 먼저 적용)
//   ?notice=new → 로그인 없이 홈 (본인 홈 기준). 점은 실제와 같은 규칙: 알림 화면을 보기 전까지 표시
//   함께 쓸 수 있음: /home?preview=family&notice=new
//   개발용 주소로 들어온 홈에서 종을 누르면 알림 화면도 같은 preview로 열린다 (/notifications?preview=...)
// ─────────────────────────────────────────────────────────────

const HOME_TITLE = '홈 - MODI'
const PREVIEW_TARGETS = ['self', 'family']

// 개발용 확인 값. import.meta.env.DEV는 배포용 빌드에서 false로 바뀌어 이 값은 항상 null이 된다.
function useDevPreview() {
  const [searchParams] = useSearchParams()
  if (!import.meta.env.DEV) return null
  const preview = searchParams.get('preview')
  const target = PREVIEW_TARGETS.includes(preview) ? preview : null
  const notice = searchParams.get('notice') === 'new'
  if (!target && !notice) return null
  return { target, notice }
}

function HomeScreen({ devPreview }) {
  const { userId, profile } = useSession()
  const { hasNew } = useNotifications()
  const navigate = useNavigate()

  useLayoutEffect(() => {
    document.title = HOME_TITLE
    window.scrollTo(0, 0)
  }, [])

  const target = devPreview?.target ?? profile.target

  // 개발용 주소로 들어왔으면 알림 화면도 로그인 없이 같은 대상(preview)으로 연다
  const goNotifications = () => {
    const search = devPreview ? `?preview=${toNotificationTarget(target)}` : ''
    navigate(`${NOTIFICATION_PATH}${search}`, { state: { from: 'home' } })
  }

  const commonProps = {
    userId: userId ?? undefined,
    hasNewNotification: hasNew(target),
    onNotificationClick: goNotifications,
  }

  if (target === 'family') {
    return <FamilyHomePage {...commonProps} profiles={sampleFamilyProfiles} />
  }
  return <SelfHomePage {...commonProps} />
}

// 개발용 확인 주소면 로그인 확인을 건너뛰고, 아니면 로그인 확인 뒤 홈
function HomeGate() {
  const devPreview = useDevPreview()
  if (devPreview) return <HomeScreen devPreview={devPreview} />
  return <RequireLogin />
}

export const homeRoutes = {
  path: HOME_PATH,
  element: <HomeGate />,
  children: [{ index: true, element: <HomeScreen /> }],
}
