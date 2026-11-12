import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import styled from 'styled-components'
import OnboardingLayout from '../components/onboarding/OnboardingLayout'
import { onboardingColors } from '../styles/onboarding/colors'
import { disablePreviewKeyring, readPreviewKeyring } from '../features/keyring/previewKeyring'
import logo from '../assets/keyring/logo.png'
import keyringImage from '../assets/keyring/keyring.png'
import lockDialog from '../assets/keyring/lock-dialog.png'
import notification from '../assets/keyring/notification.svg'
import back from '../assets/keyring/back.svg'
import connect from '../assets/keyring/connect.svg'
import shield from '../assets/keyring/shield.svg'
import issue from '../assets/keyring/issue.svg'
import lock from '../assets/keyring/lock.svg'

const Layout = styled(OnboardingLayout)`
  min-height: max(852px, 100dvh); color: #2a342b;
  button { font-family: inherit; cursor: pointer; }
  button:focus-visible { outline: 3px solid #09236d; outline-offset: 3px; }
  button:disabled { cursor: default; }
`
const Header = styled.header`
  display: flex; align-items: flex-start; justify-content: space-between; min-height: 67px; padding: 11px 36px 0 20px;
  > img:first-child { width: 65px; height: 23px; object-fit: contain; }
  > img:last-child { margin-top: 12px; }
`
const Back = styled.button`display: grid; place-items: center; width: 44px; height: 44px; margin-left: 19px; padding: 0; border: 0; background: transparent;`
const Intro = styled.div`
  padding: 10px 30px 30px 37px;
  h1 { margin: 0; font-size: 30px; font-weight: 600; line-height: 38px; letter-spacing: -1.2px; }
  p { margin: 10px 0 0 6px; font-size: 13px; line-height: 16px; color: #6b7d71; }
  @media (max-width: 360px) { padding-left: 24px; padding-right: 24px; h1 { font-size: 26px; } p { margin-left: 0; } }
`
const Content = styled.main`padding: 21px 30px 11px; background: rgba(213,213,213,0.2); @media (max-width: 360px) { padding: 21px 20px 11px; }`
const Card = styled.section`position: relative; padding: 20px 12px 12px; border-radius: 10px; background: white; box-shadow: 0 2px 1px #0004;`
const Details = styled.div`
  display: flex; align-items: center; gap: 9px; min-height: 83px;
  > img { width: 76px; height: 83px; object-fit: cover; opacity: ${({ $lost }) => $lost ? 0.5 : 1}; }
  h2 { margin: 9px 0 17px; font-size: 19px; line-height: 24px; }
  dl { display: flex; gap: 26px; margin: 0; }
  dt { color: #6b7d71; font-size: 9px; line-height: 13px; }
  dd { margin: 0; font-size: 13px; font-weight: 600; line-height: 18px; }
`
const Badge = styled.span`position: absolute; right: 16px; top: 18px; padding: 4px 8px; border-radius: 100px; background: ${({ $lost }) => $lost ? '#e9ebee' : '#0fcf6e'}; color: ${({ $lost }) => $lost ? '#49515b' : '#093b24'}; font-size: 8px; line-height: 10px;`
const Disable = styled.button`
  display: flex; justify-content: center; align-items: center; gap: 8px; width: 100%; min-height: 41px; margin-top: 12px;
  border: 0.5px solid #f24822; border-radius: 10px; background: white; color: #d63116; font-size: 14px;
  &:disabled { color: #69707a; border-color: #d5d8dc; background: #f4f6fa; }
`
const Warning = styled.p`margin: 9px 12px 0; color: #c83b1b; font-size: 9px; line-height: 13px;`
const Action = styled.button`
  display: flex; align-items: center; gap: 20px; width: 100%; min-height: 77px; padding: 14px 18px;
  margin-top: 17px; border: 0; border-radius: 10px; background: white; color: inherit; text-align: left; box-shadow: 0 2px 1px #0004;
  strong { display: block; font-size: 18px; line-height: 24px; }
  small { display: block; margin-top: 6px; font-size: 9px; line-height: 13px; color: #6b7d71; }
  &:active { background: #f4f6fa; }
`
const Info = styled.div`
  display: flex; align-items: center; gap: 8px; min-height: 42px; padding: 6px 11px; margin-top: 13px;
  border: 0.5px solid ${onboardingColors.primary}; border-radius: 10px; background: #e6edff;
  > span { display: grid; place-items: center; width: 27px; height: 27px; flex-shrink: 0; background: white; border: 1px solid #0002; border-radius: 7px; }
  strong { display: block; color: ${onboardingColors.primary}; font-size: 10px; line-height: 14px; }
  small { display: block; color: #5b6575; font-size: 8px; line-height: 12px; }
`
const Preview = styled.p`margin: 14px 24px; color: #69707a; text-align: center; font-size: 11px; line-height: 16px;`
const Feedback = styled.p`margin: 12px 0 0; font-size: 13px; line-height: 20px; color: #49515b;`
const Indicator = styled.div`width: 144px; height: 4px; margin: auto auto 18px; border-radius: 2px; background: #666;`
const Dialog = styled.dialog`
  width: min(327px, calc(100vw - 40px)); padding: 23px 22px 25px; border: 0; border-radius: 10px; font-family: inherit; color: #2a342b; text-align: center;
  &::backdrop { background: rgba(149,149,149,0.6); }
  > img { width: 44px; height: 44px; object-fit: cover; }
  h2 { margin: 15px 0 10px; font-size: 18px; line-height: 24px; }
  p { margin: 0 0 15px; color: #747474; font-size: 10px; line-height: 14px; }
`
const Buttons = styled.div`
  display: flex; gap: 13px;
  button { flex: 1; min-height: 34px; border: 1px solid #ccc; border-radius: 10px; background: white; font-size: 12px; }
  button:last-child { color: white; border-color: #fe0000; background: #fe0000; }
  button:disabled { opacity: 0.6; }
`

