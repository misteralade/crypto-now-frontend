import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Loader2,
  Mail,
  RotateCcw,
  ScanFace,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
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
  if (step === "Approved") return "Your identity has been verified.";
  if (step === "Declined" || step === "Expired" || step === "Abandoned")
    return "Your verification was unsuccessful. Please try again.";
  if (step === "In Review")
    return "Your verification is under review. We'll notify you once completed.";
  if (step === "Resubmitted")
    return "Additional verification is required. Please complete the resubmission steps.";
  if (step === "In Progress" || step === "submitted")
    return "We are confirming your verification result.";
  return "Complete the steps below to verify your identity.";
}

function getStepState(
  step: string,
  ninSaved: boolean,
): {
  email: StepState;
  nin: StepState;
  didit: StepState;
} {
  if (step === "Approved") {
    return { email: "done", nin: "done", didit: "done" };
  }

  if (step === "Declined" || step === "Expired" || step === "Abandoned") {
    return {
      email: "done",
      nin: ninSaved ? "done" : "current",
      didit: "failed",
    };
  }

  if (
    step === "In Review" ||
    step === "Resubmitted" ||
    step === "In Progress" ||
    step === "submitted"
  ) {
    return { email: "done", nin: "done", didit: "current" };
  }

  return {
    email: "done",
    nin: ninSaved ? "done" : "current",
    didit: ninSaved ? "current" : "pending",
  };
}

// ── Step Badge ───────────────────────────────────────────────────────────────

function StepBadge({ state, label }: { state: StepState; label?: string }) {
  if (state === "done") {
    return <CheckCircle2 className="h-6 w-6 text-success" />;
  }

  const map: Record<StepState, string> = {
    done: "", // Unused
    failed: "bg-bgFailed text-red border border-red/10",
    current: "bg-accentBg text-accent1 border border-accent1/10",
    pending: "bg-greyBg text-grey2 border border-border/50",
  };

  const text =
    label ??
    {
      done: "",
      failed: "Failed",
      current: "In Progress",
      pending: "Pending",
    }[state];

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide ${map[state]}`}
    >
      {text}
    </span>
  );
}

// ── Individual Step Cards ────────────────────────────────────────────────────

function EmailStepCard({ state }: { state: StepState }) {
  const isActive = state === "current";
  const isDone = state === "done";
  return (
    <div
      className={`rounded-2xl border transition-all duration-300 ${
        isDone
          ? "border-success/30 bg-bgSuccess"
          : isActive
            ? "border-primary/20 bg-white shadow-md ring-1 ring-primary/5"
            : "border-border bg-greyBg/30 opacity-80"
      }`}
    >
      <div className="flex items-start justify-between gap-3 p-5">
        <div className="flex items-start gap-3">
          <div
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white border border-border/50 shadow-sm`}
          >
            <Mail
              className={`h-4.5 w-4.5 ${isDone ? "text-success" : "text-titleColor"}`}
            />
          </div>
          <div>
            <p className="text-sm font-semibold text-titleColor">
              Email Verification
            </p>
            <p className="mt-0.5 text-xs text-textSec">
              Confirm your email address to begin
            </p>
          </div>
        </div>
        <StepBadge state={state} />
      </div>
    </div>
  );
}

