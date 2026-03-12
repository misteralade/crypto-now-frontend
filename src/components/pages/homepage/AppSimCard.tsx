import { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import { AnimatePresence, motion } from "framer-motion";
import { CreditCard, ArrowCircleUp, Lock, Warning, Receipt, Lightning, TrendUp, ArrowLeft, ArrowRight } from "@phosphor-icons/react";
import { useTradeCryptoCurrenciesButton } from "../../../hooks/components/useTradeCryptoCurrenciesButton.ts";
import { transactionServiceApi } from "../../../api/transaction.api.ts";
import { bankServiceApi } from "../../../api/bank.api.ts";
import { cryptoServiceApi } from "../../../api/crypto.api.ts";
import { exchangeRateServiceApi } from "../../../api/rate.api.ts";
import type { SupportedCryptoOrCurrencyResponse } from "../../../types/response.payload.types.ts";
import { ROUTES } from "../../../util/constants.util.ts";
import { useNavigate } from "@tanstack/react-router";

const ALL_NETWORKS = [
  { id: "TRC20",  label: "TRC20 (Tron)" },
  { id: "ERC20",  label: "ERC20 (Ethereum)" },
  { id: "BTC",    label: "Bitcoin (BTC)" },
  { id: "SOLANA", label: "Solana (SOL)" },
];

// Maps crypto symbol (uppercase) → allowed network IDs
const CRYPTO_NETWORKS: Record<string, string[]> = {
  BTC:  ["BTC"],
  USDT: ["TRC20", "ERC20"],
  SOL:  ["SOLANA"],
};

// Default network to pre-select for each crypto
const CRYPTO_DEFAULT_NETWORK: Record<string, string> = {
  BTC:  "BTC",
  USDT: "TRC20",
  SOL:  "SOLANA",
};

// ── Crypto token button ───────────────────────────────────────────────────────
const TokenBtn = ({
  item, selected, onSelect,
}: { item: SupportedCryptoOrCurrencyResponse; selected: boolean; onSelect: () => void }) => (
  <button
    onClick={onSelect}
    className="flex-1 flex flex-col items-center py-3 px-1 rounded-xl transition-all cursor-pointer gap-1"
    style={{
      background: selected ? "rgba(148,142,238,0.1)" : "#F5F5F5",
      border: selected ? "1.5px solid #948EEE" : "1.5px solid transparent",
      minWidth: 0,
    }}
  >
    <div className="w-8 h-8 flex items-center justify-center">
      {item.logoUrl
        ? <img src={item.logoUrl} alt={item.code} className="w-7 h-7 object-contain" />
        : <span className="text-base font-bold text-gray-400">{item.code?.charAt(0)}</span>}
    </div>
    <span className={`text-xs font-bold leading-none ${selected ? "text-[#948EEE]" : "text-[#0E0F0C]"}`}>
      {item.code || item.symbol}
    </span>
  </button>
);

// ── Summary row ───────────────────────────────────────────────────────────────
const SRow = ({ label, value, green }: { label: string; value: string; green?: boolean }) => (
  <div className="flex justify-between items-center text-sm py-0.5">
    <span className="text-gray-400">{label}</span>
    <span className={`font-semibold ${green ? "text-[#22c55e]" : "text-[#0E0F0C]"}`}>{value}</span>
  </div>
);

// ── Floating-label input ──────────────────────────────────────────────────────
const FloatInput = ({
  label, value, onChange, placeholder, type = "text", maxLength, mono, inputMode,
}: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string; maxLength?: number; mono?: boolean; inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
}) => (
  <div
    className="flex flex-col rounded-xl px-4 pt-2 pb-3"
    style={{ background: "#F5F5F5", border: "1.5px solid #E8E8E8" }}
  >
    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1">{label}</span>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      maxLength={maxLength}
      inputMode={inputMode}
      className={`bg-transparent outline-none text-sm text-[#0E0F0C] font-medium placeholder:text-gray-300 ${mono ? "font-mono" : ""}`}
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
  try { return JSON.parse(localStorage.getItem(LS_KEY) || "{}"); } catch { return {}; }
}

