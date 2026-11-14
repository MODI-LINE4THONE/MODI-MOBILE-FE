import styled from 'styled-components'
import IconCard from '../onboarding/IconCard'
import { onboardingColors } from '../../styles/onboarding/colors'

// 디자인 이미지 측정 (키링 관리)
//   카드 343 x 82, 둥글기 20
//   글자 상자 x 102는 두 카드가 같다
//     - 원 있는 아이콘: 연파랑 원 50, 카드 왼쪽에서 16 (x 41~91), 글자까지 11. 원 안에 그림 35
//     - 원 없는 아이콘(경고): 그림 45, 카드 왼쪽에서 18 (x 43~88), 글자까지 14
const CARD_HEIGHT = 82
const CARD_RADIUS = 20
const CIRCLE_LAYOUT = { slot: 50, paddingLeft: 16, gap: 11 }
const PLAIN_LAYOUT = { slot: 45, paddingLeft: 18, gap: 14 }
// 글자 묶음(24 + 4 + 16 = 44)을 카드 가운데보다 1.5 위로 → 제목 상자 y = 카드 위 + 17.5
const BODY_OFFSET_Y = -1.5

// 제목: 20px Medium, 상자 높이 24
const Title = styled.span`
  display: block;
  font-size: 20px;
  font-weight: 500;
  line-height: 24px;
  color: ${onboardingColors.text};
`

// 설명: 12px Regular, 상자 높이 16, 제목과 간격 4
const Description = styled.span`
  display: block;
  margin-top: 4px;
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
  color: ${onboardingColors.textSub};
`

// 아이콘 + 제목 + 설명 메뉴 카드 (누르면 누름 효과 뒤 onClick)
// icon: 아이콘 이미지 / iconWidth: 그림 가로(px)
// plainIcon: true면 연파랑 원 없이 그림만 (경고 아이콘, 그림 45)
// title, description: 글자. 카드 하나가 버튼 하나라 화면 읽기 프로그램이 제목과 설명을 한 번에 읽는다.
export default function KeyringMenuCard({
  icon,
  iconWidth,
  plainIcon = false,
  title,
  description,
  onClick,
}) {
  const { slot, paddingLeft, gap } = plainIcon ? PLAIN_LAYOUT : CIRCLE_LAYOUT
  return (
    <IconCard
      icon={icon}
      iconWidth={iconWidth}
      height={CARD_HEIGHT}
      radius={CARD_RADIUS}
      circleSize={slot}
      circleColor={plainIcon ? 'transparent' : undefined}
      paddingLeft={paddingLeft}
      gap={gap}
      bodyOffsetY={BODY_OFFSET_Y}
      onClick={onClick}
    >
      <Title>{title}</Title>
      <Description>{description}</Description>
    </IconCard>
  )
}
