import KeyringManageLayout from '../../components/keyring/KeyringManageLayout'

// 본인 키링 관리
// userId: 제목에 보일 아이디 (로그인 아이디)
// keyringId / registeredAt: 07에서 등록한 키링 (없으면 08과 같은 기본값)
// onBack: 뒤로가기 화살표를 누르면 호출
// onConnectClick: "새 키링 연결하기" → 새 키링 발급 화면
// onLostClick: "키링을 분실하셨나요?" → 키링 분실 화면
export default function SelfKeyringPage({
  userId = 'user01',
  keyringId,
  registeredAt,
  onBack,
  onConnectClick,
  onLostClick,
}) {
  return (
    <KeyringManageLayout
      title={`${userId}님의 키링`}
      keyringId={keyringId}
      registeredAt={registeredAt}
      onBack={onBack}
      onConnectClick={onConnectClick}
      onLostClick={onLostClick}
    />
  )
}
