import styled from 'styled-components'
import { onboardingColors } from '../../styles/onboarding/colors'

// 상태 표시줄(54px) 아래 헤더 본체 75px → 129px에서 끝남
const HEADER_HEIGHT = 75
// 공통 규칙: 헤더 아래 16px(y=145)에서 첫 텍스트 상자가 시작한다.
// 헤더 다음 요소는 margin-top 0, 줄 높이 = 피그마 텍스트 상자 높이로 둔다.
const CONTENT_GAP = 16

const ARROW_LEFT = 29 // 화면 왼쪽 ~ 화살표 왼쪽 끝
const ARROW_WIDTH = 9
const TOUCH_SIZE = 44

const Header = styled.header`
  position: relative;
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  height: ${HEADER_HEIGHT}px;
  margin-bottom: ${CONTENT_GAP}px;
  padding: 0 ${TOUCH_SIZE + 12}px;
`

const Title = styled.h1`
  margin: 0;
  overflow: hidden;
  font-size: 20px;
  font-weight: 500;
  line-height: 1.4;
  color: ${onboardingColors.text};
  white-space: nowrap;
  text-overflow: ellipsis;
`

// 보이는 화살표는 9x17, 누르는 영역은 화살표를 가운데에 둔 44x44
const BackButton = styled.button.attrs({ type: 'button' })`
  position: absolute;
  top: 50%;
  left: ${ARROW_LEFT + ARROW_WIDTH / 2 - TOUCH_SIZE / 2}px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${TOUCH_SIZE}px;
  height: ${TOUCH_SIZE}px;
  padding: 0;
  border: none;
  background: none;
  color: ${onboardingColors.text};
  cursor: pointer;
  transform: translateY(-50%);
  -webkit-tap-highlight-color: transparent;

  &:focus-visible {
    outline: 2px solid ${onboardingColors.text};
    outline-offset: -2px;
    border-radius: 8px;
  }
`

const Arrow = styled.svg`
  display: block;
  width: ${ARROW_WIDTH}px;
  height: 17px;
`

// 뒤로가기 화살표 + 가운데 제목 헤더 (동작 없음)
export default function OnboardingHeader({ title }) {
  return (
    <Header>
      <BackButton aria-label="뒤로 가기">
        <Arrow viewBox="0 0 9 17" fill="none" aria-hidden="true">
          <path
            d="M8.2 0.8L0.8 8.5L8.2 16.2"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Arrow>
      </BackButton>
      <Title>{title}</Title>
    </Header>
  )
}
