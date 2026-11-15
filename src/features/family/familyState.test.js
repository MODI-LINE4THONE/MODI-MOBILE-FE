import test from 'node:test'
import assert from 'node:assert/strict'
import { familySettings, updateFamilySettings, linkFamilyKeyring } from './familyState.js'
import { emptyOptions } from '../personalization/settingsStorage.js'

const fixtures = () => [
  { id: 'mother', keyring: { keyringId: 'AB1234' }, enabledSettings: ['큰 글씨'] },
  { id: 'grandmother', status: 'pending', keyring: null },
]
test('family settings are derived from that family and stay independent', () => {
  const profiles = fixtures()
  const settings = { mode: 'custom', preset: null, options: { ...emptyOptions(), highContrast: true } }
  const updated = updateFamilySettings(profiles, 'grandmother', settings)
  assert.deepEqual(updated[1].enabledSettings, ['색상 고대비'])
  assert.equal(updated[0], profiles[0])
  assert.equal(familySettings(updated[0]).options.largeText, true)
  assert.equal(familySettings(updated[0]).options.highContrast, false)
  assert.deepEqual(familySettings(updated[1]), settings)
  assert.equal(profiles[1].settings, undefined)
})
test('linking a keyring updates only the intended family', () => {
  const profiles = fixtures()
  const keyring = { keyringId: 'CD5678', registeredAt: new Date() }
  const updated = linkFamilyKeyring(profiles, 'grandmother', keyring)
  assert.equal(updated[0], profiles[0])
  assert.equal(updated[1].status, 'registered')
  assert.equal(updated[1].keyring, keyring)
  assert.equal(profiles[1].keyring, null)
})
test('unknown family and duplicate registration codes fail', () => {
  assert.throws(() => linkFamilyKeyring(fixtures(), 'unknown', { keyringId: 'CD5678' }))
  assert.throws(() => linkFamilyKeyring(fixtures(), 'grandmother', { keyringId: 'AB1234' }))
})
