import { CheckCircle, Loader2 } from "lucide-react";
import type { KycSessionResponse } from "../../types/kyc.types.ts";

const ID_TYPE_LABELS: Record<string, string> = {
  national_id: "National ID",
  drivers_license: "Driver's Licence",
  passport: "International Passport",
};

interface KycReviewStepProps {
  session: KycSessionResponse;
  onSubmit: () => void;
  isPending: boolean;
}

export default function KycReviewStep({
  session,
  onSubmit,
  isPending,
}: KycReviewStepProps) {
  const steps = [
    { label: "NIN Verified", done: session.ninStatus === "verified" },
    { label: "Didit session created", done: Boolean(session.diditSessionId) },
    { label: "Submitted to Didit", done: session.hasSubmitted },
  ];

  const allReady = steps.every((s) => s.done);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Review & Submit</h2>
        <p className="mt-1 text-sm text-gray-500">
          Review your submission before sending it to Didit for verification.
        </p>
      </div>

      <div className="rounded-xl border border-gray-200 divide-y divide-gray-100 overflow-hidden">
        <div className="px-4 py-3 bg-gray-50">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Submission Summary
          </p>
        </div>
        {session.selectedIdType && (
          <div className="px-4 py-3 flex items-center justify-between text-sm">
            <span className="text-gray-600">ID Type</span>
            <span className="font-medium text-gray-900">
              {ID_TYPE_LABELS[session.selectedIdType]}
            </span>
          </div>
        )}
        {steps.map((step) => (
          <div
            key={step.label}
            className="px-4 py-3 flex items-center justify-between text-sm"
          >
            <span className="text-gray-600">{step.label}</span>
            <span
              className={`flex items-center gap-1 font-medium ${step.done ? "text-green-600" : "text-red-500"}`}
            >
              {step.done ? (
                <>
                  <CheckCircle className="w-4 h-4" /> Done
                </>
              ) : (
                "Missing"
              )}
            </span>
          </div>
        ))}
      </div>

      {!allReady && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
          Please complete all required steps before submitting.
        </div>
      )}

      <div className="p-3 rounded-lg bg-blue-50 border border-blue-100 text-xs text-blue-700">
        By submitting, you consent to Didit processing your identity documents
        and selfie for verification. Results are typically returned within 30
        seconds.
      </div>

      <button
        type="button"
        onClick={onSubmit}
        disabled={!allReady || isPending}
        className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-[#03034D] text-white font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#03034D]/90 transition-colors"
      >
        {isPending ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" /> Submitting…
          </>
        ) : (
          "Submit for Verification"
        )}
      </button>
    </div>
  );
}
