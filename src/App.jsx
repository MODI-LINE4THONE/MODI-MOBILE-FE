import KioskPracticePage from './pages/practice/KioskPracticePage.jsx'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router'
import { onboardingRoutes } from './app/OnboardingFlow.jsx'
import { homeRoutes } from './app/HomeFlow.jsx'
import { keyringRoutes } from './app/KeyringFlow.jsx'
import { familyProfileRoutes } from './app/FamilyProfileFlow.jsx'
import { SessionProvider } from './app/SessionContext.jsx'
import AccessibilitySettingsPage from './pages/AccessibilitySettingsPage.jsx'
import KeyringLostPage from './pages/KeyringLostPage.jsx'
import { keyringIssuanceRoutes } from './app/KeyringIssuanceFlow.jsx'
import { keyringConnectRoutes } from './app/KeyringConnectFlow.jsx'
import { FamilyProvider } from './app/FamilyContext.jsx'
import FamilyAddPage from './pages/family/FamilyAddPage.jsx'

// 앱 전체 주소. 홈 화면 등 /onboarding 밖의 화면이 생기면 여기에 추가한다.
const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/onboarding" replace /> },
  onboardingRoutes, // /onboarding/... (온보딩 01~08)
  homeRoutes, // /home (홈)
  keyringRoutes, // /keyrings (키링 관리)
  familyProfileRoutes, // /families/:familyId (가족 프로필 상세)
  { path: '/families/new', element: <FamilyAddPage /> },
  { path: '/practice', element: <KioskPracticePage /> },
  { path: '/accessibility', element: <AccessibilitySettingsPage /> },
  { path: '/keyrings/lost', element: <KeyringLostPage /> },
  keyringIssuanceRoutes,
  keyringConnectRoutes,
  { path: '*', element: <Navigate to="/" replace /> },
])

// SessionProvider: 로그인 아이디·05 선택을 온보딩과 홈이 함께 쓰도록 라우터 바깥에서 감싼다
export default function App() {
  return (
    <SessionProvider>
      <FamilyProvider>
        <RouterProvider router={router} />
      </FamilyProvider>
    </SessionProvider>
  )
}
