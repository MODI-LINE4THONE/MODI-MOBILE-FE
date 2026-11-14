import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { onboardingColors } from '../../styles/onboarding/colors'
import modiLogo from '../../assets/images/modi-logo.png'
import bellIcon from '../../assets/icons/icon-bell.svg'

// 피그마: 로고 x=25 y=82 (57x20), 종 x=345 y=82 (24x24) / 상태 표시줄(54) 아래
const Header = styled.header`
  display: flex;
  flex-shrink: 0;
  align-items: flex-start;
  justify-content: space-between;
  margin-top: 28px; /* 상태 표시줄(54) + 28 = 82 */
  padding: 0 24px 0 25px; /* 종 오른쪽 끝 369 → 393 - 369 = 24 */
`

const Logo = styled.img`
  display: block;
  width: 57px;
  height: 20px;
`

const BELL_SIZE = 24
const TOUCH_SIZE = 44 // 누르는 영역 (보이는 종을 가운데에 둔다)
const TOUCH_SPACE = (TOUCH_SIZE - BELL_SIZE) / 2 // 10: 종 둘레로 넓힌 만큼 여백을 당겨 위치는 그대로
const PRESS_CIRCLE = 40 // 누르는 동안 종 뒤에 보이는 원 지름

// 누름 효과(0.15초)가 보이도록 이동을 늦추는 시간 (홈 카드와 같음)
const PRESS_DELAY_MS = 150

const BellButton = styled.button.attrs({ type: 'button' })`
  position: relative;
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: ${TOUCH_SIZE}px;
  height: ${TOUCH_SIZE}px;
  margin: -${TOUCH_SPACE}px;
  padding: 0;
  border: none;
  /* 버튼은 네모 그대로 (둥글게 하면 브라우저가 모서리를 누르는 영역에서 뺀다) */
  background: none;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;

  /* 누르는 동안 + 누른 뒤 이동 전까지(data-pressed): 종 뒤에 연회색 원 */
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: ${PRESS_CIRCLE}px;
    height: ${PRESS_CIRCLE}px;
    border-radius: 50%;
    background: ${onboardingColors.bellPressed};
    opacity: 0;
    transform: translate(-50%, -50%);
    transition: opacity 0.1s ease-out;
  }

  &:active::before,
  &[data-pressed='true']::before {
    opacity: 1;
  }

  /* 키보드 초점 테두리 (온보딩 헤더 뒤로가기 버튼과 같은 모양) */
  &:focus-visible {
    outline: 2px solid ${onboardingColors.text};
    outline-offset: -2px;
    border-radius: 8px;
  }
`

const Bell = styled.span`
  position: relative;
  display: block;
  width: ${BELL_SIZE}px;
  height: ${BELL_SIZE}px;
`

const BellIcon = styled.img`
  display: block;
  width: ${BELL_SIZE}px;
  height: ${BELL_SIZE}px;
`

// 피그마: 점 x=358 y=80 (지름 11) → 종 기준 왼쪽 13, 위로 2
const Dot = styled.span`
  position: absolute;
  top: -2px;
  left: 13px;
  width: 11px;
  height: 11px;
  border-radius: 50%;
  background: ${onboardingColors.notificationDot};
`

// 홈 상단: 왼쪽 MODI 로고 + 오른쪽 알림 종 버튼
// hasNewNotification: true면 종 오른쪽 위에 파란 점
// onNotificationClick: 종을 누르면 누름 효과를 보여 준 뒤 호출 (없으면 누름 효과만)
export default function HomeHeader({ hasNewNotification = false, onNotificationClick }) {
  const [pressed, setPressed] = useState(false)
  const timerRef = useRef(null)

  // 화면이 사라질 때 남은 타이머 취소
  useEffect(() => () => clearTimeout(timerRef.current), [])

  // 기다리는 동안 다시 눌러도 무시한다
  const handleClick = () => {
    if (timerRef.current) return
    setPressed(true)
    timerRef.current = setTimeout(() => {
      timerRef.current = null
      setPressed(false)
      onNotificationClick?.()
    }, PRESS_DELAY_MS)
  }

  return (
    <Header>
      <Logo src={modiLogo} alt="MODI" />
      <BellButton
        aria-label={hasNewNotification ? '알림, 새 알림 있음' : '알림'}
        data-pressed={pressed}
        onClick={handleClick}
      >
        <Bell>
          <BellIcon src={bellIcon} alt="" />
          {hasNewNotification && <Dot />}
        </Bell>
      </BellButton>
    </Header>
  )
}
