import styled from 'styled-components'
import KeyringManageLayout from '../../components/keyring/KeyringManageLayout'
import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { useSession } from '../../app/SessionContext'
import RemoteProfile from '../../components/keyring/RemoteProfile'
import KeyringInfoCard from '../../components/keyring/KeyringInfoCard'
import { profileApi } from '../../features/personalization/profileApi.js'

const Information = styled.div`margin-top: 16px; display: grid; gap: 16px;`
const EmptyCard = styled.p`display: grid; place-items: center; min-height: 176px; margin: 0; padding: 24px; border-radius: 30px; background: #f4f6fa; color: #5b6575; font-size: 14px; line-height: 22px; text-align: center;`
const Status = styled.p`margin: 8px 3px 0; color: #5b6575; font-size: 14px; line-height: 22px;`

const statuses = { AVAILABLE: '등록 가능', REGISTERED: '등록 완료', LOST: '분실', DISABLED: '비활성화' }
export default function RemoteKeyringPage({ familyId }) {
  const { profile } = useSession()
  const [params] = useSearchParams()
  return <RemoteProfile preferredId={params.get('profileId') ?? familyId ?? profile.profileId}>{selected => <Keyrings key={selected.profileId} profile={selected} />}</RemoteProfile>
}
function Keyrings({ profile }) {
  const [rings, setRings] = useState(null)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  useEffect(() => {
    let active = true
    setRings(null); setError('')
    profileApi.keyrings(profile.profileId).then(data => { if (active) setRings(data) }).catch(err => { if (active) setError(err.message) })
    return () => { active = false }
  }, [profile.profileId])
  const information = <Information>
    {error ? <EmptyCard role="alert">{error} 잠시 후 다시 방문해주세요.</EmptyCard> : rings === null ? <EmptyCard role="status">키링을 불러오는 중입니다.</EmptyCard> : rings.length === 0 ? <EmptyCard>연결된 키링이 없습니다.</EmptyCard> : rings.map(ring => <section key={ring.keyringId}><KeyringInfoCard keyringId={ring.keyringId} registeredAt={null} size="manage" /><Status>{statuses[ring.status]}</Status></section>)}
  </Information>
  return <KeyringManageLayout
    title={`${profile.name}님의 키링`}
    information={information}
    onBack={() => navigate('/home')}
    onConnectClick={() => navigate(`/keyrings/connect?profileId=${profile.profileId}`)}
    onLostClick={() => navigate(`/keyrings/lost?profileId=${profile.profileId}`)}
  />
}
