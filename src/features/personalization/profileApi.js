import { apiRequest } from '../api/client.js'
import { optionDefinitions } from './settingsStorage.js'

const fields = { largeText: 'largeText', highContrast: 'highContrast', touchGuidance: 'touchGuide', touchCorrection: 'touchCorrection', bottomControls: 'lowerScreen' }
export function settingsFromProfile(profile) {
  if (!Number.isSafeInteger(profile?.profileId) || !Object.values(fields).every(key => typeof profile[key] === 'boolean')) throw new Error('프로필 응답을 확인해주세요.')
  return { mode: 'custom', preset: null, options: Object.fromEntries(optionDefinitions.map(({ id }) => [id, profile[fields[id]]])) }
}
export function settingsToRequest(settings) {
  return Object.fromEntries(Object.entries(fields).map(([ui, server]) => [server, settings.options[ui] === true]))
}
export function createProfileApi(request = apiRequest) {
  return {
    async list() {
      const result = await request('/api/profiles/me')
      if (!Array.isArray(result)) throw new Error('프로필 목록 응답을 확인해주세요.')
      result.forEach(settingsFromProfile)
      return result
    },
    async detail(id) {
      const result = await request(`/api/profiles/${id}`)
      settingsFromProfile(result)
      if (String(result.profileId) !== String(id)) throw new Error('프로필이 일치하지 않습니다.')
      return result
    },
    async save(id, settings) {
      const result = await request(`/api/profiles/${id}`, { method: 'PATCH', body: settingsToRequest(settings) })
      if (String(result?.profileId) !== String(id)) throw new Error('저장 결과의 프로필을 확인해주세요.')
      return settingsFromProfile(result)
    },
    async keyrings(id) {
      const result = await request(`/api/profiles/${id}/keyrings`)
      if (!Array.isArray(result) || result.some(ring => !Number.isSafeInteger(ring.keyringId) || !['AVAILABLE', 'REGISTERED', 'LOST', 'DISABLED'].includes(ring.status))) throw new Error('키링 목록 응답을 확인해주세요.')
      return result
    },
  }
}
export const profileApi = createProfileApi()
