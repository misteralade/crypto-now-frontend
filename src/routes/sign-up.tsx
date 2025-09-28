import { createFileRoute, redirect } from "@tanstack/react-router";
import SignUpPage from "../sections/auth/SignUpPage";
import { LOCAL_STORAGE_KEYS } from "../util/constants";

export const Route = createFileRoute("/sign-up")({
  beforeLoad: () => {
    const accessToken = localStorage.getItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
    if (accessToken) {
      throw redirect({
        to: "/dashboard",
      });
    }
  },
  component: SignUpPage,
});
