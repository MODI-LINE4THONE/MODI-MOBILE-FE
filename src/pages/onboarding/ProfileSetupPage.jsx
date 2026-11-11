import { useId, useState } from 'react'
import styled from 'styled-components'
import OnboardingLayout from '../../components/onboarding/OnboardingLayout'
import OnboardingHeader from '../../components/onboarding/OnboardingHeader'
import OnboardingFooter from '../../components/onboarding/OnboardingFooter'
import ChoiceGroup from '../../components/onboarding/ChoiceGroup'
import TextInput from '../../components/onboarding/TextInput'

const TARGET_OPTIONS = [
  { value: 'self', label: '본인' },
  { value: 'family', label: '가족 · 보호 대상자' },
]

const Content = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 0 25px;
`

// 헤더 아래 첫 텍스트 (y=145). 상자 x=28, 높이 38
const Question = styled.h2`
  margin: 0;
  padding-left: 3px;
  font-size: 20px;
  font-weight: 500;
  line-height: 38px;
`

const Choices = styled(ChoiceGroup)`
  margin-top: 30px;
`

const NicknameField = styled.div`
  margin-top: 79px;
`

// 화면만 구현 (다음·이전으로 화면 이동 없음)
export default function ProfileSetupPage() {
  const questionId = useId()
  const [target, setTarget] = useState(null) // null: 처음 들어온 상태
  // 별명 칸이 사라져도 값은 여기에 남아, 다시 보일 때 그대로 채워진다.
  const [nickname, setNickname] = useState('')
  // "다음" 활성: 본인 선택 / 가족 선택 + 별명 입력(띄어쓰기만은 입력 안 한 것으로 봄)
  const canProceed = target === 'self' || (target === 'family' && nickname.trim() !== '')

  return (
    <OnboardingLayout withStatusBar>
      <OnboardingHeader title="접근성 프로필 설정" />
      <Content>
        <Question id={questionId}>누구를 위한 설정인가요?</Question>
        <Choices
          name="profile-target"
          options={TARGET_OPTIONS}
          value={target}
          onChange={setTarget}
          labelledBy={questionId}
        />
        {target === 'family' && (
          <NicknameField>
            <TextInput
              label="등록하실 별명"
              labelSize="large"
              placeholder="예: 어머니, 할머니"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
          </NicknameField>
        )}
        <OnboardingFooter primaryLabel="다음" primaryDisabled={!canProceed} />
      </Content>
    </OnboardingLayout>
  )
}
