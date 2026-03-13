import { type FormEvent } from "react";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import type { SupportedCryptoOrCurrencyResponse } from "../../../types/response.payload.types.ts";
import type { TradeType } from "../../../types/trade.types.ts";

interface DashboardTradeStep1Props {
  tradeType: TradeType;
  setActiveTab: (t: TradeType) => void;
  availableTokens: SupportedCryptoOrCurrencyResponse[];
  selectedToken: SupportedCryptoOrCurrencyResponse | undefined;
  setSelectedToken: (t: SupportedCryptoOrCurrencyResponse) => void;
  isInitiatingTrade: boolean;
  onProceed: () => void;
}

const QUICK_AMOUNTS_USD = [10, 50, 100, 500];

function CryptoIcon({ symbol, icon }: { symbol: string; icon?: string }) {
  if (icon) {
    return <img src={icon} alt={symbol} className="w-8 h-8 rounded-full object-cover" />;
  }
  const colors: Record<string, string> = {
    BTC: "#F7931A", ETH: "#627EEA", SOL: "#9945FF", USDT: "#26A17B",
  };
  return (
    <div
      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-black"
      style={{ background: colors[symbol] ?? "#948EEE" }}
    >
      {symbol.slice(0, 2)}
    </div>
  );
}

export default function DashboardTradeStep1({
  tradeType, setActiveTab, availableTokens, selectedToken,
  setSelectedToken, isInitiatingTrade, onProceed,
}: DashboardTradeStep1Props) {

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!selectedToken) return;
    onProceed();
  };

  const isBuy = tradeType === "buy";
  const accentColor = isBuy ? "#948EEE" : "#F7A600";
  const ctaLabel = selectedToken
    ? `${isBuy ? "Buy" : "Sell"} ${selectedToken.symbol} — Continue`
    : `Select a Crypto to Continue`;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Buy / Sell toggle */}
      <div className="flex rounded-2xl p-1 gap-1" style={{ background: "#F7F7F9" }}>
        {(["buy", "sell"] as TradeType[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setActiveTab(t)}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold capitalize transition-all"
            style={{
              background: tradeType === t ? (t === "buy" ? "#948EEE" : "#F7A600") : "transparent",
              color: tradeType === t ? "#FFFFFF" : "#9A9A9A",
              boxShadow: tradeType === t ? "0 2px 8px rgba(0,0,0,0.12)" : "none",
            }}
          >
            {t === "buy" ? "Buy Crypto" : "Sell Crypto"}
          </button>
        ))}
      </div>

      {/* Info banner */}
      <div className="flex items-start gap-3 rounded-2xl px-4 py-3"
        style={{ background: isBuy ? "#EEF0FF" : "#FFFBF0", border: `1px solid ${isBuy ? "#C7CAFF" : "#FFE4A0"}` }}>
        <span className="text-lg leading-none mt-0.5">{isBuy ? "💳" : "📤"}</span>
        <p className="text-xs leading-relaxed" style={{ color: isBuy ? "#5B5EA6" : "#A07000" }}>
          {isBuy
            ? "Pay with NGN bank transfer. We verify your payment and send crypto directly to your wallet within 5 minutes."
            : "Send crypto to your unique wallet. We auto-detect receipt and instantly send NGN to your bank. Zero action needed after sending."}
        </p>
      </div>

      {/* Crypto grid */}
      <div className="grid grid-cols-2 gap-3">
        {availableTokens.map((token) => {
          const selected = selectedToken?.id === token.id;
          const rate = isBuy ? token.buyRate : token.sellRate;
          const rateLabel = rate ? `${isBuy ? "Buy" : "Sell"}: ₦${Number(rate).toLocaleString()}` : "";
          return (
            <motion.button
              key={token.id}
              type="button"
              onClick={() => setSelectedToken(token)}
              whileTap={{ scale: 0.97 }}
              className="relative flex flex-col items-center gap-2 rounded-2xl p-4 transition-all"
              style={{
                background: selected ? (isBuy ? "#EEF0FF" : "#FFFBF0") : "#FAFAFA",
                border: selected
                  ? `2px solid ${accentColor}`
                  : "2px solid #F0F0F0",
              }}
            >
              {selected && (
                <span className="absolute top-2 right-2">
                  <CheckCircle size={14} style={{ color: accentColor }} />
                </span>
              )}
              <CryptoIcon symbol={token.symbol} icon={token.icon} />
              <div className="text-center">
                <p className="text-sm font-bold" style={{ color: "#0E0F0C" }}>{token.symbol}</p>
                <p className="text-[10px] mt-0.5" style={{ color: "#9A9A9A" }}>{token.name}</p>
                {rateLabel && (
                  <p className="text-[10px] font-semibold mt-1" style={{ color: accentColor }}>
                    {rateLabel}
                  </p>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Quick amount hints for buy */}
      {isBuy && (
        <div className="flex gap-2 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          {QUICK_AMOUNTS_USD.map((amt) => (
            <span key={amt}
              className="shrink-0 px-3 py-1.5 rounded-full text-xs font-bold"
              style={{ background: "#F7F7F9", color: "#6B6E6B", border: "1px solid #EEEEEE" }}>
              ${amt}
            </span>
          ))}
        </div>
      )}

      {/* CTA */}
      <button
        type="submit"
        disabled={!selectedToken || isInitiatingTrade}
        className="w-full py-4 rounded-2xl text-sm font-bold transition-all"
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
    </form>
  );
}
