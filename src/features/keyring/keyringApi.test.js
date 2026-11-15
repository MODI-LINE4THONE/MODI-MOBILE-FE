import test from 'node:test'
import assert from 'node:assert/strict'
import { createKeyringConnector, disableKeyring } from './keyringApi.js'

test('등록 성공 후 연결 실패 시 같은 ID로 연결만 재시도한다', async () => {
  let registrations = 0
  let connections = 0
  const connector = createKeyringConnector({
    async registerKeyring(code) { registrations++; return { keyringId: 19, registrationCode: code, registeredAt: null } },
    async connectKeyring(id, profileId) {
      assert.equal(id, 19); assert.equal(profileId, 3)
      if (++connections === 1) throw new Error('연결 실패')
    },
  })
  await assert.rejects(connector('AB1234', 3), /연결 실패/)
  await assert.rejects(connector('ZZ1234', 3), /이미 등록/)
  assert.equal((await connector('AB1234', 3)).connected, true)
  assert.equal(registrations, 1)
  assert.equal(connections, 2)
})

test('분실 처리는 지정된 ID만 PATCH하고 서버 결과를 검증한다', async () => {
  const result = await disableKeyring(19, async (path, options) => {
    assert.equal(path, '/api/keyrings/19/lost')
    assert.deepEqual(options, { method: 'PATCH' })
    return { keyringId: 19, status: 'LOST' }
  })
  assert.equal(result.status, 'LOST')
  await assert.rejects(disableKeyring(19, async () => ({ keyringId: 20, status: 'LOST' })), /결과/)
  await assert.rejects(disableKeyring(19, async () => ({ keyringId: 19, status: 'REGISTERED' })), /결과/)
  await assert.rejects(disableKeyring(19, async () => { throw new Error('서버 실패') }), /서버 실패/)
})
