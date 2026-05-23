import { useState, useRef } from "react";
import { Check, CheckCircle, ChevronDown, Copy, X, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "@tanstack/react-router";
import type {
  SupportedCryptoOrCurrencyResponse,
  UserBankAccountResponse,
  CustodialWalletResponse,
} from "../../../types/response.payload.types.ts";
import type {
  TradeType,
  TradeAdditionalInfoInterface,
} from "../../../types/trade.types.ts";
import { useDispatch } from "react-redux";
import { setInitiateTransactionField } from "../../../redux/transaction.slice.ts";
import { setSelectedCryptoId } from "../../../redux/crypto.slice.ts";
import { ROUTES } from "../../../util/constants.util.ts";
import { exchangeRateServiceApi } from "../../../api/rate.api.ts";
import {
  TRADE_FIAT_AMOUNT_PRESETS,
  formatTradeFiatPreset,
} from "../../../constants/tradeAmounts.ts";

export interface BuyRateInfo {
  rate: number; // NGN per 1 crypto (fiatRate from API)
  rateId?: string;
  coinGeckoRate: number;
  platformRate: number;
  cryptoAmount: number; // how much crypto they'll receive
  fiatAmount: number; // what they typed in
  currencyCode: string;
  currencyId: string;
  fetchedAt: number; // Date.now()
}

// ── Quick amount chips ────────────────────────────────────────────────────────
const QUICK_AMOUNTS_NGN = TRADE_FIAT_AMOUNT_PRESETS.ngn;
const QUICK_AMOUNTS_USD = TRADE_FIAT_AMOUNT_PRESETS.usd;

// ── Network labels ────────────────────────────────────────────────────────────
const NETWORK_LABELS: Record<string, string> = {
  TRC20: "TRC20 (Tron)",
  ERC20: "ERC20 (Ethereum)",
  BEP20: "BEP20 (BSC)",
  BTC: "Bitcoin (BTC)",
  SOLANA: "Solana (SOL)",
};

// ── Icons ─────────────────────────────────────────────────────────────────────
function CryptoIcon({ symbol, icon }: { symbol: string; icon?: string }) {
  if (icon)
    return (
      <img
        src={icon}
        alt={symbol}
        className="w-10 h-10 rounded-full object-cover"
      />
    );
  const colors: Record<string, string> = {
    BTC: "#F7931A",
    ETH: "#627EEA",
    SOL: "#9945FF",
    USDT: "#26A17B",
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

// ── Props ─────────────────────────────────────────────────────────────────────
interface DashboardTradeStep1Props {
  tradeType: TradeType;
  availableTokens: SupportedCryptoOrCurrencyResponse[];
  selectedToken: SupportedCryptoOrCurrencyResponse | undefined;
  setSelectedToken: (t: SupportedCryptoOrCurrencyResponse) => void;
  isInitiatingTrade: boolean;
  isRateLoading?: boolean;
  onProceed: () => void;

  // BUY rate (local-first flow)
  buyRateInfo?: BuyRateInfo | null;
  onRateResolved?: (info: BuyRateInfo | null) => void;

  // BUY-specific (from Step 1b)
  availableCurrencies?: SupportedCryptoOrCurrencyResponse[];
  selectedCurrency?: SupportedCryptoOrCurrencyResponse;
  setSelectedCurrency?: (c: SupportedCryptoOrCurrencyResponse) => void;
  amountToBuy?: string | number;
  setAmountToBuy?: (v: string | number) => void;
  handleFocusAmountToBuy?: () => void;
  handleBlurAmountToBuy?: () => void;
  walletAddress?: string;
  onWalletAddressChange?: (v: string) => void;
  selectedNetwork?: string;
  onNetworkChange?: (v: string) => void;
  orderDetails?: TradeAdditionalInfoInterface[];

  // SELL-specific (payout bank)
  userBankAccounts?: UserBankAccountResponse[] | null;
  selectedPayoutAccountId?: string;
  onPayoutAccountChange?: (id: string) => void;

  // SELL-specific (deposit wallet shown inline)
  sellDepositWallet?: CustodialWalletResponse | null;
  isGeneratingDepositWallet?: boolean;
  sellNetwork?: string;
  onSellNetworkChange?: (network: string) => void;
}

// ── BUY extra fields ──────────────────────────────────────────────────────────
function BuyFields({
  selectedToken,
  availableCurrencies,
  selectedCurrency,
  setSelectedCurrency,
  amountToBuy,
  setAmountToBuy,
  handleFocusAmountToBuy,
  walletAddress,
  onWalletAddressChange,
  selectedNetwork,
  onNetworkChange,
  buyRateInfo,
  onRateResolved,
}: {
  selectedToken: SupportedCryptoOrCurrencyResponse;
  availableCurrencies?: SupportedCryptoOrCurrencyResponse[];
  selectedCurrency?: SupportedCryptoOrCurrencyResponse;
  setSelectedCurrency?: (c: SupportedCryptoOrCurrencyResponse) => void;
  amountToBuy?: string | number;
  setAmountToBuy?: (v: string | number) => void;
  handleFocusAmountToBuy?: () => void;
  walletAddress?: string;
  onWalletAddressChange?: (v: string) => void;
  selectedNetwork?: string;
  onNetworkChange?: (v: string) => void;
  buyRateInfo?: BuyRateInfo | null;
  onRateResolved?: (info: BuyRateInfo | null) => void;
}) {
  const dispatch = useDispatch();
  const accentColor = "#948EEE";
  const tokenNetworks: string[] = selectedToken.networks ?? [];
  const [networkDropdownOpen, setNetworkDropdownOpen] = useState(false);
  const [isFetchingRate, setIsFetchingRate] = useState(false);
  // Track the fiatAmount that's currently being fetched to avoid duplicate in-flight requests
  const fetchingRef = useRef<number | null>(null);

  const handleWalletChange = (val: string) => {
    onWalletAddressChange?.(val);
    dispatch(
      setInitiateTransactionField({
        field: "walletAddress" as any,
        value: val,
      }),
    );
  };

  const handleNetworkSelect = (net: string) => {
    setNetworkDropdownOpen(false);
    onNetworkChange?.(net);
    dispatch(
      setInitiateTransactionField({ field: "network" as any, value: net }),
    );
  };

  // Auto-set currency to NGN if none selected
  if (availableCurrencies && !selectedCurrency) {
    const ngn = availableCurrencies.find((c) => c.code === "NGN");
    if (ngn) {
      setSelectedCurrency?.(ngn);
      dispatch(
        setInitiateTransactionField({ field: "currencyId", value: ngn.id }),
      );
    }
  }

  // Sync token + first network into redux
  dispatch(setSelectedCryptoId(selectedToken.id));
  dispatch(
    setInitiateTransactionField({ field: "tokenId", value: selectedToken.id }),
  );

  // Determine active currency
  const isUSD = selectedCurrency?.code === "USD";
  const quickAmounts = isUSD ? QUICK_AMOUNTS_USD : QUICK_AMOUNTS_NGN;

  const handleCurrencySwitch = (targetCode: "NGN" | "USD") => {
    const target = availableCurrencies?.find((c) => c.code === targetCode);
    if (target) {
      setSelectedCurrency?.(target);
      dispatch(
        setInitiateTransactionField({ field: "currencyId", value: target.id }),
      );
      setAmountToBuy?.("");
      onRateResolved?.(null);
    }
  };

  // Fetch rate from backend (cached server-side), compute crypto amount locally.
  const fetchRate = async (fiatAmount: number, currencyId: string) => {
    const cryptoId = selectedToken.id;
    if (!fiatAmount || fiatAmount <= 0 || !currencyId || !cryptoId) return;
    if (fetchingRef.current === fiatAmount) return; // already fetching this amount

    fetchingRef.current = fiatAmount;
    onRateResolved?.(null); // clear old rate while fetching
    setIsFetchingRate(true);
    try {
      const { data: rateData, success: rateOk } =
        await exchangeRateServiceApi.getExchangeRate(
          cryptoId,
          currencyId,
          "BUY",
        );
      if (!rateOk || !rateData) return;

      // BUY: crypto received = fiatAmount / (coinGeckoRate * platformRate)
      const cryptoAmount = parseFloat(
        (
          fiatAmount /
          (rateData.coinGeckoRate * Number(rateData.platformRate))
        ).toFixed(8),
      );

      onRateResolved?.({
        rate: rateData.fiatRate,
        rateId: (rateData as unknown as { id?: string }).id,
        coinGeckoRate: rateData.coinGeckoRate,
        platformRate: Number(rateData.platformRate),
        cryptoAmount,
        fiatAmount,
        currencyCode: selectedCurrency?.code ?? "NGN",
        currencyId,
        fetchedAt: Date.now(),
      });
    } finally {
      fetchingRef.current = null;
      setIsFetchingRate(false);
    }
  };

  const handleAmountChange = (val: string) => {
    setAmountToBuy?.(val);
    onRateResolved?.(null); // clear rate when user edits amount
  };

  const handleBlur = () => {
    handleFocusAmountToBuy?.();
    const fiatAmount = Number(amountToBuy ?? 0);
    const currencyId = selectedCurrency?.id;
    if (fiatAmount > 0 && currencyId) fetchRate(fiatAmount, currencyId);
  };

  const handleChipClick = (a: number) => {
    setAmountToBuy?.(String(a));
    onRateResolved?.(null);
    const currencyId = selectedCurrency?.id;
    if (currencyId) fetchRate(a, currencyId);
  };

  // Preview: use live rate if amount matches, else static rate estimate
  const inputValue = Number(amountToBuy ?? 0);
  const cryptoPreview =
    buyRateInfo && buyRateInfo.fiatAmount === inputValue
      ? buyRateInfo.cryptoAmount.toFixed(6)
      : inputValue > 0 && Number(selectedToken.buyRate ?? 0) > 0
        ? (inputValue / Number(selectedToken.buyRate)).toFixed(6)
        : null;

  return (
    <div className="flex flex-col gap-3 mt-1">
      {/* Amount input */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ background: "#F7F7F9", border: "1px solid #EEEEEE" }}
      >
        <div className="flex items-center justify-between px-4 pt-3 pb-1">
          <p
            className="text-[10px] font-bold tracking-widest uppercase"
            style={{ color: "#9A9A9A" }}
          >
            Amount in {isUSD ? "USD ($)" : "NGN (₦)"}
          </p>
          {/* Currency toggle */}
          {availableCurrencies && availableCurrencies.length > 1 && (
            <div
              className="flex rounded-lg overflow-hidden"
              style={{ border: "1px solid #E0E0E0" }}
            >
              {(["NGN", "USD"] as const).map((code) => {
                const active = isUSD ? code === "USD" : code === "NGN";
                return (
                  <button
                    key={code}
                    type="button"
                    onClick={() => handleCurrencySwitch(code)}
                    className="px-2.5 py-1 text-[10px] font-bold transition-colors"
                    style={{
                      background: active ? accentColor : "#FFFFFF",
                      color: active ? "#FFFFFF" : "#9A9A9A",
                    }}
                  >
                    {code}
                  </button>
                );
              })}
            </div>
          )}
        </div>
        <div className="flex items-center gap-3 px-4 pb-3">
          <input
            type="number"
            inputMode="decimal"
            value={String(amountToBuy ?? "")}
            onChange={(e) => handleAmountChange(e.target.value)}
            onFocus={handleFocusAmountToBuy}
            onBlur={handleBlur}
            placeholder="0.00"
            className="flex-1 bg-transparent text-3xl font-black outline-none"
            style={{ color: "#0E0F0C", minWidth: 0 }}
          />
          {isFetchingRate && (
            <div
              className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin shrink-0"
              style={{
                borderColor: `${accentColor} transparent transparent transparent`,
              }}
            />
          )}
        </div>

        {/* Crypto equivalent preview */}
        {cryptoPreview && !isFetchingRate && (
          <div className="px-4 pb-2 -mt-1">
            <p className="text-xs" style={{ color: "#9A9A9A" }}>
              ≈{" "}
              <span className="font-semibold" style={{ color: accentColor }}>
                {cryptoPreview} {selectedToken.symbol}
              </span>{" "}
              you will receive
              {buyRateInfo && buyRateInfo.fiatAmount === inputValue && (
                <span className="ml-1 text-[10px]" style={{ color: "#BDBDBD" }}>
                  (live rate)
                </span>
              )}
            </p>
          </div>
        )}

        {/* Quick chips */}
        <div className="flex border-t" style={{ borderColor: "#EEEEEE" }}>
          {quickAmounts.map((a) => {
            const isActive = String(amountToBuy) === String(a);
            const label = formatTradeFiatPreset(a, isUSD ? "USD" : "NGN");
            return (
              <button
                key={a}
                type="button"
                onClick={() => handleChipClick(a)}
                className="flex-1 py-2.5 text-xs font-semibold border-r last:border-r-0 transition-colors"
                style={{
                  borderColor: "#EEEEEE",
                  background: isActive
                    ? "rgba(148,142,238,0.08)"
                    : "transparent",
                  color: isActive ? accentColor : "#6B6E6B",
                }}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Wallet address */}
      <div
        className="rounded-2xl px-4 py-3"
        style={{ background: "#F7F7F9", border: "1px solid #EEEEEE" }}
      >
        <p
          className="text-[10px] font-bold tracking-widest uppercase mb-2"
          style={{ color: "#9A9A9A" }}
        >
          Your Wallet Address
        </p>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={walletAddress ?? ""}
            onChange={(e) => handleWalletChange(e.target.value)}
            placeholder="Paste your wallet address here"
            className="flex-1 bg-transparent text-sm outline-none"
            style={{ color: "#0E0F0C", minWidth: 0 }}
          />
          {walletAddress && (
            <button
              type="button"
              onClick={() => handleWalletChange("")}
              className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center"
              style={{ background: "#E0E0E0" }}
            >
              <X size={10} style={{ color: "#6B6E6B" }} />
            </button>
          )}
        </div>
      </div>

      {/* Network selector */}
      <div className="relative">
        <div
          className="rounded-2xl px-4 py-3"
          style={{ background: "#F7F7F9", border: "1px solid #EEEEEE" }}
        >
          <p
            className="text-[10px] font-bold tracking-widest uppercase mb-1.5"
            style={{ color: "#9A9A9A" }}
          >
            Network
          </p>
          {tokenNetworks.length <= 1 ? (
            <p className="text-sm font-semibold" style={{ color: "#0E0F0C" }}>
              {(NETWORK_LABELS[selectedNetwork ?? ""] ?? selectedNetwork) ||
                "—"}
            </p>
          ) : (
            <button
              type="button"
              onClick={() => setNetworkDropdownOpen((v) => !v)}
              className="flex items-center justify-between w-full"
            >
              <span
                className="text-sm font-semibold"
                style={{ color: "#0E0F0C" }}
              >
                {NETWORK_LABELS[selectedNetwork ?? ""] ?? selectedNetwork}
              </span>
              <ChevronDown
                size={16}
                style={{
                  color: "#9A9A9A",
                  transform: networkDropdownOpen
                    ? "rotate(180deg)"
                    : "rotate(0)",
                  transition: "transform 0.2s",
                }}
              />
            </button>
          )}
        </div>

        {tokenNetworks.length > 1 && (
          <AnimatePresence>
            {networkDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
                className="absolute left-0 right-0 z-20 mt-1 rounded-2xl overflow-hidden"
                style={{
                  background: "#FFFFFF",
                  border: "1px solid #EEEEEE",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.10)",
                }}
              >
                {tokenNetworks.map((net) => (
                  <button
                    key={net}
                    type="button"
                    onClick={() => handleNetworkSelect(net)}
                    className="w-full flex items-center justify-between px-4 py-3 text-left text-sm font-semibold transition-colors hover:bg-gray-50"
                    style={{
                      color: selectedNetwork === net ? accentColor : "#0E0F0C",
                      borderBottom: "1px solid #F7F7F9",
                    }}
                  >
                    {NETWORK_LABELS[net] ?? net}
                    {selectedNetwork === net && (
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ background: accentColor }}
                      />
                    )}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}

// ── SELL deposit wallet (inline) ──────────────────────────────────────────────
function SellDepositWalletSection({
  depositWallet,
  isGenerating,
  selectedToken,
  sellNetwork,
  onSellNetworkChange,
}: {
  depositWallet?: CustodialWalletResponse | null;
  isGenerating?: boolean;
  selectedToken?: SupportedCryptoOrCurrencyResponse;
  sellNetwork?: string;
  onSellNetworkChange?: (network: string) => void;
}) {
  const [copied, setCopied] = useState(false);
  const [networkDropdownOpen, setNetworkDropdownOpen] = useState(false);
  const accentColor = "#F7A600";
  const tokenNetworks = selectedToken?.networks ?? [];
  const hasMultipleNetworks = tokenNetworks.length > 1;
  const activeNetwork = sellNetwork ?? tokenNetworks[0];

  const handleCopy = () => {
    if (!depositWallet?.walletAddress) return;
    navigator.clipboard.writeText(depositWallet.walletAddress).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleNetworkSelect = (net: string) => {
    setNetworkDropdownOpen(false);
    onSellNetworkChange?.(net);
  };

  if (!selectedToken) return null;

  const rate = selectedToken.sellRate
    ? `₦${Number(selectedToken.sellRate).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })} per 1 ${selectedToken.symbol}`
    : null;

  return (
    <div className="flex flex-col gap-3">
      {/* Rate bar */}
      {rate && (
        <div
          className="flex items-center gap-2 px-4 py-2 rounded-2xl"
          style={{ background: "#FFF8F0", border: "1px solid #FFE4A0" }}
        >
          <span
            className="w-2 h-2 rounded-full animate-pulse shrink-0"
            style={{ background: "#EB5757" }}
          />
          <span className="text-xs font-bold" style={{ color: "#A07000" }}>
            {rate} • Live quote
          </span>
        </div>
      )}

      <p
        className="text-[10px] font-bold tracking-widest uppercase"
        style={{ color: "#9A9A9A" }}
      >
        Send {selectedToken.symbol} To
      </p>

      {/* Network selector (only for multi-network tokens) */}
      {hasMultipleNetworks && (
        <div className="relative">
          <button
            type="button"
            onClick={() => setNetworkDropdownOpen((v) => !v)}
            className="w-full flex items-center justify-between px-4 py-3 rounded-2xl"
            style={{ background: "#F7F7F9", border: "1px solid #EEEEEE" }}
          >
            <div>
              <p
                className="text-[10px] font-bold tracking-widest uppercase text-left"
                style={{ color: "#9A9A9A" }}
              >
                Network
              </p>
              <p
                className="text-sm font-semibold mt-0.5"
                style={{ color: "#0E0F0C" }}
              >
                {NETWORK_LABELS[activeNetwork] ?? activeNetwork}
              </p>
            </div>
            <ChevronDown
              size={16}
              style={{
                color: "#9A9A9A",
                transform: networkDropdownOpen ? "rotate(180deg)" : "rotate(0)",
                transition: "transform 0.2s",
              }}
            />
          </button>

          <AnimatePresence>
            {networkDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
                className="absolute left-0 right-0 z-20 mt-1 rounded-2xl overflow-hidden"
                style={{
                  background: "#FFFFFF",
                  border: "1px solid #EEEEEE",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.10)",
                }}
              >
                {tokenNetworks.map((net) => (
                  <button
                    key={net}
                    type="button"
                    onClick={() => handleNetworkSelect(net)}
                    className="w-full flex items-center justify-between px-4 py-3 text-left text-sm font-semibold transition-colors hover:bg-gray-50"
                    style={{
                      color: activeNetwork === net ? accentColor : "#0E0F0C",
                      borderBottom: "1px solid #F7F7F9",
                    }}
                  >
                    {NETWORK_LABELS[net] ?? net}
                    {activeNetwork === net && (
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ background: accentColor }}
                      />
                    )}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      <div
        className="rounded-2xl px-4 py-3"
        style={{
          background: "#FFFBF0",
          border: `1.5px solid ${accentColor}44`,
        }}
      >
        {isGenerating ? (
          <div className="flex items-center gap-2 py-1">
            <div
              className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin"
              style={{
                borderColor: `${accentColor} transparent transparent transparent`,
              }}
            />
            <p className="text-xs" style={{ color: "#A07000" }}>
              Generating deposit address…
            </p>
          </div>
        ) : depositWallet ? (
          <>
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                {!hasMultipleNetworks && (
                  <p
                    className="text-[10px] font-bold mb-1"
                    style={{ color: "#A07000" }}
                  >
                    {NETWORK_LABELS[depositWallet.network] ??
                      depositWallet.network}
                  </p>
                )}
                <p
                  className="text-xs font-mono break-all leading-relaxed"
                  style={{ color: "#0E0F0C" }}
                >
                  {depositWallet.walletAddress}
                </p>
              </div>
              <button
                type="button"
                onClick={handleCopy}
                className="shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[10px] font-bold transition-all"
                style={{
                  background: copied ? "#E8F8F0" : "#FFF3D0",
                  color: copied ? "#037847" : "#A07000",
                  border: `1px solid ${copied ? "#A8E6C8" : "#FFD980"}`,
                }}
              >
                {copied ? <Check size={11} /> : <Copy size={11} />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
            <p className="text-[10px] mt-2" style={{ color: "#A07000" }}>
              Only send {selectedToken.symbol} on{" "}
              {NETWORK_LABELS[depositWallet.network] ?? depositWallet.network}.
            </p>
            {depositWallet.note && (
              <p
                className="mt-2 text-[10px] leading-relaxed"
                style={{ color: "#9A9A9A" }}
              >
                {depositWallet.note}
              </p>
            )}
          </>
        ) : (
          <p className="text-xs py-1" style={{ color: "#A07000" }}>
            Select a crypto above to see your deposit address.
          </p>
        )}
      </div>
    </div>
  );
}

// ── SELL payout bank section ──────────────────────────────────────────────────
function BankAccountRow({
  account,
  selected,
  accentColor,
  onSelect,
}: {
  account: UserBankAccountResponse;
  selected: boolean;
  accentColor: string;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="w-full rounded-2xl px-4 py-3 text-left transition-all"
      style={{
        background: selected ? "#FFFBF0" : "#FAFAFA",
        border: selected ? `2px solid ${accentColor}` : "1.5px solid #F0F0F0",
      }}
    >
      <div className="flex items-center gap-3">
        {account.bankLogo ? (
          <img
            src={account.bankLogo}
            alt={account.bankName}
            className="w-8 h-8 rounded-lg object-cover shrink-0"
          />
        ) : (
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: selected ? "#FFE4A0" : "#F0F0F0" }}
          >
            <span
              className="text-[10px] font-black"
              style={{ color: selected ? "#A07000" : "#9A9A9A" }}
            >
              {account.bankName.slice(0, 2).toUpperCase()}
            </span>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p
            className="text-xs font-bold truncate"
            style={{ color: "#0E0F0C" }}
          >
            {account.bankName}
          </p>
          <p className="text-[11px] font-mono" style={{ color: "#6B6E6B" }}>
            ****{account.accountNumber.slice(-4)} · {account.accountName}
          </p>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {account.isDefault && (
            <span
              className="text-[9px] font-bold px-2 py-0.5 rounded-full"
              style={{ background: "#E8F8F0", color: "#037847" }}
            >
              DEFAULT
            </span>
          )}
          {/* Radio dot */}
          <div
            className="w-4 h-4 rounded-full flex items-center justify-center"
            style={{
              border: `2px solid ${selected ? accentColor : "#D0D0D0"}`,
            }}
          >
            {selected && (
              <div
                className="w-2 h-2 rounded-full"
                style={{ background: accentColor }}
              />
            )}
          </div>
        </div>
      </div>
    </button>
  );
}

function SellPayoutBank({
  userBankAccounts,
  selectedPayoutAccountId,
  onPayoutAccountChange,
}: {
  userBankAccounts?: UserBankAccountResponse[] | null;
  selectedPayoutAccountId?: string;
  onPayoutAccountChange?: (id: string) => void;
}) {
  const navigate = useNavigate();
  const accentColor = "#F7A600";

  const accounts = userBankAccounts ?? [];
  const selectedId =
    selectedPayoutAccountId ??
    accounts.find((b) => b.isDefault)?.id ??
    accounts[0]?.id;

  if (accounts.length === 0) {
    return (
      <div
        className="rounded-2xl px-4 py-4 flex flex-col gap-2"
        style={{ background: "#FFFBF0", border: "1px solid #FFE4A0" }}
      >
        <p className="text-xs font-bold" style={{ color: "#A07000" }}>
          No bank account linked
        </p>
        <p className="text-[11px]" style={{ color: "#A07000" }}>
          You need a bank account to receive NGN from your sale.
        </p>
        <button
          type="button"
          onClick={() =>
            navigate({ to: ROUTES.PROFILE, search: { section: "bank" } })
          }
          className="self-start text-[11px] font-bold underline"
          style={{ color: "#F7A600" }}
        >
          Add a bank account →
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <p
        className="text-[10px] font-bold tracking-widest uppercase"
        style={{ color: "#9A9A9A" }}
      >
        Payout Account
      </p>

      {/* All accounts as a radio list */}
      {accounts.map((acct) => (
        <BankAccountRow
          key={acct.id}
          account={acct}
          selected={acct.id === selectedId}
          accentColor={accentColor}
          onSelect={() => onPayoutAccountChange?.(acct.id)}
        />
      ))}

      {/* Manage accounts link */}
      <button
        type="button"
        onClick={() =>
          navigate({ to: ROUTES.PROFILE, search: { section: "bank" } })
        }
        className="text-[11px] font-semibold text-left"
        style={{ color: "#9A9A9A" }}
      >
        Manage bank accounts →
      </button>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function DashboardTradeStep1({
  tradeType,
  availableTokens,
  selectedToken,
  setSelectedToken,
  isInitiatingTrade,
  isRateLoading,
  onProceed,
  buyRateInfo,
  onRateResolved,
  availableCurrencies,
  selectedCurrency,
  setSelectedCurrency,
  amountToBuy,
  setAmountToBuy,
  handleFocusAmountToBuy,
  walletAddress,
  onWalletAddressChange,
  selectedNetwork,
  onNetworkChange,
  userBankAccounts,
  selectedPayoutAccountId,
  onPayoutAccountChange,
  sellDepositWallet,
  isGeneratingDepositWallet,
  sellNetwork,
  onSellNetworkChange,
  onBack, // Added onBack prop
}: DashboardTradeStep1Props & { onBack?: () => void }) {
  const isBuy = tradeType === "buy";
  const accentColor = isBuy ? "#948EEE" : "#F7A600";

  const hasBankAccounts = (userBankAccounts?.length ?? 0) > 0;
  const noBankAccounts = !isBuy && !hasBankAccounts;

  // For BUY: require amount, wallet, AND a fetched rate before allowing proceed
  const buySubmitDisabled =
    isBuy &&
    (!amountToBuy ||
      Number(amountToBuy) <= 0 ||
      !walletAddress?.trim() ||
      !buyRateInfo);
  const activeNetwork =
    !isBuy && selectedToken
      ? (sellNetwork ?? selectedToken.networks?.[0])
      : undefined;
  const sellWalletLoading =
    !isBuy &&
    !!selectedToken &&
    (isGeneratingDepositWallet ||
      !sellDepositWallet ||
      (activeNetwork && sellDepositWallet?.network !== activeNetwork));

  const isCtaBusy =
    isInitiatingTrade ||
    (!!selectedToken && isRateLoading) ||
    sellWalletLoading;
  const ctaLabel = isInitiatingTrade
    ? "Processing…"
    : isRateLoading && selectedToken
      ? "Loading rate…"
      : sellWalletLoading
        ? "Getting deposit address…"
        : noBankAccounts
          ? "Add a bank account first"
          : isBuy &&
              amountToBuy &&
              Number(amountToBuy) > 0 &&
              walletAddress?.trim() &&
              !buyRateInfo
            ? "Fetching rate…"
            : selectedToken
              ? `${isBuy ? "Buy" : "Start Transaction"} — Continue`
              : "Select a Crypto to Continue";

  const ctaDisabled =
    !selectedToken || isCtaBusy || noBankAccounts || buySubmitDisabled;

  return (
    <div className="flex flex-col gap-4">
      {/* Page header with Back Button */}
      <div className="flex items-center gap-3 mb-1">
        <button
          type="button"
          onClick={onBack}
          className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-colors hover:bg-gray-50"
          style={{ border: "1px solid #E8E8E8", background: "#FAFAFA" }}
        >
          <ArrowLeft size={16} style={{ color: "#0E0F0C" }} />
        </button>
        <div>
          <h2 className="text-lg font-extrabold" style={{ color: "#0E0F0C" }}>
            {selectedToken
              ? `${isBuy ? "Buy" : "Sell"} ${selectedToken.symbol}`
              : isBuy
                ? "Buy Crypto"
                : "Sell Crypto"}
          </h2>
          <p className="text-xs" style={{ color: "#9A9A9A" }}>
            {selectedToken
              ? "Your unique deposit wallet"
              : isBuy
                ? "Choose what to buy"
                : "Choose what to sell"}
          </p>
        </div>
      </div>

      {/* Info banner */}
      <div
        className="flex items-start gap-3 rounded-2xl px-4 py-3"
        style={{
          background: isBuy ? "#EEF0FF" : "#FFFBF0",
          border: `1px solid ${isBuy ? "#C7CAFF" : "#FFE4A0"}`,
        }}
      >
        <span className="text-base leading-none mt-0.5">
          {isBuy ? "💳" : "📤"}
        </span>
        <p
          className="text-xs leading-relaxed"
          style={{ color: isBuy ? "#5B5EA6" : "#A07000" }}
        >
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
                background: selected
                  ? isBuy
                    ? "#EEF0FF"
                    : "#FFFBF0"
                  : "#FAFAFA",
                border: selected
                  ? `2px solid ${accentColor}`
                  : "2px solid #F0F0F0",
              }}
            >
              {selected && (
                <span className="absolute top-2.5 right-2.5">
                  <CheckCircle size={15} style={{ color: accentColor }} />
                </span>
              )}
              <CryptoIcon symbol={token.symbol} icon={token.logoUrl} />
              <div className="text-center">
                <p
                  className="text-sm font-extrabold"
                  style={{ color: "#0E0F0C" }}
                >
                  {token.symbol}
                </p>
                <p className="text-[10px] mt-0.5" style={{ color: "#9A9A9A" }}>
                  {token.name}
                </p>
                {rateLabel && (
                  <p
                    className="text-[10px] font-bold mt-1"
                    style={{ color: accentColor }}
                  >
                    {rateLabel}
                  </p>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* BUY: amount + wallet fields (shown when token is selected) */}
      {isBuy && selectedToken && (
        <BuyFields
          selectedToken={selectedToken}
          availableCurrencies={availableCurrencies}
          selectedCurrency={selectedCurrency}
          setSelectedCurrency={setSelectedCurrency}
          amountToBuy={amountToBuy}
          setAmountToBuy={setAmountToBuy}
          handleFocusAmountToBuy={handleFocusAmountToBuy}
          walletAddress={walletAddress}
          onWalletAddressChange={onWalletAddressChange}
          selectedNetwork={selectedNetwork}
          onNetworkChange={onNetworkChange}
          buyRateInfo={buyRateInfo}
          onRateResolved={onRateResolved}
        />
      )}

      {/* SELL: payout bank selector */}
      {!isBuy && (
        <SellPayoutBank
          userBankAccounts={userBankAccounts}
          selectedPayoutAccountId={selectedPayoutAccountId}
          onPayoutAccountChange={onPayoutAccountChange}
        />
      )}

      {/* SELL: deposit wallet address (shown when token selected) */}
      {!isBuy && selectedToken && (
        <SellDepositWalletSection
          depositWallet={sellDepositWallet}
          isGenerating={isGeneratingDepositWallet}
          selectedToken={selectedToken}
          sellNetwork={sellNetwork}
          onSellNetworkChange={onSellNetworkChange}
        />
      )}

      {/* CTA */}
      <button
        type="button"
        disabled={ctaDisabled}
        onClick={() => !ctaDisabled && onProceed()}
        className="w-full py-4 rounded-2xl text-sm font-bold transition-all mt-1"
        style={{
          background: !ctaDisabled
            ? `linear-gradient(135deg, ${accentColor}, ${
                isBuy ? "#6B45D0" : "#E09000"
              })`
            : "#F0F0F0",
          color: !ctaDisabled ? "#FFFFFF" : "#9A9A9A",
          boxShadow: !ctaDisabled ? `0 6px 20px ${accentColor}44` : "none",
        }}
      >
        {ctaLabel}
      </button>
    </div>
  );
}
