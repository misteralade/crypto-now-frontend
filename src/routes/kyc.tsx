import { createFileRoute, redirect } from "@tanstack/react-router";
import KycPage from "../pages/KycPage.tsx";
import { LOCAL_STORAGE_KEYS, ROUTES } from "../util/constants.util.ts";

export const Route = createFileRoute("/kyc")({
  beforeLoad: async () => {
    const accessToken = localStorage.getItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
    if (!accessToken) {
      throw redirect({ to: ROUTES.SIGNIN });
    }
  },
  component: KycPage,
});
