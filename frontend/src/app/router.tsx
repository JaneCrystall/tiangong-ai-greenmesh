import { createBrowserRouter } from 'react-router-dom'
import AuditPage from '../features/audit/AuditPage'
import CarbonPage from '../features/carbon/CarbonPage'
import DispatchPage from '../features/dispatch/DispatchPage'
import OverviewPage from '../features/overview/OverviewPage'
import LoginPage from '../features/auth/LoginPage'
import AppLayout from './layout/AppLayout'
import ProtectedRoute from './layout/ProtectedRoute'

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <OverviewPage /> },
      { path: 'dispatch', element: <DispatchPage /> },
      { path: 'carbon', element: <CarbonPage /> },
      { path: 'audit', element: <AuditPage /> },
    ],
  },
])
