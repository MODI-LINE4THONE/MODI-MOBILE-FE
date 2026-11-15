import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { profileApi } from '../../features/personalization/profileApi.js'
import OnboardingLayout from '../onboarding/OnboardingLayout'
import OnboardingHeader from '../onboarding/OnboardingHeader'

export default function RemoteProfile({ preferredId, children }) {
  const [profiles, setProfiles] = useState(null)
  const [selected, setSelected] = useState(null)
  const [error, setError] = useState('')
  const [attempt, setAttempt] = useState(0)
  const navigate = useNavigate()
  useEffect(() => {
    let active = true
    setProfiles(null); setSelected(null); setError('')
    profileApi.list().then(async list => {
      const match = list.find(profile => String(profile.profileId) === String(preferredId))
      // 여러 프로필 중 첫 번째를 본인으로 추정하지 않는다.
      const chosen = match ?? (!preferredId && list.length === 1 ? list[0] : null)
      const detail = chosen ? await profileApi.detail(chosen.profileId) : null
      if (active) { setProfiles(list); setSelected(detail) }
    }).catch(err => { if (active) setError(err.message) })
    return () => { active = false }
  }, [preferredId, attempt])
  if (selected) return children(selected)
  return <OnboardingLayout><OnboardingHeader title="프로필 선택" onBack={() => navigate('/home')} /><main style={{ padding: '0 25px' }}>
    {error ? <><p role="alert">{error}</p><button onClick={() => setAttempt(value => value + 1)}>다시 시도</button></> : profiles === null ? <p role="status">프로필을 불러오는 중입니다.</p> : profiles.length === 0 ? <><p>등록된 프로필이 없습니다.</p><button onClick={() => navigate('/onboarding/profile')}>프로필 만들기</button></> : <><p>확인할 프로필을 선택해주세요.</p>{profiles.map(profile => <button key={profile.profileId} style={{ display: 'block', margin: '16px 0' }} onClick={() => navigate(`${location.pathname}?profileId=${profile.profileId}`)}>{profile.name} · #{profile.profileId}</button>)}</>}
  </main></OnboardingLayout>
}
