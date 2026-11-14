import { Check, Copy, ExternalLink, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { ROUTES } from "../../../util/constants.util.ts";
import { formatCompact, formatForDisplayLocalized } from "../../../util/asset-precision.ts";
import { getStatusDisplayName, getTransactionAmountFiatNGN } from "../../../util/transaction.util.ts";
import type { SearchTransactionsResponse } from "../../../types/response.payload.types.ts";

interface TransactionDisputeInfoProps {
  transaction: SearchTransactionsResponse | null;
  copiedField: string | null;
  onCopy: (value: string, field: string) => void;
}

const TransactionDisputeInfo = ({
  transaction,
  copiedField,
  onCopy,
}: TransactionDisputeInfoProps) => {
  if (!transaction) {
    return (
      <div
        className="rounded-3xl p-5 sm:p-6"
        style={{ background: "#FFFFFF", border: "1px solid #F0F0F0" }}
      >
        <p
          className="text-[10px] font-bold tracking-widest uppercase mb-3"
          style={{ color: "#9A9A9A" }}
        >
          Linked Transaction
        </p>
        <p className="text-sm" style={{ color: "#6B6E6B" }}>
          No transaction linked to this dispute.
        </p>
      </div>
    );
  }

  const isBuy = transaction.type?.toUpperCase() === "BUY";
  const cryptoSymbol = transaction.cryptocurrency?.symbol || "Crypto";
  const cryptoAmount = Number(transaction.amountCrypto || 0);

  const amountFiatNGN = getTransactionAmountFiatNGN({
    amountFiat: transaction.amountFiat,
    currency: transaction.currency,
    stableToFiatRate: transaction.stableToFiatRate,
  });

  const rateSnapshot = (transaction.rateSnapshot ?? null) as Record<string, unknown> | null;
  const snapshotPlatformRate = Number(rateSnapshot?.platformRate ?? 0);
  const platformRate =
    snapshotPlatformRate > 0
      ? snapshotPlatformRate
      : Number(transaction.stableToFiatRate ?? 0);

  const statusLabel = getStatusDisplayName(transaction.status);

  return (
    <div
      className="rounded-3xl p-5 sm:p-6"
      style={{ background: "#FFFFFF", border: "1px solid #F0F0F0" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-5">
        <div>
          <p
            className="text-[10px] font-bold tracking-widest uppercase"
            style={{ color: "#9A9A9A" }}
          >
            Linked Transaction
          </p>
          <p className="text-xs mt-0.5" style={{ color: "#6B6E6B" }}>
            Reference for this case
          </p>
        </div>

        <Link
          to={ROUTES.TRANSACTION_DETAILS}
          params={{ id: transaction.sessionId }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all hover:bg-gray-50 active:scale-95"
          style={{
            background: "#F7F7F9",
            border: "1px solid #EEEEEE",
            color: "#0E0F0C",
          }}
        >
          <span>View order</span>
          <ExternalLink size={12} style={{ color: "#9A9A9A" }} />
        </Link>
      </div>

      {/* Main Amounts Card */}
      <div
        className="rounded-2xl p-4 mb-4"
        style={{ background: "#F7F7F9", border: "1px solid #EEEEEE" }}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <span
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold mb-2"
              style={{
                background: isBuy ? "#E8F8F0" : "#F0EFFD",
                color: isBuy ? "#037847" : "#575AE5",
              }}
            >
              {isBuy ? (
                <ArrowDownLeft size={12} strokeWidth={2.5} />
              ) : (
                <ArrowUpRight size={12} strokeWidth={2.5} />
              )}
              {isBuy ? "Buy Crypto" : "Sell Crypto"}
            </span>

            <div className="flex items-baseline gap-2 flex-wrap">
              <h3
                className="text-lg sm:text-xl font-extrabold"
                style={{ color: "#0E0F0C", letterSpacing: "-0.02em" }}
              >
                ₦{formatCompact(amountFiatNGN, "NGN", 2)}
              </h3>
              <span className="text-xs font-semibold" style={{ color: "#6B6E6B" }}>
                ≈ {cryptoAmount > 0 ? cryptoAmount : "0"} {cryptoSymbol}
              </span>
            </div>
          </div>

          <div
            className="shrink-0 px-2.5 py-1 rounded-full text-[11px] font-semibold"
            style={{
              background: "#FFFFFF",
              border: "1px solid #EEEEEE",
              color: "#0E0F0C",
            }}
          >
            {statusLabel}
          </div>
        </div>

        {platformRate > 0 && (
          <div
            className="mt-3 pt-3 flex items-center justify-between text-xs"
            style={{ borderTop: "1px solid #EAEAEA" }}
          >
            <span style={{ color: "#9A9A9A" }}>Exchange rate</span>
            <span className="font-semibold" style={{ color: "#0E0F0C" }}>
              ₦{formatForDisplayLocalized(platformRate, "NGN")} / {cryptoSymbol}
            </span>
          </div>
        )}
      </div>

      {/* Session ID Copy Row */}
      <div>
        <p
          className="text-[10px] font-bold tracking-widest uppercase mb-1.5"
          style={{ color: "#9A9A9A" }}
        >
          Session ID
        </p>
        <div
          className="flex items-center gap-2 px-3 py-2.5 rounded-2xl"
          style={{ background: "#F7F7F9", border: "1px solid #EEEEEE" }}
        >
          <p
            className="flex-1 text-xs font-mono break-all leading-relaxed"
            style={{ color: "#0E0F0C" }}
          >
            {transaction.sessionId}
          </p>
          <button
            type="button"
            onClick={() => onCopy(transaction.sessionId, "sessionId")}
            aria-label="Copy session ID"
            className="shrink-0 w-7 h-7 rounded-xl flex items-center justify-center transition-all active:scale-95"
            style={{
              background: copiedField === "sessionId" ? "#E8F8F0" : "#EEEEEE",
              color: copiedField === "sessionId" ? "#037847" : "#6B6E6B",
            }}
          >
            {copiedField === "sessionId" ? <Check size={12} /> : <Copy size={12} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionDisputeInfo;
