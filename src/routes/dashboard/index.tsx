import { createFileRoute } from "@tanstack/react-router";
import DashboardContent from "../../sections/dashboard/DashboardContent.tsx";

export const Route = createFileRoute("/dashboard/")({
  component: DashboardIndexRoute,
});

// Dashboard index page rendered inside the dashboard layout route.
function DashboardIndexRoute() {
  return <DashboardContent />;
}
