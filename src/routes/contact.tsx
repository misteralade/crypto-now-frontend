import { createFileRoute } from "@tanstack/react-router";
import ContactPage from "../sections/contact/ContactPage";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
});
