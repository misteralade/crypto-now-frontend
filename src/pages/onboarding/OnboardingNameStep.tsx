import { useState } from "react";
import { useDispatch } from "react-redux";
import { setProfilePersonalInfoField } from "../../redux/user.slice.ts";
import { useUserQuery } from "../../queries/user.query.ts";
import BankAccountFormInput from "../../components/pages/bank/BankAccountFormInput.tsx";

interface OnboardingNameStepProps {
  onComplete: () => void;
}

const OnboardingNameStep = ({ onComplete }: OnboardingNameStepProps) => {
  const dispatch = useDispatch();
  const { updateProfileMutation } = useUserQuery();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const isValid = firstName.trim().length > 0 && lastName.trim().length > 0;

  const handleSubmit = async () => {
    if (!isValid) return;

    dispatch(setProfilePersonalInfoField({ field: "firstName", value: firstName.trim() }));
    dispatch(setProfilePersonalInfoField({ field: "lastName", value: lastName.trim() }));

    const { success } = await updateProfileMutation.mutateAsync();
    if (success) {
      onComplete();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#0E0F0C]">What's your name?</h2>
        <p className="text-sm text-[#6B6E6B] mt-1">
          This is how we'll address you across CryptoNow.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <BankAccountFormInput
          label="Surname"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <BankAccountFormInput
          label="First or middle name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
      </div>

      <button
        type="button"
        disabled={!isValid || updateProfileMutation.isPending}
        onClick={handleSubmit}
        className="w-full h-12 rounded-2xl font-semibold text-sm bg-[#03034D] transition-all text-white disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-[#02022d] shadow-sm"
      >
        {updateProfileMutation.isPending ? "Saving..." : "Continue"}
      </button>
    </div>
  );
};

export default OnboardingNameStep;
