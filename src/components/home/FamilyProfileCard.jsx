import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { onboardingColors } from '../../styles/onboarding/colors'
import { FAMILY_STATUS } from '../../features/family/familyProfiles'

const STATUS = {
  [FAMILY_STATUS.registered]: { label: '등록 완료', color: onboardingColors.familyStatusRegistered },
  [FAMILY_STATUS.pending]: { label: '등록 대기', color: onboardingColors.familyStatusPending },
}
const PENDING_MESSAGE = '키링을 연결해 주세요.'

// 피그마 값 (카드 기준)
const PADDING_TOP = 13
const PADDING_LEFT = 15 // 사진 x = 25 + 15 = 40 (디자인 이미지 측정)
const PADDING_RIGHT = 18
const PADDING_BOTTOM = 17 // 등록 완료 카드: 태그 끝(115) ~ 카드 끝(132)
const AVATAR_WIDTH = 65
const AVATAR_GAP = 11.5
const NAME_LINE = 32 // 이름 텍스트 상자 높이
const SMALL_LINE = 18 // 안내·상태 텍스트 상자 높이
const PENDING_HEIGHT = 91 // 등록 대기 카드 높이

const Card = styled.button.attrs({ type: 'button' })`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: ${PENDING_HEIGHT}px;
  margin: 0;
  padding: ${PADDING_TOP}px ${PADDING_RIGHT}px ${PADDING_BOTTOM}px ${PADDING_LEFT}px;
  border: none;
  border-radius: 20px;
  background: ${onboardingColors.cardBackground};
  color: inherit;
  font: inherit;
  text-align: left;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition:
    transform 0.1s ease-out,
    background-color 0.1s ease-out;

  /* 누르는 동안 + 누른 뒤 동작 전까지(data-pressed): 배경색 진하게 + 0.98배 (04 카드와 같음) */
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

// 디자인 이미지 측정: 이름 상자 20~52(카드 위 기준) → 사진 위(13)보다 7 아래, 안내 상자(52~70)와 간격 0
const NAME_OFFSET = 7
const TOP_HEIGHT = NAME_OFFSET + NAME_LINE + SMALL_LINE // 57: 이름 + 안내 문구 (사진 위 ~ 안내 상자 끝)

// 높이는 글자 상자 기준으로 고정. 사진(세로 65~70)은 이 높이를 넘어도 아래 줄을 밀지 않는다.
const Top = styled.span`
  display: flex;
  align-items: flex-start;
  height: ${TOP_HEIGHT}px;
`

// 사진: 가로 65 고정, 세로는 원본 비율 (늘어나지 않음). 끌기·길게 눌러 저장 막기
const Avatar = styled.img`
  display: block;
  flex-shrink: 0;
  width: ${AVATAR_WIDTH}px;
  height: auto;
  margin-right: ${AVATAR_GAP}px;
  user-select: none;
  -webkit-user-select: none;
  -webkit-user-drag: none;
  -webkit-touch-callout: none;
`

const Body = styled.span`
  display: block;
  padding-top: ${NAME_OFFSET}px;
  flex: 1;
  min-width: 0;
`

const NameRow = styled.span`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
`

const Name = styled.span`
  display: block;
  overflow: hidden;
  font-size: 18px;
  font-weight: 500;
  line-height: ${NAME_LINE}px;
  color: ${onboardingColors.text};
  white-space: nowrap;
  text-overflow: ellipsis;
`

// 디자인 이미지 측정: 상태 글자 상자 위쪽이 카드 위에서 25 → 이름 상자 위(20)에서 5 아래
const Status = styled.span`
  display: block;
  flex-shrink: 0;
  margin-top: 5px;
  font-size: 12px;
  font-weight: 500;
  line-height: ${SMALL_LINE}px;
  color: ${({ $color }) => $color};
  white-space: nowrap;
`

const Message = styled.span`
  display: block;
  font-size: 12px;
  font-weight: 400;
  line-height: ${SMALL_LINE}px;
  color: ${onboardingColors.textSub};
`

// 태그 줄: 안내 문구 상자 끝(70) + 20 = 90, x는 카드 왼쪽에서 18 (사진보다 3 오른쪽)
const Tags = styled.span`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin: 20px 0 0 ${18 - PADDING_LEFT}px;
`

const Tag = styled.span`
  display: block;
  height: 25px;
  padding: 0 6.5px;
  border-radius: 10px;
  background: ${onboardingColors.tagBackground};
  box-shadow: inset 0 0 2px 0 ${onboardingColors.tagShadow};
  font-size: 12px;
  font-weight: 500;
  line-height: 25px;
  color: ${onboardingColors.tagText};
  white-space: nowrap;
`

// 누름 효과(0.1초 전환)가 끝까지 보이도록 동작을 늦추는 시간 (IconCard와 같음)
const PRESS_DELAY_MS = 150

// 화면 읽기 프로그램용 한 줄: "어머니, 등록 완료, 어제 키오스크에서 사용했어요, 켜진 설정 큰 글씨, …"
const stripPeriod = (text) => text.replace(/\.$/, '')
function buildLabel({ name, statusLabel, message, enabledSettings }) {
  const parts = [name, statusLabel, stripPeriod(message)]
  if (enabledSettings.length > 0) parts.push(`켜진 설정 ${enabledSettings.join(', ')}`)
  return parts.join(', ')
}

// 가족 프로필 카드 (사진 + 이름 + 상태 + 안내 문구 + 켜진 설정 태그)
// - profile: features/family/familyProfiles.js의 프로필 하나
// - onClick: 누르면 호출 (없으면 누름 효과만)
export default function FamilyProfileCard({ profile, onClick }) {
  const { name, avatar, status, lastUsedText, enabledSettings = [] } = profile
  const { label: statusLabel, color: statusColor } = STATUS[status] ?? STATUS[FAMILY_STATUS.pending]
  const message = status === FAMILY_STATUS.registered ? (lastUsedText ?? '') : PENDING_MESSAGE

  const [pressed, setPressed] = useState(false)
  const timerRef = useRef(null)
  useEffect(() => () => clearTimeout(timerRef.current), [])

  // IconCard와 같은 방식: 누름 효과를 보여 준 뒤 PRESS_DELAY_MS 후에 동작. 기다리는 동안 다시 눌러도 무시.
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
      onClick={handleClick}
      data-pressed={pressed}
      aria-label={buildLabel({ name, statusLabel, message, enabledSettings })}
    >
      <Top>
        <Avatar src={avatar} alt="" draggable={false} />
        <Body>
          <NameRow>
            <Name>{name}</Name>
            <Status $color={statusColor}>{statusLabel}</Status>
          </NameRow>
          {message && <Message>{message}</Message>}
        </Body>
      </Top>
      {enabledSettings.length > 0 && (
        <Tags>
          {enabledSettings.map((setting) => (
            <Tag key={setting}>{setting}</Tag>
          ))}
        </Tags>
      )}
    </Card>
  )
}
