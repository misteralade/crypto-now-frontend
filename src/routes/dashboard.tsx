import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import AuthenticatedLayout from "../layouts/AuthenticatedLayout.tsx";
import { LOCAL_STORAGE_KEYS, ROUTES } from "../util/constants.util.ts";
import { userServiceApi } from "../api/user.api.ts";
import { kycServiceApi } from "../api/kyc.api.ts";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: async () => {
    const accessToken = localStorage.getItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
    if (!accessToken) {
      throw redirect({ to: ROUTES.SIGNIN });
    }

    try {
      const { success } = await userServiceApi.pingUser();
      if (!success) {
        localStorage.removeItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
        throw redirect({ to: ROUTES.SIGNIN });
      }
    } catch {
      localStorage.removeItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
      throw redirect({ to: ROUTES.SIGNIN });
    }

    // KYC gate: only verified users can access dashboard routes.
    try {
      const { data } = await kycServiceApi.getSession();
      if (!data || data.currentStep !== "Approved") {
        throw redirect({ to: ROUTES.KYC });
      }
    } catch (error) {
      // If redirect was already thrown, re-throw it
      if (error && typeof error === "object" && "isRedirect" in error)
        throw error;
      // If session fetch fails (404 = no session yet), redirect to KYC
      throw redirect({ to: ROUTES.KYC });
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
