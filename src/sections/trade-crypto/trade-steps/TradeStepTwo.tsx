import type {TradeAdditionalInfoInterface, TradeType} from "../../../types/trade.types.ts";
import TradeAdditionalInfo from "../TradeAdditionalInfo.tsx";
import CustomButton from "../../../components/global/Button.tsx";
import {useTradeStepTwo} from "../../../hooks/components/trade/useTradeStepTwo.ts";
import type {CustodialWalletResponse, SupportedCryptoOrCurrencyResponse} from "../../../types/response.payload.types.ts";
import TradePaymentUpload from "../TradePaymentUpload.tsx";
import CopyAccountDetails from "../CopyAccountDetails.tsx";
import ManualDepositRecheckAction from "../../../components/global/ManualDepositRecheckAction.tsx";
import {LOCAL_STORAGE_KEYS, SESSION_STORAGE_KEYS} from "../../../util/constants.util.ts";
import {useState, useEffect} from "react";
import type React from "react";
import {transactionServiceApi} from "../../../api/transaction.api.ts";
import {toast} from "react-toastify";
import { useTransactionQuery } from "../../../queries/transaction.query.ts";
import type { TransactionStatus } from "../../../types/request.payload.types.ts";

type MonitoringStep = {
  label: string;
  status: "done" | "active" | "pending";
};

type StatusTone = "neutral" | "info" | "warning" | "success" | "danger";

type StatusMeta = {
  label: string;
  tone: StatusTone;
  emoji: string;
  note: string;
};

const BUY_MONITORING_STATUSES: TransactionStatus[] = [
  "AWAITING_PAYMENT",
  "PAYMENT_RECEIVED",
  "PAYMENT_CONFIRMED",
  "PROCESSING",
  "CRYPTO_SENT",
  "CRYPTO_RECEIVED",
  "CRYPTO_CONFIRMED",
  "COMPLETED",
  "FAILED",
  "EXPIRED",
  "CANCELLED",
];

const SELL_MONITORING_STATUSES: TransactionStatus[] = [
  "INITIATED",
  "AWAITING_CRYPTO",
  "DEPOSIT_DETECTED",
  "DEPOSIT_PENDING_MINIMUM",
  "DEPOSIT_CONFIRMED",
  "PAYOUT_INITIATED",
  "PAYOUT_FAILED",
  "COMPLETED",
  "FAILED",
  "EXPIRED",
  "CANCELLED",
];

const STATUS_META: Partial<Record<TransactionStatus, StatusMeta>> = {
  AWAITING_PAYMENT: {
    label: "Awaiting Payment",
    tone: "info",
    emoji: "⏳",
    note: "We are waiting for the payment receipt to be submitted.",
  },
  PAYMENT_RECEIVED: {
    label: "Payment Received",
    tone: "info",
    emoji: "📥",
    note: "Your receipt has landed. We are verifying it now.",
  },
  PAYMENT_CONFIRMED: {
    label: "Payment Confirmed",
    tone: "success",
    emoji: "✅",
    note: "The payment is confirmed and crypto is being released.",
  },
  PROCESSING: {
    label: "Processing",
    tone: "info",
    emoji: "🔄",
    note: "The transaction is being processed right now.",
  },
  CRYPTO_SENT: {
    label: "Crypto Sent",
    tone: "success",
    emoji: "🚀",
    note: "Crypto has been released and is on the way.",
  },
  CRYPTO_RECEIVED: {
    label: "Crypto Received",
    tone: "success",
    emoji: "✅",
    note: "Your wallet has received the crypto.",
  },
  CRYPTO_CONFIRMED: {
    label: "Crypto Confirmed",
    tone: "success",
    emoji: "✅",
    note: "Blockchain confirmation is complete.",
  },
  AWAITING_CRYPTO: {
    label: "Waiting for Deposit",
    tone: "warning",
    emoji: "📡",
    note: "Send the crypto to your unique deposit wallet.",
  },
  DEPOSIT_DETECTED: {
    label: "Deposit Detected",
    tone: "info",
    emoji: "⚡",
    note: "We detected the deposit and are waiting for confirmations.",
  },
  DEPOSIT_PENDING_MINIMUM: {
    label: "Below Minimum",
    tone: "warning",
    emoji: "⚠️",
    note: "A deposit was found, but the total is still below the minimum.",
  },
  DEPOSIT_CONFIRMED: {
    label: "Deposit Confirmed",
    tone: "success",
    emoji: "✅",
    note: "Deposit confirmed. NGN payout is being prepared.",
  },
  PAYOUT_INITIATED: {
    label: "Payout Initiated",
    tone: "info",
    emoji: "🏦",
    note: "Your bank transfer has been initiated.",
  },
  PENDING_PAYOUT: {
    label: "Pending Payout",
    tone: "warning",
    emoji: "🕒",
    note: "Payout is queued and waiting for the next attempt.",
  },
  PAYOUT_FAILED: {
    label: "Payout Failed",
    tone: "danger",
    emoji: "❌",
    note: "The payout did not complete. We will retry or review it.",
  },
  COMPLETED: {
    label: "Completed",
    tone: "success",
    emoji: "✅",
    note: "The transaction has been completed successfully.",
  },
  FAILED: {
    label: "Failed",
    tone: "danger",
    emoji: "❌",
    note: "The transaction failed and needs attention.",
  },
  EXPIRED: {
    label: "Expired",
    tone: "danger",
    emoji: "⌛",
    note: "The transaction expired before it could complete.",
  },
  CANCELLED: {
    label: "Cancelled",
    tone: "danger",
    emoji: "🚫",
    note: "The transaction was cancelled.",
  },
};

