import styled from 'styled-components'
import { onboardingColors } from '../../styles/onboarding/colors'

const Group = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const Choice = styled.label`
  position: relative;
  display: block;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
`

// 실제 선택은 브라우저 기본 라디오 버튼이 맡고, 화면에서는 숨긴다.
// (화면 읽기 프로그램·키보드 화살표 선택이 기본으로 동작)
const Radio = styled.input.attrs({ type: 'radio' })`
  position: absolute;
  width: 1px;
  height: 1px;
  margin: 0;
  opacity: 0;
  pointer-events: none;
`

// 선택 버튼 모양 (343 x 54)
const Face = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 54px;
  border-radius: 15px;
  background: ${onboardingColors.choiceBackground};
  color: ${onboardingColors.text};
  font-size: 18px;
  font-weight: 500;
  transition:
    transform 0.1s ease-out,
    background-color 0.1s ease-out;

  /* 선택됨: 배경 + 1px 파란 외곽선.
     외곽선은 안쪽 box-shadow라 크기·글자 위치가 바뀌지 않는다. */
  ${Radio}:checked + & {
    background: ${onboardingColors.choiceSelected};
    box-shadow: inset 0 0 0 1px ${onboardingColors.primary};
  }

  /* 누르는 동안: 0.98배 + 배경, 외곽선 없음 (선택된 버튼을 누를 때도) */
  ${Choice}:active & {
    background: ${onboardingColors.choicePressed};
    box-shadow: none;
    transform: scale(0.98);
  }

  ${Radio}:focus-visible + & {
    outline: 2px solid ${onboardingColors.text};
    outline-offset: 2px;
  }
`

// 하나만 고르는 선택 버튼 묶음
// - options: [{ value, label }]
// - value: 선택된 value (없으면 아무것도 선택 안 됨)
// - onChange(value): 선택이 바뀔 때
// - labelledBy: 그룹 이름이 되는 질문 요소의 id
export default function ChoiceGroup({ name, options, value, onChange, labelledBy, className }) {
  return (
    <Group role="radiogroup" aria-labelledby={labelledBy} className={className}>
      {options.map((option) => (
        <Choice key={option.value}>
          <Radio
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={() => onChange?.(option.value)}
          />
          <Face>{option.label}</Face>
        </Choice>
      ))}
    </Group>
  )
}
