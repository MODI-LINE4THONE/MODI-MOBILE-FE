import { apiRequest, setAccessToken } from '../api/client.js'

export async function login({ userId, password }) {
  setAccessToken(null)
  const data = await apiRequest('/api/auth/login', {
    method: 'POST', body: { loginId: userId, password },
  })
  if (!data?.accessToken) throw new Error('로그인 응답에 인증 정보가 없습니다.')
  setAccessToken(data.accessToken)
  // 완료 여부 API 공개 전까지 재로그인 시 온보딩으로 이동한다.
  return { userId, onboardingCompleted: false }
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
