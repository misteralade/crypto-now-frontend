import { createFileRoute } from "@tanstack/react-router";
import HeroPreviewPage from "../pages/HeroPreviewPage.tsx";

export const Route = createFileRoute("/")({
  component: HeroPreviewPage,
});
