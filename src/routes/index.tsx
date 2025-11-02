import { createFileRoute } from "@tanstack/react-router";
import HomePage from "../sections/homepage/HomePage.tsx";

export const Route = createFileRoute("/")({
  component: HomePage,
});
