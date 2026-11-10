import styled from 'styled-components'
import { onboardingColors } from '../../styles/onboarding/colors'
import { onboardingFontFamily } from '../../styles/onboarding/fonts'
import OnboardingGlobalStyle from '../../styles/onboarding/OnboardingGlobalStyle'

const Frame = styled.div`
  box-sizing: border-box;
  position: relative;
  width: 100%;
  max-width: 393px;
  min-height: 100dvh;
  margin: 0 auto;
  overflow: hidden;
  font-family: ${onboardingFontFamily};
  color: ${onboardingColors.text};
  background: ${({ $background }) => $background ?? onboardingColors.background};
  -webkit-font-smoothing: antialiased;

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }
`

// 모든 온보딩 화면이 공유하는 393px 모바일 틀
// background: 화면별 배경(색상 또는 그라데이션). 생략하면 흰색.
export default function OnboardingLayout({ background, className, children }) {
  return (
    <>
      <OnboardingGlobalStyle />
      <Frame $background={background} className={className}>
        {children}
      </Frame>
    </>
  )
}
