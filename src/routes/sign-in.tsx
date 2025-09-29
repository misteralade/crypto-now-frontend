import { createFileRoute } from "@tanstack/react-router";
import SignInPage from "../sections/auth/SignInPage";

export const Route = createFileRoute("/sign-in")({
  component: SignInPage,
});
