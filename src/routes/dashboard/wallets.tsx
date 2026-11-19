import { createFileRoute, redirect } from "@tanstack/react-router";
import { ROUTES } from "../../util/constants.util.ts";
import { isAuthenticated } from "../../util/auth-session.util.ts";

export const Route = createFileRoute("/dashboard/wallets")({
  beforeLoad: async () => {
    if (!isAuthenticated()) {
      throw redirect({ to: ROUTES.SIGNIN });
    }
  },
});
