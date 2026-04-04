import { useState } from "react";
import { Info, Loader2 } from "lucide-react";

interface KycNinBvnStepProps {
  onSave: (nin: string, firstName: string) => void;
  isPending: boolean;
}

export default function KycNinBvnStep({
  onSave,
  isPending,
}: KycNinBvnStepProps) {
  const [nin, setNin] = useState("");
  const [firstName, setFirstName] = useState("");
  const [ninTouched, setNinTouched] = useState(false);
  const [firstNameTouched, setFirstNameTouched] = useState(false);

  const ninError =
    ninTouched && nin.length > 0 && nin.length !== 11
      ? "NIN must be exactly 11 digits."
      : "";
  const firstNameError =
    firstNameTouched && !firstName.trim() ? "First name is required." : "";

  const canSubmit =
    nin.length === 11 && Boolean(firstName.trim()) && !isPending;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setNinTouched(true);
    setFirstNameTouched(true);
    if (!canSubmit) return;
    onSave(nin, firstName.trim());
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">
          NIN Verification
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Enter your first name and NIN to verify you own this identity.
        </p>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          First Name
        </label>
        <input
          type="text"
          value={firstName}
          onBlur={() => setFirstNameTouched(true)}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="Enter your first name"
          className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#03034D]/20 focus:border-[#03034D] transition"
        />
        {firstNameError && (
          <p className="text-xs text-red-600">{firstNameError}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          National Identity Number (NIN)
        </label>
        <input
          type="text"
          inputMode="numeric"
          maxLength={11}
          value={nin}
          onBlur={() => setNinTouched(true)}
          onChange={(e) => setNin(e.target.value.replace(/\D/g, ""))}
          placeholder="Enter your 11-digit NIN"
          className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#03034D]/20 focus:border-[#03034D] transition"
        />
        <p className="text-xs text-gray-400">{nin.length} / 11 digits</p>
        {ninError && <p className="text-xs text-red-600">{ninError}</p>}
      </div>

      <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-700">
        <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
        <p>Your NIN is encrypted and stored securely.</p>
      </div>

      <button
        type="submit"
        disabled={!canSubmit}
        className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-[#03034D] text-white font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#03034D]/90 transition-colors"
      >
        {isPending ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          "Verify NIN"
        )}
      </button>
    </form>
  );
}
