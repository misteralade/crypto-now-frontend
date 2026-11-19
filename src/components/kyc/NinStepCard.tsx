import { CheckCircle2, Loader2 } from "lucide-react";
import type { StepState } from "./kyc-step.types";
import { StepBadge } from "./StepBadge";

export function NinStepCard({
  state,
  nin,
  setNin,
  setNinTouched,
  ninError,
  firstName,
  setFirstName,
  firstNameTouched,
  setFirstNameTouched,
  firstNameError,
  isRetry,
  onSave,
  isPending,
  attemptsRemaining,
  isLocked,
  verifiedName,
}: {
  state: StepState;
  nin: string;
  setNin: (v: string) => void;
  setNinTouched: (v: boolean) => void;
  ninError: string;
  firstName: string;
  setFirstName: (v: string) => void;
  firstNameTouched: boolean;
  setFirstNameTouched: (v: boolean) => void;
  firstNameError: string;
  isRetry: boolean;
  onSave: () => void;
  isPending: boolean;
  attemptsRemaining: number;
  isLocked: boolean;
  verifiedName: string | null;
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
      <div className="flex items-start justify-between gap-3 p-5">
        <div className="flex items-start gap-3">
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

      {isActive && (
        <div
          className="border-t border-border/60 p-5 pt-4"
          style={{
            animation: "slideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1) both",
          }}
        >
          {verifiedName && (
            <div className="mb-4 flex items-center gap-2 rounded-xl border border-success/20 bg-bgSuccess px-3 py-2">
              <CheckCircle2 className="h-4 w-4 text-success" />
              <p className="text-xs font-semibold text-success">
                Verified name: {verifiedName}
              </p>
            </div>
          )}

          <label
            htmlFor="first-name-input"
            className="mb-2 block text-xs font-bold uppercase tracking-wider text-textSec transition-colors duration-200 focus-within:text-titleColor"
          >
            First Name
          </label>
          <div className="group relative">
            <div
              className={`absolute -inset-0.5 rounded-2xl opacity-0 blur backdrop-blur-sm transition-all duration-300 group-focus-within:opacity-100 ${
                firstNameError ? "bg-red/20" : "bg-primary/20"
              }`}
            />
            <input
              id="first-name-input"
              value={firstName}
              onBlur={() => setFirstNameTouched(true)}
              onChange={(e) => {
                setFirstName(e.target.value);
                if (!firstNameTouched) setFirstNameTouched(true);
              }}
              placeholder="Enter your first name"
              className={`relative w-full rounded-2xl border bg-white px-5 py-4 text-[15px] font-semibold text-titleColor placeholder:font-medium placeholder:text-placeholder/70 shadow-sm transition-all duration-300 focus:outline-none focus:ring-0 disabled:opacity-50 ${
                firstNameError
                  ? "border-red/40 focus:border-red"
                  : "border-border focus:border-primary/40 focus:shadow-[0_4px_20px_-4px_rgba(3,3,77,0.1)]"
              }`}
              disabled={isPending || isLocked}
              aria-invalid={Boolean(firstNameError)}
              aria-describedby={firstNameError ? "first-name-error" : undefined}
            />
          </div>
          {firstNameError && (
            <p
              id="first-name-error"
              className="mt-2 text-xs font-semibold text-red"
              role="alert"
            >
              {firstNameError}
            </p>
          )}

          <label
            htmlFor="nin-input"
            className="mb-2 mt-5 block text-xs font-bold uppercase tracking-wider text-textSec transition-colors duration-200 focus-within:text-titleColor"
          >
            NIN Number
          </label>
          <div className="group relative">
            <div
              className={`absolute -inset-0.5 rounded-2xl opacity-0 blur backdrop-blur-sm transition-all duration-300 group-focus-within:opacity-100 ${
                ninError ? "bg-red/20" : "bg-primary/20"
              }`}
            />
            <input
              id="nin-input"
              value={nin}
              onBlur={() => setNinTouched(true)}
              onChange={(e) => {
                setNin(e.target.value.replace(/\D/g, ""));
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
              disabled={isPending || isLocked}
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
          <p className="mt-2 text-xs font-medium text-grey2">
            Attempts left:{" "}
            <span className="font-semibold">{attemptsRemaining}</span>
          </p>

          <button
            type="button"
            onClick={onSave}
            disabled={
              isLocked || isPending || nin.length !== 11 || !firstName.trim()
            }
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-4 text-[15px] font-bold text-white shadow-[0_4px_14px_0_rgba(3,3,77,0.2)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-primary/95 hover:shadow-[0_6px_20px_rgba(3,3,77,0.23)] active:translate-y-0 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          >
            {isPending ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Verifying NIN…
              </>
            ) : isLocked ? (
              "NIN verification locked"
            ) : (
              <>
                <img
                  width="20"
                  height="20"
                  src="/decorations/fingerprint.png"
                  alt="fingerprint"
                />
                {isRetry ? "Retry NIN verification" : "Verify NIN"}
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
