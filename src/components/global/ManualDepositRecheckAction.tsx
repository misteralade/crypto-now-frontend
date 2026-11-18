type ManualDepositRecheckActionProps = {
  title: string;
  buttonText?: string;
  pendingText?: string;
  disabled?: boolean;
  isPending?: boolean;
  onConfirm: () => void;
};

export default function ManualDepositRecheckAction({
  title,
  buttonText = "I've Sent Already",
  pendingText = "Checking wallet...",
  disabled = false,
  isPending = false,
  onConfirm,
}: ManualDepositRecheckActionProps) {
  return (
    <div className="rounded-2xl px-4 py-3.5 flex flex-col gap-3" style={{ background: "#F9FAFB", border: "1px solid #ECECEC" }}>
      <p className="text-sm font-bold" style={{ color: "#0E0F0C" }}>{title}</p>
      <button type="button" onClick={onConfirm} disabled={disabled || isPending}
        className="w-full rounded-2xl px-4 py-3 text-sm font-bold transition-opacity disabled:opacity-60"
        style={{ background: "#0E0F0C", color: "#FFFFFF" }}>
        {isPending ? pendingText : buttonText}
      </button>
    </div>
  );
}
