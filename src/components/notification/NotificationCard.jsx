import styled from 'styled-components'
import { onboardingColors } from '../../styles/onboarding/colors'
import { ACTION_TONE, NOTIFICATION_ICON } from '../../features/notification/notifications'
import { formatNotificationTime } from '../../features/notification/notificationTime'
import keyringIcon from '../../assets/icons/icon-keyring.svg'
import warningIcon from '../../assets/icons/icon-warning.svg'
import personIcon from '../../assets/icons/icon-person.svg'
import kioskIcon from '../../assets/icons/icon-kiosk.svg'

// 피그마 값 + 디자인 이미지 측정 (카드 기준)
const PADDING_TOP = 14 // 제목 상자(32) 위. 이미지: 제목 글자 가운데 = 카드 위 + 30
const PADDING_SIDE = 15
const PADDING_BOTTOM = 18
const CIRCLE_SIZE = 60
const CIRCLE_TOP = 20 // 이미지: 원 위 = 카드 위 + 20 (버튼이 있는 카드도 같음)
const CIRCLE_GAP = 12
const TITLE_LINE = 32
const DESCRIPTION_LINE = 18
const BUTTON_HEIGHT = 25
const BUTTON_TOP = 5 // 설명 상자 끝 ~ 버튼 위. 카드 높이(130)가 이미지와 같고 아래 여백이 18이 되는 값
// 이미지의 두 버튼은 글자 좌우 여백이 다르다(약 8~10 / 4.5). 같은 값으로 두고 가운데 값 8을 쓴다.
const BUTTON_PADDING_SIDE = 8
const TIME_GAP = 8 // 제목이 길 때 시간과 붙지 않도록 띄우는 최소 간격

// 아이콘 그림과 크기 (이미지 측정: 원 60 안에서 보이는 가로 크기)
// offsetY: 원 가운데보다 위로 올리는 정도 (홈 카드와 같은 시각 보정)
const ICONS = {
  [NOTIFICATION_ICON.keyring]: { src: keyringIcon, width: 26, offsetY: 1.5 },
  [NOTIFICATION_ICON.person]: { src: personIcon, width: 33, offsetY: 1 },
  [NOTIFICATION_ICON.kiosk]: { src: kioskIcon, width: 30.5, offsetY: 0 },
  // 경고 그림은 주황 원까지 그려진 50px 그림 → 연파랑 원 없이 60 자리 가운데
  [NOTIFICATION_ICON.warning]: { src: warningIcon, width: 50, offsetY: 0, plain: true },
}

const TONES = {
  [ACTION_TONE.warning]: {
    text: onboardingColors.shortcutWarningText,
    shadow: onboardingColors.shortcutWarningShadow,
  },
  [ACTION_TONE.primary]: {
    text: onboardingColors.shortcutPrimaryText,
    shadow: onboardingColors.shortcutPrimaryShadow,
  },
}

const Card = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${CIRCLE_GAP}px;
  width: 100%;
  padding: ${PADDING_TOP}px ${PADDING_SIDE}px ${PADDING_BOTTOM}px;
  border-radius: 15px;
  background: ${onboardingColors.cardBackground};
`

const Circle = styled.span`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: ${CIRCLE_SIZE}px;
  height: ${CIRCLE_SIZE}px;
  margin-top: ${CIRCLE_TOP - PADDING_TOP}px;
  border-radius: 50%;
  background: ${({ $plain }) => ($plain ? 'transparent' : onboardingColors.iconCircle)};
`

const Icon = styled.img`
  display: block;
  width: ${({ $width }) => $width}px;
  height: auto;
  transform: translateY(${({ $offsetY }) => -$offsetY}px);
`

const Body = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: flex-start;
  min-width: 0;
`

const Top = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${TIME_GAP}px;
  width: 100%;
`

const Title = styled.span`
  min-width: 0;
  font-size: 14px;
  font-weight: 500;
  line-height: ${TITLE_LINE}px;
  color: ${onboardingColors.text};
  word-break: keep-all;
