/**
 * Step 2 — Make Payment (Buy) or Unique Wallet + Monitoring (Sell)
 *
 * BUY sub-views:
 *   "bank"   — purple hero card + blue bank card + warning + "I've Paid" CTA (frame 124)
 *   "upload" — YOUR ORDER table + dashed upload zone + Submit (frame 133)
 *
 * SELL sub-views:
 *   "wallet"     — loading → wallet active (frames 156 / 158)
 *   "monitoring" — 4-step animated tracker (frames 172 / 203)
 */
import { useState, useEffect, type ReactNode } from "react";
import { Copy, Check, ArrowLeft, ArrowRight, Upload } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type {
  SupportedCryptoOrCurrencyResponse,
  UserBankAccountResponse,
} from "../../../types/response.payload.types.ts";
import type {
  TradeAdditionalInfoInterface,
  TradeType,
} from "../../../types/trade.types.ts";
import { useTradeStepTwo } from "../../../hooks/components/trade/useTradeStepTwo.ts";
import TradePaymentUpload from "../../trade-crypto/TradePaymentUpload.tsx";
import { SESSION_STORAGE_KEYS } from "../../../util/constants.util.ts";
import type { BuyRateInfo } from "./DashboardTradeStep1.tsx";
import { useTransactionQuery } from "../../../queries/transaction.query.ts";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store.ts";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../../queries/query.keys.ts";
import { bankServiceApi } from "../../../api/bank.api.ts";
import { transactionServiceApi } from "../../../api/transaction.api.ts";

interface DashboardTradeStep2Props {
  tradeType: TradeType;
  amountToBuy: number;
  numberOfToken: number;
  selectedToken?: SupportedCryptoOrCurrencyResponse;
  selectedCurrency?: SupportedCryptoOrCurrencyResponse;
  transactionRef: string | undefined;
  additionalInfo: TradeAdditionalInfoInterface[];
  handleReceiptUrl: (url: string) => void;
  handleTransactionHash: (hash: string) => void;
  handleSubmitPaymentProof: () => void;
  formatReceiveAmount: (
    amount: number | string,
    code: string | undefined,
  ) => React.ReactNode | string;
  formatSendAmount: (
    amount: number | string,
    code: string | undefined,
  ) => React.ReactNode | string;
  onBack: () => void;
  /** Wallet address entered in Step 1 (buy flow) */
  buyWalletAddress?: string;
  /** Network selected in Step 1 (buy flow) */
  buyNetwork?: string;
  /** Payout bank account for sell flow */
  payoutBank?: UserBankAccountResponse;
  /** Live label from useTradeStepDisplay (e.g. "2m 15s", "Expired") — quotes expire after ~3 minutes server-side */
  rateLockCountdown?: string;
  /** Rate info from local-first BUY flow (fetched at Step 1) */
  buyRateInfo?: BuyRateInfo | null;
  /** Called after BUY is successfully submitted (local-first flow) */
  onBuySubmitSuccess?: () => void;
}

