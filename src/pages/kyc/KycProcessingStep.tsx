import { useEffect, useState } from "react";
import { CheckCircle, Loader2 } from "lucide-react";
import { useKycLongPoll } from "../../hooks/useKycLongPoll.ts";
import { kycServiceApi } from "../../api/kyc.api.ts";
import type {
  KycSessionResponse,
  KycStatusResponse,
} from "../../types/kyc.types.ts";

interface KycProcessingStepProps {
  session: KycSessionResponse;
  onComplete: (status: KycStatusResponse) => void;
}

const PROCESSING_STEPS: KycSessionResponse["currentStep"][] = [
  "In Progress",
  "submitted",
  "Resubmitted",
];

const FINAL_STEPS: KycSessionResponse["currentStep"][] = [
  "Approved",
  "Declined",
  "Expired",
  "Abandoned",
];

const CHECKLIST = [
  { key: "submitted", label: "Submitted to Didit" },
  { key: "verifying", label: "Verification in progress" },
  { key: "decision", label: "Awaiting decision" },
];

export default function KycProcessingStep({
  session,
  onComplete,
}: KycProcessingStepProps) {
  const [fallbackPolling, setFallbackPolling] = useState(false);

  // Long-poll until status changes from in-progress steps
  const { isPolling } = useKycLongPoll({
    enabled: true,
    onStatusChange: (status) => {
      if (!PROCESSING_STEPS.includes(status.currentStep)) {
        onComplete(status);
      }
    },
    onError: () => {
      setFallbackPolling(true);
    },
  });

  // Fallback: regular polling every 3s when stream fails 3× consecutively
  useEffect(() => {
    if (!fallbackPolling) return;

    const interval = setInterval(async () => {
      try {
        const { data, success } = await kycServiceApi.getStatus();
        if (success && data && !PROCESSING_STEPS.includes(data.currentStep)) {
          clearInterval(interval);
          onComplete(data);
        }
      } catch {
        // ignore transient errors
      }
    }, 3_000);

    return () => clearInterval(interval);
  }, [fallbackPolling, onComplete]);

  const completedKeys = new Set<string>(
    [
      session.currentStep !== "Not Started" ? "submitted" : null,
      PROCESSING_STEPS.includes(session.currentStep) ||
      session.currentStep === "In Review"
        ? "verifying"
        : null,
      FINAL_STEPS.includes(session.currentStep) ? "decision" : null,
    ].filter(Boolean) as string[],
  );

  return (
    <div className="space-y-8 py-4">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#03034D]/10 mx-auto">
          <Loader2 className="w-8 h-8 text-[#03034D] animate-spin" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Verifying your identity…
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Do not close this page — your progress is saved if you do.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {CHECKLIST.map((item) => {
          const isDone = completedKeys.has(item.key);
          const isActive =
            item.key === "verifying" && (isPolling || fallbackPolling);

          return (
            <div key={item.key} className="flex items-center gap-3">
              <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                {isDone ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : isActive ? (
                  <Loader2 className="w-5 h-5 text-[#03034D] animate-spin" />
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                )}
              </div>
              <span
                className={`text-sm ${isDone ? "text-gray-900 font-medium" : isActive ? "text-[#03034D] font-medium" : "text-gray-400"}`}
              >
                {item.label}
              </span>
            </div>
          );
        })}
      </div>

      <p className="text-center text-xs text-gray-400">
        Typically completes within 30 seconds. If it takes longer, we'll notify
        you by email.
      </p>
    </div>
  );
}
