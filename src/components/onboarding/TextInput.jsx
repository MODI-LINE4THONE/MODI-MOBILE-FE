import styled from 'styled-components'
import { onboardingColors } from '../../styles/onboarding/colors'

// 온보딩 회색 입력창 (343 x 54)
// 입력 글자는 16px: iPhone Safari에서 16px 미만이면 입력창을 누를 때 화면이 확대된다.
// 안내 문구(placeholder)만 디자인대로 14px.
const TextInput = styled.input`
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
`

export default TextInput
