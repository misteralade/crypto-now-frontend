import { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import { AnimatePresence, motion } from "framer-motion";
import {
  CreditCard,
  ArrowCircleUp,
  Lock,
  Warning,
  Receipt,
  Lightning,
  TrendUp,
  ArrowLeft,
  ArrowRight,
} from "@phosphor-icons/react";
import { useTradeCryptoCurrenciesButton } from "../../../hooks/components/useTradeCryptoCurrenciesButton.ts";
import { useBankQuery } from "../../../queries/bank.query.ts";
import { transactionServiceApi } from "../../../api/transaction.api.ts";
import { bankServiceApi } from "../../../api/bank.api.ts";
import { cryptoServiceApi } from "../../../api/crypto.api.ts";
import { exchangeRateServiceApi } from "../../../api/rate.api.ts";
import type {
  SupportedCryptoOrCurrencyResponse,
  TransactionResponseEntity,
} from "../../../types/response.payload.types.ts";
import { ROUTES } from "../../../util/constants.util.ts";
import { useNavigate } from "@tanstack/react-router";
import BankSelector from "../../global/BankSelector.tsx";
import {
  TRADE_FIAT_AMOUNT_PRESETS,
  formatTradeFiatPreset,
} from "../../../constants/tradeAmounts.ts";
import type { SupportedExchangeRateResponse } from "../../../types/response.payload.types.ts";
import { isExchangeRateExpiryError } from "../../../util/index.util.ts";

const GUEST_QUOTE_CACHE_TTL_MS = 60_000;

type QuoteCacheEntry = {
  data: SupportedExchangeRateResponse;
  cachedAt: number;
};

const buildGuestQuoteCacheKey = (
  cryptoId: string,
  currencyId: string,
  action: "BUY" | "SELL",
) => `${cryptoId}:${currencyId}:${action}`;

const ALL_NETWORKS = [
  { id: "TRC20", label: "TRC20 (Tron)" },
  { id: "ERC20", label: "ERC20 (Ethereum)" },
  { id: "BTC", label: "Bitcoin (BTC)" },
  { id: "SOLANA", label: "Solana (SOL)" },
];

// Maps crypto symbol (uppercase) → allowed network IDs
const CRYPTO_NETWORKS: Record<string, string[]> = {
  BTC: ["BTC"],
  USDT: ["TRC20", "ERC20"],
  SOL: ["SOLANA"],
};

// Default network to pre-select for each crypto
const CRYPTO_DEFAULT_NETWORK: Record<string, string> = {
  BTC: "BTC",
  USDT: "TRC20",
  SOL: "SOLANA",
};

const getDefaultNetworkForCrypto = (
  crypto?: { code?: string | null; symbol?: string | null } | null,
) => {
  const code = (crypto?.code || crypto?.symbol || "").toUpperCase();
  return code ? CRYPTO_DEFAULT_NETWORK[code] || "" : "";
};

const ACTIVE_GUEST_SELL_STATUSES = new Set([
  "INITIATED",
  "AWAITING_CRYPTO",
  "DEPOSIT_DETECTED",
  "DEPOSIT_PENDING_MINIMUM",
  "DEPOSIT_CONFIRMED",
  "PAYOUT_INITIATED",
  "PROCESSING",
  "PENDING_PAYOUT",
  "PAYOUT_FAILED",
]);

const isGuestSellTransactionActive = (status?: string | null) =>
  !!status && ACTIVE_GUEST_SELL_STATUSES.has(status);

type GuestStatusTone = "info" | "warning" | "success" | "danger";

const GUEST_STATUS_META: Record<
  string,
  { label: string; tone: GuestStatusTone; emoji: string }
> = {
  INITIATED: {
    label: "Initiated",
    tone: "info",
    emoji: "⏳",
  },
  AWAITING_CRYPTO: {
    label: "Waiting for Deposit",
    tone: "warning",
    emoji: "📡",
  },
  DEPOSIT_DETECTED: {
    label: "Deposit Detected",
    tone: "info",
    emoji: "⚡",
  },
  DEPOSIT_PENDING_MINIMUM: {
    label: "Below Minimum",
    tone: "warning",
    emoji: "⚠️",
  },
  DEPOSIT_CONFIRMED: {
    label: "Deposit Confirmed",
    tone: "success",
    emoji: "✅",
  },
  PAYOUT_INITIATED: {
    label: "Payout Initiated",
    tone: "info",
    emoji: "🏦",
  },
  PROCESSING: {
    label: "Processing",
    tone: "info",
    emoji: "🔄",
  },
  PENDING_PAYOUT: {
    label: "Pending Payout",
    tone: "warning",
    emoji: "🕒",
  },
  PAYOUT_FAILED: {
    label: "Payout Failed",
    tone: "danger",
    emoji: "❌",
  },
  COMPLETED: {
    label: "Completed",
    tone: "success",
    emoji: "✅",
  },
  FAILED: {
    label: "Failed",
    tone: "danger",
    emoji: "❌",
  },
  EXPIRED: {
    label: "Expired",
    tone: "danger",
    emoji: "⌛",
  },
  CANCELLED: {
    label: "Cancelled",
    tone: "danger",
    emoji: "🚫",
  },
};

const GUEST_STATUS_TONE_STYLES: Record<GuestStatusTone, { bg: string; border: string; text: string; badge: string; dot: string }> = {
  info: {
    bg: "bg-sky-50",
    border: "border-sky-200",
    text: "text-sky-800",
    badge: "bg-sky-100 text-sky-800 border-sky-200",
    dot: "bg-sky-500",
  },
  warning: {
    bg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-900",
    badge: "bg-amber-100 text-amber-900 border-amber-200",
    dot: "bg-amber-500",
  },
  success: {
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    text: "text-emerald-800",
    badge: "bg-emerald-100 text-emerald-800 border-emerald-200",
    dot: "bg-emerald-500",
  },
  danger: {
    bg: "bg-rose-50",
    border: "border-rose-200",
    text: "text-rose-800",
    badge: "bg-rose-100 text-rose-800 border-rose-200",
    dot: "bg-rose-500",
  },
};

const getGuestStatusMeta = (status?: string | null) =>
  status && GUEST_STATUS_META[status]
    ? GUEST_STATUS_META[status]
    : {
        label: "Monitoring",
        tone: "info" as GuestStatusTone,
        emoji: "📡",
      };

const getGuestPayoutFailureCopy = (failureReason?: string | null) => ({
  title: "Payout issue detected",
  subtitle:
    "We detected your crypto deposit, but the NGN payout could not be completed automatically.",
  body:
    failureReason ||
    "Our support team is already reviewing this payout and will notify you once it is resolved.",
});

// ── Crypto token button ───────────────────────────────────────────────────────
const TokenBtn = ({
  item,
  selected,
  onSelect,
}: {
  item: SupportedCryptoOrCurrencyResponse;
  selected: boolean;
  onSelect: () => void;
}) => {
  const label = item.symbol || item.code || item.name || "Asset";
  const initials = label.slice(0, 2).toUpperCase();

  return (
    <button
      onClick={onSelect}
      className="flex-1 flex flex-col items-center py-3 px-1 rounded-xl transition-all cursor-pointer gap-1"
      style={{
        background: selected ? "rgba(148,142,238,0.1)" : "#F5F5F5",
        border: selected ? "1.5px solid #948EEE" : "1.5px solid transparent",
        minWidth: 0,
      }}
      aria-label={`Select ${item.name || label}`}
      title={item.name || label}
    >
      <div className="w-8 h-8 flex items-center justify-center">
        {item.logoUrl ? (
          <img
            src={item.logoUrl}
            alt={`${item.name || label} logo`}
            className="w-7 h-7 object-contain"
          />
        ) : (
          <div className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center">
            <span className="text-[10px] font-bold text-gray-400">
              {initials}
            </span>
          </div>
        )}
      </div>
      <span
        className={`text-xs font-bold leading-none ${
          selected ? "text-[#948EEE]" : "text-[#0E0F0C]"
        }`}
      >
        {label}
      </span>
      <span className="text-[10px] text-gray-400 leading-none">
        {item.name}
      </span>
    </button>
  );
};

// ── Summary row ───────────────────────────────────────────────────────────────
const SRow = ({
  label,
  value,
  green,
}: {
  label: string;
  value: string;
  green?: boolean;
}) => (
  <div className="flex justify-between items-center text-sm py-0.5">
    <span className="text-gray-400">{label}</span>
    <span
      className={`font-semibold ${green ? "text-[#22c55e]" : "text-[#0E0F0C]"}`}
    >
      {value}
    </span>
  </div>
);

// ── Floating-label input ──────────────────────────────────────────────────────
const FloatInput = ({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  maxLength,
  mono,
  inputMode,
  readOnly = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  maxLength?: number;
  mono?: boolean;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  readOnly?: boolean;
}) => (
  <div
    className="flex flex-col rounded-xl px-4 pt-2 pb-3"
    style={{ background: "#F5F5F5", border: "1.5px solid #E8E8E8" }}
  >
    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1">
      {label}
    </span>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      maxLength={maxLength}
      inputMode={inputMode}
      readOnly={readOnly}
      className={`bg-transparent outline-none text-sm text-[#0E0F0C] font-medium placeholder:text-gray-300 ${
        mono ? "font-mono" : ""
      }`}
    />
  </div>
);

// ── Slide animation ───────────────────────────────────────────────────────────
const slide = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -40 },
};

