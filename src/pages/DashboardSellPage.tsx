import { useNavigate } from "@tanstack/react-router";
import DashboardTrade from "../sections/dashboard/trade/DashboardTrade.tsx";
import { ROUTES } from "../util/constants.util.ts";

export default function DashboardSellPage() {
  const navigate = useNavigate();
  return (
    <DashboardTrade
      initialTradeType="sell"
      onExit={() => navigate({ to: ROUTES.DASHBOARD })}
    />
  );
}
