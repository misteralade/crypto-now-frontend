import { Fragment } from "react";
import { useTransactionDetailsPage } from "../../../hooks/pages/useTransactionDetailsPage.ts";
import { LoadingSpinner } from "../../../components/global/LoadingSpinner.tsx";
import {
  ROUTES,
  transactionStatusMessages,
  transactionStatusStyles,
} from "../../../util/constants.util.ts";
import { convertToMillify, formatNumber } from "../../../util/index.util.ts";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowLeft,
  Check,
  Clock,
  Copy,
  ExternalLink,
  Headphones,
} from "lucide-react";
import momentClient from "../../../lib/moment.ts";
import DisputeTransactionModal from "./modals/DisputeTransactionModal.tsx";
import TransactionReceiptsSection from "./TransactionReceiptsSection.tsx";
import { getStatusDisplayName } from "../../../util/transaction.util.ts";

const TransactionDetailsPage = () => {
  const navigate = useNavigate();
  const {
    transactionDetails: transaction,
    loadingTransactionDetails,
    showDisputeTransaction,
    copiedField,
    disputeCountdown,
    canDispute,
    toggleDisputeTransaction,
    copyToClipboard,
    handleSubmitDispute,
  } = useTransactionDetailsPage();

  const transactionColorScheme =
    transactionStatusStyles[transaction?.status as keyof typeof transactionStatusStyles];
  const transactionMessage =
    transactionStatusMessages[transaction?.status as keyof typeof transactionStatusStyles];

  const getAmountFiatNGN = () => {
    const amountFiat = Number(transaction?.amountFiat ?? 0);
    const currency = transaction?.currency;
    const stableToFiatRate = Number(transaction?.stableToFiatRate ?? 0);
    if (currency === "NGN") return amountFiat;
    if (currency === "USD" && stableToFiatRate > 0) return amountFiat * stableToFiatRate;
    return amountFiat;
  };

  const formatFiatAmount = () => {
    if (!transaction) return "";
    return `₦${convertToMillify(getAmountFiatNGN(), 3)}`;
  };

  const getExchangeRateDisplay = () => {
    const amountCrypto = Number(transaction?.amountCrypto ?? 0);
    const symbol = transaction?.cryptocurrency?.symbol || "CRYPTO";
    const exchangeRate = transaction?.exchangeRate;
    const currency = transaction?.currency;
    const amountFiat = Number(transaction?.amountFiat ?? 0);
    const amountFiatNGN = getAmountFiatNGN();
    if (amountCrypto <= 0) return "—";
    if (exchangeRate?.rate != null) {
      return currency === "USD"
        ? `1 ${symbol} = $${convertToMillify(Number(exchangeRate.rate), 2)}`
        : `1 ${symbol} = ₦${convertToMillify(Number(exchangeRate.rate) * Number(exchangeRate.platformRate ?? 0), 2)}`;
    }
    return currency === "USD"
      ? `1 ${symbol} = $${convertToMillify(amountFiat / amountCrypto, 2)}`
      : `1 ${symbol} = ₦${convertToMillify(amountFiatNGN / amountCrypto, 2)}`;
  };

  const isBuy = transaction?.type?.toUpperCase() === "BUY";

  /* ── Reusable copy row ── */
  const CopyRow = ({ label, value, field, mono = false }: { label: string; value: string; field: string; mono?: boolean }) => (
    <div>
      <p className="text-[10px] font-bold tracking-widest uppercase mb-1.5" style={{ color: "#9A9A9A" }}>{label}</p>
      <div className="flex items-center gap-2 px-3 py-2.5 rounded-2xl" style={{ background: "#F7F7F9", border: "1px solid #EEEEEE" }}>
        <p className={`flex-1 text-xs break-all leading-relaxed ${mono ? "font-mono" : "font-medium"}`} style={{ color: "#0E0F0C" }}>
          {value}
        </p>
        <button
          type="button"
          onClick={() => copyToClipboard(value, field)}
          className="shrink-0 w-7 h-7 rounded-xl flex items-center justify-center transition-all"
          style={{
            background: copiedField === field ? "#E8F8F0" : "#EEEEEE",
            color: copiedField === field ? "#037847" : "#6B6E6B",
          }}
        >
          {copiedField === field ? <Check size={11} /> : <Copy size={11} />}
        </button>
      </div>
    </div>
  );

  /* ── Info row (label + value, no copy) ── */
  const InfoRow = ({ label, value }: { label: string; value: string }) => (
    <div>
      <p className="text-[10px] font-bold tracking-widest uppercase mb-1" style={{ color: "#9A9A9A" }}>{label}</p>
      <p className="text-sm font-semibold" style={{ color: "#0E0F0C" }}>{value}</p>
    </div>
  );

  /* ── Card shell ── */
  const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
    <div className={`rounded-3xl p-5 ${className}`} style={{ background: "#FFFFFF", border: "1px solid #F0F0F0" }}>
      {children}
    </div>
  );

  const CardTitle = ({ children }: { children: React.ReactNode }) => (
    <p className="text-[10px] font-bold tracking-widest uppercase mb-4" style={{ color: "#9A9A9A" }}>{children}</p>
  );

  return (
    <Fragment>
      {loadingTransactionDetails ? (
        <LoadingSpinner fullScreen={true} />
      ) : transaction ? (
        <Fragment>
          <div className="max-w-3xl mx-auto px-4 pb-12 pt-4 sm:px-5 lg:px-0 space-y-4">

            {/* ── Header ── */}
            <div className="flex items-center justify-between gap-3 mb-2">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => navigate({ to: ROUTES.TRANSACTION })}
                  className="w-10 h-10 rounded-2xl flex items-center justify-center transition-colors"
                  style={{ background: "#F7F7F9", border: "1px solid #EEEEEE", color: "#0E0F0C" }}
                  aria-label="Back"
                >
                  <ArrowLeft size={18} />
                </button>
                <div>
                  <h1 className="text-xl font-extrabold" style={{ color: "#0E0F0C", fontFamily: "'DM Sans', sans-serif", letterSpacing: "-0.02em" }}>
                    Transaction Details
                  </h1>
                  <p className="text-xs mt-0.5" style={{ color: "#9A9A9A" }}>
                    REF: {transaction.sessionId.slice(0, 14).toUpperCase()}
                  </p>
                </div>
              </div>

              {/* Dispute button */}
              <button
                onClick={toggleDisputeTransaction}
                disabled={!canDispute}
                className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-bold transition-all"
                style={
                  canDispute
                    ? { background: "#FEECEC", color: "#EB5757", border: "1px solid #F5C0C0" }
                    : { background: "#F7F7F9", color: "#9A9A9A", border: "1px solid #EEEEEE", cursor: "not-allowed" }
                }
              >
                <AlertTriangle size={13} />
                {canDispute ? "Dispute" : (
                  <span className="flex items-center gap-1">
                    <Clock size={11} />
                    {disputeCountdown}
                  </span>
                )}
              </button>
            </div>

            {/* ── Hero status card ── */}
            <div
              className="rounded-3xl p-5 flex items-start gap-4"
              style={{
                background: transactionColorScheme?.bg?.includes("green") ? "#E8F8F0"
                  : transactionColorScheme?.bg?.includes("red") ? "#FEECEC"
                  : transactionColorScheme?.bg?.includes("yellow") ? "#FFFBF0"
                  : "#F0EFFD",
                border: `1px solid ${
                  transactionColorScheme?.bg?.includes("green") ? "#A8E6C8"
                  : transactionColorScheme?.bg?.includes("red") ? "#F5C0C0"
                  : transactionColorScheme?.bg?.includes("yellow") ? "#FFE4A0"
                  : "#C7C4F5"
                }`,
              }}
            >
              {/* Crypto icon */}
              <div className="w-12 h-12 rounded-2xl shrink-0 overflow-hidden flex items-center justify-center"
                style={{ background: isBuy ? "rgba(3,120,71,0.10)" : "rgba(148,142,238,0.12)" }}>
                <img src={transaction.cryptocurrency?.logoUrl} alt={transaction.cryptocurrency?.symbol}
                  className="w-8 h-8 object-contain" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-base font-extrabold" style={{ color: "#0E0F0C", fontFamily: "'DM Sans', sans-serif" }}>
                      {isBuy ? "Buy" : "Sell"} {transaction.cryptocurrency?.name}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: "#9A9A9A" }}>
                      {momentClient.formatToTransactionInitiationDate(transaction.createdAt)}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-lg font-black" style={{ color: isBuy ? "#037847" : "#0E0F0C", fontFamily: "'DM Sans', sans-serif" }}>
                      {formatFiatAmount()}
                    </p>
                    <p className="text-xs font-semibold mt-0.5" style={{ color: "#6B6E6B" }}>
                      {formatNumber(transaction.amountCrypto)} {transaction.cryptocurrency?.symbol}
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <span
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold"
                    style={{
                      background: transactionColorScheme?.bg?.includes("green") ? "#E8F8F0"
                        : transactionColorScheme?.bg?.includes("red") ? "#FEECEC"
                        : transactionColorScheme?.bg?.includes("yellow") ? "#FFF3D0"
                        : "#F0EFFD",
                      color: transactionColorScheme?.bg?.includes("green") ? "#037847"
                        : transactionColorScheme?.bg?.includes("red") ? "#EB5757"
                        : transactionColorScheme?.bg?.includes("yellow") ? "#A07000"
                        : "#575AE5",
                    }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full" style={{
                      background: transactionColorScheme?.bg?.includes("green") ? "#037847"
                        : transactionColorScheme?.bg?.includes("red") ? "#EB5757"
                        : transactionColorScheme?.bg?.includes("yellow") ? "#A07000"
                        : "#575AE5",
                    }} />
                    {getStatusDisplayName(transaction.status)}
                  </span>
                  {transactionMessage?.message && (
                    <p className="text-xs" style={{ color: "#6B6E6B" }}>{transactionMessage.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* ── Overview grid ── */}
            <Card>
              <CardTitle>Overview</CardTitle>
              <div className="grid grid-cols-2 gap-4">
                <InfoRow label="Crypto Amount" value={`${formatNumber(transaction.amountCrypto)} ${transaction.cryptocurrency?.symbol}`} />
                <InfoRow label="Fiat Amount" value={formatFiatAmount()} />
                <InfoRow label="Exchange Rate" value={getExchangeRateDisplay()} />
                <InfoRow label="Type" value={isBuy ? "Buy" : "Sell"} />
              </div>
            </Card>

            {/* ── Receipts ── */}
            <TransactionReceiptsSection
              receiptImageUrl={transaction.receiptImageUrl}
              adminPaymentReceiptUrl={(transaction as any).adminPaymentReceiptUrl}
            />

            {/* ── Crypto wallet ── */}
            {transaction.userCryptoWallet && (
              <Card>
                <CardTitle>Your Crypto Wallet</CardTitle>
                <div className="space-y-4">
                  <CopyRow label="Wallet Address" value={transaction.userCryptoWallet.walletAddress} field="wallet" mono />
                  <div className="grid grid-cols-2 gap-4">
                    <InfoRow label="Network" value={transaction.userCryptoWallet.network} />
                    <InfoRow label="Coin" value={transaction.cryptocurrency?.symbol ?? "—"} />
                  </div>
                </div>
              </Card>
            )}

            {/* ── Bank account ── */}
            {transaction.userBankAccount && (
              <Card>
                <CardTitle>Payout Bank Account</CardTitle>
                <div className="space-y-4">
                  <InfoRow label="Account Name" value={transaction.userBankAccount.accountName} />
                  <CopyRow label="Account Number" value={transaction.userBankAccount.accountNumber} field="account" mono />
                  <InfoRow label="Bank" value={transaction.userBankAccount.bankName} />
                </div>
              </Card>
            )}

            {/* ── Crypto tx hash ── */}
            {transaction.cryptoTxHash && (
              <Card>
                <CardTitle>Blockchain</CardTitle>
                <CopyRow label="Transaction Hash" value={transaction.cryptoTxHash} field="txhash" mono />
              </Card>
            )}

            {/* ── Admin note ── */}
            {transaction.adminNotes && (
              <div className="rounded-3xl px-5 py-4" style={{ background: "#FFFBF0", border: "1px solid #FFE4A0" }}>
                <p className="text-[10px] font-bold tracking-widest uppercase mb-2" style={{ color: "#A07000" }}>Note from Support</p>
                <p className="text-sm leading-relaxed" style={{ color: "#7A6000" }}>{transaction.adminNotes}</p>
              </div>
            )}

            {/* ── Timeline + refs ── */}
            <Card>
              <CardTitle>Timeline</CardTitle>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold" style={{ color: "#6B6E6B" }}>Created</p>
                  <p className="text-xs font-bold" style={{ color: "#0E0F0C" }}>
                    {momentClient.formatToTransactionInitiationDate(transaction.createdAt)}
                  </p>
                </div>
                <div style={{ height: "1px", background: "#F0F0F0" }} />
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold" style={{ color: "#6B6E6B" }}>Last Updated</p>
                  <p className="text-xs font-bold" style={{ color: "#0E0F0C" }}>
                    {momentClient.formatToTransactionInitiationDate(transaction.updatedAt)}
                  </p>
                </div>
                {transaction.processedAt && (
                  <>
                    <div style={{ height: "1px", background: "#F0F0F0" }} />
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold" style={{ color: "#6B6E6B" }}>Processed</p>
                      <p className="text-xs font-bold" style={{ color: "#0E0F0C" }}>
                        {momentClient.formatToTransactionInitiationDate(transaction.processedAt)}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </Card>

            {/* ── Reference IDs ── */}
            <Card>
              <CardTitle>Reference IDs</CardTitle>
              <div className="space-y-3">
                <CopyRow label="Session ID" value={transaction.sessionId} field="session" mono />
                <CopyRow label="Transaction ID" value={transaction.id} field="transaction" mono />
                <CopyRow
                  label="User Email"
                  value={(transaction?.user ? transaction.user.email : (transaction as any).email) || ""}
                  field="email"
                />
                <CopyRow label="Rate Snapshot" value={transaction.rateSnapshot ? JSON.stringify(transaction.rateSnapshot) : '—'} field="exchange" mono />
              </div>
            </Card>

            {/* ── Support ── */}
            <div className="rounded-3xl px-5 py-4 flex items-center gap-4" style={{ background: "#F0EFFD", border: "1px solid #C7C4F5" }}>
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0" style={{ background: "#948EEE" }}>
                <Headphones size={18} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold" style={{ color: "#0E0F0C" }}>Need help?</p>
                <p className="text-xs mt-0.5" style={{ color: "#6B6E6B" }}>Our support team is here for you</p>
              </div>
              <button
                onClick={() => window.open(ROUTES.CONTACT, "_blank")}
                className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-bold"
                style={{ background: "#948EEE", color: "#FFFFFF" }}
              >
                Contact <ExternalLink size={11} />
              </button>
            </div>

          </div>

          {showDisputeTransaction && (
            <DisputeTransactionModal
              transactionId={transaction.sessionId}
              onClose={toggleDisputeTransaction}
              onSubmit={handleSubmitDispute}
            />
          )}
        </Fragment>
      ) : (
        <Fragment />
      )}
    </Fragment>
  );
};

export default TransactionDetailsPage;
