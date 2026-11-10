import styled from 'styled-components'
import OnboardingLayout from '../../components/onboarding/OnboardingLayout'
import OnboardingHeader from '../../components/onboarding/OnboardingHeader'
import PrimaryButton from '../../components/onboarding/PrimaryButton'
import TextInput from '../../components/onboarding/TextInput'

const Form = styled.form`
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 0 25px;
`

const Fields = styled.div`
  display: flex;
  flex-direction: column;
  gap: 37px;
`

const SubmitButton = styled(PrimaryButton)`
  margin: auto 0 64px;
`

// 화면만 구현 (회원가입·중복확인 기능 없음)
export default function SignupPage() {
  return (
    <OnboardingLayout withStatusBar>
      <OnboardingHeader title="회원가입" />
      <Form onSubmit={(e) => e.preventDefault()}>
        <Fields>
          <TextInput
            label="아이디"
            actionLabel="중복확인"
            type="text"
            placeholder="아이디 입력"
            autoComplete="username"
          />
          <TextInput
            label="비밀번호"
            type="password"
            placeholder="비밀번호 입력 (영문+숫자 8~16자)"
            autoComplete="new-password"
          />
        </Fields>
        <SubmitButton type="submit">회원가입</SubmitButton>
      </Form>
    </OnboardingLayout>
  )
}
