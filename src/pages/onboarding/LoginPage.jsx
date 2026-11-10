import styled from 'styled-components'
import OnboardingLayout from '../../components/onboarding/OnboardingLayout'
import PrimaryButton from '../../components/onboarding/PrimaryButton'
import TextInput from '../../components/onboarding/TextInput'
import { onboardingColors } from '../../styles/onboarding/colors'

const Form = styled.form`
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 0 25px;
`

const Title = styled.h1`
  margin: 89px 0 0;
  font-size: 20px;
  font-weight: 500;
  line-height: 28px;
`

const Fields = styled.div`
  display: flex;
  flex-direction: column;
  gap: 43px;
  margin-top: 41px;
`

const SignupRow = styled.p`
  display: flex;
  justify-content: center;
  gap: 14px;
  margin: 41px 0 0;
  font-size: 14px;
  line-height: 20px;
  color: ${onboardingColors.textSub};
`

const SignupLink = styled.button.attrs({ type: 'button' })`
  padding: 0;
  border: none;
  background: none;
  color: ${onboardingColors.primary};
  font-family: inherit;
  font-size: inherit;
  font-weight: 500;
  line-height: inherit;
  cursor: pointer;
`

const LoginButton = styled(PrimaryButton)`
  margin: auto 0 64px;
`

// 화면만 구현 (로그인 기능 없음)
export default function LoginPage() {
  return (
    <OnboardingLayout withStatusBar>
      <Form onSubmit={(e) => e.preventDefault()}>
        <Title>안녕하세요, MODI입니다.</Title>
        <Fields>
          <TextInput
            type="text"
            placeholder="아이디를 입력하세요"
            aria-label="아이디"
            autoComplete="username"
          />
          <TextInput
            type="password"
            placeholder="비밀번호를 입력하세요"
            aria-label="비밀번호"
            autoComplete="current-password"
          />
        </Fields>
        <SignupRow>
          계정이 없으신가요?
          <SignupLink>회원가입</SignupLink>
        </SignupRow>
        <LoginButton type="submit">로그인</LoginButton>
      </Form>
    </OnboardingLayout>
  )
}
