import RemoteProfile from '../components/keyring/RemoteProfile'
import { profileApi, settingsFromProfile } from '../features/personalization/profileApi.js'
import { useEffect, useRef, useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router'
import { useFamilies } from '../app/FamilyContext'
import { useSession } from '../app/SessionContext'
import { familySettings } from '../features/family/familyState'
import styled from 'styled-components'
import OnboardingLayout from '../components/onboarding/OnboardingLayout'
import OnboardingHeader from '../components/onboarding/OnboardingHeader'
import PrimaryButton from '../components/onboarding/PrimaryButton'
import { optionDefinitions, optionsForPreset, presetOptions, readSettings, saveSettings, settingsChanged } from '../features/personalization/settingsStorage'
import elderly from '../assets/personalization/elderly.png'
import wheelchair from '../assets/personalization/wheelchair.png'
import color from '../assets/personalization/color.png'
import recommendActive from '../assets/personalization/recommend-active.svg'
import recommendInactive from '../assets/personalization/recommend-inactive.svg'
import settingsActive from '../assets/personalization/settings-active.svg'
import settingsInactive from '../assets/personalization/settings-inactive.svg'
import circle from '../assets/personalization/avatar-circle.svg'
import selected from '../assets/personalization/selected-check.svg'
import unselected from '../assets/personalization/unselected.svg'
import success from '../assets/personalization/success.svg'

const presets = [
  { id: 'elderly', title: '고령자 추천', image: elderly, description: '큰 글씨와 쉬운 구조로 편하게 이용할 수 있어요.' },
  { id: 'wheelchair', title: '휠체어 이용자 추천', image: wheelchair, description: '주요 버튼을 아래에 배치해 쉽게 조작해요.' },
  { id: 'color', title: '색상 구분 강화 추천', image: color, description: '색을 명확하게 구분해 쉽게 확인할 수 있어요.' },
]
const Layout = styled(OnboardingLayout)`
  min-height: max(852px, 100dvh);
  button { font-family: inherit; cursor: pointer; }
  button:focus-visible, input:focus-visible { outline: 2px solid #191f28; outline-offset: 3px; }
`
const Main = styled.main`display: flex; flex: 1; flex-direction: column; padding: 0 25px; outline: none;`
const Intro = styled.h2`margin: 0 2px 16px; font-size: 20px; line-height: 32px; font-weight: 500; letter-spacing: -.6px;`
const Tabs = styled.div`display: flex; flex-shrink: 0; height: 52px; border: .5px solid #f4f6fa; border-radius: 26px; box-shadow: inset 0 0 4px #f4f6fa;`
const Tab = styled.button`
  display: flex; flex: 1; align-items: center; justify-content: center; gap: 6px; padding: 0; border: 0; border-radius: 26px; font-size: 18px; font-weight: 500;
  background: ${({ $active }) => $active ? '#e8effe' : 'white'}; color: ${({ $active }) => $active ? '#191f28' : '#5b6575'};
`
const Cards = styled.div`display: grid; gap: 12px; margin-top: 47px;`
const Card = styled.label`
  position: relative; display: block; min-height: 124px; padding: 12px; border-radius: 20px; cursor: pointer;
  background: ${({ $active }) => $active ? '#dee1e9' : '#f4f6fa'};
  > input { position: absolute; right: 16px; top: 17px; opacity: 0; }
  &:has(input:focus-visible) { outline: 2px solid #191f28; outline-offset: 3px; }
`
const CardTop = styled.div`display: flex; gap: 12px; min-height: 60px; align-items: center;`
const Avatar = styled.span`
  position: relative; display: grid; place-items: center; width: 60px; height: 60px; flex-shrink: 0;
  > img:first-child { position: absolute; inset: 0; }
  > img:last-child { position: relative; width: ${({ $small }) => $small ? 38 : 45}px; height: ${({ $small }) => $small ? 38 : 45}px; object-fit: cover; }
`
const CardText = styled.div`
  min-width: 0; flex: 1;
  h3 { margin: 0 22px 0 0; font-size: 18px; line-height: 32px; font-weight: 500; letter-spacing: -.5px; }
  p { margin: 0; color: #5b6575; font-size: 12px; line-height: 18px; letter-spacing: -.55px; }
`
const Tags = styled.div`display: flex; flex-wrap: wrap; gap: 6px; margin-top: 11px; span { padding: 4px 6px; border-radius: 10px; background: white; color: #2456e8; font-size: 12px; line-height: 17px; font-weight: 500; box-shadow: inset 0 0 2px #2456e840; }`
const Mark = styled.img`position: absolute; top: 17px; right: 16px;`
const Options = styled.div`display: grid; gap: 12px; margin-top: 26px;`
const Option = styled.label`
  position: relative; display: flex; align-items: flex-start; min-height: 84px; padding: 14px 16px; border-radius: 20px; background: ${({ $active }) => $active ? '#dee1e9' : '#f4f6fa'}; cursor: pointer;
  > span { width: 100%; }
  strong { display: block; padding-right: 64px; font-size: 20px; line-height: 26px; font-weight: 500; }
  small { display: block; max-width: 247px; color: #5b6575; font-size: 14px; line-height: 24px; letter-spacing: -.7px; }
`
const Switch = styled.input.attrs({ type: 'checkbox', role: 'switch' })`
  appearance: none; position: absolute; top: 26px; right: 16px; width: 52px; height: 32px; margin: 0; border: 2px solid #5b6575; border-radius: 20px; background: transparent; cursor: pointer;
  &::after { content: ''; position: absolute; width: 16px; height: 16px; top: 6px; left: 5px; border-radius: 50%; background: #5b6575; }
  &:checked { border-color: #2456e8; background: #2456e8; }
  &:checked::after { width: 24px; height: 24px; top: 2px; left: 22px; background: white; }
`
const Footer = styled.footer`margin-top: auto; padding-top: ${({ $custom }) => $custom ? 25 : 46}px; padding-bottom: 64px;`
const Notice = styled.p`margin: 5px 0 0; color: #5b6575; font-size: 11px; line-height: 16px; text-align: center;`
const Dialog = styled.dialog`
  box-sizing: border-box; width: min(288px, calc(100vw - 32px)); padding: 24px 20px; border: 0; border-radius: 20px; text-align: center; font-family: inherit; color: #191f28;
  &::backdrop { background: #191f2833; }
  > img { display: block; margin: 0 auto; }
  h2 { margin: 9px 0 14px; font-size: 20px; line-height: 32px; font-weight: 500; }
  button { width: 218px; max-width: 100%; min-height: 39px; border: 0; border-radius: 15px; background: #f4f6fa; color: #2456e8; font-size: 18px; font-weight: 500; }
`
export default function AccessibilitySettingsPage() {
  const { search } = useLocation()
  const params = new URLSearchParams(search)
  const familyId = params.get('familyId')
  const { profiles } = useFamilies()
  const { userId, profile } = useSession()
  const preview = import.meta.env.DEV && ['self', 'family'].includes(params.get('preview'))
  if (!preview && !userId) return <Navigate to="/onboarding/login" replace />
  if (!preview) return <RemoteProfile preferredId={params.get('profileId') ?? familyId ?? profile.profileId}>{serverProfile => <SettingsEditor key={serverProfile.profileId} serverProfile={serverProfile} />}</RemoteProfile>
  if (familyId && !userId && !preview) return <Navigate to="/onboarding/login" replace />
  const family = familyId ? profiles.find(profile => profile.id === familyId) : null
  if (familyId && !family) return <Navigate to={`/home${preview ? '?preview=family' : ''}`} replace />
  return <SettingsEditor key={familyId ?? 'self'} family={family} />
}
function SettingsEditor({ family, serverProfile }) {
  const [value, setValue] = useState(() => serverProfile ? settingsFromProfile(serverProfile) : family ? familySettings(family) : readSettings())
  const { saveFamilySettings } = useFamilies()
  const [saved, setSaved] = useState(value)
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)
  const busy = useRef(false)
  const dialogRef = useRef(null)
  const saveRef = useRef(null)
  const mainRef = useRef(null)
  const navigate = useNavigate()
  const location = useLocation()
  const preview = import.meta.env.DEV ? new URLSearchParams(location.search).get('preview') : null
  const returnToPractice = new URLSearchParams(location.search).get('returnTo') === 'practice'
  const practiceSearch = new URLSearchParams({ ...(serverProfile ? { profileId: String(serverProfile.profileId) } : {}), ...(preview === 'self' ? { preview: 'self' } : {}) })
  const practicePath = `/practice${practiceSearch.size ? '?' + practiceSearch : ''}`
  const homePath = returnToPractice ? practicePath : family ? `/families/${encodeURIComponent(family.id)}${preview === 'family' ? '?preview=family' : ''}` : preview === 'self' ? '/home?preview=self' : '/home'
  // 저장 완료 팝업 버튼: 본인 사용자는 키오스크 연습으로 (연습에서 들어온 경우와 가족은 그대로)
  const { profile: sessionProfile } = useSession()
  const isSelf = preview ? preview === 'self' : sessionProfile.target !== 'family'
  const practiceNext = !returnToPractice && !family && isSelf
  const popupPath = practiceNext ? practicePath : homePath
  const popupLabel = returnToPractice ? '연습으로 돌아가기' : family ? '프로필로 돌아가기' : practiceNext ? '키오스크 연습하러 가기' : '홈으로 돌아가기'
  const changed = settingsChanged(value, saved)
  useEffect(() => { const previous = document.title; document.title = '접근성 설정 - MODI'; mainRef.current?.focus(); window.scrollTo(0, 0); return () => { document.title = previous } }, [])
  async function save() {
    if (!changed || busy.current) return
    const next = value.mode === 'recommended' ? { ...value, options: optionsForPreset(value.preset) } : value
    busy.current = true; setPending(true); setError('')
    try {
      if (serverProfile) {
        const confirmed = await profileApi.save(serverProfile.profileId, next)
        // 서버 응답에는 탭·추천 조합 정보가 없어 보던 탭(mode)과 조합(preset)은 그대로 둔다
        const kept = { ...confirmed, mode: next.mode, preset: next.preset }
        setValue(kept); setSaved(kept)
      } else {
        if (family) saveFamilySettings(family.id, next); else saveSettings(next)
        setValue(next); setSaved(next)
      }
      dialogRef.current?.showModal()
    } catch (err) { setError(err.message || '설정을 저장하지 못했어요. 다시 시도해주세요.') }
    finally { busy.current = false; setPending(false) }
  }
  function tabKeyDown(event) {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
    event.preventDefault()
    const mode = event.key === 'Home' ? 'recommended' : event.key === 'End' ? 'custom' : value.mode === 'recommended' ? 'custom' : 'recommended'
    setValue({ ...value, mode }); document.getElementById(`tab-${mode}`)?.focus()
  }
  return <Layout>
    <OnboardingHeader title="접근성 설정" onBack={() => navigate(homePath, { replace: true })} />
    <Main ref={mainRef} tabIndex={-1}>
      <Intro>원하는 방식으로 화면을 설정해 보세요.</Intro>
      {family && <Notice>{family.name}님의 설정 · 새로고침하면 임시 변경 내용이 초기화됩니다.</Notice>}
      <fieldset disabled={pending} style={{ border: 0, padding: 0, margin: 0, minWidth: 0 }}><legend style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden' }}>접근성 옵션</legend>
      <Tabs role="tablist" aria-label="설정 방식" onKeyDown={tabKeyDown}>
        {[['recommended', '추천 조합', recommendActive, recommendInactive], ['custom', '직접 설정', settingsActive, settingsInactive]].map(([mode, label, active, inactive]) => <Tab key={mode} id={`tab-${mode}`} role="tab" aria-selected={value.mode === mode} aria-controls={`panel-${mode}`} tabIndex={value.mode === mode ? 0 : -1} $active={value.mode === mode} onClick={() => setValue({ ...value, mode })}><img src={value.mode === mode ? active : inactive} alt="" />{label}</Tab>)}
      </Tabs>
      {value.mode === 'recommended' ? <section role="tabpanel" id="panel-recommended" aria-labelledby="tab-recommended"><Cards role="radiogroup" aria-label="추천 조합">
        {presets.map(preset => <Card key={preset.id} $active={value.preset === preset.id}>
          <input type="radio" name="preset" checked={value.preset === preset.id} onChange={() => setValue({ ...value, preset: preset.id })} aria-label={preset.title} />
          <CardTop><Avatar $small={preset.id === 'wheelchair'}><img src={circle} alt="" /><img src={preset.image} alt="" /></Avatar><CardText><h3>{preset.title}</h3><p>{preset.description}</p></CardText></CardTop>
          <Tags>{presetOptions[preset.id].map(id => <span key={id}>{optionDefinitions.find(option => option.id === id).label}</span>)}</Tags>
          <Mark src={value.preset === preset.id ? selected : unselected} alt="" aria-hidden="true" />
        </Card>)}
      </Cards></section> : <section role="tabpanel" id="panel-custom" aria-labelledby="tab-custom"><Options>
        {optionDefinitions.map(option => <Option key={option.id} $active={value.options[option.id]}><span><strong>{option.label}</strong><small id={`${option.id}-description`}>{option.description}</small></span><Switch aria-label={option.label} aria-describedby={`${option.id}-description`} checked={value.options[option.id]} onChange={event => setValue({ ...value, options: { ...value.options, [option.id]: event.target.checked } })} /></Option>)}
      </Options></section>}
      </fieldset>
      <Footer $custom={value.mode === 'custom'}><PrimaryButton ref={saveRef} disabled={!changed || pending} onClick={save}>{pending ? '저장 중…' : '이 조합으로 저장하기'}</PrimaryButton>{error && <Notice role="alert">{error}</Notice>}</Footer>
    </Main>
    <Dialog ref={dialogRef} aria-labelledby="saved-title" onClose={() => saveRef.current?.focus()}><img src={success} alt="" /><h2 id="saved-title">접근성 설정 저장 완료</h2><button type="button" autoFocus onClick={() => { dialogRef.current.close(); navigate(popupPath, { replace: true }) }}>{popupLabel}</button></Dialog>
  </Layout>
}
