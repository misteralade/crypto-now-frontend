import { createFileRoute } from "@tanstack/react-router";
import AboutPage from "../sections/about/AboutPage";

export const Route = createFileRoute("/about")({
  component: AboutPage,
});
