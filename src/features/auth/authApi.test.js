import test from 'node:test'
import assert from 'node:assert/strict'
import { login, signup, checkId } from './authApi.js'
import { apiRequest, setAccessToken } from '../api/client.js'

test('로그인 필드 변환, 토큰 전달, 완료 여부 보류', async () => {
  const original = globalThis.fetch
  const requests = []
  globalThis.fetch = async (url, options) => {
    requests.push({ url, ...options })
    return Response.json({ success: true, data: { accessToken: 'test-token' } })
  }
  try {
    assert.deepEqual(await login({ userId: 'user01', password: 'secret' }), {
      userId: 'user01', onboardingCompleted: false,
    })
    await apiRequest('/api/profiles/me')
    assert.deepEqual(JSON.parse(requests[0].body), { loginId: 'user01', password: 'secret' })
    assert.equal(requests[0].headers.Authorization, undefined)
    assert.equal(requests[1].headers.Authorization, 'Bearer test-token')
    globalThis.fetch = async () => Response.json({ success: false, message: '로그인 실패' }, { status: 401 })
    await assert.rejects(login({ userId: 'other', password: 'wrong' }), /로그인 실패/)
  } finally {
    globalThis.fetch = original
    setAccessToken(null)
  }
})

test('중복 확인은 서버의 available을 사용하고 가입은 loginId를 전송', async () => {
  const original = globalThis.fetch
  const requests = []
  globalThis.fetch = async (url, options) => {
    requests.push({ url, ...options })
    return Response.json({ success: true, data: { available: false } })
  }
  try {
    assert.equal(await checkId('user&01'), false)
    assert.match(requests[0].url, /loginId=user%2601$/)
    await signup({ userId: 'user01', password: 'secret' })
    assert.deepEqual(JSON.parse(requests[1].body), { loginId: 'user01', password: 'secret' })
  } finally { globalThis.fetch = original }
})

test('실패 응답, 잘못된 응답, 네트워크 오류를 성공으로 처리하지 않는다', async () => {
  await assert.rejects(apiRequest('/test', { fetchImpl: async () => Response.json({ success: false, message: '실패' }) }), /실패/)
  await assert.rejects(apiRequest('/test', { fetchImpl: async () => new Response('<html>') }), /응답/)
  await assert.rejects(apiRequest('/test', { fetchImpl: async () => { throw new TypeError('network') } }), /연결/)
})
