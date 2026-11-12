import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import styled from 'styled-components'
import OnboardingLayout from '../components/onboarding/OnboardingLayout'
import PrimaryButton from '../components/onboarding/PrimaryButton'
import { onboardingColors } from '../styles/onboarding/colors'
import { optionDefinitions, readSettings, saveSettings } from '../features/personalization/settingsStorage'
import elderly from '../assets/personalization/elderly.png'
import wheelchair from '../assets/personalization/wheelchair.png'
import color from '../assets/personalization/color.png'
import back from '../assets/personalization/back.svg'
import recommend from '../assets/personalization/recommend.svg'
import settings from '../assets/personalization/settings.svg'
import selected from '../assets/personalization/selected.svg'
import check from '../assets/personalization/check.svg'
import unselected from '../assets/personalization/unselected.svg'

const presets = [
  { id: 'elderly', title: '고령자 추천', image: elderly, lines: ['큰 글씨와 쉬운 구조로', '편하게 이용할 수 있어요.'], tags: ['큰 글씨', '고대비', '하단 조작'] },
  { id: 'wheelchair', title: '휠체어 이용자 추천', image: wheelchair, lines: ['주요 버튼을 아래에 배치해', '손쉽게 조작할 수 있어요.'], tags: ['하단 조작', '큰 버튼'] },
  { id: 'color', title: '색상 구분 강화 추천', image: color, lines: ['색상을 명확하게 구분해', '더 쉽게 확인할 수 있어요.'], tags: ['고대비', '강한 색상'] },
]
const Layout = styled(OnboardingLayout)`
  min-height: max(852px, 100dvh); color: #202329;
  button { font-family: inherit; cursor: pointer; }
  button:focus-visible, input:focus-visible { outline: 3px solid #09236d; outline-offset: 4px; }
`
const Main = styled.main`display: flex; flex: 1; flex-direction: column; padding: 0 24px;`
const Header = styled.header`
  display: flex; align-items: center; gap: 6px; height: 48px;
  h1 { margin: 0; font-size: 21px; line-height: 30px; }
`
const Back = styled.button`display: grid; place-items: center start; width: 36px; height: 44px; padding: 0; border: 0; background: transparent;`
const Intro = styled.h2`margin: 14px 0 20px; font-size: 24px; line-height: 32px; font-weight: 600;`
const Tabs = styled.div`display: flex; min-height: 52px; border: 1px solid #e9ebee; border-radius: 26px;`
const Tab = styled.button`
  display: flex; flex: 1; align-items: center; justify-content: center; gap: 9px;
  border: 0; border-radius: 26px; padding: 12px 6px; font-size: 16px;
  background: ${({ $active }) => $active ? '#e6edff' : 'transparent'};
  color: ${({ $active }) => $active ? '#09236d' : '#646a73'};
  font-weight: ${({ $active }) => $active ? 700 : 400};
  img { opacity: ${({ $active }) => $active ? 1 : 0.65}; }
`
const Cards = styled.div`display: grid; gap: 16px; margin-top: 44px;`
const Card = styled.label`
  position: relative; display: flex; align-items: center; gap: 18px; min-height: 132px; padding: 13px 15px;
  border: 1.5px solid ${({ $active }) => $active ? onboardingColors.primary : '#e7e9ed'};
  border-radius: 14px; background: ${({ $active }) => $active ? '#f2f2f2' : '#fff'}; cursor: pointer;
  > input { position: absolute; opacity: 0; width: 20px; height: 20px; right: 15px; top: 13px; }
  &:has(input:focus-visible) { outline: 3px solid #09236d; outline-offset: 3px; }
  @media (max-width: 360px) { gap: 10px; padding: 13px 10px; }
`
const Illustration = styled.img`width: 74px; height: 74px; object-fit: cover; flex-shrink: 0; @media (max-width: 360px) { width: 58px; height: 58px; }`
const CardText = styled.div`
  flex: 1; min-width: 0;
  h3 { margin: 0 20px 7px 0; font-size: 18px; line-height: 26px; letter-spacing: -0.6px; }
  p { margin: 0; color: #69707a; font-size: 13px; line-height: 19px; }
`
const Tags = styled.div`display: flex; flex-wrap: wrap; gap: 6px; margin-top: 12px; span { background: #dae4ff; color: #5d554e; border-radius: 12px; padding: 4px 12px; font-size: 11px; font-weight: 700; line-height: 16px; }`
const Mark = styled.span`position: absolute; top: 13px; right: 15px; width: 20px; height: 20px; img { position: absolute; inset: 0; } img + img { inset: 3px; }`
const Options = styled.div`display: grid; gap: 21px; margin: 36px 6px 0;`
const Option = styled.label`
  display: flex; align-items: center; justify-content: space-between; gap: 8px; min-height: 74px;
  padding: 13px 26px; border: 1px solid #ccc; border-radius: 10px; cursor: pointer;
  strong { display: block; font-size: 17px; color: #57614a; line-height: 24px; }
  small { display: block; margin-top: 5px; font-size: 11px; color: #68796e; line-height: 16px; }
  @media (max-width: 360px) { padding: 13px; }
`
const Switch = styled.input.attrs({ type: 'checkbox', role: 'switch' })`
  appearance: none; position: relative; flex-shrink: 0; width: 52px; height: 32px; margin: 0;
  border: 2px solid #89998f; border-radius: 20px; background: white; cursor: pointer;
  &::after { content: ''; position: absolute; width: 16px; height: 16px; left: 5px; top: 6px; border-radius: 50%; background: #adafb2; }
  &:checked { border-color: ${onboardingColors.primary}; background: ${onboardingColors.primary}; }
  &:checked::after { width: 24px; height: 24px; left: 22px; top: 2px; background: white; }
`
const Footer = styled.footer`margin-top: auto; padding-top: 34px;`
const Save = styled(PrimaryButton)`height: 56px; border-radius: 12px;`
const Notice = styled.p`margin: 8px 0 0; color: #69707a; font-size: 11px; text-align: center; line-height: 16px;`
const Indicator = styled.div`width: 144px; height: 4px; margin: 14px auto 16px; border-radius: 2px; background: #666;`
const Dialog = styled.dialog`
  width: min(327px, calc(100vw - 40px)); padding: 22px; border: 0; border-radius: 10px; color: #2a342b;
  font-family: inherit;
  &::backdrop { background: rgba(149,149,149,0.6); }
  h2 { margin: 0 10px 14px; font-size: 22px; }
  p { margin: 0 10px 18px; font-size: 13px; line-height: 20px; color: #747474; }
`
const Actions = styled.div`display: flex; gap: 13px; button { flex: 1; min-height: 34px; border: 1px solid #ccc; background: white; border-radius: 10px; } button:last-child { background: #6c6e72; color: white; border-color: #6c6e72; }`

