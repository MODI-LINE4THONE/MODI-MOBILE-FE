import test from 'node:test'
import assert from 'node:assert/strict'
import { isRegistrationCodeComplete } from './registrationCode.js'

test('accepts six uppercase letters or digits', () => {
  assert.equal(isRegistrationCodeComplete('AB1234'), true)
  assert.equal(isRegistrationCodeComplete('ZZ0000'), true)
  assert.equal(isRegistrationCodeComplete('123456'), true)
  assert.equal(isRegistrationCodeComplete('1A2B3C'), true)
  for (const code of ['', 'AB12', 'AB12345', 'ab1234', null]) {
    assert.equal(isRegistrationCodeComplete(code), false)
  }
})
