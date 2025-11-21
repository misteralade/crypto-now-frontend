import { createFileRoute } from "@tanstack/react-router";
import ContactPage from "../pages/ContactPage.tsx";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
});
