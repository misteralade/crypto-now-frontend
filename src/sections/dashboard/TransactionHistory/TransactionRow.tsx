import { ArrowDownToLine, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import type { TransactionResponseEntity } from "../../../types/response.payload.types.ts";
import CopyAccountDetails from "../../trade-crypto/CopyAccountDetails.tsx";
import momentClient from "../../../lib/moment.ts";
import { getStatusColor, getStatusDot, getStatusDisplayName } from "../../../util/transaction.util.ts";
import { useNavigate } from "@tanstack/react-router";
import { ROUTES } from "../../../util/constants.util.ts";
import { useTransactionQuery } from "../../../queries/transaction.query.ts";
import { convertToMillify } from "../../../util/index.util.ts";

interface TransactionRowProps {
  transaction: TransactionResponseEntity;
  isLast: boolean;
  isMobileCard?: boolean;
}

const TransactionRow = ({ transaction, isLast, isMobileCard = false }: TransactionRowProps) => {
  const { downloadSingleTransactionMutation } = useTransactionQuery();
  const navigate = useNavigate();

  const handleViewTransaction = () => {
    navigate({ to: `${ROUTES.TRANSACTION}/${transaction.sessionId}` });
  };

  const handleViewDispute = () => {
    if (transaction.dispute?.id) {
      navigate({ to: "/dispute/$id", params: { id: transaction.dispute.id } });
    }
  };

  const handleContinueTransaction = () => {
    const tradeType = transaction.type.toLowerCase() === "sell" ? "sell" : "buy";
    navigate({
      to: ROUTES.TRADE_CRYPTO,
      search: {
        sessionId: transaction.sessionId,
        option: tradeType,
        currency: transaction.currency || "",
        token: transaction.cryptocurrencyId || "",
      },
    });
  };

  const handleDownloadTransaction = async (sessionId: string) => {
    const { success, data } = await downloadSingleTransactionMutation.mutateAsync(sessionId);
    if (success && data) {
      const blob = new Blob([data], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${sessionId}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  const canContinueTransaction =
    (transaction.status === "INITIATED" ||
      transaction.status === "AWAITING_CRYPTO" ||
      transaction.status === "AWAITING_PAYMENT") &&
    momentClient.isWithinDuration(transaction.createdAt, 1, "hour");

  const canViewDispute = transaction.status === "DISPUTED";
  const isBuy = transaction.type.toUpperCase() === "BUY";
  const fiatAmount = convertToMillify(
    transaction.currency === "USD"
      ? Number(transaction.amountFiat)
      : Number(transaction.amountFiat) / Number(transaction.stableToFiatRate || 1),
    2
  );

  /* ── MOBILE CARD ── */
  if (isMobileCard) {
    return (
      <div>
        <button
          className="w-full text-left px-4 py-4 flex items-center gap-3 active:bg-gray-50 transition-colors"
          onClick={handleViewTransaction}
        >
          {/* Crypto logo + buy/sell indicator */}
          <div className="relative shrink-0">
            <img
              src={transaction.cryptocurrency.logoUrl}
              alt={transaction.cryptocurrency.symbol}
              className="w-10 h-10 rounded-full"
            />
            <div
              className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center"
              style={{ background: isBuy ? "#037847" : "#948EEE", border: "2px solid #FFFFFF" }}
            >
              {isBuy ? (
                <ArrowDownLeft size={8} color="#FFFFFF" />
              ) : (
                <ArrowUpRight size={8} color="#FFFFFF" />
              )}
            </div>
          </div>

          {/* Middle: name + ref + network */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate" style={{ color: "#0E0F0C" }}>
              {isBuy ? "Buy" : "Sell"} {transaction.cryptocurrency.symbol}
            </p>
            <p className="text-xs truncate" style={{ color: "#9A9A9A" }}>
              {momentClient.formatToTransactionInitiationDate(transaction.createdAt)}
            </p>
          </div>

          {/* Right: amount + status */}
          <div className="text-right shrink-0">
            <p className="text-sm font-bold" style={{ color: isBuy ? "#037847" : "#0E0F0C" }}>
              {transaction.currency === "USD" ? "$" : "₦"}{fiatAmount}
            </p>
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium"
              style={{
                background: getStatusColor(transaction.status).split(" ")[1] || "#F4F5F7",
              }}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${getStatusDot(transaction.status)}`}
              />
              <span className={getStatusColor(transaction.status).split(" ")[0]}>
                {getStatusDisplayName(transaction.status)}
              </span>
            </span>
          </div>
        </button>

        {!isLast && <div style={{ height: "1px", background: "#F4F5F7", marginLeft: "64px" }} />}
      </div>
    );
  }

  /* ── DESKTOP TABLE ROW ── */
  return (
    <tr
      className={`transition-colors hover:bg-[#F4F5F7] ${!isLast ? "border-b" : ""}`}
      style={{ borderColor: "#ECECEC" }}
    >
      <td className="px-5 py-4 text-sm font-mono">
        <CopyAccountDetails accountNumber={transaction.sessionId} className="!max-w-[110px]" />
      </td>
      <td className="px-5 py-4 text-sm" style={{ color: "#6B6E6B" }}>
        {momentClient.formatToTransactionInitiationDate(transaction.createdAt)}
      </td>
      <td className="px-5 py-4">
        <div className="flex items-center gap-2">
          <div
            className="w-5 h-5 rounded-full flex items-center justify-center"
            style={{ background: isBuy ? "rgba(3,120,71,0.12)" : "rgba(148,142,238,0.12)" }}
          >
            {isBuy ? (
              <ArrowDownLeft size={11} style={{ color: "#037847" }} />
            ) : (
              <ArrowUpRight size={11} style={{ color: "#948EEE" }} />
            )}
          </div>
          <span className="text-sm font-medium" style={{ color: "#0E0F0C" }}>
            {transaction.type}
          </span>
        </div>
      </td>
      <td className="px-5 py-4">
        <div className="flex items-center gap-2">
          <img
            src={transaction.cryptocurrency.logoUrl}
            alt={transaction.cryptocurrency.symbol}
            className="w-6 h-6 rounded-full"
          />
          <div>
            <p className="text-sm font-medium" style={{ color: "#0E0F0C" }}>
              {Number(transaction.amountCrypto).toFixed(4)}
            </p>
            <p className="text-xs" style={{ color: "#9A9A9A" }}>{transaction.cryptocurrency.symbol}</p>
          </div>
        </div>
      </td>
      <td className="px-5 py-4 text-sm font-semibold" style={{ color: "#0E0F0C" }}>
        {transaction.currency === "USD" ? "$" : "₦"}{fiatAmount}
      </td>
      <td className="px-5 py-4 text-sm" style={{ color: "#6B6E6B" }}>
        {Number(transaction.stableToFiatRate).toFixed(2)}
      </td>
      <td className="px-5 py-4">
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${getStatusDot(transaction.status)}`} />
          {getStatusDisplayName(transaction.status)}
        </span>
      </td>
      <td className="px-5 py-4">
        <div className="flex items-center gap-2">
          <button
            className="p-1.5 rounded-lg transition-colors hover:bg-gray-100"
            disabled={transaction.status === "FAILED"}
            onClick={() => handleDownloadTransaction(transaction.sessionId)}
          >
            <ArrowDownToLine
              size={16}
              className={
                transaction.status === "COMPLETED" || transaction.status === "FAILED"
                  ? "cursor-pointer"
                  : "cursor-not-allowed opacity-30"
              }
              style={{ color: "#575AE5" }}
            />
          </button>

          <button
            className="px-3 py-1 rounded-full text-xs font-semibold transition-opacity hover:opacity-80"
            style={{ background: "#F0EFFD", color: "#575AE5" }}
            onClick={handleViewTransaction}
          >
            View
          </button>

          {canViewDispute && (
            <button
              disabled={!transaction.dispute?.id}
              className="px-3 py-1 rounded-full text-xs font-semibold transition-opacity hover:opacity-80 disabled:opacity-40"
              style={{ background: "#FEF0F0", color: "#EB5757" }}
              onClick={handleViewDispute}
            >
              Dispute
            </button>
          )}

          {canContinueTransaction && (
            <button
              className="px-3 py-1 rounded-full text-xs font-semibold transition-opacity hover:opacity-80"
              style={{ background: "#ECFDF3", color: "#037847" }}
              onClick={handleContinueTransaction}
            >
              Continue
            </button>
          )}
        </div>
      </td>
    </tr>
  );
};

export default TransactionRow;
