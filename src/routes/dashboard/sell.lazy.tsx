import { createLazyFileRoute } from '@tanstack/react-router'
import DashboardSellPage from '../../pages/DashboardSellPage.tsx'

export const Route = createLazyFileRoute('/dashboard/sell')({
  component: DashboardSellPage,
})
