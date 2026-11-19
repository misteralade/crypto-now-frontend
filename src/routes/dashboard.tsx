import { Outlet, createFileRoute } from "@tanstack/react-router";
import AuthenticatedLayout from "../layouts/AuthenticatedLayout.tsx";
import { requireOnboarded } from "../util/guards/requireOnboarded.ts";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: requireOnboarded,
  component: DashboardLayoutRoute,
});

// Dashboard layout wrapper that provides sidebar + header for all /dashboard/* pages.
function DashboardLayoutRoute() {
  return (
    <AuthenticatedLayout>
      <Outlet />
    </AuthenticatedLayout>
  );
}
