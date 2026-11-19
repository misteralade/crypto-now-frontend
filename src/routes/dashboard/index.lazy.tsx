import { createLazyFileRoute } from '@tanstack/react-router'
import DashboardContent from '../../sections/dashboard/DashboardContent'

export const Route = createLazyFileRoute('/dashboard/')({
  component: DashboardContent,
})
