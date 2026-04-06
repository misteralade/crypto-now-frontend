import { CheckCircle2 } from "lucide-react";
import type { StepState } from "./kyc-step.types";

export function StepBadge({
  state,
  label,
}: {
  state: StepState;
  label?: string;
}) {
  if (state === "done") {
    return <CheckCircle2 className="h-6 w-6 text-success" />;
  }

  const map: Record<Exclude<StepState, "done">, string> = {
    failed: "bg-bgFailed text-red border border-red/10",
    current: "bg-accentBg text-accent1 border border-accent1/10",
    pending: "bg-greyBg text-grey2 border border-border/50",
  };

  const text =
    label ??
    {
      failed: "Failed",
      current: "In Progress",
      pending: "Pending",
      done: "",
    }[state];

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide ${map[state]}`}
    >
      {text}
    </span>
  );
}
