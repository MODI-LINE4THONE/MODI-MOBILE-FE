// 한국어 날짜·시간 표시 (24시간, 앞자리 0 없음)

// 2026년 11월 3일
export function formatKoreanDate(date) {
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`
}

// 15시 29분 / 9시 5분
export function formatKoreanTime(date) {
  return `${date.getHours()}시 ${date.getMinutes()}분`
}

// <time datetime>용 값: 2026-11-03T15:29 (분까지, 현지 시각)
export function toDateTimeAttribute(date) {
  const pad = (n) => String(n).padStart(2, '0')
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
    `T${pad(date.getHours())}:${pad(date.getMinutes())}`
  )
}
