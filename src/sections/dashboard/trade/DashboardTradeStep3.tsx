/**
 * Step 3 — Confirm receiving account (bank for sell, wallet for buy)
 * Wraps the existing ConfirmBankDetailsModal logic inline (no modal — full-page view)
 */
import { useState } from "react";
import { useDispatch } from "react-redux";
import type { TradeType } from "../../../types/trade.types.ts";
import type { SupportedCryptoOrCurrencyResponse, UserBankAccountResponse, UserCryptoWalletResponse } from "../../../types/response.payload.types.ts";
import { useConfirmBankDetailsModal } from "../../../hooks/components/trade/modal/useConfirmBankDetailsModal.ts";
import ChangeBankDetails from "../../trade-crypto/ChangeBankDetails.tsx";
import { Check, ArrowLeft, ArrowRight, Wallet } from "lucide-react";
import { setSelectedCryptoId } from "../../../redux/crypto.slice.ts";

interface DashboardTradeStep3Props {
  tradeType: TradeType;
  bankAccounts: UserBankAccountResponse[] | undefined;
  cryptoAccounts: UserCryptoWalletResponse[] | undefined | null;
  selectedTokenNetworks?: string[];
  /** Full selected token (buy flow) */
  selectedToken?: SupportedCryptoOrCurrencyResponse;
  /** Selected currency (buy flow) */
  selectedCurrency?: SupportedCryptoOrCurrencyResponse;
  /** NGN amount the user is paying */
  amountToBuy?: string | number;
  /** Crypto amount they'll receive */
  numberOfToken?: string | number;
  /** Wallet address entered in Step 1b (buy flow) */
  buyWalletAddress?: string;
  /** Network selected in Step 1b (buy flow) */
  buyNetwork?: string;
  onProceed: (value: number) => void;
  onBack: () => void;
}

