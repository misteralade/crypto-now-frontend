import type {TradeAdditionalInfoInterface, TradeType} from "../../../types/trade.types.ts";
import TradeAdditionalInfo from "../TradeAdditionalInfo.tsx";
import CustomButton from "../../../components/global/Button.tsx";
import {useTradeStepTwo} from "../../../hooks/components/trade/useTradeStepTwo.ts";
import type {CustodialWalletResponse, SupportedCryptoOrCurrencyResponse} from "../../../types/response.payload.types.ts";
import TradePaymentUpload from "../TradePaymentUpload.tsx";
import CopyAccountDetails from "../CopyAccountDetails.tsx";
import {SESSION_STORAGE_KEYS} from "../../../util/constants.util.ts";
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
  "AWAITING_CRYPTO",
  "PAYMENT_ACCOUNT_CONFIRMED",
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

function TradeStatusMonitoring({
  tradeType,
  status,
  selectedToken,
}: {
  tradeType: TradeType;
  status?: string;
  selectedToken?: SupportedCryptoOrCurrencyResponse;
}) {
  const isBuy = tradeType === "buy";
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
            status === "CRYPTO_CONFIRMED"
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
                  status === "COMPLETED"
                ? "done"
                : "pending",
        },
        {
          label: "Bank Transfer",
          status:
            status === "DEPOSIT_CONFIRMED" || status === "PAYOUT_INITIATED"
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
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-5 py-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#948EEE33] bg-[#F0EFFD] text-3xl">
          {status === "COMPLETED" ? "✅" : isBuy ? "🔍" : "📡"}
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-extrabold text-[#0E0F0C]">{title}</h3>
          <p className="text-xs text-gray-500">{subtitle}</p>
        </div>
        <p className="max-w-md text-sm leading-relaxed text-gray-600">
          {summary}
        </p>
      </div>

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
}

const TradeStepTwo = ({ amountToBuy, tradeType, numberOfToken, additionalInfo, handleReceiptUrl, selectedToken, selectedCurrency, transactionRef, handleTransactionHash, handleSubmitPaymentProof, formatReceiveAmount, formatSendAmount, sellDepositWallet }: TradeStepTwoProps) => {
  const { useTransactionStatus } = useTransactionQuery();
  const { data: transactionDetails } = useTransactionStatus(transactionRef);
  const transactionStatus = transactionDetails?.status as TransactionStatus | undefined;
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
  } = useTradeStepTwo({tradeType, amountToBuy, numberOfToken, selectedToken, selectedCurrency, sellDepositWallet });

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
