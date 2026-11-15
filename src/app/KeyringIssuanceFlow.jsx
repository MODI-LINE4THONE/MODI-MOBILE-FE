import { useSession } from './SessionContext'
import { issuanceApi, issuanceStatuses } from '../features/keyring/issuanceApi.js'
import { useRef, useState } from 'react'
import { Navigate, Outlet, useNavigate, useOutletContext, useSearchParams } from 'react-router'
import styled from 'styled-components'
import KeyringIssuancePage from '../pages/KeyringIssuancePage'
import KeyringFlowLayout, { Title, Description, Notice, usePreviewSearch } from '../components/keyring/KeyringFlowLayout'
import { validateIssuanceAddress } from '../features/keyring/issuanceAddress'
import completeImage from '../assets/keyring/issuance-complete.png'

function Flow() {
  const [address, setAddress] = useState({ postcode: '', address: '', detailAddress: '', quantity: 0 })
  const [complete, setComplete] = useState(false)
  const { userId } = useSession()
  const [params] = useSearchParams()
  const preview = import.meta.env.DEV && ['self', 'family'].includes(params.get('preview'))
  if (!userId && !preview) return <Navigate to="/onboarding/login" replace />
  return <Outlet context={{ address, setAddress, complete, setComplete, preview }} />
}
const Summary = styled.dl`
  margin: 32px 0 0;
  > div + div { margin-top: 26px; }
  dt { font-size: 18px; font-weight: 500; line-height: 22px; margin: 0 3px 16px; }
  dd { margin: 0; padding: 16px; min-height: 54px; border-radius: 30px; box-shadow: inset 0 0 4px #191f2840; font-size: 14px; line-height: 22px; overflow-wrap: anywhere; }
  > div:first-child dd { min-height: 90px; }
`
function Review() {
  const { address, setComplete, preview } = useOutletContext()
  const navigate = useNavigate()
  const search = usePreviewSearch()
  const busy = useRef(false)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const input = `/keyrings/issuance${search}`
  if (Object.keys(validateIssuanceAddress(address)).length) return <Navigate to={input} replace />
  const edit = () => { if (busy.current) return; setComplete(false); navigate(input, { replace: true }) }
  async function submit() {
    if (busy.current) return
    busy.current = true; setPending(true); setError('')
    try {
      const result = preview ? { requestId: 'preview', status: 'REQUESTED', quantity: address.quantity } : await issuanceApi.submit(address)
      setComplete(result)
      navigate(`/keyrings/issuance/complete${search}`, { replace: true })
    } catch (err) { setError(err.message || '신청하지 못했습니다.') }
    finally { busy.current = false; setPending(false) }
  }
  return <KeyringFlowLayout title="새 키링 발급" onBack={edit} step={2} primaryLabel={pending ? '신청 중…' : '신청하기'} primaryDisabled={pending} onPrimaryClick={submit} backLabel="신청 정보 수정하기" onSecondaryClick={edit}>
    <Title>신청 정보를 확인하세요.</Title><Description>배송지와 수량을 확인한 뒤 신청해주세요.</Description>
    <Summary><div><dt>배송지 정보</dt><dd>[{address.postcode}] {address.address}<br />({address.detailAddress})</dd></div><div><dt>배송 예정일</dt><dd>실제 신청 접수 후 안내 예정</dd></div><div><dt>발급 수량</dt><dd>{address.quantity}</dd></div></Summary>
    {error && <Notice role="alert">{error} 응답이 불확실하면 중복 신청을 피하기 위해 접수 여부를 문의해주세요.</Notice>}

    <Notice>{preview ? '미리보기 · 실제 발급은 접수되지 않습니다.' : '신청하기를 누르면 실제 발급 신청이 접수됩니다.'}</Notice>
  </KeyringFlowLayout>
}
const Illustration = styled.div`
  position: relative; width: min(240px, 100%); height: 220px; margin: 61px auto 0; overflow: hidden;
  img { position: absolute; width: 143.17%; height: 141.39%; max-width: none; left: -21.31%; top: -19.21%; }
`
const CompleteTitle = styled.h2`margin: 26px 0 0; font-size: 30px; line-height: 39px; color: #2a342b; text-align: center;`
function Complete() {
  const { complete, setComplete, preview } = useOutletContext()
  const navigate = useNavigate()
  const search = usePreviewSearch()
  if (!complete) return <Navigate to={`/keyrings/issuance${search}`} replace />
  const home = () => { setComplete(false); navigate(`/home${search}`, { replace: true }) }
  return <KeyringFlowLayout title="새 키링 발급" onBack={home} step={3} primaryLabel="홈으로" onPrimaryClick={home}>
    <Illustration><img src={completeImage} alt="" /></Illustration><CompleteTitle>키링 발급 신청이<br />완료되었어요!</CompleteTitle><Notice>{preview ? '미리보기 · 실제 신청은 접수되지 않았습니다.' : `신청 번호 #${complete.requestId} · ${issuanceStatuses[complete.status]} · ${complete.quantity}개`}</Notice>
  </KeyringFlowLayout>
}
export const keyringIssuanceRoutes = { path: '/keyrings/issuance', element: <Flow />, children: [
  { index: true, element: <KeyringIssuancePage /> },
  { path: 'review', element: <Review /> },
  { path: 'complete', element: <Complete /> },
] }
