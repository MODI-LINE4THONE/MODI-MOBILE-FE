// 가족 알림 필터 ("전체" + 가족 이름 칩)
// 묶음("오늘", "이전 알림")마다 따로 계산한다.

export const ALL_FAMILY = 'all'
const ALL_LABEL = '전체'

// 칩 목록: "전체" + 이 묶음에 알림이 있는 가족만 (이름·순서는 가족 목록 profiles를 따른다)
// → 칩을 눌렀을 때 알림이 하나도 없는 경우가 생기지 않는다.
// 가족 목록에 없는 familyId의 알림은 "전체"에서만 보인다.
// 각 칩의 count: 그 칩을 골랐을 때 보이는 알림 수 (화면 읽기 안내 "어머니 알림 2개"에 쓴다)
export function getFamilyFilterOptions(notifications, profiles) {
  const options = [{ id: ALL_FAMILY, name: ALL_LABEL, count: notifications.length }]
  for (const profile of profiles) {
    const count = notifications.filter((item) => item.familyId === profile.id).length
    if (count > 0) options.push({ id: profile.id, name: profile.name, count })
  }
  return options
}

// 고른 칩이 목록에 없으면(데이터가 바뀌어 그 가족 알림이 사라진 경우) "전체"
export function resolveSelectedFamily(options, selectedId) {
  return options.some((option) => option.id === selectedId) ? selectedId : ALL_FAMILY
}

export function filterByFamily(notifications, familyId) {
  if (familyId === ALL_FAMILY) return notifications
  return notifications.filter((item) => item.familyId === familyId)
}
