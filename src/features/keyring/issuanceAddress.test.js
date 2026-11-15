import test from 'node:test'
import assert from 'node:assert/strict'
import { validateIssuanceAddress } from './issuanceAddress.js'

test('rejects blank shipping fields and malformed postal codes', () => {
  assert.deepEqual(Object.keys(validateIssuanceAddress({ postcode: '', address: ' ', detailAddress: '', quantity: 0 })), ['postcode', 'address', 'detailAddress', 'quantity'])
  for (const postcode of ['1234', '123456', '12a45']) {
    assert.ok(validateIssuanceAddress({ postcode, address: '서울시', detailAddress: '101호' }).postcode)
  }
})
test('accepts a five-digit postal code with non-empty address fields', () => {
  assert.deepEqual(validateIssuanceAddress({ postcode: '01234', address: ' 서울시 ', detailAddress: ' 없음 ', quantity: 2 }), {})
})

test('rejects zero, negative, fractional and unsafe quantities', () => {
  for (const quantity of [0, -1, 1.5, '', undefined, Infinity, Number.MAX_SAFE_INTEGER + 1]) {
    assert.ok(validateIssuanceAddress({ postcode: '01234', address: '서울시', detailAddress: '101호', quantity }).quantity)
  }
})

