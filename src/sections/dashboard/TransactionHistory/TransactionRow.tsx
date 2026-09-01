import type { TransactionResponseEntity } from "../../../types/response.payload.types.ts";
import momentClient from "../../../lib/moment.ts";
import { getStatusColors, getStatusDisplayName, getTransactionAmountFiatNGN } from "../../../util/transaction.util.ts";
import { useNavigate } from "@tanstack/react-router";
import { ROUTES } from "../../../util/constants.util.ts";
import { formatCompact } from "../../../util/asset-precision.ts";

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
  const fiatAmt = formatCompact(getTransactionAmountFiatNGN(tx), "NGN", 0);
  const statusColors = getStatusColors(tx.status);
  const cryptoAmt = Number(tx.amountCrypto).toFixed(4).replace(/\.?0+$/, "");

  const handleView     = () => navigate({ to: `${ROUTES.TRANSACTION}/${tx.sessionId}` });
  const handleDispute  = () => tx.dispute?.id && navigate({ to: "/dispute/$id", params: { id: tx.dispute.id } });
  const handleContinue = () =>
    navigate({
      to: ROUTES.DASHBOARD,
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
                {isBuy ? "Buy" : "Sell"} {cryptoAmt} {tx.cryptocurrency.symbol}
              </p>
              <p className="text-[11px] leading-snug mt-0.5" style={{ color: "#9A9A9A" }}>
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

          {/* Row 2: NETWORK | RATE — CRYPTO amount now lives in the heading above */}
          <div className="mt-2.5 ml-14 grid grid-cols-2 gap-2">
            {[
              { label: "NETWORK", val: tx.userCryptoWallet?.network ?? tx.adminCryptoWallet?.network ?? "—" },
              { label: "RATE",    val: `₦${formatCompact(Number(tx.stableToFiatRate), "NGN", 0)}/${tx.cryptocurrency.symbol}` },
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
      className={`transition-colors hover:bg-[#F8F8FF] cursor-pointer ${!isLast ? "border-b" : ""}`}
      style={{ borderColor: "#F5F5FF" }}
      onClick={handleView}
    >
      <td className="px-5 py-4 text-[14px] font-semibold text-[#101828]">
        {tx.sessionId.slice(0, 8)}...
      </td>
      <td className="px-5 py-4 text-[14px] text-[#667085] whitespace-nowrap">
        {momentClient.formatToTransactionInitiationDate(tx.createdAt)}
      </td>
      <td className="px-5 py-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg overflow-hidden flex items-center justify-center shrink-0"
            style={{ background: isBuy ? "rgba(3,120,71,0.10)" : "rgba(148,142,238,0.12)" }}>
            <img src={tx.cryptocurrency.logoUrl} alt="" className="w-4 h-4 object-contain" />
          </div>
          <span className="text-[14px] font-semibold" style={{ color: isBuy ? "#037847" : "#0E0F0C" }}>
            {tx.type}
          </span>
        </div>
      </td>
      <td className="px-5 py-4">
        <div>
          <p className="text-[14px] font-semibold text-[#101828]">
            {Number(tx.amountCrypto).toFixed(4).replace(/\.?0+$/, "")}
          </p>
          <p className="text-[11px] text-[#9A9A9A] mt-0.5">{tx.cryptocurrency.symbol}</p>
        </div>
      </td>
      <td className="px-5 py-4 text-[14px] font-bold" style={{ color: "#101828" }}>
        ₦{fiatAmt}
      </td>
      <td className="px-5 py-4 text-[14px] text-[#667085] whitespace-nowrap">
        ₦{formatCompact(Number(tx.stableToFiatRate), "NGN", 0)}
      </td>
      <td className="px-5 py-4 text-[14px] font-medium text-[#667085] whitespace-nowrap">
        {tx.userCryptoWallet?.network ?? tx.adminCryptoWallet?.network ?? "—"}
      </td>
      <td className="px-5 py-4">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-semibold ${statusColors.background} ${statusColors.text}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${statusColors.dot}`} />
          {getStatusDisplayName(tx.status)}
        </span>
      </td>
    </tr>
  );
};

export default TransactionRow;
