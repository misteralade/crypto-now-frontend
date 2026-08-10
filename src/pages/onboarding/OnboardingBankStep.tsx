import { useState } from "react";
import { useDispatch } from "react-redux";
import { useBankQuery } from "../../queries/bank.query.ts";
import { useUserQuery } from "../../queries/user.query.ts";
import { clearNewBankAccount, setNewBankAccountField } from "../../redux/bank.slice.ts";
import { setProfilePersonalInfoField } from "../../redux/user.slice.ts";
import type { CreateBankAccountRequestPayload } from "../../types/request.payload.types.ts";
import type { RootState } from "../../store.ts";
import { store } from "../../store.ts";
import BankAccountForm from "../../components/pages/bank/BankAccountForm.tsx";

interface OnboardingBankStepProps {
  onComplete: () => void;
}

// Nigerian bank account names come back from the provider as
// "SURNAME FIRSTNAME MIDDLENAME" — first token is the surname, second is
// the first name. Any further middle names are dropped; we only keep the
// two-word display name shown elsewhere in the app (greeting, initials).
function splitAccountName(accountName: string): { firstName: string; lastName: string } {
  const [lastName = "", firstName = ""] = accountName.trim().split(/\s+/).filter(Boolean);
  return { lastName, firstName };
}

const OnboardingBankStep = ({ onComplete }: OnboardingBankStepProps) => {
  const dispatch = useDispatch();
  const { allBanks, loadingAllBanks, createUserBankAccountMutation } = useBankQuery();
  const { updateProfileMutation } = useUserQuery();
  const [, setSelectedBank] = useState("");

  const handleChangeField = (field: keyof CreateBankAccountRequestPayload, value: any) => {
    if (field === "bankId") {
      setSelectedBank(value);
    }
    dispatch(setNewBankAccountField({ field, value }));
  };

  const handleSubmit = async () => {
    const verifiedAccountName =
      (store.getState() as RootState).bank.createBankAccount.accountName ?? "";

    const { success } = await createUserBankAccountMutation.mutateAsync();
    if (success) {
      const { firstName, lastName } = splitAccountName(verifiedAccountName);
      if (firstName || lastName) {
        dispatch(setProfilePersonalInfoField({ field: "firstName", value: firstName }));
        dispatch(setProfilePersonalInfoField({ field: "lastName", value: lastName }));
        await updateProfileMutation.mutateAsync();
      }

      setSelectedBank("");
      dispatch(clearNewBankAccount());
      onComplete();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#0E0F0C]">Add a bank account</h2>
        <p className="text-sm text-[#6B6E6B] mt-1">
          We need at least one verified bank account before you can start trading. You can add more later from Profile.
        </p>
      </div>

      <BankAccountForm
        banks={!loadingAllBanks && allBanks ? allBanks : []}
        onSubmit={handleSubmit}
        handleChangeField={handleChangeField}
        submitLabel="Finish"
        showCancelButton={false}
      />
    </div>
  );
};

export default OnboardingBankStep;
