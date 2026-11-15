import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router'
import styled from 'styled-components'
import OnboardingLayout from '../onboarding/OnboardingLayout'
import OnboardingHeader from '../onboarding/OnboardingHeader'
import OnboardingFooter from '../onboarding/OnboardingFooter'

const Frame = styled(OnboardingLayout)`
  min-height: max(852px, 100dvh);
  button, input { font-family: inherit; }
  button { cursor: pointer; }
  button:disabled { cursor: default; }
  button:focus-visible, input:focus-visible { outline: 2px solid #191f28; outline-offset: 2px; }
`
const Content = styled.main`display: flex; flex: 1; flex-direction: column; padding: 0 25px; outline: none;`
const Footer = styled.div`margin-top: auto; padding-top: 24px;`
export const Title = styled.h2`margin: 0; font-size: 20px; font-weight: 500; line-height: 38px;`
export const Description = styled.p`margin: 1px 0 0; color: #5b6575; font-size: 14px; line-height: 22px;`
export const Notice = styled.p`margin: 8px 0; color: #5b6575; font-size: 11px; line-height: 16px;`
export function usePreviewSearch() {
  const { search } = useLocation()
  const preview = new URLSearchParams(search).get('preview')
  const params = new URLSearchParams()
  const familyId = new URLSearchParams(search).get('familyId')
  if (familyId) params.set('familyId', familyId)
  const profileId = new URLSearchParams(search).get('profileId')
  if (profileId) params.set('profileId', profileId)
  if (import.meta.env.DEV && ['self', 'family'].includes(preview)) params.set('preview', preview)
  return params.size ? `?${params}` : ''
}
export default function KeyringFlowLayout({ title, onBack, step, primaryLabel, onPrimaryClick, primaryDisabled, backLabel, onSecondaryClick, progressLabel = '키링 발급 단계', children }) {
  const contentRef = useRef(null)
  useEffect(() => {
    const previous = document.title; document.title = `${title} - MODI`
    contentRef.current?.focus(); window.scrollTo(0, 0)
    return () => { document.title = previous }
  }, [title])
  return <Frame><OnboardingHeader title={title} onBack={onBack} /><Content ref={contentRef} tabIndex={-1}>{children}{step && <Footer><OnboardingFooter primaryLabel={primaryLabel} onPrimaryClick={onPrimaryClick} primaryDisabled={primaryDisabled} step={step} totalSteps={3} progressLabel={progressLabel} showBack={!!backLabel} backLabel={backLabel} onBackClick={onSecondaryClick} /></Footer>}</Content></Frame>
}
