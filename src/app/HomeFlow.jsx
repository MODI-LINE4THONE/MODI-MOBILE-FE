import { useLayoutEffect } from 'react'
import { useSearchParams } from 'react-router'
import SelfHomePage from '../pages/home/SelfHomePage'

// ─────────────────────────────────────────────────────────────
// 홈 화면 연결 (/home)
//
// 지금: 본인 홈만 보여 준다. (가족 홈, 05 선택에 따라 나누기, 08 "홈으로 이동" 연결은 다음 작업)
// 다음 작업 메모:
//   - 로그인 아이디·05 선택을 앱 전체 정보(SessionContext)로 올려 여기서 읽는다.
//   - 05 선택이 '가족 · 보호 대상자'면 가족 홈, 그 밖(값이 없는 경우 포함)은 오류 없이 본인 홈.
//
// 확인용 주소 값: ?notice=new → 새 알림 점 표시 (기본: 점 없음)
// 알림 데이터가 생기면 이 값 대신 실제 데이터로 바꾼다.
// ─────────────────────────────────────────────────────────────

const HOME_PATH = '/home'
const HOME_TITLE = '홈 - MODI'

function HomeScreen() {
  const [searchParams] = useSearchParams()
  const hasNewNotification = searchParams.get('notice') === 'new'

  useLayoutEffect(() => {
    document.title = HOME_TITLE
  }, [])

  return <SelfHomePage hasNewNotification={hasNewNotification} />
}

export const homeRoutes = { path: HOME_PATH, element: <HomeScreen /> }
