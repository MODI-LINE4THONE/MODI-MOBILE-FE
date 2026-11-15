import test from 'node:test'
import assert from 'node:assert/strict'
import { createProfileApi, settingsFromProfile, settingsToRequest } from './profileApi.js'

const profile = { profileId: 17, name: '어머니', largeText: true, highContrast: false, touchGuide: true, touchCorrection: false, lowerScreen: true }
test('서버 플래그와 UI 옵션을 손실 없이 양방향 변환한다', () => {
  const settings = settingsFromProfile(profile)
  assert.deepEqual(settings.options, { largeText: true, highContrast: false, touchGuidance: true, touchCorrection: false, bottomControls: true })
  assert.deepEqual(settingsToRequest(settings), { largeText: true, highContrast: false, touchGuide: true, touchCorrection: false, lowerScreen: true })
})
test('선택한 프로필 경로로만 조회·저장하며 설정 플래그만 PATCH한다', async () => {
  const calls = []
  const api = createProfileApi(async (path, options) => {
    calls.push({ path, options })
    if (path.endsWith('/me')) return [profile]
    if (path.endsWith('/keyrings')) return []
    return profile
  })
  assert.equal((await api.list())[0].profileId, 17)
  assert.equal((await api.detail(17)).name, '어머니')
  await api.save(17, settingsFromProfile(profile))
  assert.equal(calls[2].path, '/api/profiles/17')
  assert.equal(calls[2].options.method, 'PATCH')
  assert.equal(Object.hasOwn(calls[2].options.body, 'name'), false)
  assert.deepEqual(await api.keyrings(17), [])
})
test('다른 프로필 응답·누락된 설정·잘못된 목록·저장 실패를 전파한다', async () => {
  assert.throws(() => settingsFromProfile({ profileId: 17 }), /응답/)
  const wrong = createProfileApi(async () => ({ ...profile, profileId: 18 }))
  await assert.rejects(wrong.detail(17), /일치/)
  await assert.rejects(wrong.save(17, settingsFromProfile(profile)), /프로필/)
  await assert.rejects(wrong.keyrings(17), /키링/)
  await assert.rejects(wrong.list(), /목록/)
  const failed = createProfileApi(async () => { throw new Error('저장 실패') })
  await assert.rejects(failed.save(17, settingsFromProfile(profile)), /저장 실패/)
})
