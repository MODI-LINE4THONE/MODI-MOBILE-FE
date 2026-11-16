import { userApi, targetForUser } from '../onboarding/userApi.js'
import { resumeProfile } from '../onboarding/resumeOnboarding.js'
import { profileApi } from '../personalization/profileApi.js'
import { apiRequest, setAccessToken } from '../api/client.js'

export async function login({ userId, password }) {
  setAccessToken(null)
  const data = await apiRequest('/api/auth/login', {
    method: 'POST', body: { loginId: userId, password },
  })
  if (!data?.accessToken) throw new Error('로그인 응답에 인증 정보가 없습니다.')
  setAccessToken(data.accessToken, { userId, expiresAt: Number.isFinite(data.expiresIn) && data.expiresIn > 0 ? Date.now() + data.expiresIn * 1000 : null })
  try {
    const user = await userApi.me()
    if (user.loginId !== userId) throw new Error('로그인 계정 정보가 일치하지 않습니다.')
    const profile = user.onboardingCompleted
      ? { target: targetForUser(user.userType), nickname: '' }
      : resumeProfile(user, await profileApi.list())
    return { userId: user.loginId, onboardingCompleted: user.onboardingCompleted, profile }
  } catch (err) {
    setAccessToken(null)
    throw err
  }
}

export function signup({ userId, password }) {
  return apiRequest('/api/auth/signup', {
    method: 'POST', body: { loginId: userId, password },
  })
}

export async function checkId(userId) {
  const data = await apiRequest(`/api/auth/check-id?loginId=${encodeURIComponent(userId)}`)
  if (typeof data?.available !== 'boolean') throw new Error('아이디 확인 응답을 확인해주세요.')
  return data.available
}
