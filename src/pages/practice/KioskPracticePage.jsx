import { useEffect, useLayoutEffect, useReducer, useRef, useState } from 'react'
import { Navigate, useNavigate, useSearchParams } from 'react-router'
import OnboardingHeader from '../../components/onboarding/OnboardingHeader'
import PrimaryButton from '../../components/onboarding/PrimaryButton'
import RemoteProfile from '../../components/keyring/RemoteProfile'
import { useSession } from '../../app/SessionContext'
import { profileApi, settingsFromProfile } from '../../features/personalization/profileApi.js'
import { emptyOptions, optionDefinitions, readSettings } from '../../features/personalization/settingsStorage.js'
import { practiceAssets as a } from '../../features/practice/assets.js'
import { nearestTouchTarget } from '../../features/practice/touchCorrection.js'
import { contrastAssets as ca } from '../../features/practice/contrastAssets.js'
import { initialPractice, practiceReducer, practiceSteps, menuItems, cartTotal, canContinue } from '../../features/practice/practiceState.js'
import * as S from './PracticeStyles'

const info = {
  place: ['어디서 드실지 골라볼까요?', '이번 연습에서는 매장을 선택해요.', '매장에서 먹을지 포장해서 나갈지 선택해요.\n일부 매장에서는 포장을 테이크아웃이라고 해요.'],
  menu: ['메뉴를 골라볼까요?', '이번 연습에서는 아메리카노를 선택해요.', '메뉴의 사진이나 이름을 보고\n원하는 메뉴를 선택해요.'],
  options: ['옵션을 선택해 볼까요?', '온도와 사이즈를 원하는 대로 선택해요.', '주어진 순서대로, 온도를 먼저 고르고\n그 다음 사이즈를 선택하면 어렵지 않아요.'],
  add: ['장바구니에 담아볼까요?', '수량을 확인하고 담기 버튼을 눌러요.', '수량은 +와 - 버튼으로 바꿀 수 있어요.\n한 잔이면 버튼 조작 없이 담기 버튼을 눌러요.'],
  cart: ['담은 메뉴를 확인해 볼까요?', '메뉴와 금액이 맞는지 보고 주문하기를 눌러요.', '메뉴를 잘못 담았다면 x 버튼으로 뺄 수 있어요.\n메뉴 더 보기를 눌러서 메뉴를 다시 골라요.'],
  payment: ['결제 방법을 골라볼까요?', '이번 연습에서는 카드를 선택해요.', '연습에서는 실제 결제가 되지 않아요.\n편하게 눌러보세요.'],
  card: ['카드를 넣어볼까요?', '화면의 카드를 눌러 결제를 연습해요.', '실제 키오스크에서는 키오스크 기계의\n투입구에 직접 카드를 넣어요.'],
  order: ['주문이 완료됐어요.', '주문 번호를 확인하고 메뉴를 기다려요.', '번호가 불리거나 화면에 뜨면\n주문한 메뉴를 받으러 가요.'],
}
const finishLabels = ['매장/포장 선택', '메뉴 찾기', '옵션 선택', '장바구니 담기', '장바구니 확인', '결제방법 선택', '카드 결제', '주문 완료']
const formatPrice = amount => `${amount.toLocaleString('ko-KR')}원`
const sizeText = { S: '작게', M: '기본', L: '크게' }
const optionText = item => `${item.temperature === 'ice' ? '아이스' : '핫'} ${item.size}(${sizeText[item.size]})`

