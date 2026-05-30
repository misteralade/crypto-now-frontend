import { createLazyFileRoute } from "@tanstack/react-router";
import DashboardTradeSessionPage from "../../../pages/DashboardTradeSessionPage.tsx";

export const Route = createLazyFileRoute("/dashboard/trade/$sessionId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { sessionId } = Route.useParams();
  return <DashboardTradeSessionPage sessionId={sessionId} />;
}
