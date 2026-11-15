import test from 'node:test'
import assert from 'node:assert/strict'
import { STORAGE_KEY, createMockAuthApi, login, markOnboardingCompleted } from './authApi.js'

// ── 기본 내보내기 ─────────────────────────────────────────────
// Node에는 localStorage가 없어서, 저장소를 쓸 수 없을 때(메모리로 동작)를 확인하는 셈이다.

test('처음 로그인하면 onboardingCompleted는 false', async () => {
  assert.deepEqual(await login({ userId: 'first01', password: 'pw' }), {
    userId: 'first01',
    onboardingCompleted: false,
  })
})

test('온보딩을 마친 뒤 다시 로그인하면 true', async () => {
  await markOnboardingCompleted('done01')
  assert.equal((await login({ userId: 'done01', password: 'pw' })).onboardingCompleted, true)
})

test('다른 아이디의 완료 기록은 섞이지 않는다', async () => {
  await markOnboardingCompleted('done02')
  assert.equal((await login({ userId: 'other02', password: 'pw' })).onboardingCompleted, false)
})

// ── 브라우저 저장소 (가짜 저장소로 확인) ──────────────────────

function createFakeStorage(initial = {}) {
  const data = new Map(Object.entries(initial))
  return {
    getItem: (key) => (data.has(key) ? data.get(key) : null),
    setItem: (key, value) => data.set(key, String(value)),
    removeItem: (key) => data.delete(key),
  }
}

// 개인정보 보호 모드·저장소 차단처럼 읽기·쓰기가 모두 오류를 내는 저장소
const brokenStorage = {
  getItem() {
    throw new Error('SecurityError')
  },
  setItem() {
    throw new Error('QuotaExceededError')
  },
}

const completedOf = async (api, userId) => (await api.login({ userId, password: 'pw' })).onboardingCompleted

test('저장소에 기록하면 새로고침(새 API) 뒤에도 같은 아이디는 true', async () => {
  const storage = createFakeStorage()
  await createMockAuthApi(storage).markOnboardingCompleted('user01')
  assert.equal(await completedOf(createMockAuthApi(storage), 'user01'), true)
})

test('저장소의 키를 지우면 새로고침하지 않아도 다시 false (시연 전 기록 지우기)', async () => {
  const storage = createFakeStorage()
  const api = createMockAuthApi(storage)
  await api.markOnboardingCompleted('user01')
  storage.removeItem(STORAGE_KEY)
  assert.equal(await completedOf(api, 'user01'), false)
})

test('저장소 읽기·쓰기가 모두 오류를 내도 예외 없이 메모리로 동작', async () => {
  const api = createMockAuthApi(brokenStorage)
  assert.equal(await completedOf(api, 'user01'), false)
  await api.markOnboardingCompleted('user01')
  assert.equal(await completedOf(api, 'user01'), true)
  assert.equal(await completedOf(api, 'user02'), false)
})

test('저장소가 없어도(null) 메모리로 동작', async () => {
  const api = createMockAuthApi(null)
  await api.markOnboardingCompleted('user01')
  assert.equal(await completedOf(api, 'user01'), true)
})

test('저장된 값이 깨져 있으면 false, 그 뒤 기록하면 정상 저장', async () => {
  for (const broken of ['{not json', '"user01"', '{"user01":true}']) {
    const storage = createFakeStorage({ [STORAGE_KEY]: broken })
    const api = createMockAuthApi(storage)
    assert.equal(await completedOf(api, 'user01'), false)
    await api.markOnboardingCompleted('user01')
    assert.deepEqual(JSON.parse(storage.getItem(STORAGE_KEY)), ['user01'])
  }
})

test('다른 아이디는 섞이지 않고, 같은 아이디를 두 번 기록해도 한 번만 저장', async () => {
  const storage = createFakeStorage()
  const api = createMockAuthApi(storage)
  await api.markOnboardingCompleted('user01')
  await api.markOnboardingCompleted('user01')
  await api.markOnboardingCompleted('user03')
  assert.deepEqual(JSON.parse(storage.getItem(STORAGE_KEY)), ['user01', 'user03'])
  assert.equal(await completedOf(api, 'user02'), false)
})
