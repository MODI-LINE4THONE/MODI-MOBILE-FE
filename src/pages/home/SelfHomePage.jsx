import styled from 'styled-components'
import OnboardingLayout from '../../components/onboarding/OnboardingLayout'
import IconCard from '../../components/onboarding/IconCard'
import HomeHeader from '../../components/home/HomeHeader'
import { onboardingColors } from '../../styles/onboarding/colors'
import personIcon from '../../assets/icons/icon-person.svg'
import kioskIcon from '../../assets/icons/icon-kiosk.svg'
import keyringIcon from '../../assets/icons/icon-keyring.svg'

const Content = styled.div`
  padding: 0 25px;
`

// 피그마 텍스트 상자: y=145, 줄 높이 32 x 2줄 = 64
const Greeting = styled.h1`
  margin: 39px 0 0; /* 헤더 끝(82 + 24 = 106) + 39 = 145 */
  font-size: 20px;
  font-weight: 500;
  line-height: 32px;
`

const CardList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 59px; /* 인사말 끝(209) + 59 = 첫 카드 y 268 */
`

// 카드 글자: 04 시작 화면 카드와 같은 값
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

// 이동할 화면이 아직 없어서, 누름 효과만 보이도록 빈 동작을 넘긴다
const noop = () => {}

// 홈 카드는 04 카드보다 원·글자가 왼쪽에 있다 (디자인 이미지 측정: 원 x=43, 제목 x=136)
// 크기, 둥글기, 원 크기, 글자 값은 04 카드(IconCard 기본값)와 같다.
const HOME_CARD_PADDING_LEFT = 18 // 카드 왼쪽 끝(25) + 18 = 원 x 43
const HOME_CARD_GAP = 12.5 // 원 끝(123) + 12.5 = 글자 상자 x 135.5

// 본인 홈
// userId: 인사말에 보일 아이디 (로그인할 때 입력한 아이디)
// hasNewNotification: 새 알림이 있으면 종 아이콘에 파란 점
// onSettingsClick / onPracticeClick / onKeyringClick: 각 카드를 누르면 호출 (없으면 동작 없음)
export default function SelfHomePage({
  userId = 'user01',
  hasNewNotification = false,
  onSettingsClick,
  onPracticeClick,
  onKeyringClick,
}) {
  return (
    <OnboardingLayout withStatusBar>
      <HomeHeader hasNewNotification={hasNewNotification} />
      <Content>
        <Greeting>
          {userId}님, 반가워요.
          <br />
          MODI로 더 편리한 키오스크를 경험해요.
        </Greeting>
        <CardList>
          <IconCard
            icon={personIcon}
            iconOffsetY={1}
            paddingLeft={HOME_CARD_PADDING_LEFT}
            gap={HOME_CARD_GAP}
            onClick={onSettingsClick ?? noop}
          >
            <CardTitle>접근성 설정</CardTitle>
            <CardDescription>
              {'키오스크 화면을 보기 편하게\n직접 맞춰볼 수 있어요.'}
            </CardDescription>
          </IconCard>
          <IconCard
            icon={kioskIcon}
            iconWidth={41}
            paddingLeft={HOME_CARD_PADDING_LEFT}
            gap={HOME_CARD_GAP}
            onClick={onPracticeClick ?? noop}
          >
            <CardTitle>키오스크 연습</CardTitle>
            <CardDescription>
              {'내 설정이 적용된 화면으로\n미리 주문을 연습해요.'}
            </CardDescription>
          </IconCard>
          <IconCard
            icon={keyringIcon}
            iconOffsetY={1.5}
            paddingLeft={HOME_CARD_PADDING_LEFT}
            gap={HOME_CARD_GAP}
            onClick={onKeyringClick ?? noop}
          >
            <CardTitle>키링 관리</CardTitle>
            <CardDescription>
              {'새 키링을 등록하거나 바꿔요.\n키링을 잃어버리면 바로 신고해요.'}
            </CardDescription>
          </IconCard>
        </CardList>
      </Content>
    </OnboardingLayout>
  )
}
