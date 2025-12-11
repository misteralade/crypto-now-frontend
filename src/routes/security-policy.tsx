import { createFileRoute } from "@tanstack/react-router";
import SecurityPolicyPage from "../pages/legal/SecurityPolicyPage";

export const Route = createFileRoute("/security-policy")({
  component: SecurityPolicyPage,
});
