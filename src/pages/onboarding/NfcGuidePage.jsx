import styled from 'styled-components'
import OnboardingLayout from '../../components/onboarding/OnboardingLayout'
import OnboardingHeader from '../../components/onboarding/OnboardingHeader'
import OnboardingFooter from '../../components/onboarding/OnboardingFooter'
import { onboardingColors } from '../../styles/onboarding/colors'
import keyringImage from '../../assets/images/nfc-keyring.png'

const GUIDE_STEPS = [
  'NFC 키링 뒷면의 등록 코드를 확인합니다.',
  '등록 코드를 입력합니다.',
  '설정이 완료되면 키링이 내 계정에 자동으로 연결됩니다.',
]

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

// y 208 (제목 끝 183 + 25). x 59: 가운데(61.19)에서 시각 보정으로 왼쪽
const KeyringImage = styled.img`
  display: block;
  flex-shrink: 0;
  align-self: flex-start;
  width: 270.62px;
  height: 293px;
  margin: 25px 0 0 34px;
`

// y 544 (이미지 끝 501 + 43). 348px: 오른쪽 끝이 다른 요소보다 5px 더 나간다(의도)
const GuideList = styled.ol`
  flex-shrink: 0;
  align-self: flex-start;
  width: 348px;
  height: 99px;
  margin: 43px 0 0;
  padding: 13px 0 0 10px;
  border-radius: 15px;
  background: ${onboardingColors.infoBoxBackground};
  color: ${onboardingColors.text};
  font-size: 14px;
  font-weight: 400;
  line-height: 24px;
  list-style: none;
  counter-reset: guide;
`

// 피그마 번호 목록 들여쓰기에 맞춤: 번호 상자 x 39, 글자 상자 x 56
// (브라우저 기본 번호는 간격을 조절할 수 없어 번호를 직접 그린다)
const GuideItem = styled.li`
  position: relative;
  padding-left: 21px;
  counter-increment: guide;

  &::before {
    content: counter(guide) '.';
    position: absolute;
    left: 4px;
    font-variant-numeric: tabular-nums; /* 숫자 폭 고정: 마침표 위치가 줄마다 같다 */
  }
`

// onBack: 뒤로가기 화살표 / onNext: "다음" / onPrevious: "이전으로"
export default function NfcGuidePage({ onBack, onNext, onPrevious }) {
  return (
    <OnboardingLayout withStatusBar>
      <OnboardingHeader title="NFC 키링 등록" onBack={onBack} />
      <Content>
        <Title>등록 방법</Title>
        <KeyringImage src={keyringImage} alt="MODI NFC 키링. 뒷면에 등록 코드가 적혀 있어요." />
        {/* list-style: none이면 Safari VoiceOver가 목록으로 읽지 않아 role="list"를 붙인다 */}
        <GuideList role="list">
          {GUIDE_STEPS.map((text) => (
            <GuideItem key={text}>{text}</GuideItem>
          ))}
        </GuideList>
        <OnboardingFooter
          primaryLabel="다음"
          onPrimaryClick={onNext}
          onBackClick={onPrevious}
          step={1}
          totalSteps={3}
          progressLabel="NFC 키링 등록 단계"
        />
      </Content>
    </OnboardingLayout>
  )
}
