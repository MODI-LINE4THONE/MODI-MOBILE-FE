import { apiRequest, setAccessToken } from '../api/client.js'

export function createLogoutAction(request = apiRequest, clear = () => setAccessToken(null)) {
  let pending = null
  return function logout() {
    if (pending) return pending
    pending = Promise.resolve().then(() => request('/api/auth/logout', { method: 'POST' }))
      .then(() => { clear() })
      .finally(() => { pending = null })
    return pending
  }
}
export const logout = createLogoutAction()
