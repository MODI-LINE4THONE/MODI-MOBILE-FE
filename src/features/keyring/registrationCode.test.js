import test from 'node:test'
import assert from 'node:assert/strict'
import { isRegistrationCodeComplete } from './registrationCode.js'

test('requires two uppercase letters followed by four digits', () => {
  assert.equal(isRegistrationCodeComplete('AB1234'), true)
  assert.equal(isRegistrationCodeComplete('ZZ0000'), true)
  for (const code of ['', 'AB12', 'AB12345', 'A12345', '123456', 'ab1234', null]) {
    assert.equal(isRegistrationCodeComplete(code), false)
  }
})
