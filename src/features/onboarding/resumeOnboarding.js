import { targetForUser } from './userApi.js'

export function resumeProfile(user, profiles) {
  const target = targetForUser(user.userType)
  if (!Array.isArray(profiles)) throw new Error('기존 프로필 목록을 확인하지 못했습니다.')
  if (profiles.length === 0) return { target, nickname: '' }
  if (!target) throw new Error('기존 프로필은 있지만 서버에 사용자 유형이 저장되지 않았습니다. 담당자에게 계정 확인을 요청해주세요.')
  if (profiles.length !== 1) throw new Error('기존 프로필이 여러 개여서 온보딩 대상을 확정할 수 없습니다. 담당자에게 계정 확인을 요청해주세요.')
  const profile = profiles[0]
  if (!Number.isSafeInteger(profile.profileId) || profile.profileId <= 0) throw new Error('기존 프로필 ID를 확인하지 못했습니다.')
  return { target, nickname: target === 'family' ? profile.name : '', profileId: profile.profileId }
}
