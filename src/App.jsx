import { createBrowserRouter, Navigate, RouterProvider } from 'react-router'
import { onboardingRoutes } from './app/OnboardingFlow.jsx'

// 앱 전체 주소. 키오스크 화면이 생기면 여기에 { path: '/kiosk', ... }를 추가한다.
const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/onboarding" replace /> },
  onboardingRoutes, // /onboarding/... (온보딩 01~08)
  { path: '*', element: <Navigate to="/" replace /> },
])

export default function App() {
  return <RouterProvider router={router} />
}
