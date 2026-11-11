import styled from 'styled-components'
import { onboardingColors } from '../../styles/onboarding/colors'

const Bar = styled.div`
  display: flex;
  gap: 9.59px;
`

const Segment = styled.span`
  display: block;
  width: 103.59px;
  height: 3px;
  border-radius: 2px;
  background: ${({ $filled }) =>
    $filled ? onboardingColors.progressFilled : onboardingColors.progressEmpty};
`

// 단계 진행 막대. current칸까지 채워진다.
// 화면 읽기 프로그램: "{label}, 3단계 중 1단계"
export default function ProgressBar({ current, total = 3, label = '진행 단계', className }) {
  return (
    <Bar
      role="progressbar"
      aria-label={label}
      aria-valuemin={1}
      aria-valuemax={total}
      aria-valuenow={current}
      aria-valuetext={`${total}단계 중 ${current}단계`}
      className={className}
    >
      {Array.from({ length: total }, (_, i) => (
        <Segment key={i} $filled={i < current} aria-hidden="true" />
      ))}
    </Bar>
  )
}
