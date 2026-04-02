import { CheckCircle, XCircle, Clock, Loader2, RefreshCw } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { ROUTES } from "../../util/constants.util.ts";
import type { KycSessionStep } from "../../types/kyc.types.ts";

interface KycResultStepProps {
  currentStep: KycSessionStep;
  failureReason: string | null;
  retryCount: number;
  maxRetries: number;
  onRetry: () => void;
  onRestart: () => void;
  isRetryPending: boolean;
  isRestartPending: boolean;
}

export default function KycResultStep({
  currentStep,
  failureReason,
  retryCount,
  maxRetries,
  onRetry,
  onRestart,
  isRetryPending,
  isRestartPending,
}: KycResultStepProps) {
  const navigate = useNavigate();
  const canRetry = retryCount < maxRetries;

  if (currentStep === "verified") {
    return (
      <div className="space-y-6 text-center py-4">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mx-auto">
          <CheckCircle className="w-10 h-10 text-green-500" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Verification Complete!</h2>
          <p className="mt-2 text-sm text-gray-500">
            Your identity has been verified. You can now access all platform features.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate({ to: ROUTES.DASHBOARD })}
          className="w-full py-3 px-6 rounded-xl bg-[#03034D] text-white font-medium text-sm hover:bg-[#03034D]/90 transition-colors"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  if (currentStep === "failed") {
    return (
      <div className="space-y-6 py-4">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 mx-auto">
            <XCircle className="w-10 h-10 text-red-500" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Verification Failed</h2>
            {failureReason && (
              <p className="mt-2 text-sm text-gray-500">{failureReason}</p>
            )}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-1 text-sm">
          <p className="text-gray-600">
            Retries used: <span className="font-semibold text-gray-900">{retryCount} / {maxRetries}</span>
          </p>
          {!canRetry && (
            <p className="text-red-600 text-xs">
              Maximum retries reached. Your case has been escalated for manual review.
            </p>
          )}
        </div>

        <div className="space-y-3">
          {canRetry && (
            <button
              type="button"
              onClick={onRetry}
              disabled={isRetryPending}
              className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-[#03034D] text-white font-medium text-sm disabled:opacity-50 hover:bg-[#03034D]/90 transition-colors"
            >
              {isRetryPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <><RefreshCw className="w-4 h-4" /> Retry Verification</>
              )}
            </button>
          )}

          <button
            type="button"
            onClick={onRestart}
            disabled={isRestartPending}
            className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl border border-gray-300 text-gray-700 font-medium text-sm disabled:opacity-50 hover:bg-gray-50 transition-colors"
          >
            {isRestartPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Start Over"
            )}
          </button>
        </div>
      </div>
    );
  }

  // Pending review state
  return (
    <div className="space-y-6 text-center py-4">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-amber-100 mx-auto">
        <Clock className="w-10 h-10 text-amber-500" />
      </div>
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Under Manual Review</h2>
        <p className="mt-2 text-sm text-gray-500">
          Your case has been escalated to our compliance team for manual review.
          You'll receive an email notification with the outcome.
        </p>
      </div>
      <button
        type="button"
        onClick={() => navigate({ to: ROUTES.DASHBOARD })}
        className="w-full py-3 px-6 rounded-xl border border-gray-300 text-gray-700 font-medium text-sm hover:bg-gray-50 transition-colors"
      >
        Back to Home
      </button>
    </div>
  );
}
