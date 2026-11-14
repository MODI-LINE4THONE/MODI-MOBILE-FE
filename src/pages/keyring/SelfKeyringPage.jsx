import styled from 'styled-components'
import OnboardingLayout from '../../components/onboarding/OnboardingLayout'
import OnboardingHeader from '../../components/onboarding/OnboardingHeader'
import KeyringInfoCard from '../../components/keyring/KeyringInfoCard'
import KeyringMenuCard from '../../components/keyring/KeyringMenuCard'
import { onboardingColors } from '../../styles/onboarding/colors'
import linkIcon from '../../assets/icons/icon-link.svg'
import warningIcon from '../../assets/icons/icon-warning.svg'

// 카드 x 25, 가로 343. 맨 아래 카드 아래에는 40을 띄운다
const Content = styled.main`
  padding: 0 25px 40px;
`

// 피그마 텍스트 상자: y 208, 높이 24
// 헤더 아래 첫 글자 위치(y 145, OnboardingHeader 공통 규칙) + 63 = 208
const Title = styled.h2`
  margin: 63px 0 0;
  font-size: 20px;
  font-weight: 500;
  line-height: 24px;
  color: ${onboardingColors.text};
`

// 정보 카드 y 248 (제목 끝 232 + 16)
const InfoCard = styled(KeyringInfoCard)`
  margin-top: 16px;
`

// 메뉴 첫 카드 y 464 (정보 카드 끝 424 + 40), 카드 사이 16
const MenuList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 40px;
`

// 경고 아이콘 파일은 50x50. 디자인 이미지대로 45로 그린다
const WARNING_ICON_WIDTH = 45
const LINK_ICON_WIDTH = 35

// 따로 열었을 때도 카드 모양(누름 효과)을 유지하도록 빈 동작을 넘긴다
const noop = () => {}

// 본인 키링 관리
// userId: 제목에 보일 아이디 (로그인 아이디)
// keyringId / registeredAt: 07에서 등록한 키링 (없으면 08과 같은 기본값)
// onBack: 뒤로가기 화살표를 누르면 호출
// onConnectClick: "새 키링 연결하기" → 새 키링 발급 화면
// onLostClick: "키링을 분실하셨나요?" → 키링 분실 화면
export default function SelfKeyringPage({
  userId = 'user01',
  keyringId,
  registeredAt,
  onBack,
  onConnectClick,
  onLostClick,
}) {
  return (
    <OnboardingLayout withStatusBar>
      <OnboardingHeader title="키링 관리" onBack={onBack} />
      <Content>
        <Title>{userId}님의 키링</Title>
        <InfoCard keyringId={keyringId} registeredAt={registeredAt} size="manage" />
        <MenuList>
          <KeyringMenuCard
            icon={linkIcon}
            iconWidth={LINK_ICON_WIDTH}
            title="새 키링 연결하기"
            description="새로운 키링을 발급하고 어플과 연결해요."
            onClick={onConnectClick ?? noop}
          />
          <KeyringMenuCard
            icon={warningIcon}
            iconWidth={WARNING_ICON_WIDTH}
            plainIcon
            title="키링을 분실하셨나요?"
            description="기존 키링을 비활성화하고 새 키링을 발급해요."
            onClick={onLostClick ?? noop}
          />
        </MenuList>
      </Content>
    </OnboardingLayout>
  )
}
