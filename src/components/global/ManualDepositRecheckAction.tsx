import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

type ManualDepositRecheckActionProps = {
  title: string;
  description: string;
  buttonText?: string;
  pendingText?: string;
  confirmTitle?: string;
  confirmDescription?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  disabled?: boolean;
  isPending?: boolean;
  onConfirm: () => void;
};

const defaultButtonText = "I've Sent Already";

export default function ManualDepositRecheckAction({
  title,
  description,
  buttonText = defaultButtonText,
  pendingText = "Checking wallet...",
  confirmTitle = "Confirm deposit check",
  confirmDescription = "We will compare the live wallet balance against the cached wallet state before we update your transaction.",
  confirmLabel = "Confirm check",
  cancelLabel = "Cancel",
  disabled = false,
  isPending = false,
  onConfirm,
}: ManualDepositRecheckActionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const disabledState = disabled || isPending;

  const handleConfirm = () => {
    setIsOpen(false);
    onConfirm();
  };

  return (
    <div
      className="rounded-2xl px-4 py-3.5 flex flex-col gap-3"
      style={{ background: "#F9FAFB", border: "1px solid #ECECEC" }}
    >
      <div className="flex flex-col gap-1">
        <p className="text-sm font-bold" style={{ color: "#0E0F0C" }}>
          {title}
        </p>
        <p className="text-xs leading-relaxed" style={{ color: "#6B6E6B" }}>
          {description}
        </p>
      </div>

      <button
        type="button"
        onClick={() => setIsOpen(true)}
        disabled={disabledState}
        className="w-full rounded-2xl px-4 py-3 text-sm font-bold transition-opacity disabled:opacity-60"
        style={{ background: "#0E0F0C", color: "#FFFFFF" }}
      >
        {isPending ? pendingText : buttonText}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(14,15,12,0.55)" }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="manual-recheck-title"
          >
            <motion.div
              initial={{ scale: 0.96, y: 12 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, y: 12 }}
              transition={{ type: "spring", stiffness: 320, damping: 24 }}
              className="w-full max-w-md rounded-3xl bg-white p-5 shadow-2xl"
            >
              <h3
                id="manual-recheck-title"
                className="text-lg font-extrabold"
                style={{ color: "#0E0F0C" }}
              >
                {confirmTitle}
              </h3>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: "#6B6E6B" }}>
                {confirmDescription}
              </p>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="w-full rounded-2xl border px-4 py-3 text-sm font-bold"
                  style={{ borderColor: "#ECECEC", color: "#0E0F0C" }}
                >
                  {cancelLabel}
                </button>
                <button
                  type="button"
                  onClick={handleConfirm}
                  disabled={isPending}
                  className="w-full rounded-2xl px-4 py-3 text-sm font-bold text-white disabled:opacity-60"
                  style={{ background: "#0E0F0C" }}
                >
                  {isPending ? pendingText : confirmLabel}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
