import { createFileRoute } from "@tanstack/react-router";
import LoginPage from "../sections/auth/LoginPage";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});
