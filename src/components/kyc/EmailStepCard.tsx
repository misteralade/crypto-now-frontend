import { Mail } from "lucide-react";
import type { StepState } from "./kyc-step.types";
import { StepBadge } from "./StepBadge";

export function EmailStepCard({ state }: { state: StepState }) {
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
              className={`h-4.5 w-4.5 ${
                isDone ? "text-success" : "text-titleColor"
              }`}
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
