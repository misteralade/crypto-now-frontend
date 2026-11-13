import { createFileRoute, redirect } from "@tanstack/react-router";
import HeroPreviewPage from "../pages/HeroPreviewPage.tsx";
import { ROUTES } from "../util/constants.util.ts";
import { isAuthenticated } from "../util/auth-session.util.ts";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    if (isAuthenticated()) {
      throw redirect({
        to: ROUTES.DASHBOARD,
      });
    }
  },
  component: HeroPreviewPage,
});
