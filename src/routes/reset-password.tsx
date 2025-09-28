import { createFileRoute, redirect } from "@tanstack/react-router";
import ResetPasswordPage from "../sections/auth/forgot-password/ResetPasswordPage.tsx";
import { LOCAL_STORAGE_KEYS } from "../util/constants";

export const Route = createFileRoute("/reset-password")({
  beforeLoad: () => {
    const accessToken = localStorage.getItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
    if (accessToken) {
      throw redirect({
        to: "/dashboard",
      });
    }
  },
  component: ResetPasswordPage,
});
