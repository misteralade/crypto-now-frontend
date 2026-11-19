import { createFileRoute, redirect } from "@tanstack/react-router";
import KycPage from "../pages/KycPage.tsx";
import { ROUTES } from "../util/constants.util.ts";
import { isAuthenticated } from "../util/auth-session.util.ts";

export const Route = createFileRoute("/kyc")({
  beforeLoad: async () => {
    if (!isAuthenticated()) {
      throw redirect({ to: ROUTES.SIGNIN });
    }
  },
  component: KycPage,
});
