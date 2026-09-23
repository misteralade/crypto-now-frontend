import { createFileRoute } from "@tanstack/react-router";
import HowItWorksPage from "../pages/HowItWorksPage.tsx";

export const Route = createFileRoute("/how-it-works")({
  component: HowItWorksPage,
});
