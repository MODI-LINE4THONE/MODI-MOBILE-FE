// 여러 연결 파일(OnboardingFlow, HomeFlow, NotificationFlow, KeyringFlow, RequireLogin)이 함께 쓰는 주소.
// 서로를 불러오지 않도록 주소만 따로 둔다.
export const LOGIN_PATH = '/onboarding/login'
export const HOME_PATH = '/home'
export const NOTIFICATION_PATH = '/notifications'
export const KEYRING_PATH = '/keyrings' // 키링 관리
export const FAMILY_PROFILE_PATH = '/families' // 가족 프로필 상세 (/families/:familyId)

// 팀원이 만든 키링 화면 주소 (App.jsx의 주소와 같은 값. 키링 관리에서 이동할 때 쓴다)
export const KEYRING_ISSUANCE_PATH = '/keyrings/issuance' // 새 키링 발급 (#6)
export const KEYRING_LOST_PATH = '/keyrings/lost' // 키링 분실 (#4)

// 가족 키링 관리 주소 (/keyrings/family/:familyId). 가족 프로필 상세의 "키링 관리"에서 이동할 때 쓴다
// 예: familyKeyringPath('mother') → /keyrings/family/mother
export const familyKeyringPath = (familyId) => `${KEYRING_PATH}/family/${encodeURIComponent(familyId)}`

// 가족 프로필 상세 주소. 가족 홈의 등록 완료 카드에서 이동할 때 쓴다
// 예: familyProfilePath('mother') → /families/mother
export const familyProfilePath = (familyId) =>
  `${FAMILY_PROFILE_PATH}/${encodeURIComponent(familyId)}`
