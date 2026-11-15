import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { useSession } from '../../app/SessionContext'
import RemoteProfile from '../../components/keyring/RemoteProfile'
import OnboardingLayout from '../../components/onboarding/OnboardingLayout'
import OnboardingHeader from '../../components/onboarding/OnboardingHeader'
import KeyringInfoCard from '../../components/keyring/KeyringInfoCard'
import { profileApi } from '../../features/personalization/profileApi.js'

const statuses = { AVAILABLE: '등록 가능', REGISTERED: '등록 완료', LOST: '분실', DISABLED: '비활성화' }
export default function RemoteKeyringPage({ familyId }) {
  const { profile } = useSession()
  const [params] = useSearchParams()
  return <RemoteProfile preferredId={params.get('profileId') ?? familyId ?? profile.profileId}>{selected => <Keyrings key={selected.profileId} profile={selected} />}</RemoteProfile>
}
function Keyrings({ profile }) {
  const [rings, setRings] = useState(null)
  const [error, setError] = useState('')
  const [attempt, setAttempt] = useState(0)
  const navigate = useNavigate()
  useEffect(() => {
    let active = true
    setRings(null); setError('')
    profileApi.keyrings(profile.profileId).then(data => { if (active) setRings(data) }).catch(err => { if (active) setError(err.message) })
    return () => { active = false }
  }, [profile.profileId, attempt])
  return <OnboardingLayout><OnboardingHeader title="키링 관리" onBack={() => navigate('/home')} /><main style={{ padding: '0 25px 40px' }}>
    <h2>{profile.name}님의 키링</h2>
    {error ? <><p role="alert">{error}</p><button onClick={() => setAttempt(value => value + 1)}>다시 시도</button></> : rings === null ? <p role="status">키링을 불러오는 중입니다.</p> : rings.length === 0 ? <p>연결된 키링이 없습니다.</p> : rings.map(ring => <section key={ring.keyringId} style={{ marginBottom: 24 }}><KeyringInfoCard keyringId={ring.keyringId} registeredAt={null} size="manage" /><p>등록 코드: {ring.registrationCode}</p><p>상태: {statuses[ring.status]}</p></section>)}
    <button onClick={() => navigate(`/accessibility?profileId=${profile.profileId}`)}>이 프로필의 접근성 설정</button>
  </main></OnboardingLayout>
}
