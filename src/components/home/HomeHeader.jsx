import styled from 'styled-components'
import { onboardingColors } from '../../styles/onboarding/colors'
import modiLogo from '../../assets/images/modi-logo.png'
import bellIcon from '../../assets/icons/icon-bell.svg'

// 피그마: 로고 x=25 y=82 (57x20), 종 x=345 y=82 (24x24) / 상태 표시줄(54) 아래
const Header = styled.header`
  display: flex;
  flex-shrink: 0;
  align-items: flex-start;
  justify-content: space-between;
  margin-top: 28px; /* 상태 표시줄(54) + 28 = 82 */
  padding: 0 24px 0 25px; /* 종 오른쪽 끝 369 → 393 - 369 = 24 */
`

const Logo = styled.img`
  display: block;
  width: 57px;
  height: 20px;
`

const Bell = styled.span`
  position: relative;
  display: block;
  width: 24px;
  height: 24px;
`

const BellIcon = styled.img`
  display: block;
  width: 24px;
  height: 24px;
`

// 피그마: 점 x=358 y=80 (지름 11) → 종 기준 왼쪽 13, 위로 2
const Dot = styled.span`
  position: absolute;
  top: -2px;
  left: 13px;
  width: 11px;
  height: 11px;
  border-radius: 50%;
  background: ${onboardingColors.notificationDot};
`

// 홈 상단: 왼쪽 MODI 로고 + 오른쪽 알림 종
// hasNewNotification: true면 종 오른쪽 위에 파란 점 표시
// 알림 화면이 아직 없어서 종은 누를 수 없는 그림으로 둔다.
export default function HomeHeader({ hasNewNotification = false }) {
  return (
    <Header>
      <Logo src={modiLogo} alt="MODI" />
      <Bell role="img" aria-label={hasNewNotification ? '알림, 새 알림 있음' : '알림'}>
        <BellIcon src={bellIcon} alt="" />
        {hasNewNotification && <Dot />}
      </Bell>
    </Header>
  )
}
