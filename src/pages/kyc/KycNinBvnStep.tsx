import { useDispatch, useSelector } from "react-redux";
import { Info, Loader2 } from "lucide-react";
import type { RootState } from "../../store.ts";
import { setNinBvnType, setNinBvnValue } from "../../redux/kyc.slice.ts";
import type { KycNinBvnType } from "../../types/kyc.types.ts";

interface KycNinBvnStepProps {
  onSave: (ninBvnType: KycNinBvnType, value?: string | null) => void;
  isPending: boolean;
}

const TYPE_OPTIONS: { value: KycNinBvnType; label: string; placeholder: string; length: number }[] = [
  { value: "nin", label: "NIN (National Identity Number)", placeholder: "Enter your 11-digit NIN", length: 11 },
  { value: "bvn", label: "BVN (Bank Verification Number)", placeholder: "Enter your 11-digit BVN", length: 11 },
  { value: "none", label: "Skip for now", placeholder: "", length: 0 },
];

export default function KycNinBvnStep({ onSave, isPending }: KycNinBvnStepProps) {
  const dispatch = useDispatch();
  const { type, value } = useSelector((s: RootState) => s.kyc.ninBvn);

  const selectedOption = TYPE_OPTIONS.find((o) => o.value === type);
  const isSkipping = type === "none";
  const isValid = isSkipping || (value.length === (selectedOption?.length ?? 0));

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave(type, isSkipping ? null : value);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">NIN / BVN</h2>
        <p className="mt-1 text-sm text-gray-500">
          Provide your NIN or BVN to complete identity verification. This is optional in Phase 1.
        </p>
      </div>

      <div className="space-y-3">
        {TYPE_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => {
              dispatch(setNinBvnType(option.value));
              dispatch(setNinBvnValue(""));
            }}
            className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all ${
              type === option.value
                ? "border-[#03034D] bg-[#03034D]/5"
                : "border-gray-200 hover:border-gray-300 bg-white"
            }`}
          >
            <div
              className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                type === option.value ? "border-[#03034D] bg-[#03034D]" : "border-gray-300"
              }`}
            >
              {type === option.value && <div className="w-2 h-2 rounded-full bg-white" />}
            </div>
            <span className={`text-sm font-medium ${type === option.value ? "text-[#03034D]" : "text-gray-700"}`}>
              {option.label}
            </span>
          </button>
        ))}
      </div>

      {!isSkipping && selectedOption && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            {type === "nin" ? "National Identity Number" : "Bank Verification Number"}
          </label>
          <input
            type="text"
            inputMode="numeric"
            maxLength={selectedOption.length}
            value={value}
            onChange={(e) => dispatch(setNinBvnValue(e.target.value.replace(/\D/g, "")))}
            placeholder={selectedOption.placeholder}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#03034D]/20 focus:border-[#03034D] transition"
          />
          <p className="text-xs text-gray-400">{value.length} / {selectedOption.length} digits</p>
        </div>
      )}

      <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-700">
        <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
        <p>
          Your NIN/BVN is encrypted and stored securely. Full verification against government databases will
          be enabled in a future update.
        </p>
      </div>

      <button
        type="submit"
        disabled={!isValid || isPending}
        className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-[#03034D] text-white font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#03034D]/90 transition-colors"
      >
        {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Continue"}
      </button>
    </form>
  );
}
