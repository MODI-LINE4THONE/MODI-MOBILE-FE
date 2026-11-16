import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import styled from 'styled-components'
import { useSession } from '../../app/SessionContext'
import { LOGIN_PATH } from '../../app/paths'
import { onboardingColors as colors } from '../../styles/onboarding/colors'
import { onboardingFontFamily } from '../../styles/onboarding/fonts'
import avatar from '../../assets/account/avatar.svg'
import logoutIcon from '../../assets/account/logout.svg'

const Sheet = styled.dialog`
  position: fixed; inset: auto 0 0; box-sizing: border-box; width: min(393px, 100%); max-width: none;
  max-height: 90dvh; margin: 0 auto; padding: 18px 25px calc(19px + env(safe-area-inset-bottom, 0px));
  border: 0; border-radius: 25px 25px 0 0; background: ${colors.background}; color: ${colors.text}; font-family: ${onboardingFontFamily};
  &::backdrop { background: ${({ $confirm }) => $confirm ? 'transparent' : colors.dimmed}; }
  h2 { margin: 26px 0 13px; font-size: 20px; font-weight: 500; line-height: 24px; }
  button { font-family: inherit; cursor: pointer; }
  button:focus-visible { outline: 2px solid ${colors.text}; outline-offset: 3px; }
`
const Handle = styled.div`width: 70px; height: 6px; margin: 0 auto; border-radius: 3px; background: #dee1e9;`
const User = styled.div`
  display: flex; gap: 15px; align-items: center; min-height: 90px; padding: 0 15px; border-radius: 20px; background: ${colors.cardBackground};
  img { flex-shrink: 0; }
  div { min-width: 0; }
  strong { display: block; overflow-wrap: anywhere; font-size: 18px; font-weight: 500; line-height: 32px; }
  p { margin: 0; color: ${colors.textSub}; font-size: 14px; line-height: 18px; }
`
const Logout = styled.button`
  display: flex; align-items: center; justify-content: center; gap: 10px; width: 100%; min-height: 50px; margin-top: 14px;
  padding: 9px; border: 0; border-radius: 15px; background: ${colors.cardBackground}; color: ${colors.textSub}; font-size: 18px; font-weight: 500; line-height: 32px;
  &:active { background: ${colors.cardPressed}; }
`
const Confirm = styled.dialog`
  box-sizing: border-box; width: min(288px, calc(100% - 32px)); max-width: none; padding: 23px 27px 20px; margin: auto;
  border: 0; border-radius: 20px; color: ${colors.text}; background: white; text-align: center; font-family: ${onboardingFontFamily};
  &::backdrop { background: ${colors.dimmed}; }
  h2 { margin: 0; font-size: 20px; font-weight: 500; line-height: 32px; }
  p { margin: 6px -8px 12px; font-size: 12px; line-height: 18px; color: ${colors.textSub}; }
`
const Actions = styled.div`
  display: flex; gap: 10px;
  button { flex: 1; min-width: 0; min-height: 39px; padding: 4px; border: 0; border-radius: 15px; background: ${colors.cardBackground}; color: ${colors.textSub}; font-family: inherit; font-size: 14px; font-weight: 500; line-height: 31px; cursor: pointer; }
  button:last-child { background: ${colors.primary}; color: white; }
  button:disabled { opacity: .6; cursor: wait; }
  button:focus-visible { outline: 2px solid ${colors.text}; outline-offset: 2px; }
`
export default function AccountMenu({ onClose, target }) {
  const { userId, profile, logOut } = useSession()
  const navigate = useNavigate()
  const sheet = useRef(null)
  const confirm = useRef(null)
  const busy = useRef(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  useEffect(() => {
    const panel = sheet.current
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    panel.showModal()
    return () => { panel.close(); document.body.style.overflow = previous }
  }, [])
  function openConfirm() { setError(''); setConfirmOpen(true); confirm.current.showModal() }
  function cancel() { if (!busy.current) { confirm.current.close(); setConfirmOpen(false) } }
  async function submit() {
    if (busy.current) return
    busy.current = true; setPending(true); setError('')
    try { await logOut(); navigate(LOGIN_PATH, { replace: true }) }
    catch (err) { setError(err.message || '로그아웃하지 못했습니다. 다시 시도해주세요.') }
    finally { busy.current = false; setPending(false) }
  }
  return <>
    <Sheet ref={sheet} $confirm={confirmOpen} aria-labelledby="account-title" onCancel={event => { event.preventDefault(); if (!busy.current) onClose() }} onClick={event => {
      if (event.target !== event.currentTarget || busy.current) return
      const bounds = event.currentTarget.getBoundingClientRect()
      if (event.clientY < bounds.top || event.clientX < bounds.left || event.clientX > bounds.right) onClose()
    }}>
      <Handle aria-hidden="true" /><h2 id="account-title">내 회원 정보</h2>
      <User><img src={avatar} alt="" /><div><strong>{userId ?? 'user01'}</strong><p>{(target ?? profile.target) === 'family' ? '가족·보호대상자 사용자' : '본인 사용자'}</p></div></User>
      <Logout autoFocus onClick={openConfirm}><img src={logoutIcon} alt="" />로그아웃</Logout>
    </Sheet>
    <Confirm ref={confirm} aria-labelledby="logout-title" aria-describedby="logout-description" onCancel={event => { event.preventDefault(); cancel() }} onClose={() => setConfirmOpen(false)}>
      <h2 id="logout-title">로그아웃할까요?</h2><p id="logout-description">로그아웃해도 키링은 그대로 쓸 수 있어요.<br />다시 이용하려면 아이디로 로그인해요.</p>
      {error && <p role="alert">{error}</p>}
      <Actions><button autoFocus disabled={pending} onClick={cancel}>취소</button><button disabled={pending} onClick={submit}>{pending ? '처리 중…' : '로그아웃'}</button></Actions>
    </Confirm>
  </>
}
