import styled from 'styled-components'
import { onboardingColors } from '../../styles/onboarding/colors'

// 디자인 이미지 측정 (가족 프로필 상세)
//   태그 높이 29, 양끝 둥글게, 글자 17px Medium, 좌우 여백 13
//   태그 사이 가로 12, 줄 사이 13
//   색은 가족 홈 태그와 같음 (흰 배경, 파란 글자, 파란 안쪽 그림자 테두리)
const TAG_HEIGHT = 29

const List = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 13px 12px;
  margin: 0;
  padding: 0;
  list-style: none;
`

const Tag = styled.li`
  height: ${TAG_HEIGHT}px;
  padding: 0 13px;
  border-radius: ${TAG_HEIGHT / 2}px;
  background: ${onboardingColors.tagBackground};
  box-shadow: inset 0 0 2px 0 ${onboardingColors.tagShadow};
  font-size: 17px;
  font-weight: 500;
  line-height: ${TAG_HEIGHT}px;
  color: ${onboardingColors.tagText};
  white-space: nowrap;
`

// 켜진 접근성 설정 태그 목록 (보여 주기만 하고 누를 수 없음)
// settings: 설정 이름 목록 / aria-labelledby 등 나머지 속성은 목록(<ul>)에 그대로 넘긴다
export default function SettingTagList({ settings, ...rest }) {
  return (
    <List {...rest}>
      {settings.map((setting) => (
        <Tag key={setting}>{setting}</Tag>
      ))}
    </List>
  )
}