export default function AccessibilitySettingsPage() {
  const [value, setValue] = useState(readSettings)
  const [error, setError] = useState('')
  const dialogRef = useRef(null)
  const saveRef = useRef(null)
  const navigate = useNavigate()
  const location = useLocation()
  useEffect(() => { const previous = document.title; document.title = '접근성 설정 - MODI'; return () => { document.title = previous } }, [])
  function closeDialog() { dialogRef.current.close(); saveRef.current?.focus() }
  function save() {
    try { saveSettings(value); setError(''); dialogRef.current.showModal() }
    catch { setError('설정을 저장하지 못했어요. 브라우저 저장소 설정을 확인하고 다시 시도해주세요.') }
  }
  function tabKeyDown(event) {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
    event.preventDefault()
    const mode = event.key === 'Home' ? 'recommended' : event.key === 'End' ? 'custom' : value.mode === 'recommended' ? 'custom' : 'recommended'
    setValue({ ...value, mode }); document.getElementById(`tab-${mode}`)?.focus()
  }
  return <Layout withStatusBar>
    <Main>
      <Header><Back aria-label="뒤로가기" onClick={() => location.key === 'default' ? navigate('/onboarding', { replace: true }) : navigate(-1)}><img src={back} alt="" /></Back><h1>접근성 설정</h1></Header>
      <Intro>원하는 방식으로<br />화면을 설정해 보세요.</Intro>
      <Tabs role="tablist" aria-label="설정 방식" onKeyDown={tabKeyDown}>
        {[['recommended', '추천 조합', recommend], ['custom', '직접 설정', settings]].map(([mode, label, icon]) => <Tab key={mode} id={`tab-${mode}`} role="tab" aria-selected={value.mode === mode} aria-controls={`panel-${mode}`} tabIndex={value.mode === mode ? 0 : -1} $active={value.mode === mode} onClick={() => setValue({ ...value, mode })}><img src={icon} alt="" />{label}</Tab>)}
      </Tabs>
      {value.mode === 'recommended' ? <section role="tabpanel" id="panel-recommended" aria-labelledby="tab-recommended">
        <Cards role="radiogroup" aria-label="추천 조합">
          {presets.map(preset => <Card key={preset.id} $active={value.preset === preset.id}>
            <input type="radio" name="preset" value={preset.id} checked={value.preset === preset.id} onChange={() => setValue({ ...value, preset: preset.id })} aria-label={preset.title} />
            <Illustration src={preset.image} alt="" /><CardText><h3>{preset.title}</h3><p>{preset.lines[0]}<br />{preset.lines[1]}</p><Tags>{preset.tags.map(tag => <span key={tag}>{tag}</span>)}</Tags></CardText>
            <Mark aria-hidden="true"><img src={value.preset === preset.id ? selected : unselected} alt="" />{value.preset === preset.id && <img src={check} alt="" />}</Mark>
          </Card>)}
        </Cards>
      </section> : <section role="tabpanel" id="panel-custom" aria-labelledby="tab-custom"><Options>
        {optionDefinitions.map(option => <Option key={option.id}><span><strong>{option.label}</strong><small id={`${option.id}-description`}>{option.description}</small></span><Switch aria-label={option.label} aria-describedby={`${option.id}-description`} checked={value.options[option.id]} onChange={event => setValue({ ...value, options: { ...value.options, [option.id]: event.target.checked } })} /></Option>)}
      </Options></section>}
      <Footer><Save ref={saveRef} onClick={save}>{value.mode === 'recommended' ? '이 조합으로 설정하기' : '설정 저장하기'}</Save><Notice>현재 설정은 이 브라우저에만 저장됩니다.</Notice>{error && <Notice role="alert">{error}</Notice>}</Footer>
    </Main><Indicator aria-hidden="true" />
    <Dialog ref={dialogRef} aria-labelledby="saved-title" aria-describedby="saved-description" onCancel={() => saveRef.current?.focus()}><h2 id="saved-title">저장 완료</h2><p id="saved-description">접근성 설정이 이 브라우저에 저장되었습니다.</p><Actions><button type="button" onClick={closeDialog}>닫기</button><button type="button" onClick={closeDialog} autoFocus>확인</button></Actions></Dialog>
  </Layout>
}
