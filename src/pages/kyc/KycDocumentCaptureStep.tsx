import { useRef, useState } from "react";
import { Camera, Upload, RefreshCw, CheckCircle, Loader2, AlertCircle } from "lucide-react";
import type { KycIdType } from "../../types/kyc.types.ts";

interface KycDocumentCaptureStepProps {
  side: "front" | "back";
  idType: KycIdType;
  onCapture: (file: File) => void;
  isPending: boolean;
}

const SIDE_LABELS: Record<"front" | "back", string> = {
  front: "Front Side",
  back: "Back Side",
};

const ID_LABELS: Record<KycIdType, string> = {
  national_id: "National ID",
  drivers_license: "Driver's Licence",
  passport: "Passport (biodata page)",
};

const MAX_FILE_SIZE_MB = 10;
const ACCEPTED_MIME_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export default function KycDocumentCaptureStep({
  side,
  idType,
  onCapture,
  isPending,
}: KycDocumentCaptureStepProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [capturedFile, setCapturedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    if (!ACCEPTED_MIME_TYPES.includes(file.type)) {
      setError("Only JPEG, PNG, or WebP images are accepted.");
      return;
    }

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setError(`File must be under ${MAX_FILE_SIZE_MB}MB.`);
      return;
    }

    const url = URL.createObjectURL(file);
    setPreview(url);
    setCapturedFile(file);
  }

  function handleRetake() {
    setPreview(null);
    setCapturedFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function handleConfirm() {
    if (capturedFile) onCapture(capturedFile);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">
          {ID_LABELS[idType]} — {SIDE_LABELS[side]}
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          {side === "front"
            ? "Take a clear photo of the front of your document. Ensure all text is readable."
            : "Take a clear photo of the back of your document."}
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {!preview ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="cursor-pointer border-2 border-dashed border-gray-300 rounded-xl p-10 flex flex-col items-center gap-4 hover:border-[#03034D] hover:bg-[#03034D]/5 transition-all"
        >
          <div className="p-4 rounded-full bg-gray-100">
            <Camera className="w-8 h-8 text-gray-500" />
          </div>
          <div className="text-center">
            <p className="font-medium text-gray-700 text-sm">Take a photo or upload an image</p>
            <p className="text-xs text-gray-400 mt-1">JPEG, PNG or WebP · Max 10MB</p>
          </div>
          <div className="flex items-center gap-2 py-2 px-4 rounded-lg bg-[#03034D] text-white text-sm font-medium">
            <Upload className="w-4 h-4" />
            Choose file
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
            <img
              src={preview}
              alt="Document preview"
              className="w-full h-56 object-contain"
            />
            <div className="absolute top-2 right-2 flex items-center gap-1 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
              <CheckCircle className="w-3 h-3" />
              Ready
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleRetake}
              disabled={isPending}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-gray-300 text-gray-700 font-medium text-sm hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Retake
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={isPending}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#03034D] text-white font-medium text-sm disabled:opacity-50 hover:bg-[#03034D]/90 transition-colors"
            >
              {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Upload"
              )}
            </button>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        capture="environment"
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="rounded-lg bg-blue-50 border border-blue-100 p-3 text-xs text-blue-700 space-y-1">
        <p className="font-medium">Tips for a good photo:</p>
        <ul className="space-y-0.5 list-disc list-inside text-blue-600">
          <li>Place document on a flat, dark surface</li>
          <li>Ensure good lighting — avoid glare</li>
          <li>All four corners must be visible</li>
          <li>Text must be sharp and readable</li>
        </ul>
      </div>
    </div>
  );
}
