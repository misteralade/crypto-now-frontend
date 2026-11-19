import { createLazyFileRoute } from '@tanstack/react-router'
import TransactionHistoryPage from '../../../pages/TransactionHistoryPage'

export const Route = createLazyFileRoute('/dashboard/transactions/')({
  component: TransactionHistoryPage,
})
