import { useRef, useState } from 'react'
import { Navigate, Outlet, useNavigate, useOutletContext } from 'react-router'
import styled from 'styled-components'
import KeyringIssuancePage from '../pages/KeyringIssuancePage'
import KeyringFlowLayout, { Title, Description, Notice, usePreviewSearch } from '../components/keyring/KeyringFlowLayout'
import { validateIssuanceAddress } from '../features/keyring/issuanceAddress'
import completeImage from '../assets/keyring/issuance-complete.png'

function Flow() {
  const [address, setAddress] = useState({ postcode: '', address: '', detailAddress: '', quantity: 0 })
  const [complete, setComplete] = useState(false)
  return <Outlet context={{ address, setAddress, complete, setComplete }} />
}
const Summary = styled.dl`
  margin: 32px 0 0;
  > div + div { margin-top: 26px; }
  dt { font-size: 18px; font-weight: 500; line-height: 22px; margin: 0 3px 16px; }
  dd { margin: 0; padding: 16px; min-height: 54px; border-radius: 30px; box-shadow: inset 0 0 4px #191f2840; font-size: 14px; line-height: 22px; overflow-wrap: anywhere; }
  > div:first-child dd { min-height: 90px; }
`
function Review() {
  const { address, setComplete } = useOutletContext()
  const navigate = useNavigate()
  const search = usePreviewSearch()
  const busy = useRef(false)
  const input = `/keyrings/issuance${search}`
  if (Object.keys(validateIssuanceAddress(address)).length) return <Navigate to={input} replace />
  const edit = () => { setComplete(false); navigate(input, { replace: true }) }
  function submit() {
    if (busy.current) return
    busy.current = true
    setComplete(true)
    navigate(`/keyrings/issuance/complete${search}`, { replace: true })
  }
  return <KeyringFlowLayout title="새 키링 발급" onBack={edit} step={2} primaryLabel="신청하기" onPrimaryClick={submit} backLabel="신청 정보 수정하기" onSecondaryClick={edit}>
    <Title>신청 정보를 확인하세요.</Title><Description>신청완료일로부터 4-5일 이내에 배송됩니다.</Description>
    <Summary><div><dt>배송지 정보</dt><dd>[{address.postcode}] {address.address}<br />({address.detailAddress})</dd></div><div><dt>배송 예정일</dt><dd>실제 신청 접수 후 안내 예정</dd></div><div><dt>발급 수량</dt><dd>{address.quantity}</dd></div></Summary>
    <Notice>미리보기입니다. 신청하기를 눌러도 실제 발급은 접수되지 않습니다.</Notice>
  </KeyringFlowLayout>
}
const Illustration = styled.div`
  position: relative; width: min(240px, 100%); height: 220px; margin: 61px auto 0; overflow: hidden;
  img { position: absolute; width: 143.17%; height: 141.39%; max-width: none; left: -21.31%; top: -19.21%; }
`
const CompleteTitle = styled.h2`margin: 26px 0 0; font-size: 30px; line-height: 39px; color: #2a342b; text-align: center;`
function Complete() {
  const { complete, setComplete } = useOutletContext()
  const navigate = useNavigate()
  const search = usePreviewSearch()
  if (!complete) return <Navigate to={`/keyrings/issuance${search}`} replace />
  const home = () => { setComplete(false); navigate(`/home${search}`, { replace: true }) }
  return <KeyringFlowLayout title="새 키링 발급" onBack={home} step={3} primaryLabel="홈으로" onPrimaryClick={home}>
    <Illustration><img src={completeImage} alt="" /></Illustration><CompleteTitle>키링 발급 신청이<br />완료되었어요!</CompleteTitle><Notice>완료 화면 미리보기 · 실제 신청 및 배송은 진행되지 않습니다.</Notice>
  </KeyringFlowLayout>
}
export const keyringIssuanceRoutes = { path: '/keyrings/issuance', element: <Flow />, children: [
  { index: true, element: <KeyringIssuancePage /> },
  { path: 'review', element: <Review /> },
  { path: 'complete', element: <Complete /> },
] }
