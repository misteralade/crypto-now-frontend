import { createFileRoute } from "@tanstack/react-router";
import PrivacyPolicyPage from "../pages/legal/PrivacyPolicyPage";

export const Route = createFileRoute("/privacy-policy")({
  component: PrivacyPolicyPage,
});
