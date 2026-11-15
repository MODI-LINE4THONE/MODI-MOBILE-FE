import { checkId, signup } from '../../features/auth/authApi.js'
import { useRef, useState } from 'react'
import styled from 'styled-components'
import OnboardingLayout from '../../components/onboarding/OnboardingLayout'
import OnboardingHeader from '../../components/onboarding/OnboardingHeader'
import PrimaryButton from '../../components/onboarding/PrimaryButton'
import TextInput from '../../components/onboarding/TextInput'
import ResultPopup from '../../components/onboarding/ResultPopup'

// 비밀번호 조건: 8~16자, 영문 1자 이상 + 숫자 1자 이상 꼭 포함. 특수문자도 쓸 수 있음(띄어쓰기는 불가).
const PASSWORD_RULE = /^(?=.*[A-Za-z])(?=.*\d)[\x21-\x7E]{8,16}$/

const Form = styled.form`
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 0 25px;
`

// 아이디 부분 → 비밀번호 부분 37.
// "사용 가능한 아이디입니다." 문구(9 + 14)는 이 간격 안에 들어가서 아래가 움직이지 않는다.
const Fields = styled.div`
  display: flex;
  flex-direction: column;
  gap: 37px;
`

// 비밀번호 부분 → 비밀번호 확인 부분 14
const PasswordFields = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`

const SubmitButton = styled(PrimaryButton)`
  margin: auto 0 64px;
`

// 중복 확인·가입 성공 응답을 받은 경우에만 다음 단계로 진행한다.
// onBack: 뒤로가기 화살표를 누르면 호출
// onGoToLogin: 팝업의 "로그인 화면으로 돌아가기"를 누르면 호출
export default function SignupPage({ onBack, onGoToLogin }) {
  const [userId, setUserId] = useState('')
  const [checkedUserId, setCheckedUserId] = useState(null) // 중복확인을 마친 아이디
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [isPopupOpen, setIsPopupOpen] = useState(false)

  const [pending, setPending] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const busy = useRef(false)
  const currentUserId = useRef('')

  const trimmedUserId = userId.trim()
  // 중복확인 뒤 아이디를 고치면 다시 확인해야 한다
  const isUserIdChecked = checkedUserId !== null && checkedUserId === userId
  const isPasswordValid = PASSWORD_RULE.test(password)
  const canSubmit = !pending && isUserIdChecked && isPasswordValid && passwordConfirm === password

  const handleCheckUserId = async () => {
    if (busy.current) return
    if (trimmedUserId.length < 4 || trimmedUserId.length > 15) {
      setError('아이디는 4~15자로 입력해주세요.')
      return
    }
    const requestedId = userId
    busy.current = true
    setPending(true)
    setError('')
    setMessage('')
    setCheckedUserId(null)
    try {
      const available = await checkId(trimmedUserId)
      if (currentUserId.current !== requestedId) return
      if (available) setCheckedUserId(requestedId)
      setMessage(available ? '사용 가능한 아이디입니다.' : '이미 사용 중인 아이디입니다.')
    } catch (err) {
      setError(err.message || '중복 확인에 실패했습니다.')
    } finally {
      busy.current = false
      setPending(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!canSubmit || busy.current) return
    busy.current = true
    setPending(true)
    setError('')
    try {
      await signup({ userId: trimmedUserId, password })
      setIsPopupOpen(true)
    } catch (err) {
      setError(err.message || '회원가입에 실패했습니다.')
    } finally {
      busy.current = false
      setPending(false)
    }
  }

  return (
    <OnboardingLayout withStatusBar>
      <OnboardingHeader title="회원가입" onBack={onBack} />
      <Form onSubmit={handleSubmit}>
        <Fields>
          <TextInput
            label="아이디"
            actionLabel="중복확인"
            onActionClick={handleCheckUserId}
            message={message}
            type="text"
            placeholder="아이디 입력"
            autoComplete="username"
            value={userId}
            onChange={(e) => {
              currentUserId.current = e.target.value
              setUserId(e.target.value)
              setCheckedUserId(null)
              setMessage('')
            }}
          />
          <PasswordFields>
            <TextInput
              label="비밀번호"
              type="password"
              placeholder="비밀번호 입력 (영문+숫자 8~16자)"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {/* 조건을 만족하지 않으면 숨긴다. 입력했던 값(passwordConfirm)은 그대로 남는다. */}
            {isPasswordValid && (
              <TextInput
                label="비밀번호 확인"
                type="password"
                autoComplete="new-password"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
              />
            )}
          </PasswordFields>
        </Fields>
        {error && <p role="alert">{error}</p>}
        <SubmitButton type="submit" disabled={!canSubmit}>
          {pending ? '처리 중…' : '회원가입'}
        </SubmitButton>
      </Form>
      <ResultPopup
        open={isPopupOpen}
        title="회원가입 완료"
        actionLabel="로그인 화면으로 돌아가기"
        onAction={onGoToLogin}
      />
    </OnboardingLayout>
  )
}