// 피그마의 70px 원형 마스크에 대응하는 이미지 배치.
const crops = {
  americano: [105, 70, -17.4, 0], matcha: [105, 70, -17.5, 0], latte: [105, 70, -17.5, 0], mocha: [105, 70, -17.5, 0],
  tea: [71.872, 77.487, -1.872, -3.742], chocolate: [73.345, 81.468, -2.628, -8.84],
  espresso: [119.936, 77.58, -27.643, -7.578], strawberry: [74.828, 81.667, -4.828, -2.816], shake: [74.828, 81.667, -4.425, 0],
  icecream: [72.454, 72.454, -2.309, 0], cheese: [73.345, 81.468, -3.345, .477], mango: [73.345, 81.468, .956, -8.602],
}
function Photo({ id, size = 70 }) {
  const [width, height, left, top] = crops[id]
  return <S.Picture $size={size} aria-hidden="true"><span><img src={a[id]} alt="" style={{ width, height, left, top }} /></span></S.Picture>
}

export default function KioskPracticePage() {
  const { userId, profile } = useSession()
  const [params] = useSearchParams()
  const preview = import.meta.env.DEV && params.get('preview') === 'self'
  if (!userId && !preview) return <Navigate to="/onboarding/login" replace />
  if (preview) {
    const settings = readSettings()
    const variant = params.get('variant')
    if (['base', 'contrast', 'guidance'].includes(variant)) {
      settings.options = { ...emptyOptions(), highContrast: variant === 'contrast', touchGuidance: variant === 'guidance' }
    }
    return <Practice settings={settings} preview />
  }
  return <PracticeLoader key={userId} preferredId={params.get('profileId') ?? profile.profileId} loginId={userId} target={profile.target} />
}

function PracticeLoader({ preferredId, loginId, target }) {
  const [loaded, setLoaded] = useState(null)
  const [error, setError] = useState('')
  const [attempt, setAttempt] = useState(0)
  const navigate = useNavigate()
  useEffect(() => {
    let active = true
    setLoaded(null); setError('')
    profileApi.list().then(async profiles => {
      const match = profiles.find(profile => String(profile.profileId) === String(preferredId))
        ?? (!preferredId && target === 'self' ? profiles.find(profile => profile.name === loginId) : null)
        ?? (!preferredId && profiles.length === 1 ? profiles[0] : null)
      const detail = match ? await profileApi.detail(match.profileId) : null
      if (active) setLoaded({ profiles, detail })
    }).catch(err => { if (active) setError(err.message) })
    return () => { active = false }
  }, [preferredId, loginId, target, attempt])
  if (loaded?.detail) return <Practice key={loaded.detail.profileId} profileId={loaded.detail.profileId} settings={settingsFromProfile(loaded.detail)} />
  if (loaded?.profiles.length === 0) return <Practice settings={{ mode: 'custom', preset: null, options: emptyOptions() }} />
  if (loaded) return <RemoteProfile preferredId={preferredId}>{profile => <Practice key={profile.profileId} profileId={profile.profileId} settings={settingsFromProfile(profile)} />}</RemoteProfile>
  return <S.Layout><OnboardingHeader title="키오스크 연습" onBack={() => navigate('/home')} /><S.Main><S.Empty><p role={error ? 'alert' : 'status'}>{error || '저장된 접근성 설정을 불러오는 중입니다.'}</p></S.Empty>{error && <PrimaryButton onClick={() => setAttempt(value => value + 1)}>다시 시도</PrimaryButton>}</S.Main></S.Layout>
}

function Tutorial() {
  const rows = [
    [<S.Pill key="next">다음 <img src={a.next} alt="" /></S.Pill>, '다음 단계로 넘어가요.'],
    [<S.Pill key="prev"><img src={a.prev} alt="" /> 이전</S.Pill>, '앞 단계로 돌아가요.'],
    [<S.Pill key="home"><img src={a.home} alt="" /> 처음으로</S.Pill>, '첫 화면으로 돌아가요.'],
    [<S.Pill key="cart"><img src={a.cart} alt="" /> 장바구니</S.Pill>, '담은 메뉴를 확인해요.'],
    [<span key="quantity" style={{ display: 'flex', gap: 8 }}><S.Pill>＋</S.Pill><S.Pill>−</S.Pill></span>, '수량을 늘리거나 줄여요.'],
    [<S.Pill key="choose"><img src={a.tick} alt="" /> 선택하기</S.Pill>, '메뉴나 옵션을 골라요.'],
  ]
  return <><S.TutorialCard>{rows.map(([icon, text]) => <S.TutorialRow key={text}>{icon}<p>{text}</p></S.TutorialRow>)}</S.TutorialCard><S.Gestures>
    <div><span><img src={a.tap} alt="" /></span><p>화면을<br />가볍게 눌러요.</p></div>
    <div><span><img src={a.swipe} alt="" /></span><p>위아래로<br />밀어서 넘겨요.</p></div>
    <div><span><img src={a.backGesture} alt="" style={{ transform: 'rotate(180deg)' }} /></span><p>이전 단계로<br />돌아가요.</p></div>
  </S.Gestures></>
}

