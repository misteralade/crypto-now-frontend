import { createFileRoute } from "@tanstack/react-router";
import SignInPage from "../sections/auth/SignUpPage";

export const Route = createFileRoute("/sign-up")({
  component: SignInPage,
});
