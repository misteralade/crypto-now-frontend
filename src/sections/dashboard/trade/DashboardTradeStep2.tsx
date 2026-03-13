/**
 * Step 2 — Make Payment (Buy) or Monitor Wallet (Sell)
 *
 * Buy: Shows bank details + "I've Paid — Upload Receipt" button → upload view
 * Sell: Shows platform wallet address + monitoring steps
 */
import { useState, useEffect } from "react";
import { Copy, Check, Upload, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { SupportedCryptoOrCurrencyResponse } from "../../../types/response.payload.types.ts";
import type { TradeAdditionalInfoInterface, TradeType } from "../../../types/trade.types.ts";
import { useTradeStepTwo } from "../../../hooks/components/trade/useTradeStepTwo.ts";
import TradePaymentUpload from "../../trade-crypto/TradePaymentUpload.tsx";
import { SESSION_STORAGE_KEYS } from "../../../util/constants.util.ts";

interface DashboardTradeStep2Props {
  tradeType: TradeType;
  amountToBuy: number;
  numberOfToken: number;
  selectedToken?: SupportedCryptoOrCurrencyResponse;
  selectedCurrency?: SupportedCryptoOrCurrencyResponse;
  exchangeRateId: string;
  transactionRef: string | undefined;
  additionalInfo: TradeAdditionalInfoInterface[];
  handleReceiptUrl: (url: string) => void;
  handleTransactionHash: (hash: string) => void;
  handleSubmitPaymentProof: () => void;
  formatReceiveAmount: (amount: number | string, code: string | undefined) => React.ReactNode | string;
  formatSendAmount: (amount: number | string, code: string | undefined) => React.ReactNode | string;
  onBack: () => void;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <button type="button" onClick={handleCopy}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
      style={{
        background: copied ? "#E8F8F0" : "#FFFFFF33",
        color: copied ? "#037847" : "#FFFFFF",
        border: `1px solid ${copied ? "#037847" : "#FFFFFF44"}`,
      }}>
      {copied ? <Check size={12} /> : <Copy size={12} />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

function DetailRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between py-2"
      style={{ borderBottom: "1px solid #F7F7F9" }}>
      <span className="text-xs" style={{ color: "#9A9A9A" }}>{label}</span>
      <span className={`text-sm font-semibold ${mono ? "font-mono" : ""}`}
        style={{ color: "#0E0F0C" }}>{value}</span>
    </div>
  );
}

export default function DashboardTradeStep2({
  tradeType, amountToBuy, numberOfToken, selectedToken, selectedCurrency,
  exchangeRateId, transactionRef, additionalInfo,
  handleReceiptUrl, handleTransactionHash, handleSubmitPaymentProof,
  formatSendAmount, onBack,
}: DashboardTradeStep2Props) {
  const isBuy = tradeType === "buy";

  const {
    transactionHash, setTransactionHash, setUploadedFileUrl,
    paymentDetailsLoading, submitInvalid, accountDetails, walletDetails,
  } = useTradeStepTwo({ tradeType, exchangeRateId, amountToBuy, numberOfToken, selectedToken, selectedCurrency });

  const [showUpload, setShowUpload] = useState(false);
  const [storedYouPay, setStoredYouPay] = useState<string | null>(null);

  useEffect(() => {
    const v = sessionStorage.getItem(SESSION_STORAGE_KEYS.YOU_PAY_VALUE);
    if (v && v !== "[object Object]" && v.trim()) setStoredYouPay(v);
  }, []);

  const payAmount = storedYouPay
    ? storedYouPay
    : formatSendAmount(amountToBuy.toLocaleString(), selectedCurrency?.code);

  // Extract bank details from accountDetails array
  const bankName = accountDetails.find(a => a.title === "Bank")?.value as string ?? "";
  const accountNumber = accountDetails.find(a => a.title === "Account Number")?.value as string ?? "";
  const accountName = accountDetails.find(a => a.title === "Account Name")?.value as string ?? "";
  const exactAmount = accountDetails.find(a => a.title === "Amount")?.value as string ?? String(payAmount);

  // Extract wallet details
  const walletAddress = walletDetails?.walletAddress ?? (accountDetails.find(a => a.title.toLowerCase().includes("wallet"))?.value as string ?? "");
  const network = walletDetails?.network ?? (accountDetails.find(a => a.title === "Network")?.value as string ?? "");

  if (paymentDetailsLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <div className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: "#948EEE", borderTopColor: "transparent" }} />
        <p className="text-sm" style={{ color: "#9A9A9A" }}>Loading payment details…</p>
      </div>
    );
  }

  /* ── BUY: Upload receipt view ── */
  if (isBuy && showUpload) {
    return (
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => setShowUpload(false)}
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ border: "1px solid #F0F0F0" }}>
            <ArrowLeft size={14} style={{ color: "#0E0F0C" }} />
          </button>
          <div>
            <p className="text-sm font-extrabold" style={{ color: "#0E0F0C" }}>Upload Receipt</p>
            <p className="text-[11px]" style={{ color: "#9A9A9A" }}>PNG, JPG or PDF · max 2 MB</p>
          </div>
        </div>

        <div className="rounded-2xl p-4" style={{ background: "#F7F7F9", border: "1px solid #EEEEEE" }}>
          <TradePaymentUpload
            maxFiles={1}
            acceptedTypes={[".jpg", ".jpeg", ".png", ".webp", ".gif"]}
            onFileUploaded={handleReceiptUrl}
            setUploadedFileUrl={setUploadedFileUrl}
          />
        </div>

        <button
          type="button"
          disabled={submitInvalid}
          onClick={handleSubmitPaymentProof}
          className="w-full py-4 rounded-2xl text-sm font-bold transition-all"
          style={{
            background: !submitInvalid ? "linear-gradient(135deg,#948EEE,#6B45D0)" : "#F0F0F0",
            color: !submitInvalid ? "#FFFFFF" : "#9A9A9A",
            boxShadow: !submitInvalid ? "0 6px 20px #948EEE44" : "none",
          }}>
          Submit Receipt →
        </button>
      </div>
    );
  }

  /* ── SELL: Wallet monitoring view ── */
  if (!isBuy) {
    return (
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-3">
          <button type="button" onClick={onBack}
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ border: "1px solid #F0F0F0" }}>
            <ArrowLeft size={14} style={{ color: "#0E0F0C" }} />
          </button>
          <div>
            <p className="text-sm font-extrabold" style={{ color: "#0E0F0C" }}>
              Monitoring Wallet
            </p>
            <p className="text-[11px]" style={{ color: "#9A9A9A" }}>
              Watching for your {selectedToken?.symbol}…
            </p>
          </div>
        </div>

        {/* Wallet card */}
        <div className="rounded-2xl p-5"
          style={{ background: "linear-gradient(145deg,#2D1CB0,#4A2DBF,#6B45D0,#3A1FA8)", boxShadow: "0 12px 40px #2D1CB055" }}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold tracking-widest text-white/60 uppercase">
              {network || "Your Unique Wallet"}
            </p>
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold"
              style={{ background: "#FFFFFF22", color: "#FFFFFF" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Active
            </span>
          </div>
          <p className="text-white font-mono text-xs break-all leading-relaxed mb-4">
            {walletAddress || "Generating wallet…"}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/60">
              ₦{Number(selectedToken?.sellRate || 0).toLocaleString()} per 1 {selectedToken?.symbol}
            </span>
            {walletAddress && <CopyButton text={walletAddress} />}
          </div>
        </div>

        {/* Instruction */}
        <div className="rounded-2xl p-4" style={{ background: "#E8F8F0", border: "1px solid #037847" + "33" }}>
          <p className="text-xs font-bold mb-1" style={{ color: "#037847" }}>Send &amp; forget</p>
          <p className="text-xs" style={{ color: "#6B6E6B" }}>
            The moment your crypto arrives, we auto-detect and instantly send NGN to your bank. No further action needed.
          </p>
        </div>

        {/* Steps */}
        <div className="flex flex-col gap-2">
          {[
            { n: 1, label: "Blockchain Monitoring Active", done: true },
            { n: 2, label: `Waiting for ${selectedToken?.symbol} Detection`, done: false },
            { n: 3, label: "Auto-Converting to NGN", done: false },
            { n: 4, label: "Bank Transfer", done: false },
          ].map(({ n, label, done }) => (
            <div key={n} className="flex items-center gap-3 rounded-xl px-4 py-3"
              style={{ background: done ? "#E8F8F0" : "#FAFAFA", border: `1px solid ${done ? "#03784733" : "#EEEEEE"}` }}>
              <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                style={{ background: done ? "#037847" : "#EEEEEE" }}>
                {done
                  ? <Check size={12} color="white" />
                  : <span className="text-[11px] font-bold" style={{ color: "#9A9A9A" }}>{n}</span>
                }
              </div>
              <span className="text-xs font-semibold" style={{ color: done ? "#037847" : "#6B6E6B" }}>{label}</span>
            </div>
          ))}
        </div>

        {/* Transaction hash input */}
        <div>
          <p className="text-xs font-bold mb-2" style={{ color: "#0E0F0C" }}>Transaction Hash (optional)</p>
          <input
            type="text"
            value={transactionHash}
            onChange={(e) => { setTransactionHash(e.target.value); handleTransactionHash(e.target.value); }}
            placeholder="0x123abc… (paste tx hash)"
            className="w-full px-4 py-3 rounded-2xl text-sm outline-none"
            style={{ background: "#F7F7F9", border: "1px solid #EEEEEE", color: "#0E0F0C" }}
          />
        </div>

        {/* Upload proof */}
        <div>
          <p className="text-xs font-bold mb-2" style={{ color: "#0E0F0C" }}>Upload Transaction Screenshot</p>
          <div className="rounded-2xl overflow-hidden" style={{ border: "2px dashed #EEEEEE" }}>
            <TradePaymentUpload
              maxFiles={1}
              acceptedTypes={[".jpg", ".jpeg", ".png", ".webp", ".gif"]}
              onFileUploaded={handleReceiptUrl}
              setUploadedFileUrl={setUploadedFileUrl}
            />
          </div>
        </div>

        <button
          type="button"
          disabled={submitInvalid}
          onClick={handleSubmitPaymentProof}
          className="w-full py-4 rounded-2xl text-sm font-bold transition-all"
          style={{
            background: !submitInvalid ? "linear-gradient(135deg,#037847,#04A860)" : "#F0F0F0",
            color: !submitInvalid ? "#FFFFFF" : "#9A9A9A",
            boxShadow: !submitInvalid ? "0 6px 20px #03784744" : "none",
          }}>
          Submit Transaction Proof →
        </button>
      </div>
    );
  }

  /* ── BUY: Bank details view ── */
  return (
    <AnimatePresence mode="wait">
      <motion.div key="bank-details" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-5">
        <div className="flex items-center gap-3">
          <button type="button" onClick={onBack}
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ border: "1px solid #F0F0F0" }}>
            <ArrowLeft size={14} style={{ color: "#0E0F0C" }} />
          </button>
          <div>
            <p className="text-sm font-extrabold" style={{ color: "#0E0F0C" }}>Make Payment</p>
            <p className="text-[11px]" style={{ color: "#9A9A9A" }}>Transfer exact amount to bank</p>
          </div>
        </div>

        {/* Amount hero */}
        <div className="rounded-2xl p-5 text-center"
          style={{ background: "linear-gradient(145deg,#2D1CB0,#4A2DBF,#6B45D0,#3A1FA8)", boxShadow: "0 12px 40px #2D1CB055" }}>
          <p className="text-xs font-bold tracking-widest text-white/60 uppercase mb-1">Transfer This Exact Amount</p>
          <p className="text-3xl font-black text-white">{typeof payAmount === "string" ? payAmount : <span>{payAmount}</span>}</p>
          <p className="text-xs text-white/60 mt-1">
            You'll receive {numberOfToken} {selectedToken?.symbol}
          </p>
        </div>

        {/* Bank details card */}
        <div className="rounded-2xl p-4" style={{ border: "1px solid #EEEEEE" }}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold tracking-widest uppercase" style={{ color: "#9A9A9A" }}>
              Pay Into This Account
            </p>
            <button type="button"
              onClick={() => navigator.clipboard.writeText(`${bankName} ${accountNumber} ${accountName}`)}
              className="flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full"
              style={{ background: "#948EEE22", color: "#948EEE" }}>
              <Copy size={11} /> Copy Acct
            </button>
          </div>
          <p className="text-base font-extrabold mb-0.5" style={{ color: "#0E0F0C" }}>{bankName || "Loading…"}</p>
          <p className="text-xl font-black font-mono" style={{ color: "#0E0F0C" }}>{accountNumber}</p>
          <p className="text-xs mt-0.5" style={{ color: "#9A9A9A" }}>{accountName}</p>
          <div className="flex items-center justify-between mt-3 pt-3"
            style={{ borderTop: "1px solid #F0F0F0" }}>
            <span className="text-xs" style={{ color: "#9A9A9A" }}>Exact Amount</span>
            <span className="text-sm font-black" style={{ color: "#948EEE" }}>
              {typeof payAmount === "string" ? payAmount : <span>{payAmount}</span>}
            </span>
          </div>
        </div>

        {/* Session ref */}
        {transactionRef && (
          <div className="flex items-center justify-between rounded-2xl px-4 py-3"
            style={{ background: "#F7F7F9", border: "1px solid #EEEEEE" }}>
            <span className="text-xs" style={{ color: "#9A9A9A" }}>Session ID</span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono" style={{ color: "#0E0F0C" }}>
                {transactionRef.slice(0, 8)}…
              </span>
              <button type="button" onClick={() => navigator.clipboard.writeText(transactionRef)}
                className="text-xs" style={{ color: "#948EEE" }}>
                <Copy size={12} />
              </button>
            </div>
          </div>
        )}

        {/* Order details */}
        {additionalInfo.length > 0 && (
          <div className="rounded-2xl p-4" style={{ border: "1px solid #EEEEEE" }}>
            <p className="text-[10px] font-bold tracking-widest uppercase mb-3" style={{ color: "#9A9A9A" }}>
              Order Details
            </p>
            {additionalInfo.map((item, i) => (
              <DetailRow key={i} label={String(item.title)} value={String(item.value)} />
            ))}
          </div>
        )}

        {/* Warning */}
        <div className="flex items-start gap-3 rounded-2xl px-4 py-3"
          style={{ background: "#FFFBF0", border: "1px solid #FFE4A0" }}>
          <span className="text-lg leading-none mt-0.5">⚠️</span>
          <p className="text-xs" style={{ color: "#A07000" }}>
            Transfer the exact amount shown. Use any bank app or USSD. Then upload your receipt on the next screen.
          </p>
        </div>

        {/* CTA */}
        <button type="button" onClick={() => setShowUpload(true)}
          className="w-full py-4 rounded-2xl text-sm font-bold transition-all flex items-center justify-center gap-2"
          style={{
            background: "linear-gradient(135deg,#948EEE,#6B45D0)",
            color: "#FFFFFF",
            boxShadow: "0 6px 20px #948EEE44",
          }}>
          <Upload size={16} />
          I've Paid — Upload Receipt →
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
