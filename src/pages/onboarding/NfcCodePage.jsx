import { useId, useRef, useState } from 'react'
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

const CODE_FORMAT = 'XXXXXX'

// onNext({ code }): 6자리가 다 찬 뒤 "다음"을 누르면 호출.
//   화면 이동은 이 화면을 쓰는 쪽(OnboardingFlow)이 맡는다. 없으면 동작 없음.
// onBack: 뒤로가기 화살표 / onPrevious: "이전으로"
export default function NfcCodePage({ onNext, onBack, onPrevious, initialCode = '' }) {
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const busy = useRef(false)
  const titleId = useId()
  const descriptionId = useId()
  const [code, setCode] = useState(initialCode)
  const isComplete = code.length === CODE_FORMAT.length

  const handleNext = async () => {
    if (!isComplete || busy.current) return
    busy.current = true
    setPending(true)
    setError('')
    try { await onNext?.({ code }) }
    catch (err) { setError(err.message || '키링 등록에 실패했습니다.') }
    finally { busy.current = false; setPending(false) }
  }

  return (
    <OnboardingLayout>
      <OnboardingHeader title="키링 등록하기" onBack={onBack} />
      <Content>
        <Title id={titleId}>등록 코드</Title>
        <Description id={descriptionId}>
          키링 뒷면에 부착된 6자리 등록 코드를 입력해주세요.
        </Description>
        <CodeArea>
          <CodeInput
            value={code}
            onChange={(value) => { if (!pending) setCode(value) }}
            format={CODE_FORMAT}
            labelledBy={titleId}
            describedBy={descriptionId}
          />
        </CodeArea>
        {error && <p role="alert">{error}</p>}
        <OnboardingFooter
          primaryLabel={pending ? '저장 중…' : '다음'}
          primaryDisabled={!isComplete || pending}
          onPrimaryClick={handleNext}
          onBackClick={onPrevious}
          step={2}
          totalSteps={3}
          progressLabel="키링 등록 단계"
        />
      </Content>
    </OnboardingLayout>
  )
}
