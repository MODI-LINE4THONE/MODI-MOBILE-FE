import { apiRequest } from '../api/client.js'

// 생성 응답은 Swagger에서 Map<string, long>으로 정의된다.
export function readCreatedId(data, key) {
  const values = Object.values(data ?? {})
  const id = data?.[key] ?? (values.length === 1 ? values[0] : null)
  if (!Number.isSafeInteger(id) || id <= 0) throw new Error('생성 응답의 ID를 확인할 수 없습니다. 다시 등록하기 전에 관리자에게 문의해주세요.')
  return id
}

export function createOnboardingApi(request = apiRequest) {
  return {
    async saveProfile({ target, nickname }, { userId, profileId } = {}) {
      const name = (target === 'self' ? userId : nickname)?.trim()
      if (!['self', 'family'].includes(target) || !name || name.length > 50) {
        throw new Error('유형과 50자 이내의 이름을 확인해주세요.')
      }
      // self/family 구분 필드는 공개 명세에 없어 화면 상태로만 보관한다.
      const data = await request(profileId ? `/api/profiles/${profileId}` : '/api/profiles', {
        method: profileId ? 'PATCH' : 'POST', body: { name },
      })
      return { target, nickname: target === 'self' ? '' : name, profileId: profileId ?? readCreatedId(data, 'profileId') }
    },
    async registerKeyring(code) {
      if (!/^[A-Z0-9]{6}$/.test(code)) throw new Error('영문 대문자·숫자 6자리를 입력해주세요.')
      const data = await request('/api/keyrings/registrations', { method: 'POST', body: { registrationCode: code } })
      return { keyringId: readCreatedId(data, 'keyringId'), registrationCode: code, registeredAt: null }
    },
    async connectKeyring(keyringId, profileId) {
      if (!Number.isSafeInteger(profileId) || profileId <= 0) throw new Error('프로필을 먼저 생성해주세요.')
      const result = await request(`/api/keyrings/${keyringId}/profile`, { method: 'PATCH', body: { profileId } })
      if (result?.keyringId !== keyringId || result?.profileId !== profileId) throw new Error('키링 연결 결과를 확인해주세요.')
      return result
    },
  }
}

export const onboardingApi = createOnboardingApi()
