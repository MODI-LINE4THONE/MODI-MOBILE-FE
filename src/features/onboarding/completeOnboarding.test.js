import test from 'node:test'
import assert from 'node:assert/strict'
import { completeOnboardingRequest } from './completeOnboarding.js'

test('공유된 경로에 본문 없이 PATCH하며 응답을 기다린다', async () => {
  let finish
  let resolved = false
  const promise = completeOnboardingRequest((path, options) => {
    assert.equal(path, '/api/users/me/onboarding/complete')
    assert.deepEqual(options, { method: 'PATCH' })
    return new Promise(resolve => { finish = resolve })
  }).then(() => { resolved = true })
  assert.equal(resolved, false)
  finish({ userId: 1, loginId: 'user01', userType: 'SELF', onboardingCompleted: true })
  await promise
  assert.equal(resolved, true)
})
test('완료 API 실패를 숨기지 않고 호출한 화면에 전달한다', async () => {
  await assert.rejects(completeOnboardingRequest(async () => { throw new Error('완료 저장 실패') }), /완료 저장 실패/)
})
