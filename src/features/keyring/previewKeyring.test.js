import test from 'node:test'
import assert from 'node:assert/strict'
import { disablePreviewKeyring, readPreviewKeyring } from './previewKeyring.js'

function memoryStorage() {
  const values = new Map()
  return { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) }
}

test('preview disable persists across reads without mutating the active input', () => {
  const storage = memoryStorage()
  const active = readPreviewKeyring(storage)
  const lost = disablePreviewKeyring(active, storage)
  assert.equal(active.status, 'active')
  assert.equal(lost.status, 'lost')
  assert.deepEqual(readPreviewKeyring(storage), lost)
})

test('invalid data and unavailable storage recover to the example keyring', () => {
  for (const value of ['{broken', '{"id":"other","status":"lost"}', '{"id":"TM-8244","status":"unknown"}']) {
    assert.equal(readPreviewKeyring({ getItem: () => value }).status, 'active')
  }
  assert.equal(readPreviewKeyring({ getItem() { throw Error('blocked') } }).status, 'active')
})

test('failed persistence throws and does not report or mutate a successful disable', () => {
  const active = readPreviewKeyring(memoryStorage())
  assert.throws(() => disablePreviewKeyring(active, { setItem() { throw Error('quota') } }), /quota/)
  assert.equal(active.status, 'active')
})
