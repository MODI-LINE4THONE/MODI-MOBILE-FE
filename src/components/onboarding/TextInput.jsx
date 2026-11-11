import { useId } from 'react'
import styled from 'styled-components'
import { onboardingColors } from '../../styles/onboarding/colors'

const ACTION_RIGHT = 14 // 입력창 오른쪽 끝 ~ 버튼
const ACTION_WIDTH = 69
const ACTION_HEIGHT = 27
const TOUCH_SIZE = 44

// 이름표 크기 (피그마 텍스트 상자 높이 = 줄 높이)
// default: 회원가입 "아이디" / large: 05 "등록하실 별명"
const LABEL_SIZES = {
  default: { fontSize: 18, lineHeight: 21, gap: 16 },
  large: { fontSize: 20, lineHeight: 24, gap: 40 },
}

// 온보딩 회색 입력창 (343 x 54)
// 입력 글자는 16px: iPhone Safari에서 16px 미만이면 입력창을 누를 때 화면이 확대된다.
// 안내 문구(placeholder)만 디자인대로 14px.
const Input = styled.input`
  display: block;
  width: 100%;
  height: 54px;
  padding: 0 17px;
  border: none;
  border-radius: 15px;
  background: ${onboardingColors.inputBackground};
  color: ${onboardingColors.text};
  font-family: inherit;
  font-size: 16px;
  outline: none;

  &::placeholder {
    color: ${onboardingColors.textSub};
    font-size: 14px;
    opacity: 1;
  }

  &:focus {
    box-shadow: inset 0 0 0 1.5px ${onboardingColors.primary};
  }

  ${({ $hasAction }) =>
    $hasAction && `padding-right: ${ACTION_RIGHT + ACTION_WIDTH + 8}px;`}
`

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ $gap }) => $gap}px;
`

// 이름표 상자는 x=28 → 입력창 왼쪽 끝(x=25)보다 3px 안쪽
const Label = styled.label`
  display: block;
  padding-left: 3px;
  font-size: ${({ $fontSize }) => $fontSize}px;
  font-weight: 500;
  line-height: ${({ $lineHeight }) => $lineHeight}px;
  color: ${onboardingColors.text};
`

const InputBox = styled.div`
  position: relative;
`

// 입력창 오른쪽 작은 버튼 (예: 중복확인). 보이는 크기 69x27, 누르는 영역 세로 44
const ActionButton = styled.button.attrs({ type: 'button' })`
  position: absolute;
  top: 50%;
  right: ${ACTION_RIGHT}px;
  width: ${ACTION_WIDTH}px;
  height: ${ACTION_HEIGHT}px;
  padding: 0;
  border: none;
  border-radius: 9px;
  background: ${onboardingColors.primary};
  color: ${onboardingColors.onPrimary};
  font-family: inherit;
  font-size: 14px;
  font-weight: 500;
  line-height: 1;
  cursor: pointer;
  transform: translateY(-50%);
  -webkit-tap-highlight-color: transparent;

  &::before {
    content: '';
    position: absolute;
    top: ${-(TOUCH_SIZE - ACTION_HEIGHT) / 2}px;
    bottom: ${-(TOUCH_SIZE - ACTION_HEIGHT) / 2}px;
    left: 0;
    right: 0;
  }

  &:active {
    background: ${onboardingColors.primaryPressed};
  }

  &:focus-visible {
    outline: 2px solid ${onboardingColors.text};
    outline-offset: 2px;
  }
`

// 입력창 아래 안내 문구: 12px, 상자 높이 14, 입력창과 9 떨어짐, 상자 x 28.
// 입력창 아래 공간에 겹쳐 놓아서(absolute) 문구가 생겨도 아래 부분이 움직이지 않는다.
// 문구 칸은 비어 있을 때도 늘 그려 둔다 → 화면 읽기 프로그램이 새 문구를 읽어 준다(role=status).
const Message = styled.p`
  position: absolute;
  top: calc(100% + 9px);
  left: 0;
  right: 0;
  margin: 0;
  padding-left: 3px;
  color: ${onboardingColors.fieldMessage};
  font-size: 12px;
  font-weight: 400;
  line-height: 14px;
`

// label: 입력창 위 이름표 (예: "아이디")
// labelSize: 'default'(18px, 간격 16) | 'large'(20px, 간격 40)
// actionLabel / onActionClick: 입력창 오른쪽 작은 버튼 (예: "중복확인")
// message: 입력창 아래 안내 문구. 문구가 나타날 수 있는 입력창이면 빈 문자열('')이라도 넘긴다.
//   (undefined면 문구 칸을 아예 그리지 않음)
// 옵션이 없으면 <input> 하나만 그린다 (로그인 화면 형태).
export default function TextInput({
  label,
  labelSize = 'default',
  actionLabel,
  onActionClick,
  message,
  id,
  ...inputProps
}) {
  const generatedId = useId()
  const messageId = useId()
  const inputId = id ?? generatedId
  const hasMessageSlot = message !== undefined

  if (!label && !actionLabel && !hasMessageSlot) {
    return <Input id={id} {...inputProps} />
  }

  // 문구가 있을 때만 입력창 설명으로 연결
  const describedBy =
    [inputProps['aria-describedby'], message ? messageId : null].filter(Boolean).join(' ') ||
    undefined

  const box = (
    <InputBox>
      <Input
        id={inputId}
        $hasAction={Boolean(actionLabel)}
        {...inputProps}
        aria-describedby={describedBy}
      />
      {actionLabel && <ActionButton onClick={onActionClick}>{actionLabel}</ActionButton>}
      {hasMessageSlot && (
        <Message id={messageId} role="status">
          {message}
        </Message>
      )}
    </InputBox>
  )

  if (!label) return box

  const { fontSize, lineHeight, gap } = LABEL_SIZES[labelSize]

  return (
    <Field $gap={gap}>
      <Label htmlFor={inputId} $fontSize={fontSize} $lineHeight={lineHeight}>
        {label}
      </Label>
      {box}
    </Field>
  )
}
