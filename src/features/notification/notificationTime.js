// 알림 시각 계산: "오늘/이전 알림" 묶기와 시간 표시
// now를 밖에서 받아서, 예시 데이터(고정 시각)와 서버 데이터(실제 시각)에 똑같이 쓴다.

const MINUTE = 60 * 1000

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

function isSameDay(a, b) {
  return startOfDay(a).getTime() === startOfDay(b).getTime()
}

function isYesterday(date, now) {
  const yesterday = startOfDay(now)
  yesterday.setDate(yesterday.getDate() - 1)
  return isSameDay(date, yesterday)
}

// 오전 9:12 / 오후 3:05
function formatClock(date) {
  const hours = date.getHours()
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const period = hours < 12 ? '오전' : '오후'
  const hour12 = hours % 12 === 0 ? 12 : hours % 12
  return `${period} ${hour12}:${minutes}`
}

// 알림 오른쪽 위 시간
//   1분 안: 방금 전 / 오늘: 오전 9:12 (디자인: 18분 전 알림도 시각으로 표시)
//   어제: 어제 / 올해: 11월 10일 / 그 전: 2025년 11월 10일
export function formatNotificationTime(createdAt, now) {
  const date = new Date(createdAt)

  if (isSameDay(date, now)) {
    if (now.getTime() - date.getTime() < MINUTE) return '방금 전'
    return formatClock(date)
  }
  if (isYesterday(date, now)) return '어제'

  const monthDay = `${date.getMonth() + 1}월 ${date.getDate()}일`
  if (date.getFullYear() === now.getFullYear()) return monthDay
  return `${date.getFullYear()}년 ${monthDay}`
}

// "오늘" / "이전 알림" 두 묶음으로 나누고, 각 묶음은 최신순
export function groupNotificationsByDay(notifications, now) {
  const sorted = [...notifications].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )
  return {
    today: sorted.filter((item) => isSameDay(new Date(item.createdAt), now)),
    earlier: sorted.filter((item) => !isSameDay(new Date(item.createdAt), now)),
  }
}
