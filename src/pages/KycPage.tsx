import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ArrowRight, CheckCircle2, Loader2, ShieldCheck } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "react-toastify";

import { useKycQuery } from "../queries/kyc.query.ts";
import { useKycLongPoll } from "../hooks/useKycLongPoll.ts";
import { setKycSession } from "../redux/kyc.slice.ts";
import type { RootState } from "../store.ts";
import type { KycStatusResponse } from "../types/kyc.types.ts";
import {
  DiditSessionStatusEnum,
  KycNinStatusEnum,
  KycSessionStepEnum,
} from "../types/kyc.types.ts";

import {
  EmailStepCard,
  IdentityStepCard,
  NinStepCard,
  type StepState,
} from "../components/kyc";

function getCallbackParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    verificationSessionId: params.get("verificationSessionId"),
    status: params.get("status"),
  };
}

function statusText(step?: string) {
  if (step === KycSessionStepEnum.APPROVED)
    return "Your identity has been verified.";
  if (
    step === KycSessionStepEnum.DECLINED ||
    step === KycSessionStepEnum.EXPIRED ||
    step === KycSessionStepEnum.ABANDONED
  )
    return "Your verification was unsuccessful. Please try again.";
  if (step === KycSessionStepEnum.IN_REVIEW)
    return "Your verification is under review. We'll notify you once completed.";
  if (step === KycSessionStepEnum.RESUBMITTED)
    return "Additional verification is required. Please complete the resubmission steps.";
  if (
    step === KycSessionStepEnum.IN_PROGRESS ||
    step === KycSessionStepEnum.SUBMITTED
  )
    return "We are confirming your verification result.";
  return "Complete the steps below to verify your identity.";
}

function getStepState(
  step: string,
  ninSaved: boolean
): {
  email: StepState;
  nin: StepState;
  didit: StepState;
} {
  if (step === KycSessionStepEnum.APPROVED) {
    return { email: "done", nin: "done", didit: "done" };
  }

  if (
    step === KycSessionStepEnum.DECLINED ||
    step === KycSessionStepEnum.EXPIRED ||
    step === KycSessionStepEnum.ABANDONED
  ) {
    return {
      email: "done",
      nin: ninSaved ? "done" : "current",
      didit: "failed",
    };
  }

  if (
    step === KycSessionStepEnum.IN_REVIEW ||
    step === KycSessionStepEnum.RESUBMITTED ||
    step === KycSessionStepEnum.IN_PROGRESS ||
    step === KycSessionStepEnum.SUBMITTED
  ) {
    return { email: "done", nin: "done", didit: "current" };
  }

  return {
    email: "done",
    nin: ninSaved ? "done" : "current",
    didit: ninSaved ? "current" : "pending",
  };
}

