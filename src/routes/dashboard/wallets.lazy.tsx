import { createLazyFileRoute } from '@tanstack/react-router'
import DashboardWalletsContent from '../../sections/dashboard/wallets/DashboardWalletsContent'

export const Route = createLazyFileRoute('/dashboard/wallets')({
  component: DashboardWalletsContent,
})
