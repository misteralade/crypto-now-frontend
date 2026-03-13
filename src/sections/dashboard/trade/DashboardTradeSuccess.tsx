/**
 * Step 4 — Success screen
 * Buy success: "Receipt Received!" — crypto on the way
 * Sell success: "NGN Credited!" — bank credited
 */
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { ROUTES } from "../../../util/constants.util.ts";
import type { TradeType } from "../../../types/trade.types.ts";

interface DashboardTradeSuccessProps {
  tradeType: TradeType;
  selectedTokenSymbol?: string;
  amount?: number | string;
  onReset: () => void;
}

export default function DashboardTradeSuccess({
  tradeType, selectedTokenSymbol, amount, onReset,
}: DashboardTradeSuccessProps) {
  const isBuy = tradeType === "buy";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center gap-6 py-6"
    >
      {/* Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", delay: 0.15 }}
        className="w-20 h-20 rounded-full flex items-center justify-center"
        style={{
          background: isBuy ? "linear-gradient(135deg,#948EEE,#6B45D0)" : "linear-gradient(135deg,#037847,#04A860)",
          boxShadow: isBuy ? "0 12px 32px #948EEE55" : "0 12px 32px #03784755",
        }}
      >
        {isBuy
          ? <span className="text-3xl">🚀</span>
          : <CheckCircle size={36} color="white" strokeWidth={2.5} />
        }
      </motion.div>

      {/* Title */}
      <div className="text-center">
        <h2 className="text-2xl font-black" style={{ color: "#0E0F0C", fontFamily: "'DM Sans',sans-serif", letterSpacing: "-0.02em" }}>
          {isBuy ? "Receipt Received!" : "NGN Credited!"}
        </h2>
        <p className="text-sm mt-1" style={{ color: "#9A9A9A" }}>
          {isBuy
            ? "Your payment proof has been submitted. We're verifying it right now."
            : "Crypto received & auto-converted. Your bank has been credited."}
        </p>
      </div>

      {/* Info box */}
      <div className="w-full rounded-2xl p-4"
        style={{ background: isBuy ? "#EEF0FF" : "#E8F8F0", border: `1px solid ${isBuy ? "#948EEE44" : "#03784733"}` }}>
        <div className="flex items-center gap-3">
          <span className="text-2xl">⏱️</span>
          <div>
            <p className="text-sm font-bold" style={{ color: isBuy ? "#5B5EA6" : "#037847" }}>
              {isBuy ? `Crypto arrives in ~5 minutes` : "Transaction Complete"}
            </p>
            <p className="text-xs mt-0.5" style={{ color: isBuy ? "#5B5EA6" : "#037847" }}>
              {isBuy
                ? `${selectedTokenSymbol ?? "Crypto"} will be sent directly to your wallet once payment is confirmed.`
                : "Your bank has been credited with the NGN equivalent."}
            </p>
          </div>
        </div>
      </div>

      {/* Next steps */}
      <div className="w-full flex flex-col gap-2">
        {isBuy ? (
          <>
            <div className="flex items-center gap-3 rounded-2xl p-4"
              style={{ background: "#FAFAFA", border: "1px solid #F0F0F0" }}>
              <span className="text-xl">👛</span>
              <div>
                <p className="text-sm font-semibold" style={{ color: "#0E0F0C" }}>Check Your Wallet</p>
                <p className="text-xs" style={{ color: "#9A9A9A" }}>
                  Open your wallet app and check your {selectedTokenSymbol} balance. It should appear within 5 minutes.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-2xl p-4"
              style={{ background: "#FAFAFA", border: "1px solid #F0F0F0" }}>
              <span className="text-xl">📊</span>
              <div>
                <p className="text-sm font-semibold" style={{ color: "#0E0F0C" }}>Track on Dashboard</p>
                <p className="text-xs" style={{ color: "#9A9A9A" }}>
                  Check the History tab for live order status and confirmation.
                </p>
              </div>
            </div>
          </>
        ) : (
          <div className="w-full rounded-2xl p-4" style={{ background: "#FAFAFA", border: "1px solid #F0F0F0" }}>
            {[
              { label: "Crypto Received", val: `${amount ?? ""} ${selectedTokenSymbol ?? ""}` },
              { label: "Status", val: "✓ Completed" },
            ].map(({ label, val }) => (
              <div key={label} className="flex justify-between py-2" style={{ borderBottom: "1px solid #F7F7F9" }}>
                <span className="text-xs" style={{ color: "#9A9A9A" }}>{label}</span>
                <span className="text-sm font-semibold" style={{ color: "#037847" }}>{val}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="w-full flex flex-col gap-3">
        <Link to={ROUTES.DASHBOARD}
          className="w-full py-4 rounded-2xl text-sm font-bold text-center flex items-center justify-center gap-2"
          style={{ background: isBuy ? "linear-gradient(135deg,#948EEE,#6B45D0)" : "linear-gradient(135deg,#037847,#04A860)", color: "#FFFFFF" }}>
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
