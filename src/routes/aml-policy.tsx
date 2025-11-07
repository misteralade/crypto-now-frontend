import { createFileRoute } from "@tanstack/react-router";
import AmlPolicyPage from "../sections/legal/AmlPolicyPage";

export const Route = createFileRoute("/aml-policy")({
  component: AmlPolicyPage,
});
