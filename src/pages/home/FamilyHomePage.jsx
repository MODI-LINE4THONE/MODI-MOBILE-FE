import styled from 'styled-components'
import OnboardingLayout from '../../components/onboarding/OnboardingLayout'
import PrimaryButton from '../../components/onboarding/PrimaryButton'
import HomeHeader from '../../components/home/HomeHeader'
import FamilyProfileCard from '../../components/home/FamilyProfileCard'

// 화면 높이에 맞춘 틀: 카드 목록만 스크롤되고, 아래 버튼은 고정
const Layout = styled(OnboardingLayout)`
  height: 100dvh;
`

// 피그마 텍스트 상자: y=145, 줄 높이 32 x 2줄 = 64 (본인 홈과 같음)
const Greeting = styled.h1`
  flex-shrink: 0;
  margin: 39px 0 0; /* 헤더 끝(82 + 24 = 106) + 39 = 145 */
  padding: 0 25px;
  font-size: 20px;
  font-weight: 500;
  line-height: 32px;
`

// 키보드 초점 테두리(2 + 간격 2)가 스크롤 영역 끝에서 잘리지 않도록 안쪽 여백.
// 같은 만큼 바깥 위치를 당겨서 보이는 카드 위치는 그대로 둔다.
const FOCUS_SPACE = 4

const ScrollArea = styled.div`
  flex: 1;
  min-height: 0;
  /* 위: 인사말 끝(209) + 59 = 첫 카드 y 268 / 좌우: 카드 x 25
     아래: 목록이 잘리는 선(스크롤 영역 바깥 끝) ~ 버튼 24.
     아래 안쪽 여백은 맨 끝까지 내렸을 때만 보이는 빈칸이라 잘리는 선 위치에 영향이 없다. */
  margin: ${59 - FOCUS_SPACE}px ${25 - FOCUS_SPACE}px 24px;
  padding: ${FOCUS_SPACE}px;
  overflow-y: auto;
  overscroll-behavior: contain;
`

const CardList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin: 0;
  padding: 0;
  list-style: none;
`

const Footer = styled.div`
  flex-shrink: 0;
  padding: 0 25px 64px; /* 버튼 아래 ~ 화면 맨 아래 64 */
`

// 따로 열었을 때도 버튼 모양(누름 효과)을 유지하도록 빈 동작을 넘긴다
const noop = () => {}

// 가족 홈
// userId: 인사말에 보일 아이디 (로그인할 때 입력한 아이디)
// hasNewNotification: 새 알림이 있으면 종 아이콘에 파란 점
// profiles: 가족 프로필 목록 (features/family/familyProfiles.js 모양)
// onProfileClick(profile) / onAddClick: 카드·"가족 프로필 추가"를 누르면 호출 (없으면 동작 없음)
// onNotificationClick: 알림 종을 누르면 호출 (없으면 누름 효과만)
export default function FamilyHomePage({
  userId = 'user01',
  hasNewNotification = false,
  profiles = [],
  onProfileClick,
  onAddClick,
  onNotificationClick,
}) {
  return (
    <Layout withStatusBar>
      <HomeHeader
        hasNewNotification={hasNewNotification}
        onNotificationClick={onNotificationClick}
      />
      <Greeting>
        {userId}님, 반가워요.
        <br />
        MODI로 가족의 키오스크 이용을 도와요.
      </Greeting>
      <ScrollArea>
        <CardList aria-label="가족 프로필">
          {profiles.map((profile) => (
            <li key={profile.id}>
              <FamilyProfileCard
                profile={profile}
                onClick={onProfileClick ? () => onProfileClick(profile) : undefined}
              />
            </li>
          ))}
        </CardList>
      </ScrollArea>
      <Footer>
        <PrimaryButton onClick={onAddClick ?? noop}>가족 프로필 추가</PrimaryButton>
      </Footer>
    </Layout>
  )
}
