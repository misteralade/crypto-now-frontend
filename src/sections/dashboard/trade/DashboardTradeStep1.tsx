import { CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import type { SupportedCryptoOrCurrencyResponse } from "../../../types/response.payload.types.ts";
import type { TradeType } from "../../../types/trade.types.ts";

interface DashboardTradeStep1Props {
  tradeType: TradeType;
  availableTokens: SupportedCryptoOrCurrencyResponse[];
  selectedToken: SupportedCryptoOrCurrencyResponse | undefined;
  setSelectedToken: (t: SupportedCryptoOrCurrencyResponse) => void;
  isInitiatingTrade: boolean;
  onProceed: () => void;
}

function CryptoIcon({ symbol, icon }: { symbol: string; icon?: string }) {
  if (icon) {
    return <img src={icon} alt={symbol} className="w-10 h-10 rounded-full object-cover" />;
  }
  const colors: Record<string, string> = {
    BTC: "#F7931A", ETH: "#627EEA", SOL: "#9945FF", USDT: "#26A17B",
  };
  return (
    <div
      className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-black"
      style={{ background: colors[symbol] ?? "#948EEE" }}
    >
      {symbol.slice(0, 2)}
    </div>
  );
}

export default function DashboardTradeStep1({
  tradeType, availableTokens, selectedToken, setSelectedToken, isInitiatingTrade, onProceed,
}: DashboardTradeStep1Props) {
  const isBuy = tradeType === "buy";
  const accentColor = isBuy ? "#948EEE" : "#F7A600";

  const ctaLabel = selectedToken
    ? `${isBuy ? "Buy" : "Sell"} ${selectedToken.symbol} — Continue`
    : "Select a Crypto to Continue";

  return (
    <div className="flex flex-col gap-4">
      {/* Page header */}
      <div className="mb-1">
        <h2 className="text-lg font-extrabold" style={{ color: "#0E0F0C" }}>
          {isBuy ? "Buy Crypto" : "Sell Crypto"}
        </h2>
        <p className="text-xs mt-0.5" style={{ color: "#9A9A9A" }}>
          {isBuy ? "Choose what to buy" : "Choose what to sell"}
        </p>
      </div>

      {/* Info banner */}
      <div
        className="flex items-start gap-3 rounded-2xl px-4 py-3"
        style={{
          background: isBuy ? "#EEF0FF" : "#FFFBF0",
          border: `1px solid ${isBuy ? "#C7CAFF" : "#FFE4A0"}`,
        }}
      >
        <span className="text-base leading-none mt-0.5">{isBuy ? "💳" : "📤"}</span>
        <p className="text-xs leading-relaxed" style={{ color: isBuy ? "#5B5EA6" : "#A07000" }}>
          {isBuy
            ? "Pay with NGN bank transfer. We verify your payment and send crypto directly to your wallet within 5 minutes."
            : "Send crypto to your unique wallet. We auto-detect receipt and instantly send NGN to your bank. Zero action needed after sending."}
        </p>
      </div>

      {/* Crypto grid — 2×2 */}
      <div className="grid grid-cols-2 gap-3">
        {availableTokens.map((token) => {
          const selected = selectedToken?.id === token.id;
          const rate = isBuy ? token.buyRate : token.sellRate;
          const rateLabel = rate
            ? `${isBuy ? "Buy" : "Sell"}: ₦${Number(rate).toLocaleString()}`
            : "";
          return (
            <motion.button
              key={token.id}
              type="button"
              onClick={() => setSelectedToken(token)}
              whileTap={{ scale: 0.97 }}
              className="relative flex flex-col items-center gap-2.5 rounded-2xl p-4 transition-all"
              style={{
                background: selected ? (isBuy ? "#EEF0FF" : "#FFFBF0") : "#FAFAFA",
                border: selected ? `2px solid ${accentColor}` : "2px solid #F0F0F0",
              }}
            >
              {selected && (
                <span className="absolute top-2.5 right-2.5">
                  <CheckCircle size={15} style={{ color: accentColor }} />
                </span>
              )}
              <CryptoIcon symbol={token.symbol} icon={token.logoUrl} />
              <div className="text-center">
                <p className="text-sm font-extrabold" style={{ color: "#0E0F0C" }}>{token.symbol}</p>
                <p className="text-[10px] mt-0.5" style={{ color: "#9A9A9A" }}>{token.name}</p>
                {rateLabel && (
                  <p className="text-[10px] font-bold mt-1" style={{ color: accentColor }}>
                    {rateLabel}
                  </p>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* CTA */}
      <button
        type="button"
        disabled={!selectedToken || isInitiatingTrade}
        onClick={() => selectedToken && onProceed()}
        className="w-full py-4 rounded-2xl text-sm font-bold transition-all mt-1"
        style={{
          background: selectedToken
            ? `linear-gradient(135deg, ${accentColor}, ${isBuy ? "#6B45D0" : "#E09000"})`
            : "#F0F0F0",
          color: selectedToken ? "#FFFFFF" : "#9A9A9A",
          boxShadow: selectedToken ? `0 6px 20px ${accentColor}44` : "none",
        }}
      >
        {isInitiatingTrade ? "Processing…" : ctaLabel}
      </button>
    </div>
  );
}
