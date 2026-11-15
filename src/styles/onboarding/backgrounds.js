import { onboardingColors } from './colors'

const { background, gradientBlue } = onboardingColors

// 01 스플래시·04 시작 공통 배경: 흰색 바탕 + 왼쪽 위 / 오른쪽 아래 연한 파랑
// 화면 전체(상태 표시줄 포함) 기준으로 그린다. 04는 이 위에 흰 상태 표시줄을 덮는다.
export const splashBackground = `
  radial-gradient(ellipse 90% 45% at 0% 0%, ${gradientBlue} 0%, ${gradientBlue}00 100%),
  radial-gradient(ellipse 90% 45% at 100% 100%, ${gradientBlue} 0%, ${gradientBlue}00 100%),
  ${background}
`
