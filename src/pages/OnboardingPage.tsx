import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useOnboardingQuery } from "../queries/onboarding.query.ts";
import { ROUTES } from "../util/constants.util.ts";
import OnboardingNameStep from "./onboarding/OnboardingNameStep.tsx";
import OnboardingBankStep from "./onboarding/OnboardingBankStep.tsx";
import { LoadingSpinner } from "../components/global/LoadingSpinner.tsx";

type OnboardingStep = "name" | "bank";

const OnboardingPage = () => {
  const navigate = useNavigate();
  const { onboardingStatus, loadingOnboardingStatus, refetchOnboardingStatus } = useOnboardingQuery();
  const [step, setStep] = useState<OnboardingStep | null>(null);

  // Initialize the step once status resolves: skip the name step entirely
  // for users who don't need it (Google users, or anyone who already has one).
  useEffect(() => {
    if (!onboardingStatus || step !== null) return;

    if (onboardingStatus.isComplete) {
      navigate({ to: ROUTES.DASHBOARD });
      return;
    }

    setStep(onboardingStatus.needsName ? "name" : "bank");
  }, [onboardingStatus, step, navigate]);

  const handleNameComplete = () => {
    setStep("bank");
  };

  const handleBankComplete = async () => {
    await refetchOnboardingStatus();
    navigate({ to: ROUTES.DASHBOARD });
  };

  if (loadingOnboardingStatus || step === null) {
    return (
      <div className="flex items-center justify-center min-h-[100dvh]">
        <LoadingSpinner />
      </div>
    );
  }

  const totalSteps = onboardingStatus?.needsName ? 2 : 1;
  const currentStepNumber = step === "name" ? 1 : totalSteps;

  return (
    <div className="min-h-[100dvh] flex items-center justify-center px-5 py-10" style={{ background: "#FFFFFF" }}>
      <div className="w-full max-w-lg">
        {totalSteps > 1 && (
          <p className="text-xs font-bold tracking-widest uppercase text-[#9A9A9A] mb-4">
            Step {currentStepNumber} of {totalSteps}
          </p>
        )}

        {step === "name" && <OnboardingNameStep onComplete={handleNameComplete} />}
        {step === "bank" && <OnboardingBankStep onComplete={handleBankComplete} />}
      </div>
    </div>
  );
};

export default OnboardingPage;
