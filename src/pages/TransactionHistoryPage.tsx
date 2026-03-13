import AuthenticatedLayout from "../layouts/AuthenticatedLayout.tsx";
import { TransactionDashboard } from "../sections/dashboard/TransactionHistory/TransactionDashboard.tsx";

export default function TransactionHistoryPage() {
  return (
    <AuthenticatedLayout>
      <TransactionDashboard />
    </AuthenticatedLayout>
  );
}
