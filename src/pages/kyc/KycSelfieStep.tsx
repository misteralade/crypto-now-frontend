import { useRef, useState, useCallback, useEffect } from "react";
import { Camera, RefreshCw, Loader2, AlertCircle, User } from "lucide-react";

interface KycSelfieStepProps {
  onCapture: (file: File) => void;
  isPending: boolean;
}

type CaptureMode = "camera" | "preview";

export default function KycSelfieStep({ onCapture, isPending }: KycSelfieStepProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [mode, setMode] = useState<CaptureMode>("camera");
  const [preview, setPreview] = useState<string | null>(null);
  const [capturedFile, setCapturedFile] = useState<File | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [cameraReady, setCameraReady] = useState(false);

  const startCamera = useCallback(async () => {
    setCameraError(null);
    setCameraReady(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => setCameraReady(true);
      }
    } catch {
      setCameraError("Camera access denied. Please allow camera access or upload a photo.");
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setCameraReady(false);
  }, []);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [startCamera, stopCamera]);

  function handleCapture() {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);
    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const file = new File([blob], "selfie.jpg", { type: "image/jpeg" });
        const url = URL.createObjectURL(blob);
        setPreview(url);
        setCapturedFile(file);
        setMode("preview");
        stopCamera();
      },
      "image/jpeg",
      0.9,
    );
  }

  function handleRetake() {
    setPreview(null);
    setCapturedFile(null);
    setMode("camera");
    startCamera();
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    setCapturedFile(file);
    setMode("preview");
    stopCamera();
  }

  function handleConfirm() {
    if (capturedFile) onCapture(capturedFile);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Selfie Verification</h2>
        <p className="mt-1 text-sm text-gray-500">
          Take a clear selfie. Your face will be matched against your ID document.
        </p>
      </div>

      {mode === "camera" && (
        <div className="space-y-4">
          <div className="relative rounded-xl overflow-hidden bg-gray-900 aspect-[4/3]">
            {!cameraReady && !cameraError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-white">
                <Loader2 className="w-6 h-6 animate-spin" />
                <p className="text-sm">Starting camera…</p>
              </div>
            )}

            {cameraError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6">
                <AlertCircle className="w-8 h-8 text-red-400" />
                <p className="text-sm text-gray-300 text-center">{cameraError}</p>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="py-2 px-4 rounded-lg bg-white text-gray-900 text-sm font-medium hover:bg-gray-100 transition-colors"
                >
                  Upload photo instead
                </button>
              </div>
            )}

            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover ${cameraReady ? "opacity-100" : "opacity-0"}`}
            />

            {/* Face outline guide */}
            {cameraReady && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-40 h-52 border-2 border-white/60 rounded-full opacity-50" />
              </div>
            )}
          </div>

          <canvas ref={canvasRef} className="hidden" />

          <div className="flex gap-3">
            {cameraError ? (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[#03034D] text-white font-medium text-sm"
              >
                <User className="w-4 h-4" />
                Upload photo
              </button>
            ) : (
              <button
                type="button"
                onClick={handleCapture}
                disabled={!cameraReady}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[#03034D] text-white font-medium text-sm disabled:opacity-50 hover:bg-[#03034D]/90 transition-colors"
              >
                <Camera className="w-4 h-4" />
                Take photo
              </button>
            )}
          </div>
        </div>
      )}

      {mode === "preview" && preview && (
        <div className="space-y-4">
          <div className="relative rounded-xl overflow-hidden bg-gray-100 aspect-[4/3]">
            <img src={preview} alt="Selfie preview" className="w-full h-full object-cover" />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleRetake}
              disabled={isPending}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-300 text-gray-700 font-medium text-sm hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Retake
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={isPending}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[#03034D] text-white font-medium text-sm disabled:opacity-50 hover:bg-[#03034D]/90 transition-colors"
            >
              {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Use this photo"}
            </button>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        className="hidden"
        onChange={handleFileUpload}
      />

      <div className="rounded-lg bg-blue-50 border border-blue-100 p-3 text-xs text-blue-700 space-y-1">
        <p className="font-medium">Tips for a good selfie:</p>
        <ul className="space-y-0.5 list-disc list-inside text-blue-600">
          <li>Face the camera directly in good lighting</li>
          <li>Remove glasses and hats</li>
          <li>Keep a neutral expression</li>
          <li>Your full face must be visible</li>
        </ul>
      </div>
    </div>
  );
}
