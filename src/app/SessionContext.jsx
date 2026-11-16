import { logout } from '../features/auth/logout.js'
import { completeOnboardingRequest } from '../features/onboarding/completeOnboarding.js'
import { readSession, writeSession, subscribeSession } from '../features/auth/sessionStorage.js'
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { login } from '../features/auth/authApi'

// 인증 정보는 같은 탭의 sessionStorage에서 복원합니다.
// 온보딩 완료 여부와 사용자 유형은 로그인 시 서버에서 조회합니다.

const SessionContext = createContext(null)

export function SessionProvider({ children }) {
  const [initialSession] = useState(readSession)
  const [userId, setUserId] = useState(initialSession?.userId ?? null)
  const [onboardingCompleted, setOnboardingCompleted] = useState(initialSession?.onboardingCompleted === true)
  const [profile, setProfile] = useState(initialSession?.profile ?? { target: null, nickname: '' })
  const [keyring, setKeyring] = useState(initialSession?.keyring ?? null)

  useEffect(() => subscribeSession(session => {
    if (!session) {
      setUserId(null); setOnboardingCompleted(false)
      setProfile({ target: null, nickname: '' }); setKeyring(null)
    }
  }), [])
  useEffect(() => {
    const session = readSession()
    if (session?.userId === userId && userId) {
      writeSession({ ...session, profile, keyring, onboardingCompleted })
    }
  }, [userId, profile, keyring, onboardingCompleted])

  const logIn = useCallback(async (credentials) => {
    const result = await login(credentials)
    setProfile(result.profile)
    setKeyring(null)
    setUserId(result.userId)
    setOnboardingCompleted(result.onboardingCompleted)
    return result
  }, [])

  // 서버 완료 저장이 성공한 뒤에만 현재 탭의 완료 상태를 변경한다.
  const completeOnboarding = useCallback(async () => {
    const user = await completeOnboardingRequest()
    setProfile(current => ({ ...current, target: user.userType === 'SELF' ? 'self' : 'family' }))
    setOnboardingCompleted(user.onboardingCompleted)
  }, [])

  const value = useMemo(
    () => ({
      userId,
      onboardingCompleted,
      logIn,
      logOut: logout,
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