`

// 이미지: 시간 글자 가운데 = 제목 글자 가운데 → 같은 줄 높이(32)로 맞춘다
const Time = styled.time`
  flex-shrink: 0;
  font-size: 12px;
  font-weight: 500;
  line-height: ${TITLE_LINE}px;
  color: ${onboardingColors.textSub};
  white-space: nowrap;
`

const Description = styled.p`
  margin: 0;
  font-size: 12px;
  font-weight: 400;
  line-height: ${DESCRIPTION_LINE}px;
  color: ${onboardingColors.textSub};
  white-space: pre-line; /* 디자인과 같은 위치에서 줄바꿈 */
  word-break: keep-all;
`

const ShortcutButton = styled.button.attrs({ type: 'button' })`
  height: ${BUTTON_HEIGHT}px;
  margin: ${BUTTON_TOP}px 0 0;
  padding: 0 ${BUTTON_PADDING_SIDE}px;
  border: none;
  border-radius: 10px;
  background: ${onboardingColors.shortcutBackground};
  box-shadow: inset 0 0 2px 0 ${({ $tone }) => $tone.shadow};
  color: ${({ $tone }) => $tone.text};
  font: inherit;
  font-size: 12px;
  font-weight: 500;
  line-height: ${BUTTON_HEIGHT}px;
  white-space: nowrap;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition:
    transform 0.1s ease-out,
    background-color 0.1s ease-out;

  /* 누르는 동안: 배경색 진하게 + 0.98배 (다른 카드·버튼과 같은 효과) */
  &:active {
    background: ${onboardingColors.shortcutPressed};
    transform: scale(0.98);
  }

  &:focus-visible {
    outline: 2px solid ${onboardingColors.text};
    outline-offset: 2px;
  }
`

// 화면에는 안 보이고 화면 읽기 프로그램만 읽는 글자
const ScreenReaderOnly = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
  border: 0;
`

// 화면 읽기 프로그램이 한 번에 읽을 문장: "키링을 사용했어요, 방금 전, 모디카페 강남점에서…"
// 제목 끝 마침표는 빼서 쉼표와 겹치지 않게 한다.
function toSpokenText(title, timeLabel, description) {
  return `${title.replace(/\.$/, '')}, ${timeLabel}, ${description.replace(/\n/g, ' ')}`
}

// 알림 하나: 왼쪽 원 아이콘 + 제목 / 오른쪽 위 시간 / 설명 / (있으면) 바로가기 버튼
// notification: features/notification/notifications.js 모양
// now: 시간 표시 기준 시각
// onActionClick(notification): 바로가기 버튼을 누르면 호출 (없으면 누름 효과만)
export default function NotificationCard({ notification, now, onActionClick }) {
  const { icon, title, description, createdAt, action } = notification
  const iconInfo = ICONS[icon] ?? ICONS[NOTIFICATION_ICON.person]
  const timeLabel = formatNotificationTime(createdAt, now)
  const tone = TONES[action?.tone] ?? TONES[ACTION_TONE.primary]

  return (
    <Card>
      <Circle $plain={iconInfo.plain} aria-hidden="true">
        <Icon src={iconInfo.src} alt="" $width={iconInfo.width} $offsetY={iconInfo.offsetY} />
      </Circle>
      <Body>
        <ScreenReaderOnly>{toSpokenText(title, timeLabel, description)}</ScreenReaderOnly>
        <Top aria-hidden="true">
          <Title>{title}</Title>
          <Time dateTime={createdAt}>{timeLabel}</Time>
        </Top>
        <Description aria-hidden="true">{description}</Description>
        {action && (
          <ShortcutButton $tone={tone} onClick={() => onActionClick?.(notification)}>
            {action.label}
          </ShortcutButton>
        )}
      </Body>
    </Card>
  )
}
