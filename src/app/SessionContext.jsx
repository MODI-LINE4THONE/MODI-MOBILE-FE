import { createContext, useContext, useMemo, useState } from 'react'

// ─────────────────────────────────────────────────────────────
// 앱 전체에서 쓰는 사용자 정보 (온보딩, 홈 공통)
//   userId: 02 로그인 아이디 → 04·홈 인사말, 로그인 확인(RequireLogin)
//   profile: 05 선택 { target: 'self' | 'family' | null, nickname } → 05 선택 기억, 홈 나누기
//   keyring: 07에서 등록한 키링 { keyringId, registeredAt(Date) } | null → 08 등록 완료, 키링 관리
//     keyringId: 07에서 입력한 코드 / registeredAt: 07에서 "다음"을 누른 시각
//
// 메모리에만 보관 → 새로고침하면 사라지고, 로그인이 필요한 화면은 02 로그인으로 간다.
// ─────────────────────────────────────────────────────────────

const SessionContext = createContext(null)

export function SessionProvider({ children }) {
  const [userId, setUserId] = useState(null)
  const [profile, setProfile] = useState({ target: null, nickname: '' })
  const [keyring, setKeyring] = useState(null)

  const value = useMemo(
    () => ({ userId, setUserId, profile, setProfile, keyring, setKeyring }),
    [userId, profile, keyring],
  )
  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
}

export function useSession() {
  const session = useContext(SessionContext)
  if (!session) throw new Error('useSession은 SessionProvider 안에서만 쓸 수 있어요.')
  return session
}
