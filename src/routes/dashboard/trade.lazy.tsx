import { createLazyFileRoute } from '@tanstack/react-router'
import DashboardTradePage from '../../pages/DashboardTradePage'

export const Route = createLazyFileRoute('/dashboard/trade')({
  component: DashboardTradePage,
})
