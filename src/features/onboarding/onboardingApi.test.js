import test from 'node:test'
import assert from 'node:assert/strict'
import { createOnboardingApi, readCreatedId } from './onboardingApi.js'

test('프로필 생성은 서버 ID를 보관하고 재편집은 PATCH한다', async () => {
  const calls = []
  const api = createOnboardingApi(async (path, options) => {
    calls.push({ path, ...options })
    return { profileId: 12 }
  })
  const profile = await api.saveProfile({ target: 'family', nickname: ' 어머니 ' })
  assert.deepEqual(profile, { target: 'family', nickname: '어머니', profileId: 12 })
  await api.saveProfile({ target: 'self' }, { userId: 'user01', profileId: 12 })
  assert.deepEqual(calls, [
    { path: '/api/profiles', method: 'POST', body: { name: '어머니' } },
    { path: '/api/profiles/12', method: 'PATCH', body: { name: 'user01' } },
  ])
})

test('모든 영문 대문자·숫자 6자리 등록 후 서버 ID로 프로필 연결', async () => {
  const calls = []
  const api = createOnboardingApi(async (path, options) => {
    calls.push({ path, ...options })
    return path.endsWith('registrations') ? { keyringId: 7 } : { keyringId: 7, profileId: 12 }
  })
  const ring = await api.registerKeyring('1A2B3C')
  assert.equal(ring.keyringId, 7)
  assert.equal(ring.registeredAt, null)
  await api.connectKeyring(ring.keyringId, 12)
  assert.deepEqual(calls[1], { path: '/api/keyrings/7/profile', method: 'PATCH', body: { profileId: 12 } })
  await assert.rejects(api.registerKeyring('short'), /6자리/)
  await assert.rejects(api.connectKeyring(7, undefined), /프로필/)
})

test('ID 없는 응답과 연결 실패는 성공으로 바꾸지 않는다', async () => {
  assert.equal(readCreatedId({ id: 3 }, 'profileId'), 3)
  for (const data of [null, {}, { id: '3' }, { a: 1, b: 2 }, { id: -1 }]) {
    assert.throws(() => readCreatedId(data, 'profileId'), /ID/)
  }
  const api = createOnboardingApi(async () => { throw new Error('서버 실패') })
  await assert.rejects(api.saveProfile({ target: 'family', nickname: '어머니' }), /서버 실패/)
  await assert.rejects(api.connectKeyring(7, 12), /서버 실패/)
  const wrong = createOnboardingApi(async () => ({ keyringId: 8, profileId: 12 }))
  await assert.rejects(wrong.connectKeyring(7, 12), /연결 결과/)
})
