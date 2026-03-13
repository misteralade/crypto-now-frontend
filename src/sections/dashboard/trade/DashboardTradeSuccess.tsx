/**
 * Success screen
 * BUY  → "Order Submitted! 🚀 / Receipt Received!" (frame 139)
 * SELL → "NGN Credited!" large green check (frames 180/183)
 */
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { ROUTES } from "../../../util/constants.util.ts";
import type { TradeType } from "../../../types/trade.types.ts";

interface DashboardTradeSuccessProps {
  tradeType: TradeType;
  selectedTokenSymbol?: string;
  amount?: number | string;
  ngnAmount?: number | string;
  bankName?: string;
  accountNumber?: string;
  transactionRef?: string;
  onReset: () => void;
}

export default function DashboardTradeSuccess({
  tradeType, selectedTokenSymbol, amount, ngnAmount,
  bankName, accountNumber, transactionRef, onReset,
}: DashboardTradeSuccessProps) {
  const isBuy = tradeType === "buy";

  /* ── BUY success ── */
  if (isBuy) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-6 py-6"
      >
        {/* Rocket circle */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.12 }}
          className="w-24 h-24 rounded-full flex items-center justify-center text-5xl"
          style={{
            background: "linear-gradient(135deg,#948EEE,#6B45D0)",
            boxShadow: "0 16px 40px #948EEE55",
          }}
        >
          🚀
        </motion.div>

        {/* Title */}
        <div className="text-center">
          <h2 className="text-xl font-extrabold" style={{ color: "#0E0F0C" }}>
            Order Submitted!
          </h2>
          <p className="text-sm font-semibold mt-0.5" style={{ color: "#948EEE" }}>
            Receipt Received!
          </p>
          <p className="text-xs mt-2 leading-relaxed px-4" style={{ color: "#9A9A9A" }}>
            Your payment proof has been submitted. We're verifying it right now.
          </p>
        </div>

        {/* Info box */}
        <div className="w-full rounded-2xl px-4 py-4"
          style={{ background: "#EEF0FF", border: "1px solid #C7CAFF" }}>
          <div className="flex items-center gap-3">
            <span className="text-2xl">⏱️</span>
            <div>
              <p className="text-sm font-bold" style={{ color: "#5B5EA6" }}>
                Crypto arrives in ~5 minutes
              </p>
              <p className="text-xs mt-0.5" style={{ color: "#8080C0" }}>
                {selectedTokenSymbol ?? "Crypto"} will be sent to your wallet once payment is confirmed.
              </p>
            </div>
          </div>
        </div>

        {/* Action rows */}
        <div className="w-full flex flex-col gap-3">
          <div className="flex items-center gap-3 rounded-2xl p-4"
            style={{ background: "#FAFAFA", border: "1px solid #F0F0F0" }}>
            <span className="text-xl">👛</span>
            <div>
              <p className="text-sm font-bold" style={{ color: "#0E0F0C" }}>Check Your Wallet</p>
              <p className="text-xs" style={{ color: "#9A9A9A" }}>
                Open your wallet app. {selectedTokenSymbol ?? "Crypto"} should appear within 5 minutes.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl p-4"
            style={{ background: "#FAFAFA", border: "1px solid #F0F0F0" }}>
            <span className="text-xl">📊</span>
            <div>
              <p className="text-sm font-bold" style={{ color: "#0E0F0C" }}>Track on Dashboard</p>
              <p className="text-xs" style={{ color: "#9A9A9A" }}>
                Check the History tab for live order status.
              </p>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="w-full flex flex-col gap-3">
          <Link to={ROUTES.DASHBOARD}
            className="w-full py-4 rounded-2xl text-sm font-bold text-center flex items-center justify-center gap-2"
            style={{ background: "linear-gradient(135deg,#948EEE,#6B45D0)", color: "#FFFFFF", boxShadow: "0 6px 20px #948EEE44" }}>
            <ArrowLeft size={16} /> Back to Dashboard
          </Link>
          <button type="button" onClick={onReset}
            className="w-full py-3 rounded-2xl text-sm font-bold"
            style={{ background: "#F7F7F9", color: "#6B6E6B", border: "1px solid #EEEEEE" }}>
            Start New Trade
          </button>
        </div>
      </motion.div>
    );
  }

  /* ── SELL success ── */
  const tableRows = [
    { label: "Crypto Received", value: `${amount ?? "—"} ${selectedTokenSymbol ?? ""}` },
    ngnAmount ? { label: "NGN Credited", value: `₦${Number(ngnAmount).toLocaleString()}` } : null,
    bankName ? { label: "To Bank", value: bankName } : null,
    accountNumber ? { label: "Account", value: accountNumber } : null,
    { label: "Status", value: "✓ Completed" },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center gap-6 py-6"
    >
      {/* Large green checkmark */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", delay: 0.12 }}
        className="w-24 h-24 rounded-full flex items-center justify-center"
        style={{
          background: "linear-gradient(135deg,#037847,#04A860)",
          boxShadow: "0 16px 40px #03784755",
        }}
      >
        <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
          <path d="M8 22L18 32L36 12" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.div>

      {/* Title */}
      <div className="text-center">
        <h2 className="text-xl font-extrabold" style={{ color: "#0E0F0C" }}>NGN Credited!</h2>
        <p className="text-xs mt-2 leading-relaxed px-4" style={{ color: "#9A9A9A" }}>
          Crypto received &amp; auto-converted. Your bank has been credited.
        </p>
      </div>

      {/* Details table */}
      <div className="w-full rounded-2xl overflow-hidden" style={{ border: "1px solid #EEEEEE" }}>
        {tableRows.map(({ label, value }, i) => (
          <div key={i} className="flex items-center justify-between px-4 py-3"
            style={{ borderBottom: i < tableRows.length - 1 ? "1px solid #F7F7F9" : "none" }}>
            <span className="text-xs" style={{ color: "#9A9A9A" }}>{label}</span>
            <span className="text-xs font-semibold" style={{ color: label === "Status" ? "#037847" : "#0E0F0C" }}>
              {value}
            </span>
          </div>
        ))}
      </div>

      {/* TX ref */}
      {transactionRef && (
        <p className="text-[10px] font-mono tracking-wider" style={{ color: "#BDBDBD" }}>
          TX REF: {transactionRef.toUpperCase().slice(0, 20)}
        </p>
      )}

      {/* Buttons */}
      <div className="w-full flex flex-col gap-3">
        <Link to={ROUTES.DASHBOARD}
          className="w-full py-4 rounded-2xl text-sm font-bold text-center flex items-center justify-center gap-2"
          style={{ background: "linear-gradient(135deg,#037847,#04A860)", color: "#FFFFFF", boxShadow: "0 6px 20px #03784744" }}>
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
        <button type="button" onClick={onReset}
          className="w-full py-3 rounded-2xl text-sm font-bold"
          style={{ background: "#F7F7F9", color: "#6B6E6B", border: "1px solid #EEEEEE" }}>
          Start New Trade
        </button>
      </div>
    </motion.div>
  );
}
