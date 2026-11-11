import styled, { css } from 'styled-components'
import { onboardingColors } from '../../styles/onboarding/colors'

// 비활성일 때 누르면 버튼 동작·폼 제출을 막는다
const preventClick = (e) => e.preventDefault()

// 온보딩 파란 큰 버튼 (343 x 54)
// disabled: 비활성 모양 + 눌러도 동작 없음.
//   HTML disabled 대신 aria-disabled를 써서 키보드 이동 순서에 남고,
//   화면 읽기 프로그램은 "비활성"으로 읽는다.
const PrimaryButton = styled.button.attrs(({ type, disabled, onClick }) => ({
  type: type ?? 'button',
  disabled: undefined,
  'aria-disabled': disabled ? 'true' : undefined,
  onClick: disabled ? preventClick : onClick,
  $disabled: Boolean(disabled),
}))`
  display: block;
  width: 100%;
  height: 54px;
  padding: 0;
  border: none;
  border-radius: 15px;
  background: ${onboardingColors.primary};
  color: ${onboardingColors.onPrimary};
  font-family: inherit;
  font-size: 20px;
  font-weight: 500;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent; /* 모바일 기본 회색 터치 효과 제거 */

  /* 누르고 있는 동안만 (마우스·터치 공통)
     iOS Safari는 터치 이벤트 리스너가 있어야 :active가 적용되는데,
     React가 앱 루트에 touchstart 리스너를 등록하므로 별도 처리 없이 동작한다. */
  &:active {
    background: ${onboardingColors.primaryPressed};
  }

  &:focus-visible {
    outline: 2px solid ${onboardingColors.text};
    outline-offset: 2px;
  }

  /* 비활성: 누르는 동안의 효과도 없음 */
  ${({ $disabled }) =>
    $disabled &&
    css`
      background: ${onboardingColors.primaryDisabled};
      color: ${onboardingColors.onPrimaryDisabled};
      cursor: default;

      &:active {
        background: ${onboardingColors.primaryDisabled};
      }
    `}
`

export default PrimaryButton
