import { useLayoutEffect } from 'react'
import { Navigate, useLocation, useNavigate, useParams, useSearchParams } from 'react-router'
import FamilyProfilePage from '../pages/family/FamilyProfilePage'
import { sampleFamilyProfiles } from '../features/family/familyProfiles'
import { findFamilyWithKeyring } from '../features/family/familyKeyring'
import RequireLogin from './RequireLogin'
import { FAMILY_PROFILE_PATH, HOME_PATH, familyKeyringPath } from './paths'

// ─────────────────────────────────────────────────────────────
// 가족 프로필 상세 연결 (/families/:familyId, 예: /families/mother)
//
// - 로그인 아이디가 없으면(새로고침, 주소 직접 입력) 02 로그인으로 (RequireLogin)
// - 탭 제목 "가족 프로필 상세 - MODI"
// - 이름·사진·상태·키링 코드·켜진 설정: 가족 목록(sampleFamilyProfiles, 가족 홈과 같은 목록)에서 :familyId로 찾는다
// - 없는 familyId이거나 키링이 없는(등록 대기) 가족이면 홈으로 replace
// - 가족 홈에서 등록 완료 카드를 누르면 새 기록을 쌓아 이 화면으로 온다 (HomeFlow)
// - 뒤로가기 화살표
//   앱 안에서 왔으면: 한 칸 뒤로 → 가족 홈 (휴대폰·브라우저 뒤로가기와 같은 결과)
//   주소를 직접 입력해 들어왔으면: 홈으로 replace
// - 등록된 키링 카드 → 가족 키링 관리(/keyrings/family/:familyId). 새 기록을 쌓아 이동하므로
//   키링 관리의 화살표·휴대폰 뒤로가기(한 칸 뒤)로 이 화면에 돌아온다
// - "접근성 설정 변경": 지금은 누름 효과만 (이후 접근성 설정 변경 화면과 연결)
// - 05 선택과 상관없이 열린다 (가족 키링 관리와 같음. 가족 목록이 지금은 예시 데이터라서)
//
// 개발용 확인 주소 (npm run dev에서만 동작, 배포용 빌드에서는 무시되고 로그인 확인 규칙 적용)
//   /families/mother?preview=family → 로그인 없이 어머니 프로필 상세
//     직접 들어왔을 때 화살표, 없는 가족·등록 대기 가족 → /home?preview=family
//     "키링 관리" → /keyrings/family/mother?preview=family
//   /home?preview=family에서 어머니 카드를 누르면 /families/mother?preview=family
// ─────────────────────────────────────────────────────────────

const FAMILY_PROFILE_TITLE = '가족 프로필 상세 - MODI'
const PREVIEW_TARGET = 'family'

// 개발용 확인 값. import.meta.env.DEV는 배포용 빌드에서 false로 바뀌어 이 값은 항상 null이 된다.
function useDevPreview() {
  const [searchParams] = useSearchParams()
  if (!import.meta.env.DEV) return null
  return searchParams.get('preview') === PREVIEW_TARGET ? { target: PREVIEW_TARGET } : null
}

function FamilyProfileScreen({ devPreview }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { familyId } = useParams()

  useLayoutEffect(() => {
    document.title = FAMILY_PROFILE_TITLE
    window.scrollTo(0, 0)
  }, [])

  const previewSearch = devPreview ? `?preview=${devPreview.target}` : ''
  const homePath = `${HOME_PATH}${previewSearch}`
  const family = findFamilyWithKeyring(sampleFamilyProfiles, familyId)
  if (!family) return <Navigate to={homePath} replace />

  // 앱 안에서 왔으면 한 칸 뒤로, 주소를 직접 입력해 들어왔으면(앱 안의 이전 기록 없음) 홈으로 replace
  const hasPrevious = location.key !== 'default'
  const goBack = () => {
    if (hasPrevious) navigate(-1)
    else navigate(homePath, { replace: true })
  }

  const goKeyring = () => navigate(`${familyKeyringPath(family.id)}${previewSearch}`)

  return <FamilyProfilePage profile={family} onBack={goBack} onKeyringClick={goKeyring} />
}

// 개발용 확인 주소면 로그인 확인을 건너뛰고, 아니면 로그인 확인 뒤 화면
function FamilyProfileGate() {
  const devPreview = useDevPreview()
  if (devPreview) return <FamilyProfileScreen devPreview={devPreview} />
  return <RequireLogin />
}

export const familyProfileRoutes = {
  path: `${FAMILY_PROFILE_PATH}/:familyId`,
  element: <FamilyProfileGate />,
  children: [{ index: true, element: <FamilyProfileScreen /> }],
}
