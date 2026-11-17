import test from 'node:test'
import assert from 'node:assert/strict'
import { createFamilyApi, toFamily } from './familyApi.js'

const profile = { profileId: 2, name: '어머니', largeText: true, highContrast: false, touchGuide: true, touchCorrection: false, lowerScreen: false }
test('서버 설정·키링 상태를 기존 가족 카드 데이터로 변환한다', () => {
  const empty = toFamily(profile, [])
  assert.equal(empty.id, '2')
  assert.equal(empty.status, 'pending')
  assert.equal(empty.keyring, null)
  assert.deepEqual(empty.enabledSettings, ['큰 글씨', '터치 위치 안내'])
  const active = toFamily(profile, [{ keyringId: 4, status: 'LOST' }, { keyringId: 5, registrationCode: 'AB1234', status: 'REGISTERED', registeredAt: '2026-11-17T12:30:00+09:00' }])
  assert.equal(active.keyring.keyringId, 5)
  assert.equal(active.keyring.registeredAt, '2026-11-17T12:30:00+09:00')
})
test('확인된 본인 ID만 제외하고 프로필별 키링을 조회한다', async () => {
  const ids = []
  const api = createFamilyApi({
    async list() { return [{ ...profile, profileId: 1 }, profile] },
    async keyrings(id) { ids.push(id); return [] },
    async detail(id) { assert.equal(id, '2'); return profile },
  })
  assert.deepEqual((await api.list(1)).map(profile => profile.id), ['2'])
  assert.deepEqual(ids, [2])
  assert.equal((await api.detail('2')).name, '어머니')
})
test('중복 별명은 생성하지 않으며 신규 가족은 서버 ID를 사용한다', async () => {
  let calls = 0
  const api = createFamilyApi({ async list() { return [profile] } }, {
    async saveProfile(value) { calls++; assert.deepEqual(value, { target: 'family', nickname: '아버지' }); return { profileId: 9 } },
  })
  await assert.rejects(api.add('어머니'), /같은 이름/)
  await assert.rejects(api.add(' '), /별명/)
  assert.equal((await api.add(' 아버지 ')).profileId, 9)
  assert.equal(calls, 1)
})
test('조회 실패 시 예시 가족으로 대체하지 않고 오류를 전파한다', async () => {
  const api = createFamilyApi({ async list() { throw new Error('조회 실패') } })
  await assert.rejects(api.list(), /조회 실패/)
})
