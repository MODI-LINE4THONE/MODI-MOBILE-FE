// 가족 키링 관리에서 보여 줄 가족 찾기
// profiles: 가족 목록 (familyProfiles.js 모양) / familyId: 주소의 :familyId
// 키링이 연결된 가족이면 그 프로필, 없는 id이거나 키링이 없으면(등록 대기) null
export function findFamilyWithKeyring(profiles, familyId) {
  const profile = profiles.find((item) => item.id === familyId)
  return profile?.keyring ? profile : null
}
