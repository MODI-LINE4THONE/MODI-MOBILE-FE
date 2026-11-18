import { useEffect } from 'react'
import styled from 'styled-components'
import OnboardingLayout from '../../components/onboarding/OnboardingLayout'
import { splashBackground } from '../../styles/onboarding/backgrounds'
import modiLogo from '../../assets/images/modi-logo.png'

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100dvh;
  padding: 0 25px 16px; /* 로고 묶음을 정중앙보다 살짝 위로 */
`

const Logo = styled.img`
  display: block;
  width: 343px;
  max-width: 100%;
  height: auto;
`

const Tagline = styled.p`
  margin: 12px 0 0;
  font-size: 18px;
  font-weight: 600;
  line-height: 1.4;
  letter-spacing: -.4px;
  text-align: center;
`

const SPLASH_DURATION = 2000 // ms

// onFinish: 화면이 보이고 2초 뒤 호출 (없으면 계속 머무름)
export default function SplashPage({ onFinish }) {
  useEffect(() => {
    if (!onFinish) return undefined
    const timer = setTimeout(onFinish, SPLASH_DURATION)
    return () => clearTimeout(timer)
  }, [onFinish])

  return (
    <OnboardingLayout background={splashBackground}>
      <Content>
        <Logo src={modiLogo} alt="MODI" />
        <Tagline>모두를 위한 키오스크 경험</Tagline>
      </Content>
    </OnboardingLayout>
  )
}
