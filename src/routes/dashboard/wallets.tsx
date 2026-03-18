import { createFileRoute, redirect } from "@tanstack/react-router";
import { LOCAL_STORAGE_KEYS, ROUTES } from "../../util/constants.util.ts";
import { userServiceApi } from "../../api/user.api.ts";
import DashboardWalletsContent from "../../sections/dashboard/wallets/DashboardWalletsContent.tsx";

export const Route = createFileRoute("/dashboard/wallets")({
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
  },
  component: DashboardWalletsContent,
});
