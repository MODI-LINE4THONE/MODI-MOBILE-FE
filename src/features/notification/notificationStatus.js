// "새 알림 있음/없음" 판단
// lastSeenAt: 마지막으로 알림 화면을 본 시각 (Date). 한 번도 안 봤으면 null
//   - null: 알림이 하나라도 있으면 새 알림 있음
//   - 그 밖: 본 시각보다 늦은 알림이 있으면 새 알림 있음
export function hasNewNotifications(notifications, lastSeenAt) {
  if (!lastSeenAt) return notifications.length > 0
  const seen = lastSeenAt.getTime()
  return notifications.some((item) => new Date(item.createdAt).getTime() > seen)
}
