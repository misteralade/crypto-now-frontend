import {
  AlertCircle,
  ArrowRight,
  Clock,
  Loader2,
  RefreshCw,
  RotateCcw,
  ScanFace,
} from "lucide-react";
import { KycSessionStepEnum } from "../../types/kyc.types";
import type { StepState } from "./kyc-step.types";
import { StepBadge } from "./StepBadge";

export function IdentityStepCard({
  state,
  diditLabel,
  canStart,
  isPending,
  onStart,
  onRefresh,
  onRetry,
  onContinue,
  showContinue,
  retryPending,
  attemptsRemaining,
  failureReason,
}: {
  state: StepState;
  diditLabel: string;
  canStart: boolean;
  isPending: boolean;
  onStart: () => void;
  onRefresh: () => void;
  onRetry: () => void;
  onContinue: () => void;
  showContinue: boolean;
  retryPending: boolean;
  attemptsRemaining: number;
  failureReason?: string | null;
}) {
  const isActive = state === "current";
  const isDone = state === "done";
  const isFailed = state === "failed";
  const canRetry = attemptsRemaining > 0;

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

      {isActive && !isFailed && (
        <div
          className="border-t border-border/60 p-5 pt-4"
          style={{
            animation: "slideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1) both",
          }}
        >
          {(diditLabel === KycSessionStepEnum.IN_PROGRESS ||
            diditLabel === KycSessionStepEnum.IN_REVIEW ||
            diditLabel === KycSessionStepEnum.RESUBMITTED) && (
            <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 p-3.5">
              <Clock className="mt-px h-4 w-4 shrink-0 text-amber-600" />
              <p className="text-xs text-amber-800">
                {diditLabel === KycSessionStepEnum.IN_REVIEW
                  ? "Your verification is under manual review. You can wait or retry for a faster result."
                  : "We're confirming your verification, ensure you've completed the procedure."}
              </p>
            </div>
          )}

          {diditLabel === KycSessionStepEnum.IN_REVIEW ? (
            <div className="flex w-full flex-col gap-2 sm:flex-row">
              {showContinue ? (
                <button
                  type="button"
                  onClick={onContinue}
                  disabled={isPending}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-4 text-[15px] font-bold text-white shadow-[0_4px_14px_0_rgba(3,3,77,0.2)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-primary/95 hover:shadow-[0_6px_20px_rgba(3,3,77,0.23)] active:translate-y-0 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                >
                  <ArrowRight className="h-5 w-5" />
                  Continue Verification
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onRefresh}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl border border-primary px-5 py-4 text-[15px] font-bold text-primary transition-all duration-300 ease-out hover:bg-primary/5 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
                >
                  <RefreshCw className="h-5 w-5" />
                  Refresh Status
                </button>
              )}

              {canRetry && (
                <button
                  type="button"
                  onClick={onRetry}
                  disabled={retryPending}
                  className={`flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-4 text-[15px] font-bold transition-all duration-300 ease-out active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 ${
                    showContinue
                      ? "border border-primary text-primary hover:bg-primary/5"
                      : "bg-primary text-white shadow-[0_4px_14px_0_rgba(3,3,77,0.2)] hover:-translate-y-0.5 hover:bg-primary/95 hover:shadow-[0_6px_20px_rgba(3,3,77,0.23)] disabled:shadow-none"
                  }`}
                >
                  {retryPending ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Retrying…
                    </>
                  ) : (
                    <>
                      <RotateCcw className="h-5 w-5" />
                      Retry Verification
                    </>
                  )}
                </button>
              )}
            </div>
          ) : showContinue ? (
            <button
              type="button"
              onClick={onContinue}
              disabled={isPending}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-4 text-[15px] font-bold text-white shadow-[0_4px_14px_0_rgba(3,3,77,0.2)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-primary/95 hover:shadow-[0_6px_20px_rgba(3,3,77,0.23)] active:translate-y-0 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            >
              <ArrowRight className="h-5 w-5" />
              Continue Verification
            </button>
          ) : (
            canStart &&
            diditLabel !== KycSessionStepEnum.IN_PROGRESS &&
            diditLabel !== KycSessionStepEnum.RESUBMITTED && (
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

          <p className="mt-3 text-xs font-medium text-grey2">
            Attempts left:{" "}
            <span className="font-semibold">{attemptsRemaining}</span>
          </p>
        </div>
      )}

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
                {failureReason ?? "Please retry your verification."}
              </p>
              <p className="text-xs text-red/70">
                Attempts left: {attemptsRemaining}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {canRetry && (
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
          </div>
        </div>
      )}
    </div>
  );
}
