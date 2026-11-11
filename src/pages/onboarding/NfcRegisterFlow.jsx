import { useState } from 'react'
import NfcCodePage from './NfcCodePage'
import NfcCompletePage from './NfcCompletePage'

// NFC 키링 등록 07(코드 입력) → 08(등록 완료) 화면 전환.
// 화면 이동 라이브러리 없이 상태 하나로 어떤 화면을 보여 줄지 정한다.
// 각 화면은 이동 방법을 모르고 props/콜백만 쓴다 →
// 나중에 react-router를 도입하면 이 파일만 경로(Route)로 바꾸면 된다.
export default function NfcRegisterFlow() {
  const [result, setResult] = useState(null) // { keyringId, registeredAt }

  if (result) {
    return <NfcCompletePage keyringId={result.keyringId} registeredAt={result.registeredAt} />
  }

  return (
    <NfcCodePage
      onNext={({ code, registeredAt }) => setResult({ keyringId: code, registeredAt })}
    />
  )
}
