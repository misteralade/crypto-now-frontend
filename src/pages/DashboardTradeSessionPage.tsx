import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import DashboardTrade from "../sections/dashboard/trade/DashboardTrade.tsx";
import { LoadingSpinner } from "../components/global/LoadingSpinner.tsx";
import { QUERY_KEYS } from "../queries/query.keys.ts";
import { transactionServiceApi } from "../api/transaction.api.ts";
import type { TradeType } from "../types/trade.types.ts";
import { ROUTES } from "../util/constants.util.ts";

type DashboardTradeSessionPageProps = {
  sessionId: string;
};

export default function DashboardTradeSessionPage({
  sessionId,
}: DashboardTradeSessionPageProps) {
  const { data: transaction, isLoading, isError } = useQuery({
    queryKey: [QUERY_KEYS.TRANSACTION.USER_TRANSACTION_DETAILS, sessionId],
    queryFn: async () => {
      const { data, success } = await transactionServiceApi.getTransactionDetails(
        sessionId,
      );

      if (success && data) {
        return data;
      }

      return null;
    },
    enabled: !!sessionId,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <LoadingSpinner fullScreen={false} message="Restoring transaction…" />
      </div>
    );
  }

  if (isError || !transaction) {
    return (
      <div className="px-5 py-16">
        <div className="mx-auto max-w-xl rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm">
          <p className="text-lg font-bold text-gray-900">
            Transaction not available
          </p>
          <p className="mt-2 text-sm text-gray-600">
            We could not load this trade session. Please return to the trade
            page and start again.
          </p>
          <Link
            to={ROUTES.DASHBOARD_TRADE}
            className="mt-5 inline-flex items-center justify-center rounded-2xl bg-[#948EEE] px-4 py-3 text-sm font-bold text-white"
          >
            Back to Trade
          </Link>
        </div>
      </div>
    );
  }

  const initialTradeType: TradeType =
    transaction.type?.toLowerCase() === "sell" ? "sell" : "buy";

  return (
    <DashboardTrade
      sessionId={sessionId}
      initialTradeType={initialTradeType}
      initialStep={2}
      prefetchedTransaction={transaction}
    />
  );
}
