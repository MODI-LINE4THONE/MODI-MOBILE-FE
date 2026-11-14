import { Navigate, Outlet, useOutletContext } from 'react-router'
import { useSession } from './SessionContext'
import { LOGIN_PATH } from './paths'

// 로그인이 필요한 화면(온보딩 04~08, 홈) 공통:
// 로그인 아이디가 없으면(새로고침, 주소 직접 입력) 02 로그인으로 보낸다.
// 위에서 받은 화면 사이 정보(온보딩의 flow)는 그대로 아래 화면에 넘긴다.
export default function RequireLogin() {
  const { userId } = useSession()
  const context = useOutletContext()
  if (!userId) return <Navigate to={LOGIN_PATH} replace />
  return <Outlet context={context} />
}
