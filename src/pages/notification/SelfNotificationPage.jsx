import styled from 'styled-components'
import OnboardingLayout from '../../components/onboarding/OnboardingLayout'
import OnboardingHeader from '../../components/onboarding/OnboardingHeader'
import NotificationSection from '../../components/notification/NotificationSection'
import { groupNotificationsByDay } from '../../features/notification/notificationTime'

// 헤더(상태 표시줄 54 + 75) 아래 16 → 첫 묶음 제목 y 145 (OnboardingHeader 공통 규칙)
// 카드 x 25, 가로 343. 맨 아래 카드 아래에는 40을 띄운다 (디자인 이미지는 아래가 잘려 있음)
const Content = styled.main`
  padding: 0 25px 40px;
`

// 본인 알림
// notifications: 알림 목록 (features/notification/notifications.js 모양)
// now: "오늘/이전 알림" 묶기와 시간 표시 기준 시각
// onBack: 뒤로가기 화살표를 누르면 호출
// onActionClick(notification): 바로가기 버튼을 누르면 호출 (없으면 누름 효과만)
export default function SelfNotificationPage({
  notifications = [],
  now = new Date(),
  onBack,
  onActionClick,
}) {
  const { today, earlier } = groupNotificationsByDay(notifications, now)

  return (
    <OnboardingLayout withStatusBar>
      <OnboardingHeader title="알림" onBack={onBack} />
      <Content>
        <NotificationSection
          title="오늘"
          notifications={today}
          now={now}
          onActionClick={onActionClick}
        />
        <NotificationSection
          title="이전 알림"
          notifications={earlier}
          now={now}
          onActionClick={onActionClick}
        />
      </Content>
    </OnboardingLayout>
  )
}
