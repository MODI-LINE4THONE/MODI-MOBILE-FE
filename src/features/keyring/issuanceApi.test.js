import test from 'node:test'
import assert from 'node:assert/strict'
import { createIssuanceApi } from './issuanceApi.js'
import { validateIssuanceAddress } from './issuanceAddress.js'

const address = { postcode: ' 01234 ', address: ' 서울시 ', detailAddress: ' 101호 ', quantity: 2 }
const result = { requestId: 11, status: 'REQUESTED', quantity: 2 }
test('발급 신청 필드명을 변환하고 공백을 제거하여 한 번 POST한다', async () => {
  let calls = 0
  const api = createIssuanceApi(async (path, options) => {
    calls++
    assert.equal(path, '/api/keyrings/issuance-requests')
    assert.deepEqual(options, { method: 'POST', body: { postalCode: '01234', address: '서울시', detailAddress: '101호', quantity: 2 } })
    return result
  })
  assert.deepEqual(await api.submit(address), result)
  assert.equal(calls, 1)
})
test('수량은 1~10개이며 잘못된 입력은 요청하지 않는다', async () => {
  const api = createIssuanceApi(async () => { assert.fail('요청하면 안 됨') })
  for (const quantity of [0, 11, 1.5, -1]) {
    await assert.rejects(api.submit({ ...address, quantity }), /수량/)
  }
  assert.deepEqual(validateIssuanceAddress({ ...address, quantity: 10 }), {})
})
test('내역은 계정 기준 GET, 빈 목록과 상태를 보존한다', async () => {
  const api = createIssuanceApi(async (path, options) => {
    assert.equal(path, '/api/keyrings/issuance-requests/me')
    assert.equal(options, undefined)
    return [result, { requestId: 12, status: 'SHIPPING', quantity: 1 }]
  })
  assert.equal((await api.list())[1].status, 'SHIPPING')
  assert.deepEqual(await createIssuanceApi(async () => []).list(), [])
})
test('서버 실패와 비정상 응답을 성공으로 처리하거나 자동 재시도하지 않는다', async () => {
  let calls = 0
  const failed = createIssuanceApi(async () => { calls++; throw new Error('서버 실패') })
  await assert.rejects(failed.submit(address), /서버 실패/)
  assert.equal(calls, 1)
  await assert.rejects(createIssuanceApi(async () => ({ ...result, status: 'UNKNOWN' })).submit(address), /응답/)
  await assert.rejects(createIssuanceApi(async () => null).list(), /응답/)
})
