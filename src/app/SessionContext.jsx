import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { login, markOnboardingCompleted } from '../features/auth/authApi'

// ─────────────────────────────────────────────────────────────
// 앱 전체에서 쓰는 사용자 정보 (온보딩, 홈 공통)
//   userId: 02 로그인 아이디 → 04·홈 인사말, 로그인 확인(RequireLogin)
//   onboardingCompleted: 온보딩 완료 여부 (백엔드와 같은 이름, true/false)
//     → 로그인 뒤 홈/04 나누기, 마친 사용자가 04~08 주소로 오면 홈으로
//   profile: 05 선택 { target: 'self' | 'family' | null, nickname } → 05 선택 기억, 홈 나누기
//   keyring: 07에서 등록한 키링 { keyringId, registeredAt(Date) } | null → 08 등록 완료, 키링 관리
//     keyringId: 07에서 입력한 코드 / registeredAt: 07에서 "다음"을 누른 시각
//
// 로그인·온보딩 완료는 아래 두 함수만 바꾼다 (서버 요청은 features/auth/authApi.js).
//   logIn({ userId, password }): 서버 로그인 → userId, onboardingCompleted 저장. 서버 응답을 돌려준다
//   completeOnboarding(): 완료로 표시 + 서버에 저장 (06 "나중에", 08 "홈으로 이동")
//
// 메모리에만 보관 → 새로고침하면 사라지고, 로그인이 필요한 화면은 02 로그인으로 간다.
// ─────────────────────────────────────────────────────────────

const SessionContext = createContext(null)

export function SessionProvider({ children }) {
  const [userId, setUserId] = useState(null)
  const [onboardingCompleted, setOnboardingCompleted] = useState(false)
  const [profile, setProfile] = useState({ target: null, nickname: '' })
  const [keyring, setKeyring] = useState(null)

  const logIn = useCallback(async (credentials) => {
    const result = await login(credentials)
    setUserId(result.userId)
    setOnboardingCompleted(result.onboardingCompleted)
    return result
  }, [])

  // 화면은 저장 결과를 기다리지 않고 바로 완료로 바뀐다 (실패 처리는 서버 연결 때 정한다)
  const completeOnboarding = useCallback(() => {
    setOnboardingCompleted(true)
    if (userId) markOnboardingCompleted(userId)
  }, [userId])

  const value = useMemo(
    () => ({
      userId,
      onboardingCompleted,
      logIn,
      completeOnboarding,
      profile,
      setProfile,
      keyring,
      setKeyring,
    }),
    [userId, onboardingCompleted, logIn, completeOnboarding, profile, keyring],
  )
  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
}

export function useSession() {
  const session = useContext(SessionContext)
  if (!session) throw new Error('useSession은 SessionProvider 안에서만 쓸 수 있어요.')
  return session
}
