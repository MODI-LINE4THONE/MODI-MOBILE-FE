import styled from 'styled-components'
import IconCard from '../onboarding/IconCard'
import { onboardingColors } from '../../styles/onboarding/colors'
import { formatKoreanDate, formatKoreanTime, toDateTimeAttribute } from '../../utils/formatDateTime'
import keyringIcon from '../../assets/icons/icon-keyring.svg'

// 07 정보가 없을 때(화면만 따로 열었을 때) 보여 줄 기본값 (08 디자인 값)
export const DEFAULT_KEYRING_ID = 'AB1234'
export const DEFAULT_REGISTERED_AT = new Date(2026, 10, 3, 15, 29)

// 키링 아이콘 파일(36x57) 안 그림 가로는 35.23.
// 그림 가로를 artWidth로 맞추려면 이미지 상자 가로 = 36 x artWidth / 35.23
const iconBoxWidth = (artWidth) => (36 * artWidth) / 35.23

// 카드 크기. 글자 위치(카드 위에서부터, 왼쪽 x 191.5)는 두 크기가 같다.
export const KEYRING_CARD_SIZE = {
  // 08 등록 완료: 높이 171, 원 115, 그림 가로 50.64
  complete: {
    height: 171,
    circleSize: 115,
    paddingLeft: 25,
    gap: 26, // 25 + 115 + 26 = 글자 x 166 (카드 x 25 기준 191)
    iconWidth: iconBoxWidth(50.64),
    iconOffsetY: 2.68,
    bodyOffsetY: 4,
  },
  // 키링 관리: 높이 176, 원 120 (디자인 이미지 측정). 원이 커진 만큼 그림도 같은 비율로 키운다.
  manage: {
    height: 176,
    circleSize: 120,
    paddingLeft: 24,
    gap: 22, // 24 + 120 + 22 = 166 (08과 같은 글자 x)
    iconWidth: iconBoxWidth((50.64 * 120) / 115),
    iconOffsetY: (2.68 * 120) / 115,
    bodyOffsetY: 1.5, // 카드가 5 높아 가운데가 2.5 내려가므로 4 - 2.5 → 글자는 카드 위에서 08과 같은 거리
  },
}

const InfoList = styled.dl`
  margin: 0;
`

// 이름표: 17px Regular, 상자 높이 20
const InfoLabel = styled.dt`
  font-size: 17px;
  font-weight: 400;
  line-height: 20px;
  color: ${onboardingColors.text};

  /* "키링 ID" 묶음 → "등록 일시" 묶음 간격 */
  & + dd + & {
    margin-top: 10px;
  }
`

// 값: 20px Bold, 줄 높이 25. 이름표와 간격 5
const InfoValue = styled.dd`
  margin: 5px 0 0;
  font-size: 20px;
  font-weight: 700;
  line-height: 25px;
  color: ${onboardingColors.cardValue};
`

// 키링 정보 카드 (키링 아이콘 + 키링 ID + 등록 일시). 08 등록 완료와 키링 관리가 같이 쓴다.
// keyringId: 키링 코드 / registeredAt: 등록 시각(Date)
// size: 'complete'(08) | 'manage'(키링 관리)
// className: 바깥 여백 등 위치 조정용
export default function KeyringInfoCard({
  keyringId = DEFAULT_KEYRING_ID,
  registeredAt = DEFAULT_REGISTERED_AT,
  size = 'complete',
  className,
}) {
  const { height, circleSize, paddingLeft, gap, iconWidth, iconOffsetY, bodyOffsetY } =
    KEYRING_CARD_SIZE[size]

  return (
    <IconCard
      className={className}
      icon={keyringIcon}
      iconWidth={iconWidth}
      iconOffsetY={iconOffsetY}
      bodyOffsetY={bodyOffsetY}
      height={height}
      radius={30}
      circleSize={circleSize}
      paddingLeft={paddingLeft}
      gap={gap}
    >
      <InfoList>
        <InfoLabel>키링 ID</InfoLabel>
        <InfoValue>{keyringId}</InfoValue>
        <InfoLabel>등록 일시</InfoLabel>
        <InfoValue>
          <time dateTime={toDateTimeAttribute(registeredAt)}>
            {formatKoreanDate(registeredAt)}
            <br />
            {formatKoreanTime(registeredAt)}
          </time>
        </InfoValue>
      </InfoList>
    </IconCard>
  )
}
