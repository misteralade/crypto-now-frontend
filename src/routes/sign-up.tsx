import { createFileRoute } from "@tanstack/react-router";
import SignUpPage from "../sections/auth/SignUpPage";

export const Route = createFileRoute("/sign-up")({
  component: SignUpPage,
});
