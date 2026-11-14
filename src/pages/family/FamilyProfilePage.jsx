import styled from 'styled-components'
import OnboardingLayout from '../../components/onboarding/OnboardingLayout'
import OnboardingHeader from '../../components/onboarding/OnboardingHeader'
import PrimaryButton from '../../components/onboarding/PrimaryButton'
import RegisteredKeyringCard from '../../components/family/RegisteredKeyringCard'
import SettingTagList from '../../components/family/SettingTagList'
import { onboardingColors } from '../../styles/onboarding/colors'
import { FAMILY_STATUS } from '../../features/family/familyProfiles'

const STATUS_LABEL = {
  [FAMILY_STATUS.registered]: '등록 완료',
  [FAMILY_STATUS.pending]: '등록 대기',
}

// 위치는 화면 위 기준 (헤더가 y 145에서 끝남, OnboardingHeader 공통 규칙)
const AVATAR_WIDTH = 79.54
const AVATAR_HEIGHT = 85.65
const AVATAR_TOP = 163
const NAME_LINE = 33 // 이름 텍스트 상자 높이
const STATUS_LINE = 18 // 등록 상태 텍스트 상자 높이 (디자인 이미지 측정)
const CARD_TOP = 321
const SETTINGS_TITLE_TOP = 501
const SETTINGS_TITLE_LINE = 27 // "접근성 설정" 텍스트 상자 높이 (디자인 이미지 측정)
const CARD_HEIGHT = 156 // 디자인 이미지 측정 (카드 위치 계산용)

const Main = styled.main`
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 0 25px;
`

// 사진: 가운데, 끌기·길게 눌러 저장·선택 막기
const Avatar = styled.img`
  display: block;
  width: ${AVATAR_WIDTH}px;
  height: ${AVATAR_HEIGHT}px;
  margin: ${AVATAR_TOP - 145}px auto 0;
  user-select: none;
  -webkit-user-select: none;
  -webkit-user-drag: none;
  -webkit-touch-callout: none;
`

// 이름: 사진 바로 아래
const Name = styled.h2`
  margin: 0;
  font-size: 18px;
  font-weight: 500;
  line-height: ${NAME_LINE}px;
  color: ${onboardingColors.text};
  text-align: center;
`

const Status = styled.p`
  margin: 0;
  font-size: 14px;
  font-weight: 400;
  line-height: ${STATUS_LINE}px;
  color: ${onboardingColors.familyStatusRegistered};
  text-align: center;
`

// 카드 y 321 (등록 상태 끝 299.65 + 21.35)
const KeyringCard = styled(RegisteredKeyringCard)`
  margin-top: ${CARD_TOP - (AVATAR_TOP + AVATAR_HEIGHT + NAME_LINE + STATUS_LINE)}px;
`

// "접근성 설정" y 501 (카드 끝 477 + 24)
const SettingsTitle = styled.h3`
  margin: ${SETTINGS_TITLE_TOP - (CARD_TOP + CARD_HEIGHT)}px 0 0;
  font-size: 20px;
  font-weight: 500;
  line-height: ${SETTINGS_TITLE_LINE}px;
  color: ${onboardingColors.text};
`

// 첫 태그 줄 y 545 (제목 끝 528 + 17)
const Tags = styled(SettingTagList)`
  margin-top: 17px;
`

// 버튼은 화면 맨 아래에서 64 위. 내용이 길면(낮은 화면) 내용 아래 24를 띄우고 함께 스크롤된다
const Footer = styled.div`
  flex-shrink: 0;
  margin-top: auto;
  padding: 24px 25px 64px;
`

// 따로 열었을 때도 버튼 모양(누름 효과)을 유지하도록 빈 동작을 넘긴다
const noop = () => {}

const SETTINGS_TITLE_ID = 'family-profile-settings-title'

// 가족 프로필 상세
// profile: 가족 한 명 (features/family/familyProfiles.js 모양, keyring 있음)
//   name·avatar·status → 프로필, keyring.keyringId → 등록 코드, enabledSettings → 태그
// onBack: 뒤로가기 화살표를 누르면 호출
// onKeyringClick: 등록된 키링 카드를 누르면 (누름 효과 뒤) 호출 → 가족 키링 관리
// onSettingsClick: "접근성 설정 변경"을 누르면 호출 (지금은 없음 → 누름 효과만)
export default function FamilyProfilePage({ profile, onBack, onKeyringClick, onSettingsClick }) {
  const { name, avatar, status, keyring, enabledSettings = [] } = profile

  return (
    <OnboardingLayout withStatusBar>
      <OnboardingHeader title="가족 프로필 상세" onBack={onBack} />
      <Main>
        <Avatar src={avatar} alt="" draggable={false} />
        <Name>{name}</Name>
        <Status>{STATUS_LABEL[status]}</Status>
        <KeyringCard keyringId={keyring?.keyringId} onClick={onKeyringClick} />
        <SettingsTitle id={SETTINGS_TITLE_ID}>접근성 설정</SettingsTitle>
        {enabledSettings.length > 0 && (
          <Tags settings={enabledSettings} aria-labelledby={SETTINGS_TITLE_ID} />
        )}
      </Main>
      <Footer>
        <PrimaryButton onClick={onSettingsClick ?? noop}>접근성 설정 변경</PrimaryButton>
      </Footer>
    </OnboardingLayout>
  )
}
