import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import AuthenticatedLayout from "../layouts/AuthenticatedLayout.tsx";
import { LOCAL_STORAGE_KEYS, ROUTES } from "../util/constants.util.ts";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: async () => {
    const accessToken = localStorage.getItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
    if (!accessToken) {
      throw redirect({ to: ROUTES.SIGNIN });
    }
  },
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
