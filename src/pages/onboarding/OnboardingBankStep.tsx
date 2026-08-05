import { useState } from "react";
import { useDispatch } from "react-redux";
import { useBankQuery } from "../../queries/bank.query.ts";
import { clearNewBankAccount, setNewBankAccountField } from "../../redux/bank.slice.ts";
import type { CreateBankAccountRequestPayload } from "../../types/request.payload.types.ts";
import BankAccountForm from "../../components/pages/bank/BankAccountForm.tsx";

interface OnboardingBankStepProps {
  onComplete: () => void;
}

const OnboardingBankStep = ({ onComplete }: OnboardingBankStepProps) => {
  const dispatch = useDispatch();
  const { allBanks, loadingAllBanks, createUserBankAccountMutation } = useBankQuery();
  const [, setSelectedBank] = useState("");

  const handleChangeField = (field: keyof CreateBankAccountRequestPayload, value: any) => {
    if (field === "bankId") {
      setSelectedBank(value);
    }
    dispatch(setNewBankAccountField({ field, value }));
  };

  const handleSubmit = async () => {
    const { success } = await createUserBankAccountMutation.mutateAsync();
    if (success) {
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
