import { useEffect, useRef, useState } from 'react'
import styled, { css } from 'styled-components'
import { onboardingColors } from '../../styles/onboarding/colors'
import { hangulToQwertyKeys } from '../../utils/hangulToQwerty'

// 칸 안쪽 그림자: #191F28, X 0, Y 0, Blur 2.6, 투명도 25% (이미지 측정값)
const CELL_SHADOW = `inset 0 0 2.6px ${onboardingColors.codeCellShadow}`
const ACTIVE_OUTLINE = `inset 0 0 0 1px ${onboardingColors.primary}`

const Cells = styled.div`
  display: flex;
  gap: 6px;
`

// 외곽선·그림자 모두 안쪽 box-shadow라 칸 크기와 글자 위치가 바뀌지 않는다.
const Cell = styled.span`
  position: relative;
  display: block;
  flex-shrink: 0;
  width: 45px;
  height: 58px;
  border-radius: 12px;
  background: ${onboardingColors.codeCellBackground};
  box-shadow: ${CELL_SHADOW};

  ${({ $active }) =>
    $active &&
    css`
      box-shadow: ${ACTIVE_OUTLINE}, ${CELL_SHADOW};
    `}
`

// 화면에 보이는 글자 (실제 값은 투명한 입력창에 같이 들어 있다)
const CellChar = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding-bottom: 2px; /* 가운데에서 1px 위: 디자인 글자 위치에 맞춤 */
  color: ${onboardingColors.text};
  font-size: 33px;
  font-weight: 500;
  line-height: 1;
  pointer-events: none;
  user-select: none;
`

// 투명한 실제 입력창. 한글 조합 중인 글자(예: 'ㅁ')는 여기 숨겨 두고,
// 화면에는 변환된 글자(예: 'A')만 CellChar로 보여 준다.
const CellInput = styled.input`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  border: none;
  border-radius: 12px;
  background: transparent;
  font-size: 33px; /* 16px 이상: iPhone 확대 방지 */
  opacity: 0;
  outline: none;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
