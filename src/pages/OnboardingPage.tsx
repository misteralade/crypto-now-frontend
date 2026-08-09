import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useOnboardingQuery } from "../queries/onboarding.query.ts";
import { ROUTES } from "../util/constants.util.ts";
import OnboardingBankStep from "./onboarding/OnboardingBankStep.tsx";
import { LoadingSpinner } from "../components/global/LoadingSpinner.tsx";

const OnboardingPage = () => {
  const navigate = useNavigate();
  const { onboardingStatus, loadingOnboardingStatus, refetchOnboardingStatus } = useOnboardingQuery();

  // Name is derived from the verified bank account name in
  // OnboardingBankStep, so onboarding is a single step: add a bank account.
  useEffect(() => {
    if (!onboardingStatus) return;

    if (onboardingStatus.isComplete) {
      navigate({ to: ROUTES.DASHBOARD });
    }
  }, [onboardingStatus, navigate]);

  const handleBankComplete = async () => {
    await refetchOnboardingStatus();
    navigate({ to: ROUTES.DASHBOARD });
  };

  if (loadingOnboardingStatus || !onboardingStatus || onboardingStatus.isComplete) {
    return (
      <div className="flex items-center justify-center min-h-[100dvh]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] flex items-center justify-center px-5 py-10" style={{ background: "#FFFFFF" }}>
      <div className="w-full max-w-lg">
        <OnboardingBankStep onComplete={handleBankComplete} />
      </div>
    </div>
  );
};

export default OnboardingPage;
