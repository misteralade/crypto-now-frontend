import { useNavigate } from "@tanstack/react-router";
import DashboardTrade from "../sections/dashboard/trade/DashboardTrade.tsx";
import { ROUTES } from "../util/constants.util.ts";

export default function DashboardBuyPage() {
  const navigate = useNavigate();
  return (
    <DashboardTrade
      initialTradeType="buy"
      onExit={() => navigate({ to: ROUTES.DASHBOARD })}
    />
  );
}