function Practice({ settings, profileId, preview = false }) {
  const [state, dispatch] = useReducer(practiceReducer, undefined, initialPractice)
  const step = practiceSteps[state.step]
  const navigate = useNavigate()
  const main = useRef(null)
  const pointerStart = useRef(null)
  const options = { highContrast: settings.options.highContrast, touchGuidance: settings.options.touchGuidance }
  const enabled = optionDefinitions.filter(option => settings.options[option.id])
  const previewSearch = preview ? '?preview=self' : ''
  const home = () => navigate(`/home${previewSearch}`, { replace: true })
  const back = () => state.step === 0 ? home() : dispatch({ type: 'back' })
  const next = () => dispatch({ type: 'next' })
  const set = (field, value) => dispatch({ type: 'set', field, value })
  const selectedMenu = menuItems.find(item => item.id === state.menuId) ?? menuItems[0]
  const total = cartTotal(state.cart)
  function correctTouch(event) {
    const start = pointerStart.current
    pointerStart.current = null
    if (!settings.options.touchCorrection || !start || start.id !== event.pointerId || !event.isPrimary || event.button !== 0) return
    // 스크롤이나 실제 버튼 입력은 보정 클릭으로 중복 처리하지 않는다.
    if (Math.hypot(event.clientX - start.x, event.clientY - start.y) > 8 || event.target.closest('button')) return
    const targets = Array.from(event.currentTarget.querySelectorAll('button')).map(element => {
      const rect = element.getBoundingClientRect()
      return { element, left: rect.left, top: rect.top, width: rect.width, height: rect.height, disabled: element.disabled || element.getAttribute('aria-disabled') === 'true' }
    })
    nearestTouchTarget(targets, event.clientX, event.clientY)?.element.click()
  }
  const icon = name => options.highContrast ? ca[`${name}Contrast`] ?? a[name] : a[name]
  useLayoutEffect(() => { main.current?.focus(); window.scrollTo(0, 0); document.title = '키오스크 연습 - MODI' }, [step])
  useEffect(() => {
    if (step !== 'intro') return
    const timer = setTimeout(() => dispatch({ type: 'next' }), 1600)
    return () => clearTimeout(timer)
  }, [step])

  const product = (item = selectedMenu, showOptions = false) => <S.ProductRow><Photo id={item.id} size={50} /><div><strong>{item.name}{!showOptions && ` ${formatPrice(item.price)}`}</strong>{showOptions && <p>{optionText(item)}{'quantity' in item && ` ${item.quantity}잔`}</p>}</div></S.ProductRow>
  function stageContent() {
    switch (step) {
      case 'place': return <S.PlaceGrid>
        {[['store', '매장'], ['takeout', '포장']].map(([id, label]) => <button key={id} data-choice data-guided={id === 'store'} aria-pressed={state.place === id} onClick={() => set('place', id)}><img src={icon(id)} alt="" />{label}</button>)}
      </S.PlaceGrid>
      case 'menu': {
        const categories = [['recommended', '추천', 'star'], ['coffee', '커피', 'coffee'], ['drink', '음료', 'drink'], ['dessert', '디저트', 'dessert']]
        const items = state.category === 'recommended' ? menuItems.filter(item => item.recommended) : menuItems.filter(item => item.category === state.category)
        return <><S.Categories aria-label="메뉴 종류">{categories.map(([id, label, asset]) => <button key={id} data-choice aria-pressed={state.category === id} onClick={() => set('category', id)}><img src={options.highContrast ? icon(asset) : a[`${asset}${state.category === id ? 'Active' : ''}`] ?? a[asset]} alt="" />{label}</button>)}</S.Categories><S.MenuGrid>{items.map(item => <button key={item.id} data-choice data-white data-guided={item.id === 'americano'} aria-pressed={state.menuId === item.id} onClick={() => set('menuId', item.id)}><Photo id={item.id} /><span>{item.name}<br />{formatPrice(item.price)}</span></button>)}</S.MenuGrid></>
      }
      case 'options': return <>{product()}<S.FieldLabel $contrast={options.highContrast}>온도 선택</S.FieldLabel><S.OptionsGrid>{[['ice', '아이스', '차가운 음료', 'cold'], ['hot', '핫', '뜨거운 음료', 'hot']].map(([id, label, desc, asset]) => <button key={id} data-choice data-white data-guided={!state.temperature} aria-pressed={state.temperature === id} onClick={() => set('temperature', id)}><img src={a[asset]} alt="" />{label}<br />({desc})</button>)}</S.OptionsGrid><S.FieldLabel $contrast={options.highContrast}>사이즈 선택</S.FieldLabel><S.OptionsGrid $count={3}>{Object.entries(sizeText).map(([id, label]) => <button key={id} data-choice data-white data-guided={!!state.temperature && !state.size} aria-pressed={state.size === id} onClick={() => set('size', id)}>{id}<br />({label})</button>)}</S.OptionsGrid></>
      case 'add': return <>{product({ ...selectedMenu, temperature: state.temperature, size: state.size }, true)}<S.FieldLabel $contrast={options.highContrast}>수량</S.FieldLabel><S.Quantity $contrast={options.highContrast}><button data-choice data-white aria-label="수량 줄이기" disabled={state.quantity <= 1} onClick={() => dispatch({ type: 'quantity', value: state.quantity - 1 })}>−</button><output aria-live="polite">{state.quantity}</output><button data-choice data-white aria-label="수량 늘리기" disabled={state.quantity >= 99} onClick={() => dispatch({ type: 'quantity', value: state.quantity + 1 })}>＋</button><strong>{formatPrice(selectedMenu.price * state.quantity)}</strong></S.Quantity><S.WideAction data-choice data-white data-guided aria-pressed={state.added} onClick={() => dispatch({ type: 'add' })}>장바구니 담기</S.WideAction></>
      case 'cart': return <><S.CartItems>{state.cart.length === 0 ? <S.Description role="status">장바구니가 비어 있어요.</S.Description> : state.cart.map(item => <S.CartItem key={item.key}>{product(item, true)}<button data-choice aria-label={`${item.name} 장바구니에서 삭제`} onClick={() => dispatch({ type: 'remove', key: item.key })}><img src={a.remove} alt="" /></button><p>{formatPrice(item.price * item.quantity)}</p></S.CartItem>)}</S.CartItems><S.Total $contrast={options.highContrast}>총 결제 금액<strong>{formatPrice(total)}</strong></S.Total><S.ChoiceColumns style={{ marginTop: 'auto' }}><S.WideAction data-choice data-white onClick={() => dispatch({ type: 'more' })}>메뉴 더 보기</S.WideAction><S.WideAction data-choice data-white data-guided aria-pressed={state.cartConfirmed} disabled={!state.cart.length} onClick={() => dispatch({ type: 'order' })}>주문하기</S.WideAction></S.ChoiceColumns></>
      case 'payment': return <S.Payments>{[['credit', '신용 · 체크카드'], ['mobile', '간편 결제'], ['coupon', '쿠폰 · 기프티콘']].map(([id, label]) => <button key={id} data-choice data-guided={id === 'credit'} aria-pressed={state.payment === id} onClick={() => set('payment', id)}><img src={icon(id)} alt="" />{label}</button>)}</S.Payments>
      case 'card': return <S.Center><S.CardButton $paid={state.paid} aria-label="카드를 투입구에 넣기 연습" aria-pressed={state.paid} onClick={() => dispatch({ type: 'pay' })}><img src={a.card} alt="" /></S.CardButton><p style={{ color: options.highContrast ? 'white' : '#5b6575' }}>카드를 투입구에 끝까지 넣어요.</p></S.Center>
      case 'order': return <S.Center><img src={icon('check')} alt="" /><p style={{ color: options.highContrast ? 'white' : '#191f28' }}><strong>주문 완료</strong><br /><span style={{ color: options.highContrast ? '#00e1ff' : '#2456e8' }}>주문 번호 001</span></p></S.Center>
      default: return null
    }
  }
  return <S.Layout><OnboardingHeader title="키오스크 연습" onBack={back} /><S.Main ref={main} tabIndex={-1}>
    {step === 'settings' ? <><h2>현재 저장된 접근성 설정을 확인하세요.</h2>{enabled.length ? <S.SettingsList>{enabled.map(option => <li key={option.id}><img src={a.settingsCheck} alt="" /><span>{option.label}</span></li>)}</S.SettingsList> : <S.Empty><img src={a.empty} alt="" /><p>아직 저장된 접근성 설정이 없어요.<br />기본 키오스크 화면으로 연습하게 돼요.</p></S.Empty>}<S.IntroActions><PrimaryButton onClick={next}>연습 시작하기</PrimaryButton><button onClick={() => navigate(`/accessibility?${new URLSearchParams({ ...(profileId ? { profileId: String(profileId) } : {}), ...(preview ? { preview: 'self' } : {}), returnTo: 'practice' })}`)}>접근성 설정 다시 하기</button></S.IntroActions></>
      : step === 'tutorial' ? <><h2>연습 전에 간단히 알아볼까요?</h2><S.Description>자주 보는 버튼과 화면 조작법을 알려드려요.</S.Description><Tutorial /><S.IntroActions><PrimaryButton onClick={next}>다음</PrimaryButton><button onClick={back}>이전으로</button></S.IntroActions></>
      : step === 'intro' ? <><h2>이제 키오스크 주문 연습이 시작됩니다.</h2><S.Description role="status">실제로 주문되지 않으니, 편하게 연습하세요.</S.Description><S.IntroActions><S.Back onClick={back}>이전으로</S.Back></S.IntroActions></>
      : step === 'finish' ? <><h2>연습을 모두 마쳤어요.</h2><S.Description>이제 매장 키오스크에서도 해볼 수 있어요.</S.Description><S.FinishList>{finishLabels.map(label => <li key={label}><img src={a.checkSmall} alt="" />{label}</li>)}</S.FinishList><S.Footer style={{ marginTop: 'auto' }}><S.Back onClick={() => dispatch({ type: 'restart' })}>다시 연습하기</S.Back><S.Next onClick={home}>홈으로</S.Next></S.Footer></>
      : <><h2>{info[step][0]}</h2><S.Description>{info[step][1]}</S.Description><S.Stage $options={options} aria-label={`${info[step][0]} 연습 영역`} onPointerDown={event => { pointerStart.current = { id: event.pointerId, x: event.clientX, y: event.clientY } }} onPointerCancel={() => { pointerStart.current = null }} onPointerUp={correctTouch}>{stageContent()}</S.Stage><S.Help><span><img src={a.helpCircle} alt="" /><img src={a.helpBulb} alt="" /></span><div><h3>도움말</h3><p>{info[step][2]}</p></div></S.Help><S.Footer><S.Back onClick={back}>이전으로</S.Back><S.Next disabled={!canContinue(state)} onClick={next}>다음</S.Next></S.Footer></>}
  </S.Main></S.Layout>
}
