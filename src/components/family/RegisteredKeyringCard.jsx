import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { onboardingColors } from '../../styles/onboarding/colors'

// ─────────────────────────────────────────────────────────────
// 디자인 이미지 측정 (가족 프로필 상세, 카드 기준. 카드 343 x 156, 둥글기 30)
//   "등록된 키링"  18px Medium, 상자 높이 24, 카드 위 + 25, 왼쪽 16
//   "등록 코드"    14px Medium, 상자 높이 18, 제목 아래 7
//   "사용 중"      47 x 25 (글자 12px), 카드 위 + 26, 오른쪽 15
//   구분선         321 x 1, 등록 코드 아래 20 (카드 위 + 94), 좌우 11
//   "키링 관리"    18px Medium, 상자 높이 24, 구분선 아래 17, 카드 끝까지 20
//   화살표(>)      5.54 x 11.08, 카드 오른쪽에서 17.5
// ─────────────────────────────────────────────────────────────
const PADDING_X = 16
const DIVIDER_INSET = 11

// 누르는 동안 + 누른 뒤 이동 전까지(data-pressed): 배경색 진하게 + 0.98배 (앱 안의 다른 카드와 같음)
// 구분선은 눌린 배경과 같은 색이라 누르면 보이지 않는다 (디자인 이미지와 같음)
const Card = styled.button.attrs({ type: 'button' })`
  position: relative;
  display: block;
  width: 100%;
  margin: 0;
  padding: 25px ${PADDING_X}px 20px;
  border: none;
  border-radius: 30px;
  background: ${onboardingColors.cardBackground};
  color: inherit;
  font: inherit;
  text-align: left;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition:
    transform 0.1s ease-out,
    background-color 0.1s ease-out;

  &:active,
  &[data-pressed='true'] {
    background: ${onboardingColors.cardPressed};
    transform: scale(0.98);
  }

  &:focus-visible {
    outline: 2px solid ${onboardingColors.text};
    outline-offset: 2px;
  }
`

const Title = styled.span`
  display: block;
  font-size: 18px;
  font-weight: 500;
  line-height: 24px;
  color: ${onboardingColors.text};
`

const Code = styled.span`
  display: block;
  margin-top: 7px;
  font-size: 14px;
  font-weight: 500;
  line-height: 18px;
  color: ${onboardingColors.textSub};
`

// "사용 중" 표시: 흰 배경 + 초록 안쪽 그림자 테두리 (가족 홈 태그와 같은 방식, 색만 초록)
const Badge = styled.span`
  position: absolute;
  top: 26px;
  right: 15px;
  display: block;
  height: 25px;
  padding: 0 6px;
  border-radius: 10px;
  background: ${onboardingColors.keyringBadgeBackground};
  box-shadow: inset 0 0 2px 0 ${onboardingColors.keyringBadgeShadow};
  font-size: 12px;
  font-weight: 500;
  line-height: 25px;
  color: ${onboardingColors.keyringBadgeText};
  white-space: nowrap;
`

const Divider = styled.span`
  display: block;
  height: 1px;
  margin: 20px ${DIVIDER_INSET - PADDING_X}px 0;
  background: ${onboardingColors.familyProfileDivider};
`

const ManageRow = styled.span`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 17px;
`

const ManageLabel = styled.span`
  font-size: 18px;
  font-weight: 500;
  line-height: 24px;
  color: ${onboardingColors.text};
`

// 화살표: 꺾은선이 5.54 x 11.08 상자를 꽉 채우고, 선 두께는 상자 밖으로 나온다 (디자인 이미지와 같은 크기)
// 오른쪽 끝(선 포함)은 카드 오른쪽에서 17.5, 세로는 "키링 관리" 줄 가운데보다 1.5 아래 (디자인 이미지 측정)
const Chevron = styled.svg`
  display: block;
  flex-shrink: 0;
  width: 5.54px;
  height: 11.08px;
  margin-right: 2.2px;
  overflow: visible;
  color: ${onboardingColors.textSub};
  transform: translateY(1.5px);
`

// 누름 효과(0.1초 전환)가 끝까지 보이도록 동작을 늦추는 시간 (가족 홈 카드·IconCard와 같음)
const PRESS_DELAY_MS = 150

// 등록된 키링 카드 ("등록된 키링" + "사용 중" + 등록 코드 + 구분선 + "키링 관리 >")
// 카드 전체가 버튼 하나. 누르면 누름 효과를 보여 준 뒤 onClick (키링 관리로 이동)
// keyringId: 등록 코드 / onClick: 누르면 호출 (없으면 누름 효과만)
export default function RegisteredKeyringCard({ keyringId, onClick, className }) {
  const [pressed, setPressed] = useState(false)
  const timerRef = useRef(null)
  useEffect(() => () => clearTimeout(timerRef.current), [])

  // 기다리는 동안 다시 눌러도 무시
  const handleClick = (event) => {
    if (timerRef.current) return
    setPressed(true)
    timerRef.current = setTimeout(() => {
      timerRef.current = null
      setPressed(false)
      onClick?.(event)
    }, PRESS_DELAY_MS)
  }

  return (
    <Card
      className={className}
      onClick={handleClick}
      data-pressed={pressed}
      aria-label={`키링 관리, 등록된 키링 사용 중, 등록 코드 ${keyringId}`}
    >
      <Title>등록된 키링</Title>
      <Badge>사용 중</Badge>
      <Code>등록 코드 {keyringId}</Code>
      <Divider />
      <ManageRow>
        <ManageLabel>키링 관리</ManageLabel>
        <Chevron viewBox="0 0 5.54 11.08" fill="none" aria-hidden="true">
          <path
            d="M0 0L5.54 5.54L0 11.08"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Chevron>
      </ManageRow>
    </Card>
  )
}
