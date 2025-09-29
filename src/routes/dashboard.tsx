import { createFileRoute } from "@tanstack/react-router";
import DashboardPage from "../sections/dashboard/DashboardPage.tsx"

export const Route = createFileRoute("/dashboard")({
    component: DashboardPage,
});
