import test from 'node:test'
import assert from 'node:assert/strict'
import { parseRegisteredAt } from './formatDateTime.js'

test('서버 등록 일시와 세션에 저장된 문자열의 시각을 보존한다', () => {
  const value = '2026-11-17T12:30:00+09:00'
  const date = parseRegisteredAt(value)
  assert.equal(date.toISOString(), '2026-11-17T03:30:00.000Z')
  assert.equal(parseRegisteredAt(JSON.parse(JSON.stringify(date))).getTime(), date.getTime())
  assert.equal(parseRegisteredAt(date).getTime(), date.getTime())
  assert.equal(parseRegisteredAt('2026-11-17T12:30:00').getHours(), 12)
})

test('등록 일시가 없거나 유효하지 않으면 현재 시각으로 대체하지 않는다', () => {
  for (const value of [null, undefined, '', ' ', 'invalid', 0, {}, new Date(NaN)]) {
    assert.equal(parseRegisteredAt(value), null)
  }
})