const LS_KEY = "cryptonow_guest_trade";

function loadLS() {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) || "{}");
  } catch {
    return {};
  }
}

// ── Main card ─────────────────────────────────────────────────────────────────
const AppSimCard = () => {
  const navigate = useNavigate();
  const { supportedCryptoCurrencies, loadingSupportedCrypto, supportedCurrencies, loadingSupportedCurrencies } =
    useTradeCryptoCurrenciesButton();
  const { allBanks, loadingAllBanks } = useBankQuery();

  const saved = loadLS();

  const [tab, setTab] = useState<"BUY" | "SELL">(saved.tab || "BUY");
  const [step, setStep] = useState<number>(saved.step || 1);
  const [loading, setLoading] = useState(false);
  const [quoteLoading, setQuoteLoading] = useState(false);

  const [selectedCrypto, setSelectedCrypto] = useState(
    saved.selectedCrypto || ""
  );
  const [selectedCurrency, setSelectedCurrency] = useState(
    saved.selectedCurrency || ""
  );
  const [amount, setAmount] = useState(saved.amount || "");
  const [receiveAmount, setReceiveAmount] = useState(saved.receiveAmount || "");

  // BUY: allow input in USD, but transact in NGN
  const [buyInputCurrency, setBuyInputCurrency] = useState<"NGN" | "USD">(
    "NGN"
  );
  // SELL: allow receive preview in USD, but transact in NGN
  const [sellReceiveCurrency, setSellReceiveCurrency] = useState<"NGN" | "USD">(
    "NGN"
  );
  const [usdToNgnRate, setUsdToNgnRate] = useState<number | null>(null);
  const [usdRateLoading, setUsdRateLoading] = useState(false);
  const [activeSellPreset, setActiveSellPreset] = useState<number | null>(null);
  const guestTransactionStatusPollRef =
    useRef<ReturnType<typeof setInterval> | null>(null);
  const [guestTransactionStatus, setGuestTransactionStatus] =
    useState<TransactionResponseEntity | null>(null);

  const [email, setEmail] = useState(saved.email || "");
  const [walletAddress, setWalletAddress] = useState(saved.walletAddress || "");
  const [selectedBankId, setSelectedBankId] = useState(saved.selectedBankId || "");
  const [network, setNetwork] = useState(saved.network || "");
  const [showNetworkPicker, setShowNetworkPicker] = useState(false);
  const networkPickerRef = useRef<HTMLDivElement>(null);
  const stopGuestTransactionPolling = () => {
    if (guestTransactionStatusPollRef.current) {
      clearInterval(guestTransactionStatusPollRef.current);
      guestTransactionStatusPollRef.current = null;
    }
  };

  useEffect(() => {
    if (!showNetworkPicker) return;
    const onPointerDown = (e: PointerEvent) => {
      if (
        networkPickerRef.current &&
        !networkPickerRef.current.contains(e.target as Node)
      ) {
        setShowNetworkPicker(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [showNetworkPicker]);

  const [bankName, setBankName] = useState(saved.bankName || "");
  const [accountNumber, setAccountNumber] = useState(saved.accountNumber || "");
  const [accountName, setAccountName] = useState(saved.accountName || "");
  const [bankLookupError, setBankLookupError] = useState<string | null>(null);
  const [isLookingUpBankName, setIsLookingUpBankName] = useState(false);

  const [platformBank, setPlatformBank] = useState<any>(
    saved.platformBank || null
  );
  const [sessionId, setSessionId] = useState(saved.sessionId || "");
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const quoteRequestIdRef = useRef(0);

  const [depositWallet, setDepositWallet] = useState(saved.depositWallet || "");
  const [done, setDone] = useState(saved.done || false);
  const quoteCacheRef = useRef<Record<string, QuoteCacheEntry>>({});
  const rateLimitNoticeShownRef = useRef(false);
  const skipNextAutoQuoteRef = useRef(false);
  const isBuy = tab === "BUY";
  const guestPayoutFailed = guestTransactionStatus?.status === "PAYOUT_FAILED";

  const cryptoObj = supportedCryptoCurrencies?.find(
    (c) => c.id === selectedCrypto
  );
  const selectedBank = allBanks?.find((bank) => bank.id === selectedBankId);

  // Init defaults once loaded (only if not already restored from localStorage)
  useEffect(() => {
    if (!selectedCrypto && supportedCryptoCurrencies?.length)
      setSelectedCrypto(supportedCryptoCurrencies[0].id);
  }, [supportedCryptoCurrencies]);

  useEffect(() => {
    if (!selectedCurrency && supportedCurrencies?.length)
      setSelectedCurrency(supportedCurrencies[0].id);
  }, [supportedCurrencies]);

  useEffect(() => {
    if (!selectedBankId && bankName && allBanks?.length) {
      const matchedBank = allBanks.find(
        (bank) => bank.name.toLowerCase() === bankName.toLowerCase(),
      );
      if (matchedBank) {
        setSelectedBankId(matchedBank.id);
      }
    }
  }, [allBanks, bankName, selectedBankId]);

  useEffect(() => {
    if (selectedBank?.name) {
      setBankName(selectedBank.name);
    }
  }, [selectedBank?.name]);

  // Auto-set network to the correct default when no saved network exists.
  useEffect(() => {
    if (saved.network) return;
    const defaultNet = getDefaultNetworkForCrypto(cryptoObj);
    if (defaultNet) setNetwork(defaultNet);
  }, [cryptoObj?.code, cryptoObj?.symbol, saved.network]);

  // Persist all state to localStorage on every change
  useEffect(() => {
    localStorage.setItem(
      LS_KEY,
      JSON.stringify({
        tab,
        step,
        selectedCrypto,
        selectedCurrency,
        amount,
        receiveAmount,
        email,
        walletAddress,
        selectedBankId,
        network,
        bankName,
        accountNumber,
        accountName,
        platformBank,
        sessionId,
        depositWallet,
        done,
      })
    );
  }, [
    tab,
    step,
    selectedCrypto,
    selectedCurrency,
    amount,
    receiveAmount,
    email,
    walletAddress,
    selectedBankId,
    network,
    bankName,
    accountNumber,
    accountName,
    platformBank,
    sessionId,
    depositWallet,
    done,
  ]);

  const buyChips =
    buyInputCurrency === "USD"
      ? TRADE_FIAT_AMOUNT_PRESETS.usd
      : TRADE_FIAT_AMOUNT_PRESETS.ngn;
  const sellChipAmounts =
    sellReceiveCurrency === "USD"
      ? TRADE_FIAT_AMOUNT_PRESETS.usd
      : TRADE_FIAT_AMOUNT_PRESETS.ngn;
  const formatChip = (n: number, currencyCode: "NGN" | "USD") =>
    formatTradeFiatPreset(n, currencyCode);
  const sellChipItems = sellChipAmounts.map((value) => ({
    value,
    label: formatChip(value, sellReceiveCurrency),
  }));
  const formatCryptoAmountForDisplay = (value: string) => {
    if (!value) return "";
    if (!value.includes(".")) return value;
    return value
      .replace(/(\.\d*?[1-9])0+$/u, "$1")
      .replace(/\.0+$/u, "")
      .replace(/\.$/u, "");
  };
  const formatTrimmedDecimal = (value: number, maximumFractionDigits: number) =>
    value.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits,
    });
  const formatReceiveCryptoDisplay = (value: string) => {
    const amountValue = Number(value);
    if (!amountValue || Number.isNaN(amountValue)) return value;
    return formatTrimmedDecimal(amountValue, 4);
  };
  const formatReceiveNgnDisplay = (value: string) => {
    const amountValue = Number(value);
    if (!amountValue || Number.isNaN(amountValue)) return `${ngnDisplayCode}0`;
    return `${ngnDisplayCode}${Math.round(amountValue).toLocaleString()}`;
  };
  const formatUsdEquivalentDisplay = (value: number) =>
    `$${formatTrimmedDecimal(value, 2)} USD equivalent`;
  const getCachedQuote = (
    cryptoId: string,
    currencyId: string,
    action: "BUY" | "SELL",
  ) => {
    const cacheKey = buildGuestQuoteCacheKey(cryptoId, currencyId, action);
    const cachedEntry = quoteCacheRef.current[cacheKey];
    if (!cachedEntry) return null;
    if (Date.now() - cachedEntry.cachedAt > GUEST_QUOTE_CACHE_TTL_MS) {
      delete quoteCacheRef.current[cacheKey];
      return null;
    }
    return cachedEntry.data;
  };
  const setCachedQuote = (
    cryptoId: string,
    currencyId: string,
    action: "BUY" | "SELL",
    data: SupportedExchangeRateResponse,
  ) => {
    quoteCacheRef.current[buildGuestQuoteCacheKey(cryptoId, currencyId, action)] =
      {
        data,
        cachedAt: Date.now(),
      };
  };
  const isRateLimitedError = (error: unknown) =>
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof (error as { response?: { status?: number } }).response?.status ===
      "number" &&
    (error as { response?: { status?: number } }).response?.status === 429;
  const getExchangeRateWithCache = async (
    cryptoId: string,
    currencyId: string,
    action: "BUY" | "SELL",
    forceRefresh = false,
  ) => {
    const cachedQuote = forceRefresh
      ? null
      : getCachedQuote(cryptoId, currencyId, action);
    if (cachedQuote) return { data: cachedQuote, fromCache: true };

    try {
      const { data, success } = await exchangeRateServiceApi.getExchangeRate(
        cryptoId,
        currencyId,
        action,
      );
      if (success && data?.fiatRate > 0) {
        setCachedQuote(cryptoId, currencyId, action, data);
        rateLimitNoticeShownRef.current = false;
        return { data, fromCache: false };
      }
      return { data: null, fromCache: false };
    } catch (error) {
      if (!forceRefresh && cachedQuote && isRateLimitedError(error)) {
        rateLimitNoticeShownRef.current = true;
        return { data: cachedQuote, fromCache: true };
      }
      throw error;
    }
  };

  // Derive NGN amount when user is typing in USD
  const ngnCurrencyObj = supportedCurrencies?.find((c) => c.code === "NGN");
  const usdCurrencyObj = supportedCurrencies?.find((c) => c.code === "USD");
  const ngnDisplayCode = ngnCurrencyObj?.code || "NGN";
  const transactionCurrencyObj = ngnCurrencyObj;
  const quoteCurrencyObj = ngnCurrencyObj ?? supportedCurrencies?.find(
    (c) => c.id === selectedCurrency,
  );
  const currSymbol = transactionCurrencyObj?.symbol || transactionCurrencyObj?.code || "₦";
  const cryptoSymbol = cryptoObj?.symbol || cryptoObj?.code || "";
  const cryptoCode = cryptoObj?.code?.toUpperCase() || cryptoSymbol.toUpperCase();

  const fetchUsdToNgnRate = async (
    cryptoId: string,
    action: "BUY" | "SELL",
  ) => {
    if (!ngnCurrencyObj || !usdCurrencyObj) {
      toast.error("USD input is not supported at this time.");
      setBuyInputCurrency("NGN");
      return null;
    }
    setUsdRateLoading(true);
    try {
      const { data } = await getExchangeRateWithCache(
        cryptoId,
        usdCurrencyObj.id,
        action,
      );
      if (data && data.fiatRate > 0 && data.usdRate > 0) {
        const resolvedRate = data.fiatRate / data.usdRate;
        setUsdToNgnRate(resolvedRate);
        return resolvedRate;
      } else {
        if (action === "BUY") setBuyInputCurrency("NGN");
        if (action === "SELL") setSellReceiveCurrency("NGN");
        return null;
      }
    } catch (error) {
      console.error("AppSimCard: failed to fetch USD conversion rate", error);
      if (usdToNgnRate) {
        return usdToNgnRate;
      }
      if (action === "BUY") setBuyInputCurrency("NGN");
      if (action === "SELL") setSellReceiveCurrency("NGN");
      return null;
    } finally {
      setUsdRateLoading(false);
    }
  };

  // The NGN amount actually used for transactions
  const ngnAmount =
    isBuy && buyInputCurrency === "USD" && usdToNgnRate && amount
      ? String(Math.round(parseFloat(amount) * usdToNgnRate))
      : amount;

  const fetchRate = async (overrideAmount?: string, forceRefresh = false) => {
    const effectiveAmount = isBuy ? overrideAmount ?? ngnAmount : overrideAmount ?? amount;
    if (!selectedCrypto || !quoteCurrencyObj?.id || !effectiveAmount) return;
    const numericAmount = parseFloat(effectiveAmount);
    if (Number.isNaN(numericAmount) || numericAmount <= 0) {
      setReceiveAmount("");
      return;
    }

    const requestId = ++quoteRequestIdRef.current;
    setQuoteLoading(true);
    try {
      const { data } = await getExchangeRateWithCache(
        selectedCrypto,
        quoteCurrencyObj.id,
        isBuy ? "BUY" : "SELL",
        forceRefresh,
      );
      if (requestId !== quoteRequestIdRef.current) return;

      if (data && data.fiatRate > 0) {
        const computed = isBuy
          ? numericAmount / data.fiatRate
          : numericAmount * data.fiatRate;
        setReceiveAmount(computed > 0 ? String(computed) : "");
      } else {
        setReceiveAmount("");
      }
    } catch (error) {
      console.error("AppSimCard: failed to compute trade preview", error);
      if (requestId === quoteRequestIdRef.current) {
        setReceiveAmount("");
      }
    } finally {
      if (requestId === quoteRequestIdRef.current) {
        setQuoteLoading(false);
      }
    }
  };

  const lookupAccountName = async (
    accountNumberValue: string,
    bankId: string,
  ) => {
    if (!bankId || accountNumberValue.length !== 10) return;

    setIsLookingUpBankName(true);
    setBankLookupError(null);
    try {
      const { data, success, message } = await bankServiceApi.lookupAccountName(
        accountNumberValue,
        bankId,
      );
      if (success && data?.accountName) {
        setAccountName(data.accountName);
        return;
      }

      setAccountName("");
      setBankLookupError(
        message || "We could not verify this account. Check the bank and account number.",
      );
    } catch (error) {
      console.error("AppSimCard: failed to look up guest bank account", error);
      setAccountName("");
      setBankLookupError(
        "We could not verify this account. Check the bank and account number.",
      );
    } finally {
      setIsLookingUpBankName(false);
    }
  };

  const handleBankSelect = (bankId: string) => {
    setSelectedBankId(bankId);
    setBankLookupError(null);
    setAccountName("");
  };

  const handleAccountNumberChange = (value: string) => {
    const digitsOnly = value.replace(/\D/g, "").slice(0, 10);
    setAccountNumber(digitsOnly);
    setAccountName("");
    setBankLookupError(null);
  };

  useEffect(() => {
    if (!selectedBankId || accountNumber.length !== 10) {
      setAccountName("");
      setBankLookupError(null);
      return;
    }

    const timeout = setTimeout(() => {
      void lookupAccountName(accountNumber, selectedBankId);
    }, 500);

    return () => clearTimeout(timeout);
  }, [accountNumber, selectedBankId]);

  useEffect(() => {
    if (!selectedCrypto) return;
    if (isBuy && buyInputCurrency === "USD") {
      void fetchUsdToNgnRate(selectedCrypto, "BUY");
    }
    if (!isBuy && sellReceiveCurrency === "USD") {
      void fetchUsdToNgnRate(selectedCrypto, "SELL");
    }
  }, [buyInputCurrency, isBuy, selectedCrypto, sellReceiveCurrency]);

  useEffect(() => {
    if (!selectedCrypto || !quoteCurrencyObj?.id || !amount) {
      setReceiveAmount("");
      setQuoteLoading(false);
      return;
    }

    if (skipNextAutoQuoteRef.current) {
      skipNextAutoQuoteRef.current = false;
      return;
    }

    if (isBuy && buyInputCurrency === "USD" && !usdToNgnRate) {
      setReceiveAmount("");
      return;
    }

    const timeout = setTimeout(() => {
      void fetchRate();
    }, 250);

    return () => clearTimeout(timeout);
  }, [
    amount,
    buyInputCurrency,
    isBuy,
    quoteCurrencyObj?.id,
    selectedCrypto,
    sellReceiveCurrency,
    usdToNgnRate,
  ]);

  useEffect(() => {
    if (!sessionId || step !== 3 || done || isBuy) {
      stopGuestTransactionPolling();
      return;
    }

    const terminalStatuses = new Set([
      "COMPLETED",
      "FAILED",
      "CANCELLED",
      "EXPIRED",
      "PAYOUT_FAILED",
    ]);

    const pollGuestTransaction = async () => {
      try {
        const { data, success } = await transactionServiceApi.getTransactionDetails(
          sessionId,
        );
        if (!success || !data) return;

        const transaction = data as TransactionResponseEntity | null;
        if (!transaction) return;

        setGuestTransactionStatus(transaction);

        if (terminalStatuses.has(transaction.status)) {
          stopGuestTransactionPolling();
          setDone(true);
        }
      } catch (error) {
        console.error("AppSimCard: failed to poll guest transaction status", error);
      }
    };

    void pollGuestTransaction();
    guestTransactionStatusPollRef.current = setInterval(
      pollGuestTransaction,
      5000,
    );

    return () => stopGuestTransactionPolling();
  }, [done, isBuy, sessionId, step]);

  const handleSellChipClick = async (targetFiatAmount: number) => {
    if (!selectedCrypto || !quoteCurrencyObj?.id) return;

    let resolvedUsdToNgnRate = usdToNgnRate;
    if (sellReceiveCurrency === "USD" && !resolvedUsdToNgnRate) {
      resolvedUsdToNgnRate = await fetchUsdToNgnRate(selectedCrypto, "SELL");
    }

    const targetNgnAmount =
      sellReceiveCurrency === "USD"
        ? targetFiatAmount * (resolvedUsdToNgnRate || 0)
        : targetFiatAmount;
    if (!targetNgnAmount || Number.isNaN(targetNgnAmount)) return;

    const { data } = await getExchangeRateWithCache(
      selectedCrypto,
      quoteCurrencyObj.id,
      "SELL",
    );
    if (!data?.fiatRate) return;

    const roundedCryptoAmount = formatCryptoAmountForDisplay(
      (targetNgnAmount / data.fiatRate).toFixed(8),
    );
    const computedReceiveAmount = targetNgnAmount.toFixed(2);
    skipNextAutoQuoteRef.current = true;
    setAmount(roundedCryptoAmount);
    setReceiveAmount(computedReceiveAmount);
    setActiveSellPreset(targetFiatAmount);
  };

  const handleStep1Next = async () => {
    if (!selectedCrypto || !quoteCurrencyObj?.id || !amount) return;
    // Commit NGN amount so downstream steps always use NGN
    if (isBuy && buyInputCurrency === "USD" && usdToNgnRate) {
      const committed = String(Math.round(parseFloat(amount) * usdToNgnRate));
      setAmount(committed);
      setBuyInputCurrency("NGN");
      await fetchRate(committed);
    } else {
      await fetchRate(undefined, true).catch(() => undefined);
    }
    setStep(2);
  };

  const handleBuyStep2Next = async (retrying = false) => {
    if (!email || !walletAddress || !transactionCurrencyObj?.id) return;
    setLoading(true);
    try {
      const res = await transactionServiceApi.initiateTransactionAnonymousUser({
        action: "BUY",
        coinId: selectedCrypto,
        currencyId: transactionCurrencyObj?.id,
        amountToSend: parseFloat(amount),
        amountToReceive: parseFloat(receiveAmount) || 0,
        email,
        walletAddress,
        network,
      });
      if (!res?.success) {
        if (isExchangeRateExpiryError(res?.message) && !retrying) {
          await fetchRate(undefined, true).catch(() => undefined);
          return await handleBuyStep2Next(true);
        }
        toast.error(res?.message || "Failed to initiate transaction");
        return;
      }
      if (res?.data) {
        setSessionId((res.data as any).sessionId || "");
        setGuestTransactionStatus(null);
        const bank = await bankServiceApi.getPlatformBankDetails();
        if (!bank?.success) {
          toast.error(bank?.message || "Failed to fetch payment details");
          return;
        }
        setPlatformBank(bank.data);
        setStep(3);
      }
    } catch (err: any) {
      if (isExchangeRateExpiryError(err) && !retrying) {
        await fetchRate(undefined, true).catch(() => undefined);
        return await handleBuyStep2Next(true);
      }
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Something went wrong. Please try again.";
      if (!isExchangeRateExpiryError(err)) {
        toast.error(msg);
      }
    }
    setLoading(false);
  };

  const handleSellStep2Next = async (retrying = false) => {
    if (!email || !selectedBankId || !accountNumber || !accountName || !transactionCurrencyObj?.id) return;
    setLoading(true);
    try {
      const bankAccount = await bankServiceApi.createAnonymousUserBankAccount({
        email,
        bankId: selectedBankId,
        accountHolderName: accountName,
        accountNumber,
        isDefault: false,
      });

      if (!bankAccount?.success || !bankAccount?.data?.id) {
        if (isExchangeRateExpiryError(bankAccount?.message) && !retrying) {
          await fetchRate(undefined, true).catch(() => undefined);
          return await handleSellStep2Next(true);
        }
        toast.error(bankAccount?.message || "Failed to save bank account");
        return;
      }

      const res = await transactionServiceApi.initiateTransactionAnonymousUser({
        action: "SELL",
        coinId: selectedCrypto,
        currencyId: transactionCurrencyObj?.id,
        amountToSend: parseFloat(amount),
        amountToReceive: parseFloat(receiveAmount) || 0,
        email,
        accountId: bankAccount.data.id,
        network,
      });
      if (!res?.success) {
        if (isExchangeRateExpiryError(res?.message) && !retrying) {
          await fetchRate(undefined, true).catch(() => undefined);
          return await handleSellStep2Next(true);
        }
        toast.error(res?.message || "Failed to initiate transaction");
        return;
      }
      if (res?.data) {
        const session = (res.data as any).sessionId || "";
        setSessionId(session);
        setGuestTransactionStatus(null);
        const wallet = await cryptoServiceApi.allocateGuestSellWallet({
          sessionId: session,
          cryptoId: selectedCrypto,
          network,
        });
        if (!wallet?.success) {
          toast.error(wallet?.message || "Failed to fetch deposit wallet");
          return;
        }
        setDepositWallet((wallet.data as any)?.walletAddress || "");
        setStep(3);
      }
    } catch (err: any) {
      if (isExchangeRateExpiryError(err) && !retrying) {
        await fetchRate(undefined, true).catch(() => undefined);
        return await handleSellStep2Next(true);
      }
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Something went wrong. Please try again.";
      if (!isExchangeRateExpiryError(err)) {
        toast.error(msg);
      }
    }
    setLoading(false);
  };

  const handleBuySubmit = async () => {
    setLoading(true);
    try {
      if (receiptFile) {
        const fd = new FormData();
        fd.append("file", receiptFile);
        sessionStorage.setItem("transactionSessionId", sessionId);
        await transactionServiceApi.uploadTransactionReceipt(fd);
      }
      setDone(true);
    } catch (error) {
      console.error("AppSimCard: failed to upload receipt", error);
    }
    setLoading(false);
  };

  const copyToClipboard = (text: string) => navigator.clipboard.writeText(text);

  const reset = () => {
    setStep(1);
    setDone(false);
    setAmount("");
    setReceiveAmount("");
    setEmail("");
    setWalletAddress("");
    setSelectedBankId("");
    setBankName("");
    setAccountNumber("");
    setAccountName("");
    setBankLookupError(null);
    setReceiptFile(null);
    setPlatformBank(null);
    setDepositWallet("");
    setSessionId("");
    setGuestTransactionStatus(null);
    stopGuestTransactionPolling();
    setBuyInputCurrency("NGN");
    setSellReceiveCurrency("NGN");
    setUsdToNgnRate(null);
    setActiveSellPreset(null);
    setNetwork(getDefaultNetworkForCrypto(cryptoObj));
    localStorage.removeItem(LS_KEY);
  };

  const allowedNetworks = ALL_NETWORKS.filter((n) =>
    (CRYPTO_NETWORKS[cryptoCode] ?? ALL_NETWORKS.map((x) => x.id)).includes(
      n.id
    )
  );
  const networkLabel =
    ALL_NETWORKS.find((n) => n.id === network)?.label || network || "Select network";

  return (
    <div
      className="relative flex flex-col overflow-hidden"
      style={{
        width: "min(480px, calc(100vw - 32px))",
        background: "#F7F7F8",
        borderRadius: "20px",
        boxShadow:
          "0 8px 48px rgba(0,0,0,0.10), 0 2px 12px rgba(148,142,238,0.10)",
        border: "1px solid rgba(0,0,0,0.06)",
      }}
    >
      {/* Tabs */}
      <div
        className="flex border-b border-gray-200 bg-white"
        style={{ borderRadius: "20px 20px 0 0" }}
      >
        {(["BUY", "SELL"] as const).map((t) => {
          const active = tab === t;
          const color = t === "BUY" ? "#948EEE" : "#22c55e";
          return (
            <button
              key={t}
              onClick={() => {
                setTab(t);
                reset();
              }}
              className="flex-1 py-4 text-sm font-semibold transition-all cursor-pointer border-b-2 -mb-px flex items-center justify-center gap-2"
              style={{
                borderBottomColor: active ? color : "transparent",
                color: active ? color : "#9CA3AF",
              }}
            >
              {t === "BUY" ? (
                <CreditCard size={16} weight="duotone" />
              ) : (
                <ArrowCircleUp size={16} weight="duotone" />
              )}
              {t === "BUY" ? "Buy Crypto" : "Sell Crypto"}
            </button>
          );
        })}
      </div>

      {/* Step content */}
      <div className="relative px-5 pb-6 pt-4 overflow-hidden">
        <AnimatePresence mode="wait">
          {/* ── STEP 1 ── */}
          {step === 1 && !done && (
            <motion.div
              key="s1"
              {...slide}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-4"
            >
              {/* Step label */}
              <p className="text-center text-sm text-gray-400">
                Step 1 of {isBuy ? "3" : "2"} ·{" "}
                {isBuy ? "Select & Amount" : "Select & Amount"}
              </p>

              {/* Crypto picker */}
              {loadingSupportedCrypto && !supportedCryptoCurrencies ? (
                <div className="flex gap-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="flex-1 h-20 rounded-xl bg-gray-100 animate-pulse"
                    />
                  ))}
                </div>
              ) : !supportedCryptoCurrencies ||
                supportedCryptoCurrencies.length === 0 ? (
                <div className="rounded-xl border border-dashed border-gray-200 bg-white px-4 py-6 text-center text-sm text-gray-400">
                  Crypto assets are unavailable right now.
                </div>
              ) : (
                <div className="flex gap-2">
                  {supportedCryptoCurrencies.map((item) => (
                  <TokenBtn
                    key={item.id}
                    item={item}
                    selected={item.id === selectedCrypto}
                    onSelect={() => {
                      setSelectedCrypto(item.id);
                      setReceiveAmount("");
                      setActiveSellPreset(null);
                      setNetwork(getDefaultNetworkForCrypto(item));
                    }}
                  />
                  ))}
                </div>
              )}

              {/* Amount input box */}
              <div
                className="rounded-xl overflow-hidden"
                style={{ background: "white", border: "1.5px solid #E8E8E8" }}
              >
                <div className="flex items-center justify-between pt-3 pb-1 px-4">
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
                    {isBuy
                      ? `Amount in ${buyInputCurrency}`
                      : `Amount in ${cryptoSymbol || "Crypto"}`}
                  </p>
                  {/* NGN / USD toggle */}
                  {(!loadingSupportedCurrencies || supportedCurrencies?.length) && usdCurrencyObj && (
                    <div
                      className="flex rounded-lg overflow-hidden"
                      style={{ border: "1px solid #E8E8E8" }}
                    >
                      {(["NGN", "USD"] as const).map((cur) => {
                        const activeCur = isBuy
                          ? buyInputCurrency
                          : sellReceiveCurrency;
                        return (
                          <button
                            key={cur}
                            onClick={() => {
                              if (cur === activeCur) return;
                              if (isBuy) {
                                setBuyInputCurrency(cur);
                                setAmount("");
                                setReceiveAmount("");
                                setActiveSellPreset(null);
                              } else {
                                setSellReceiveCurrency(cur);
                                setAmount("");
                                setReceiveAmount("");
                                setActiveSellPreset(null);
                              }
                            }}
                            className="px-2.5 py-1 text-[10px] font-bold cursor-pointer transition-colors"
                            style={{
                              background:
                                activeCur === cur
                                  ? isBuy
                                    ? "#948EEE"
                                    : "#22c55e"
                                  : "transparent",
                              color: activeCur === cur ? "white" : "#9CA3AF",
                            }}
                          >
                            {cur}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
                <div className="flex items-center px-4 pb-3 gap-2">
                  <span className="text-2xl font-bold text-gray-300">
                    {isBuy
                      ? buyInputCurrency === "USD"
                        ? "$"
                        : "₦"
                      : cryptoSymbol}
                  </span>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={amount}
                    onChange={(e) => {
                      setAmount(e.target.value);
                      setReceiveAmount("");
                      if (!isBuy) setActiveSellPreset(null);
                    }}
                    placeholder="0"
                    className="flex-1 bg-transparent outline-none text-2xl font-bold text-[#0E0F0C] placeholder:text-gray-200"
                  />
                </div>
                {/* BUY: NGN equivalent preview when typing in USD */}
                {isBuy && buyInputCurrency === "USD" && amount && (
                  <div className="px-4 pb-2 -mt-1">
                    {usdRateLoading ? (
                      <span className="text-xs text-gray-400">
                        Fetching rate…
                      </span>
                    ) : usdToNgnRate ? (
                      <span className="text-xs text-gray-400">
                        ≈{" "}
                        <span className="font-semibold text-[#0E0F0C]">
                          ₦
                          {Math.round(
                            parseFloat(amount) * usdToNgnRate
                          ).toLocaleString()}
                        </span>{" "}
                        NGN will be transferred
                      </span>
                    ) : null}
                  </div>
                )}
                {/* SELL: USD receive preview */}
                {!isBuy && receiveAmount && usdToNgnRate && (
                  <div className="px-4 pb-2 -mt-1">
                    {usdRateLoading ? (
                      <span className="text-xs text-gray-400">
                        Fetching rate…
                      </span>
                    ) : usdToNgnRate ? (
                      <span className="text-xs text-gray-400">
                        ≈{" "}
                        <span className="font-semibold text-[#0E0F0C]">
                          {formatUsdEquivalentDisplay(
                            parseFloat(receiveAmount) / usdToNgnRate,
                          )}
                        </span>{" "}
                      </span>
                    ) : null}
                  </div>
                )}
                {/* Quick chips */}
                <div className="flex border-t border-gray-100">
                  {(isBuy
                    ? buyChips.map((chip) => ({ value: chip, label: formatChip(chip, buyInputCurrency) }))
                    : sellChipItems
                  ).map((chip) => {
                    const isActive = isBuy
                      ? amount === String(chip.value)
                      : activeSellPreset === chip.value;
                    return (
                      <button
                        key={chip.value}
                        onClick={() => {
                          if (isBuy) {
                            setAmount(String(chip.value));
                            setReceiveAmount("");
                            return;
                          }
                          void handleSellChipClick(chip.value);
                        }}
                        className="flex-1 py-2.5 text-xs font-semibold border-r border-gray-100 last:border-r-0 cursor-pointer transition-colors"
                        data-active={isActive}
                        style={{
                          background: isActive
                            ? "rgba(148,142,238,0.08)"
                            : "transparent",
                          color: isActive ? "#948EEE" : "#6B7280",
                        }}
                      >
                        {chip.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Rate / receive preview */}
              {(quoteLoading || receiveAmount) && (
                <p className="text-center text-sm text-gray-400">
                  {quoteLoading ? (
                    "Calculating preview..."
                  ) : (
                    <>
                      You receive:{" "}
                      <span className="font-bold text-[#22c55e]">
                        {isBuy
                          ? `${formatReceiveCryptoDisplay(receiveAmount)} ${cryptoSymbol}`
                          : formatReceiveNgnDisplay(receiveAmount)}
                      </span>
                    </>
                  )}
                </p>
              )}

              <button
                onClick={handleStep1Next}
                disabled={
                  !amount || !selectedCrypto || !quoteCurrencyObj?.id || quoteLoading
                }
                className="w-full py-3.5 rounded-xl font-bold text-sm text-white border-none transition-opacity disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                style={{ background: isBuy ? "#948EEE" : "#22c55e" }}
              >
                {!amount || !selectedCrypto ? (
                  "Select crypto & enter amount"
                ) : (
                  <span className="flex items-center justify-center gap-1.5">
                    Continue <ArrowRight size={15} weight="bold" />
                  </span>
                )}
              </button>

              {/* Upsell */}
              <div
                className="rounded-xl p-4 flex flex-col gap-2"
                style={{ background: "white", border: "1.5px solid #E8E8E8" }}
              >
                <p className="text-sm font-bold text-[#0E0F0C] flex items-center gap-1.5">
                  <Lock size={15} weight="duotone" /> Unlock More with an
                  Account
                </p>
                <p className="text-xs text-gray-400">
                  Higher limits · Full order history · Priority support · Faster
                  trades
                </p>
                <div className="flex gap-2 mt-1">
                  <button
                    onClick={() => navigate({ to: ROUTES.SIGNUP })}
                    className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white border-none cursor-pointer"
                    style={{ background: "#948EEE" }}
                  >
                    Sign up free
                  </button>
                  <button
                    onClick={() => navigate({ to: ROUTES.SIGNIN })}
                    className="flex-1 py-2.5 rounded-xl text-sm font-bold cursor-pointer"
                    style={{
                      background: "white",
                      border: "1.5px solid #948EEE",
                      color: "#948EEE",
                    }}
                  >
                    Log in
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── STEP 2 BUY: wallet + email ── */}
          {step === 2 && isBuy && !done && (
            <motion.div
              key="s2buy"
              {...slide}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-3"
            >
              <p className="text-center text-sm text-gray-400">
                Step 2 of 3 · Enter your wallet
              </p>

              {/* Summary */}
              <div
                className="rounded-xl p-3"
                style={{ background: "white", border: "1.5px solid #E8E8E8" }}
              >
                <SRow label="Buying" value={`${cryptoSymbol} with Naira`} />
                <SRow
                  label="Amount to Pay"
                  value={`${currSymbol}${parseFloat(amount).toLocaleString()}`}
                />
                {receiveAmount && (
                  <SRow
                    label="You'll Receive"
                    value={`${formatReceiveCryptoDisplay(receiveAmount)} ${cryptoSymbol}`}
                    green
                  />
                )}
              </div>

              <FloatInput
                label="Your Email Address"
                value={email}
                onChange={setEmail}
                placeholder="you@email.com"
                type="email"
              />
              <FloatInput
                label="Your Wallet Address"
                value={walletAddress}
                onChange={setWalletAddress}
                placeholder="e.g. TQmBY4Mn..."
                mono
              />

              {/* Network selector — hidden when only one option */}
              {allowedNetworks.length > 1 ? (
                <button
                  onClick={() => setShowNetworkPicker(true)}
                  className="flex flex-col rounded-xl px-4 pt-2 pb-2.5 text-left cursor-pointer"
                  style={{
                    background: "#F5F5F5",
                    border: "1.5px solid #E8E8E8",
                  }}
                >
                  <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1">
                    Network
                  </span>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-[#0E0F0C]">
                      {networkLabel}
                    </span>
                    <span className="text-gray-400 text-xs">▾</span>
                  </div>
                </button>
              ) : (
                <div
                  className="flex flex-col rounded-xl px-4 pt-2 pb-2.5"
                  style={{
                    background: "#F5F5F5",
                    border: "1.5px solid #E8E8E8",
                  }}
                >
                  <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1">
                    Network
                  </span>
                  <span className="text-sm font-medium text-[#0E0F0C]">
                    {networkLabel}
                  </span>
                </div>
              )}

              {/* Network picker overlay */}
              <AnimatePresence>
                {showNetworkPicker && (
                  <motion.div
                    ref={networkPickerRef}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 12 }}
                    transition={{ duration: 0.15 }}
                    className="absolute inset-x-0 bottom-0 z-50"
                    style={{
                      background: "#1a1a2e",
                      borderRadius: "16px 16px 20px 20px",
                    }}
                  >
                    <div className="px-4 pt-4 pb-3 flex flex-col gap-0.5">
                      <p className="text-white/50 text-xs font-semibold uppercase tracking-widest mb-2">
                        Select network
                      </p>
                      {allowedNetworks.map((n) => (
                        <button
                          key={n.id}
                          onClick={() => {
                            setNetwork(n.id);
                            setShowNetworkPicker(false);
                          }}
                          className="flex items-center gap-3 py-3 border-b border-white/10 cursor-pointer bg-transparent last:border-0"
                        >
                          <div
                            className="w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center"
                            style={{
                              borderColor:
                                network === n.id
                                  ? "#948EEE"
                                  : "rgba(255,255,255,0.3)",
                            }}
                          >
                            {network === n.id && (
                              <div className="w-2 h-2 rounded-full bg-[#948EEE]" />
                            )}
                          </div>
                          <span
                            className={`text-sm font-semibold ${
                              network === n.id ? "text-[#948EEE]" : "text-white"
                            }`}
                          >
                            {n.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex gap-2">
                <button
                  onClick={() => setStep(1)}
                  className="px-4 py-3 rounded-xl text-sm text-gray-400 cursor-pointer"
                  style={{ background: "white", border: "1.5px solid #E8E8E8" }}
                >
                  <span className="flex items-center gap-1.5">
                    <ArrowLeft size={15} weight="bold" /> Back
                  </span>
                </button>
                <button
                  onClick={() => {
                    void handleBuyStep2Next();
                  }}
                  disabled={!email || !walletAddress || loading}
                  className="flex-1 py-3 rounded-xl font-bold text-sm text-white border-none transition-opacity disabled:opacity-40 cursor-pointer"
                  style={{ background: "#948EEE" }}
                >
                  {loading ? (
                    "Processing..."
                  ) : (
                    <span className="flex items-center justify-center gap-1.5">
                      See Payment Details <ArrowRight size={15} weight="bold" />
                    </span>
                  )}
                </button>
              </div>
            </motion.div>
          )}

          {/* ── STEP 2 SELL: bank details ── */}
          {step === 2 && !isBuy && !done && (
            <motion.div
              key="s2sell"
              {...slide}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-3"
            >
              <p className="text-center text-sm text-gray-400">
                Step 2 of 2 · Payment details
              </p>

              <div
                className="rounded-xl p-3"
                style={{ background: "white", border: "1.5px solid #E8E8E8" }}
              >
                <SRow label="Selling" value={cryptoSymbol} />
                <SRow label="You Send" value={`${amount} ${cryptoSymbol}`} />
                {receiveAmount && (
                  <SRow
                    label="You Receive"
                    value={formatReceiveNgnDisplay(receiveAmount)}
                    green
                  />
                )}
              </div>

              <FloatInput
                label="Your Email Address"
                value={email}
                onChange={setEmail}
                placeholder="you@email.com — for payout updates"
                type="email"
              />
              <BankSelector
                label="Your Bank"
                placeholder="Select bank"
                options={!loadingAllBanks ? allBanks : []}
                value={selectedBankId}
                onValueChange={handleBankSelect}
              />
              <FloatInput
                label="Account Number"
                value={accountNumber}
                onChange={handleAccountNumberChange}
                placeholder="0000000000"
                maxLength={10}
                mono
                inputMode="numeric"
              />
              <FloatInput
                label="Account Name"
                value={accountName}
                onChange={setAccountName}
                placeholder={isLookingUpBankName ? "Looking up account name..." : "Will auto-fill after verification"}
                readOnly
              />
              {bankLookupError && (
                <p className="text-xs text-red-500 -mt-1">{bankLookupError}</p>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => setStep(1)}
                  className="px-4 py-3 rounded-xl text-sm text-gray-400 cursor-pointer"
                  style={{ background: "white", border: "1.5px solid #E8E8E8" }}
                >
                  <span className="flex items-center gap-1.5">
                    <ArrowLeft size={15} weight="bold" /> Back
                  </span>
                </button>
                <button
                  onClick={() => {
                    void handleSellStep2Next();
                  }}
                  disabled={
                    !email ||
                    !selectedBankId ||
                    !accountNumber ||
                    !accountName ||
                    loading
                  }
                  className="flex-1 py-3 rounded-xl font-bold text-sm text-white border-none transition-opacity disabled:opacity-40 cursor-pointer"
                  style={{ background: "#22c55e" }}
                >
                  {loading ? (
                    "Processing..."
                  ) : (
                    <span className="flex items-center justify-center gap-1.5">
                      Get My Deposit Wallet{" "}
                      <ArrowRight size={15} weight="bold" />
                    </span>
                  )}
                </button>
              </div>
            </motion.div>
          )}

          {/* ── STEP 3 BUY: bank transfer + receipt ── */}
          {step === 3 && isBuy && !done && (
            <motion.div
              key="s3buy"
              {...slide}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-3"
            >
              <p className="text-center text-sm text-gray-400">
                Step 3 of 3 · Buy crypto with Naira
              </p>

              {/* Dark bank box */}
              {platformBank && (
                <div
                  className="rounded-xl p-4 relative"
                  style={{
                    background:
                      "linear-gradient(135deg, #1e2a6e 0%, #2d3a8c 100%)",
                  }}
                >
                  <p className="text-center text-[10px] font-semibold text-white/50 uppercase tracking-widest mb-2">
                    Transfer to this account
                  </p>
                  <button
                    onClick={() => copyToClipboard(platformBank.accountNumber)}
                    className="absolute top-3 right-3 text-[10px] font-semibold px-3 py-1.5 rounded-lg cursor-pointer"
                    style={{
                      background: "rgba(255,255,255,0.15)",
                      color: "white",
                      border: "1px solid rgba(255,255,255,0.2)",
                    }}
                  >
                    Copy
                  </button>
                  <p className="text-center text-white font-bold text-base mb-1">
                    {platformBank.bankName}
                  </p>
                  <p
                    className="text-center text-white font-bold text-3xl tracking-wider mb-1"
                    style={{ fontFamily: "monospace" }}
                  >
                    {platformBank.accountNumber}
                  </p>
                  <p className="text-center text-white/50 text-xs uppercase tracking-widest mb-3">
                    CRYPTONOW · {platformBank.accountHolderName}
                  </p>
                  <div
                    className="flex justify-between items-center rounded-lg px-4 py-2.5"
                    style={{ background: "rgba(255,255,255,0.1)" }}
                  >
                    <span className="text-white/60 text-sm">Send exactly</span>
                    <span className="text-white font-bold text-lg">
                      {currSymbol}
                      {parseFloat(amount).toLocaleString()}
                    </span>
                  </div>
                </div>
              )}

              {/* Order summary */}
              <div
                className="rounded-xl p-3"
                style={{ background: "white", border: "1.5px solid #E8E8E8" }}
              >
                <SRow label="Buying" value={`${cryptoSymbol} with Naira`} />
                <SRow
                  label="Amount to Pay"
                  value={`${currSymbol}${parseFloat(amount).toLocaleString()}`}
                />
                {receiveAmount && (
                  <SRow
                    label="You'll Get"
                    value={`${parseFloat(receiveAmount).toFixed(
                      4
                    )} ${cryptoSymbol}`}
                    green
                  />
                )}
                <SRow
                  label="To Wallet"
                  value={
                    walletAddress.slice(0, 8) + "…" + walletAddress.slice(-6)
                  }
                />
                <SRow label="Network" value={networkLabel} />
              </div>

              {/* Warning */}
              <div
                className="flex gap-2 items-start rounded-xl p-3"
                style={{ background: "#FFFBEB", border: "1.5px solid #FDE68A" }}
              >
                <Warning
                  size={18}
                  weight="duotone"
                  className="flex-shrink-0 text-amber-500"
                />
                <p className="text-xs text-amber-700 leading-relaxed">
                  Transfer the <strong>exact amount</strong>. Then upload your
                  receipt below for verification.
                </p>
              </div>

              {/* Receipt upload */}
              <div
                onClick={() => fileRef.current?.click()}
                className="flex flex-col items-center gap-2 py-6 rounded-xl cursor-pointer transition-colors"
                style={{ background: "white", border: "1.5px dashed #D1D5DB" }}
              >
                <Receipt size={32} weight="duotone" className="text-gray-400" />
                <p className="text-sm font-bold text-[#0E0F0C]">
                  {receiptFile ? receiptFile.name : "Upload Receipt"}
                </p>
                <p className="text-xs text-gray-400">
                  Screenshot or PDF of your transfer
                </p>
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*,.pdf"
                className="hidden"
                onChange={(e) => setReceiptFile(e.target.files?.[0] || null)}
              />

              <div className="flex gap-2">
                <button
                  onClick={() => setStep(2)}
                  className="px-4 py-3.5 rounded-xl text-sm text-gray-400 cursor-pointer flex-shrink-0"
                  style={{ background: "white", border: "1.5px solid #E8E8E8" }}
                >
                  <span className="flex items-center gap-1.5">
                    <ArrowLeft size={15} weight="bold" /> Back
                  </span>
                </button>
                <button
                  onClick={handleBuySubmit}
                  disabled={loading}
                  className="flex-1 py-3.5 rounded-xl font-bold text-sm text-white border-none disabled:opacity-40 cursor-pointer"
                  style={{ background: "#948EEE" }}
                >
                  {loading ? "Submitting..." : "Submit & Track Order"}
                </button>
              </div>
              <button
                onClick={() => setDone(true)}
                className="text-center text-xs text-gray-400 hover:underline cursor-pointer bg-transparent border-none py-1"
              >
                Skip — upload later
              </button>
            </motion.div>
          )}

          {/* ── STEP 3 SELL: deposit wallet ── */}
          {step === 3 && !isBuy && !done && (
            <motion.div
              key="s3sell"
              {...slide}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-3"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-[#0E0F0C]">
                  Send to this wallet
                </p>
                {(() => {
                  const status = guestTransactionStatus?.status;
                  const meta = getGuestStatusMeta(status);
                  const tone = GUEST_STATUS_TONE_STYLES[meta.tone];
                  const isActive = isGuestSellTransactionActive(status);

                  return (
                    <span
                      className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${tone.badge}`}
                    >
                      {isActive ? (
                        <span className="inline-flex h-3.5 w-3.5 items-center justify-center">
                          <span className={`h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent ${tone.text}`} />
                        </span>
                      ) : (
                        <span className={`w-2 h-2 rounded-full inline-block ${tone.dot}`} />
                      )}
                      <span className="flex items-center gap-1">
                        <span>{meta.emoji}</span>
                        <span>{meta.label}</span>
                      </span>
                    </span>
                  );
                })()}
              </div>

              <div
                className="rounded-xl p-3"
                style={{ background: "white", border: "1.5px solid #E8E8E8" }}
              >
                <SRow label="Amount to Send" value={`${amount} ${cryptoSymbol}`} />
                <SRow label="Asset" value={cryptoSymbol} />
                <SRow label="Network" value={networkLabel} />
              </div>

              {/* Wallet box */}
              <div
                className="rounded-xl p-4 relative"
                style={{ background: "#F5F5F5", border: "1.5px solid #E8E8E8" }}
              >
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2">
                  Your unique {cryptoSymbol} deposit wallet ({networkLabel})
                </p>
                <p className="text-sm font-mono text-[#22c55e] break-all leading-relaxed">
                  {depositWallet}
                </p>
                <button
                  onClick={() => copyToClipboard(depositWallet)}
                  className="absolute top-3 right-3 text-[10px] font-semibold px-3 py-1.5 rounded-lg cursor-pointer"
                  style={{
                    background: "white",
                    border: "1.5px solid #E8E8E8",
                    color: "#948EEE",
                  }}
                >
                  Copy
                </button>
              </div>

              {/* Info */}
              <div
                className="flex gap-2 items-start rounded-xl p-3"
                style={{ background: "white", border: "1.5px solid #E8E8E8" }}
              >
                <Lightning
                  size={18}
                  weight="duotone"
                  className="flex-shrink-0 text-[#948EEE]"
                />
                <p className="text-xs text-gray-500 leading-relaxed">
                  <strong>Send &amp; forget.</strong> Once we detect your
                  crypto, NGN is sent to your bank instantly. No further action
                  needed.
                </p>
              </div>

              {/* Summary */}
              <div
                className="rounded-xl p-3"
                style={{ background: "white", border: "1.5px solid #E8E8E8" }}
              >
                <SRow label="Payout Bank" value={bankName} />
                <SRow label="Account" value={accountNumber} />
                {guestTransactionStatus?.status && (
                  <SRow label="Status" value={guestTransactionStatus.status} />
                )}
                {receiveAmount && (
                  <SRow
                    label="NGN to Credit"
                    value={formatReceiveNgnDisplay(receiveAmount)}
                    green
                  />
                )}
              </div>

              <button
                onClick={() => setStep(2)}
                className="w-full py-2.5 rounded-xl text-sm text-gray-400 cursor-pointer"
                style={{ background: "white", border: "1.5px solid #E8E8E8" }}
              >
                <span className="flex items-center gap-1.5">
                  <ArrowLeft size={15} weight="bold" /> Back
                </span>
              </button>
            </motion.div>
          )}

          {/* ── SUCCESS ── */}
          {done && (
            <motion.div
              key="done"
              {...slide}
              transition={{ duration: 0.2 }}
              className="flex flex-col items-center gap-4 py-4"
            >
              {guestPayoutFailed ? (
                <>
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center"
                    style={{ background: "#FEE2E2" }}
                  >
                    <Warning size={30} weight="fill" className="text-rose-600" />
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-xl text-[#0E0F0C]">
                      {getGuestPayoutFailureCopy(guestTransactionStatus?.payoutFailureReason).title}
                    </p>
                    <p className="text-xs text-gray-500 mt-1 px-3 leading-relaxed">
                      {getGuestPayoutFailureCopy(guestTransactionStatus?.payoutFailureReason).subtitle}
                    </p>
                  </div>
                  <div
                    className="w-full rounded-xl p-4 text-left"
                    style={{ background: "#FFF1F2", border: "1px solid #FECDD3" }}
                  >
                    <p className="text-sm font-bold text-rose-700">
                      Support is already working on it
                    </p>
                    <p className="text-xs mt-1 leading-relaxed text-rose-700/90">
                      We’ll notify you as soon as this is resolved. Sorry for the delay.
                    </p>
                    <p className="text-[11px] mt-2 leading-relaxed text-rose-600/80 break-words">
                      {getGuestPayoutFailureCopy(guestTransactionStatus?.payoutFailureReason).body}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center"
                    style={{ background: "#22c55e" }}
                  >
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M5 13l4 4L19 7"
                        stroke="white"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-xl text-[#0E0F0C]">
                      {isBuy ? "Payment Submitted!" : "NGN Credited!"}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {isBuy
                        ? "We'll confirm your transfer and send your crypto."
                        : "Crypto received & auto-converted. Your bank account has been credited."}
                    </p>
                  </div>
                </>
              )}

              <div
                className="w-full rounded-xl p-3"
                style={{ background: "white", border: "1.5px solid #E8E8E8" }}
              >
                {isBuy ? (
                  <>
                    <SRow label="Buying" value={cryptoSymbol} />
                    {receiveAmount && (
                      <SRow
                        label="You'll Get"
                        value={`${formatReceiveCryptoDisplay(receiveAmount)} ${cryptoSymbol}`}
                        green
                      />
                    )}
                    <SRow label="Updates to" value={email} />
                  </>
                ) : (
                  <>
                    <SRow
                      label="Crypto Sold"
                      value={`${amount} ${cryptoSymbol}`}
                    />
                    {receiveAmount && (
                      <SRow
                        label="NGN Sent"
                        value={formatReceiveNgnDisplay(receiveAmount)}
                        green
                      />
                    )}
                    <SRow label="Sent To Bank" value={bankName} />
                    <SRow label="Account No." value={accountNumber} />
                    <SRow label="Updates to" value={email} />
                  </>
                )}
              </div>

              {/* Upsell */}
              <div
                className="w-full rounded-xl p-4"
                style={{ background: "#F5F5F5", border: "1.5px solid #E8E8E8" }}
              >
                <p className="text-sm font-bold text-[#0E0F0C] mb-1 flex items-center gap-1.5">
                  <TrendUp size={15} weight="duotone" /> Get the Full Experience
                </p>
                <p className="text-xs text-gray-400 mb-3">
                  Sign up free to unlock order history, higher limits up to
                  $10,000, priority support, and faster conversions.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate({ to: ROUTES.SIGNUP })}
                    className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white border-none cursor-pointer"
                    style={{ background: "#948EEE" }}
                  >
                    Sign up free
                  </button>
                  <button
                    onClick={reset}
                    className="flex-1 py-2.5 rounded-xl text-sm font-bold cursor-pointer"
                    style={{
                      background: "white",
                      border: "1.5px solid #E8E8E8",
                      color: "#6B7280",
                    }}
                  >
                    New trade
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AppSimCard;
