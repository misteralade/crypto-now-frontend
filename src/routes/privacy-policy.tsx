import { createFileRoute } from "@tanstack/react-router";
import PrivacyPolicyPage from "../sections/legal/PrivacyPolicyPage";

export const Route = createFileRoute("/privacy-policy")({
  component: PrivacyPolicyPage,
});
