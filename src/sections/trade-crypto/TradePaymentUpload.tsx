import { useState, useRef, useEffect } from "react";
import Upload from "../../assets/icons/upload.svg";
import Cancel from "../../assets/icons/hightlight_off.svg";
import { toast } from "react-toastify";

interface FileUploadProps {
  onFileSelected: (file: File) => void;
  onFileCleared: () => void;
  maxFiles: number;
  acceptedTypes?: string[];
}

const TradePaymentUpload = ({
  onFileSelected,
  onFileCleared,
  maxFiles = 5,
  acceptedTypes = [".jpg", ".jpeg", ".png", ".webp", ".gif"],
}: FileUploadProps) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string>("");
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (filePreviewUrl) URL.revokeObjectURL(filePreviewUrl);
    };
  }, [filePreviewUrl]);

  const handleFileUpload = (file: File) => {
    const MAX_FILE_SIZE = 2 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      toast.error("File size exceeds 2MB. Please upload a smaller image.");
      return;
    }

    if (filePreviewUrl) URL.revokeObjectURL(filePreviewUrl);
    const blobUrl = URL.createObjectURL(file);
    setUploadedFile(file);
    setFilePreviewUrl(blobUrl);
    onFileSelected(file);
  };

  const handleFileSelect = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;
    const MAX_FILE_SIZE = 2 * 1024 * 1024;

    const newFiles = Array.from(selectedFiles).filter((file) => {
      const extension = "." + file.name.split(".").pop()?.toLowerCase();
      if (!acceptedTypes.includes(extension)) return false;
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`${file.name} exceeds 2MB. Please upload a smaller image.`);
        return false;
      }
      return true;
    });

    if (newFiles.length === 0) return;
    handleFileUpload(newFiles.slice(0, maxFiles)[0]);
  };

  const removeFile = () => {
    if (filePreviewUrl) URL.revokeObjectURL(filePreviewUrl);
    setUploadedFile(null);
    setFilePreviewUrl("");
    onFileCleared();
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const replaceFile = () => fileInputRef.current?.click();

  const isImageFile = (fileName: string) => {
    const ext = "." + fileName.split(".").pop()?.toLowerCase();
    return [".jpg", ".jpeg", ".png", ".webp", ".gif"].includes(ext);
  };

  const previewImage = uploadedFile && isImageFile(uploadedFile.name) && filePreviewUrl
    ? filePreviewUrl
    : null;

  return (
    <div className="space-y-4">
      <div
        className={`relative border-2 border-dashed rounded-lg transition-all cursor-pointer overflow-hidden ${
          previewImage
            ? "border-transparent min-h-[300px] md:min-h-[400px]"
            : `py-5 text-center bg-white min-h-[300px] ${isDragOver ? "border-placeholder" : "border-accent2"}`
        }`}
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={(e) => { e.preventDefault(); setIsDragOver(false); }}
        onDrop={(e) => { e.preventDefault(); setIsDragOver(false); handleFileSelect(e.dataTransfer.files); }}
        onClick={() => fileInputRef.current?.click()}
      >
        {previewImage && (
          <>
            <img src={previewImage} alt="Receipt preview" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/20" />
          </>
        )}

        <div className="relative z-10 flex flex-col items-center justify-center min-h-[300px] md:min-h-[400px] p-5">
          <div className="flex flex-col items-center space-y-4">
            <img src={Upload || "/placeholder.svg"} alt="Upload icon" className={`w-12 h-12 ${previewImage ? "drop-shadow-lg" : ""}`} />
            <div className="space-y-2">
              <p className={`text-sm ${previewImage ? "text-white drop-shadow-lg font-medium" : ""}`}>
                Drag your file(s) to start uploading
              </p>
              <div className="flex items-center justify-between">
                <div className={`w-20 h-0.5 ${previewImage ? "bg-white/50" : "bg-strokeLightGrey"}`} />
                <p className={`text-sm ${previewImage ? "text-white drop-shadow-lg" : "text-textSec"}`}>OR</p>
                <div className={`w-20 h-0.5 ${previewImage ? "bg-white/50" : "bg-strokeLightGrey"}`} />
              </div>
            </div>
            <button
              type="button"
              className={`px-4 py-2 rounded-lg border font-semibold text-sm ${
                previewImage
                  ? "border-white/80 text-white hover:bg-white/20 bg-white/10 backdrop-blur-sm"
                  : "border-accent2 text-accent2"
              }`}
            >
              Browse files
            </button>
          </div>

          {previewImage && (
            <div className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-colors duration-200 flex items-center justify-center group">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center space-y-3">
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); replaceFile(); }}
                  className="px-6 py-3 bg-white/95 hover:bg-white text-gray-800 rounded-lg font-semibold text-sm shadow-lg"
                >
                  Replace Image
                </button>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); removeFile(); }}
                  className="p-2 bg-red-500/90 hover:bg-red-500 text-white rounded-full shadow-lg"
                >
                  <img src={Cancel || "/placeholder.svg"} alt="Remove" className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
        />
      </div>

      <p className="text-sm text-gray-500">
        Only support {acceptedTypes.join(", ")} files (max 2MB)
      </p>
    </div>
  );
};

export default TradePaymentUpload;