function NinStepCard({
  state,
  nin,
  setNin,
  ninTouched,
  setNinTouched,
  ninError,
  onSave,
  isPending,
}: {
  state: StepState;
  nin: string;
  setNin: (v: string) => void;
  ninTouched: boolean;
  setNinTouched: (v: boolean) => void;
  ninError: string;
  onSave: () => void;
  isPending: boolean;
}) {
  const isActive = state === "current";
  const isDone = state === "done";
  const isFailed = state === "failed";

  return (
    <div
      className={`rounded-2xl border transition-all duration-300 ${
        isDone
          ? "border-success/30 bg-bgSuccess"
          : isActive
            ? "border-primary/20 bg-white shadow-md ring-1 ring-primary/5"
            : isFailed
              ? "border-red/30 bg-bgFailed ring-1 ring-red/5"
              : "border-border bg-greyBg/30 opacity-80"
      }`}
    >
      {/* Card header */}
      <div className="flex items-start justify-between gap-3 p-5">
        <div className="flex items-start gap-3">
          {/* NIMC logo */}
          <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white border border-border/50 shadow-sm">
            <img
              src="/decorations/nimc-logo.png"
              alt="NIMC"
              className="h-7 w-7 object-contain"
            />
          </div>
          <div>
            <p className="text-sm font-semibold text-titleColor">
              NIN Verification
            </p>
            <p className="mt-0.5 text-xs text-textSec">Powered by Prembly</p>
          </div>
        </div>
        <StepBadge state={state} />
      </div>

      {/* NIN input section — only shown when active */}
      {isActive && (
        <div
          className="border-t border-border/60 p-6"
          style={{
            animation: "slideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1) both",
          }}
        >
          <label
            htmlFor="nin-input"
            className="mb-2 block text-xs font-bold uppercase tracking-wider text-textSec transition-colors duration-200 focus-within:text-titleColor"
          >
            National Identification Number
          </label>
          <div className="group relative">
            <div
              className={`absolute -inset-0.5 rounded-2xl opacity-0 blur backdrop-blur-sm transition-all duration-300 group-focus-within:opacity-100 ${
                ninError ? "bg-red/20" : "bg-primary/20"
              }`}
            />
            <div className="relative">
              <input
                id="nin-input"
                value={nin}
                onBlur={() => setNinTouched(true)}
                onChange={(e) => {
                  setNin(e.target.value.replace(/\D/g, ""));
                  if (!ninTouched) setNinTouched(true);
                }}
                inputMode="numeric"
                placeholder="Enter your 11-digit NIN"
                className={`relative w-full rounded-2xl border bg-white px-5 py-4 pr-16 text-[15px] font-semibold text-titleColor placeholder:font-medium placeholder:text-placeholder/70 shadow-sm transition-all duration-300 focus:outline-none focus:ring-0 disabled:opacity-50 ${
                  ninError
                    ? "border-red/40 focus:border-red"
                    : "border-border focus:border-primary/40 focus:shadow-[0_4px_20px_-4px_rgba(3,3,77,0.1)]"
                }`}
                style={
                  ninError
                    ? {
                        animation:
                          "shake 0.5s cubic-bezier(.36,.07,.19,.97) both",
                      }
                    : {}
                }
                maxLength={11}
                disabled={isPending}
                aria-invalid={Boolean(ninError)}
                aria-describedby={ninError ? "nin-error" : "nin-help"}
              />
              <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center">
                <span
                  className={`rounded-lg px-2 py-1 text-xs font-bold tabular-nums transition-colors duration-300 ${
                    nin.length === 11
                      ? "bg-success/10 text-success"
                      : "bg-greyBg text-grey2"
                  }`}
                >
                  {nin.length}/11
                </span>
              </div>
            </div>
          </div>
          {ninError ? (
            <p
              id="nin-error"
              className="mt-2 text-xs font-semibold text-red"
              role="alert"
            >
              {ninError}
            </p>
          ) : (
            <p id="nin-help" className="mt-2 text-xs font-medium text-grey2">
              11 digits, numbers only
            </p>
          )}
          <button
            type="button"
            onClick={onSave}
            disabled={nin.length !== 11 || isPending}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-4 text-[15px] font-bold text-white shadow-[0_4px_14px_0_rgba(3,3,77,0.2)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-primary/95 hover:shadow-[0_6px_20px_rgba(3,3,77,0.23)] active:translate-y-0 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          >
            {isPending ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Verifying NIN…
              </>
            ) : (
              "Continue to Identity Verification"
            )}
          </button>
        </div>
      )}
    </div>
  );
}

