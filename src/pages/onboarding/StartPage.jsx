import styled from 'styled-components'
import OnboardingLayout from '../../components/onboarding/OnboardingLayout'
import IconCard from '../../components/onboarding/IconCard'
import { onboardingColors } from '../../styles/onboarding/colors'
import personIcon from '../../assets/icons/icon-person.svg'
import keyringIcon from '../../assets/icons/icon-keyring.svg'

const Content = styled.div`
  padding: 0 25px;
`

// 피그마 텍스트 상자: y=145, 줄 높이 32 x 2줄 = 64
const Greeting = styled.h1`
  margin: 91px 0 0; /* 상태 표시줄(54) + 91 = 145 */
  font-size: 20px;
  font-weight: 500;
  line-height: 32px;
`

const CardList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 114px; /* 인사말 끝(209) + 114 = 첫 카드 y 323 */
`

const CardTitle = styled.span`
  display: block;
  font-size: 20px;
  font-weight: 500;
  line-height: 24px;
  color: ${onboardingColors.text};
`

const CardDescription = styled.span`
  display: block;
  margin-top: 8px;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: ${onboardingColors.textSub};
  white-space: pre-line; /* 디자인과 같은 위치에서 줄바꿈 */
`

// 따로 열었을 때도 카드가 버튼 모양(누름 효과)을 유지하도록 빈 동작을 넘긴다
const noop = () => {}

// userId: 인사말에 보일 아이디 (로그인할 때 입력한 아이디)
// onProfileClick / onNfcClick: 각 카드를 누르면 호출
export default function StartPage({ userId = 'user01', onProfileClick, onNfcClick }) {
  return (
    <OnboardingLayout withStatusBar>
      <Content>
        <Greeting>
          {userId}님, 안녕하세요.
          <br />
          어떤 걸 시작할까요?
        </Greeting>
        <CardList>
          <IconCard icon={personIcon} iconOffsetY={1} onClick={onProfileClick ?? noop}>
            <CardTitle>접근성 프로필 설정</CardTitle>
            <CardDescription>
              {'글자 크기, 화면 대비 등을\n나에게 맞게 설정해요'}
            </CardDescription>
          </IconCard>
          <IconCard icon={keyringIcon} iconOffsetY={1.5} onClick={onNfcClick ?? noop}>
            <CardTitle>NFC 키링 등록</CardTitle>
            <CardDescription>
              {'키오스크에 가져다 대기만 하면\n내 설정이 자동으로 적용돼요'}
            </CardDescription>
          </IconCard>
        </CardList>
      </Content>
    </OnboardingLayout>
  )
}
