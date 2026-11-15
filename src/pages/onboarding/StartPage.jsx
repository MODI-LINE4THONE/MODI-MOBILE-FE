import styled from 'styled-components'
import OnboardingLayout from '../../components/onboarding/OnboardingLayout'
import OnboardingFooter from '../../components/onboarding/OnboardingFooter'
import StatusBar from '../../components/onboarding/StatusBar'
import { onboardingColors } from '../../styles/onboarding/colors'
import { splashBackground } from '../../styles/onboarding/backgrounds'

const STATUS_BAR_HEIGHT = 54
const GREETING_TOP = 354 // 피그마 텍스트 상자 y

// 배경 그라데이션은 화면 전체 기준(스플래시와 같음), 상태 표시줄만 흰색으로 덮는다
const StatusBarArea = styled.div`
  flex-shrink: 0;
  background: ${onboardingColors.background};
`

const Content = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 0 25px;
`

// 피그마 텍스트 상자: y 354, 줄 높이 32 x 2줄 = 64, 가운데 정렬
const Greeting = styled.h1`
  margin: ${GREETING_TOP - STATUS_BAR_HEIGHT}px 0 0;
  font-size: 18px;
  font-weight: 500;
  line-height: 32px;
  color: ${onboardingColors.text};
  text-align: center;
`

// 04 시작
// userId: 인사말에 보일 아이디 (로그인할 때 입력한 아이디)
// onStart: "시작하기"를 누르면 호출 (05 프로필 만들기로)
// "시작하기"는 05~08 하단 버튼과 같은 위치(맨 아래에서 119)라 같은 하단 영역을 "이전으로" 없이 쓴다
export default function StartPage({ userId = 'user01', onStart }) {
  return (
    <OnboardingLayout background={splashBackground}>
      <StatusBarArea>
        <StatusBar />
      </StatusBarArea>
      <Content>
        <Greeting>
          {userId}님, 안녕하세요.
          <br />
          프로필을 만들고 키링을 등록하세요.
        </Greeting>
        <OnboardingFooter primaryLabel="시작하기" onPrimaryClick={onStart} showBack={false} />
      </Content>
    </OnboardingLayout>
  )
}