function IdentityStepCard({
  state,
  diditLabel,
  canStart,
  isPending,
  onStart,
  onRetry,
  onRestart,
  retryPending,
  restartPending,
  retryCount,
  maxRetries,
  failureReason,
}: {
  state: StepState;
  diditLabel: string;
  canStart: boolean;
  isPending: boolean;
  onStart: () => void;
  onRetry: () => void;
  onRestart: () => void;
  retryPending: boolean;
  restartPending: boolean;
  retryCount: number;
  maxRetries: number;
  failureReason?: string | null;
}) {
  const isActive = state === "current";
  const isDone = state === "done";
  const isFailed = state === "failed";

  return (
    <div
      className={`rounded-2xl border transition-all duration-300 ${
        isDone
          ? "border-success/30 bg-bgSuccess"
          : isActive
            ? "border-primary/20 bg-white shadow-md ring-1 ring-primary/5"
            : isFailed
              ? "border-red/30 bg-bgFailed ring-1 ring-red/5"
              : "border-border bg-greyBg/30 opacity-80"
      }`}
    >
      {/* Card header */}
      <div className="flex items-start justify-between gap-3 p-5">
        <div className="flex items-start gap-3">
          <div
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white border border-border/50 shadow-sm`}
          >
            <ScanFace
              className={`h-4.5 w-4.5 ${
                isDone
                  ? "text-success"
                  : isFailed
                    ? "text-red"
                    : "text-titleColor"
              }`}
            />
          </div>
          <div>
            <p className="text-sm font-semibold text-titleColor">
              Identity Verification
            </p>
            <p className="mt-0.5 text-xs text-textSec">
              Biometric face match &amp; document scan
            </p>
          </div>
        </div>
        <StepBadge state={state} label={isFailed ? "Failed" : diditLabel} />
      </div>

      {/* Action area */}
      {isActive && !isFailed && (
        <div
          className="border-t border-border/60 p-5 pt-4"
          style={{
            animation: "slideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1) both",
          }}
        >
          {/* In-progress / review hint */}
          {(diditLabel === "In Progress" ||
            diditLabel === "In Review" ||
            diditLabel === "Resubmitted") && (
            <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 p-3.5">
              <Clock className="mt-px h-4 w-4 shrink-0 text-amber-600" />
              <p className="text-xs text-amber-800">
                {diditLabel === "In Review"
                  ? "Your verification is under manual review. You can wait or retry for a faster result."
                  : "We're confirming your verification result. This usually takes a moment."}
              </p>
            </div>
          )}

          {diditLabel === "In Review" ? (
            <button
              type="button"
              onClick={onRestart}
              disabled={restartPending}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-4 text-[15px] font-bold text-white shadow-[0_4px_14px_0_rgba(3,3,77,0.2)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-primary/95 hover:shadow-[0_6px_20px_rgba(3,3,77,0.23)] active:translate-y-0 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            >
              {restartPending ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Restarting…
                </>
              ) : (
                <>
                  <RotateCcw className="h-5 w-5" />
                  Retry Verification
                </>
              )}
            </button>
          ) : (
            canStart &&
            diditLabel !== "In Progress" &&
            diditLabel !== "Resubmitted" && (
              <button
                type="button"
                onClick={onStart}
                disabled={!canStart || isPending}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-4 text-[15px] font-bold text-white shadow-[0_4px_14px_0_rgba(3,3,77,0.2)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-primary/95 hover:shadow-[0_6px_20px_rgba(3,3,77,0.23)] active:translate-y-0 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Redirecting…
                  </>
                ) : (
                  <>
                    <ScanFace className="h-5 w-5" />
                    Start Identity Verification
                  </>
                )}
              </button>
            )
          )}
        </div>
      )}

      {/* Failure area */}
      {isFailed && (
        <div
          className="border-t border-red/10 p-5 pt-4"
          style={{
            animation: "slideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1) both",
          }}
        >
          <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-red/20 bg-red/5 p-3.5">
            <AlertCircle className="mt-px h-4 w-4 shrink-0 text-red" />
            <div className="space-y-1">
              <p className="text-xs font-semibold text-red">
                Verification failed
              </p>
              <p className="text-xs text-red/80">
                {failureReason ?? "Please retry or restart your verification."}
              </p>
              <p className="text-xs text-red/70">
                Attempts used: {retryCount} / {maxRetries}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {retryCount < maxRetries && (
              <button
                type="button"
                onClick={onRetry}
                disabled={retryPending}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition-all duration-200 ease-out hover:bg-primary/90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {retryPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RotateCcw className="h-4 w-4" />
                )}
                Retry
              </button>
            )}
            <button
              type="button"
              onClick={onRestart}
              disabled={restartPending}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-primary px-5 py-3 text-sm font-semibold text-primary transition-all duration-200 ease-out hover:bg-primary/5 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Restart
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────

export default function KycPage() {
  const navigate = useNavigate();
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
          window.history.replaceState(
            {},
            document.title,
            window.location.pathname,
          );
        },
      },
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
        }),
      );
    },
    [dispatch, session],
  );

  const isProcessing =
    session?.currentStep === "In Progress" ||
    session?.currentStep === "submitted" ||
    session?.currentStep === "Resubmitted";

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

  const ninSaved = session.ninBvnType === "nin";
  const ninError =
    !ninSaved && ninTouched && nin.length > 0 && nin.length !== 11
      ? "NIN must be exactly 11 digits."
      : "";

  const stepState = getStepState(session.currentStep, ninSaved);

  const diditLabel =
    session.currentStep === "In Review"
      ? "In Review"
      : session.currentStep === "Resubmitted"
        ? "Resubmitted"
        : session.currentStep === "In Progress" ||
            session.currentStep === "submitted"
          ? "In Progress"
          : stepState.didit === "done"
            ? "Completed"
            : stepState.didit === "failed"
              ? "Failed"
              : stepState.didit === "current"
                ? "In Progress"
                : "Pending";

  const canStartDidit = ninSaved && !startDiditMutation.isPending;
  const isApproved = session.currentStep === "Approved";

  const handleSaveNin = () => {
    setNinTouched(true);
    if (nin.length !== 11) return;
    saveNinMutation.mutate(nin);
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
      {/* slide-down keyframe injection */}
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
        {/* ── Page header ── */}
        <div
          className="mb-8 text-center"
          style={{ animation: "fadeInUp 0.4s cubic-bezier(0.16,1,0.3,1) both" }}
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

          {/* Global status banner */}
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

        {/* ── Steps ── */}
        <div className="space-y-4">
          {/* Step 1 — Email */}
          <div
            style={{
              animation: "fadeInUp 0.4s 0.05s cubic-bezier(0.16,1,0.3,1) both",
            }}
          >
            <EmailStepCard state={stepState.email} />
          </div>

          {/* Step 2 — NIN */}
          <div
            style={{
              animation: "fadeInUp 0.4s 0.12s cubic-bezier(0.16,1,0.3,1) both",
            }}
          >
            <NinStepCard
              state={stepState.nin}
              nin={nin}
              setNin={setNin}
              ninTouched={ninTouched}
              setNinTouched={setNinTouched}
              ninError={ninError}
              onSave={handleSaveNin}
              isPending={saveNinMutation.isPending}
            />
          </div>

          {/* Step 3 — Identity Verification */}
          <div
            style={{
              animation: "fadeInUp 0.4s 0.2s cubic-bezier(0.16,1,0.3,1) both",
            }}
          >
            <IdentityStepCard
              state={stepState.didit}
              diditLabel={diditLabel}
              canStart={canStartDidit}
              isPending={startDiditMutation.isPending}
              onStart={onStartDidit}
              onRetry={() => retryMutation.mutate()}
              onRestart={() => restartMutation.mutate()}
              retryPending={retryMutation.isPending}
              restartPending={restartMutation.isPending}
              retryCount={session.retryCount}
              maxRetries={session.maxRetries}
              failureReason={session.failureReason}
            />
          </div>
        </div>

        {/* Continue Action */}
        {isApproved && (
          <div
            className="mt-8"
            style={{
              animation: "fadeInUp 0.4s 0.25s cubic-bezier(0.16,1,0.3,1) both",
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

        {/* Footer note */}
        <p
          className="mt-8 text-center text-xs text-grey2"
          style={{
            animation: "fadeInUp 0.4s 0.28s cubic-bezier(0.16,1,0.3,1) both",
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
