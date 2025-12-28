import { createFileRoute } from "@tanstack/react-router";
import NotFoundPage from "../pages/NotFoundPage.tsx";

export const Route = createFileRoute("/$")({
  component: NotFoundPage,
});
