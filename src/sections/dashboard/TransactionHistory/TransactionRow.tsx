import type { TransactionResponseEntity } from "../../../types/response.payload.types.ts";
import CopyAccountDetails from "../../trade-crypto/CopyAccountDetails.tsx";
import momentClient from "../../../lib/moment.ts";
import { getStatusColor, getStatusDot, getStatusDisplayName } from "../../../util/transaction.util.ts";
import { useNavigate } from "@tanstack/react-router";
import { ROUTES } from "../../../util/constants.util.ts";
import { convertToMillify } from "../../../util/index.util.ts";

interface TransactionRowProps {
  transaction: TransactionResponseEntity;
  isLast: boolean;
  isMobileCard?: boolean;
}

const TransactionRow = ({ transaction: tx, isLast, isMobileCard = false }: TransactionRowProps) => {
  const navigate = useNavigate();

  const isBuy = tx.type.toUpperCase() === "BUY";
  const isCompleted = tx.status === "COMPLETED";
  const isFailed = ["FAILED", "EXPIRED", "CANCELLED"].includes(tx.status);

  const badgeStyle = isCompleted
    ? { background: "#E8F8F0", color: "#037847" }
    : isFailed
    ? { background: "#FEECEC", color: "#EB5757" }
    : { background: "#F0EFFD", color: "#575AE5" };

  const badgeLabel = isCompleted
    ? "✓ Done"
    : isFailed
    ? "✗ " + getStatusDisplayName(tx.status)
    : getStatusDisplayName(tx.status);

  const canContinue =
    ["INITIATED", "AWAITING_CRYPTO", "AWAITING_PAYMENT"].includes(tx.status) &&
    momentClient.isWithinDuration(tx.createdAt, 1, "hour");
  const canDispute = tx.status === "DISPUTED";
  const fiatAmt = convertToMillify(Number(tx.amountFiat), 0);

  const handleView     = () => navigate({ to: `${ROUTES.TRANSACTION}/${tx.sessionId}` });
  const handleDispute  = () => tx.dispute?.id && navigate({ to: "/dispute/$id", params: { id: tx.dispute.id } });
  const handleContinue = () =>
    navigate({
      to: ROUTES.TRADE_CRYPTO,
      search: {
        sessionId: tx.sessionId,
        option: isBuy ? "buy" : "sell",
        currency: tx.currency || "",
        token: tx.cryptocurrencyId || "",
      } as any,
    });
  /* ══ MOBILE CARD — matches inspiration exactly ══ */
  if (isMobileCard) {
    return (
      <div>
        <button className="w-full px-4 py-3.5 text-left" onClick={handleView}>
          {/* Row 1: icon + title/ref + amount/badge */}
          <div className="flex items-center gap-3">
            {/* Colored icon block */}
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 overflow-hidden"
              style={{ background: isBuy ? "rgba(3,120,71,0.10)" : "rgba(148,142,238,0.12)" }}>
              <img src={tx.cryptocurrency.logoUrl} alt={tx.cryptocurrency.symbol}
                className="w-7 h-7 object-contain" />
            </div>

            {/* Middle */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold leading-snug" style={{ color: "#0E0F0C" }}>
                {isBuy ? "Buy" : "Sell"} {tx.cryptocurrency.name}
              </p>
              <p className="text-[11px] leading-snug mt-0.5" style={{ color: "#9A9A9A" }}>
                REF: {tx.sessionId.slice(0, 10).toUpperCase()}
                {" · "}
                {momentClient.formatToTransactionInitiationDate(tx.createdAt)}
              </p>
            </div>

            {/* Right */}
            <div className="text-right shrink-0">
              <p className="text-sm font-extrabold" style={{ color: isBuy ? "#037847" : "#0E0F0C" }}>
                ₦{fiatAmt}
              </p>
              <span className="inline-block text-[10px] font-bold px-1.5 py-0.5 rounded-full mt-0.5"
                style={badgeStyle}>
                {badgeLabel}
              </span>
            </div>
          </div>

          {/* Row 2: CRYPTO | NETWORK | RATE */}
          <div className="mt-2.5 ml-14 grid grid-cols-3 gap-2">
            {[
              { label: "CRYPTO",  val: `${Number(tx.amountCrypto).toFixed(4)} ${tx.cryptocurrency.symbol}` },
              { label: "NETWORK", val: tx.userCryptoWallet?.network ?? tx.adminCryptoWallet?.network ?? "—" },
              { label: "RATE",    val: `₦${convertToMillify(Number(tx.stableToFiatRate), 0)}/${tx.cryptocurrency.symbol}` },
            ].map(({ label, val }) => (
              <div key={label}>
                <p className="text-[9px] font-bold tracking-widest uppercase" style={{ color: "#BDBDBD" }}>{label}</p>
                <p className="text-[11px] font-semibold mt-0.5 truncate" style={{ color: "#6B6E6B" }}>{val}</p>
              </div>
            ))}
          </div>

          {/* Action buttons (only when relevant) */}
          {(canContinue || canDispute) && (
            <div className="mt-2.5 ml-14 flex gap-2">
              {canContinue && (
                <button
                  onClick={e => { e.stopPropagation(); handleContinue(); }}
                  className="px-3 py-1 rounded-full text-[11px] font-bold"
                  style={{ background: "#ECFDF3", color: "#037847" }}>
                  Continue
                </button>
              )}
              {canDispute && (
                <button
                  onClick={e => { e.stopPropagation(); handleDispute(); }}
                  className="px-3 py-1 rounded-full text-[11px] font-bold"
                  style={{ background: "#FEECEC", color: "#EB5757" }}>
                  Dispute
                </button>
              )}
            </div>
          )}
        </button>
        {!isLast && <div style={{ height: "1px", background: "#F7F7F9", margin: "0 16px" }} />}
      </div>
    );
  }

  /* ══ DESKTOP TABLE ROW ══ */
  return (
    <tr
      className={`transition-colors hover:bg-[#FAFAFA] cursor-pointer ${!isLast ? "border-b" : ""}`}
      style={{ borderColor: "#F0F0F0" }}
      onClick={handleView}
    >
      <td className="px-5 py-4">
        <CopyAccountDetails accountNumber={tx.sessionId} className="!max-w-[120px]" />
      </td>
      <td className="px-5 py-4 text-sm" style={{ color: "#6B6E6B" }}>
        {momentClient.formatToTransactionInitiationDate(tx.createdAt)}
      </td>
      <td className="px-5 py-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg overflow-hidden flex items-center justify-center shrink-0"
            style={{ background: isBuy ? "rgba(3,120,71,0.10)" : "rgba(148,142,238,0.12)" }}>
            <img src={tx.cryptocurrency.logoUrl} alt="" className="w-4 h-4 object-contain" />
          </div>
          <span className="text-sm font-semibold" style={{ color: isBuy ? "#037847" : "#0E0F0C" }}>
            {tx.type}
          </span>
        </div>
      </td>
      <td className="px-5 py-4">
        <div>
          <p className="text-sm font-semibold" style={{ color: "#0E0F0C" }}>
            {Number(tx.amountCrypto).toFixed(4)}
          </p>
          <p className="text-xs" style={{ color: "#9A9A9A" }}>{tx.cryptocurrency.symbol}</p>
        </div>
      </td>
      <td className="px-5 py-4 text-sm font-bold" style={{ color: "#0E0F0C" }}>
        ₦{fiatAmt}
      </td>
      <td className="px-5 py-4 text-sm" style={{ color: "#6B6E6B" }}>
        ₦{convertToMillify(Number(tx.stableToFiatRate), 0)}
      </td>
      <td className="px-5 py-4 text-sm font-medium" style={{ color: "#6B6E6B" }}>
        {tx.userCryptoWallet?.network ?? tx.adminCryptoWallet?.network ?? "—"}
      </td>
      <td className="px-5 py-4">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(tx.status)}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${getStatusDot(tx.status)}`} />
          {getStatusDisplayName(tx.status)}
        </span>
      </td>
    </tr>
  );
};

export default TransactionRow;
