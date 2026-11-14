import { useLayoutEffect } from 'react'
import { useSearchParams } from 'react-router'
import SelfHomePage from '../pages/home/SelfHomePage'
import FamilyHomePage from '../pages/home/FamilyHomePage'
import { sampleFamilyProfiles } from '../features/family/familyProfiles'
import RequireLogin from './RequireLogin'
import { useSession } from './SessionContext'
import { HOME_PATH } from './paths'

// ─────────────────────────────────────────────────────────────
// 홈 화면 연결 (/home)
//
// - 로그인 아이디가 없으면(새로고침, 주소 직접 입력) 02 로그인으로 (RequireLogin)
// - 05에서 '가족 · 보호 대상자'(family)를 골랐으면 가족 홈, 그 밖(값이 없는 경우 포함)은 본인 홈
// - 인사말 아이디: 로그인 아이디
// - 가족 목록은 지금 예시 데이터(sampleFamilyProfiles). 서버 API가 생기면 여기서 받아 넘긴다.
// - 새 알림 점: 알림 데이터가 아직 없어서 기본은 점 없음
//
// 개발용 확인 주소 (npm run dev에서만 동작, 배포용 빌드에서는 무시되고 로그인 확인 규칙 적용)
//   ?preview=self | family → 로그인 없이 본인 홈 / 가족 홈 (05 선택보다 먼저 적용)
//   ?notice=new → 로그인 없이 새 알림 점 표시
//   함께 쓸 수 있음: /home?preview=family&notice=new
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

  useLayoutEffect(() => {
    document.title = HOME_TITLE
    window.scrollTo(0, 0)
  }, [])

  const target = devPreview?.target ?? profile.target
  const hasNewNotification = devPreview?.notice ?? false
  const commonProps = { userId: userId ?? undefined, hasNewNotification }

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
