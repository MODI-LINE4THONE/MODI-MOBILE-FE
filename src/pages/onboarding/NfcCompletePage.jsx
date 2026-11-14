import styled from 'styled-components'
import OnboardingLayout from '../../components/onboarding/OnboardingLayout'
import OnboardingHeader from '../../components/onboarding/OnboardingHeader'
import OnboardingFooter from '../../components/onboarding/OnboardingFooter'
import KeyringInfoCard, {
  DEFAULT_KEYRING_ID,
  DEFAULT_REGISTERED_AT,
} from '../../components/keyring/KeyringInfoCard'
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

// 카드 y 270 (설명 끝 256 + 14). 카드 모양은 키링 관리와 같은 부품 (08 크기)
const ResultCard = styled(KeyringInfoCard)`
  margin-top: 14px;
`

// keyringId: 07에서 입력한 코드 (08만 따로 열었으면 기본값) / registeredAt: 07에서 "다음"을 누른 시각(Date)
// onBack: 뒤로가기 화살표 / onHome: "홈으로 이동" (OnboardingFlow에서 홈으로 연결)
export default function NfcCompletePage({
  keyringId = DEFAULT_KEYRING_ID,
  registeredAt = DEFAULT_REGISTERED_AT,
  onBack,
  onHome,
}) {
  return (
    <OnboardingLayout withStatusBar>
      <OnboardingHeader title="NFC 키링 등록" onBack={onBack} />
      <Content>
        <Title>등록 완료</Title>
        <Description>키링이 정상적으로 등록되었습니다.</Description>
        <ResultCard keyringId={keyringId} registeredAt={registeredAt} size="complete" />
        <OnboardingFooter
          primaryLabel="홈으로 이동"
          onPrimaryClick={onHome}
          showBack={false}
          step={3}
          totalSteps={3}
          progressLabel="NFC 키링 등록 단계"
        />
      </Content>
    </OnboardingLayout>
  )
}