export default function KeyringLostPage() {
  const [keyring, setKeyring] = useState(readPreviewKeyring)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)
  const dialogRef = useRef(null)
  const disableRef = useRef(null)
  const titleRef = useRef(null)
  const busyRef = useRef(false)
  const location = useLocation()
  const navigate = useNavigate()
  const lost = keyring.status === 'lost'
  useEffect(() => { const previous = document.title; document.title = '키링 분실 - MODI'; return () => { document.title = previous } }, [])
  function closeDialog() { if (!busyRef.current) dialogRef.current.close() }
  async function confirmDisable() {
    if (busyRef.current || lost) return
    busyRef.current = true; setPending(true); setError('')
    try {
      const next = await disablePreviewKeyring(keyring)
      setKeyring(next)
      dialogRef.current.close()
      setMessage('예시 키링이 비활성화 상태로 변경되었습니다. 실제 키링에는 반영되지 않습니다.')
    } catch { setError('저장하지 못했어요. 브라우저 저장소 설정을 확인하고 다시 시도해주세요.') }
    finally { busyRef.current = false; setPending(false) }
  }
  return <Layout withStatusBar>
    <Header><img src={logo} alt="MODI" /><img src={notification} alt="" aria-hidden="true" /></Header>
    <Back aria-label="뒤로가기" onClick={() => location.key === 'default' ? navigate('/onboarding', { replace: true }) : navigate(-1)}><img src={back} alt="" /></Back>
    <Intro><h1 ref={titleRef} tabIndex={-1}>키링을 분실하셨나요?</h1><p>걱정하지 마세요. 분실한 키링을 즉시 비활성화하고<br />새 키링에 기존 설정을 그대로 옮길 수 있어요.</p></Intro>
    <Content>
      <Card aria-labelledby="keyring-title">
        <Badge $lost={lost}>{lost ? '비활성화됨' : '현재 사용 중'}</Badge>
        <Details $lost={lost}><img src={keyringImage} alt="" /><div><h2 id="keyring-title">나의 키링</h2><dl><div><dt>키링 ID</dt><dd>{keyring.id}</dd></div><div><dt>최종 사용 위치</dt><dd>{keyring.lastUsedLocation ?? '—'}</dd></div></dl></div></Details>
        <Disable ref={disableRef} disabled={lost || pending} onClick={() => { setError(''); dialogRef.current.showModal() }}><img src={lock} alt="" />{lost ? '분실 키링 비활성화 완료' : '분실 키링 비활성화'}</Disable>
        <Warning>{lost ? '미리보기 상태입니다. 실제 키링에는 반영되지 않았어요.' : '비활성화 후에는 이 키링으로 화면을 변경할 수 없어요'}</Warning>
      </Card>
      <Action onClick={() => setMessage('새 키링 발급 화면은 다음 작업에서 연결할 예정입니다.')}><img src={issue} alt="" /><span><strong>새 키링 발급하기</strong><small>새로운 키링을 발급하고 어플과 연결해요</small></span></Action>
      <Action onClick={() => setMessage('새 키링 연결 화면은 준비 중입니다.')}><img src={connect} alt="" /><span><strong>새 키링 연결하기</strong><small>새로운 키링을 발급하고 어플과 연결해요</small></span></Action>
      <Info><span><img src={shield} alt="" /></span><div><strong>기존 설정은 안전하게 보관됩니다</strong><small>나의 UI 설정과 이용내역은 계정에 그대로 보관돼요.</small></div></Info>
      <div role="status" aria-live="polite">{message && <Feedback>{message}</Feedback>}</div>
    </Content>
    <Preview>예시 데이터 미리보기 · 실제 키링은 변경되지 않습니다.</Preview>
    <Indicator aria-hidden="true" />
    <Dialog ref={dialogRef} aria-labelledby="disable-title" aria-describedby="disable-description" onCancel={event => { if (busyRef.current) event.preventDefault() }} onClose={() => { if (lost) titleRef.current?.focus(); else disableRef.current?.focus() }}>
      <img src={lockDialog} alt="" /><h2 id="disable-title">키링을 비활성화 할까요?</h2><p id="disable-description">비활성화하면 키링을 태그해도<br />더 이상 화면이 변경되지 않습니다.<br />현재는 예시 데이터에만 적용됩니다.</p>
      {error && <Feedback role="alert">{error}</Feedback>}
      <Buttons><button type="button" autoFocus disabled={pending} onClick={closeDialog}>취소</button><button type="button" disabled={pending} onClick={confirmDisable}>{pending ? '처리 중…' : '비활성화 하기'}</button></Buttons>
    </Dialog>
  </Layout>
}
