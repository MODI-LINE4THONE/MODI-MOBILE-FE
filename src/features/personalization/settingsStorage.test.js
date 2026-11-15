import test from 'node:test'
import assert from 'node:assert/strict'
import { emptyOptions, optionsForPreset, readSettings, saveSettings, settingsChanged } from './settingsStorage.js'

const memory = () => {
  let data = null
  return { getItem: () => data, setItem: (_key, value) => { data = value } }
}
test('new user starts with no preset and all switches off', () => {
  const state = readSettings(memory())
  assert.equal(state.preset, null)
  assert.deepEqual(state.options, emptyOptions())
  assert.equal(settingsChanged(state, state), false)
})
test('preset option mappings follow the current design', () => {
  assert.deepEqual(Object.entries(optionsForPreset('wheelchair')).filter(([, on]) => on).map(([key]) => key), ['largeText', 'touchCorrection', 'bottomControls'])
  assert.equal(optionsForPreset('elderly').touchGuidance, true)
  assert.equal(optionsForPreset('color').touchGuidance, false)
})
test('five switches survive reload and saved changes become clean', () => {
  const storage = memory()
  const original = readSettings(storage)
  const changed = { ...original, mode: 'custom', options: optionsForPreset('elderly') }
  assert.equal(settingsChanged(changed, original), true)
  saveSettings(changed, storage)
  assert.deepEqual(readSettings(storage), changed)
  assert.equal(settingsChanged(changed, changed), false)
  assert.equal(settingsChanged({ ...changed, options: emptyOptions() }, changed), true)
})
test('old settings preserve existing flags without guessing new option values', () => {
  const storage = memory()
  saveSettings({ mode: 'custom', preset: 'elderly', options: { simplifiedMenu: true, highContrast: true, touchGuidance: false, bottomControls: true } }, storage)
  assert.deepEqual(readSettings(storage).options, { largeText: false, highContrast: true, touchGuidance: false, touchCorrection: false, bottomControls: true })
})
test('corrupt storage recovers; save failures propagate', () => {
  assert.equal(readSettings({ getItem: () => '{broken' }).preset, null)
  assert.equal(readSettings({ getItem() { throw Error('blocked') } }).preset, null)
  assert.throws(() => saveSettings({}, { setItem() { throw Error('quota') } }), /quota/)
})