/* ── helpers ── */
function CopyToast({ visible }: { visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-full text-sm font-bold text-white"
          style={{ background: "#037847", boxShadow: "0 6px 20px #03784744" }}
        >
          Account number copied!
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Shows how long the locked exchange rate remains valid (backend uses a 3-minute window).
function RateLockBanner({
  countdown,
  variant,
}: {
  countdown: string;
  variant: "ok" | "expired";
}) {
  if (!countdown || countdown === "Rate Locked") return null;
  const expired = variant === "expired" || countdown === "Expired";
  return (
    <div
      className="flex items-start gap-2.5 rounded-2xl px-4 py-3"
      style={{
        background: expired ? "#FEECEC" : "#F0EFFD",
        border: `1px solid ${expired ? "#F5C4C4" : "#C7CAFF"}`,
      }}
    >
      <span className="text-sm shrink-0 mt-0.5" aria-hidden>
        {expired ? "⏱️" : "🔒"}
      </span>
      <p
        className="text-[11px] leading-relaxed"
        style={{ color: expired ? "#8B2E2E" : "#3D3A7A" }}
      >
        {expired ? (
          <>
            <strong>Rate expired.</strong> Locked quotes last 3 minutes. Go back
            one step and confirm your amount again to get a fresh rate before
            paying or uploading a receipt.
          </>
        ) : (
          <>
            <strong>Rate locked 3 minutes.</strong> Complete transfer and
            receipt within{" "}
            <span className="font-extrabold tabular-nums">{countdown}</span> or
            start over from the previous step for a new quote.
          </>
        )}
      </p>
    </div>
  );
}

function BackHeader({
  onBack,
  title,
  sub,
}: {
  onBack: () => void;
  title: string;
  sub?: string;
}) {
  return (
    <div className="flex items-center gap-3 mb-1">
      <button
        type="button"
        onClick={onBack}
        className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
        style={{ border: "1px solid #E8E8E8", background: "#FAFAFA" }}
      >
        <ArrowLeft size={15} style={{ color: "#0E0F0C" }} />
      </button>
      <div>
        <p className="text-base font-extrabold" style={{ color: "#0E0F0C" }}>
          {title}
        </p>
        {sub && (
          <p className="text-[11px]" style={{ color: "#9A9A9A" }}>
            {sub}
          </p>
        )}
      </div>
    </div>
  );
}

/* ── Paying To bank row (SELL) ── */
function PayingToRow({ payoutBank }: { payoutBank?: UserBankAccountResponse }) {
  if (!payoutBank) return null;
  return (
    <div
      className="flex items-center gap-3 rounded-2xl px-4 py-3"
      style={{ background: "#F7F7F9", border: "1px solid #EEEEEE" }}
    >
      {payoutBank.bankLogo ? (
        <img
          src={payoutBank.bankLogo}
          alt={payoutBank.bankName}
          className="w-7 h-7 rounded-lg object-cover shrink-0"
        />
      ) : (
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: "#E0E0E0" }}
        >
          <span className="text-[9px] font-black" style={{ color: "#6B6E6B" }}>
            {payoutBank.bankName.slice(0, 2).toUpperCase()}
          </span>
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p
          className="text-[10px] font-bold tracking-widest uppercase"
          style={{ color: "#9A9A9A" }}
        >
          Paying to
        </p>
        <p
          className="text-xs font-semibold truncate"
          style={{ color: "#0E0F0C" }}
        >
          {payoutBank.bankName} ****{payoutBank.accountNumber.slice(-4)}
        </p>
        <p className="text-[10px]" style={{ color: "#6B6E6B" }}>
          {payoutBank.accountName}
        </p>
      </div>
    </div>
  );
}

/* ── SELL: Wallet screen ── */
function SellWalletView({
  selectedToken,
  walletAddress,
  network,
  paymentDetailsLoading,
  onStartMonitoring,
  payoutBank,
}: {
  selectedToken?: SupportedCryptoOrCurrencyResponse;
  walletAddress: string;
  network: string;
  paymentDetailsLoading: boolean;
  onStartMonitoring: () => void;
  payoutBank?: UserBankAccountResponse;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!walletAddress) return;
    navigator.clipboard.writeText(walletAddress).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const rate = selectedToken?.sellRate
    ? `₦${Math.round(Number(selectedToken.sellRate)).toLocaleString()} per 1 ${selectedToken.symbol}`
    : null;

  return (
    <div className="flex flex-col gap-4">
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
            {rate} • Live
          </span>
        </div>
      )}

      {/* Loading state */}
      {paymentDetailsLoading ? (
        <div className="flex flex-col items-center gap-3 py-10">
          <div
            className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: "#F7A600", borderTopColor: "transparent" }}
          />
          <p className="text-sm font-semibold" style={{ color: "#9A9A9A" }}>
            Generating your unique wallet…
          </p>
          <p className="text-xs" style={{ color: "#BDBDBD" }}>
            Connecting to blockchain…
          </p>
        </div>
      ) : (
        <>
          {/* Wallet address box */}
          <div
            className="rounded-2xl px-4 py-4"
            style={{ border: "2px solid #EB5757", background: "#FFF8F8" }}
          >
            <p
              className="text-[10px] font-bold tracking-widest uppercase mb-2"
              style={{ color: "#EB5757" }}
            >
              Your Unique {selectedToken?.symbol} Wallet ({network || "Network"}
              )
            </p>
            <p
              className="text-xs font-mono break-all leading-relaxed mb-3"
              style={{ color: "#0E0F0C" }}
            >
              {walletAddress || "—"}
            </p>
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all"
              style={{
                background: copied ? "#E8F8F0" : "#EB57571A",
                color: copied ? "#037847" : "#EB5757",
                border: `1px solid ${copied ? "#03784733" : "#EB575733"}`,
              }}
            >
              {copied ? <Check size={12} /> : <Copy size={12} />}
              {copied ? "Copied!" : "Copy Address"}
            </button>
          </div>

          {/* Paying to bank row */}
          <PayingToRow payoutBank={payoutBank} />

          {/* Send & forget banner */}
          <div
            className="flex items-start gap-3 rounded-2xl px-4 py-3"
            style={{ background: "#FFFBF0", border: "1px solid #FFE4A0" }}
          >
            <span className="text-base leading-none mt-0.5">⚡</span>
            <p className="text-xs leading-relaxed" style={{ color: "#A07000" }}>
              <span className="font-bold">Send &amp; forget.</span> The moment
              your crypto arrives, we auto-detect and instantly send NGN to your
              bank. No further action needed.
            </p>
          </div>

          {/* CTA */}
          <button
            type="button"
            onClick={onStartMonitoring}
            className="w-full py-4 rounded-2xl text-sm font-bold flex items-center justify-center gap-2"
            style={{
              background: "linear-gradient(135deg,#037847,#04A860)",
              color: "#FFFFFF",
              boxShadow: "0 6px 20px #03784744",
            }}
          >
            <span className="w-2 h-2 rounded-full bg-green-200" />
            <span>Wallet Active — Start Monitoring</span>
            <ArrowRight size={16} />
          </button>
        </>
      )}
    </div>
  );
}

