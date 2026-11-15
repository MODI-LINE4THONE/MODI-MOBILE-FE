import { useId, useRef, useState } from 'react'
import { Navigate, Outlet, useNavigate, useOutletContext, useSearchParams } from 'react-router'
import { useFamilies } from './FamilyContext'
import { useSession } from './SessionContext'
import styled from 'styled-components'
import KeyringFlowLayout, { Title, Description, Notice, usePreviewSearch } from '../components/keyring/KeyringFlowLayout'
import CodeInput from '../components/onboarding/CodeInput'
import KeyringInfoCard from '../components/keyring/KeyringInfoCard'
import { isRegistrationCodeComplete } from '../features/keyring/registrationCode'
import guideImage from '../assets/keyring/connect-guide.png'

function ConnectFlow() {
  const [params] = useSearchParams()
  const { profiles } = useFamilies()
  const { userId } = useSession()
  const familyId = params.get('familyId')
  const preview = import.meta.env.DEV && params.get('preview') === 'family'
  if (familyId && !userId && !preview) return <Navigate to="/onboarding/login" replace />
  if (familyId && !profiles.some(profile => profile.id === familyId)) return <Navigate to={`/home${preview ? '?preview=family' : ''}`} replace />
  return <ConnectState key={familyId ?? 'self'} familyId={familyId} />
}
function ConnectState({ familyId }) {
  const [code, setCode] = useState('')
  const [result, setResult] = useState(null)
  // Deliberately separate from onboarding/session: UI preview must not register a real keyring.
  return <Outlet context={{ code, setCode, result, setResult, familyId }} />
}
const GuideImage = styled.img`display: block; width: min(270.62px, 100%); height: auto; aspect-ratio: 270.62 / 293; align-self: center; margin-top: 25px;`
const Steps = styled.ol`width: 100%; min-height: 99px; margin: 43px 0 0; padding: 13px 10px 13px 31px; border-radius: 15px; background: #f4f6fa; font-size: 14px; line-height: 24px;`
function Guide() {
  const { familyId } = useOutletContext()
  const { profiles } = useFamilies()
  const navigate = useNavigate()
  const search = usePreviewSearch()
  const back = () => navigate(familyId ? `/home${search}` : `/keyrings/lost${search}`, { replace: true })
  return <KeyringFlowLayout title="새 키링 연결" onBack={back} step={1} primaryLabel="다음" onPrimaryClick={() => navigate(`/keyrings/connect/code${search}`)} backLabel="나중에" onSecondaryClick={back} progressLabel="새 키링 연결 단계">
    <Title>등록 방법</Title>{familyId && <Notice>{profiles.find(profile => profile.id === familyId)?.name}님의 키링을 연결합니다.</Notice>}<GuideImage src={guideImage} alt="MODI NFC 키링 뒷면의 등록 코드 AB1234 예시" />
    <Steps><li>NFC 키링 뒷면의 등록 코드를 확인합니다.</li><li>등록 코드를 입력합니다.</li><li>설정이 완료되면 키링이 내 계정에 자동으로 연결됩니다.</li></Steps>
  </KeyringFlowLayout>
}
const CodeArea = styled.div`align-self: center; margin-top: 64px; max-width: 100%; @media(max-width: 360px) { transform: scale(.88); transform-origin: top center; }`
function Code() {
  const { code, setCode, setResult, familyId } = useOutletContext()
  const { connectFamily } = useFamilies()
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const search = usePreviewSearch()
  const titleId = useId()
  const descriptionId = useId()
  const busy = useRef(false)
  const back = () => navigate(`/keyrings/connect${search}`, { replace: true })
  function next() {
    if (busy.current || !isRegistrationCodeComplete(code)) return
    busy.current = true
    try {
      const result = { keyringId: code, registeredAt: new Date() }
      if (familyId) connectFamily(familyId, result)
      setResult(result)
      navigate(`/keyrings/connect/complete${search}`, { replace: true })
    } catch (err) { setError(err.message); busy.current = false }
  }
  return <KeyringFlowLayout title="새 키링 연결" onBack={back} step={2} primaryLabel="다음" primaryDisabled={!isRegistrationCodeComplete(code)} onPrimaryClick={next} backLabel="이전으로" onSecondaryClick={back} progressLabel="새 키링 연결 단계">
    <Title id={titleId}>등록 코드</Title><Description id={descriptionId}>키링 뒷면에 부착된 6자리 등록 코드를 입력해주세요.</Description>
    <CodeArea><CodeInput value={code} onChange={value => { setCode(value); setResult(null) }} format="AA9999" labelledBy={titleId} describedBy={descriptionId} /></CodeArea>
    {error && <Notice role="alert">{error}</Notice>}<Notice>미리보기 · 코드 형식만 확인하며 실제 키링은 연결되지 않습니다.</Notice>
  </KeyringFlowLayout>
}
const ResultCard = styled(KeyringInfoCard)`margin-top: 64px;`
function Complete() {
  const { result } = useOutletContext()
  const navigate = useNavigate()
  const search = usePreviewSearch()
  if (!result) return <Navigate to={`/keyrings/connect/code${search}`} replace />
  const home = () => navigate(`/home${search}`, { replace: true })
  return <KeyringFlowLayout title="새 키링 연결" onBack={() => navigate(`/keyrings/connect/code${search}`, { replace: true })} step={3} primaryLabel="홈으로 이동" onPrimaryClick={home} progressLabel="새 키링 연결 단계">
    <Title>등록 완료</Title><Description>키링이 정상적으로 등록되었습니다.</Description><ResultCard keyringId={result.keyringId} registeredAt={result.registeredAt} size="complete" />
    <Notice>등록 완료 화면 미리보기입니다. 실제 연결과 계정 정보 변경은 이루어지지 않았습니다.</Notice>
  </KeyringFlowLayout>
}
export const keyringConnectRoutes = { path: '/keyrings/connect', element: <ConnectFlow />, children: [
  { index: true, element: <Guide /> },
  { path: 'code', element: <Code /> },
  { path: 'complete', element: <Complete /> },
] }
