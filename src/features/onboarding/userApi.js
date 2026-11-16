import { apiRequest } from '../api/client.js'

export function targetForUser(userType) {
  if (userType === 'SELF') return 'self'
  if (userType === 'GUARDIAN') return 'family'
  return null
}
export function validateUser(user) {
  if (!Number.isSafeInteger(user?.userId) || typeof user.loginId !== 'string' || typeof user.onboardingCompleted !== 'boolean' || (user.onboardingCompleted && !targetForUser(user.userType))) throw new Error('사용자 정보 응답을 확인해주세요.')
  return user
}
export function createUserApi(request = apiRequest) {
  return {
    async me() { return validateUser(await request('/api/users/me')) },
    async start({ target, nickname }, loginId) {
      if (!['self', 'family'].includes(target)) throw new Error('사용자 유형을 선택해주세요.')
      const profileName = (target === 'self' ? loginId : nickname)?.trim()
      if (!profileName || profileName.length > 50) throw new Error('50자 이내의 프로필 이름을 입력해주세요.')
      const result = await request('/api/users/me/onboarding', { method: 'POST', body: { userType: target === 'self' ? 'SELF' : 'GUARDIAN', profileName } })
      if (!Number.isSafeInteger(result?.profileId) || result.profileId <= 0 || targetForUser(result.userType) !== target || typeof result.onboardingCompleted !== 'boolean') throw new Error('온보딩 생성 응답을 확인해주세요.')
      return { target, nickname: target === 'family' ? result.profileName ?? profileName : '', profileId: result.profileId }
    },
  }
}
export const userApi = createUserApi()
