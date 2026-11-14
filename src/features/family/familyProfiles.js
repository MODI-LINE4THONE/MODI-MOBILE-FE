import motherAvatar from '../../assets/images/avatar-mother.png'
import grandmotherAvatar from '../../assets/images/avatar-grandmother.png'
import grandfatherAvatar from '../../assets/images/avatar-grandfather.png'

// ─────────────────────────────────────────────────────────────
// 가족 프로필 목록 데이터
//
// 지금은 예시 데이터. 서버 API가 생기면 HomeFlow에서 sampleFamilyProfiles 대신
// 서버에서 받은 목록을 FamilyHomePage의 profiles로 넘기면 된다. (모양은 아래와 같게)
//
// 프로필 하나의 모양
//   id: 구분용 값
//   name: 화면에 보일 이름
//   avatar: 사진 주소
//   status: FAMILY_STATUS 중 하나 ("등록 완료" / "등록 대기" 글자와 색은 카드가 정한다)
//   lastUsedText: 등록 완료일 때 안내 문구 (등록 대기는 카드가 "키링을 연결해 주세요." 표시)
//   enabledSettings: 켜진 접근성 설정 이름 목록 (없으면 태그 줄을 그리지 않는다)
// ─────────────────────────────────────────────────────────────

export const FAMILY_STATUS = {
  registered: 'registered', // 등록 완료 (키링 연결됨)
  pending: 'pending', // 등록 대기 (키링 연결 전)
}

export const sampleFamilyProfiles = [
  {
    id: 'mother',
    name: '어머니',
    avatar: motherAvatar,
    status: FAMILY_STATUS.registered,
    lastUsedText: '어제 키오스크에서 사용했어요.',
    enabledSettings: ['큰 글씨', '색상 고대비', '터치 위치 안내', '화면 하단 조작'],
  },
  {
    id: 'grandmother',
    name: '할머니',
    avatar: grandmotherAvatar,
    status: FAMILY_STATUS.pending,
  },
  {
    id: 'grandfather',
    name: '할아버지',
    avatar: grandfatherAvatar,
    status: FAMILY_STATUS.pending,
  },
]
