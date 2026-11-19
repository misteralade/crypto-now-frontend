import { useEffect, useRef, useState } from "react";
import { Pencil, X } from "lucide-react";
import BankSelector from "../../../global/BankSelector.tsx";
import { bankServiceApi } from "../../../../api/bank.api.ts";
import type { UpdateBankAccountRequestPayload } from "../../../../types/request.payload.types.ts";
import type { AllBanksResponse, UserBankAccountResponse } from "../../../../types/response.payload.types.ts";

interface EditBankAccountModalProps {
  account: UserBankAccountResponse | null;
  banks: AllBanksResponse[];
  onClose: () => void;
  onSubmit: (id: string, payload: UpdateBankAccountRequestPayload) => Promise<boolean>;
}

const EditBankAccountModal = ({ account, banks, onClose, onSubmit }: EditBankAccountModalProps) => {
  const [bankId, setBankId] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [lookupError, setLookupError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const lookupVersion = useRef(0);

  const verifyAccount = async (number: string, selectedBankId: string) => {
    const version = ++lookupVersion.current;
    setAccountName("");
    setLookupError("");
    setIsLookingUp(false);
    if (number.length !== 10 || !selectedBankId) return;

    setIsLookingUp(true);
    try {
      const { data, success, message } = await bankServiceApi.lookupAccountName(number, selectedBankId);
      if (lookupVersion.current !== version) return;
      if (success && data.accountName) setAccountName(data.accountName);
      else setLookupError(message || "We couldn't verify these bank details. Check the bank and account number.");
    } catch {
      if (lookupVersion.current === version) setLookupError("We couldn't verify these bank details. Check the bank and account number.");
    } finally {
      if (lookupVersion.current === version) setIsLookingUp(false);
    }
  };

  useEffect(() => {
    if (!account) return;
    const lookupRequestVersion = lookupVersion;
    setBankId(account.bank.id);
    setAccountNumber(account.accountNumber);
    document.body.style.overflow = "hidden";
    void verifyAccount(account.accountNumber, account.bank.id);
    return () => {
      lookupRequestVersion.current++;
      document.body.style.overflow = "unset";
    };
  }, [account]);

  if (!account) return null;

  const handleSave = async () => {
    if (!accountName || isLookingUp || accountNumber.length !== 10 || !bankId) return;
    setIsSaving(true);
    try {
      const saved = await onSubmit(account.id, { bankId, accountNumber });
      if (saved) onClose();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true" aria-labelledby="edit-bank-title">
      <button type="button" className="absolute inset-0 cursor-default" aria-label="Close edit bank account" onClick={onClose} />
      <section className="relative z-10 w-full max-w-lg rounded-3xl bg-white p-5 shadow-2xl md:p-7">
        <header className="mb-5 flex items-center justify-between">
          <div>
            <h2 id="edit-bank-title" className="text-xl font-bold text-[#0E0F0C]">Edit bank account</h2>
            <p className="mt-1 text-sm text-[#737373]">Verify the account details before saving.</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close modal" className="rounded-full p-2 text-[#6B6E6B] hover:bg-gray-100"><X size={20} /></button>
        </header>

        <div className="space-y-4">
          <BankSelector label="Bank" options={banks} value={bankId} onValueChange={(value) => {
            setBankId(value);
            void verifyAccount(accountNumber, value);
          }} />
          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-[#404040]">Account number</span>
            <input
              inputMode="numeric"
              autoComplete="off"
              value={accountNumber}
              onChange={(event) => {
                const value = event.target.value.replace(/\D/g, "").slice(0, 10);
                setAccountNumber(value);
                void verifyAccount(value, bankId);
              }}
              className="h-14 w-full rounded-2xl border border-[#EEEEEE] px-4 font-mono text-sm outline-none focus:border-[#03034D] focus:ring-2 focus:ring-[#03034D]/10"
              aria-label="Account number"
            />
          </label>

          {(isLookingUp || accountName || lookupError) && (
            <div className="rounded-2xl border border-[#EEEEEE] bg-gray-50 p-4" aria-live="polite">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#828282]">Verified account name</p>
              <p className={`mt-1 text-sm font-semibold ${lookupError ? "text-[#EB5757]" : "text-[#101828]"}`}>
                {isLookingUp ? "Checking account details…" : lookupError || accountName}
              </p>
            </div>
          )}

          <p className="text-xs leading-relaxed text-[#737373]">We’ll check the account name with your bank. Your account will keep its current default status.</p>
          <div className="flex gap-3 border-t border-gray-100 pt-4">
            <button type="button" onClick={onClose} className="h-11 flex-1 rounded-xl border border-gray-200 text-sm font-semibold text-[#6B6E6B] hover:bg-gray-50">Cancel</button>
            <button type="button" onClick={handleSave} disabled={!accountName || isLookingUp || isSaving || accountNumber.length !== 10 || !bankId} className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[#03034D] text-sm font-semibold text-white hover:bg-[#02022d] disabled:cursor-not-allowed disabled:bg-gray-300">
              <Pencil size={14} /> {isSaving ? "Saving…" : "Save changes"}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EditBankAccountModal;
