import { createBrowserRouter } from 'react-router-dom'
import AuditPage from '../features/audit/AuditPage'
import CarbonPage from '../features/carbon/CarbonPage'
import DispatchPage from '../features/dispatch/DispatchPage'
import OverviewPage from '../features/overview/OverviewPage'
import AppLayout from './layout/AppLayout'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <OverviewPage /> },
      { path: 'dispatch', element: <DispatchPage /> },
      { path: 'carbon', element: <CarbonPage /> },
      { path: 'audit', element: <AuditPage /> },
    ],
  },
])
