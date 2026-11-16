import test from 'node:test'
import assert from 'node:assert/strict'
import { resumeProfile } from './resumeOnboarding.js'
import { login } from '../auth/authApi.js'
import { setAccessToken } from '../api/client.js'

test('프로필이 없으면 생성, 하나면 저장된 유형과 ID로 이어간다', () => {
  assert.deepEqual(resumeProfile({ userType: null }, []), { target: null, nickname: '' })
  assert.deepEqual(resumeProfile({ userType: 'SELF' }, [{ profileId: 7, name: 'user01' }]), { target: 'self', nickname: '', profileId: 7 })
  assert.deepEqual(resumeProfile({ userType: 'GUARDIAN' }, [{ profileId: 8, name: '어머니' }]), { target: 'family', nickname: '어머니', profileId: 8 })
})
test('유형이 없거나 프로필이 여러 개면 임의 선택하거나 생성하지 않는다', () => {
  assert.throws(() => resumeProfile({ userType: null }, [{ profileId: 7 }]), /사용자 유형/)
  assert.throws(() => resumeProfile({ userType: 'SELF' }, [{ profileId: 7 }, { profileId: 8 }]), /여러 개/)
})
test('미완료 재로그인은 사용자·프로필만 조회하고 생성·완료 요청을 하지 않는다', async () => {
  const original = globalThis.fetch
  const paths = []
  globalThis.fetch = async (url, options) => {
    paths.push([new URL(url).pathname, options.method])
    const data = url.endsWith('/api/auth/login') ? { accessToken: 'test' }
      : url.endsWith('/api/users/me') ? { userId: 1, loginId: 'user01', userType: 'SELF', onboardingCompleted: false }
      : [{ profileId: 7, name: 'user01', largeText: false, highContrast: false, touchGuide: false, lowerScreen: false, touchCorrection: false }]
    return Response.json({ success: true, data })
  }
  try {
    const result = await login({ userId: 'user01', password: 'password' })
    assert.equal(result.profile.profileId, 7)
    assert.equal(result.onboardingCompleted, false)
    assert.deepEqual(paths, [['/api/auth/login', 'POST'], ['/api/users/me', 'GET'], ['/api/profiles/me', 'GET']])
  } finally { globalThis.fetch = original; setAccessToken(null) }
})
