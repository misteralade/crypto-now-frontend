import { createLazyFileRoute } from '@tanstack/react-router'
import DashboardBuyPage from '../../pages/DashboardBuyPage.tsx'

export const Route = createLazyFileRoute('/dashboard/buy')({
  component: DashboardBuyPage,
})
