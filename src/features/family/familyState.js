import { emptyOptions, optionDefinitions } from '../personalization/settingsStorage.js'

export function familySettings(profile) {
  return profile.settings ?? { mode: 'custom', preset: null, options: { ...emptyOptions(), ...Object.fromEntries(optionDefinitions.map(({ id, label }) => [id, (profile.enabledSettings ?? []).includes(label)])) } }
}
export function updateFamilySettings(profiles, id, settings) {
  return profiles.map(profile => profile.id === id ? { ...profile, settings, enabledSettings: optionDefinitions.filter(({ id }) => settings.options[id]).map(({ label }) => label) } : profile)
}
export function linkFamilyKeyring(profiles, id, keyring) {
  if (!profiles.some(profile => profile.id === id)) throw Error('가족 프로필을 찾을 수 없어요.')
  if (profiles.some(profile => profile.id !== id && profile.keyring?.keyringId === keyring.keyringId)) throw Error('다른 가족에게 연결된 코드입니다. 다른 코드를 입력해주세요.')
  return profiles.map(profile => profile.id === id ? { ...profile, status: 'registered', keyring, lastUsedText: '새 키링을 연결했어요.' } : profile)
}
