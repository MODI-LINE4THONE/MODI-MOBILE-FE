import test from 'node:test'
import assert from 'node:assert/strict'
import { readSession, writeSession, subscribeSession } from './sessionStorage.js'
import { apiRequest } from '../api/client.js'

test('같은 탭의 저장된 인증과 프로필을 복원하고 만료되면 초기화한다', () => {
  const original = globalThis.sessionStorage
  const data = new Map()
  globalThis.sessionStorage = { getItem: key => data.get(key) ?? null, setItem: (key, value) => data.set(key, value), removeItem: key => data.delete(key) }
  let notification
  const unsubscribe = subscribeSession(session => { notification = session })
  try {
    const session = { accessToken: 'token', userId: 'user01', expiresAt: Date.now() + 60000, profile: { profileId: 42, target: 'self' } }
    writeSession(session)
    assert.deepEqual(readSession(), session)
    assert.equal(JSON.parse([...data.values()][0]).profile.profileId, 42)
    writeSession({ ...session, expiresAt: Date.now() - 1 })
    assert.equal(readSession(), null)
    assert.equal(notification, null)
    assert.equal(data.size, 0)
  } finally { unsubscribe(); writeSession(null); globalThis.sessionStorage = original }
})

test('401 응답이면 저장된 인증도 지우고 오류를 전달한다', async () => {
  writeSession({ accessToken: 'expired', userId: 'user01' })
  await assert.rejects(apiRequest('/test', { fetchImpl: async () => Response.json({ success: false, message: '인증 만료' }, { status: 401 }) }), /인증 만료/)
  assert.equal(readSession(), null)
})
