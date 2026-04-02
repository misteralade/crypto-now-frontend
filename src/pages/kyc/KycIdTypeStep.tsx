import { useState } from "react";
import { CreditCard, Car, BookOpen, ChevronRight, Loader2 } from "lucide-react";
import type { KycIdType } from "../../types/kyc.types.ts";

interface KycIdTypeStepProps {
  onSelect: (idType: KycIdType) => void;
  isPending: boolean;
}

const ID_OPTIONS: { value: KycIdType; label: string; description: string; icon: React.ReactNode }[] = [
  {
    value: "national_id",
    label: "National ID",
    description: "Nigerian National Identity Card (NIN card)",
    icon: <CreditCard className="w-6 h-6" />,
  },
  {
    value: "drivers_license",
    label: "Driver's Licence",
    description: "Valid Nigerian Driver's Licence",
    icon: <Car className="w-6 h-6" />,
  },
  {
    value: "passport",
    label: "International Passport",
    description: "Nigerian International Passport (biodata page)",
    icon: <BookOpen className="w-6 h-6" />,
  },
];

export default function KycIdTypeStep({ onSelect, isPending }: KycIdTypeStepProps) {
  const [selected, setSelected] = useState<KycIdType | null>(null);

  function handleContinue() {
    if (selected) onSelect(selected);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Select ID Type</h2>
        <p className="mt-1 text-sm text-gray-500">
          Choose the government-issued ID you'll be using for verification.
        </p>
      </div>

      <div className="space-y-3">
        {ID_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => setSelected(option.value)}
            className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all ${
              selected === option.value
                ? "border-[#03034D] bg-[#03034D]/5"
                : "border-gray-200 hover:border-gray-300 bg-white"
            }`}
          >
            <div
              className={`flex-shrink-0 p-2 rounded-lg ${
                selected === option.value ? "bg-[#03034D] text-white" : "bg-gray-100 text-gray-600"
              }`}
            >
              {option.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`font-medium text-sm ${selected === option.value ? "text-[#03034D]" : "text-gray-900"}`}>
                {option.label}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">{option.description}</p>
            </div>
            <div
              className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                selected === option.value ? "border-[#03034D] bg-[#03034D]" : "border-gray-300"
              }`}
            >
              {selected === option.value && <div className="w-2 h-2 rounded-full bg-white" />}
            </div>
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={handleContinue}
        disabled={!selected || isPending}
        className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-[#03034D] text-white font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#03034D]/90 transition-colors"
      >
        {isPending ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <>
            Continue <ChevronRight className="w-4 h-4" />
          </>
        )}
      </button>
    </div>
  );
}