// ── Main card ─────────────────────────────────────────────────────────────────
const AppSimCard = () => {
  const navigate = useNavigate();
  const { supportedCryptoCurrencies, supportedCurrencies } = useTradeCryptoCurrenciesButton();

  const saved = loadLS();

  const [tab, setTab] = useState<"BUY" | "SELL">(saved.tab || "BUY");
  const [step, setStep] = useState<number>(saved.step || 1);
  const [loading, setLoading] = useState(false);

  const [selectedCrypto, setSelectedCrypto] = useState(saved.selectedCrypto || "");
  const [selectedCurrency, setSelectedCurrency] = useState(saved.selectedCurrency || "");
  const [amount, setAmount] = useState(saved.amount || "");
  const [receiveAmount, setReceiveAmount] = useState(saved.receiveAmount || "");

  // BUY: allow input in USD, but transact in NGN
  const [buyInputCurrency, setBuyInputCurrency] = useState<"NGN" | "USD">("NGN");
  const [usdToNgnRate, setUsdToNgnRate] = useState<number | null>(null);
  const [usdRateLoading, setUsdRateLoading] = useState(false);
  const [rateId, setRateId] = useState(saved.rateId || "");

  const [email, setEmail] = useState(saved.email || "");
  const [walletAddress, setWalletAddress] = useState(saved.walletAddress || "");
  const [network, setNetwork] = useState(saved.network || "TRC20");
  const [showNetworkPicker, setShowNetworkPicker] = useState(false);
  const networkPickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showNetworkPicker) return;
    const onPointerDown = (e: PointerEvent) => {
      if (networkPickerRef.current && !networkPickerRef.current.contains(e.target as Node)) {
        setShowNetworkPicker(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [showNetworkPicker]);

  const [bankName, setBankName] = useState(saved.bankName || "");
  const [accountNumber, setAccountNumber] = useState(saved.accountNumber || "");
  const [accountName, setAccountName] = useState(saved.accountName || "");

  const [platformBank, setPlatformBank] = useState<any>(saved.platformBank || null);
  const [sessionId, setSessionId] = useState(saved.sessionId || "");
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const [depositWallet, setDepositWallet] = useState(saved.depositWallet || "");
  const [done, setDone] = useState(saved.done || false);

  const cryptoObj = supportedCryptoCurrencies?.find((c) => c.id === selectedCrypto);
  const currencyObj = supportedCurrencies?.find((c) => c.id === selectedCurrency);

  // Init defaults once loaded (only if not already restored from localStorage)
  useEffect(() => {
    if (!selectedCrypto && supportedCryptoCurrencies?.length)
      setSelectedCrypto(supportedCryptoCurrencies[0].id);
  }, [supportedCryptoCurrencies]);

  useEffect(() => {
    if (!selectedCurrency && supportedCurrencies?.length)
      setSelectedCurrency(supportedCurrencies[0].id);
  }, [supportedCurrencies]);

  // Auto-set network to the correct default whenever the selected crypto changes
  useEffect(() => {
    if (!cryptoObj?.code) return;
    const code = cryptoObj.code.toUpperCase();
    const defaultNet = CRYPTO_DEFAULT_NETWORK[code];
    if (defaultNet) setNetwork(defaultNet);
  }, [cryptoObj?.code]);

  // Persist all state to localStorage on every change
  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify({
      tab, step, selectedCrypto, selectedCurrency, amount, receiveAmount, rateId,
      email, walletAddress, network, bankName, accountNumber, accountName,
      platformBank, sessionId, depositWallet, done,
    }));
  }, [tab, step, selectedCrypto, selectedCurrency, amount, receiveAmount, rateId,
      email, walletAddress, network, bankName, accountNumber, accountName,
      platformBank, sessionId, depositWallet, done]);

  const isBuy = tab === "BUY";
  const currSymbol = currencyObj?.symbol || currencyObj?.code || "₦";
  const cryptoSymbol = cryptoObj?.symbol || cryptoObj?.code || "";

  // BUY: fiat chips based on active input currency. SELL: crypto amount chips
  const isUsdInput = isBuy && buyInputCurrency === "USD";
  const chips = isUsdInput ? [10, 50, 100, 500] : [5000, 20000, 50000, 100000];
  const formatChip = (n: number) =>
    isUsdInput ? `$${n}` : `₦${n >= 1000 ? n / 1000 + "k" : n}`;

  // Derive NGN amount when user is typing in USD
  const ngnCurrencyObj = supportedCurrencies?.find((c) => c.code === "NGN");
  const usdCurrencyObj = supportedCurrencies?.find((c) => c.code === "USD");

  const fetchUsdToNgnRate = async (cryptoId: string) => {
    if (!ngnCurrencyObj || !usdCurrencyObj) {
      toast.error("USD input is not supported at this time.");
      setBuyInputCurrency("NGN");
      return;
    }
    setUsdRateLoading(true);
    try {
      const [ngnRes, usdRes] = await Promise.all([
        exchangeRateServiceApi.getExchangeRate(cryptoId, ngnCurrencyObj.id, "BUY"),
        exchangeRateServiceApi.getExchangeRate(cryptoId, usdCurrencyObj.id, "BUY"),
      ]);
      if (
        ngnRes.success && usdRes.success &&
        ngnRes.data && usdRes.data &&
        usdRes.data.fiatRate > 0
      ) {
        setUsdToNgnRate(ngnRes.data.fiatRate / usdRes.data.fiatRate);
      } else {
        toast.error("Could not fetch USD rate. Please use NGN.");
        setBuyInputCurrency("NGN");
      }
    } catch {
      toast.error("Could not fetch USD rate. Please use NGN.");
      setBuyInputCurrency("NGN");
    }
    setUsdRateLoading(false);
  };

  // The NGN amount actually used for transactions
  const ngnAmount =
    isBuy && buyInputCurrency === "USD" && usdToNgnRate && amount
      ? String(Math.round(parseFloat(amount) * usdToNgnRate))
      : amount;

  const fetchRate = async (overrideNgnAmount?: string) => {
    const effectiveAmount = overrideNgnAmount ?? ngnAmount;
    if (!selectedCrypto || !selectedCurrency || !effectiveAmount) return;
    try {
      const { data, success } = await exchangeRateServiceApi.getExchangeRate(
        selectedCrypto, selectedCurrency, isBuy ? "BUY" : "SELL"
      );
      if (success && data) {
        setRateId(data.rateId);
        const { data: calc } = await transactionServiceApi.calculateAmountToReceive(
          data.rateId, parseFloat(effectiveAmount)
        );
        setReceiveAmount(calc ? String(calc) : "");
      }
    } catch {}
  };

  const handleStep1Next = async () => {
    if (!selectedCrypto || !selectedCurrency || !amount) return;
    // Commit NGN amount so downstream steps always use NGN
    if (isBuy && buyInputCurrency === "USD" && usdToNgnRate) {
      const committed = String(Math.round(parseFloat(amount) * usdToNgnRate));
      setAmount(committed);
      setBuyInputCurrency("NGN");
      await fetchRate(committed);
    } else {
      await fetchRate();
    }
    setStep(2);
  };

  const handleBuyStep2Next = async () => {
    if (!email || !walletAddress) return;
    setLoading(true);
    try {
      const res = await transactionServiceApi.initiateTransactionAnonymousUser({
        coinId: selectedCrypto,
        currencyId: selectedCurrency,
        amountToSend: parseFloat(amount),
        amountToReceive: parseFloat(receiveAmount) || 0,
        exchangeRateId: rateId,
        email,
        walletAddress,
        network,
      });
      if (!res?.success) {
        toast.error(res?.message || "Failed to initiate transaction");
        return;
      }
      if (res?.data) {
        setSessionId((res.data as any).sessionId || "");
        const bank = await bankServiceApi.getPlatformBankDetails();
        if (!bank?.success) {
          toast.error(bank?.message || "Failed to fetch payment details");
          return;
        }
        setPlatformBank(bank.data);
        setStep(3);
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Something went wrong. Please try again.";
      toast.error(msg);
    }
    setLoading(false);
  };

  const handleSellStep2Next = async () => {
    if (!email || !bankName || !accountNumber || !accountName) return;
    setLoading(true);
    try {
      const res = await transactionServiceApi.initiateTransactionAnonymousUser({
        coinId: selectedCrypto,
        currencyId: selectedCurrency,
        amountToSend: parseFloat(amount),
        amountToReceive: parseFloat(receiveAmount) || 0,
        exchangeRateId: rateId,
        email,
        bankName,
        accountNumber,
        accountName,
      });
      if (!res?.success) {
        toast.error(res?.message || "Failed to initiate transaction");
        return;
      }
      if (res?.data) {
        setSessionId((res.data as any).sessionId || "");
        const wallet = await cryptoServiceApi.getPlatformWallet(selectedCrypto);
        if (!wallet?.success) {
          toast.error(wallet?.message || "Failed to fetch deposit wallet");
          return;
        }
        setDepositWallet((wallet.data as any)?.walletAddress || "");
        setStep(3);
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Something went wrong. Please try again.";
      toast.error(msg);
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
    } catch {}
    setLoading(false);
  };

  const copyToClipboard = (text: string) => navigator.clipboard.writeText(text);

  const reset = () => {
    setStep(1); setDone(false); setAmount(""); setReceiveAmount("");
    setEmail(""); setWalletAddress(""); setBankName(""); setAccountNumber("");
    setAccountName(""); setReceiptFile(null); setPlatformBank(null);
    setDepositWallet(""); setSessionId(""); setRateId("");
    setBuyInputCurrency("NGN"); setUsdToNgnRate(null);
    localStorage.removeItem(LS_KEY);
  };

  const cryptoCode = cryptoObj?.code?.toUpperCase() || "";
  const allowedNetworks = ALL_NETWORKS.filter(n =>
    (CRYPTO_NETWORKS[cryptoCode] ?? ALL_NETWORKS.map(x => x.id)).includes(n.id)
  );
  const networkLabel = ALL_NETWORKS.find(n => n.id === network)?.label || network;

  return (
    <div
      className="relative flex flex-col overflow-hidden"
      style={{
        width: "min(480px, calc(100vw - 32px))",
        background: "#F7F7F8",
        borderRadius: "20px",
        boxShadow: "0 8px 48px rgba(0,0,0,0.10), 0 2px 12px rgba(148,142,238,0.10)",
        border: "1px solid rgba(0,0,0,0.06)",
      }}
    >
      {/* Tabs */}
      <div className="flex border-b border-gray-200 bg-white" style={{ borderRadius: "20px 20px 0 0" }}>
        {(["BUY", "SELL"] as const).map((t) => {
          const active = tab === t;
          const color = t === "BUY" ? "#948EEE" : "#22c55e";
          return (
            <button
              key={t}
              onClick={() => { setTab(t); reset(); setBuyInputCurrency("NGN"); setUsdToNgnRate(null); }}
              className="flex-1 py-4 text-sm font-semibold transition-all cursor-pointer border-b-2 -mb-px flex items-center justify-center gap-2"
              style={{
                borderBottomColor: active ? color : "transparent",
                color: active ? color : "#9CA3AF",
              }}
            >
              {t === "BUY" ? <CreditCard size={16} weight="duotone" /> : <ArrowCircleUp size={16} weight="duotone" />}
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
            <motion.div key="s1" {...slide} transition={{ duration: 0.2 }} className="flex flex-col gap-4">
              {/* Step label */}
              <p className="text-center text-sm text-gray-400">
                Step 1 of {isBuy ? "3" : "2"} · {isBuy ? "Select & Amount" : "Select & Amount"}
              </p>

              {/* Crypto picker */}
              {(!supportedCryptoCurrencies || supportedCryptoCurrencies.length === 0) ? (
                <div className="flex gap-2">
                  {[1,2,3].map(i => <div key={i} className="flex-1 h-20 rounded-xl bg-gray-100 animate-pulse" />)}
                </div>
              ) : (
                <div className="flex gap-2">
                  {supportedCryptoCurrencies.map((item) => (
                    <TokenBtn
                      key={item.id} item={item}
                      selected={item.id === selectedCrypto}
                      onSelect={() => {
                        setSelectedCrypto(item.id); setReceiveAmount("");
                        if (buyInputCurrency === "USD") fetchUsdToNgnRate(item.id);
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
                  {/* NGN / USD toggle — BUY only, shown when USD currency is supported */}
                  {isBuy && usdCurrencyObj && (
                    <div
                      className="flex rounded-lg overflow-hidden"
                      style={{ border: "1px solid #E8E8E8" }}
                    >
                      {(["NGN", "USD"] as const).map((cur) => (
                        <button
                          key={cur}
                          onClick={() => {
                            if (cur === buyInputCurrency) return;
                            setBuyInputCurrency(cur);
                            setAmount("");
                            setReceiveAmount("");
                            if (cur === "USD" && selectedCrypto) {
                              fetchUsdToNgnRate(selectedCrypto);
                            }
                          }}
                          className="px-2.5 py-1 text-[10px] font-bold cursor-pointer transition-colors"
                          style={{
                            background: buyInputCurrency === cur ? "#948EEE" : "transparent",
                            color: buyInputCurrency === cur ? "white" : "#9CA3AF",
                          }}
                        >
                          {cur}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center px-4 pb-3 gap-2">
                  <span className="text-2xl font-bold text-gray-300">
                    {isBuy ? (buyInputCurrency === "USD" ? "$" : "₦") : cryptoSymbol}
                  </span>
                  <input
                    type="number"
                    min={0}
                    value={amount}
                    onChange={(e) => { setAmount(e.target.value); setReceiveAmount(""); }}
                    onBlur={fetchRate}
                    placeholder="0"
                    className="flex-1 bg-transparent outline-none text-2xl font-bold text-[#0E0F0C] placeholder:text-gray-200"
                  />
                </div>
                {/* NGN equivalent preview when typing in USD */}
                {isBuy && buyInputCurrency === "USD" && amount && (
                  <div className="px-4 pb-2 -mt-1">
                    {usdRateLoading ? (
                      <span className="text-xs text-gray-400">Fetching rate…</span>
                    ) : usdToNgnRate ? (
                      <span className="text-xs text-gray-400">
                        ≈ <span className="font-semibold text-[#0E0F0C]">
                          ₦{Math.round(parseFloat(amount) * usdToNgnRate).toLocaleString()}
                        </span> NGN will be transferred
                      </span>
                    ) : null}
                  </div>
                )}
                {/* Quick chips */}
                <div className="flex border-t border-gray-100">
                  {chips.map((chip) => (
                    <button
                      key={chip}
                      onClick={() => { setAmount(String(chip)); setReceiveAmount(""); }}
                      className="flex-1 py-2.5 text-xs font-semibold border-r border-gray-100 last:border-r-0 cursor-pointer transition-colors"
                      style={{
                        background: amount === String(chip) ? "rgba(148,142,238,0.08)" : "transparent",
                        color: amount === String(chip) ? "#948EEE" : "#6B7280",
                      }}
                    >
                      {formatChip(chip)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rate / receive preview */}
              {receiveAmount && (
                <p className="text-center text-sm text-gray-400">
                  You receive:{" "}
                  <span className="font-bold text-[#22c55e]">
                    {isBuy
                      ? `${receiveAmount} ${cryptoSymbol}`
                      : `${currSymbol}${parseFloat(receiveAmount).toLocaleString()}`}
                  </span>
                </p>
              )}

              <button
                onClick={handleStep1Next}
                disabled={!amount || !selectedCrypto || !selectedCurrency}
                className="w-full py-3.5 rounded-xl font-bold text-sm text-white border-none transition-opacity disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                style={{ background: isBuy ? "#948EEE" : "#22c55e" }}
              >
                {!amount || !selectedCrypto ? "Select crypto & enter amount" : <span className="flex items-center justify-center gap-1.5">Continue <ArrowRight size={15} weight="bold" /></span>}
              </button>

              {/* Upsell */}
              <div
                className="rounded-xl p-4 flex flex-col gap-2"
                style={{ background: "white", border: "1.5px solid #E8E8E8" }}
              >
                <p className="text-sm font-bold text-[#0E0F0C] flex items-center gap-1.5"><Lock size={15} weight="duotone" /> Unlock More with an Account</p>
                <p className="text-xs text-gray-400">Higher limits · Full order history · Priority support · Faster trades</p>
                <div className="flex gap-2 mt-1">
                  <button
                    onClick={() => navigate({ to: ROUTES.SIGNUP })}
                    className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white border-none cursor-pointer"
                    style={{ background: "#948EEE" }}
                  >Sign up free</button>
                  <button
                    onClick={() => navigate({ to: ROUTES.SIGNIN })}
                    className="flex-1 py-2.5 rounded-xl text-sm font-bold cursor-pointer"
                    style={{ background: "white", border: "1.5px solid #948EEE", color: "#948EEE" }}
                  >Log in</button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── STEP 2 BUY: wallet + email ── */}
          {step === 2 && isBuy && !done && (
            <motion.div key="s2buy" {...slide} transition={{ duration: 0.2 }} className="flex flex-col gap-3">
              <p className="text-center text-sm text-gray-400">Step 2 of 3 · Enter your wallet</p>

              {/* Summary */}
              <div className="rounded-xl p-3" style={{ background: "white", border: "1.5px solid #E8E8E8" }}>
                <SRow label="Buying" value={cryptoSymbol} />
                <SRow label="You Pay" value={`${currSymbol}${parseFloat(amount).toLocaleString()}`} />
                {receiveAmount && <SRow label="You Receive" value={`${parseFloat(receiveAmount).toFixed(4)} ${cryptoSymbol}`} green />}
              </div>

              <FloatInput label="Your Email Address" value={email} onChange={setEmail} placeholder="you@email.com" type="email" />
              <FloatInput label="Your Wallet Address" value={walletAddress} onChange={setWalletAddress} placeholder="e.g. TQmBY4Mn..." mono />

              {/* Network selector — hidden when only one option */}
              {allowedNetworks.length > 1 ? (
                <button
                  onClick={() => setShowNetworkPicker(true)}
                  className="flex flex-col rounded-xl px-4 pt-2 pb-2.5 text-left cursor-pointer"
                  style={{ background: "#F5F5F5", border: "1.5px solid #E8E8E8" }}
                >
                  <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1">Network</span>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-[#0E0F0C]">{networkLabel}</span>
                    <span className="text-gray-400 text-xs">▾</span>
                  </div>
                </button>
              ) : (
                <div
                  className="flex flex-col rounded-xl px-4 pt-2 pb-2.5"
                  style={{ background: "#F5F5F5", border: "1.5px solid #E8E8E8" }}
                >
                  <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1">Network</span>
                  <span className="text-sm font-medium text-[#0E0F0C]">{networkLabel}</span>
                </div>
              )}

              {/* Network picker overlay */}
              <AnimatePresence>
                {showNetworkPicker && (
                  <motion.div
                    ref={networkPickerRef}
                    initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }}
                    transition={{ duration: 0.15 }}
                    className="absolute inset-x-0 bottom-0 z-50"
                    style={{ background: "#1a1a2e", borderRadius: "16px 16px 20px 20px" }}
                  >
                    <div className="px-4 pt-4 pb-3 flex flex-col gap-0.5">
                      <p className="text-white/50 text-xs font-semibold uppercase tracking-widest mb-2">Select network</p>
                      {allowedNetworks.map((n) => (
                        <button
                          key={n.id}
                          onClick={() => { setNetwork(n.id); setShowNetworkPicker(false); }}
                          className="flex items-center gap-3 py-3 border-b border-white/10 cursor-pointer bg-transparent last:border-0"
                        >
                          <div
                            className="w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center"
                            style={{ borderColor: network === n.id ? "#948EEE" : "rgba(255,255,255,0.3)" }}
                          >
                            {network === n.id && <div className="w-2 h-2 rounded-full bg-[#948EEE]" />}
                          </div>
                          <span className={`text-sm font-semibold ${network === n.id ? "text-[#948EEE]" : "text-white"}`}>
                            {n.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex gap-2">
                <button onClick={() => setStep(1)} className="px-4 py-3 rounded-xl text-sm text-gray-400 cursor-pointer" style={{ background: "white", border: "1.5px solid #E8E8E8" }}>
                  <span className="flex items-center gap-1.5"><ArrowLeft size={15} weight="bold" /> Back</span>
                </button>
                <button
                  onClick={handleBuyStep2Next}
                  disabled={!email || !walletAddress || loading}
                  className="flex-1 py-3 rounded-xl font-bold text-sm text-white border-none transition-opacity disabled:opacity-40 cursor-pointer"
                  style={{ background: "#948EEE" }}
                >
                  {loading ? "Processing..." : <span className="flex items-center justify-center gap-1.5">See Payment Details <ArrowRight size={15} weight="bold" /></span>}
                </button>
              </div>

            </motion.div>
          )}

          {/* ── STEP 2 SELL: bank details ── */}
          {step === 2 && !isBuy && !done && (
            <motion.div key="s2sell" {...slide} transition={{ duration: 0.2 }} className="flex flex-col gap-3">
              <p className="text-center text-sm text-gray-400">Step 2 of 2 · Your payout bank</p>

              <div className="rounded-xl p-3" style={{ background: "white", border: "1.5px solid #E8E8E8" }}>
                <SRow label="Selling" value={cryptoSymbol} />
                <SRow label="You Send" value={`${amount} ${cryptoSymbol}`} />
                {receiveAmount && <SRow label="You Receive" value={`${currSymbol}${parseFloat(receiveAmount).toLocaleString()}`} green />}
              </div>

              <FloatInput label="Your Email Address" value={email} onChange={setEmail} placeholder="you@email.com — for payout updates" type="email" />
              <FloatInput label="Your Bank Name" value={bankName} onChange={setBankName} placeholder="e.g. First Bank of Nigeria" />
              <FloatInput label="Account Number" value={accountNumber} onChange={setAccountNumber} placeholder="0000000000" maxLength={10} mono inputMode="numeric" />
              <FloatInput label="Account Name" value={accountName} onChange={setAccountName} placeholder="Your full name on account" />

              <div className="flex gap-2">
                <button onClick={() => setStep(1)} className="px-4 py-3 rounded-xl text-sm text-gray-400 cursor-pointer" style={{ background: "white", border: "1.5px solid #E8E8E8" }}>
                  <span className="flex items-center gap-1.5"><ArrowLeft size={15} weight="bold" /> Back</span>
                </button>
                <button
                  onClick={handleSellStep2Next}
                  disabled={!email || !bankName || !accountNumber || !accountName || loading}
                  className="flex-1 py-3 rounded-xl font-bold text-sm text-white border-none transition-opacity disabled:opacity-40 cursor-pointer"
                  style={{ background: "#22c55e" }}
                >
                  {loading ? "Processing..." : <span className="flex items-center justify-center gap-1.5">Get My Deposit Wallet <ArrowRight size={15} weight="bold" /></span>}
                </button>
              </div>
            </motion.div>
          )}

          {/* ── STEP 3 BUY: bank transfer + receipt ── */}
          {step === 3 && isBuy && !done && (
            <motion.div key="s3buy" {...slide} transition={{ duration: 0.2 }} className="flex flex-col gap-3">
              <p className="text-center text-sm text-gray-400">Step 3 of 3 · Make payment</p>

              {/* Dark bank box */}
              {platformBank && (
                <div
                  className="rounded-xl p-4 relative"
                  style={{ background: "linear-gradient(135deg, #1e2a6e 0%, #2d3a8c 100%)" }}
                >
                  <p className="text-center text-[10px] font-semibold text-white/50 uppercase tracking-widest mb-2">
                    Transfer to this account
                  </p>
                  <button
                    onClick={() => copyToClipboard(platformBank.accountNumber)}
                    className="absolute top-3 right-3 text-[10px] font-semibold px-3 py-1.5 rounded-lg cursor-pointer"
                    style={{ background: "rgba(255,255,255,0.15)", color: "white", border: "1px solid rgba(255,255,255,0.2)" }}
                  >Copy</button>
                  <p className="text-center text-white font-bold text-base mb-1">{platformBank.bankName}</p>
                  <p className="text-center text-white font-bold text-3xl tracking-wider mb-1" style={{ fontFamily: "monospace" }}>
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
                      {currSymbol}{parseFloat(amount).toLocaleString()}
                    </span>
                  </div>
                </div>
              )}

              {/* Order summary */}
              <div className="rounded-xl p-3" style={{ background: "white", border: "1.5px solid #E8E8E8" }}>
                <SRow label="Buying" value={cryptoSymbol} />
                {receiveAmount && <SRow label="You'll Get" value={`${parseFloat(receiveAmount).toFixed(4)} ${cryptoSymbol}`} green />}
                <SRow label="To Wallet" value={walletAddress.slice(0,8) + "…" + walletAddress.slice(-6)} />
                <SRow label="Network" value={networkLabel} />
              </div>

              {/* Warning */}
              <div className="flex gap-2 items-start rounded-xl p-3" style={{ background: "#FFFBEB", border: "1.5px solid #FDE68A" }}>
                <Warning size={18} weight="duotone" className="flex-shrink-0 text-amber-500" />
                <p className="text-xs text-amber-700 leading-relaxed">
                  Transfer the <strong>exact amount</strong>. Then upload your receipt below for verification.
                </p>
              </div>

              {/* Receipt upload */}
              <div
                onClick={() => fileRef.current?.click()}
                className="flex flex-col items-center gap-2 py-6 rounded-xl cursor-pointer transition-colors"
                style={{ background: "white", border: "1.5px dashed #D1D5DB" }}
              >
                <Receipt size={32} weight="duotone" className="text-gray-400" />
                <p className="text-sm font-bold text-[#0E0F0C]">{receiptFile ? receiptFile.name : "Upload Receipt"}</p>
                <p className="text-xs text-gray-400">Screenshot or PDF of your transfer</p>
              </div>
              <input ref={fileRef} type="file" accept="image/*,.pdf" className="hidden"
                onChange={(e) => setReceiptFile(e.target.files?.[0] || null)} />

              <div className="flex gap-2">
                <button onClick={() => setStep(2)} className="px-4 py-3.5 rounded-xl text-sm text-gray-400 cursor-pointer flex-shrink-0" style={{ background: "white", border: "1.5px solid #E8E8E8" }}>
                  <span className="flex items-center gap-1.5"><ArrowLeft size={15} weight="bold" /> Back</span>
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
              <button onClick={() => setDone(true)} className="text-center text-xs text-gray-400 hover:underline cursor-pointer bg-transparent border-none py-1">
                Skip — upload later
              </button>
            </motion.div>
          )}

          {/* ── STEP 3 SELL: deposit wallet ── */}
          {step === 3 && !isBuy && !done && (
            <motion.div key="s3sell" {...slide} transition={{ duration: 0.2 }} className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-[#0E0F0C]">Send to this wallet</p>
                <span className="flex items-center gap-1.5 text-xs font-bold text-red-500">
                  <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
                  Monitoring
                </span>
              </div>

              {/* Wallet box */}
              <div className="rounded-xl p-4 relative" style={{ background: "#F5F5F5", border: "1.5px solid #E8E8E8" }}>
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2">
                  Your unique {cryptoSymbol} deposit wallet ({network})
                </p>
                <p className="text-sm font-mono text-[#22c55e] break-all leading-relaxed">{depositWallet}</p>
                <button
                  onClick={() => copyToClipboard(depositWallet)}
                  className="absolute top-3 right-3 text-[10px] font-semibold px-3 py-1.5 rounded-lg cursor-pointer"
                  style={{ background: "white", border: "1.5px solid #E8E8E8", color: "#948EEE" }}
                >Copy</button>
              </div>

              {/* Info */}
              <div className="flex gap-2 items-start rounded-xl p-3" style={{ background: "white", border: "1.5px solid #E8E8E8" }}>
                <Lightning size={18} weight="duotone" className="flex-shrink-0 text-[#948EEE]" />
                <p className="text-xs text-gray-500 leading-relaxed">
                  <strong>Send &amp; forget.</strong> Once we detect your crypto, NGN is sent to your bank instantly. No further action needed.
                </p>
              </div>

              {/* Summary */}
              <div className="rounded-xl p-3" style={{ background: "white", border: "1.5px solid #E8E8E8" }}>
                <SRow label="Payout Bank" value={bankName} />
                <SRow label="Account" value={accountNumber} />
                {receiveAmount && <SRow label="NGN to Credit" value={`${currSymbol}${parseFloat(receiveAmount).toLocaleString()}`} green />}
              </div>

              <button onClick={() => setStep(2)} className="w-full py-2.5 rounded-xl text-sm text-gray-400 cursor-pointer" style={{ background: "white", border: "1.5px solid #E8E8E8" }}>
                <span className="flex items-center gap-1.5"><ArrowLeft size={15} weight="bold" /> Back</span>
              </button>
            </motion.div>
          )}

          {/* ── SUCCESS ── */}
          {done && (
            <motion.div key="done" {...slide} transition={{ duration: 0.2 }} className="flex flex-col items-center gap-4 py-4">
              <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: "#22c55e" }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <path d="M5 13l4 4L19 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="text-center">
                <p className="font-bold text-xl text-[#0E0F0C]">
                  {isBuy ? "Payment Submitted!" : "NGN Credited!"}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {isBuy ? "We'll confirm your transfer and send your crypto." : "Crypto received & auto-converted. Your bank account has been credited."}
                </p>
              </div>

              <div className="w-full rounded-xl p-3" style={{ background: "white", border: "1.5px solid #E8E8E8" }}>
                {isBuy ? (
                  <>
                    <SRow label="Buying" value={cryptoSymbol} />
                    {receiveAmount && <SRow label="You'll Get" value={`${parseFloat(receiveAmount).toFixed(4)} ${cryptoSymbol}`} green />}
                    <SRow label="Updates to" value={email} />
                  </>
                ) : (
                  <>
                    <SRow label="Crypto Sold" value={`${amount} ${cryptoSymbol}`} />
                    {receiveAmount && <SRow label="NGN Sent" value={`${currSymbol}${parseFloat(receiveAmount).toLocaleString()}`} green />}
                    <SRow label="Sent To Bank" value={bankName} />
                    <SRow label="Account No." value={accountNumber} />
                    <SRow label="Updates to" value={email} />
                  </>
                )}
              </div>

              {/* Upsell */}
              <div className="w-full rounded-xl p-4" style={{ background: "#F5F5F5", border: "1.5px solid #E8E8E8" }}>
                <p className="text-sm font-bold text-[#0E0F0C] mb-1 flex items-center gap-1.5"><TrendUp size={15} weight="duotone" /> Get the Full Experience</p>
                <p className="text-xs text-gray-400 mb-3">Sign up free to unlock order history, higher limits up to $10,000, priority support, and faster conversions.</p>
                <div className="flex gap-2">
                  <button onClick={() => navigate({ to: ROUTES.SIGNUP })}
                    className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white border-none cursor-pointer"
                    style={{ background: "#948EEE" }}>Sign up free</button>
                  <button onClick={reset}
                    className="flex-1 py-2.5 rounded-xl text-sm font-bold cursor-pointer"
                    style={{ background: "white", border: "1.5px solid #E8E8E8", color: "#6B7280" }}>
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
