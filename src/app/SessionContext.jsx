import { readSession, writeSession, subscribeSession } from '../features/auth/sessionStorage.js'
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { login } from '../features/auth/authApi'

// 인증 정보는 같은 탭의 sessionStorage에서 복원합니다.
// 온보딩 완료는 현재 세션에서만 표시하며 서버 저장은 명세 확인 후 연결합니다.

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
    setProfile({ target: null, nickname: '' })
    setKeyring(null)
    setUserId(result.userId)
    setOnboardingCompleted(result.onboardingCompleted)
    return result
  }, [])

  // 화면은 저장 결과를 기다리지 않고 바로 완료로 바뀐다 (실패 처리는 서버 연결 때 정한다)
  const completeOnboarding = useCallback(() => {
    setOnboardingCompleted(true)
  }, [])

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
