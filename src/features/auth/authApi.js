// ─────────────────────────────────────────────────────────────
// 로그인·온보딩 완료 서버 요청
//
// 지금은 서버가 없어서 흉내 낸다. 부르는 쪽(SessionContext)은 아래 두 함수만 쓴다.
//   login({ userId, password }) → { userId, onboardingCompleted }
//   markOnboardingCompleted(userId): 온보딩 완료 저장 (06 "나중에", 08 "홈으로 이동")
// 두 함수 모두 서버 요청처럼 Promise를 돌려준다.
//
// 서버 흉내: "온보딩을 완료한 아이디 목록"을 브라우저 저장소(localStorage)에 기억한다.
//   → 새로고침하면 로그인은 풀리지만, 같은 아이디로 다시 로그인하면 onboardingCompleted가 true로 온다.
//   저장소를 쓸 수 없으면(개인정보 보호 모드, 저장소 차단, Node 테스트) 오류 없이 메모리로 동작한다
//   (이때는 새로고침하면 기록이 사라진다).
//
// ※ 진짜 서버를 연결하면 이 저장소 코드(STORAGE_KEY, 읽기·쓰기, createMockAuthApi)는 모두 없어진다.
//   완료 기록은 서버의 계정 정보에 있으므로, login과 markOnboardingCompleted 안만
//   실제 API 호출로 바꾸고(login은 응답의 onboardingCompleted를 그대로 돌려준다) 나머지는 지운다.
//
// 시연 전에 기록 지우기 (지운 뒤 새로고침하고 로그인 화면부터 시작)
//   개발자 도구 콘솔: localStorage.removeItem('modi.mock.onboardingCompletedUserIds')
//   또는 Application 탭 → Local Storage → 사이트 주소 → 이 키를 골라 Delete
//   "Clear site data"(사이트 데이터 전체 삭제)는 팀원 화면의 저장 값까지 지우므로 쓰지 않는다.
//   기록은 주소(origin)마다 따로라서 개발 서버와 배포 주소에서 각각 지운다.
// ─────────────────────────────────────────────────────────────

export const STORAGE_KEY = 'modi.mock.onboardingCompletedUserIds'

// 브라우저 저장소. 없거나 접근 자체가 막혀 있으면(보안 오류) null
function getBrowserStorage() {
  try {
    return globalThis.localStorage ?? null
  } catch {
    return null
  }
}

// 저장된 아이디 목록 읽기. 읽을 수 없거나 값이 깨져 있으면 빈 목록
function readIds(storage) {
  if (!storage) return []
  try {
    const value = JSON.parse(storage.getItem(STORAGE_KEY))
    return Array.isArray(value) ? value.filter((id) => typeof id === 'string') : []
  } catch {
    return []
  }
}

// 저장. 성공하면 true, 저장소가 없거나 실패(용량 초과 등)하면 false
function writeIds(storage, ids) {
  if (!storage) return false
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(ids))
    return true
  } catch {
    return false
  }
}

// 서버 흉내 만들기. storage: 저장소 (기본값은 브라우저 localStorage, 테스트에서는 가짜 저장소)
export function createMockAuthApi(storage = getBrowserStorage()) {
  // 저장소에 쓰지 못한 아이디만 여기에 기억한다 (새로고침 전까지만 유지).
  // 저장소가 되면 매번 저장소를 다시 읽어서, 개발자 도구에서 지운 기록이 바로 반영된다.
  const memoryIds = new Set()

  const isCompleted = (userId) => memoryIds.has(userId) || readIds(storage).includes(userId)

  return {
    // password: 서버 연결 때 함께 보낸다 (지금은 확인하지 않음)
    async login({ userId }) {
      return { userId, onboardingCompleted: isCompleted(userId) }
    },

    async markOnboardingCompleted(userId) {
      const ids = readIds(storage)
      if (ids.includes(userId)) return
      if (!writeIds(storage, [...ids, userId])) memoryIds.add(userId)
    },
  }
}

const mockAuthApi = createMockAuthApi()

export const login = (credentials) => mockAuthApi.login(credentials)
export const markOnboardingCompleted = (userId) => mockAuthApi.markOnboardingCompleted(userId)
