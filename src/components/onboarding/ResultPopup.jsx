import { useEffect, useId, useRef } from 'react'
import styled from 'styled-components'
import { onboardingColors } from '../../styles/onboarding/colors'

// 체크 아이콘 상자 크기: 팝업 위 26.42 + 아이콘 + 9 + 제목 상자 32 + 14 = 버튼 위치 137
const ICON_SIZE = 55.58

// 브라우저 내장 팝업(<dialog>.showModal()) 사용:
// - 화면 가운데(top layer)에 뜨고, 뒤 화면은 누르거나 키보드로 갈 수 없다.
// - 화면 읽기 프로그램에 팝업(대화 상자)으로 알려진다.
// - 닫히면 키보드 위치가 팝업을 열었던 버튼으로 돌아간다.
const Dialog = styled.dialog`
  box-sizing: border-box;
  width: 288px;
  height: 200px;
  max-width: none;
  max-height: none;
  margin: auto; /* 화면 높이가 달라도 정가운데 */
  padding: 26.42px 0 0;
  border: none;
  border-radius: 20px;
  background: ${onboardingColors.popupBackground};
  color: ${onboardingColors.text};
  font-family: inherit;
  text-align: center;
  outline: none;

  &::backdrop {
    background: ${onboardingColors.dimmed};
  }
`

const Icon = styled.svg`
  display: block;
  width: ${ICON_SIZE}px;
  height: ${ICON_SIZE}px;
  margin: 0 auto;
`

// "회원가입 완료": 20px Medium, 상자 높이 32, 아이콘과 9 떨어짐
const Title = styled.h2`
  margin: 9px 0 0;
  font-size: 20px;
  font-weight: 500;
  line-height: 32px;
`

// 버튼 218 x 39, 제목과 14 떨어짐.
// 글자 상자(높이 32)는 디자인대로 버튼 위에서 4 내려온 위치.
const ActionButton = styled.button.attrs({ type: 'button' })`
  display: block;
  width: 218px;
  height: 39px;
  margin: 14px auto 0;
  padding: 4px 0 3px;
  border: none;
  border-radius: 15px;
  background: ${onboardingColors.popupButtonBackground};
  color: ${onboardingColors.popupButtonText};
  font-family: inherit;
  font-size: 18px;
  font-weight: 500;
  line-height: 32px;
  cursor: pointer;
  transition: transform 0.1s ease;
  -webkit-tap-highlight-color: transparent; /* 모바일 기본 회색 터치 효과 제거 */

  &:active {
    background: ${onboardingColors.popupButtonPressed};
    transform: scale(0.98);
  }

  &:focus-visible {
    outline: 2px solid ${onboardingColors.text};
    outline-offset: 2px;
  }
`

function CheckCircleIcon() {
  return (
    <Icon viewBox={`0 0 ${ICON_SIZE} ${ICON_SIZE}`} aria-hidden="true" focusable="false">
      {/* 지름 54 원. 디자인처럼 상자 위쪽에 붙여 그린다 */}
      <circle cx={ICON_SIZE / 2} cy="27" r="27" fill={onboardingColors.popupIcon} />
      <path
        d="M16.6 27.8 L24.4 35.4 L39 20.6"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Icon>
  )
}

// 결과 안내 팝업: 체크 아이콘 + 제목 + 버튼 하나.
// open: 보일지 여부 (닫는 건 이 부품을 쓰는 화면이 open을 false로 바꿔서 한다)
// title: 제목 (예: "회원가입 완료")
// actionLabel / onAction: 버튼 글자와 누르면 할 일 (예: 로그인 화면으로 이동)
// Esc 키나 뒤로 가기 동작으로는 닫히지 않는다. 키보드 이동(Tab)은 팝업 안에서만 돈다.
export default function ResultPopup({ open, title, actionLabel, onAction }) {
  const dialogRef = useRef(null)
  const titleId = useId()

  useEffect(() => {
    const dialog = dialogRef.current
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  // Esc로 닫히지 않게: 닫기 요청(cancel)과 Esc 키 자체를 막는다.
  // 그래도 브라우저가 닫아 버리면(일부 브라우저의 연속 Esc 등) 다시 띄운다.
  const preventCancel = (e) => e.preventDefault()
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      return
    }
    // Tab / Shift+Tab: 키보드 위치가 팝업 밖(브라우저 주소창 등)으로 나가지 않고 팝업 안에서 돈다
    if (e.key === 'Tab') {
      const focusables = [...dialogRef.current.querySelectorAll('button, [href], input, [tabindex]:not([tabindex="-1"])')]
      if (focusables.length === 0) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
  }
  const reopenIfNeeded = () => {
    if (open) dialogRef.current?.showModal()
  }

  return (
    <Dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onCancel={preventCancel}
      onKeyDown={handleKeyDown}
      onClose={reopenIfNeeded}
    >
      <CheckCircleIcon />
      <Title id={titleId}>{title}</Title>
      <ActionButton onClick={onAction}>{actionLabel}</ActionButton>
    </Dialog>
  )
}
