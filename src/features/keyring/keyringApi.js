import { apiRequest } from '../api/client.js'
import { onboardingApi } from '../onboarding/onboardingApi.js'

export function createKeyringConnector(api = onboardingApi) {
  let registered = null
  return async (code, profileId) => {
    if (registered && registered.registrationCode !== code) throw new Error('이미 등록한 코드로 연결을 다시 시도해주세요.')
    if (!registered) registered = await api.registerKeyring(code)
    await api.connectKeyring(registered.keyringId, profileId)
    return { ...registered, connected: true }
  }
}
export async function disableKeyring(keyringId, request = apiRequest) {
  const result = await request(`/api/keyrings/${keyringId}/lost`, { method: 'PATCH' })
  if (result?.keyringId !== keyringId || !['LOST', 'DISABLED'].includes(result.status)) throw new Error('키링 비활성화 결과를 확인해주세요.')
  return result
}
