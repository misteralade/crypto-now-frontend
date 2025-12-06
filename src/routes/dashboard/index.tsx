import { createFileRoute, redirect } from "@tanstack/react-router";
import DashboardPage from "../../sections/dashboard/DashboardPage.tsx";
import {LOCAL_STORAGE_KEYS, ROUTES} from "../../util/constants.util.ts";

export const Route = createFileRoute("/dashboard/")({
  beforeLoad: () => {
    const accessToken = localStorage.getItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
    if (!accessToken) {
      throw redirect({
        to: ROUTES.SIGNIN,
      });
    }
  },
  component: DashboardPage,
});
