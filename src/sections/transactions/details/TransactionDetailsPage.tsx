import { Fragment, type ReactNode } from "react";
import { useTransactionDetailsPage } from "../../../hooks/pages/useTransactionDetailsPage.ts";
import { LoadingSpinner } from "../../../components/global/LoadingSpinner.tsx";
import {
  ROUTES,
} from "../../../util/constants.util.ts";
import { formatForDisplay, formatForDisplayLocalized, formatCompact } from "../../../util/asset-precision.ts";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowLeft,
  Check,
  ChevronRight,
  Clock,
  Copy,
  ExternalLink,
  Headphones,
} from "lucide-react";
import momentClient from "../../../lib/moment.ts";
import DisputeTransactionModal from "./modals/DisputeTransactionModal.tsx";
import TransactionReceiptsSection from "./TransactionReceiptsSection.tsx";
import TransactionContextCard from "./TransactionContextCard.tsx";
import {
  getStatusConfig,
  TRANSACTION_STATUS,
  TRANSACTION_TYPE,
} from "../../../util/transaction.util.ts";

const TransactionDetailsPage = () => {
  const navigate = useNavigate();
  const {
    transactionDetails: transaction,
    loadingTransactionDetails,
    showDisputeTransaction,
    copiedField,
    disputeCountdown,
    canDispute,
    isDisputeExpired,
    disputeForTransaction,
    disputeStatusLabel,
    isDisputeClosed,
    toggleDisputeTransaction,
    copyToClipboard,
    handleSubmitDispute,
  } = useTransactionDetailsPage();

  const statusConfig = getStatusConfig(transaction?.status);

  const getAmountFiatNGN = () => {
    const amountFiat = Number(transaction?.amountFiat ?? 0);
    const currency = transaction?.currency;
    const stableToFiatRate = Number(transaction?.stableToFiatRate ?? 0);
    if (currency === "NGN") return amountFiat;
    if (currency === "USD" && stableToFiatRate > 0)
      return amountFiat * stableToFiatRate;
    return amountFiat;
  };

  const formatFiatAmount = () => {
    if (!transaction) return "";
    return `₦${formatCompact(getAmountFiatNGN(), "NGN", 3)}`;
  };

  const getExchangeRateDisplay = (): ReactNode => {
    const rateSnapshot = (transaction?.rateSnapshot ?? null) as Record<
      string,
      unknown
    > | null;
    const snapshotPlatformRate = Number(rateSnapshot?.platformRate ?? 0);
    const platformRate =
      snapshotPlatformRate > 0
        ? snapshotPlatformRate
        : Number(transaction?.stableToFiatRate ?? 0);

    if (platformRate > 0) {
      return `₦${formatForDisplayLocalized(platformRate, "NGN")}`;
    }
    return "-";
  };

  const isBuy = transaction?.type?.toUpperCase() === TRANSACTION_TYPE.BUY;

  /* ── Reusable copy row ── */
  const CopyRow = ({
    label,
    value,
    field,
    mono = false,
  }: {
    label: string;
    value: string;
    field: string;
    mono?: boolean;
  }) => (
    <div>
      <p
        className="text-[10px] font-bold tracking-widest uppercase mb-1.5"
        style={{ color: "#9A9A9A" }}
      >
        {label}
      </p>
      <div
        className="flex items-center gap-2 px-3 py-2.5 rounded-2xl"
        style={{ background: "#F7F7F9", border: "1px solid #EEEEEE" }}
      >
        <p
          className={`flex-1 text-xs break-all leading-relaxed ${
            mono ? "font-mono" : "font-medium"
          }`}
          style={{ color: "#0E0F0C" }}
        >
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
  const InfoRow = ({
    label,
    value,
    align = "left",
  }: {
    label: string;
    value: ReactNode;
    align?: "left" | "right";
  }) => (
    <div className={align === "right" ? "text-right" : "text-left"}>
      <p
        className="text-[9px] sm:text-[10px] font-bold tracking-widest uppercase mb-1"
        style={{ color: "#9A9A9A" }}
      >
        {label}
      </p>
      <div className="text-xs sm:text-sm font-semibold" style={{ color: "#0E0F0C" }}>
        {value}
      </div>
    </div>
  );

  /* ── Card shell ── */
  const Card = ({
    children,
    className = "",
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <div
      className={`rounded-3xl p-5 ${className}`}
      style={{ background: "#FFFFFF", border: "1px solid #F0F0F0" }}
    >
      {children}
    </div>
  );

  const CardTitle = ({ children }: { children: React.ReactNode }) => (
    <p
      className="text-[10px] font-bold tracking-widest uppercase mb-4"
      style={{ color: "#9A9A9A" }}
    >
      {children}
    </p>
  );

  return (
    <Fragment>
      {loadingTransactionDetails ? (
        <LoadingSpinner fullScreen={true} />
      ) : transaction ? (
        <Fragment>
          <div className="max-w-3xl mx-auto px-4 pb-12 pt-4 sm:px-5 lg:px-0 space-y-4">
            {/* ── Header ── */}
            <div className="flex items-center justify-between gap-2 sm:gap-3 mb-2">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <button
                  type="button"
                  onClick={() => {
                    if (window.history.length > 1) {
                      window.history.back();
                    } else {
                      navigate({ to: ROUTES.TRANSACTION });
                    }
                  }}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all active:scale-[0.94] shrink-0"
                  style={{
                    background: "#F7F7F9",
                    border: "1px solid #EEEEEE",
                    color: "#0E0F0C",
                  }}
                  aria-label="Back"
                >
                  <ArrowLeft size={16} />
                </button>
                <div className="min-w-0">
                  <h1
                    className="text-sm sm:text-lg font-bold sm:font-extrabold whitespace-nowrap truncate"
                    style={{
                      color: "#0E0F0C",
                      fontFamily: "'DM Sans', sans-serif",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    Transaction Details
                  </h1>
                  <p className="text-[11px] sm:text-xs mt-0.5 truncate" style={{ color: "#9A9A9A" }}>
                    REF: {transaction.sessionId.slice(0, 14).toUpperCase()}
                  </p>
                </div>
              </div>

              {/* Dispute button: stays clickable in every state so
                  toggleDisputeTransaction's toast/navigation still fires;
                  visual styling only communicates whether it's "inactive". */}
              <button
                onClick={toggleDisputeTransaction}
                disabled={!disputeForTransaction && !canDispute && !isDisputeExpired}
                className="shrink-0 flex items-center gap-1 sm:gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl sm:rounded-2xl text-[11px] sm:text-xs font-bold transition-all whitespace-nowrap"
                style={
                  disputeForTransaction
                    ? isDisputeClosed
                      ? {
                          background: "#F0F0F0",
                          color: "#BDBDBD",
                          border: "1px solid #EEEEEE",
                        }
                      : {
                          background: "#F0EFFD",
                          color: "#575AE5",
                          border: "1px solid #C7C4F5",
                        }
                    : isDisputeExpired
                      ? {
                          background: "#F0F0F0",
                          color: "#BDBDBD",
                          border: "1px solid #EEEEEE",
                        }
                      : canDispute
                        ? {
                            background: "#FEECEC",
                            color: "#EB5757",
                            border: "1px solid #F5C0C0",
                          }
                        : {
                            background: "#F7F7F9",
                            color: "#9A9A9A",
                            border: "1px solid #EEEEEE",
                            cursor: "not-allowed",
                          }
                }
              >
                <AlertTriangle size={13} />
                {disputeForTransaction ? (
                  disputeStatusLabel
                ) : isDisputeExpired || canDispute ? (
                  "Dispute"
                ) : (
                  <span className="flex items-center gap-1">
                    <Clock size={11} />
                    {disputeCountdown}
                  </span>
                )}
              </button>
            </div>

            {/* ── Hero status card ── */}
            <div
              className="rounded-3xl p-5"
              style={{
                background: statusConfig.style.background,
                border: `1px solid ${statusConfig.style.border}`,
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <p
                      className="text-base font-extrabold"
                      style={{
                        color: "#0E0F0C",
                        fontFamily: "'DM Sans', sans-serif",
                      }}
                    >
                      {isBuy ? "Buy" : "Sell"}{" "}
                      {transaction.cryptocurrency?.name}
                    </p>
                    {transaction.cryptocurrency?.logoUrl && (
                      <img
                        src={transaction.cryptocurrency.logoUrl}
                        alt={transaction.cryptocurrency.symbol}
                        className="w-4 h-4 sm:w-5 sm:h-5 object-contain inline-block shrink-0"
                      />
                    )}
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: "#9A9A9A" }}>
                    {momentClient.formatToTransactionInitiationDate(
                      transaction.createdAt
                    )}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p
                    className="text-lg font-black"
                    style={{
                      color: isBuy ? "#037847" : "#0E0F0C",
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    {formatFiatAmount()}
                  </p>
                  <p
                    className="text-xs font-semibold mt-0.5"
                    style={{ color: "#6B6E6B" }}
                  >
                    {formatForDisplay(Number(transaction.amountCrypto), transaction.cryptocurrency?.symbol ?? "")}{" "}
                    {transaction.cryptocurrency?.symbol}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between gap-2.5">
                <span
                  className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold whitespace-nowrap shrink-0"
                  style={{
                    background: statusConfig.style.background,
                    color: statusConfig.style.color,
                  }}
                >
                  {statusConfig.displayName}
                </span>

                {(transaction.status === TRANSACTION_STATUS.DISPUTED || !!disputeForTransaction) ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (disputeForTransaction?.id) {
                        navigate({
                          to: ROUTES.DISPUTE_DETAILS,
                          params: { id: disputeForTransaction.id },
                        });
                      } else {
                        toggleDisputeTransaction();
                      }
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold transition-all active:scale-95 cursor-pointer hover:opacity-90 shadow-sm shrink-0"
                    style={{
                      background: "#03034D",
                      color: "#FFFFFF",
                    }}
                  >
                    <span>View Dispute</span>
                    <ChevronRight size={12} strokeWidth={2.5} />
                  </button>
                ) : statusConfig.message ? (
                  <p className="text-xs leading-normal sm:text-right" style={{ color: "#6B6E6B" }}>
                    {statusConfig.message}
                  </p>
                ) : null}
              </div>

                {/* ── Payout Failure Alert & Action ── */}
                {transaction.status === TRANSACTION_STATUS.PAYOUT_FAILED && (
                  <div
                    className="mt-4 rounded-2xl p-4 space-y-3"
                    style={{
                      background: "#FEECEC",
                      border: "1px solid #F5C0C0",
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background: "#EB5757" }}
                      >
                        <AlertTriangle size={16} className="text-white" />
                      </div>
                      <div>
                        <p
                          className="text-sm font-bold"
                          style={{ color: "#0E0F0C" }}
                        >
                          {transaction.payoutFailureReason?.includes(
                            "bank account"
                          )
                            ? "Action Required: Add Bank Account"
                            : "Payout Failed"}
                        </p>
                        <p
                          className="text-xs mt-0.5 leading-relaxed"
                          style={{ color: "#6B6E6B" }}
                        >
                          {transaction.payoutFailureReason ||
                            "We couldn't process your payout. Please contact support."}
                        </p>
                      </div>
                    </div>

                    {transaction.payoutFailureReason?.includes(
                      "bank account"
                    ) && (
                      <button
                        onClick={() => navigate({ to: ROUTES.PROFILE })}
                        className="w-full py-2.5 rounded-xl text-xs font-bold transition-all"
                        style={{ background: "#EB5757", color: "#FFFFFF" }}
                      >
                        Go to Profile to add Bank Account
                      </button>
                    )}
                  </div>
                )}
            </div>

            {/* ── Overview grid ── */}
            <Card>
              <CardTitle>Overview</CardTitle>
              <div className="grid grid-cols-2 gap-4">
                <InfoRow
                  label="Crypto Amount"
                  value={`${formatForDisplay(Number(transaction.amountCrypto), transaction.cryptocurrency?.symbol ?? "")} ${
                    transaction.cryptocurrency?.symbol
                  }`}
                />
                <InfoRow label="Fiat Amount" value={formatFiatAmount()} align="right" />
                <InfoRow
                  label="Rate"
                  value={getExchangeRateDisplay()}
                />
                <InfoRow label="Type" value={isBuy ? "Buy" : "Sell"} align="right" />
                {/* BUY transactions don't have a userCryptoWallet (that's SELL-only,
                    rendered below in the "Your Crypto Wallet" card): the destination
                    network the user typed in at checkout is stored directly on the
                    transaction as walletNetwork (free-form, no FK), and nothing
                    rendered it, so BUY transactions displayed no network at all. */}
                {isBuy && !transaction.userCryptoWallet && transaction.walletNetwork && (
                  <InfoRow
                    label="Network"
                    value={transaction.walletNetwork}
                  />
                )}
              </div>
            </Card>

            {/* ── Receipts ── */}
            {transaction.type === TRANSACTION_TYPE.BUY && (
              <TransactionReceiptsSection
                receiptImageUrl={transaction.receiptImageUrl}
                adminPaymentReceiptUrl={
                  (transaction as any).adminPaymentReceiptUrl
                }
              />
            )}

            {/* ── Transaction Context Flow ── */}
            {transaction && <TransactionContextCard transaction={transaction} />}

            {/* ── Crypto wallet ── */}
            {transaction.userCryptoWallet && (
              <Card>
                <CardTitle>Your Crypto Wallet</CardTitle>
                <div className="space-y-4">
                  <CopyRow
                    label="Wallet Address"
                    value={transaction.userCryptoWallet.walletAddress}
                    field="wallet"
                    mono
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <InfoRow
                      label="Network"
                      value={transaction.userCryptoWallet.network}
                    />
                    <InfoRow
                      label="Coin"
                      value={transaction.cryptocurrency?.symbol ?? "-"}
                    />
                  </div>
                </div>
              </Card>
            )}

            {/* ── Bank account ── */}
            {transaction.userBankAccount && (
              <Card>
                <CardTitle>Payout Bank Account</CardTitle>
                <div className="space-y-4">
                  <InfoRow
                    label="Account Name"
                    value={transaction.userBankAccount.accountName}
                  />
                  <CopyRow
                    label="Account Number"
                    value={transaction.userBankAccount.accountNumber}
                    field="account"
                    mono
                  />
                  <InfoRow
                    label="Bank"
                    value={transaction.userBankAccount.bank?.name}
                  />
                </div>
              </Card>
            )}

            {/* ── Crypto tx hash ── */}
            {transaction.cryptoTxHash && (
              <Card>
                <CardTitle>Blockchain</CardTitle>
                <CopyRow
                  label="Transaction Hash"
                  value={transaction.cryptoTxHash}
                  field="txhash"
                  mono
                />
              </Card>
            )}

            {/* ── Admin note ── */}
            {transaction.adminNotes && (
              <div
                className="rounded-3xl px-5 py-4"
                style={{ background: "#FFFBF0", border: "1px solid #FFE4A0" }}
              >
                <p
                  className="text-[10px] font-bold tracking-widest uppercase mb-2"
                  style={{ color: "#A07000" }}
                >
                  Note from Support
                </p>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "#7A6000" }}
                >
                  {transaction.adminNotes}
                </p>
              </div>
            )}

            {/* ── Timeline + refs ── */}
            <Card>
              <CardTitle>Timeline</CardTitle>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p
                    className="text-xs font-semibold"
                    style={{ color: "#6B6E6B" }}
                  >
                    Created
                  </p>
                  <p className="text-xs font-bold" style={{ color: "#0E0F0C" }}>
                    {momentClient.formatToTransactionInitiationDate(
                      transaction.createdAt
                    )}
                  </p>
                </div>
                <div style={{ height: "1px", background: "#F0F0F0" }} />
                <div className="flex items-center justify-between">
                  <p
                    className="text-xs font-semibold"
                    style={{ color: "#6B6E6B" }}
                  >
                    Last Updated
                  </p>
                  <p className="text-xs font-bold" style={{ color: "#0E0F0C" }}>
                    {momentClient.formatToTransactionInitiationDate(
                      transaction.updatedAt
                    )}
                  </p>
                </div>
                {transaction.processedAt && (
                  <>
                    <div style={{ height: "1px", background: "#F0F0F0" }} />
                    <div className="flex items-center justify-between">
                      <p
                        className="text-xs font-semibold"
                        style={{ color: "#6B6E6B" }}
                      >
                        Processed
                      </p>
                      <p
                        className="text-xs font-bold"
                        style={{ color: "#0E0F0C" }}
                      >
                        {momentClient.formatToTransactionInitiationDate(
                          new Date(transaction.processedAt)
                        )}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </Card>

            {/* ── Reference ── */}
            <Card>
              <CardTitle>Reference</CardTitle>
              <div className="space-y-3">
                <CopyRow
                  label="Session ID"
                  value={transaction.sessionId}
                  field="session"
                  mono
                />
              </div>
            </Card>

            {/* ── Support ── */}
            <div
              className="rounded-3xl px-5 py-4 flex items-center gap-4"
              style={{
                background: "#F0EFFD",
                border: "1px solid #C7C4F5",
              }}
            >
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
                style={{ background: "#948EEE" }}
              >
                <Headphones size={18} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold" style={{ color: "#0E0F0C" }}>
                  Need help?
                </p>
                <p className="text-xs mt-0.5" style={{ color: "#6B6E6B" }}>
                  Our support team is here for you
                </p>
              </div>
              <button
                onClick={() => window.open(ROUTES.CONTACT, "_blank")}
                className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-bold"
                style={{
                  background: "#948EEE",
                  color: "#FFFFFF",
                }}
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
