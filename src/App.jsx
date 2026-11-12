import { createBrowserRouter, Navigate, RouterProvider } from 'react-router'
import { onboardingRoutes } from './app/OnboardingFlow.jsx'
import AccessibilitySettingsPage from './pages/AccessibilitySettingsPage.jsx'
import KeyringLostPage from './pages/KeyringLostPage.jsx'

// 앱 전체 주소. 홈 화면 등 /onboarding 밖의 화면이 생기면 여기에 추가한다.
const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/onboarding" replace /> },
  onboardingRoutes, // /onboarding/... (온보딩 01~08)
  { path: '/accessibility', element: <AccessibilitySettingsPage /> },
  { path: '/keyrings/lost', element: <KeyringLostPage /> },
  { path: '*', element: <Navigate to="/" replace /> },
])

export default function App() {
  return <RouterProvider router={router} />
}
