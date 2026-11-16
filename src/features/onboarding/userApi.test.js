import test from 'node:test'
import assert from 'node:assert/strict'
import { createUserApi } from './userApi.js'
import { completeOnboardingRequest } from './completeOnboarding.js'

test('온보딩 시작은 서버 유형과 이름을 전송하고 반환된 프로필 ID를 사용한다', async () => {
  const calls = []
  const api = createUserApi(async (path, options) => {
    calls.push({ path, ...options })
    return { userId: 1, userType: options.body.userType, profileId: 8, profileName: options.body.profileName, onboardingCompleted: false }
  })
  assert.deepEqual(await api.start({ target: 'family', nickname: ' 어머니 ' }, 'user01'), { target: 'family', nickname: '어머니', profileId: 8 })
  assert.deepEqual(calls[0], { path: '/api/users/me/onboarding', method: 'POST', body: { userType: 'GUARDIAN', profileName: '어머니' } })
  await api.start({ target: 'self' }, 'user01')
  assert.deepEqual(calls[1].body, { userType: 'SELF', profileName: 'user01' })
})
test('미완료 계정의 미설정 유형을 허용하되 완료 계정의 유형 누락은 거부한다', async () => {
  const user = { userId: 1, loginId: 'user01', userType: null, onboardingCompleted: false }
  assert.equal((await createUserApi(async () => user).me()).onboardingCompleted, false)
  await assert.rejects(createUserApi(async () => ({ ...user, onboardingCompleted: true })).me(), /응답/)
})
test('온보딩 완료 응답이 false이면 성공으로 처리하지 않는다', async () => {
  await assert.rejects(completeOnboardingRequest(async () => ({ userId: 1, loginId: 'user01', userType: 'SELF', onboardingCompleted: false })), /저장되지/)
})
