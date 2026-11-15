import { useRef, useState } from 'react'
import { useNavigate, useOutletContext } from 'react-router'
import styled from 'styled-components'
import TextInput from '../components/onboarding/TextInput'
import KeyringFlowLayout, { Title, Description, Notice, usePreviewSearch } from '../components/keyring/KeyringFlowLayout'
import { validateIssuanceAddress } from '../features/keyring/issuanceAddress'

const Form = styled.form`margin-top: 36px; display: grid; gap: 16px;`
const Error = styled.p`margin: 4px 3px 0; color: #d92d20; font-size: 12px; line-height: 16px;`
const Label = styled.label`display: block; margin: 0 3px 16px; font-size: 18px; font-weight: 500; line-height: 21px;`
const Quantity = styled.div`
  display: flex; align-items: center; gap: 8px; min-height: 54px; padding: 5px 14px 5px 16px; border-radius: 15px; background: #f4f6fa;
  > span { flex: 1; color: #5b6575; font-size: 14px; }
  input { width: 26px; padding: 0; border: 0; background: transparent; color: #191f28; text-align: center; font-size: 18px; appearance: textfield; }
  input::-webkit-inner-spin-button { appearance: none; }
  button { position: relative; flex-shrink: 0; width: 38px; height: 32px; border: 0; border-radius: 12px; background: white; color: #5b6575; font-size: 24px; box-shadow: inset 0 0 2px #191f2840; }
  button::before { content: ''; position: absolute; inset: -6px 0; }
  button:last-child { color: white; background: #2456e8; }
  button:disabled { opacity: .5; }
  @media(max-width:360px) { gap: 5px; > span { font-size: 12px; } }
`
export default function KeyringIssuancePage() {
  const { address, setAddress, setComplete } = useOutletContext()
  const [searchMessage, setSearchMessage] = useState('')
  const [attempted, setAttempted] = useState(false)
  const formRef = useRef(null)
  const navigate = useNavigate()
  const search = usePreviewSearch()
  const errors = validateIssuanceAddress(address)
  const valid = Object.keys(errors).length === 0
  function update(field, value) { setComplete(false); setAddress(current => ({ ...current, [field]: value })) }
  function submit(event) {
    event?.preventDefault(); setAttempted(true)
    if (!valid) { formRef.current.elements.namedItem(Object.keys(errors)[0])?.focus(); return }
    navigate(`/keyrings/issuance/review${search}`)
  }
  const lost = () => navigate(`/keyrings/lost${search}`, { replace: true })
  return <KeyringFlowLayout title="새 키링 발급" onBack={lost} step={1} primaryLabel="다음" onPrimaryClick={submit} primaryDisabled={!valid} backLabel="나중에" onSecondaryClick={lost}>
    <Title>새 키링 신청 정보를 입력하세요.</Title><Description>정보를 정확히 입력했는지 확인하세요.</Description>
    <Form ref={formRef} noValidate onSubmit={submit}>
      {[['postcode', '우편번호', '우편번호를 입력하세요.', 'postal-code'], ['address', '주소', '주소를 입력하세요.', 'address-line1'], ['detailAddress', '상세주소', '상세주소를 입력하세요.', 'address-line2']].map(([id, label, placeholder, autoComplete]) => <div key={id}><TextInput label={label} name={id} id={`issuance-${id}`} placeholder={placeholder} value={address[id]} autoComplete={`shipping ${autoComplete}`} inputMode={id === 'postcode' ? 'numeric' : undefined} maxLength={id === 'postcode' ? 5 : 200} onChange={event => update(id, id === 'postcode' ? event.target.value.replace(/\D/g, '') : event.target.value)} actionLabel={id === 'postcode' ? '검색' : undefined} onActionClick={() => setSearchMessage('주소 검색은 준비 중입니다. 우편번호와 주소를 직접 입력해주세요.')} aria-invalid={attempted && !!errors[id]} aria-describedby={attempted && errors[id] ? `${id}-error` : undefined} />{attempted && errors[id] && <Error id={`${id}-error`} role="alert">{errors[id]}</Error>}</div>)}
      <div><Label htmlFor="issuance-quantity">수량</Label><Quantity><span>원하는 수량을 입력하세요.</span><button type="button" aria-label="수량 줄이기" disabled={!address.quantity} onClick={() => update('quantity', Math.max(0, (Number(address.quantity) || 0) - 1))}>−</button><input id="issuance-quantity" name="quantity" type="number" min="0" step="1" value={address.quantity} onChange={event => update('quantity', event.target.value === '' ? '' : Number(event.target.value))} aria-invalid={attempted && !!errors.quantity} /><button type="button" aria-label="수량 늘리기" onClick={() => update('quantity', (Number(address.quantity) || 0) + 1)}>+</button></Quantity>{attempted && errors.quantity && <Error role="alert">{errors.quantity}</Error>}</div>
    </Form>
    {searchMessage && <Notice role="status">{searchMessage}</Notice>}
  </KeyringFlowLayout>
}