export default function KycPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const session = useSelector((s: RootState) => s.kyc.session);

  const {
    sessionData,
    loadingSession,
    startSessionMutation,
    saveNinMutation,
    startDiditMutation,
    reconcileCallbackMutation,
    statusMutation,
    retryMutation,
  } = useKycQuery();

  const [nin, setNin] = useState("");
  const [ninTouched, setNinTouched] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [firstNameTouched, setFirstNameTouched] = useState(false);
  const [isReconciling, setIsReconciling] = useState(false);

  const callbackProcessedRef = useRef(false);
  const sessionRef = useRef(session);
  const statusPendingRef = useRef(false);
  const statusMutateRef = useRef(statusMutation.mutate);

  const reviewPollCountRef = useRef(0);
  const reviewConsecutiveErrorsRef = useRef(0);
  const reviewTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reviewPollingActiveRef = useRef(false);

  useEffect(() => {
    sessionRef.current = session;
  }, [session]);

  useEffect(() => {
    statusMutateRef.current = statusMutation.mutate;
  }, [statusMutation.mutate]);

  const callback = useMemo(() => getCallbackParams(), []);

  const {
    mutate: startSession,
    isPending: isStartingSession,
    isSuccess: sessionStarted,
  } = startSessionMutation;

  useEffect(() => {
    if (
      !sessionData &&
      !loadingSession &&
      !isStartingSession &&
      !sessionStarted
    ) {
      startSession();
    }
  }, [
    sessionData,
    loadingSession,
    isStartingSession,
    sessionStarted,
    startSession,
  ]);

  useEffect(() => {
    if (sessionData) dispatch(setKycSession(sessionData));
  }, [sessionData, dispatch]);

  useEffect(() => {
    if (callbackProcessedRef.current) return;
    if (!callback.verificationSessionId && !callback.status) return;

    callbackProcessedRef.current = true;
    setIsReconciling(true);
    reconcileCallbackMutation.mutate(
      {
        verificationSessionId: callback.verificationSessionId,
        status: callback.status,
      },
      {
        onSettled: () => {
          setIsReconciling(false);
          window.history.replaceState({}, document.title, window.location.pathname);
        },
      }
    );
  }, [
    callback.status,
    callback.verificationSessionId,
    reconcileCallbackMutation,
    reconcileCallbackMutation.mutate,
  ]);

  const updateStatus = useCallback(
    (nextStatus: KycStatusResponse) => {
      const currentSession = sessionRef.current;
      if (!currentSession) return;
      dispatch(
        setKycSession({
          ...currentSession,
          currentStep: nextStatus.currentStep,
          identityVerificationStatus: nextStatus.identityVerificationStatus,
          failureReason: nextStatus.failureReason,
          verifiedAt: nextStatus.verifiedAt,
          diditCallbackStatus:
            nextStatus.diditCallbackStatus ?? currentSession.diditCallbackStatus,
          diditWebhookStatus:
            nextStatus.diditWebhookStatus ?? currentSession.diditWebhookStatus,
        })
      );
    },
    [dispatch]
  );

  const isProcessing =
    session?.currentStep === KycSessionStepEnum.IN_PROGRESS ||
    session?.currentStep === KycSessionStepEnum.SUBMITTED ||
    session?.currentStep === KycSessionStepEnum.RESUBMITTED;

  const isInReview = useMemo(() => {
    const step = session?.currentStep;
    const identityStatus = session?.identityVerificationStatus;
    if (
      step === KycSessionStepEnum.APPROVED ||
      step === KycSessionStepEnum.DECLINED ||
      step === KycSessionStepEnum.EXPIRED ||
      step === KycSessionStepEnum.ABANDONED
    ) {
      return false;
    }

    return (
      step === KycSessionStepEnum.IN_REVIEW ||
      identityStatus === DiditSessionStatusEnum.IN_REVIEW
    );
  }, [session?.currentStep, session?.identityVerificationStatus]);

  useEffect(() => {
    statusPendingRef.current = statusMutation.isPending;
  }, [statusMutation.isPending]);

  const refreshStatus = useCallback(() => {
    if (statusPendingRef.current) return;
    statusMutateRef.current(undefined, {
      onSuccess: ({ success, data, message }) => {
        if (success && data) {
          updateStatus(data);
          return;
        }
        toast.error(message || "Unable to refresh status");
      },
      onError: (error) => {
        console.error("[KYC] Manual status refresh failed", error);
        toast.error("Unable to refresh status");
      },
    });
  }, [updateStatus]);

  useEffect(() => {
    const MAX_REVIEW_POLLS = 12;
    const REVIEW_POLL_INTERVAL_MS = 10_000;
    const MAX_CONSECUTIVE_REVIEW_ERRORS = 2;

    const clear = () => {
      if (reviewTimeoutRef.current) {
        clearTimeout(reviewTimeoutRef.current);
        reviewTimeoutRef.current = null;
      }
    };

    if (!isInReview) {
      reviewPollingActiveRef.current = false;
      reviewPollCountRef.current = 0;
      reviewConsecutiveErrorsRef.current = 0;
      clear();
      return;
    }

    if (reviewPollingActiveRef.current) return;
    reviewPollingActiveRef.current = true;

    const scheduleNext = () => {
      clear();

      if (!reviewPollingActiveRef.current) return;
      if (reviewPollCountRef.current >= MAX_REVIEW_POLLS) {
        reviewPollingActiveRef.current = false;
        return;
      }

      reviewTimeoutRef.current = setTimeout(() => {
        if (!reviewPollingActiveRef.current) return;

        if (statusPendingRef.current) {
          scheduleNext();
          return;
        }

        reviewPollCountRef.current += 1;
        statusMutateRef.current(undefined, {
          onSuccess: ({ success, data }) => {
            if (success && data) {
              reviewConsecutiveErrorsRef.current = 0;
              updateStatus(data);
            }
          },
          onError: (error) => {
            console.error("[KYC] In-review status poll failed", error);
            reviewConsecutiveErrorsRef.current += 1;
            if (
              reviewConsecutiveErrorsRef.current >=
              MAX_CONSECUTIVE_REVIEW_ERRORS
            ) {
              reviewPollingActiveRef.current = false;
              clear();
            }
          },
          onSettled: () => {
            if (reviewPollingActiveRef.current) scheduleNext();
          },
        });
      }, REVIEW_POLL_INTERVAL_MS);
    };

    scheduleNext();

    return () => {
      reviewPollingActiveRef.current = false;
      clear();
    };
  }, [isInReview, refreshStatus, updateStatus]);

  useKycLongPoll({
    enabled: isProcessing,
    onStatusChange: (status) => updateStatus(status),
    onError: () => {
      statusMutation.mutate(undefined, {
        onSuccess: ({ success, data }) => {
          if (success && data) updateStatus(data);
        },
      });
    },
  });

  if (loadingSession || startSessionMutation.isPending || !session) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
        <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-accentBg">
          <ShieldCheck className="h-7 w-7 text-accent1" />
          <span className="absolute inset-0 rounded-full bg-accentBg animate-ping opacity-40" />
        </div>
        <p className="text-sm text-textSec">Setting up your session…</p>
      </div>
    );
  }

  const ninSaved = session.ninStatus === KycNinStatusEnum.VERIFIED;
  const ninError =
    !ninSaved && ninTouched && nin.length > 0 && nin.length !== 11
      ? "NIN must be exactly 11 digits."
      : "";
  const firstNameError =
    !ninSaved && firstNameTouched && !firstName.trim()
      ? "First name is required."
      : "";
  const ninAttemptsRemaining = session.ninVerificationAttemptsRemaining ?? 3;
  const ninLocked = ninAttemptsRemaining <= 0;
  const ninVerifiedName = session.ninVerifiedName ?? null;

  const stepState = getStepState(session.currentStep, ninSaved);

  const identityTerminalFailedStatuses = new Set<string>([
    DiditSessionStatusEnum.DECLINED,
    DiditSessionStatusEnum.EXPIRED,
    DiditSessionStatusEnum.ABANDONED,
    DiditSessionStatusEnum.KYC_EXPIRED,
  ]);

  const diditStepState: StepState = identityTerminalFailedStatuses.has(
    session.identityVerificationStatus
  )
    ? "failed"
    : stepState.didit;

  const TERMINAL_DIDIT_STATUSES = new Set<string>([
    DiditSessionStatusEnum.APPROVED,
    DiditSessionStatusEnum.DECLINED,
    DiditSessionStatusEnum.EXPIRED,
    DiditSessionStatusEnum.ABANDONED,
    DiditSessionStatusEnum.KYC_EXPIRED,
  ]);

  const diditLabel = TERMINAL_DIDIT_STATUSES.has(
    session.identityVerificationStatus
  )
    ? session.identityVerificationStatus
    : TERMINAL_DIDIT_STATUSES.has(session.currentStep)
    ? session.currentStep
    : session.currentStep === KycSessionStepEnum.IN_REVIEW
    ? KycSessionStepEnum.IN_REVIEW
    : session.currentStep === KycSessionStepEnum.RESUBMITTED
    ? KycSessionStepEnum.RESUBMITTED
    : session.currentStep === KycSessionStepEnum.IN_PROGRESS ||
      session.currentStep === KycSessionStepEnum.SUBMITTED
    ? KycSessionStepEnum.IN_PROGRESS
    : stepState.didit === "done"
    ? "Completed"
    : stepState.didit === "failed"
    ? "Failed"
    : stepState.didit === "current"
    ? "Ready"
    : "Pending";

  const canStartDidit = ninSaved && !startDiditMutation.isPending;
  const isApproved = session.currentStep === KycSessionStepEnum.APPROVED;

  const continueVerificationUrl =
    session.verificationUrl ?? session.diditSessionUrl ?? null;

  const showContinueVerification =
    !!continueVerificationUrl &&
    (session.currentStep === KycSessionStepEnum.NOT_STARTED ||
      session.currentStep === KycSessionStepEnum.IN_PROGRESS ||
      session.currentStep === KycSessionStepEnum.SUBMITTED ||
      session.currentStep === KycSessionStepEnum.IN_REVIEW ||
      session.currentStep === KycSessionStepEnum.RESUBMITTED);

  const handleSaveNin = () => {
    setNinTouched(true);
    setFirstNameTouched(true);
    if (nin.length !== 11 || !firstName.trim()) return;
    saveNinMutation.mutate({ nin, firstName: firstName.trim() });
  };

  const onStartDidit = () => {
    startDiditMutation.mutate(undefined, {
      onSuccess: ({ success, data, message }) => {
        if (
          !success ||
          !data ||
          !("verificationUrl" in data) ||
          !data.verificationUrl
        ) {
          toast.error(message || "Unable to create verification session");
          return;
        }
        window.location.href = data.verificationUrl as string;
      },
    });
  };

  return (
    <>
      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          10%, 90% { transform: translateX(-1px); }
          20%, 80% { transform: translateX(2px); }
          30%, 50%, 70% { transform: translateX(-4px); }
          40%, 60% { transform: translateX(4px); }
        }
      `}</style>

      <div className="mx-auto max-w-lg px-4 py-8">
        <div
          className="mb-8 text-center"
          style={{
            animation: "fadeInUp 0.4s cubic-bezier(0.16,1,0.3,1) both",
          }}
        >
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/20">
            <ShieldCheck className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-xl font-bold text-titleColor">
            Identity Verification
          </h1>
          <p className="mt-1.5 text-sm text-textSec">
            {statusText(session.currentStep)}
          </p>

          {isApproved && (
            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-success/30 bg-bgSuccess px-4 py-2 text-sm font-semibold text-success">
              <CheckCircle2 className="h-4 w-4" />
              Account fully verified
            </div>
          )}
          {isReconciling && (
            <div
              className="mt-4 inline-flex items-center gap-2 rounded-full border border-accent2/30 bg-accentBg px-4 py-2 text-sm font-semibold text-accent1"
              role="status"
              aria-live="polite"
            >
              <Loader2 className="h-4 w-4 animate-spin" />
              Finishing verification…
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div
            style={{
              animation:
                "fadeInUp 0.4s 0.05s cubic-bezier(0.16,1,0.3,1) both",
            }}
          >
            <EmailStepCard state={stepState.email} />
          </div>

          <div
            style={{
              animation:
                "fadeInUp 0.4s 0.12s cubic-bezier(0.16,1,0.3,1) both",
            }}
          >
            <NinStepCard
              state={stepState.nin}
              nin={nin}
              setNin={setNin}
              setNinTouched={setNinTouched}
              ninError={ninError}
              firstName={firstName}
              setFirstName={setFirstName}
              firstNameTouched={firstNameTouched}
              setFirstNameTouched={setFirstNameTouched}
              firstNameError={firstNameError}
              onSave={handleSaveNin}
              isPending={saveNinMutation.isPending}
              attemptsRemaining={ninAttemptsRemaining}
              isLocked={ninLocked}
              verifiedName={ninVerifiedName}
              isRetry={
                session.ninStatus === KycNinStatusEnum.VERIFICATION_FAILED
              }
            />
          </div>

          <div
            style={{
              animation:
                "fadeInUp 0.4s 0.2s cubic-bezier(0.16,1,0.3,1) both",
            }}
          >
            <IdentityStepCard
              state={diditStepState}
              diditLabel={diditLabel}
              canStart={canStartDidit}
              isPending={startDiditMutation.isPending}
              onStart={onStartDidit}
              onRefresh={() => refreshStatus()}
              onRetry={() =>
                retryMutation.mutate(undefined, {
                  onSuccess: ({ success, data }) => {
                    if (!success || !data) return;
                    const url = data.verificationUrl ?? data.diditSessionUrl;
                    if (url) window.location.href = url;
                  },
                })
              }
              onContinue={() => {
                if (continueVerificationUrl)
                  window.location.href = continueVerificationUrl;
              }}
              showContinue={showContinueVerification}
              retryPending={retryMutation.isPending}
              attemptsRemaining={
                session.identityVerificationAttemptsRemaining ?? 3
              }
              failureReason={session.failureReason}
            />
          </div>
        </div>

        {isApproved && (
          <div
            className="mt-8"
            style={{
              animation:
                "fadeInUp 0.4s 0.25s cubic-bezier(0.16,1,0.3,1) both",
            }}
          >
            <button
              onClick={() => navigate({ to: "/dashboard" })}
              type="button"
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-4 text-[15px] font-bold text-white shadow-[0_4px_14px_0_rgba(3,3,77,0.2)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-primary/95 hover:shadow-[0_6px_20px_rgba(3,3,77,0.23)] active:translate-y-0 active:scale-[0.98]"
            >
              Continue to Dashboard
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        )}

        <p
          className="mt-8 text-center text-xs text-grey2"
          style={{
            animation:
              "fadeInUp 0.4s 0.28s cubic-bezier(0.16,1,0.3,1) both",
          }}
        >
          Your data is encrypted and handled in line with our{" "}
          <a
            href="/legal/privacy"
            className="font-medium text-accent1 underline-offset-2 hover:underline"
          >
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </>
  );
}