const TONE_STYLES: Record<StatusTone, { bg: string; border: string; text: string; badge: string; accent: string }> = {
  neutral: {
    bg: "bg-gray-50",
    border: "border-gray-200",
    text: "text-gray-700",
    badge: "bg-gray-100 text-gray-700 border-gray-200",
    accent: "bg-gray-400",
  },
  info: {
    bg: "bg-sky-50",
    border: "border-sky-200",
    text: "text-sky-800",
    badge: "bg-sky-100 text-sky-800 border-sky-200",
    accent: "bg-sky-500",
  },
  warning: {
    bg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-900",
    badge: "bg-amber-100 text-amber-900 border-amber-200",
    accent: "bg-amber-500",
  },
  success: {
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    text: "text-emerald-800",
    badge: "bg-emerald-100 text-emerald-800 border-emerald-200",
    accent: "bg-emerald-500",
  },
  danger: {
    bg: "bg-rose-50",
    border: "border-rose-200",
    text: "text-rose-800",
    badge: "bg-rose-100 text-rose-800 border-rose-200",
    accent: "bg-rose-500",
  },
};

function getStatusMeta(status?: string, tradeType?: TradeType): StatusMeta {
  if (status && status in STATUS_META) {
    return STATUS_META[status as TransactionStatus]!;
  }

  return tradeType === "buy"
    ? {
        label: "Monitoring Payment",
        tone: "info",
        emoji: "🔍",
        note: "We are checking for changes to your transaction.",
      }
    : {
        label: "Waiting for Deposit",
        tone: "warning",
        emoji: "📡",
        note: "We are waiting for your crypto deposit.",
      };
}

function isActiveStatus(status?: string): boolean {
  return !!status && !["COMPLETED", "FAILED", "EXPIRED", "CANCELLED"].includes(status);
}

