const KEY = 'modi:auth-session:v1'
let memory = null
const listeners = new Set()
function storage() { try { return globalThis.sessionStorage } catch { return null } }
export function readSession() {
  let session = memory
  try { session = JSON.parse(storage()?.getItem(KEY) ?? 'null') ?? memory } catch { /* 메모리로 대체 */ }
  if (!session?.accessToken || (session.expiresAt && session.expiresAt <= Date.now())) {
    if (session) writeSession(null)
    return null
  }
  return session
}
export function writeSession(session) {
  memory = session
  try {
    if (session) storage()?.setItem(KEY, JSON.stringify(session))
    else storage()?.removeItem(KEY)
  } catch { /* 저장소 사용 불가 시 현재 페이지의 메모리만 사용 */ }
  listeners.forEach(listener => listener(session))
}
export function subscribeSession(listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}
