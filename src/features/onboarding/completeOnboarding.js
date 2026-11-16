import { apiRequest } from '../api/client.js'
import { validateUser } from './userApi.js'

// Swagger: 본문 없는 PATCH, 성공 응답은 UserResponse.
export async function completeOnboardingRequest(request = apiRequest) {
  const user = validateUser(await request('/api/users/me/onboarding/complete', { method: 'PATCH' }))
  if (!user.onboardingCompleted) throw new Error('온보딩 완료 상태가 저장되지 않았습니다. 다시 시도해주세요.')
  return user
}
