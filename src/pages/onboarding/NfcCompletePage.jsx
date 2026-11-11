import styled from 'styled-components'
import OnboardingLayout from '../../components/onboarding/OnboardingLayout'
import OnboardingHeader from '../../components/onboarding/OnboardingHeader'
import OnboardingFooter from '../../components/onboarding/OnboardingFooter'
import IconCard from '../../components/onboarding/IconCard'
import { onboardingColors } from '../../styles/onboarding/colors'
import { formatKoreanDate, formatKoreanTime, toDateTimeAttribute } from '../../utils/formatDateTime'
import keyringIcon from '../../assets/icons/icon-keyring.svg'

// 08만 따로 열었을 때의 기본값
const DEFAULT_KEYRING_ID = 'AB1234'
const DEFAULT_REGISTERED_AT = new Date(2026, 10, 3, 15, 29)

// 키링 아이콘: 파일(36x57) 안 그림은 35.23 x 56.05.
// 그림 가로를 50.64로 맞추려면 이미지 상자 가로 = 36 x 50.64 / 35.23
const KEYRING_ICON_WIDTH = (36 * 50.64) / 35.23

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

// 카드 y 270 (설명 끝 256 + 14)
const ResultCard = styled(IconCard)`
  margin-top: 14px;
`

const InfoList = styled.dl`
  margin: 0;
`

// 이름표: 17px Regular, 상자 높이 20
const InfoLabel = styled.dt`
  font-size: 17px;
  font-weight: 400;
  line-height: 20px;
  color: ${onboardingColors.text};

  /* "키링 ID" 묶음 → "등록 일시" 묶음 간격 */
  & + dd + & {
    margin-top: 10px;
  }
`

// 값: 20px Bold, 줄 높이 25. 이름표와 간격 5
const InfoValue = styled.dd`
  margin: 5px 0 0;
  font-size: 20px;
  font-weight: 700;
  line-height: 25px;
  color: ${onboardingColors.cardValue};
`

// keyringId: 07에서 입력한 코드 / registeredAt: 07에서 "다음"을 누른 시각(Date)
// onBack: 뒤로가기 화살표 / onHome: "홈으로 이동" (실제 홈 화면이 생기면 연결, 지금은 동작 없음)
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
        <ResultCard
          icon={keyringIcon}
          iconWidth={KEYRING_ICON_WIDTH}
          iconOffsetY={2.68}
          bodyOffsetY={4}
          height={171}
          radius={30}
          circleSize={115}
          paddingLeft={25}
          gap={26}
        >
          <InfoList>
            <InfoLabel>키링 ID</InfoLabel>
            <InfoValue>{keyringId}</InfoValue>
            <InfoLabel>등록 일시</InfoLabel>
            <InfoValue>
              <time dateTime={toDateTimeAttribute(registeredAt)}>
                {formatKoreanDate(registeredAt)}
                <br />
                {formatKoreanTime(registeredAt)}
              </time>
            </InfoValue>
          </InfoList>
        </ResultCard>
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
