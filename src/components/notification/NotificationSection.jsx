import { useId } from 'react'
import styled from 'styled-components'
import { onboardingColors } from '../../styles/onboarding/colors'
import NotificationCard from './NotificationCard'

// 피그마: 묶음 제목 텍스트 상자 높이 18 / 카드 사이 10 / 묶음 사이 20 (앞 묶음 마지막 카드 ~ 다음 제목)
// 이미지 측정: 제목 상자 끝 ~ 첫 카드 34 (제목 y 145 + 18 = 163 → 첫 카드 y 197)
const TITLE_LINE = 18
const TITLE_TO_CARDS = 34
const TITLE_INDENT = 3 // 이미지 측정: 제목 x 28 = 카드 x 25 + 3
const CARD_GAP = 10
const SECTION_GAP = 20

const Section = styled.section`
  & + & {
    margin-top: ${SECTION_GAP}px;
  }
`

const Title = styled.h2`
  margin: 0 0 ${TITLE_TO_CARDS}px;
  padding-left: ${TITLE_INDENT}px;
  font-size: 18px;
  font-weight: 500;
  line-height: ${TITLE_LINE}px;
  color: ${onboardingColors.text};
`

const List = styled.ul`
  display: flex;
  flex-direction: column;
  gap: ${CARD_GAP}px;
  margin: 0;
  padding: 0;
  list-style: none;
`

// 알림 묶음: 제목("오늘", "이전 알림") + 알림 카드 목록. 알림이 없으면 그리지 않는다.
// notifications: 이 묶음의 알림 (이미 정렬된 순서대로 보여 준다)
// now / onActionClick: NotificationCard로 그대로 넘긴다
export default function NotificationSection({ title, notifications, now, onActionClick }) {
  const titleId = useId()
  if (notifications.length === 0) return null

  return (
    <Section aria-labelledby={titleId}>
      <Title id={titleId}>{title}</Title>
      <List>
        {notifications.map((notification) => (
          <li key={notification.id}>
            <NotificationCard notification={notification} now={now} onActionClick={onActionClick} />
          </li>
        ))}
      </List>
    </Section>
  )
}
