import { useState } from 'react'
import styled from 'styled-components'
import OnboardingLayout from '../../components/onboarding/OnboardingLayout'
import OnboardingHeader from '../../components/onboarding/OnboardingHeader'
import NotificationSection from '../../components/notification/NotificationSection'
import FamilyFilter from '../../components/notification/FamilyFilter'
import { groupNotificationsByDay } from '../../features/notification/notificationTime'
import {
  ALL_FAMILY,
  filterByFamily,
  getFamilyFilterOptions,
  resolveSelectedFamily,
} from '../../features/notification/familyFilter'

// 본인 알림과 같은 틀: 첫 묶음 제목 y 145, 카드 x 25, 맨 아래 40
const Content = styled.main`
  padding: 0 25px 40px;
`

const TODAY_EMPTY_MESSAGE = '오늘 받은 알림이 없어요.'

// 묶음 하나 + 그 묶음 전용 가족 필터 (필터 선택은 묶음마다 따로)
// filterLabel: 화면 읽기 프로그램이 읽을 필터 이름 (어느 묶음의 필터인지)
function FilteredSection({
  title,
  filterLabel,
  notifications,
  profiles,
  now,
  onActionClick,
  emptyMessage,
}) {
  const [selectedId, setSelectedId] = useState(ALL_FAMILY)
  const options = getFamilyFilterOptions(notifications, profiles)
  const currentId = resolveSelectedFamily(options, selectedId)

  return (
    <NotificationSection
      title={title}
      notifications={filterByFamily(notifications, currentId)}
      now={now}
      onActionClick={onActionClick}
      emptyMessage={emptyMessage}
      headerAccessory={
        <FamilyFilter
          label={filterLabel}
          options={options}
          selectedId={currentId}
          onChange={setSelectedId}
        />
      }
    />
  )
}

// 가족 알림
// notifications: 알림 목록 (features/notification/notifications.js 모양, familyId 포함)
// profiles: 가족 목록 (features/family/familyProfiles.js 모양) → 필터 칩 이름·순서
// now: "오늘/이전 알림" 묶기와 시간 표시 기준 시각
// onBack: 뒤로가기 화살표를 누르면 호출
// onActionClick(notification): 바로가기 버튼을 누르면 호출 (없으면 누름 효과만)
// 빈 묶음: "오늘"은 안내 문구, "이전 알림"은 숨김
export default function FamilyNotificationPage({
  notifications = [],
  profiles = [],
  now = new Date(),
  onBack,
  onActionClick,
}) {
  const { today, earlier } = groupNotificationsByDay(notifications, now)

  return (
    <OnboardingLayout withStatusBar>
      <OnboardingHeader title="알림" onBack={onBack} />
      <Content>
        <FilteredSection
          title="오늘"
          filterLabel="오늘 알림 가족별 보기"
          notifications={today}
          profiles={profiles}
          now={now}
          onActionClick={onActionClick}
          emptyMessage={TODAY_EMPTY_MESSAGE}
        />
        <FilteredSection
          title="이전 알림"
          filterLabel="이전 알림 가족별 보기"
          notifications={earlier}
          profiles={profiles}
          now={now}
          onActionClick={onActionClick}
        />
      </Content>
    </OnboardingLayout>
  )
}
