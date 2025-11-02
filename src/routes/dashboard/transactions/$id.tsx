import { createFileRoute } from '@tanstack/react-router'
import TransactionDetailsPage from "../../../sections/transactions/details/TransactionDetailsPage.tsx";

export const Route = createFileRoute('/dashboard/transactions/$id')({
  component: TransactionDetailsPage,
})
