/**
 * Step 3 — Confirm receiving account (bank for sell, wallet for buy)
 * Wraps the existing ConfirmBankDetailsModal logic inline (no modal — full-page view)
 */
import type { TradeType } from "../../../types/trade.types.ts";
import type { UserBankAccountResponse, UserCryptoWalletResponse } from "../../../types/response.payload.types.ts";
import { useConfirmBankDetailsModal } from "../../../hooks/components/trade/modal/useConfirmBankDetailsModal.ts";
import ChangeBankDetails from "../../trade-crypto/ChangeBankDetails.tsx";
import ChangeWalletDetails from "../../trade-crypto/ChangeWalletDetails.tsx";
import { Check, ArrowLeft } from "lucide-react";

interface DashboardTradeStep3Props {
  tradeType: TradeType;
  bankAccounts: UserBankAccountResponse[] | undefined;
  cryptoAccounts: UserCryptoWalletResponse[] | undefined | null;
  onProceed: (value: number) => void;
  onBack: () => void;
}

export default function DashboardTradeStep3({
  tradeType, bankAccounts, cryptoAccounts, onProceed, onBack,
}: DashboardTradeStep3Props) {
  const {
    selectedBankId, selectedBank, viewState,
    handleBankSelection, setViewState,
    handleSubmitBankDetails, handleSubmitWalletDetails,
    handleViewSelectedBankDetails, handleProceed,
  } = useConfirmBankDetailsModal(cryptoAccounts ?? [], bankAccounts ?? [], tradeType, onProceed, () => {});

  const isBuy = tradeType === "buy";
  const accentColor = isBuy ? "#948EEE" : "#037847";

  /* ── BUY: always show wallet creation ── */
  if (isBuy) {
    return (
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-3">
          <button type="button" onClick={onBack}
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ border: "1px solid #F0F0F0" }}>
            <ArrowLeft size={14} style={{ color: "#0E0F0C" }} />
          </button>
          <div>
            <p className="text-sm font-extrabold" style={{ color: "#0E0F0C" }}>Your Receiving Wallet</p>
            <p className="text-[11px]" style={{ color: "#9A9A9A" }}>Where should we send your crypto?</p>
          </div>
        </div>
        <ChangeWalletDetails onGoBack={onBack} onConfirm={handleSubmitWalletDetails} canGoBack={true} />
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

        <button type="button" onClick={handleProceed}
          className="w-full py-4 rounded-2xl text-sm font-bold"
          style={{ background: `linear-gradient(135deg,${accentColor},#04A860)`, color: "#FFFFFF", boxShadow: `0 6px 20px ${accentColor}44` }}>
          Proceed with This Bank →
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
          View Details &amp; Proceed →
        </button>
      )}
    </div>
  );
}