function TradeStatusMonitoring({
  tradeType,
  status,
  selectedToken,
  onManualRecheck,
  manualRecheckPending,
}: {
  tradeType: TradeType;
  status?: string;
  selectedToken?: SupportedCryptoOrCurrencyResponse;
  onManualRecheck?: () => void;
  manualRecheckPending?: boolean;
}) {
  const isBuy = tradeType === "buy";
  const statusMeta = getStatusMeta(status, tradeType);
  const tone = TONE_STYLES[statusMeta.tone];
  const isActive = isActiveStatus(status);
  const steps: MonitoringStep[] = isBuy
    ? [
        { label: "Payment Receipt Submitted", status: "done" },
        {
          label: "Admin Verifying Payment",
          status:
            status === "PAYMENT_CONFIRMED" ||
            status === "CRYPTO_SENT" ||
            status === "CRYPTO_RECEIVED" ||
            status === "CRYPTO_CONFIRMED" ||
            status === "COMPLETED"
              ? "done"
              : "active",
        },
        {
          label: "Releasing Crypto to Wallet",
          status:
            status === "PAYMENT_CONFIRMED" ||
            status === "CRYPTO_SENT" ||
            status === "CRYPTO_RECEIVED" ||
            status === "CRYPTO_CONFIRMED" ||
            status === "PENDING_PAYOUT"
              ? "active"
              : status === "COMPLETED"
                ? "done"
                : "pending",
        },
        {
          label: "Transaction Completed",
          status: status === "COMPLETED" ? "done" : "pending",
        },
      ]
    : [
        { label: "Blockchain Monitoring Active", status: "done" },
        {
          label: "Waiting for Crypto Detection",
          status:
            status === "DEPOSIT_DETECTED" ||
            status === "DEPOSIT_PENDING_MINIMUM" ||
            status === "DEPOSIT_CONFIRMED" ||
            status === "PAYOUT_INITIATED" ||
            status === "PENDING_PAYOUT" ||
            status === "COMPLETED"
              ? "done"
              : "active",
        },
        {
          label: "Auto-Converting to NGN",
          status:
            status === "DEPOSIT_DETECTED" ||
            status === "DEPOSIT_PENDING_MINIMUM"
              ? "active"
            : status === "DEPOSIT_CONFIRMED" ||
                  status === "PAYOUT_INITIATED" ||
                  status === "PENDING_PAYOUT" ||
                  status === "COMPLETED"
                ? "done"
                : "pending",
        },
        {
          label: "Bank Transfer",
          status:
            status === "DEPOSIT_CONFIRMED" ||
            status === "PAYOUT_INITIATED" ||
            status === "PENDING_PAYOUT"
              ? "active"
              : status === "COMPLETED"
                ? "done"
                : "pending",
        },
      ];

  const title = isBuy
    ? status === "COMPLETED"
      ? "Transaction Completed"
      : "Verifying Payment"
    : status === "COMPLETED"
      ? "Transaction Completed"
      : "Monitoring Wallet";

  const subtitle = isBuy
    ? status === "PAYMENT_CONFIRMED"
      ? "Payment confirmed. Releasing crypto."
      : "Checking your payment status."
    : status === "DEPOSIT_DETECTED"
      ? "Deposit detected. Waiting for confirmations."
      : status === "DEPOSIT_PENDING_MINIMUM"
        ? "Deposit found, but it is still below the minimum."
        : status === "DEPOSIT_CONFIRMED"
          ? "Deposit confirmed. Processing payout."
          : status === "PAYOUT_INITIATED"
            ? "Payout initiated. Waiting for bank completion."
            : "Listening for your blockchain transaction.";

  const summary = isBuy
    ? status === "COMPLETED"
      ? `Your payment was verified and ${selectedToken?.symbol ?? "crypto"} has been released.`
      : "Your payment receipt has been submitted. We are polling for updates and will continue automatically."
    : status === "COMPLETED"
      ? `Your ${selectedToken?.symbol ?? "crypto"} sale has completed successfully.`
      : `We are monitoring your ${selectedToken?.symbol ?? "crypto"} deposit and will continue automatically once the network confirms it.`;

  const showManualRecheck =
    !isBuy &&
    ["INITIATED", "AWAITING_CRYPTO"].includes(status ?? "");

  const statusColors = {
    done: {
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      dot: "bg-emerald-600",
      text: "text-emerald-700",
    },
    active: {
      bg: "bg-amber-50",
      border: "border-amber-200",
      dot: "bg-amber-500",
      text: "text-amber-800",
    },
    pending: {
      bg: "bg-gray-50",
      border: "border-gray-200",
      dot: "bg-gray-300",
      text: "text-gray-500",
    },
  } as const;

  return (
    <div className="space-y-6">
      <div className={`flex flex-col items-center gap-3 rounded-2xl border px-5 py-6 text-center ${tone.bg} ${tone.border}`}>
        <div className={`flex h-16 w-16 items-center justify-center rounded-full border-2 ${tone.border} bg-white text-3xl shadow-sm`}>
          {isActive ? (
            <span className="inline-flex h-7 w-7 items-center justify-center">
              <span className={`h-7 w-7 animate-spin rounded-full border-2 border-current border-t-transparent ${tone.text}`} />
            </span>
          ) : (
            <span>{statusMeta.emoji}</span>
          )}
        </div>
        <div className="space-y-1">
          <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] ${tone.badge}`}>
            <span className={`h-2.5 w-2.5 rounded-full ${isActive ? `${tone.accent} animate-pulse` : tone.accent}`} />
            {statusMeta.label}
          </div>
          <h3 className="text-base font-extrabold text-[#0E0F0C]">
            {title}
          </h3>
          <p className="text-xs text-gray-500">{subtitle}</p>
        </div>
        <p className="max-w-md text-sm leading-relaxed text-gray-600">
          {summary}
        </p>
        <div className={`w-full max-w-md rounded-2xl border px-4 py-3 text-left ${tone.badge}`}>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] opacity-80">
            Latest status
          </p>
          <p className="mt-1 text-sm font-bold text-inherit">
            {statusMeta.emoji} {statusMeta.label}
          </p>
          <p className="mt-1 text-xs leading-relaxed opacity-90">
            {statusMeta.note}
          </p>
        </div>
      </div>

      {showManualRecheck && (
        <ManualDepositRecheckAction
          title={`Already sent your ${selectedToken?.symbol ?? "crypto"}?`}
          description="If network detection is delayed, confirm the wallet state and let us recheck the deposit immediately."
          isPending={manualRecheckPending}
          disabled={!onManualRecheck}
          onConfirm={() => onManualRecheck?.()}
          confirmTitle="Confirm manual deposit check"
          confirmDescription="We will read the live wallet balance and compare it against the cached wallet state before any payout can proceed."
          confirmLabel="Yes, check now"
          pendingText="Rechecking deposit..."
        />
      )}

      <div className="space-y-2.5">
        {steps.map((step, index) => {
          const palette = statusColors[step.status];
          return (
            <div
              key={step.label}
              className={`flex items-center gap-3 rounded-2xl border px-4 py-3.5 ${palette.bg} ${palette.border}`}
            >
              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${step.status === "pending" ? "bg-gray-200" : palette.dot}`}
              >
                {step.status === "done" ? (
                  <span className="text-xs font-bold text-white">✓</span>
                ) : step.status === "active" ? (
                  <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
                ) : (
                  <span className="text-[11px] font-bold text-gray-500">
                    {index + 1}
                  </span>
                )}
              </div>
              <span className={`text-xs font-semibold ${palette.text}`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface TradeStepTwoProps {
  amountToBuy: number;
  tradeType: TradeType;
  numberOfToken: number;
  additionalInfo: TradeAdditionalInfoInterface[];
  handleReceiptUrl: (value: string) => void;
  selectedToken?: SupportedCryptoOrCurrencyResponse;
  selectedCurrency?: SupportedCryptoOrCurrencyResponse;
  transactionRef: string | undefined;
  handleTransactionHash: (string: string) => void;
  handleSubmitPaymentProof: () => void;
  formatReceiveAmount: (amount: number | string, currencyCode: string | undefined) => string | React.ReactNode;
  formatSendAmount: (amount: number | string, currencyCode: string | undefined) => string | React.ReactNode;
  sellDepositWallet?: CustodialWalletResponse | null;
  sellNetwork?: string;
}

const TradeStepTwo = ({ amountToBuy, tradeType, numberOfToken, additionalInfo, handleReceiptUrl, selectedToken, selectedCurrency, transactionRef, handleTransactionHash, handleSubmitPaymentProof, formatReceiveAmount, formatSendAmount, sellDepositWallet, sellNetwork }: TradeStepTwoProps) => {
  const { useTransactionStatus, manualSellDepositRecheckMutation } = useTransactionQuery();
  const { data: transactionDetails } = useTransactionStatus(transactionRef);
  const transactionStatus = transactionDetails?.status as TransactionStatus | undefined;
  const isAuthenticated = !!localStorage.getItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
  const {
    // Values
    // files,
    transactionHash,
    paymentDetailsLoading,
    paymentDetailsError,
    submitInvalid,
    accountDetails,
    walletDetails,

    // Functions
    setTransactionHash,
    setUploadedFileUrl,
  } = useTradeStepTwo({tradeType, amountToBuy, numberOfToken, selectedToken, selectedCurrency, sellDepositWallet, sellNetwork, transactionRef });

  const showMonitoringView =
    !!transactionRef &&
    !!transactionStatus &&
    (
      tradeType === "buy"
        ? BUY_MONITORING_STATUSES.includes(transactionStatus)
        : SELL_MONITORING_STATUSES.includes(transactionStatus)
    );
  
  // Retrieve stored values from session storage (if receipt was uploaded)
  // Only use stored values if they exist and are not empty
  const [storedYouPay, setStoredYouPay] = useState<string | null>(null);
  const [storedYouReceive, setStoredYouReceive] = useState<string | null>(null);
  
  useEffect(() => {
    const youPayValue = sessionStorage.getItem(SESSION_STORAGE_KEYS.YOU_PAY_VALUE);
    const youReceiveValue = sessionStorage.getItem(SESSION_STORAGE_KEYS.YOU_RECEIVE_VALUE);
    
    // Only set if value exists and is not "[object Object]"
    if (youPayValue && youPayValue !== "[object Object]" && youPayValue.trim() !== "") {
      setStoredYouPay(youPayValue);
    }
    
    if (youReceiveValue && youReceiveValue !== "[object Object]" && youReceiveValue.trim() !== "") {
      setStoredYouReceive(youReceiveValue);
    }
  }, []);
  
  // Loading state
  if (paymentDetailsLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-gray-600">Loading payment details...</span>
      </div>
    );
  }

  // Error state
  if (paymentDetailsError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
        <h3 className="font-semibold text-red-800 mb-2">Error Loading Payment Details</h3>
        <p className="text-red-700 text-sm mb-4">
          {paymentDetailsError?.message || 'Failed to load payment details'}
        </p>
        <CustomButton
          buttonText="Retry"
          onClick={() => window.location.reload()}
          className="bg-red-600 hover:bg-red-700"
        />
      </div>
    );
  }

  if (showMonitoringView) {
    return (
      <TradeStatusMonitoring
        tradeType={tradeType}
        status={transactionStatus}
        selectedToken={selectedToken}
        onManualRecheck={
          transactionRef && tradeType === "sell"
            ? () =>
                manualSellDepositRecheckMutation.mutate({
                  sessionId: transactionRef,
                  isAnonymous: !isAuthenticated,
                })
            : undefined
        }
        manualRecheckPending={manualSellDepositRecheckMutation.isPending}
      />
    );
  }

  const amountToPay = (amountToBuy: number, selectedCurrency?: SupportedCryptoOrCurrencyResponse) => {
    // Use stored value if available (after receipt upload)
    if (storedYouPay) {
      return storedYouPay;
    }
    // Otherwise calculate
    return formatSendAmount && typeof formatSendAmount === 'function'
      ? formatSendAmount(amountToBuy.toLocaleString(), selectedCurrency?.code)
      : `${amountToBuy} ${selectedCurrency?.code}`;
  };
  
  const amountToReceive = () => {
    // Use stored value if available (after receipt upload)
    if (storedYouReceive) {
      return storedYouReceive;
    }
    // Otherwise calculate
    if (tradeType === "buy") {
      return formatReceiveAmount && typeof formatReceiveAmount === 'function'
        ? formatReceiveAmount(amountToBuy, selectedCurrency?.code)
        : `${amountToBuy} ${selectedCurrency?.code}`;
    } else {
      return formatReceiveAmount && typeof formatReceiveAmount === 'function'
        ? formatReceiveAmount(amountToBuy, selectedCurrency?.code)
        : `${amountToBuy} ${selectedCurrency?.code}`;
    }
  };

  return (
    <div className="space-y-7">
      {/* Trade Type Specific Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        {tradeType === "buy" ? (
          <div>
            <h3 className="font-semibold text-blue-800 mb-2">
              💳 Payment Instructions (Buy Order)
            </h3>
            <p className="text-blue-700 text-sm">
              Please transfer <strong>{amountToPay(amountToBuy, selectedCurrency)}</strong> to the bank account details below,
              then upload your payment receipt/proof.
            </p>
          </div>
        ) : (
          <div>
            <h3 className="font-semibold text-orange-800 mb-2">
              Crypto Transfer Instructions (Sell Order)
            </h3>
            <p className="text-orange-700 text-sm">
              Please send <strong>{numberOfToken} {selectedToken?.symbol}</strong> to{" "}
              <strong>your unique deposit address</strong> shown below, on the{" "}
              <strong>{walletDetails?.network}</strong> network. After sending, provide
              the transaction hash below.
            </p>
          </div>
        )}
      </div>

      {/* Transaction Summary */}
      <div className="bg-gray-50 rounded-lg p-4 space-y-2">
        <h4 className="font-semibold text-gray-800">Transaction Summary</h4>
        {tradeType === "buy" ? (
          <>
            <p className="text-sm">
              <span className="text-gray-600">You pay:</span>
              <span className="font-semibold ml-2">
                {amountToPay(amountToBuy, selectedCurrency)}
              </span>

              {/* <span className="font-semibold ml-2">{amountToBuy.toLocaleString()} {selectedCurrency?.code}</span> */}
            </p>
            <p className="text-sm">
              <span className="text-gray-600">You receive:</span>
              <span className="font-semibold ml-2">
                {amountToReceive()}
              </span>
            </p>
          </>
        ) : (
          <>
            <p className="text-sm">
              <span className="text-gray-600">You send:</span>
              <span className="font-semibold ml-2">{numberOfToken} {selectedToken?.symbol}</span>
            </p>
            <p className="text-sm">
              <span className="text-gray-600">You receive:</span>
              <span className="font-semibold ml-2">
                {amountToReceive()}
              </span>
            </p>
          </>
        )}
      </div>

      {/* Account Details & Order Info */}
      <div className="space-y-3">
        <div className="flex w-full justify-between">
          <h1 className="text-md text-gray-600 font-bold">Session ID:</h1>

          <CopyAccountDetails accountNumber={transactionRef || ''}/>
        </div>

        <TradeAdditionalInfo
          heading={tradeType === "buy" ? "Bank Account Details" : "Crypto Wallet Details"}
          additionalInfo={accountDetails}
        />
        
        <TradeAdditionalInfo heading="Order Details" additionalInfo={additionalInfo} />
      </div>

      {/* Form */}
      <div className="space-y-10">
        {/* Transaction Hash Input for Sell Orders */}
        {tradeType === "sell" && (
          <div className="w-full md:w-3/4 mx-auto">
            <label htmlFor="transactionHash" className="block text-sm font-medium text-gray-700 mb-2">
              Transaction Hash
            </label>
            <input
              type="text"
              id="transactionHash"
              value={transactionHash}
              onChange={(e) => {
                setTransactionHash(e.target.value)
                handleTransactionHash(e.target.value)
              }}
              placeholder="Enter blockchain transaction hash (e.g., 0x123abc...)"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
            <p className="text-xs text-gray-500 mt-1">
              Provide the transaction hash from your crypto wallet after sending the {selectedToken?.symbol}
            </p>
          </div>
        )}

        {/* Payment Proof Upload - Only for Buy Orders */}
        {tradeType === "buy" && (
          <div className="w-full md:w-3/4 mx-auto">
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Payment Receipt/Proof *
              </label>
              <p className="text-xs text-gray-500">
                Upload bank transfer receipt, screenshot, or payment confirmation
              </p>
            </div>
            <TradePaymentUpload
              maxFiles={1}
              acceptedTypes={[".jpg", ".jpeg", ".png", ".webp", ".gif"]}
              onFileSelected={async (file) => {
                const fd = new FormData();
                fd.append("file", file);
                toast.loading("Uploading receipt…", { toastId: "receipt-upload" });
                try {
                  const result = await transactionServiceApi.uploadTransactionReceipt(fd);
                  toast.dismiss("receipt-upload");
                  if (result?.url) {
                    handleReceiptUrl(result.url);
                    setUploadedFileUrl(result.url);
                  }
                } catch {
                  toast.dismiss("receipt-upload");
                  toast.error("Failed to upload receipt. Please try again.");
                }
              }}
              onFileCleared={() => { handleReceiptUrl(""); setUploadedFileUrl(undefined); }}
            />
          </div>
        )}

        {/* Submit Button */}
        <div className="md:w-1/2 w-full mx-auto px-5 md:px-0">
          <CustomButton
            className="w-full"
            buttonText={tradeType === "buy" ? "Submit Payment Proof" : "Confirm Transaction"}
            disabled={submitInvalid}
            onClick={handleSubmitPaymentProof}
          />
          {submitInvalid && tradeType === "buy" && (
            <p className="text-xs text-red-500 mt-2 text-center">
              Please upload payment proof (file must be successfully uploaded)
            </p>
          )}
        </div>
      </div>

      {/* Important Notice */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Important Notice</h4>
        <ul className="text-yellow-700 text-sm space-y-1">
          {tradeType === "buy" ? (
            <>
              <li>• Double-check the bank details before making the transfer</li>
              <li>• Use the exact amount: <strong>{amountToPay(amountToBuy, selectedCurrency)}</strong></li>
              <li>• Include your order reference if requested by your bank</li>
              <li>• Keep your payment receipt for verification</li>
            </>
          ) : (
            <>
              <li>• Verify the wallet address and network before sending </li>
              <li>• Send exactly: <strong>{numberOfToken} {selectedToken?.symbol}</strong></li>
              <li>• Use the <strong>{walletDetails?.network}</strong> network only</li>
              <li>• Double-check the transaction hash before submitting</li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
}

export default TradeStepTwo;
