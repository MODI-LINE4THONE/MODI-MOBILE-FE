import styled from 'styled-components'
import { onboardingColors } from '../../styles/onboarding/colors'

const {
  statusBarTime,
  statusBarIcon,
  batteryFill,
  batteryEmpty,
  batteryText,
} = onboardingColors

const BATTERY_LEVEL = 69

// 디자인의 시계·배터리 숫자는 iPhone 시스템 글꼴(SF Pro)
const systemFont = `-apple-system, BlinkMacSystemFont, 'SF Pro Text', system-ui, sans-serif`

const Bar = styled.div`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: space-between;
  height: 54px;
  padding: 0 24.5px 0 23.5px;
  font-family: ${systemFont};
`

const Time = styled.span`
  position: relative;
  top: -0.75px;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: -0.3px;
  color: ${statusBarTime};
`

const Icons = styled.div`
  display: flex;
  align-items: center;
`

const Wifi = styled.svg`
  display: block;
  position: relative;
  top: -1px;
  width: 16px;
  height: 12px;
  margin-right: 9.5px;
`

const Signal = styled.svg`
  display: block;
  width: 14px;
  height: 15px;
  margin-right: 6px;
`

const Battery = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 27.5px;
  height: 16.5px;
  border-radius: 8.25px;
  background: linear-gradient(
    to right,
    ${batteryFill} ${BATTERY_LEVEL}%,
    ${batteryEmpty} ${BATTERY_LEVEL}%
  );
  color: ${batteryText};
  font-size: 11px;
  font-weight: 700;
  line-height: 1;
`

// 디자인과 같은 모양의 iPhone 상태 표시줄 (표시용, 실제 기기 정보와는 무관)
export default function StatusBar() {
  return (
    <Bar aria-hidden="true">
      <Time>9:41</Time>
      <Icons>
        <Wifi viewBox="0 0 16 12" fill="none">
          <g stroke={statusBarIcon} strokeWidth="1.6" strokeLinecap="round">
            <path d="M1.21 4.01A9.6 9.6 0 0 1 14.79 4.01" />
            <path d="M3.55 6.35A6.3 6.3 0 0 1 12.45 6.35" />
            <path d="M5.88 8.68A3 3 0 0 1 10.12 8.68" />
          </g>
          <circle cx="8" cy="10.8" r="1.1" fill={statusBarIcon} />
        </Wifi>
        <Signal viewBox="0 0 14 15" fill={statusBarIcon}>
          <rect x="0" y="10.5" width="2.5" height="4.5" rx="1" />
          <rect x="3.75" y="7.5" width="2.5" height="7.5" rx="1" />
          <rect x="7.5" y="3.5" width="2.5" height="11.5" rx="1" />
          <rect x="11.25" y="0" width="2.5" height="15" rx="1" />
        </Signal>
        <Battery>{BATTERY_LEVEL}</Battery>
      </Icons>
    </Bar>
  )
}
