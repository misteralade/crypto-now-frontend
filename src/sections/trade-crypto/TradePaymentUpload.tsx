import { useState, useRef, useEffect } from "react";
import Upload from "../../assets/icons/upload.svg";
import Cancel from "../../assets/icons/hightlight_off.svg";
import { transactionServiceApi } from "../../api/transaction.api.ts";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

interface FileUploadProps {
  onFileUploaded: (value: string) => void;
  maxFiles: number;
  setUploadedFileUrl: (value: string | undefined) => void;
  acceptedTypes?: string[];
}

// trigger PR
const TradePaymentUpload = ({
  onFileUploaded,
  maxFiles = 5,
  setUploadedFileUrl,
  acceptedTypes = [".jpg", ".jpeg", ".png", ".webp", ".gif"],
}: FileUploadProps) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string>("");
  const [files, setFiles] = useState<File[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const currentUploadingFileRef = useRef<File | null>(null);
  const [, setIsUploading] = useState(false);
  const [, setUploadError] = useState<string | null>(null);

  // Clean up blob URL when component unmounts or file changes
  useEffect(() => {
    return () => {
      if (filePreviewUrl) {
        URL.revokeObjectURL(filePreviewUrl);
      }
    };
  }, [filePreviewUrl]);

  const uploadTransactionReceiptMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      toast.loading("Uploading file...");
      const { url, signedUrl } =
        await transactionServiceApi.uploadTransactionReceipt(formData);
      return { url, signedUrl };
    },
    onSettled: (data: { url: string; signedUrl: string } | undefined) => {
      toast.dismiss();
      if (data?.url) {
        toast.success(`Receipt uploaded successfully`);
        // Use url for the actual transaction
        onFileUploaded(data.url);
        setUploadedFileUrl(data.url);

        // Get the file from ref and create blob URL for preview
        const file = currentUploadingFileRef.current;
        if (file) {
          setUploadedFile(file);
          // Create blob URL from the file object for instant display
          const blobUrl = URL.createObjectURL(file);
          setFilePreviewUrl(blobUrl);
          // Clear the ref
          currentUploadingFileRef.current = null;
        }
      } else {
        toast.error(`Failed to upload receipt`);
        currentUploadingFileRef.current = null;
      }
    },
  });

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    setUploadError(null);

    // Check file size (2MB = 2 * 1024 * 1024 bytes)
    const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB in bytes
    if (file.size > MAX_FILE_SIZE) {
      toast.error(`File size exceeds 2MB. Please upload a smaller image.`);
      setIsUploading(false);
      setUploadError("File size exceeds 2MB");
      return;
    }

    // Store the file in ref so we can access it after upload completes
    currentUploadingFileRef.current = file;

    const formData = new FormData();
    formData.append("file", file);

    uploadTransactionReceiptMutation.mutate(formData);
  };

  const handleFileSelect = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;

    const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB in bytes

    const newFiles = Array.from(selectedFiles).filter((file) => {
      const extension = "." + file.name.split(".").pop()?.toLowerCase();
      const isValidType = acceptedTypes.includes(extension);

      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`${file.name} exceeds 2MB. Please upload a smaller image.`);
        return false;
      }

      return isValidType;
    });

    // If no valid files after filtering, return early
    if (newFiles.length === 0) {
      return;
    }

    // If replacing, clear existing files
    const updatedFiles =
      files.length > 0
        ? newFiles.slice(0, maxFiles)
        : [...files, ...newFiles].slice(0, maxFiles);

    // Clear old file preview if replacing
    if (files.length > 0) {
      if (filePreviewUrl) {
        URL.revokeObjectURL(filePreviewUrl);
      }
      setFilePreviewUrl("");
      setUploadedFile(null);
    }

    // Don't create local previews - only show preview after upload completes
    const file = newFiles[0];

    setFiles(updatedFiles);
    handleFileUpload(file);
  };

  const removeFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);

    // Clean up blob URL
    if (filePreviewUrl) {
      URL.revokeObjectURL(filePreviewUrl);
    }

    setFiles(updatedFiles);
    setFilePreviewUrl("");
    setUploadedFile(null);
    onFileUploaded("");
    setUploadedFileUrl(undefined);
  };

  const replaceFile = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    // handleFileSelect(e.dataTransfer.files)
  };

  const isImageFile = (fileName: string) => {
    const extension = "." + fileName.split(".").pop()?.toLowerCase();
    const imageExtensions = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
    return imageExtensions.includes(extension);
  };

  // Only show preview once upload is complete and we have the file object
  const previewImage =
    uploadedFile && isImageFile(uploadedFile.name) && filePreviewUrl
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
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        {/* Image Display - only show after upload completes */}
        {previewImage && (
          <>
            <img
              src={previewImage}
              alt="Uploaded receipt"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/20" />
          </>
        )}

        {/* Content Overlay - always show text */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-[300px] md:min-h-[400px] p-5">
          {/* Upload text content - always visible */}
          <div className="flex flex-col items-center space-y-4">
            <img
              src={Upload || "/placeholder.svg"}
              alt={`Upload icon`}
              className={`w-12 h-12 ${previewImage ? "drop-shadow-lg" : ""}`}
            />

            <div className="space-y-2">
              <p
                className={`text-sm ${previewImage ? "text-white drop-shadow-lg font-medium" : ""}`}
              >
                Drag your file(s) to start uploading
              </p>
              <div className={`flex items-center justify-between`}>
                <div
                  className={`w-20 h-0.5 ${previewImage ? "bg-white/50" : "bg-strokeLightGrey"}`}
                ></div>
                <p
                  className={`text-sm ${previewImage ? "text-white drop-shadow-lg" : "text-textSec"}`}
                >
                  OR
                </p>
                <div
                  className={`w-20 h-0.5 ${previewImage ? "bg-white/50" : "bg-strokeLightGrey"}`}
                ></div>
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

          {/* Replace/Remove overlay on hover - only show when image is uploaded */}
          {previewImage && (
            <div className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-colors duration-200 flex items-center justify-center group">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center space-y-3">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    replaceFile();
                  }}
                  className="px-6 py-3 bg-white/95 hover:bg-white text-gray-800 rounded-lg font-semibold text-sm shadow-lg"
                >
                  Replace Image
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(0);
                  }}
                  className="p-2 bg-red-500/90 hover:bg-red-500 text-white rounded-full shadow-lg"
                >
                  <img
                    src={Cancel || "/placeholder.svg"}
                    alt="Remove"
                    className="w-5 h-5"
                  />
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
