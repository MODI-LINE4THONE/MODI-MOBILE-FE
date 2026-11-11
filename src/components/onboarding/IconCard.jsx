import { useEffect, useRef, useState } from 'react'
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
  border-radius: ${({ $radius }) => $radius}px;
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

      /* 누르는 동안 + 누른 뒤 이동 전까지(data-pressed): 배경색 진하게 + 0.98배 */
      &:active,
      &[data-pressed='true'] {
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

// 글자 영역: 누를 수 있는 카드(<button>) 안에서는 <span>, 보기만 하는 카드에서는 <div>
const Body = styled.span`
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;

  ${({ $offsetY }) =>
    $offsetY !== 0 &&
    css`
      transform: translateY(${$offsetY}px);
    `}
`

// 누름 효과(0.1초 전환)가 끝까지 보이도록 이동을 늦추는 시간
const PRESS_DELAY_MS = 150

// 회색 카드 + 연파랑 원 아이콘. 글자 구성은 children으로 화면마다 채운다.
// 기본값은 04 홈 화면 카드 기준.
// - icon: 아이콘 이미지 경로 (import한 svg)
// - iconWidth: 아이콘 가로(px). 생략하면 파일 원래 크기
// - iconOffsetY: 아이콘을 원 가운데에서 위로 올리는 정도(px)
// - bodyOffsetY: 글자 묶음을 카드 세로 가운데에서 아래로 옮기는 정도(px)
// - radius: 카드 둥글기(px)
// - onClick: 있으면 누를 수 있는 <button>, 없으면 보기만 하는 <div>
export default function IconCard({
  icon,
  iconWidth,
  iconOffsetY = 0,
  bodyOffsetY = 0,
  height = 136,
  radius = 25,
  circleSize = 80,
  paddingLeft = 27,
  gap = 23.81,
  onClick,
  className,
  children,
}) {
  const clickable = Boolean(onClick)
  const [pressed, setPressed] = useState(false)
  const timerRef = useRef(null)

  // 화면이 사라질 때 남은 타이머 취소
  useEffect(() => () => clearTimeout(timerRef.current), [])

  // 누름 효과를 보여 준 뒤 PRESS_DELAY_MS 후에 이동. 기다리는 동안 다시 눌러도 무시한다.
  // 마우스, 터치, 키보드(Enter/Space) 모두 <button>의 click으로 들어온다.
  const handleClick = (event) => {
    if (timerRef.current) return
    setPressed(true)
    timerRef.current = setTimeout(() => {
      timerRef.current = null
      setPressed(false)
      onClick(event)
    }, PRESS_DELAY_MS)
  }

  return (
    <Card
      as={clickable ? 'button' : 'div'}
      type={clickable ? 'button' : undefined}
      onClick={clickable ? handleClick : undefined}
      className={className}
      $clickable={clickable}
      data-pressed={clickable ? pressed : undefined}
      $height={height}
      $radius={radius}
      $paddingLeft={paddingLeft}
      $gap={gap}
    >
      <Circle $size={circleSize}>
        <Icon src={icon} alt="" $width={iconWidth} $offsetY={iconOffsetY} />
      </Circle>
      <Body as={clickable ? 'span' : 'div'} $offsetY={bodyOffsetY}>
        {children}
      </Body>
    </Card>
  )
}
