import { useState } from 'react'
import styled from 'styled-components'
import { onboardingColors } from '../../styles/onboarding/colors'

// 피그마 값 + 디자인 이미지 측정
const CHIP_HEIGHT = 25
const CHIP_GAP = 6
const CHIP_PADDING_SIDE = 9.5 // 이미지: "전체" 칩 가로 40, 3글자 칩 가로 50
const TITLE_LINE = 18 // 묶음 제목 상자 높이 (이 줄은 그 높이 안에 세로 가운데로 놓인다)
// 키보드 초점 테두리(2 + 간격 1)가 옆으로 밀어 보는 영역 끝에서 잘리지 않도록 둘레 여백.
// 같은 만큼 바깥으로 당겨서 칩 위치(오른쪽 끝 = 화면 오른쪽 25)는 그대로 둔다.
const FOCUS_SPACE = 3
const OVERFLOW_Y = (CHIP_HEIGHT - TITLE_LINE) / 2 + FOCUS_SPACE

// 칩이 많아 제목과 겹칠 만큼 길어지면 이 줄만 옆으로 밀어서 본다.
// 첫 칩의 margin-left: auto로 오른쪽 끝에 붙인다 (justify-content: flex-end는 넘칠 때 왼쪽이 잘림)
const Row = styled.div`
  display: flex;
  flex: 1;
  gap: ${CHIP_GAP}px;
  min-width: 0;
  margin: -${OVERFLOW_Y}px -${FOCUS_SPACE}px;
  padding: ${FOCUS_SPACE}px;
  overflow-x: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }

  & > :first-child {
    margin-left: auto;
  }
`

const Chip = styled.button.attrs({ type: 'button' })`
  flex-shrink: 0;
  height: ${CHIP_HEIGHT}px;
  margin: 0;
  padding: 0 ${CHIP_PADDING_SIDE}px;
  border: none;
  border-radius: 15px;
  background: ${({ $selected }) =>
    $selected ? onboardingColors.filterChipSelectedBackground : onboardingColors.filterChipBackground};
  color: ${({ $selected }) =>
    $selected ? onboardingColors.filterChipSelectedText : onboardingColors.filterChipText};
  font: inherit;
  font-size: 12px;
  font-weight: 500;
  line-height: ${CHIP_HEIGHT}px;
  white-space: nowrap;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition: background-color 0.1s ease-out;

  /* 선택 안 된 칩을 누르는 동안: 배경색 진하게 (축소 없음) */
  &:not([aria-pressed='true']):active {
    background: ${onboardingColors.filterChipPressed};
  }

  &:focus-visible {
    outline: 2px solid ${onboardingColors.text};
    outline-offset: 1px;
  }
`

// 화면에는 안 보이고 화면 읽기 프로그램만 읽는 안내
const LiveRegion = styled.span`
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

// 가족별 필터 칩 줄 ("전체" + 가족 이름)
// label: 칩 묶음 이름 (화면 읽기용, 예: "오늘 알림 가족별 보기")
// options: [{ id, name, count }] (features/notification/familyFilter.js)
// selectedId: 선택된 칩 id
// onChange(id): 칩을 누르면 호출
// 칩을 눌러 바뀌면 화면 읽기 프로그램이 "어머니 알림 2개"처럼 읽는다.
export default function FamilyFilter({ label, options, selectedId, onChange }) {
  const [announcement, setAnnouncement] = useState('')

  const handleClick = (option) => {
    if (option.id === selectedId) return
    onChange(option.id)
    setAnnouncement(`${option.name} 알림 ${option.count}개`)
  }

  return (
    <>
      <Row role="group" aria-label={label}>
        {options.map((option) => {
          const selected = option.id === selectedId
          return (
            <Chip
              key={option.id}
              $selected={selected}
              aria-pressed={selected}
              onClick={() => handleClick(option)}
            >
              {option.name}
            </Chip>
          )
        })}
      </Row>
      <LiveRegion aria-live="polite">{announcement}</LiveRegion>
    </>
  )
}
