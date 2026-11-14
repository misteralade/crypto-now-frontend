import { createFileRoute } from "@tanstack/react-router";
import CheckEmailPage from "../sections/auth/CheckEmailPage.tsx";

export const Route = createFileRoute("/check-email")({
  validateSearch: (search: Record<string, unknown>) => ({
    email: typeof search.email === "string" ? search.email : "",
  }),
  component: CheckEmailPage,
});
