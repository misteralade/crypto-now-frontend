import AuthenticatedLayout from "../layouts/AuthenticatedLayout.tsx";
import DashboardContent from "../sections/dashboard/DashboardContent.tsx";

export default function DashboardPage() {
  return (
    <AuthenticatedLayout>
      <DashboardContent />
    </AuthenticatedLayout>
  );
}
