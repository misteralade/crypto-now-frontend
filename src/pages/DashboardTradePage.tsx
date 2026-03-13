import AuthenticatedLayout from "../layouts/AuthenticatedLayout.tsx";
import DashboardTrade from "../sections/dashboard/trade/DashboardTrade.tsx";

export default function DashboardTradePage() {
  return (
    <AuthenticatedLayout>
      <DashboardTrade />
    </AuthenticatedLayout>
  );
}
