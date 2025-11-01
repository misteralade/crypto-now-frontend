import { createFileRoute, redirect } from "@tanstack/react-router";
import SignInPage from "../sections/auth/SignInPage";
import { LOCAL_STORAGE_KEYS } from "../util/constants.util.ts";

export const Route = createFileRoute("/sign-in")({
  beforeLoad: () => {
    const accessToken = localStorage.getItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
    if (accessToken) {
      throw redirect({
        to: "/dashboard",
      });
    }
  },
  component: SignInPage,
});
