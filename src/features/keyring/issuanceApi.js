import { apiRequest } from '../api/client.js'
import { validateIssuanceAddress } from './issuanceAddress.js'

export const issuanceStatuses = { REQUESTED: '신청 접수', APPROVED: '승인 완료', SHIPPING: '배송 중', DELIVERED: '배송 완료', CANCELLED: '취소됨' }
function validateResult(result) {
  if (!Number.isSafeInteger(result?.requestId) || result.requestId <= 0 || !Object.hasOwn(issuanceStatuses, result.status) || !Number.isInteger(result.quantity) || result.quantity < 1 || result.quantity > 10) throw new Error('발급 신청 응답을 확인해주세요. 신청 내역을 먼저 확인해주세요.')
  return result
}
export function createIssuanceApi(request = apiRequest) {
  return {
    async submit(address) {
      const errors = validateIssuanceAddress(address)
      if (Object.keys(errors).length) throw new Error(Object.values(errors)[0])
      return validateResult(await request('/api/keyrings/issuance-requests', { method: 'POST', body: {
        postalCode: address.postcode.trim(), address: address.address.trim(), detailAddress: address.detailAddress.trim(), quantity: address.quantity,
      } }))
    },
    async list() {
      const result = await request('/api/keyrings/issuance-requests/me')
      if (!Array.isArray(result)) throw new Error('발급 신청 내역 응답을 확인해주세요.')
      return result.map(validateResult)
    },
  }
}
export const issuanceApi = createIssuanceApi()
