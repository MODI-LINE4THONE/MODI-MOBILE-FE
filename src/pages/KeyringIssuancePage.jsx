import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import styled from 'styled-components'
import OnboardingLayout from '../components/onboarding/OnboardingLayout'
import PrimaryButton from '../components/onboarding/PrimaryButton'
import { onboardingColors } from '../styles/onboarding/colors'
import { validateIssuanceAddress } from '../features/keyring/issuanceAddress'
import logo from '../assets/keyring/logo.png'
import notification from '../assets/keyring/notification.svg'

const Layout = styled(OnboardingLayout)`
  min-height: max(852px, 100dvh); color: #2a342b;
  button, input, textarea { font-family: inherit; }
  button { cursor: pointer; }
  button:focus-visible, input:focus-visible, textarea:focus-visible { outline: 3px solid #09236d; outline-offset: 2px; }
`
const Header = styled.header`
  display: flex; align-items: flex-start; justify-content: space-between; min-height: 66px; padding: 10px 34px 0 22px;
  > img:first-child { width: 65px; height: 23px; object-fit: contain; }
  > img:last-child { margin-top: 12px; }
`
const Main = styled.main`padding: 0 24px;`
const Heading = styled.h1`margin: 0; font-size: 28px; line-height: 36px; font-weight: 700;`
const Description = styled.p`margin: 8px 0 24px; font-size: 14px; line-height: 20px; color: #6c6e72;`
const Fields = styled.div`display: grid; gap: 16px; padding: 20px; border: 1px solid #f2f2f2; border-radius: 16px;`
const Field = styled.div`
  label { display: block; margin-bottom: 8px; font-size: 13px; font-weight: 600; line-height: 17px; }
  input, textarea { width: 100%; min-width: 0; border: 1px solid #ebebeb; border-radius: 12px; padding: 15px; background: white; color: #2a342b; font-size: 15px; line-height: 22px; }
  input { height: 52px; }
  textarea { display: block; height: 88px; resize: vertical; }
  input::placeholder, textarea::placeholder { color: #9ca3af; }
  [aria-invalid='true'] { border-color: #c83b1b; }
`
const Postcode = styled.div`
  display: flex; align-items: center; border: 1px solid #ebebeb; border-radius: 12px;
  input { flex: 1; border: 0; background: transparent; }
  button { flex-shrink: 0; min-height: 44px; padding: 0 16px; border: 0; border-radius: 12px; color: ${onboardingColors.primary}; background: transparent; font-size: 14px; font-weight: 600; }
  &:has([aria-invalid='true']) { border-color: #c83b1b; }
`
const ErrorText = styled.p`margin: 6px 0 0; color: #b43218; font-size: 12px; line-height: 18px;`
const Information = styled.section`
  margin: 24px 0;
  h2 { margin: 0 0 8px; font-size: 13px; line-height: 17px; }
  p { margin: 0; font-size: 13px; line-height: 20px; color: #6c6e72; }
`
const Notice = styled.p`margin: 12px 0; font-size: 12px; line-height: 18px; color: #69707a;`
const Back = styled.button`display: block; margin: 12px auto; min-height: 44px; padding: 8px 20px; border: 0; background: white; color: #5b6575; font-size: 14px;`
const Indicator = styled.div`width: 144px; height: 4px; margin: auto auto 18px; border-radius: 2px; background: #666;`

export default function KeyringIssuancePage() {
  const [value, setValue] = useState({ postcode: '', address: '', detailAddress: '' })
  const [errors, setErrors] = useState({})
  const [searchNotice, setSearchNotice] = useState('')
  const [feedback, setFeedback] = useState('')
  const formRef = useRef(null)
  const navigate = useNavigate()
  useEffect(() => {

    const previous = document.title; document.title = '새 키링 발급 - MODI'
    return () => { document.title = previous }
  }, [])
  function update(field, text) {
    setValue(current => ({ ...current, [field]: text }))
    setErrors(current => ({ ...current, [field]: undefined }))
    setFeedback('')
  }
  function submit(event) {
    event.preventDefault()
    const nextErrors = validateIssuanceAddress(value)
    setErrors(nextErrors); setFeedback('')
    const firstInvalid = Object.keys(nextErrors)[0]
    if (firstInvalid) { formRef.current.elements.namedItem(firstInvalid)?.focus(); return }
    setFeedback('주소 입력을 확인했습니다. 현재 발급 신청 기능은 준비 중이며, 신청은 접수되지 않았습니다.')
  }
  return <Layout withStatusBar>
    <Header><img src={logo} alt="MODI" /><img src={notification} alt="" aria-hidden="true" /></Header>
    <Main>
      <Heading>새 키링 발급</Heading><Description>주소를 입력해 새 키링을 신청할 수 있어요.</Description>
      <form ref={formRef} noValidate onSubmit={submit}>
        <Fields>
          <Field><label htmlFor="issuance-postcode">우편번호</label><Postcode><input id="issuance-postcode" name="postcode" autoComplete="shipping postal-code" inputMode="numeric" maxLength={5} placeholder="우편번호를 입력해주세요" value={value.postcode} onChange={e => update('postcode', e.target.value.replace(/\D/g, ''))} aria-invalid={!!errors.postcode} aria-describedby={errors.postcode ? 'postcode-error' : undefined} required /><button type="button" onClick={() => setSearchNotice('주소 검색 기능은 준비 중입니다. 우편번호와 주소를 직접 입력해주세요.')}>검색</button></Postcode>{errors.postcode && <ErrorText id="postcode-error" role="alert">{errors.postcode}</ErrorText>}{searchNotice && <Notice role="status">{searchNotice}</Notice>}</Field>
          <Field><label htmlFor="issuance-address">주소</label><textarea id="issuance-address" name="address" autoComplete="shipping address-line1" maxLength={200} placeholder="주소를 입력해주세요" value={value.address} onChange={e => update('address', e.target.value)} aria-invalid={!!errors.address} aria-describedby={errors.address ? 'address-error' : undefined} required />{errors.address && <ErrorText id="address-error" role="alert">{errors.address}</ErrorText>}</Field>
          <Field><label htmlFor="issuance-detail">상세주소</label><input id="issuance-detail" name="detailAddress" autoComplete="shipping address-line2" maxLength={200} placeholder="상세주소를 입력해주세요" value={value.detailAddress} onChange={e => update('detailAddress', e.target.value)} aria-invalid={!!errors.detailAddress} aria-describedby={errors.detailAddress ? 'detail-error' : undefined} required />{errors.detailAddress && <ErrorText id="detail-error" role="alert">{errors.detailAddress}</ErrorText>}</Field>
        </Fields>
        <Information aria-labelledby="issuance-info"><h2 id="issuance-info">발급 안내</h2><p>입력한 주소로 새 키링이 발급됩니다. 주소 확인 후 신청 버튼을 눌러주세요. 배송은 3~5일 정도 소요됩니다.</p></Information>
        <PrimaryButton type="submit">새 키링 발급 신청</PrimaryButton>
        <Notice>현재는 입력 화면 미리보기입니다. 실제 발급 신청은 접수되지 않습니다.</Notice>
        <div role="status" aria-live="polite">{feedback && <Notice>{feedback}</Notice>}</div>
      </form>
      <Back type="button" onClick={() => navigate('/keyrings/lost', { replace: true })}>키링 분실 화면으로 돌아가기</Back>
    </Main><Indicator aria-hidden="true" />
  </Layout>
}

