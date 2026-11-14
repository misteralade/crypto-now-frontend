import { Check } from "lucide-react";
import type { TransactionStatus } from "../../types/request.payload.types";

const TRADE_DIRECTION = { BUY: "buy", SELL: "sell" } as const;
const PROGRESS = { DONE: "done", ACTIVE: "active", PENDING: "pending" } as const;

const STATUS = {
  INITIATED: "INITIATED", AWAITING_PAYMENT: "AWAITING_PAYMENT", IN_REVIEW: "IN_REVIEW",
  AWAITING_CRYPTO: "AWAITING_CRYPTO", DEPOSIT_DETECTED: "DEPOSIT_DETECTED",
  PENDING_CONFIRMATION: "PENDING_CONFIRMATION", DEPOSIT_PENDING_MINIMUM: "DEPOSIT_PENDING_MINIMUM",
  DEPOSIT_CONFIRMED: "DEPOSIT_CONFIRMED", PAYOUT_INITIATED: "PAYOUT_INITIATED",
  PENDING_PAYOUT: "PENDING_PAYOUT", PAYOUT_FAILED: "PAYOUT_FAILED", PROCESSING: "PROCESSING",
  COMPLETED: "COMPLETED",
} as const;

const STEPS = {
  buy: [
    { label: "Receipt submitted", events: [STATUS.IN_REVIEW] },
    { label: "Payment under review", events: [STATUS.IN_REVIEW] },
    { label: "Sending crypto", events: [] },
    { label: "Transaction complete", events: [STATUS.COMPLETED] },
  ],
  sell: [
    { label: "Monitoring wallet", events: [STATUS.INITIATED, STATUS.AWAITING_CRYPTO] },
    { label: "Crypto detected", events: [STATUS.DEPOSIT_DETECTED, STATUS.PENDING_CONFIRMATION, STATUS.DEPOSIT_PENDING_MINIMUM, STATUS.DEPOSIT_CONFIRMED] },
    { label: "Deposit confirmed", events: [STATUS.DEPOSIT_CONFIRMED] },
    { label: "Bank transfer complete", events: [STATUS.COMPLETED] },
  ],
} as const;

const SELL_DETECTED: readonly string[] = [STATUS.DEPOSIT_DETECTED, STATUS.PENDING_CONFIRMATION, STATUS.DEPOSIT_PENDING_MINIMUM, STATUS.DEPOSIT_CONFIRMED, STATUS.PAYOUT_INITIATED, STATUS.PENDING_PAYOUT, STATUS.PAYOUT_FAILED, STATUS.PROCESSING, STATUS.COMPLETED];
const SELL_CONFIRMED: readonly string[] = [STATUS.DEPOSIT_CONFIRMED, STATUS.PAYOUT_INITIATED, STATUS.PENDING_PAYOUT, STATUS.PAYOUT_FAILED, STATUS.PROCESSING, STATUS.COMPLETED];
const SELL_PAYOUT_ACTIVE: readonly string[] = [STATUS.DEPOSIT_CONFIRMED, STATUS.PAYOUT_INITIATED, STATUS.PENDING_PAYOUT, STATUS.PROCESSING];

export function TransactionTimeline({ type, status, statusEvents }: {
  type: "buy" | "sell";
  status?: TransactionStatus | string;
  statusEvents?: Array<{ status: TransactionStatus | string; createdAt: string }>;
}) {
  const steps = STEPS[type];
  const hasEvent = (statuses: readonly string[]) => statusEvents?.some((event) => statuses.includes(event.status)) ?? false;
  const hasReceipt = status === STATUS.IN_REVIEW || status === STATUS.COMPLETED || hasEvent([STATUS.IN_REVIEW]);
  const detected = !!status && SELL_DETECTED.includes(status) || hasEvent(STEPS.sell[1].events);
  const confirmed = !!status && SELL_CONFIRMED.includes(status) || hasEvent(STEPS.sell[2].events);
  const states = type === TRADE_DIRECTION.BUY
    ? [hasReceipt ? PROGRESS.DONE : PROGRESS.PENDING, status === STATUS.COMPLETED ? PROGRESS.DONE : status === STATUS.IN_REVIEW ? PROGRESS.ACTIVE : PROGRESS.PENDING, status === STATUS.COMPLETED ? PROGRESS.DONE : PROGRESS.PENDING, status === STATUS.COMPLETED ? PROGRESS.DONE : PROGRESS.PENDING]
    : [PROGRESS.DONE, detected ? PROGRESS.DONE : status === STATUS.INITIATED || status === STATUS.AWAITING_CRYPTO || !status ? PROGRESS.ACTIVE : PROGRESS.PENDING, confirmed ? PROGRESS.DONE : detected ? PROGRESS.ACTIVE : PROGRESS.PENDING, status === STATUS.COMPLETED ? PROGRESS.DONE : status && SELL_PAYOUT_ACTIVE.includes(status) ? PROGRESS.ACTIVE : PROGRESS.PENDING];
  const colors = {
    done: { bg: "#E8F8F0", border: "#03784733", dot: "#037847", text: "#037847" },
    active: { bg: "#FFFBF0", border: "#FFE4A033", dot: "#F7A600", text: "#A07000" },
    pending: { bg: "#FAFAFA", border: "#EEEEEE", dot: "#BDBDBD", text: "#6B6E6B" },
  } as const;

  return (
    <ol className="flex flex-col w-full" aria-label="Transaction progress">
      {steps.map((step, index) => {
        const state = states[index] as keyof typeof colors;
        const color = colors[state];
        const event = statusEvents?.find((item) => (step.events as readonly string[]).includes(item.status));
        return (
          <li key={step.label} className="relative flex items-center gap-3 py-2">
            {index < steps.length - 1 && <span className="absolute left-[17px] top-11 bottom-[-8px] w-px bg-[#E5E3F0]" aria-hidden="true" />}
            <div className="relative z-10 w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: state === PROGRESS.PENDING ? "#EEEEEE" : color.dot }}>
              {state === PROGRESS.DONE ? <Check size={13} color="white" /> : state === PROGRESS.ACTIVE ? <span className="w-2 h-2 rounded-full bg-white" /> : <span className="text-[11px] font-bold text-gray-500">{index + 1}</span>}
            </div>
            <div className="min-w-0 flex-1 flex items-center justify-between gap-2 rounded-xl px-3 py-3" style={{ background: color.bg, border: `1px solid ${color.border}` }}>
              <span className="text-xs font-semibold" style={{ color: color.text }}>{step.label}</span>
              <span className="sr-only">{state}</span>
              {event && <time className="text-[10px] text-gray-500 shrink-0" dateTime={event.createdAt}>{new Date(event.createdAt).toLocaleString(undefined, { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</time>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
