import KeyringManageLayout from '../../components/keyring/KeyringManageLayout'

// 가족 키링 관리 (본인 키링 관리와 같은 틀, 제목·사진·키링 정보만 다름)
// profile: 가족 한 명 (features/family/familyProfiles.js 모양, keyring 있음)
//   name → "어머니의 키링", avatar → 정보 카드 사진, keyring → 키링 ID·등록 일시
// onBack: 뒤로가기 화살표를 누르면 호출
// onConnectClick: "새 키링 연결하기" → 새 키링 발급 화면
// onLostClick: "키링을 분실하셨나요?" → 키링 분실 화면
export default function FamilyKeyringPage({ profile, onBack, onConnectClick, onLostClick }) {
  return (
    <KeyringManageLayout
      title={`${profile.name}의 키링`}
      keyringId={profile.keyring?.keyringId}
      registeredAt={profile.keyring?.registeredAt}
      photo={profile.avatar}
      onBack={onBack}
      onConnectClick={onConnectClick}
      onLostClick={onLostClick}
    />
  )
}
