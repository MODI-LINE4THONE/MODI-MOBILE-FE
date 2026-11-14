import { useLayoutEffect } from 'react'
import { Navigate, useLocation, useNavigate, useParams, useSearchParams } from 'react-router'
import SelfKeyringPage from '../pages/keyring/SelfKeyringPage'
import FamilyKeyringPage from '../pages/keyring/FamilyKeyringPage'
import { sampleFamilyProfiles } from '../features/family/familyProfiles'
import { findFamilyWithKeyring } from '../features/family/familyKeyring'
import RequireLogin from './RequireLogin'
import { useSession } from './SessionContext'
import { HOME_PATH, KEYRING_ISSUANCE_PATH, KEYRING_LOST_PATH, KEYRING_PATH } from './paths'

// ─────────────────────────────────────────────────────────────
// 키링 관리 화면 연결
//   /keyrings                    본인 키링 관리
//   /keyrings/family/:familyId   가족 키링 관리 (예: /keyrings/family/mother)
//
// 공통
// - 로그인 아이디가 없으면(새로고침, 주소 직접 입력) 02 로그인으로 (RequireLogin)
// - 탭 제목 "키링 관리 - MODI"
// - "새 키링 연결하기" → 새 키링 발급(/keyrings/issuance), "키링을 분실하셨나요?" → 키링 분실(/keyrings/lost)
//   새 기록을 쌓아 이동 → 두 화면에서 뒤로가기(한 칸 뒤)를 누르면 키링 관리로 돌아온다
//
// 본인 키링 관리
// - 제목 아이디: 로그인 아이디
// - 키링 ID·등록 일시: 07에서 등록한 키링(SessionContext의 keyring). 본인 사용자일 때만 쓴다.
//   07 정보가 없거나 05에서 가족을 골랐으면 08과 같은 기본값(AB1234, 2026년 11월 3일 15시 29분)
//   (가족 사용자가 07에서 등록한 키링이 누구 것인지는 다음 이슈에서 정한다)
// - 뒤로가기 화살표
//   홈에서 "키링 관리" 카드를 눌러 왔으면(state.from === 'home'): 한 칸 뒤로 → 기록 [홈], 휴대폰 뒤로가기와 같은 결과
//   주소를 직접 입력해 들어왔으면: 홈으로 replace → 기록 [홈] (홈에서 뒤로가기 = 앱을 벗어남)
//
// 가족 키링 관리
// - 가족 이름·사진·키링 정보: 가족 목록(sampleFamilyProfiles, 가족 홈과 같은 목록)에서 :familyId로 찾는다
// - 없는 familyId이거나 키링이 없는(등록 대기) 가족이면 홈으로 replace
// - 뒤로가기 화살표
//   앱 안에서 왔으면: 한 칸 뒤로 (휴대폰 뒤로가기와 같은 결과. 가족 프로필 상세에서 왔으면 그 화면)
//   주소를 직접 입력해 들어왔으면: 홈으로 replace
// - 05 선택과 상관없이 열린다 (본인 사용자도 막지 않음. 가족 목록이 지금은 예시 데이터라서)
//
// 개발용 확인 주소 (npm run dev에서만 동작, 배포용 빌드에서는 무시되고 로그인 확인 규칙 적용)
//   /keyrings?preview=self → 로그인 없이 본인 키링 관리 (직접 들어왔을 때 화살표 → /home?preview=self)
//   /keyrings/family/mother?preview=family → 로그인 없이 어머니 키링 관리
//     (직접 들어왔을 때 화살표, 없는 가족·등록 대기 가족 → /home?preview=family)
// ─────────────────────────────────────────────────────────────

const KEYRING_TITLE = '키링 관리 - MODI'

// 개발용 확인 값. import.meta.env.DEV는 배포용 빌드에서 false로 바뀌어 이 값은 항상 null이 된다.
// target: 이 주소에서 받는 preview 값 ('self' | 'family')
function useDevPreview(target) {
  const [searchParams] = useSearchParams()
  if (!import.meta.env.DEV) return null
  return searchParams.get('preview') === target ? { target } : null
}

// 공통: 탭 제목, 맨 위로
function useKeyringTitle() {
  useLayoutEffect(() => {
    document.title = KEYRING_TITLE
    window.scrollTo(0, 0)
  }, [])
}

// 공통: 메뉴 2개 이동
function useKeyringMenus() {
  const navigate = useNavigate()
  return {
    onConnectClick: () => navigate(KEYRING_ISSUANCE_PATH),
    onLostClick: () => navigate(KEYRING_LOST_PATH),
  }
}

const homePathFor = (devPreview) =>
  devPreview ? `${HOME_PATH}?preview=${devPreview.target}` : HOME_PATH

function SelfKeyringScreen({ devPreview }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { userId, profile, keyring } = useSession()
  const menus = useKeyringMenus()
  useKeyringTitle()

  // 본인 사용자일 때만 07 정보 (05 선택이 없으면 본인으로 본다)
  const target = devPreview?.target ?? profile.target
  const ownKeyring = target === 'family' ? null : keyring

  const cameFromHome = location.state?.from === 'home'
  const goHome = () => {
    if (cameFromHome) navigate(-1)
    else navigate(homePathFor(devPreview), { replace: true })
  }

  return (
    <SelfKeyringPage
      userId={userId ?? undefined}
      keyringId={ownKeyring?.keyringId}
      registeredAt={ownKeyring?.registeredAt}
      onBack={goHome}
      {...menus}
    />
  )
}

function FamilyKeyringScreen({ devPreview }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { familyId } = useParams()
  const menus = useKeyringMenus()
  useKeyringTitle()

  const homePath = homePathFor(devPreview)
  const family = findFamilyWithKeyring(sampleFamilyProfiles, familyId)
  if (!family) return <Navigate to={homePath} replace />

  // 앱 안에서 왔으면 한 칸 뒤로, 주소를 직접 입력해 들어왔으면(앱 안의 이전 기록 없음) 홈으로 replace
  const hasPrevious = location.key !== 'default'
  const goBack = () => {
    if (hasPrevious) navigate(-1)
    else navigate(homePath, { replace: true })
  }

  return <FamilyKeyringPage profile={family} onBack={goBack} {...menus} />
}

// 개발용 확인 주소면 로그인 확인을 건너뛰고, 아니면 로그인 확인 뒤 화면
function KeyringGate({ preview, Screen }) {
  const devPreview = useDevPreview(preview)
  if (devPreview) return <Screen devPreview={devPreview} />
  return <RequireLogin />
}

// /keyrings 와 /keyrings/family/:familyId 를 맡는다.
// 팀원 화면(/keyrings/lost, /keyrings/issuance)은 App.jsx에 따로 있다.
export const keyringRoutes = {
  path: KEYRING_PATH,
  children: [
    {
      element: <KeyringGate preview="self" Screen={SelfKeyringScreen} />,
      children: [{ index: true, element: <SelfKeyringScreen /> }],
    },
    {
      path: 'family/:familyId',
      element: <KeyringGate preview="family" Screen={FamilyKeyringScreen} />,
      children: [{ index: true, element: <FamilyKeyringScreen /> }],
    },
  ],
}
