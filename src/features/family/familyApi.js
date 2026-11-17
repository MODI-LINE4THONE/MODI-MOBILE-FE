import { profileApi, settingsFromProfile } from '../personalization/profileApi.js'
import { onboardingApi } from '../onboarding/onboardingApi.js'
import { optionDefinitions } from '../personalization/settingsStorage.js'

export function toFamily(profile, rings) {
  const settings = settingsFromProfile(profile)
  const ring = rings.find(ring => ring.status === 'REGISTERED') ?? rings[0]
  return {
    id: String(profile.profileId), profileId: profile.profileId, name: profile.name,
    status: ring ? 'registered' : 'pending', settings,
    enabledSettings: optionDefinitions.filter(({ id }) => settings.options[id]).map(({ label }) => label),
    lastUsedText: ring ? '키링이 연결되어 있어요.' : '',
    keyring: ring ? { keyringId: ring.keyringId, registrationCode: ring.registrationCode, status: ring.status, registeredAt: ring.registeredAt ?? null } : null,
  }
}
export function createFamilyApi(profiles = profileApi, onboarding = onboardingApi) {
  return {
    async list(selfProfileId) {
      const list = await profiles.list()
      return Promise.all(list.filter(profile => String(profile.profileId) !== String(selfProfileId)).map(async profile => toFamily(profile, await profiles.keyrings(profile.profileId))))
    },
    async detail(id) {
      const [profile, rings] = await Promise.all([profiles.detail(id), profiles.keyrings(id)])
      return toFamily(profile, rings)
    },
    async add(name) {
      const trimmed = name.trim()
      if (!trimmed || trimmed.length > 20) throw new Error('별명은 1~20자로 입력해주세요.')
      const list = await profiles.list()
      if (list.some(profile => profile.name === trimmed)) throw new Error('이미 같은 이름의 프로필이 있습니다.')
      return onboarding.saveProfile({ target: 'family', nickname: trimmed })
    },
  }
}
export const familyApi = createFamilyApi()
