import styled, { css } from 'styled-components'
import { onboardingColors } from '../../styles/onboarding/colors'

const Card = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ $gap }) => $gap}px;
  width: 100%;
  height: ${({ $height }) => $height}px;
  margin: 0;
  padding: 0 0 0 ${({ $paddingLeft }) => $paddingLeft}px;
  border: none;
  border-radius: 25px;
  background: ${onboardingColors.cardBackground};
  color: inherit;
  font: inherit;
  text-align: left;

  ${({ $clickable }) =>
    $clickable &&
    css`
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
      transition:
        transform 0.1s ease-out,
        background-color 0.1s ease-out;

      /* 누르는 동안: 배경색 진하게 + 0.98배 */
      &:active {
        background: ${onboardingColors.cardPressed};
        transform: scale(0.98);
      }

      &:focus-visible {
        outline: 2px solid ${onboardingColors.text};
        outline-offset: 2px;
      }
    `}
`

const Circle = styled.span`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  border-radius: 50%;
  background: ${onboardingColors.iconCircle};
`

// 시각 보정: 원 가운데보다 $offsetY px 위로
const Icon = styled.img`
  display: block;
  width: ${({ $width }) => ($width ? `${$width}px` : 'auto')};
  height: auto;
  transform: translateY(${({ $offsetY }) => -$offsetY}px);
`

const Body = styled.span`
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
`

// 회색 카드 + 연파랑 원 아이콘. 글자 구성은 children으로 화면마다 채운다.
// 기본값은 04 홈 화면 카드 기준.
// - icon: 아이콘 이미지 경로 (import한 svg)
// - iconWidth: 아이콘 가로(px). 생략하면 파일 원래 크기
// - iconOffsetY: 아이콘을 원 가운데에서 위로 올리는 정도(px)
// - onClick: 있으면 누를 수 있는 <button>, 없으면 보기만 하는 <div>
export default function IconCard({
  icon,
  iconWidth,
  iconOffsetY = 0,
  height = 136,
  circleSize = 80,
  paddingLeft = 27,
  gap = 23.81,
  onClick,
  className,
  children,
}) {
  const clickable = Boolean(onClick)

  return (
    <Card
      as={clickable ? 'button' : 'div'}
      type={clickable ? 'button' : undefined}
      onClick={onClick}
      className={className}
      $clickable={clickable}
      $height={height}
      $paddingLeft={paddingLeft}
      $gap={gap}
    >
      <Circle $size={circleSize}>
        <Icon src={icon} alt="" $width={iconWidth} $offsetY={iconOffsetY} />
      </Circle>
      <Body>{children}</Body>
    </Card>
  )
}
