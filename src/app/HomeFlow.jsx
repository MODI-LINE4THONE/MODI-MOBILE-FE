import { useEffect, useLayoutEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import SelfHomePage from '../pages/home/SelfHomePage'
import FamilyHomePage from '../pages/home/FamilyHomePage'
import { useFamilies } from './FamilyContext'
import { findFamilyWithKeyring } from '../features/family/familyKeyring'
import RequireLogin from './RequireLogin'
import { useSession } from './SessionContext'
import { HOME_PATH, KEYRING_PATH, familyProfilePath } from './paths'

const HOME_TITLE = '홈 - MODI'
const PREVIEW_TARGETS = ['self', 'family']

// 개발용 확인 값. import.meta.env.DEV는 배포용 빌드에서 false로 바뀌어 이 값은 항상 null이 된다.
function useDevPreview() {
  const [searchParams] = useSearchParams()
  if (!import.meta.env.DEV) return null
  const preview = searchParams.get('preview')
  const target = PREVIEW_TARGETS.includes(preview) ? preview : null
  if (!target) return null
  return { target }
}

function HomeScreen({ devPreview }) {
  const { userId, profile } = useSession()
  const { profiles, loading, error, refresh } = useFamilies()
  useEffect(() => { if (!devPreview) refresh() }, [refresh, devPreview])
  const navigate = useNavigate()

  useLayoutEffect(() => {
    document.title = HOME_TITLE
    window.scrollTo(0, 0)
  }, [])

  const target = devPreview?.target ?? profile.target

  // 키링 관리는 지금 본인 화면만 있다 (가족 홈에는 키링 관리 카드가 없음)
  const goKeyring = () => {
    const search = devPreview ? '?preview=self' : ''
    navigate(`${KEYRING_PATH}${search}`, { state: { from: 'home' } })
  }

  // 등록 완료(키링 연결됨) 가족만 프로필 상세로. 등록 대기는 카드 누름 효과만
  const goFamilyProfile = (profile) => {
    const search = devPreview ? '?preview=family' : ''
    if (!findFamilyWithKeyring(profiles, profile.id)) navigate(`/keyrings/connect?familyId=${encodeURIComponent(profile.id)}${devPreview ? '&preview=family' : ''}`)
    else navigate(`${familyProfilePath(profile.id)}${search}`)
  }

  const commonProps = {
    userId: userId ?? undefined,
  }

  if (target === 'family') {
    return (
      <FamilyHomePage
        {...commonProps}
        profiles={profiles}
        loading={loading}
        error={error}
        onProfileClick={goFamilyProfile}
        onAddClick={() => navigate(`/families/new${devPreview ? '?preview=family' : ''}`)}
      />
    )
  }
  return <SelfHomePage {...commonProps} onPracticeClick={() => navigate(`/practice${devPreview ? '?preview=self' : ''}`)} onKeyringClick={goKeyring} onSettingsClick={() => navigate(`/accessibility${devPreview ? '?preview=self' : ''}`, { state: { from: 'home' } })} />
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