export default function DashboardTradeStep3({
  tradeType, bankAccounts, cryptoAccounts, selectedTokenNetworks: _selectedTokenNetworks,
  selectedToken, selectedCurrency, amountToBuy, numberOfToken,
  buyWalletAddress, buyNetwork, onProceed, onBack,
}: DashboardTradeStep3Props) {
  const dispatch = useDispatch();
  const {
    selectedBankId, selectedBank, viewState,
    handleBankSelection, setViewState,
    handleSubmitBankDetails, handleSubmitWalletDetails,
    handleViewSelectedBankDetails,
  } = useConfirmBankDetailsModal(cryptoAccounts ?? [], bankAccounts ?? [], tradeType, onProceed, () => {});

  const [isSubmitting, setIsSubmitting] = useState(false);

  const isBuy = tradeType === "buy";
  const accentColor = isBuy ? "#948EEE" : "#037847";

  /* ── BUY: full order summary + wallet confirmation ── */
  if (isBuy) {
    const shortAddr = buyWalletAddress && buyWalletAddress.length > 20
      ? `${buyWalletAddress.slice(0, 14)}…${buyWalletAddress.slice(-10)}`
      : (buyWalletAddress ?? "—");

    const currencyCode = selectedCurrency?.code ?? "NGN";
    const amountNum = Number(amountToBuy) || 0;
    const tokenNum = Number(numberOfToken) || 0;

    const handleConfirmBuyWallet = async () => {
      if (!buyWalletAddress || !buyNetwork || !selectedToken?.id) return;
      setIsSubmitting(true);
      try {
        // Ensure Redux has the selected crypto ID so createUserCryptoWalletMutation works
        dispatch(setSelectedCryptoId(selectedToken.id));
        await handleSubmitWalletDetails({
          walletAddress: buyWalletAddress,
          network: buyNetwork,
          isVerified: true,
          isPrimary: false,
        });
      } finally {
        setIsSubmitting(false);
      }
    };

    const summaryRows = [
      { label: "Crypto", val: selectedToken?.name ? `${selectedToken.name} (${selectedToken.symbol})` : (selectedToken?.symbol ?? "—") },
      { label: "You Pay", val: amountNum > 0 ? `${amountNum.toLocaleString()} ${currencyCode}` : "—" },
      { label: "You Receive", val: tokenNum > 0 ? `${tokenNum} ${selectedToken?.symbol ?? ""}` : "—" },
      { label: "Network", val: buyNetwork ?? "—" },
      { label: "Wallet Address", val: shortAddr, mono: true, full: buyWalletAddress },
    ];

    return (
      <div className="flex flex-col gap-5">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button type="button" onClick={onBack}
            className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
            style={{ border: "1px solid #F0F0F0" }}>
            <ArrowLeft size={14} style={{ color: "#0E0F0C" }} />
          </button>
          <div>
            <p className="text-sm font-extrabold" style={{ color: "#0E0F0C" }}>Order Summary</p>
            <p className="text-[11px]" style={{ color: "#9A9A9A" }}>Review everything before confirming</p>
          </div>
        </div>

        {/* Crypto hero chip */}
        {selectedToken && (
          <div className="flex items-center gap-3 rounded-2xl px-4 py-3"
            style={{ background: "#F0EFFD", border: "1px solid #C7CAFF" }}>
            {selectedToken.logoUrl
              ? <img src={selectedToken.logoUrl} alt={selectedToken.symbol} className="w-9 h-9 rounded-full object-cover shrink-0" />
              : <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-black shrink-0"
                  style={{ background: "#948EEE" }}>{selectedToken.symbol.slice(0, 2)}</div>
            }
            <div>
              <p className="text-xs font-semibold" style={{ color: "#6B6E6B" }}>You're buying</p>
              <p className="text-sm font-extrabold" style={{ color: "#0E0F0C" }}>{selectedToken.name} ({selectedToken.symbol})</p>
            </div>
            {tokenNum > 0 && (
              <p className="ml-auto text-base font-black shrink-0" style={{ color: "#948EEE" }}>
                {tokenNum} {selectedToken.symbol}
              </p>
            )}
          </div>
        )}

        {/* Full order details card */}
        <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid #EEEEEE" }}>
          <div className="px-4 py-2.5" style={{ background: "#F7F7F9", borderBottom: "1px solid #EEEEEE" }}>
            <p className="text-[10px] font-bold tracking-widest uppercase" style={{ color: "#9A9A9A" }}>Your Order</p>
          </div>
          {summaryRows.map(({ label, val, mono, full }) => (
            <div key={label} className="flex items-start justify-between px-4 py-3 gap-4"
              style={{ borderBottom: "1px solid #F7F7F9" }}>
              <span className="text-xs shrink-0" style={{ color: "#9A9A9A" }}>{label}</span>
              <span
                className={`text-xs font-semibold text-right break-all leading-relaxed ${mono ? "font-mono" : ""}`}
                style={{ color: "#0E0F0C" }}
                title={full}
              >
                {val}
              </span>
            </div>
          ))}
        </div>

        {/* Wallet section */}
        <div className="rounded-2xl p-4 flex items-center gap-3"
          style={{ background: "#FAFAFA", border: "1px solid #EEEEEE" }}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: "#F0EFFD" }}>
            <Wallet size={16} style={{ color: "#948EEE" }} />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold" style={{ color: "#9A9A9A" }}>Destination Wallet · {buyNetwork ?? ""}</p>
            <p className="text-xs font-mono truncate mt-0.5" style={{ color: "#0E0F0C" }}>
              {buyWalletAddress ?? "—"}
            </p>
          </div>
        </div>

        {/* Confirm button */}
        <button type="button" onClick={handleConfirmBuyWallet}
          disabled={isSubmitting || !buyWalletAddress || !buyNetwork || !selectedToken?.id}
          className="w-full py-4 rounded-2xl text-sm font-bold disabled:opacity-60 transition-all"
          style={{
            background: `linear-gradient(135deg,${accentColor},#6B45D0)`,
            color: "#FFFFFF",
            boxShadow: `0 6px 20px ${accentColor}44`,
          }}>
          <span className="inline-flex items-center justify-center gap-2">
            <span>{isSubmitting ? "Confirming…" : "Confirm & Proceed"}</span>
            {!isSubmitting && <ArrowRight size={16} />}
          </span>
        </button>
      </div>
    );
  }

  /* ── SELL: select bank ── */
  if (viewState === "create-bank") {
    return (
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => setViewState("select-bank")}
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ border: "1px solid #F0F0F0" }}>
            <ArrowLeft size={14} style={{ color: "#0E0F0C" }} />
          </button>
          <p className="text-sm font-extrabold" style={{ color: "#0E0F0C" }}>Add Bank Account</p>
        </div>
        <ChangeBankDetails
          onConfirm={handleSubmitBankDetails}
          onGoBack={() => setViewState("select-bank")}
          canGoBack={!!bankAccounts?.length}
        />
      </div>
    );
  }

  if (viewState === "bank-details" && selectedBank) {
    return (
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => setViewState("select-bank")}
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ border: "1px solid #F0F0F0" }}>
            <ArrowLeft size={14} style={{ color: "#0E0F0C" }} />
          </button>
          <p className="text-sm font-extrabold" style={{ color: "#0E0F0C" }}>Confirm Bank Account</p>
        </div>

        <div className="rounded-2xl p-5" style={{ border: "1px solid #EEEEEE" }}>
          <div className="flex items-center gap-3 mb-4">
            <img src={selectedBank.bankLogo} alt={selectedBank.bankName}
              className="w-10 h-10 rounded-full object-cover"
              onError={(e) => { e.currentTarget.style.display = "none"; }} />
            <p className="font-bold" style={{ color: "#0E0F0C" }}>{selectedBank.bankName}</p>
          </div>
          <div className="space-y-2">
            {[
              { label: "Account Name", val: selectedBank.accountName },
              { label: "Account Number", val: selectedBank.accountNumber },
            ].map(({ label, val }) => (
              <div key={label} className="flex justify-between py-2"
                style={{ borderBottom: "1px solid #F7F7F9" }}>
                <span className="text-xs" style={{ color: "#9A9A9A" }}>{label}</span>
                <span className="text-sm font-semibold font-mono" style={{ color: "#0E0F0C" }}>{val}</span>
              </div>
            ))}
          </div>
        </div>

        <button type="button" onClick={() => onProceed(0)}
          className="w-full py-4 rounded-2xl text-sm font-bold"
          style={{ background: `linear-gradient(135deg,${accentColor},#04A860)`, color: "#FFFFFF", boxShadow: `0 6px 20px ${accentColor}44` }}>
          <span className="inline-flex items-center gap-2">
            <span>Proceed with This Bank</span>
            <ArrowRight size={16} />
          </span>
        </button>
      </div>
    );
  }

  /* Default: bank list */
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <button type="button" onClick={onBack}
          className="w-8 h-8 rounded-full flex items-center justify-center"
          style={{ border: "1px solid #F0F0F0" }}>
          <ArrowLeft size={14} style={{ color: "#0E0F0C" }} />
        </button>
        <div>
          <p className="text-sm font-extrabold" style={{ color: "#0E0F0C" }}>Select Bank Account</p>
          <p className="text-[11px]" style={{ color: "#9A9A9A" }}>Where should we send your NGN?</p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {(bankAccounts ?? []).map((bank) => {
          const selected = selectedBankId === bank.id;
          return (
            <button key={bank.id} type="button" onClick={() => handleBankSelection(bank.id)}
              className="flex items-center gap-3 rounded-2xl p-4 text-left transition-all"
              style={{
                background: selected ? "#E8F8F0" : "#FAFAFA",
                border: `2px solid ${selected ? accentColor : "#F0F0F0"}`,
              }}>
              <img src={bank.bankLogo} alt={bank.bankName}
                className="w-10 h-10 rounded-full object-cover shrink-0"
                onError={(e) => { e.currentTarget.style.display = "none"; }} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold" style={{ color: "#0E0F0C" }}>{bank.bankName}</p>
                <p className="text-xs" style={{ color: "#9A9A9A" }}>{bank.accountName}</p>
                <p className="text-xs font-mono" style={{ color: "#6B6E6B" }}>{bank.accountNumber}</p>
              </div>
              {selected && (
                <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: accentColor }}>
                  <Check size={13} color="white" />
                </div>
              )}
            </button>
          );
        })}

        <button type="button" onClick={() => setViewState("create-bank")}
          className="flex items-center justify-center gap-2 rounded-2xl p-4 text-sm font-bold"
          style={{ border: "2px dashed #EEEEEE", color: "#948EEE" }}>
          + Add New Bank Account
        </button>
      </div>

      {selectedBankId && (
        <button type="button" onClick={handleViewSelectedBankDetails}
          className="w-full py-4 rounded-2xl text-sm font-bold"
          style={{ background: `linear-gradient(135deg,${accentColor},#04A860)`, color: "#FFFFFF", boxShadow: `0 6px 20px ${accentColor}44` }}>
          <span className="inline-flex items-center gap-2">
            <span>View Details &amp; Proceed</span>
            <ArrowRight size={16} />
          </span>
        </button>
      )}
    </div>
  );
}