/* ── SELL: Monitoring screen ── */
type MonitoringStep = {
  label: string;
  status: "done" | "active" | "pending";
};

const MONITORING_STEPS: MonitoringStep[] = [
  { label: "Blockchain Monitoring Active", status: "done" },
  { label: "Waiting for Crypto Detection", status: "active" },
  { label: "Auto-Converting to NGN", status: "pending" },
  { label: "Bank Transfer", status: "pending" },
];

function SellMonitoringView({
  selectedToken,
  payoutBank,
}: {
  selectedToken?: SupportedCryptoOrCurrencyResponse;
  payoutBank?: UserBankAccountResponse;
}) {
  const statusColors = {
    done: {
      bg: "#E8F8F0",
      border: "#03784733",
      dot: "#037847",
      text: "#037847",
    },
    active: {
      bg: "#FFFBF0",
      border: "#FFE4A033",
      dot: "#F7A600",
      text: "#A07000",
    },
    pending: {
      bg: "#FAFAFA",
      border: "#EEEEEE",
      dot: "#BDBDBD",
      text: "#9A9A9A",
    },
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Icon + headline */}
      <div className="flex flex-col items-center gap-3 py-4">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center text-3xl"
          style={{ background: "#E0F7F4", border: "2px solid #00BFA533" }}
        >
          📡
        </div>
        <div className="text-center">
          <p className="text-base font-extrabold" style={{ color: "#0E0F0C" }}>
            Monitoring Wallet
          </p>
          <p className="text-xs mt-1" style={{ color: "#9A9A9A" }}>
            Listening for Transaction…
          </p>
        </div>
        <p
          className="text-xs text-center px-4 leading-relaxed"
          style={{ color: "#6B6E6B" }}
        >
          Send any amount of {selectedToken?.symbol ?? "crypto"} to your wallet.
          NGN will hit your bank automatically.
        </p>
      </div>

      {/* Paying to bank */}
      <PayingToRow payoutBank={payoutBank} />

      {/* 4-step progress */}
      <div className="flex flex-col gap-2.5">
        {MONITORING_STEPS.map(({ label, status }, i) => {
          const c = statusColors[status];
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07 }}
              className="flex items-center gap-3 rounded-2xl px-4 py-3.5"
              style={{ background: c.bg, border: `1px solid ${c.border}` }}
            >
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                style={{ background: status === "pending" ? "#EEEEEE" : c.dot }}
              >
                {status === "done" ? (
                  <Check size={13} color="white" />
                ) : status === "active" ? (
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                ) : (
                  <span
                    className="text-[11px] font-bold"
                    style={{ color: "#9A9A9A" }}
                  >
                    {i + 1}
                  </span>
                )}
              </div>
              <span className="text-xs font-semibold" style={{ color: c.text }}>
                {label}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

/* ── BUY: Upload receipt view ── */
function BuyUploadView({
  selectedToken,
  numberOfToken,
  fiatAmountPaidDisplay,
  walletAddress,
  network,
  submitInvalid,
  onFileSelected,
  onFileCleared,
  onSubmit,
  rateLockCountdown,
  isRateExpired,
}: {
  selectedToken?: SupportedCryptoOrCurrencyResponse;
  numberOfToken: number;
  fiatAmountPaidDisplay: ReactNode;
  walletAddress: string;
  network: string;
  submitInvalid: boolean;
  onFileSelected: (file: File) => void;
  onFileCleared: () => void;
  onSubmit: () => void;
  rateLockCountdown?: string;
  isRateExpired: boolean;
}) {
  const tableRows = [
    { label: "Crypto", value: selectedToken?.symbol ?? "—" },
    { label: "Amount Paid", value: fiatAmountPaidDisplay },
    {
      label: "You'll Receive",
      value: `${numberOfToken} ${selectedToken?.symbol ?? ""}`,
    },
    {
      label: "Wallet",
      value: walletAddress
        ? `${walletAddress.slice(0, 8)}…${walletAddress.slice(-6)}`
        : "—",
    },
    { label: "Network", value: network || "—" },
  ];

  const ctaDisabled = submitInvalid || isRateExpired;

  return (
    <div className="flex flex-col gap-4">
      <div className="mb-1">
        <p className="text-base font-extrabold" style={{ color: "#0E0F0C" }}>
          Upload a Screenshot
        </p>
        <p className="text-[11px] mt-0.5" style={{ color: "#9A9A9A" }}>
          Of your transfer receipt
        </p>
      </div>

      {rateLockCountdown ? (
        <RateLockBanner
          countdown={rateLockCountdown}
          variant={isRateExpired ? "expired" : "ok"}
        />
      ) : null}

      {/* YOUR ORDER table */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ border: "1px solid #EEEEEE" }}
      >
        <div
          className="px-4 py-2.5"
          style={{ background: "#F7F7F9", borderBottom: "1px solid #EEEEEE" }}
        >
          <p
            className="text-[10px] font-bold tracking-widest uppercase"
            style={{ color: "#9A9A9A" }}
          >
            Your Order
          </p>
        </div>
        {tableRows.map(({ label, value }) => (
          <div
            key={label}
            className="flex items-center justify-between px-4 py-2.5"
            style={{ borderBottom: "1px solid #F7F7F9" }}
          >
            <span className="text-xs" style={{ color: "#9A9A9A" }}>
              {label}
            </span>
            <span
              className="text-xs font-semibold"
              style={{ color: "#0E0F0C" }}
            >
              {value}
            </span>
          </div>
        ))}
      </div>

      {/* Dashed upload area */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ border: "2px dashed #D0D0D0" }}
      >
        <div className="px-4 pt-4 pb-2 text-center">
          <Upload
            size={20}
            className="mx-auto mb-1"
            style={{ color: "#948EEE" }}
          />
          <p className="text-xs font-semibold" style={{ color: "#6B6E6B" }}>
            Tap to Upload Receipt
          </p>
          <p className="text-[10px] mt-0.5" style={{ color: "#BDBDBD" }}>
            PNG, JPG or PDF accepted
          </p>
        </div>
        <TradePaymentUpload
          maxFiles={1}
          acceptedTypes={[".jpg", ".jpeg", ".png", ".webp", ".gif", ".pdf"]}
          onFileSelected={onFileSelected}
          onFileCleared={onFileCleared}
        />
      </div>

      {/* Submit */}
      <button
        type="button"
        disabled={ctaDisabled}
        onClick={onSubmit}
        className="w-full py-4 rounded-2xl text-sm font-bold transition-all"
        style={{
          background: !ctaDisabled
            ? "linear-gradient(135deg,#948EEE,#6B45D0)"
            : "#F0F0F0",
          color: !ctaDisabled ? "#FFFFFF" : "#9A9A9A",
          boxShadow: !ctaDisabled ? "0 6px 20px #948EEE44" : "none",
        }}
      >
        <span className="inline-flex items-center gap-2">
          <span>Submit Receipt</span>
          <ArrowRight size={16} />
        </span>
      </button>
    </div>
  );
}