`

const SLOT = { A: 'alpha', 9: 'digit' }
const accepts = (slot, ch) => (slot === 'alpha' ? /^[A-Z]$/.test(ch) : /^[0-9]$/.test(ch))

// 6칸 등록 코드 입력
// - value / onChange: 입력된 코드 문자열 (앞에서부터 채워짐, 예: 'AB12')
// - format: 칸별 형식. A = 영문 대문자, 9 = 숫자 (기본 'AA9999')
// - labelledBy / describedBy: 묶음 이름·설명이 되는 요소의 id
export default function CodeInput({ value = '', onChange, format = 'AA9999', labelledBy, describedBy }) {
  const slots = [...format].map((c) => SLOT[c])
  const size = slots.length

  const inputsRef = useRef([])
  const codeRef = useRef(value) // 이벤트 처리 중 최신 값 (state 반영 전에도 정확하도록)
  codeRef.current = value
  // 지금 글자를 받고 있는 칸. baseCode/baseDom: 그 칸에 들어왔을 때의 코드와 칸 값
  const sessionRef = useRef(null)
  const composingRef = useRef(false)
  const [groupFocused, setGroupFocused] = useState(false)

  const activeIndexOf = (code) => Math.min(code.length, size - 1)

  // 앞에서부터 차례로 칸 형식에 맞는 키만 넣는다. 맞지 않는 키는 건너뛴다.
  const applyKeys = (base, keys) => {
    let next = base
    for (const key of keys) {
      if (next.length >= size) break
      const ch = key.toUpperCase()
      if (accepts(slots[next.length], ch)) next += ch
    }
    return next
  }

  const commit = (next) => {
    if (next === codeRef.current) return
    codeRef.current = next
    onChange?.(next)
  }

  // 실제 입력창 값을 코드 값과 맞춘다 (화면 읽기 프로그램이 읽는 값)
  const syncDom = (i) => {
    const el = inputsRef.current[i]
    const want = codeRef.current[i] ?? ''
    if (el && el.value !== want) el.value = want
  }

  const startSession = (i) => {
    syncDom(i)
    sessionRef.current = { index: i, baseCode: codeRef.current, baseDom: inputsRef.current[i].value }
  }

  // 이 칸의 입력을 마치고, 입력할 칸(첫 빈 칸)으로 이동
  const finish = (i) => {
    sessionRef.current = null
    const target = activeIndexOf(codeRef.current)
    if (target !== i) {
      inputsRef.current[target]?.focus()
      // 조합 중이던 글자가 포커스 이동 후 늦게 들어올 수 있어 한 박자 뒤에 정리
      setTimeout(() => syncDom(i), 0)
    } else {
      startSession(i)
    }
  }

  // 아무 칸을 눌러도 비어 있는 첫 칸부터
  const handleFocus = (i) => {
    setGroupFocused(true)
    const target = activeIndexOf(codeRef.current)
    if (i !== target) {
      inputsRef.current[target]?.focus()
      return
    }
    startSession(i)
  }

  const handleBlur = (i, e) => {
    if (sessionRef.current?.index === i) sessionRef.current = null
    setTimeout(() => syncDom(i), 0)
    if (!inputsRef.current.includes(e.relatedTarget)) setGroupFocused(false)
  }

  // 매번 "이 칸에 들어온 전체 글자"로 다시 계산한다 → 이벤트가 중복되거나
  // 순서가 달라도 같은 결과 (글자가 두 번 들어가거나 사라지지 않음)
  const handleInput = (i, e) => {
    const session = sessionRef.current
    if (!session || session.index !== i) {
      syncDom(i) // 이미 처리가 끝난 칸에 늦게 들어온 글자
      return
    }
    const raw = e.target.value
    const composing = e.nativeEvent.isComposing || composingRef.current

    // 마지막 칸이 차 있을 때 브라우저 기본 지우기가 일어난 경우
    if (!composing && session.baseDom && raw.length < session.baseDom.length) {
      commit(session.baseCode.slice(0, -1))
      finish(i)
      return
    }

    const typed = raw.startsWith(session.baseDom) ? raw.slice(session.baseDom.length) : raw
    commit(applyKeys(session.baseCode, hangulToQwertyKeys(typed)))

    const nextIndex = codeRef.current.length
    const needsOtherKeyboard = nextIndex < size && slots[nextIndex] !== slots[i]
    // 조합 중에는 같은 칸에 머물러야 글자가 안정적으로 들어온다.
    // 단, 영문 칸이 다 차서 숫자 키보드가 필요하면 바로 이동한다.
    if (!composing || needsOtherKeyboard) finish(i)
  }

  const handleCompositionStart = () => {
    composingRef.current = true
  }

  const handleCompositionEnd = (i) => {
    composingRef.current = false
    // 한글은 조합이 끝나자마자 다음 글자 조합이 이어서 시작될 수 있어 한 박자 기다린다.
    setTimeout(() => {
      if (
        !composingRef.current &&
        sessionRef.current?.index === i &&
        document.activeElement === inputsRef.current[i]
      ) {
        finish(i)
      }
    }, 0)
  }

  // 지우기: 앞 칸으로 돌아가며 지운다 (조합 중 지우기는 입력기가 처리)
  const handleKeyDown = (i, e) => {
    if (e.key !== 'Backspace' || e.nativeEvent.isComposing || composingRef.current) return
    e.preventDefault()
    if (codeRef.current.length === 0) return
    commit(codeRef.current.slice(0, -1))
    finish(i)
  }

  // 붙여넣기: 공백·하이픈을 빼고 대문자로 바꿔 형식에 맞으면 6칸을 한 번에 채운다
  const handlePaste = (e) => {
    e.preventDefault()
    const text = e.clipboardData.getData('text').replace(/[\s-]/g, '').toUpperCase()
    const matches = text.length === size && [...text].every((ch, i) => accepts(slots[i], ch))
    if (!matches) return
    commit(text)
    inputsRef.current.forEach((_, i) => syncDom(i))
    sessionRef.current = null
    const last = inputsRef.current[size - 1]
    if (document.activeElement !== last) last?.focus()
    else startSession(size - 1)
  }

  // 바깥에서 value가 바뀐 경우 입력창 값 맞추기
  useEffect(() => {
    inputsRef.current.forEach((_, i) => {
      if (sessionRef.current?.index !== i) syncDom(i)
    })
  })

  // 외곽선: 칸들이 선택돼 있고 아직 입력할 칸이 남아 있을 때만
  const outlineIndex = groupFocused && value.length < size ? value.length : -1

  return (
    <Cells role="group" aria-labelledby={labelledBy} aria-describedby={describedBy}>
      {slots.map((slot, i) => (
        <Cell key={i} $active={i === outlineIndex}>
          <CellChar aria-hidden="true">{value[i] ?? ''}</CellChar>
          <CellInput
            ref={(el) => (inputsRef.current[i] = el)}
            type="text"
            inputMode={slot === 'alpha' ? 'email' : 'numeric'}
            autoCapitalize={slot === 'alpha' ? 'characters' : 'off'}
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            aria-label={`등록 코드 ${i + 1}번째 자리, ${slot === 'alpha' ? '영문' : '숫자'}`}
            onFocus={() => handleFocus(i)}
            onBlur={(e) => handleBlur(i, e)}
            onInput={(e) => handleInput(i, e)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={handlePaste}
            onCompositionStart={handleCompositionStart}
            onCompositionEnd={() => handleCompositionEnd(i)}
          />
        </Cell>
      ))}
    </Cells>
  )
}
