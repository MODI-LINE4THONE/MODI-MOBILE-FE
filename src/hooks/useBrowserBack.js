import { useEffect, useRef } from 'react'

// 휴대폰·브라우저 뒤로가기를 화면 안의 "뒤로가기 화살표"와 같게 만든다 (라이브러리 없이 History API 사용).
//
// onBack: 지금 화면에서 뒤로가기를 누르면 할 일. null이면 뒤로가기 규칙이 없는 화면 → 앱을 벗어난다.
//
// 원리: 뒤로가기 규칙이 있는 화면에서는 브라우저 기록에 "막이" 항목을 하나 쌓아 둔다.
//   뒤로가기를 누르면 브라우저는 막이 항목만 지우고 페이지는 그대로 → popstate에서 onBack 실행.
//   규칙이 없는 화면에서 뒤로가기를 누르면 한 번 더 뒤로 가서 앱을 벗어난다.
//
// react-router로 바꾸면 이 파일은 필요 없다(라우터가 브라우저 기록을 맡음).
export default function useBrowserBack(onBack) {
  const onBackRef = useRef(onBack)
  const hasGuardRef = useRef(false)

  useEffect(() => {
    onBackRef.current = onBack
    // 뒤로가기 규칙이 있는 화면인데 막이 항목이 없으면 쌓는다
    if (onBack && !hasGuardRef.current) {
      window.history.pushState({ modiBackGuard: true }, '')
      hasGuardRef.current = true
    }
  }, [onBack])

  useEffect(() => {
    const handlePopState = (e) => {
      // 앞으로 가기로 막이 항목에 다시 온 경우
      if (e.state?.modiBackGuard) {
        hasGuardRef.current = true
        return
      }
      hasGuardRef.current = false
      const back = onBackRef.current
      if (back) {
        // 화면 안 뒤로가기와 같은 규칙으로 이동. 다음 화면에 규칙이 있으면 위 effect가 막이를 다시 쌓는다.
        window.history.pushState({ modiBackGuard: true }, '')
        hasGuardRef.current = true
        back()
      } else {
        window.history.back() // 앱을 벗어난다
      }
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])
}
