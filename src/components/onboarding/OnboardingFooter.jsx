import styled from 'styled-components'
import { onboardingColors } from '../../styles/onboarding/colors'
import PrimaryButton from './PrimaryButton'
import ProgressBar from './ProgressBar'

const BUTTON_HEIGHT = 54
const BOTTOM_SPACE = 119 // 파란 버튼 아래 ~ 화면 맨 아래
const BACK_GAP = 19 // 파란 버튼 ~ "이전으로" 상자
const BACK_LINE_HEIGHT = 23 // 피그마 텍스트 상자 높이
const TOUCH_SIZE = 44
const PROGRESS_BOTTOM = 49 // 진행 막대 ~ 화면 맨 아래

// 화면 맨 아래에 붙는 하단 영역.
// "이전으로"가 있든 없든 높이가 같아서 파란 버튼 위치가 항상 같다.
const Footer = styled.div`
  position: relative;
  flex-shrink: 0;
  margin-top: auto;
  padding-bottom: ${BOTTOM_SPACE}px;
`

// 보이는 글자 상자는 23px, 누르는 영역은 높이 44 이상
const BackButton = styled.button.attrs({ type: 'button' })`
  position: absolute;
  top: ${BUTTON_HEIGHT + BACK_GAP - (TOUCH_SIZE - BACK_LINE_HEIGHT) / 2}px;
  left: 50%;
  min-width: ${TOUCH_SIZE}px;
  height: ${TOUCH_SIZE}px;
  padding: 0 12px;
  border: none;
  background: none;
  color: ${onboardingColors.textSub};
  font-family: inherit;
  font-size: 19px;
  font-weight: 500;
  line-height: ${BACK_LINE_HEIGHT}px;
  white-space: nowrap;
  cursor: pointer;
  transform: translateX(-50%);
  -webkit-tap-highlight-color: transparent;

  &:active {
    color: ${onboardingColors.text};
  }

  &:focus-visible {
    outline: 2px solid ${onboardingColors.text};
    outline-offset: -2px;
    border-radius: 8px;
  }
`

// 화면 가운데, 맨 아래에서 49px
const Progress = styled(ProgressBar)`
  position: absolute;
  bottom: ${PROGRESS_BOTTOM}px;
  left: 50%;
  transform: translateX(-50%);
`

// 05~08 하단 버튼 영역
// - primaryLabel / onPrimaryClick / primaryType: 파란 버튼
// - showBack: "이전으로" 표시 여부 (08은 false)
// - step / totalSteps: 진행 막대 (step이 없으면 그리지 않음)
export default function OnboardingFooter({
  primaryLabel,
  onPrimaryClick,
  primaryType = 'button',
  showBack = true,
  backLabel = '이전으로',
  onBackClick,
  step,
  totalSteps = 3,
  progressLabel,
}) {
  return (
    <Footer>
      <PrimaryButton type={primaryType} onClick={onPrimaryClick}>
        {primaryLabel}
      </PrimaryButton>
      {showBack && <BackButton onClick={onBackClick}>{backLabel}</BackButton>}
      {step != null && <Progress current={step} total={totalSteps} label={progressLabel} />}
    </Footer>
  )
}