/* ── Main component ── */
type BuyView = "bank" | "upload";
type SellView = "wallet" | "monitoring";

export default function DashboardTradeStep2({
  tradeType,
  amountToBuy,
  numberOfToken,
  selectedToken,
  selectedCurrency,
  handleReceiptUrl,
  handleSubmitPaymentProof,
  formatSendAmount,
  onBack,
  buyWalletAddress,
  buyNetwork,
  payoutBank,
  rateLockCountdown = "",
  buyRateInfo,
  onBuySubmitSuccess,
}: DashboardTradeStep2Props) {
  const isBuy = tradeType === "buy";
  const { createAndSubmitTransactionMutation } = useTransactionQuery();
  const initiateForm = useSelector((s: RootState) => s.transaction.initiate.initiateTransaction);
  const userEmail = useSelector((s: RootState) => s.user.trade.anonymous.email);
  const isLocalBuyFlow = isBuy && !!buyRateInfo;

  // For local-first BUY flow: fetch bank details directly
  const { data: localBankDetails, isLoading: localBankDetailsLoading } = useQuery({
    queryKey: [QUERY_KEYS.BANK.PLATFORM_BANK_DETAILS, "local-buy"],
    queryFn: async () => {
      const { data } = await bankServiceApi.getPlatformBankDetails();
      return data;
    },
    enabled: isLocalBuyFlow,
  });

  const {
    setUploadedFileUrl,
    paymentDetailsLoading,
    submitInvalid,
    bankDetails: hookBankDetails,
    walletDetails,
  } = useTradeStepTwo({
    tradeType,
    amountToBuy,
    numberOfToken,
    selectedToken,
    selectedCurrency,
  });

  const [buyView, setBuyView] = useState<BuyView>("bank");
  const [sellView, setSellView] = useState<SellView>("wallet");
  const [copyToastVisible, setCopyToastVisible] = useState(false);
  const [storedYouPay, setStoredYouPay] = useState<string | null>(null);

  // Wallet address / network from additionalInfo or walletDetails
  const walletAddress = walletDetails?.walletAddress ?? "";
  const network = walletDetails?.network ?? "";

  // Merge bank details: prefer local fetch for local-first BUY flow
  const bankDetails = isLocalBuyFlow ? (localBankDetails ?? hookBankDetails) : hookBankDetails;

  // Bank details
  const bankName = bankDetails?.bankName ?? "";
  const accountNumber = bankDetails?.accountNumber ?? "";
  const accountName = bankDetails?.accountHolderName ?? "";

  useEffect(() => {
    const v = sessionStorage.getItem(SESSION_STORAGE_KEYS.YOU_PAY_VALUE);
    if (v && v !== "[object Object]" && v.trim()) setStoredYouPay(v);
  }, []);

  const payAmount = storedYouPay
    ? storedYouPay
    : formatSendAmount(amountToBuy.toLocaleString(), selectedCurrency?.code);

  const isRateExpired = rateLockCountdown === "Expired";

  // Local-first BUY: track selected receipt File for multipart createAndSubmit
  const [localReceiptFile, setLocalReceiptFile] = useState<File | undefined>();

  const [isLocalBuySubmitting, setIsLocalBuySubmitting] = useState(false);

  const handleLocalBuySubmit = async () => {
    if (!buyRateInfo || !localReceiptFile) return;

    const formData = new FormData();
    formData.append("file", localReceiptFile);
    formData.append("coinId", initiateForm?.tokenId ?? "");
    formData.append("currencyId", buyRateInfo.currencyId);
    formData.append("amountToSend", String(buyRateInfo.fiatAmount));
    formData.append("amountToReceive", String(buyRateInfo.cryptoAmount));
    formData.append("walletAddress", buyWalletAddress ?? "");
    formData.append("network", buyNetwork ?? "");
    if (userEmail) formData.append("email", userEmail);

    setIsLocalBuySubmitting(true);
    const toastId = "buy-submit";
    toast.loading("Submitting transaction…", { toastId });
    try {
      const result = userEmail
        ? await transactionServiceApi.anonymousCreateAndSubmitTransaction(formData)
        : await transactionServiceApi.createAndSubmitTransaction(formData);

      toast.dismiss(toastId);
      if (result?.data?.sessionId) {
        sessionStorage.setItem(SESSION_STORAGE_KEYS.SESSION_ID, result.data.sessionId);
      }
      toast.success(result?.message ?? "Transaction submitted!");
      onBuySubmitSuccess?.();
    } catch (err: any) {
      toast.dismiss(toastId);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error?.message ||
        "Failed to submit transaction. Please try again.";
      toast.error(msg);
    } finally {
      setIsLocalBuySubmitting(false);
    }
  };

  const localBuySubmitInvalid = !localReceiptFile || isLocalBuySubmitting;

  const handleCopyAccount = () => {
    navigator.clipboard.writeText(accountNumber).then(() => {
      setCopyToastVisible(true);
      setTimeout(() => setCopyToastVisible(false), 2200);
    });
  };

  /* ── loading ── */
  const effectiveBuyLoading = isLocalBuyFlow ? localBankDetailsLoading : paymentDetailsLoading;
  if (effectiveBuyLoading && isBuy) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <div
          className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: "#948EEE", borderTopColor: "transparent" }}
        />
        <p className="text-sm" style={{ color: "#9A9A9A" }}>
          Loading payment details…
        </p>
      </div>
    );
  }
  if (!isBuy && paymentDetailsLoading) {
    // Sell loading shown inside SellWalletView
  }

  /* ── SELL ── */
  if (!isBuy) {
    return (
      <div className="flex flex-col gap-4">
        <BackHeader
          onBack={onBack}
          title={`Sell ${selectedToken?.symbol ?? "Crypto"}`}
          sub={
            sellView === "wallet"
              ? "Your unique deposit wallet"
              : "Watching for your transaction"
          }
        />

        <AnimatePresence mode="wait">
          {sellView === "wallet" ? (
            <motion.div
              key="sell-wallet"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              <SellWalletView
                selectedToken={selectedToken}
                walletAddress={walletAddress}
                network={network}
                paymentDetailsLoading={paymentDetailsLoading}
                onStartMonitoring={() => setSellView("monitoring")}
                payoutBank={payoutBank}
              />
            </motion.div>
          ) : (
            <motion.div
              key="sell-monitoring"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              <SellMonitoringView
                selectedToken={selectedToken}
                payoutBank={payoutBank}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  /* ── BUY: upload view ── */
  if (buyView === "upload") {
    // Use local-first submission if buyRateInfo is provided
    const useLocalFlow = !!buyRateInfo;
    return (
      <div className="flex flex-col gap-4">
        <BackHeader
          onBack={() => setBuyView("bank")}
          title="Upload Receipt"
          sub="PNG, JPG or PDF"
        />
        <BuyUploadView
          selectedToken={selectedToken}
          numberOfToken={useLocalFlow ? buyRateInfo!.cryptoAmount : numberOfToken}
          fiatAmountPaidDisplay={payAmount}
          walletAddress={buyWalletAddress ?? ""}
          network={buyNetwork ?? ""}
          submitInvalid={useLocalFlow ? localBuySubmitInvalid : submitInvalid}
          onFileSelected={useLocalFlow
            ? (file) => setLocalReceiptFile(file)
            : (file) => { void file; /* legacy flow: file not used directly */ }}
          onFileCleared={useLocalFlow
            ? () => setLocalReceiptFile(undefined)
            : () => setUploadedFileUrl(undefined)}
          onSubmit={useLocalFlow ? handleLocalBuySubmit : handleSubmitPaymentProof}
          rateLockCountdown={useLocalFlow ? undefined : rateLockCountdown}
          isRateExpired={useLocalFlow ? false : isRateExpired}
        />
      </div>
    );
  }

  /* ── BUY: bank details view ── */
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="buy-bank"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4"
      >
        <BackHeader
          onBack={onBack}
          title="Make Payment"
          sub="Transfer exact amount to bank"
        />

        {rateLockCountdown ? (
          <RateLockBanner
            countdown={rateLockCountdown}
            variant={isRateExpired ? "expired" : "ok"}
          />
        ) : null}

        {/* Purple amount hero */}
        <div
          className="rounded-2xl p-5 text-center"
          style={{
            background: "linear-gradient(145deg,#2D1CB0,#4A2DBF,#6B45D0)",
            boxShadow: "0 12px 40px #2D1CB055",
          }}
        >
          <p className="text-[10px] font-bold tracking-widest uppercase text-white/60 mb-2">
            Transfer This Exact Amount
          </p>
          <p className="text-3xl font-black text-white">
            {typeof payAmount === "string" ? (
              payAmount
            ) : (
              <span>{payAmount}</span>
            )}
          </p>
          <p className="text-xs text-white/50 mt-1.5">
            {isLocalBuyFlow && buyRateInfo ? (
              <>at ₦{Math.round(buyRateInfo.rate).toLocaleString()}/{selectedToken?.symbol}</>
            ) : (
              <>
                ={" "}
                {formatSendAmount(amountToBuy.toLocaleString(), selectedCurrency?.code)}{" "}
                at ₦{selectedToken?.buyRate ? Number(selectedToken.buyRate).toLocaleString() : "—"}/$1
              </>
            )}
          </p>
          <p className="text-xs text-white/70 mt-1">
            You'll receive{" "}
            {isLocalBuyFlow && buyRateInfo
              ? buyRateInfo.cryptoAmount.toFixed(6)
              : numberOfToken}{" "}
            {selectedToken?.symbol}
          </p>
        </div>

        {/* Bank card */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{ border: "1.5px solid #D0D8FF", background: "#F8F9FF" }}
        >
          <div
            className="flex items-center justify-between px-4 py-3"
            style={{ borderBottom: "1px solid #E8ECFF" }}
          >
            <p
              className="text-[10px] font-bold tracking-widest uppercase"
              style={{ color: "#5B5EA6" }}
            >
              Pay Into This Account
            </p>
            <button
              type="button"
              onClick={handleCopyAccount}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold transition-all"
              style={{
                background: "#948EEE22",
                color: "#948EEE",
                border: "1px solid #948EEE33",
              }}
            >
              <Copy size={10} /> Copy Acct
            </button>
          </div>
          <div className="px-4 py-4">
            <p
              className="text-xs font-semibold mb-0.5"
              style={{ color: "#5B5EA6" }}
            >
              {bankName || "Loading…"}
            </p>
            <p
              className="text-2xl font-black font-mono"
              style={{ color: "#0E0F0C" }}
            >
              {accountNumber || "—"}
            </p>
            <p
              className="text-xs mt-0.5 font-medium"
              style={{ color: "#9A9A9A" }}
            >
              {accountName}
            </p>
            <div
              className="flex items-center justify-between mt-3 pt-3"
              style={{ borderTop: "1px solid #E8ECFF" }}
            >
              <span className="text-xs" style={{ color: "#9A9A9A" }}>
                Exact Amount
              </span>
              <span className="text-sm font-black" style={{ color: "#948EEE" }}>
                {typeof payAmount === "string" ? (
                  payAmount
                ) : (
                  <span>{payAmount}</span>
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Warning */}
        <div
          className="flex items-start gap-3 rounded-2xl px-4 py-3"
          style={{ background: "#FFFBF0", border: "1px solid #FFE4A0" }}
        >
          <span className="text-base leading-none mt-0.5">⚠️</span>
          <p className="text-xs leading-relaxed" style={{ color: "#A07000" }}>
            Transfer the exact amount shown above. Use any bank app or USSD.
            Then upload your receipt.
          </p>
        </div>

        {/* CTA */}
        <button
          type="button"
          onClick={() => setBuyView("upload")}
          disabled={isRateExpired}
          className="w-full py-4 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: isRateExpired
              ? "#D8D8D8"
              : "linear-gradient(135deg,#948EEE,#6B45D0)",
            color: "#FFFFFF",
            boxShadow: isRateExpired ? "none" : "0 6px 20px #948EEE44",
          }}
        >
          <Upload size={16} />
          <span>I've Paid — Upload Receipt</span>
          <ArrowRight size={16} />
        </button>

        {/* Copy toast */}
        <CopyToast visible={copyToastVisible} />
      </motion.div>
    </AnimatePresence>
  );
}
