export function validateIssuanceAddress(value) {
  const errors = {}
  if (!/^\d{5}$/.test(value.postcode.trim())) errors.postcode = '5자리 우편번호를 입력해주세요.'
  if (!value.address.trim()) errors.address = '주소를 입력해주세요.'
  if (!value.detailAddress.trim()) errors.detailAddress = '상세주소를 입력해주세요. 없으면 ‘없음’을 입력해주세요.'
  return errors
}

