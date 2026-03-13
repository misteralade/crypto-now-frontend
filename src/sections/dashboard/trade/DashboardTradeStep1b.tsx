/**
 * Step 1b — After selecting a crypto, enter amount & wallet address (Buy)
 *           or enter amount to sell (Sell)
 */
import { ArrowUpDown } from "lucide-react";
import type { SupportedCryptoOrCurrencyResponse } from "../../../types/response.payload.types.ts";
import type { TradeType } from "../../../types/trade.types.ts";
import type { TradeAdditionalInfoInterface } from "../../../types/trade.types.ts";
import { useDispatch } from "react-redux";
import { setInitiateTransactionField } from "../../../redux/transaction.slice.ts";
import TradeAdditionalInfo from "../../trade-crypto/TradeAdditionalInfo.tsx";

interface DashboardTradeStep1bProps {
  tradeType: TradeType;
  selectedToken: SupportedCryptoOrCurrencyResponse;
  availableCurrencies: SupportedCryptoOrCurrencyResponse[];
  selectedCurrency: SupportedCryptoOrCurrencyResponse | undefined;
  setSelectedCurrency: (c: SupportedCryptoOrCurrencyResponse) => void;
  amountToBuy: string | number;
  setAmountToBuy: (v: string | number) => void;
  numberOfToken: string | number;
  setNumberOfToken: (v: string | number) => void;
  handleFocusAmountToBuy: () => void;
  handleBlurAmountToBuy: () => void;
  handleFocusNumberOfToken: () => void;
  handleBlurNumberOfToken: () => void;
  orderDetails: TradeAdditionalInfoInterface[];
  isInitiatingTrade: boolean;
  onProceed: () => void;
  onBack: () => void;
}

const QUICK_AMOUNTS = [10, 50, 100, 500];

function CryptoIcon({ symbol, icon }: { symbol: string; icon?: string }) {
  if (icon) return <img src={icon} alt={symbol} className="w-5 h-5 rounded-full" />;
  const colors: Record<string, string> = {
    BTC: "#F7931A", ETH: "#627EEA", SOL: "#9945FF", USDT: "#26A17B",
  };
  return (
    <div className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[9px] font-black"
      style={{ background: colors[symbol] ?? "#948EEE" }}>
      {symbol.slice(0, 2)}
    </div>
  );
}

