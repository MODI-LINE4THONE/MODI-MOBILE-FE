import { useId, useState } from 'react'
import styled from 'styled-components'
import OnboardingLayout from '../../components/onboarding/OnboardingLayout'
import OnboardingHeader from '../../components/onboarding/OnboardingHeader'
import OnboardingFooter from '../../components/onboarding/OnboardingFooter'
import CodeInput from '../../components/onboarding/CodeInput'
import { onboardingColors } from '../../styles/onboarding/colors'

const Content = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 0 25px;
`

// 헤더 아래 첫 텍스트 (y=145). 상자 x=25, 높이 38
const Title = styled.h2`
  margin: 0;
  font-size: 20px;
  font-weight: 500;
  line-height: 38px;
`

// 피그마 텍스트 상자: 높이 72, 줄 높이 24 (글자는 위쪽 정렬)
const Description = styled.p`
  height: 72px;
  margin: 1px 0 0;
  color: ${onboardingColors.textSub};
  font-size: 14px;
  font-weight: 400;
  line-height: 24px;
`

// 첫 칸 y 270 (설명 끝 256 + 14), x 47
const CodeArea = styled.div`
  margin: 14px 0 0 22px;
`

const CODE_FORMAT = 'AA9999'

// onNext({ code, registeredAt }): 6자리가 다 찬 뒤 "다음"을 누르면 호출.
//   화면 이동은 이 화면을 쓰는 쪽(NfcRegisterFlow)이 맡는다. 없으면 동작 없음.
// "이전으로"는 아직 동작 없음.
export default function NfcCodePage({ onNext }) {
  const titleId = useId()
  const descriptionId = useId()
  const [code, setCode] = useState('')
  const isComplete = code.length === CODE_FORMAT.length

  const handleNext = () => {
    if (!isComplete) return
    onNext?.({ code, registeredAt: new Date() })
  }

  return (
    <OnboardingLayout withStatusBar>
      <OnboardingHeader title="NFC 키링 등록" />
      <Content>
        <Title id={titleId}>등록 코드</Title>
        <Description id={descriptionId}>
          키링 뒷면에 부착된 6자리 등록 코드를 입력해주세요.
        </Description>
        <CodeArea>
          <CodeInput
            value={code}
            onChange={setCode}
            format={CODE_FORMAT}
            labelledBy={titleId}
            describedBy={descriptionId}
          />
        </CodeArea>
        <OnboardingFooter
          primaryLabel="다음"
          primaryDisabled={!isComplete}
          onPrimaryClick={handleNext}
          step={2}
          totalSteps={3}
          progressLabel="NFC 키링 등록 단계"
        />
      </Content>
    </OnboardingLayout>
  )
}
