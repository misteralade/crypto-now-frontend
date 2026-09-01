import { createFileRoute, redirect } from "@tanstack/react-router";
import HeroPreviewPage from "../pages/HeroPreviewPage.tsx";
import { LOCAL_STORAGE_KEYS, ROUTES } from "../util/constants.util.ts";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    const accessToken = localStorage.getItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
    if (accessToken) {
      throw redirect({
        to: ROUTES.DASHBOARD,
      });
    }
  },
  component: HeroPreviewPage,
});