export default function DashboardTradeStep1b({
  tradeType, selectedToken, availableCurrencies, selectedCurrency, setSelectedCurrency,
  amountToBuy, setAmountToBuy, numberOfToken, setNumberOfToken,
  handleFocusAmountToBuy, handleBlurAmountToBuy, handleFocusNumberOfToken, handleBlurNumberOfToken,
  orderDetails, isInitiatingTrade, onProceed, onBack,
}: DashboardTradeStep1bProps) {
  const dispatch = useDispatch();
  const isBuy = tradeType === "buy";
  const accentColor = isBuy ? "#948EEE" : "#F7A600";

  const submitDisabled = !amountToBuy || !numberOfToken || isInitiatingTrade;

  const handleCurrencySelect = (c: SupportedCryptoOrCurrencyResponse) => {
    setSelectedCurrency(c);
    dispatch(setInitiateTransactionField({ field: "currencyId", value: c.id }));
  };

  // For BUY: top field = fiat amount (you pay), bottom = crypto (you receive)
  // For SELL: top field = crypto amount (you send), bottom = fiat (you receive)
  const topLabel = isBuy ? "AMOUNT IN USD ($)" : `AMOUNT IN ${selectedToken.symbol}`;
  const topValue = isBuy ? amountToBuy : numberOfToken;
  const topOnChange = isBuy ? setAmountToBuy : setNumberOfToken;
  const topOnFocus = isBuy ? handleFocusAmountToBuy : handleFocusNumberOfToken;
  const topOnBlur = isBuy ? handleBlurAmountToBuy : handleBlurNumberOfToken;

  const botLabel = isBuy ? `YOU WILL RECEIVE (${selectedToken.symbol})` : "YOU WILL RECEIVE (NGN)";
  const botValue = isBuy ? numberOfToken : amountToBuy;
  const botOnChange = isBuy ? setNumberOfToken : setAmountToBuy;
  const botOnFocus = isBuy ? handleFocusNumberOfToken : handleFocusAmountToBuy;
  const botOnBlur = isBuy ? handleBlurNumberOfToken : handleBlurAmountToBuy;

  return (
    <div className="flex flex-col gap-5">
      {/* Back + title */}
      <div className="flex items-center gap-3">
        <button type="button" onClick={onBack}
          className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
          style={{ border: "1px solid #F0F0F0" }}>
          <ArrowUpDown size={14} style={{ color: "#0E0F0C", transform: "rotate(90deg)" }} />
        </button>
        <div>
          <p className="text-sm font-extrabold" style={{ color: "#0E0F0C" }}>
            {isBuy ? "Buy" : "Sell"} {selectedToken.symbol}
          </p>
          <p className="text-[11px]" style={{ color: "#9A9A9A" }}>Enter amount & wallet</p>
        </div>
        <div className="ml-auto">
          <CryptoIcon symbol={selectedToken.symbol} icon={selectedToken.icon} />
        </div>
      </div>

      {/* Top input */}
      <div className="rounded-2xl px-4 py-3" style={{ background: "#F7F7F9", border: "1px solid #EEEEEE" }}>
        <p className="text-[10px] font-bold tracking-widest uppercase mb-2" style={{ color: "#9A9A9A" }}>
          {topLabel}
        </p>
        <div className="flex items-center gap-3">
          <input
            type="number"
            inputMode="decimal"
            value={String(topValue)}
            onChange={(e) => topOnChange(e.target.value)}
            onFocus={topOnFocus}
            onBlur={topOnBlur}
            placeholder="0"
            className="flex-1 bg-transparent text-2xl font-black outline-none"
            style={{ color: "#0E0F0C", minWidth: 0 }}
          />
          {/* Currency selector */}
          {isBuy ? (
            <select
              className="rounded-xl px-3 py-1.5 text-xs font-bold outline-none"
              style={{ background: "#FFFFFF", border: "1px solid #EEEEEE", color: "#0E0F0C" }}
              value={selectedCurrency?.id ?? ""}
              onChange={(e) => {
                const c = availableCurrencies.find((x) => x.id === e.target.value);
                if (c) handleCurrencySelect(c);
              }}
            >
              {availableCurrencies.map((c) => (
                <option key={c.id} value={c.id}>{c.symbol} {c.name}</option>
              ))}
            </select>
          ) : (
            <div className="flex items-center gap-2 rounded-xl px-3 py-1.5"
              style={{ background: "#FFFFFF", border: "1px solid #EEEEEE" }}>
              <CryptoIcon symbol={selectedToken.symbol} icon={selectedToken.icon} />
              <span className="text-xs font-bold" style={{ color: "#0E0F0C" }}>{selectedToken.symbol}</span>
            </div>
          )}
        </div>
        {/* Quick amounts for buy */}
        {isBuy && (
          <div className="flex gap-2 mt-3 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
            {QUICK_AMOUNTS.map((a) => (
              <button key={a} type="button"
                onClick={() => setAmountToBuy(String(a))}
                className="shrink-0 px-3 py-1 rounded-full text-[11px] font-bold transition-all"
                style={{
                  background: String(amountToBuy) === String(a) ? "#948EEE" : "#FFFFFF",
                  color: String(amountToBuy) === String(a) ? "#FFFFFF" : "#9A9A9A",
                  border: `1px solid ${String(amountToBuy) === String(a) ? "#948EEE" : "#EEEEEE"}`,
                }}>
                ${a}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Swap arrow */}
      <div className="flex justify-center">
        <div className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ background: accentColor, boxShadow: `0 4px 12px ${accentColor}44` }}>
          <ArrowUpDown size={18} color="white" />
        </div>
      </div>

      {/* Bottom input (read-only calculated) */}
      <div className="rounded-2xl px-4 py-3" style={{ background: "#F7F7F9", border: "1px solid #EEEEEE" }}>
        <p className="text-[10px] font-bold tracking-widest uppercase mb-2" style={{ color: "#9A9A9A" }}>
          {botLabel}
        </p>
        <div className="flex items-center gap-3">
          <input
            type="number"
            inputMode="decimal"
            value={String(botValue)}
            onChange={(e) => botOnChange(e.target.value)}
            onFocus={botOnFocus}
            onBlur={botOnBlur}
            placeholder="0"
            className="flex-1 bg-transparent text-2xl font-black outline-none"
            style={{ color: "#0E0F0C", minWidth: 0 }}
          />
          {isBuy ? (
            <div className="flex items-center gap-2 rounded-xl px-3 py-1.5"
              style={{ background: "#FFFFFF", border: "1px solid #EEEEEE" }}>
              <CryptoIcon symbol={selectedToken.symbol} icon={selectedToken.icon} />
              <span className="text-xs font-bold" style={{ color: "#0E0F0C" }}>{selectedToken.symbol}</span>
            </div>
          ) : (
            <select
              className="rounded-xl px-3 py-1.5 text-xs font-bold outline-none"
              style={{ background: "#FFFFFF", border: "1px solid #EEEEEE", color: "#0E0F0C" }}
              value={selectedCurrency?.id ?? ""}
              onChange={(e) => {
                const c = availableCurrencies.find((x) => x.id === e.target.value);
                if (c) handleCurrencySelect(c);
              }}
            >
              {availableCurrencies.map((c) => (
                <option key={c.id} value={c.id}>{c.symbol} {c.name}</option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Order details */}
      {orderDetails.length > 0 && (
        <TradeAdditionalInfo heading="Order details" additionalInfo={orderDetails} />
      )}

      {/* CTA */}
      <button
        type="button"
        disabled={submitDisabled}
        onClick={onProceed}
        className="w-full py-4 rounded-2xl text-sm font-bold transition-all"
        style={{
          background: !submitDisabled
            ? `linear-gradient(135deg, ${accentColor}, ${isBuy ? "#6B45D0" : "#E09000"})`
            : "#F0F0F0",
          color: !submitDisabled ? "#FFFFFF" : "#9A9A9A",
          boxShadow: !submitDisabled ? `0 6px 20px ${accentColor}44` : "none",
        }}
      >
        {isInitiatingTrade ? "Processing…" : "Proceed to Payment →"}
      </button>
    </div>
  );
}
