import { useState } from 'react'
import { Navigate, useNavigate, useSearchParams } from 'react-router'
import styled from 'styled-components'
import OnboardingLayout from '../../components/onboarding/OnboardingLayout'
import OnboardingHeader from '../../components/onboarding/OnboardingHeader'
import TextInput from '../../components/onboarding/TextInput'
import PrimaryButton from '../../components/onboarding/PrimaryButton'
import { useFamilies } from '../../app/FamilyContext'
import { useSession } from '../../app/SessionContext'

const Main = styled.main`padding: 0 25px; h2 { margin: 0 0 24px; font-size: 20px; font-weight: 500; } p { color: #5b6575; font-size: 13px; line-height: 20px; } button { margin-top: 32px; }`
export default function FamilyAddPage() {
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [params] = useSearchParams()
  const { userId } = useSession()
  const { addFamily } = useFamilies()
  const navigate = useNavigate()
  const search = import.meta.env.DEV && params.get('preview') === 'family' ? '?preview=family' : ''
  if (!userId && !search) return <Navigate to="/onboarding/login" replace />
  function submit(event) {
    event.preventDefault()
    try { const id = addFamily(name); navigate(`/keyrings/connect?familyId=${encodeURIComponent(id)}${search ? '&preview=family' : ''}`, { replace: true }) }
    catch (err) { setError(err.message) }
  }
  return <OnboardingLayout><OnboardingHeader title="가족 프로필 추가" onBack={() => navigate(`/home${search}`, { replace: true })} /><Main><h2>가족의 별명을 입력해주세요.</h2><form onSubmit={submit}><TextInput label="별명" value={name} maxLength={20} onChange={event => setName(event.target.value)} placeholder="예: 어머니" autoComplete="off" /><p>다음 단계에서 이 가족의 키링을 연결합니다.</p>{error && <p role="alert">{error}</p>}<PrimaryButton type="submit" disabled={!name.trim()}>키링 연결하기</PrimaryButton></form><p>임시 데이터로 동작하며 새로고침하면 추가한 프로필과 변경 내용은 초기화됩니다.</p></Main></OnboardingLayout>
}
