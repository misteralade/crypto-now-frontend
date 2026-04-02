import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  Loader2,
  RotateCcw,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import { toast } from "react-toastify";
import { useKycQuery } from "../queries/kyc.query.ts";
import { useKycLongPoll } from "../hooks/useKycLongPoll.ts";
import { useUserQuery } from "../queries/user.query.ts";
import { setKycSession } from "../redux/kyc.slice.ts";
import type { RootState } from "../store.ts";
import type { KycStatusResponse } from "../types/kyc.types.ts";

type StepState = "done" | "current" | "pending" | "failed";

function getCallbackParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    verificationSessionId: params.get("verificationSessionId"),
    status: params.get("status"),
  };
}

function statusText(step?: string) {
  if (step === "verified") return "Your identity has been verified.";
  if (step === "failed")
    return "Your verification was unsuccessful. Please try again.";
  if (step === "processing" || step === "submitted")
    return "We are confirming your verification result.";
  return "Identity verification is required to continue.";
}

function getStepState(
  step: string,
  ninSaved: boolean
): {
  email: StepState;
  nin: StepState;
  didit: StepState;
  confirm: StepState;
} {
  if (step === "verified") {
    return { email: "done", nin: "done", didit: "done", confirm: "done" };
  }

  if (step === "failed") {
    return {
      email: "done",
      nin: ninSaved ? "done" : "current",
      didit: "done",
      confirm: "failed",
    };
  }

  if (step === "processing" || step === "submitted") {
    return { email: "done", nin: "done", didit: "done", confirm: "current" };
  }

  return {
    email: "done",
    nin: ninSaved ? "done" : "current",
    didit: ninSaved ? "current" : "pending",
    confirm: "pending",
  };
}

function stepIcon(state: StepState) {
  if (state === "done") {
    return <CheckCircle2 className="h-5 w-5 text-green-600" />;
  }
  if (state === "failed") {
    return <XCircle className="h-5 w-5 text-red-600" />;
  }
  if (state === "current") {
    return <Clock3 className="h-5 w-5 text-[#03034D]" />;
  }
  return (
    <div
      className="h-5 w-5 rounded-full border-2 border-gray-300"
      aria-hidden="true"
    />
  );
}

function stepLabel(state: StepState) {
  if (state === "done") return "Done";
  if (state === "failed") return "Issue";
  if (state === "current") return "In progress";
  return "Pending";
}

