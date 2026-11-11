import { createGlobalStyle } from 'styled-components'

// OnboardingLayout이 화면에 있을 때만 적용되는 전역 스타일
const OnboardingGlobalStyle = createGlobalStyle`
  body {
    margin: 0;
  }
`

export default OnboardingGlobalStyle
