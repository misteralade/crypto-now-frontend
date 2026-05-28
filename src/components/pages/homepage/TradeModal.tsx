import { useState, useEffect, useRef } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useTradeCryptoCurrenciesButton } from "../../../hooks/components/useTradeCryptoCurrenciesButton.ts";
import { ROUTES } from "../../../util/constants.util.ts";
import type { SupportedCryptoOrCurrencyResponse } from "../../../types/response.payload.types.ts";
import {
  TRADE_FIAT_AMOUNT_PRESETS,
  formatTradeFiatPreset,
} from "../../../constants/tradeAmounts.ts";

const QUICK_AMOUNTS_USD = TRADE_FIAT_AMOUNT_PRESETS.usd;
const QUICK_AMOUNTS_NGN = TRADE_FIAT_AMOUNT_PRESETS.ngn;

interface PickerProps {
  items: SupportedCryptoOrCurrencyResponse[] | undefined;
  selectedId: string;
  onSelect: (id: string) => void;
  rateKey: "buyRate" | "sellRate";
  showRate?: boolean;
}

const CurrencyPicker = ({ items, selectedId, onSelect, rateKey, showRate = false }: PickerProps) => {
  const formatRate = (r: string) => {
    const n = parseFloat(r);
    if (isNaN(n)) return r;
    if (n >= 1_000_000) return `₦${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `₦${(n / 1_000).toFixed(0)}K`;
    return `₦${n.toFixed(0)}`;
  };

  if (!items || items.length === 0) {
    return (
      <div className="flex gap-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex-shrink-0 w-[72px] h-[76px] rounded-xl bg-gray-100 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
      {items.map((item) => {
        const isSelected = item.id === selectedId;
        return (
          <button
            key={item.id}
            onClick={() => onSelect(item.id)}
            className={`flex-shrink-0 flex flex-col items-center justify-between w-[72px] py-2.5 px-1 rounded-xl border-2 transition-all cursor-pointer gap-1 ${
              isSelected
                ? "border-[#948EEE] bg-[#948EEE]/10"
                : "border-gray-200 bg-white hover:border-[#948EEE]/50"
            }`}
          >
            <div className="w-8 h-8 flex items-center justify-center">
              {item.logoUrl ? (
                <img src={item.logoUrl} alt={item.code} className="w-7 h-7 object-contain" />
              ) : (
                <span className="text-lg font-bold text-gray-400">
                  {item.symbol?.charAt(0) || item.code?.charAt(0) || "?"}
                </span>
              )}
            </div>
            <span className={`text-[11px] font-bold leading-none ${isSelected ? "text-[#948EEE]" : "text-[#0E0F0C]"}`}>
              {item.code || item.symbol}
            </span>
            {showRate && <span className="text-[10px] text-gray-400 leading-none">{formatRate(item[rateKey])}</span>}
          </button>
        );
      })}
    </div>
  );
};

interface TradeModalProps {
  onClose: () => void;
}

const TradeModal = ({ onClose }: TradeModalProps) => {
  const navigate = useNavigate();
  const overlayRef = useRef<HTMLDivElement>(null);
  const {
    supportedCryptoCurrencies,
    supportedCurrencies,
    selectedCrypto,
    supportedCurrency,
    setSelectedCrypto,
    setSupportedCurrency,
  } = useTradeCryptoCurrenciesButton();

  // SELL is first/default
  const [activeTab, setActiveTab] = useState<"SELL" | "BUY">("SELL");
  const [amount, setAmount] = useState<string>("");

  const selectedCryptoObj = supportedCryptoCurrencies?.find((c) => c.id === selectedCrypto);
  const selectedCurrencyObj = supportedCurrencies?.find((c) => c.id === supportedCurrency);

  // For SELL: user sends crypto, receives fiat
  // For BUY:  user sends fiat ($), receives crypto
  const isSell = activeTab === "SELL";

  const sendLabel = isSell ? "You Will Send" : "You Will Send";
  const receiveLabel = isSell ? "You Will Receive" : "You Will Receive";

  const sendPickerLabel = isSell ? "Crypto to send" : "Currency to spend";
  const receivePickerLabel = isSell ? "Currency to receive" : "Token to receive";

  const inputSymbol = isSell
    ? (selectedCryptoObj?.symbol || selectedCryptoObj?.code || "")
    : (selectedCurrencyObj?.symbol || selectedCurrencyObj?.code || "$");

  const inputPlaceholder = isSell ? "0.00000" : "0.00";

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // Reset amount when switching tabs
  useEffect(() => {
    setAmount("");
  }, [activeTab]);

  const handleStartTrading = () => {
    navigate({
      to: `${ROUTES.DASHBOARD_TRADE}?option=${activeTab.toLowerCase()}&currency=${supportedCurrency}&token=${selectedCrypto}&amount=${amount}`,
    });
    onClose();
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(14,15,12,0.55)", backdropFilter: "blur(6px)" }}
    >
      <div
        className="relative bg-white rounded-3xl w-full max-w-[360px] p-5 flex flex-col gap-4 shadow-2xl"
        style={{ boxShadow: "0 24px 64px rgba(148,142,238,0.22), 0 4px 16px rgba(0,0,0,0.12)" }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer border-none text-gray-500 text-lg"
        >
          ✕
        </button>

        {/* Tabs — SELL first, BUY second */}
        <div className="flex border-b border-gray-100">
          {(["SELL", "BUY"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 text-sm font-semibold transition-all cursor-pointer border-b-2 -mb-px ${
                activeTab === tab
                  ? "border-[#948EEE] text-[#0E0F0C]"
                  : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              {tab === "SELL" ? "✦ Sell Crypto" : "🟰 Buy Crypto"}
            </button>
          ))}
        </div>

        {/* You Will Send picker */}
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-gray-500 tracking-wide">{sendPickerLabel}</span>
          <CurrencyPicker
            items={isSell ? supportedCryptoCurrencies : supportedCurrencies}
            selectedId={isSell ? selectedCrypto : supportedCurrency}
            onSelect={isSell ? setSelectedCrypto : setSupportedCurrency}
            rateKey="sellRate"
            showRate={false}
          />
        </div>

        {/* You Will Receive picker */}
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-gray-500 tracking-wide">{receivePickerLabel}</span>
          <CurrencyPicker
            items={isSell ? supportedCurrencies : supportedCryptoCurrencies}
            selectedId={isSell ? supportedCurrency : selectedCrypto}
            onSelect={isSell ? setSupportedCurrency : setSelectedCrypto}
            rateKey={isSell ? "sellRate" : "buyRate"}
            showRate={isSell}
          />
        </div>

        {/* Amount input */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-500 tracking-wide">
            {sendLabel}
          </label>
          <div className="flex items-center gap-2 border-2 border-gray-200 rounded-xl px-3 py-2 bg-gray-50 focus-within:border-[#948EEE] transition-colors">
            <span className="text-gray-500 text-sm font-semibold shrink-0">{inputSymbol}</span>
            <input
              type="text"
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={inputPlaceholder}
              className="flex-1 bg-transparent outline-none text-[#0E0F0C] font-semibold text-lg placeholder:text-gray-300"
              autoFocus
            />
          </div>

          {/* Quick chips — only shown for BUY (fiat amounts) */}
          {!isSell && (
            <div className="flex gap-2">
              {(selectedCurrencyObj?.code === "NGN" ? QUICK_AMOUNTS_NGN : QUICK_AMOUNTS_USD).map((chip) => {
                return (
                  <button
                    key={chip}
                    onClick={() => setAmount(String(chip))}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                      amount === String(chip)
                        ? "bg-[#948EEE] border-[#948EEE] text-white"
                        : "bg-white border-gray-200 text-gray-500 hover:border-[#948EEE] hover:text-[#948EEE]"
                    }`}
                  >
                    {formatTradeFiatPreset(
                      chip,
                      selectedCurrencyObj?.code === "USD" ? "USD" : "NGN",
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Receive preview label */}
          <p className="text-xs text-gray-400 mt-0.5">
            {receiveLabel}:{" "}
            <span className="font-semibold text-[#948EEE]">
              {isSell
                ? (selectedCurrencyObj?.code || "NGN")
                : (selectedCryptoObj?.code || "crypto")}
            </span>
          </p>
        </div>

        {/* CTA */}
        <button
          onClick={handleStartTrading}
          className="w-full py-3 rounded-2xl font-bold text-base text-white cursor-pointer border-none transition-opacity hover:opacity-90"
          style={{ background: "#948EEE" }}
        >
          {isSell ? "Sell Now" : "Buy Now"}
        </button>

        {/* Footer */}
        <div className="border-t border-gray-100 pt-3 flex items-center justify-center gap-3 text-xs text-gray-400">
          <span>Unlock more</span>
          <span className="text-gray-300">•</span>
          <button
            onClick={() => { navigate({ to: ROUTES.SIGNUP }); onClose(); }}
            className="text-[#948EEE] font-semibold hover:underline cursor-pointer bg-transparent border-none p-0"
          >
            Sign up free
          </button>
          <span className="text-gray-300">•</span>
          <button
            onClick={() => { navigate({ to: ROUTES.SIGNIN }); onClose(); }}
            className="text-[#0E0F0C] font-semibold hover:underline cursor-pointer bg-transparent border-none p-0"
          >
            Log in
          </button>
        </div>
      </div>
    </div>
  );
};

export default TradeModal;
