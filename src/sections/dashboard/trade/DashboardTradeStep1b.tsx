/**
 * Step 1b — BUY ONLY: Enter amount, wallet address, and select network
 * Matches frames 105 / 113 / 117
 */
import { useState, useEffect } from "react";
import { ArrowLeft, ChevronDown, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { SupportedCryptoOrCurrencyResponse } from "../../../types/response.payload.types.ts";
import type { TradeType, TradeAdditionalInfoInterface } from "../../../types/trade.types.ts";
import { useDispatch } from "react-redux";
import { setInitiateTransactionField } from "../../../redux/transaction.slice.ts";
import { setSelectedCryptoId } from "../../../redux/crypto.slice.ts";
import { cryptoNetworkTypes } from "../../../util/constants.util.ts";

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

// NGN amounts matching realistic minimums (min ~2 USDT ≈ ₦2,800+)
const QUICK_AMOUNTS = [5000, 10000, 20000, 50000];

// Network human labels
const NETWORK_LABELS: Record<string, string> = {
  TRC20: "TRC20 (Tron)",
  ERC20: "ERC20 (Ethereum)",
  BEP20: "BEP20 (BSC)",
  BTC: "Bitcoin (BTC)",
  SOLANA: "Solana (SOL)",
};

function CryptoIcon({ symbol, icon }: { symbol: string; icon?: string }) {
  if (icon) return <img src={icon} alt={symbol} className="w-6 h-6 rounded-full object-cover" />;
  const colors: Record<string, string> = {
    BTC: "#F7931A", ETH: "#627EEA", SOL: "#9945FF", USDT: "#26A17B",
  };
  return (
    <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[9px] font-black"
      style={{ background: colors[symbol] ?? "#948EEE" }}>
      {symbol.slice(0, 2)}
    </div>
  );
}

export default function DashboardTradeStep1b({
  selectedToken,
  availableCurrencies, selectedCurrency, setSelectedCurrency,
  amountToBuy, setAmountToBuy,
  handleFocusAmountToBuy, handleBlurAmountToBuy,
  isInitiatingTrade, onProceed, onBack,
}: DashboardTradeStep1bProps) {
  const dispatch = useDispatch();
  const accentColor = "#948EEE";

  const [walletAddress, setWalletAddress] = useState("");
  const [selectedNetwork, setSelectedNetwork] = useState<string>(cryptoNetworkTypes[0] ?? "TRC20");
  const [networkDropdownOpen, setNetworkDropdownOpen] = useState(false);

  // Sync token + network into redux so initiateTransaction has all required fields
  useEffect(() => {
    dispatch(setSelectedCryptoId(selectedToken.id));
    dispatch(setInitiateTransactionField({ field: "tokenId", value: selectedToken.id }));
    dispatch(setInitiateTransactionField({ field: "network", value: selectedNetwork }));

    // Default to NGN currency if available
    const ngnCurrency = availableCurrencies.find(c => c.code === "NGN" || c.symbol === "NGN");
    if (ngnCurrency && !selectedCurrency) {
      setSelectedCurrency(ngnCurrency);
      dispatch(setInitiateTransactionField({ field: "currencyId", value: ngnCurrency.id }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedToken.id]);

  useEffect(() => {
    if (selectedCurrency?.id) {
      dispatch(setInitiateTransactionField({ field: "currencyId", value: selectedCurrency.id }));
    }
  }, [selectedCurrency?.id]);

  const handleCurrencySelect = (c: SupportedCryptoOrCurrencyResponse) => {
    setSelectedCurrency(c);
    dispatch(setInitiateTransactionField({ field: "currencyId", value: c.id }));
  };

  // Store wallet address + network in redux so the hook can pick them up
  const handleWalletChange = (val: string) => {
    setWalletAddress(val);
    dispatch(setInitiateTransactionField({ field: "walletAddress", value: val }));
  };

  const handleNetworkSelect = (net: string) => {
    setSelectedNetwork(net);
    setNetworkDropdownOpen(false);
    dispatch(setInitiateTransactionField({ field: "network", value: net }));
  };

  const amountNum = Number(amountToBuy);
  const submitDisabled = !amountToBuy || amountNum <= 0 || !walletAddress.trim() || isInitiatingTrade;

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button type="button" onClick={onBack}
          className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
          style={{ border: "1px solid #E8E8E8", background: "#FAFAFA" }}>
          <ArrowLeft size={15} style={{ color: "#0E0F0C" }} />
        </button>
        <div className="flex-1">
          <p className="text-base font-extrabold" style={{ color: "#0E0F0C" }}>
            Buy {selectedToken.symbol}
          </p>
          <p className="text-[11px]" style={{ color: "#9A9A9A" }}>Enter amount &amp; wallet</p>
        </div>
        <CryptoIcon symbol={selectedToken.symbol} icon={selectedToken.icon} />
      </div>

      {/* Amount input */}
      <div className="rounded-2xl px-4 pt-3 pb-4"
        style={{ background: "#F7F7F9", border: "1px solid #EEEEEE" }}>
        <p className="text-[10px] font-bold tracking-widest uppercase mb-2" style={{ color: "#9A9A9A" }}>
          Amount in NGN (₦)
        </p>
        <div className="flex items-center gap-3">
          <input
            type="number"
            inputMode="decimal"
            value={String(amountToBuy)}
            onChange={(e) => setAmountToBuy(e.target.value)}
            onFocus={handleFocusAmountToBuy}
            onBlur={handleBlurAmountToBuy}
            placeholder="0.00"
            className="flex-1 bg-transparent text-3xl font-black outline-none"
            style={{ color: "#0E0F0C", minWidth: 0 }}
          />
          <span className="text-sm font-bold shrink-0 px-3 py-1.5 rounded-xl"
            style={{ background: "#FFFFFF", border: "1px solid #E0E0E0", color: "#6B6E6B" }}>
            NGN
          </span>
        </div>

        {/* Quick chips */}
        <div className="flex gap-2 mt-3 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          {QUICK_AMOUNTS.map((a) => {
            const isActive = String(amountToBuy) === String(a);
            return (
              <button key={a} type="button"
                onClick={() => setAmountToBuy(String(a))}
                className="shrink-0 px-3.5 py-1.5 rounded-full text-[11px] font-bold transition-all"
                style={{
                  background: isActive ? accentColor : "#FFFFFF",
                  color: isActive ? "#FFFFFF" : "#6B6E6B",
                  border: `1px solid ${isActive ? accentColor : "#E0E0E0"}`,
                }}>
                ₦{a.toLocaleString()}
              </button>
            );
          })}
        </div>
      </div>

      {/* Wallet address */}
      <div className="rounded-2xl px-4 py-3"
        style={{ background: "#F7F7F9", border: "1px solid #EEEEEE" }}>
        <p className="text-[10px] font-bold tracking-widest uppercase mb-2" style={{ color: "#9A9A9A" }}>
          Your Wallet Address
        </p>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={walletAddress}
            onChange={(e) => handleWalletChange(e.target.value)}
            placeholder="Paste your wallet address here"
            className="flex-1 bg-transparent text-sm outline-none"
            style={{ color: "#0E0F0C", minWidth: 0 }}
          />
          {walletAddress && (
            <button type="button" onClick={() => handleWalletChange("")}
              className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center"
              style={{ background: "#E0E0E0" }}>
              <X size={10} style={{ color: "#6B6E6B" }} />
            </button>
          )}
        </div>
      </div>

      {/* Network selector */}
      <div className="relative">
        <div className="rounded-2xl px-4 py-3"
          style={{ background: "#F7F7F9", border: "1px solid #EEEEEE" }}>
          <p className="text-[10px] font-bold tracking-widest uppercase mb-1.5" style={{ color: "#9A9A9A" }}>
            Network
          </p>
          <button type="button"
            onClick={() => setNetworkDropdownOpen((v) => !v)}
            className="flex items-center justify-between w-full">
            <span className="text-sm font-semibold" style={{ color: "#0E0F0C" }}>
              {NETWORK_LABELS[selectedNetwork] ?? selectedNetwork}
            </span>
            <ChevronDown size={16} style={{
              color: "#9A9A9A",
              transform: networkDropdownOpen ? "rotate(180deg)" : "rotate(0)",
              transition: "transform 0.2s",
            }} />
          </button>
        </div>

        {/* Dropdown */}
        <AnimatePresence>
          {networkDropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
              className="absolute left-0 right-0 z-20 mt-1 rounded-2xl overflow-hidden"
              style={{ background: "#FFFFFF", border: "1px solid #EEEEEE", boxShadow: "0 8px 24px rgba(0,0,0,0.10)" }}
            >
              {cryptoNetworkTypes.map((net) => (
                <button key={net} type="button"
                  onClick={() => handleNetworkSelect(net)}
                  className="w-full flex items-center justify-between px-4 py-3 text-left text-sm font-semibold transition-colors hover:bg-gray-50"
                  style={{
                    color: selectedNetwork === net ? accentColor : "#0E0F0C",
                    borderBottom: "1px solid #F7F7F9",
                  }}>
                  {NETWORK_LABELS[net] ?? net}
                  {selectedNetwork === net && (
                    <span className="w-2 h-2 rounded-full" style={{ background: accentColor }} />
                  )}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* CTA */}
      <button
        type="button"
        disabled={submitDisabled}
        onClick={onProceed}
        className="w-full py-4 rounded-2xl text-sm font-bold transition-all mt-1"
        style={{
          background: !submitDisabled
            ? `linear-gradient(135deg, ${accentColor}, #6B45D0)`
            : "#F0F0F0",
          color: !submitDisabled ? "#FFFFFF" : "#9A9A9A",
          boxShadow: !submitDisabled ? `0 6px 20px ${accentColor}44` : "none",
        }}
      >
        {isInitiatingTrade ? "Processing…" : "See Payment Details →"}
      </button>
    </div>
  );
}
