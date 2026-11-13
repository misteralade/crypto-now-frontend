import { createFileRoute, redirect } from "@tanstack/react-router";
import SignUpPage from "../sections/auth/SignUpPage";
import { ROUTES } from "../util/constants.util.ts";
import { isAuthenticated } from "../util/auth-session.util.ts";

export const Route = createFileRoute("/sign-up")({
  beforeLoad: () => {
    if (isAuthenticated()) {
      throw redirect({
        to: ROUTES.DASHBOARD,
      });
    }
  },
  component: SignUpPage,
});
