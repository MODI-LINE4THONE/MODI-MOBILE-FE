import test from 'node:test'
import assert from 'node:assert/strict'
import { createLogoutAction } from './logout.js'
import { readSession, writeSession } from './sessionStorage.js'

test('로그아웃 응답 전에는 세션을 유지하고 성공 후에만 삭제한다', async () => {
  let resolve
  let requests = 0
  writeSession({ accessToken: 'test-token', userId: 'user01', profile: { target: 'family', profileId: 5 }, keyring: { keyringId: 1 } })
  const logout = createLogoutAction((path, options) => {
    requests++
    assert.equal(path, '/api/auth/logout')
    assert.deepEqual(options, { method: 'POST' })
    return new Promise(done => { resolve = done })
  })
  const first = logout()
  const second = logout()
  assert.equal(first, second)
  await Promise.resolve()
  assert.equal(requests, 1)
  assert.equal(readSession().userId, 'user01')
  resolve(null)
  await first
  assert.equal(readSession(), null)
})

test('실패 시 로그인 정보를 유지하고 다음 요청으로 재시도할 수 있다', async () => {
  let requests = 0
  writeSession({ accessToken: 'test-token', userId: 'user01' })
  const logout = createLogoutAction(async () => {
    if (++requests === 1) throw new Error('서버 오류')
  })
  try {
    await assert.rejects(logout(), /서버 오류/)
    assert.equal(readSession().userId, 'user01')
    await logout()
    assert.equal(readSession(), null)
    assert.equal(requests, 2)
  } finally { writeSession(null) }
})
