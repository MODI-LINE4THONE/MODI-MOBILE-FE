import { useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import styled from 'styled-components'
import KeyringFlowLayout, { Title, Description, Notice, usePreviewSearch } from '../components/keyring/KeyringFlowLayout'
import { readPreviewKeyring, disablePreviewKeyring } from '../features/keyring/previewKeyring'
import avatar from '../assets/keyring/lost-avatar-source.png'
import issue from '../assets/keyring/issue-current.svg'
import connect from '../assets/keyring/connect-current.svg'
import lock from '../assets/keyring/lock-current.svg'
import confirmLock from '../assets/keyring/lock-confirm.svg'

const Card = styled.section`margin-top: 17px; padding: 19px 15px 22px; border-radius: 30px; background: ${({ $lost }) => $lost ? '#c9ccd1' : '#f4f6fa'};`
const Row = styled.div`display: flex; align-items: center; gap: 20px; min-height: 136px; padding: 0 10px; @media(max-width:360px) { gap: 12px; padding: 0; }`
const Avatar = styled.div`
  position: relative; flex-shrink: 0; width: 120.73px; height: 130px; overflow: hidden; transform: rotate(-.11deg);
  img { position: absolute; width: 510.8%; height: 237.19%; max-width: none; left: -104.47%; top: -15.47%; }
  @media(max-width:360px) { width: 100px; height: 108px; }
`
const Details = styled.dl`
  min-width: 0; margin: 0; dt { font-size: 17px; line-height: 25px; } dd { margin: 0; color: #2456e8; font-size: 20px; font-weight: 700; line-height: 28px; } dd + dt { margin-top: 7px; }
`
const Disable = styled.button`
  display: flex; justify-content: center; align-items: center; gap: 8px; width: 100%; min-height: 54px; margin-top: 25px; padding: 8px; border: 0; border-radius: 20px; background: white; color: #d92d20; box-shadow: inset 0 0 4px #d92d204d; font-size: 18px;
`
const Warning = styled.p`margin: 7px 0 0 15px; color: #d92d20; font-size: 12px; line-height: 20px;`
const Menu = styled.button`
  display: flex; align-items: center; gap: 12px; width: 100%; min-height: 82px; margin-top: 16px; padding: 16px; border: 0; border-radius: 20px; background: #f4f6fa; text-align: left;
  strong { display: block; color: #191f28; font-size: 20px; font-weight: 500; line-height: 24px; } small { display: block; margin-top: 4px; color: #5b6575; font-size: 12px; line-height: 16px; }
`
const Dialog = styled.dialog`
  box-sizing: border-box; width: min(288px, calc(100vw - 32px)); padding: 18px 27px 20px; border: 0; border-radius: 20px; font-family: inherit; text-align: center; color: #191f28;
  &::backdrop { background: #191f2833; } > img { display: block; margin: 0 auto 9px; }
  h2 { margin: 0 0 4px; font-size: 20px; line-height: 32px; font-weight: 500; white-space: nowrap; }
  p { margin: 0 0 13px; font-size: 12px; line-height: 16px; color: #5b6575; }
`
const Actions = styled.div`display: flex; gap: 10px; button { flex: 1; min-height: 39px; padding: 8px; border: 0; border-radius: 15px; background: #f4f6fa; color: #5b6575; font-size: 14px; } button:last-child { background: #d92d20; color: white; } button:disabled { opacity: .5; }`
export default function KeyringLostPage() {
  const [keyring, setKeyring] = useState(() => readPreviewKeyring())
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [pending, setPending] = useState(false)
  const dialog = useRef(null)
  const trigger = useRef(null)
  const busy = useRef(false)
  const navigate = useNavigate()
  const location = useLocation()
  const search = usePreviewSearch()
  const lost = keyring.status === 'lost'
  async function disable() {
    if (busy.current || lost) return
    busy.current = true; setPending(true); setError('')
    try { const next = await disablePreviewKeyring(keyring); setKeyring(next); dialog.current.close(); setMessage('예시 키링이 비활성화되었습니다. 실제 키링에는 반영되지 않습니다.') }
    catch { setError('저장하지 못했어요. 다시 시도해주세요.') }
    finally { busy.current = false; setPending(false) }
  }
  return <KeyringFlowLayout title="키링 분실" onBack={() => location.state?.fromKeyring ? navigate(-1) : navigate(`/keyrings${search}`, { replace: true })}>
    <Title>키링을 분실하셨나요?</Title><Description>걱정하지 마세요. 기존 설정은 안전하게 보관됩니다.<br />분실한 키링을 즉시 비활성화하고<br />새 키링에 기존 설정을 그대로 옮길 수 있어요.</Description>
    <Card $lost={lost}><Row><Avatar><img src={avatar} alt="" /></Avatar><Details><dt>키링 ID</dt><dd>{keyring.id}</dd><dt>등록 일시</dt><dd>2026년 11월 3일<br />15시 29분</dd></Details></Row><Disable ref={trigger} disabled={lost || pending} onClick={() => { setError(''); dialog.current.showModal() }}>{!lost && <img src={lock} alt="" />}{lost ? '비활성화된 키링입니다.' : '분실 키링 비활성화'}</Disable><Warning>비활성화된 키링으로 키오스크 화면을 변경할 수 없어요.</Warning></Card>
    <Menu onClick={() => navigate(`/keyrings/issuance${search}`)}><img src={issue} alt="" /><span><strong>새 키링 발급받기</strong><small>새로운 키링을 택배로 받아요.</small></span></Menu>
    <Menu onClick={() => navigate(`/keyrings/connect${search}`)}><img src={connect} alt="" /><span><strong>새 키링 연결하기</strong><small>새로운 키링을 어플과 연결해요.</small></span></Menu>
    <Notice>예시 데이터 미리보기 · 실제 키링은 변경되지 않습니다.</Notice><div role="status">{message && <Notice>{message}</Notice>}</div>
    <Dialog ref={dialog} aria-labelledby="disable-title" onCancel={event => { if (busy.current) event.preventDefault() }} onClose={() => { if (!lost) trigger.current?.focus() }}><img src={confirmLock} alt="" /><h2 id="disable-title">키링을 비활성화 할까요?</h2><p>비활성화하면 키링을 태그해도<br />더 이상 화면이 변하지 않습니다.</p>{error && <p role="alert">{error}</p>}<Actions><button autoFocus disabled={pending} onClick={() => dialog.current.close()}>취소</button><button disabled={pending} onClick={disable}>{pending ? '처리 중…' : error ? '다시 시도' : '비활성화 하기'}</button></Actions></Dialog>
  </KeyringFlowLayout>
}