export default function KycPage() {
  const dispatch = useDispatch();
  const session = useSelector((s: RootState) => s.kyc.session);
  const { userProfileData } = useUserQuery();

  const {
    sessionData,
    loadingSession,
    startSessionMutation,
    saveNinMutation,
    startDiditMutation,
    reconcileCallbackMutation,
    statusMutation,
    retryMutation,
    restartMutation,
  } = useKycQuery();

  const [nin, setNin] = useState("");
  const [ninTouched, setNinTouched] = useState(false);
  const [isReconciling, setIsReconciling] = useState(false);
  const callbackProcessedRef = useRef(false);

  const callback = useMemo(() => getCallbackParams(), []);

  useEffect(() => {
    if (!sessionData && !loadingSession) {
      startSessionMutation.mutate();
    }
  }, [sessionData, loadingSession, startSessionMutation]);

  useEffect(() => {
    if (sessionData) {
      dispatch(setKycSession(sessionData));
    }
  }, [sessionData, dispatch]);

  useEffect(() => {
    if (callbackProcessedRef.current) {
      return;
    }

    if (!callback.verificationSessionId && !callback.status) {
      return;
    }

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
          window.history.replaceState(
            {},
            document.title,
            window.location.pathname
          );
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
      if (!session) return;

      dispatch(
        setKycSession({
          ...session,
          currentStep: nextStatus.currentStep,
          documentVerificationStatus: nextStatus.documentVerificationStatus,
          faceMatchStatus: nextStatus.faceMatchStatus,
          failureReason: nextStatus.failureReason,
          retryCount: nextStatus.retryCount,
          maxRetries: nextStatus.maxRetries,
          verifiedAt: nextStatus.verifiedAt,
          diditCallbackStatus: nextStatus.diditCallbackStatus,
          diditWebhookStatus: nextStatus.diditWebhookStatus,
        })
      );
    },
    [dispatch, session]
  );

  const isProcessing = session?.currentStep === "processing";

  useKycLongPoll({
    enabled: isProcessing,
    onStatusChange: (status) => {
      updateStatus(status);
    },
    onError: () => {
      statusMutation.mutate(undefined, {
        onSuccess: ({ success, data }) => {
          if (success && data) {
            updateStatus(data);
          }
        },
      });
    },
  });

  if (loadingSession || startSessionMutation.isPending || !session) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-[#03034D]" />
      </div>
    );
  }

  const ninSaved = session.ninBvnType === "nin";
  const ninError =
    !ninSaved && ninTouched && nin.length > 0 && nin.length !== 11
      ? "NIN must be exactly 11 digits."
      : "";

  const statusTone =
    session.currentStep === "verified"
      ? "success"
      : session.currentStep === "failed"
      ? "error"
      : session.currentStep === "processing" ||
        session.currentStep === "submitted"
      ? "pending"
      : "default";

  const stepState = getStepState(session.currentStep, ninSaved);
  const canStartDidit = ninSaved && !startDiditMutation.isPending;
  const emailVerified =
    (userProfileData as { isVerified?: boolean } | undefined)?.isVerified ??
    true;

  const onStartDidit = () => {
    const verificationWindow = window.open(
      "about:blank",
      "_blank",
      "noopener,noreferrer"
    );

    if (!verificationWindow) {
      toast.error(
        "Unable to open verification in a new tab. Please allow pop-ups and try again."
      );
      return;
    }

    startDiditMutation.mutate(undefined, {
      onSuccess: ({ success, data, message }) => {
        if (
          !success ||
          !data ||
          !("verificationUrl" in data) ||
          !data.verificationUrl
        ) {
          verificationWindow.close();
          toast.error(message || "Unable to create verification session");
          return;
        }
        verificationWindow.location.href = data.verificationUrl as string;
      },
      onError: () => {
        verificationWindow.close();
      },
    });
  };

  const handleSaveNin = () => {
    setNinTouched(true);

    if (nin.length !== 11) {
      return;
    }

    saveNinMutation.mutate(nin);
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 lg:py-8">
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-xl bg-[#03034D]/10 p-2">
          <ShieldCheck className="h-6 w-6 text-[#03034D]" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-gray-900">
            Identity Verification
          </h1>
          <p className="text-sm text-gray-500">
            {statusText(session.currentStep)}
          </p>
        </div>
      </div>

      <div className="space-y-5 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm lg:p-6">
        <div
          className={`rounded-xl border p-3 text-sm ${
            statusTone === "success"
              ? "border-green-200 bg-green-50 text-green-700"
              : statusTone === "error"
              ? "border-red-200 bg-red-50 text-red-700"
              : statusTone === "pending"
              ? "border-amber-200 bg-amber-50 text-amber-700"
              : "border-gray-200 bg-gray-50 text-gray-700"
          }`}
          role="status"
        >
          {session.currentStep === "verified"
            ? "Verification complete. Your account is fully verified."
            : session.currentStep === "failed"
            ? session.failureReason ||
              "Verification failed. Review details below and retry."
            : session.currentStep === "processing" ||
              session.currentStep === "submitted"
            ? "Verification is in progress. We are syncing the result from Didit."
            : "Complete the quick steps below to start identity verification."}
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <h2 className="text-sm font-semibold text-gray-900">Progress</h2>
          <div className="mt-3 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-800">
                {stepIcon(stepState.email)}
                Email verification
              </div>
              <span className="text-xs font-medium text-gray-500">
                {emailVerified ? "Done" : "Pending"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-800">
                {stepIcon(stepState.nin)}
                Save NIN
              </div>
              <span className="text-xs font-medium text-gray-500">
                {stepLabel(stepState.nin)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-800">
                {stepIcon(stepState.didit)}
                Complete verification on Didit
              </div>
              <span className="text-xs font-medium text-gray-500">
                {stepLabel(stepState.didit)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-800">
                {stepIcon(stepState.confirm)}
                Await backend confirmation
              </div>
              <span className="text-xs font-medium text-gray-500">
                {stepLabel(stepState.confirm)}
              </span>
            </div>
          </div>
        </div>

        {!ninSaved && (
          <div className="space-y-2 rounded-xl border border-gray-200 bg-gray-50 p-4">
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="nin-input"
            >
              National Identification Number (NIN)
            </label>
            <input
              id="nin-input"
              value={nin}
              onBlur={() => setNinTouched(true)}
              onChange={(e) => {
                setNin(e.target.value.replace(/\D/g, ""));
                if (!ninTouched) {
                  setNinTouched(true);
                }
              }}
              inputMode="numeric"
              placeholder="Enter your 11-digit NIN"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-[#03034D]"
              maxLength={11}
              disabled={saveNinMutation.isPending}
              aria-invalid={Boolean(ninError)}
              aria-describedby={ninError ? "nin-error" : "nin-help"}
            />
            <div className="flex items-center justify-between">
              <p id="nin-help" className="text-xs text-gray-500">
                Digits only. Must be 11 digits.
              </p>
              <p className="text-xs text-gray-400">{nin.length}/11</p>
            </div>
            {ninError && (
              <p id="nin-error" className="text-xs text-red-600" role="alert">
                {ninError}
              </p>
            )}

            <button
              type="button"
              onClick={handleSaveNin}
              disabled={nin.length !== 11 || saveNinMutation.isPending}
              className="mt-2 inline-flex items-center justify-center rounded-lg bg-[#03034D] px-4 py-2 text-sm font-semibold text-white transition-all duration-200 ease-out disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saveNinMutation.isPending ? "Saving NIN..." : "Continue"}
            </button>
          </div>
        )}

        {ninSaved && (
          <button
            type="button"
            onClick={onStartDidit}
            disabled={!canStartDidit}
            className="inline-flex w-full items-center justify-center rounded-lg bg-[#03034D] px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200 ease-out disabled:cursor-not-allowed disabled:opacity-50"
          >
            {startDiditMutation.isPending
              ? "Opening..."
              : "Start Identity Verification"}
          </button>
        )}

        {isReconciling && (
          <div
            className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700"
            role="status"
            aria-live="polite"
          >
            <Loader2 className="h-4 w-4 animate-spin" />
            Finishing verification...
          </div>
        )}

        {session.currentStep === "failed" && (
          <div className="space-y-3 rounded-xl border border-red-200 bg-red-50 p-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="mt-0.5 h-4 w-4 text-red-600" />
              <div>
                <p className="text-sm font-medium text-red-700">
                  Verification could not be completed.
                </p>
                <p className="mt-1 text-xs text-red-700">
                  {session.failureReason ||
                    "Please retry or restart your verification."}
                </p>
                <p className="mt-1 text-xs text-red-700">
                  Retry usage: {session.retryCount} / {session.maxRetries}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {session.retryCount < session.maxRetries && (
                <button
                  type="button"
                  onClick={() => retryMutation.mutate()}
                  disabled={retryMutation.isPending}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#03034D] px-4 py-2 text-sm font-semibold text-white transition-all duration-200 ease-out disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {retryMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <RotateCcw className="h-4 w-4" />
                  )}
                  Retry verification
                </button>
              )}
              <button
                type="button"
                onClick={() => restartMutation.mutate()}
                disabled={restartMutation.isPending}
                className="inline-flex items-center justify-center rounded-lg border border-[#03034D] px-4 py-2 text-sm font-semibold text-[#03034D] transition-all duration-200 ease-out disabled:cursor-not-allowed disabled:opacity-50"
              >
                {restartMutation.isPending
                  ? "Restarting..."
                  : "Restart from scratch"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
