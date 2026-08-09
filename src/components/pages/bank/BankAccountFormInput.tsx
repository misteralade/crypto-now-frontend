import { useState, type ChangeEvent, type FocusEvent } from "react";

// Input styled to match the bank-account form (floating label, boolean error flag).
// Distinct from components/global/CustomInput.tsx, which has a different prop shape
// and is already used elsewhere (SignUpPage, ChangeBankDetails).
const BankAccountFormInput = ({
  label,
  value,
  onChange,
  onBlur,
  type = "text",
  inputMode,
  error,
}: {
  label: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
  type?: string;
  inputMode?: string;
  error?: boolean;
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value && value.length > 0;

  return (
    <div className="relative">
      <input
        type={type}
        inputMode={inputMode as any}
        value={value}
        onChange={onChange}
        onBlur={(e) => {
          setIsFocused(false);
          onBlur?.(e);
        }}
        onFocus={() => setIsFocused(true)}
        className={`
          w-full h-14 px-4 pt-4 pb-2
          rounded-2xl
          border transition-all
          bg-white
          text-sm text-[#0E0F0C]
          placeholder-transparent
          focus:outline-none
          ${
            error
              ? "border-[#EB5757] ring-2 ring-[#EB5757]/10"
              : isFocused
                ? "border-[#03034D] ring-2 ring-[#03034D]/10"
                : "border-[#EEEEEE] hover:border-[#BDBDBD]"
          }
        `}
        placeholder={label}
      />
      <label
        className={`
          absolute left-4 transition-all pointer-events-none
          ${
            hasValue || isFocused
              ? "top-2 text-[10px] font-semibold"
              : "top-1/2 -translate-y-1/2 text-sm"
          }
          ${
            error
              ? "text-[#EB5757]"
              : isFocused
                ? "text-[#03034D]"
                : "text-[#9A9A9A]"
          }
        `}
      >
        {label}
      </label>
    </div>
  );
};

export default BankAccountFormInput;
