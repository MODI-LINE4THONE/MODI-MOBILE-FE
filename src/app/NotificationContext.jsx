import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import {
  SAMPLE_NOW,
  sampleFamilyNotifications,
  sampleSelfNotifications,
} from '../features/notification/notifications'
import { hasNewNotifications } from '../features/notification/notificationStatus'

// ─────────────────────────────────────────────────────────────
// 알림 목록과 "새 알림 있음/없음" (홈, 알림 화면 공통)
//   notifications: { self, family } → 본인 사용자는 self, 가족 사용자는 family
//   now: 시간 표시·"본 시각" 기준. 지금은 예시 데이터에 맞춘 SAMPLE_NOW.
//        서버 API가 생기면 받은 목록으로 notifications를, 실제 현재 시각으로 now를 바꾼다.
//   lastSeenAt: { self, family } 마지막으로 알림 화면을 본 시각. 처음엔 null(본 적 없음)
//   hasNew(target): 그 사용자 쪽에 새 알림이 있는지 → 홈 종의 파란 점
//   markSeen(target): 알림 화면이 열리면 호출 → 본 시각 = now
//
// 메모리에만 보관 → 새로고침하면 처음(본 적 없음)으로 돌아간다. (SessionContext와 같음)
// target: 'family'면 가족, 그 밖(null 포함)은 본인 (홈·알림 화면과 같은 규칙)
// ─────────────────────────────────────────────────────────────

const NotificationContext = createContext(null)

const NOTIFICATIONS = { self: sampleSelfNotifications, family: sampleFamilyNotifications }

export const toNotificationTarget = (target) => (target === 'family' ? 'family' : 'self')

export function NotificationProvider({ children }) {
  const [lastSeenAt, setLastSeenAt] = useState({ self: null, family: null })
  const now = SAMPLE_NOW

  const hasNew = useCallback(
    (target) => {
      const key = toNotificationTarget(target)
      return hasNewNotifications(NOTIFICATIONS[key], lastSeenAt[key])
    },
    [lastSeenAt],
  )

  const markSeen = useCallback(
    (target) => {
      const key = toNotificationTarget(target)
      setLastSeenAt((prev) => (prev[key] === now ? prev : { ...prev, [key]: now }))
    },
    [now],
  )

  const value = useMemo(
    () => ({ notifications: NOTIFICATIONS, now, hasNew, markSeen }),
    [now, hasNew, markSeen],
  )
  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
}

export function useNotifications() {
  const value = useContext(NotificationContext)
  if (!value) throw new Error('useNotifications는 NotificationProvider 안에서만 쓸 수 있어요.')
  return value
}
