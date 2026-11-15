const baseUrl = (import.meta.env?.VITE_API_BASE_URL || 'https://modi.kang0131.shop').replace(/\/$/, '')
let accessToken = null

// 새로고침하면 재로그인한다. 토큰은 영구 저장소에 기록하지 않는다.
export function setAccessToken(token) {
  accessToken = token
}

export async function apiRequest(path, { method = 'GET', body, fetchImpl = globalThis.fetch } = {}) {
  let response
  try {
    response = await fetchImpl(`${baseUrl}${path}`, {
      method,
      headers: {
        Accept: 'application/json',
        ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
      signal: AbortSignal.timeout(15000),
    })
  } catch {
    throw new Error('서버에 연결하지 못했습니다. 잠시 후 다시 시도해주세요.')
  }
  const payload = await response.json().catch(() => null)
  if (response.status === 401) setAccessToken(null)
  if (!response.ok || payload?.success === false) {
    throw new Error(payload?.message || '요청을 처리하지 못했습니다. 다시 시도해주세요.')
  }
  if (!payload || payload.success !== true) throw new Error('서버 응답을 확인해주세요.')
  return payload.data
}
