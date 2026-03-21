import {
  AlertTriangle,
  FileSpreadsheet,
  FileText,
  Music,
  Upload,
  Video,
  X,
  Image,
  Check,
} from "lucide-react";
import { type ChangeEvent, Fragment, useState } from "react";
import { formatFileSize } from "../../../../util/index.util";
import type { FileTypeConfig, MessageAttachment, AttachmentType } from "../../../../types/transaction.types.ts";
import { ATTACHMENT_TYPE } from "../../../../util/constants.util.ts";
import { toast } from "react-toastify";
import { useUploadQuery } from "../../../../queries/upload.query.ts";

interface UploadingFile {
  id: number;
  file: File;
  name: string;
  size: number;
  type: AttachmentType;
  mimeType: string;
  localPreview: string | null;
  isUploading: boolean;
  uploadProgress?: number;
  error?: string;
}

interface DisputeTransactionModalProps {
  transactionId: string;
  onClose: () => void;
  onSubmit: (reason: string, attachments: MessageAttachment[]) => void;
}

const fileTypeConfig: Record<AttachmentType, FileTypeConfig> = {
  [ATTACHMENT_TYPE.IMAGE]: { accept: "image/*", icon: Image, color: "#948EEE", label: "Image" },
  [ATTACHMENT_TYPE.VIDEO]: { accept: "video/*", icon: Video, color: "#EB5757", label: "Video" },
  [ATTACHMENT_TYPE.PDF]: { accept: "application/pdf", icon: FileText, color: "#EB5757", label: "PDF" },
  [ATTACHMENT_TYPE.DOCUMENT]: { accept: ".doc,.docx,.txt", icon: FileText, color: "#575AE5", label: "Document" },
  [ATTACHMENT_TYPE.AUDIO]: { accept: "audio/*", icon: Music, color: "#037847", label: "Audio" },
  [ATTACHMENT_TYPE.SPREADSHEET]: { accept: ".xls,.xlsx,.csv", icon: FileSpreadsheet, color: "#037847", label: "Spreadsheet" },
  [ATTACHMENT_TYPE.OTHER]: { accept: "*/*", icon: FileText, color: "#9A9A9A", label: "Other" },
};

const DisputeTransactionModal = ({ transactionId, onClose, onSubmit }: DisputeTransactionModalProps) => {
  const { uploadFileMutation } = useUploadQuery();

  const [disputeReason, setDisputeReason] = useState<string>("");
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [uploadedAttachments, setUploadedAttachments] = useState<MessageAttachment[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const getAttachmentType = (file: File): AttachmentType => {
    if (file.type.startsWith("image/")) return ATTACHMENT_TYPE.IMAGE;
    if (file.type.startsWith("video/")) return ATTACHMENT_TYPE.VIDEO;
    if (file.type === "application/pdf") return ATTACHMENT_TYPE.PDF;
    if (file.type.startsWith("audio/")) return ATTACHMENT_TYPE.AUDIO;
    if (file.name.match(/\.(xls|xlsx|csv)$/)) return ATTACHMENT_TYPE.SPREADSHEET;
    if (file.name.match(/\.(doc|docx|txt)$/)) return ATTACHMENT_TYPE.DOCUMENT;
    return ATTACHMENT_TYPE.OTHER;
  };

  const getImageDimensions = (file: File): Promise<{ width: number; height: number } | null> =>
    new Promise((resolve) => {
      if (!file.type.startsWith("image/")) return resolve(null);
      const img = new window.Image();
      img.onload = () => { resolve({ width: img.width, height: img.height }); URL.revokeObjectURL(img.src); };
      img.onerror = () => { resolve(null); URL.revokeObjectURL(img.src); };
      img.src = URL.createObjectURL(file);
    });

  const getVideoDuration = (file: File): Promise<number | null> =>
    new Promise((resolve) => {
      if (!file.type.startsWith("video/")) return resolve(null);
      const video = document.createElement("video");
      video.onloadedmetadata = () => { resolve(video.duration); URL.revokeObjectURL(video.src); };
      video.onerror = () => { resolve(null); URL.revokeObjectURL(video.src); };
      video.src = URL.createObjectURL(file);
    });

  const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    for (const file of files) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`"${file.name}" exceeds the 10MB limit.`);
        return;
      }
    }

    if (uploadingFiles.length + uploadedAttachments.length + files.length > 5) {
      toast.error("Maximum 5 files allowed.");
      return;
    }

    const newUploadingFiles: UploadingFile[] = files.map((file) => ({
      id: Date.now() + Math.random(),
      file,
      name: file.name,
      size: file.size,
      type: getAttachmentType(file),
      mimeType: file.type || "application/octet-stream",
      localPreview: file.type.startsWith("image/") ? URL.createObjectURL(file) : null,
      isUploading: true,
      uploadProgress: 0,
    }));

    setUploadingFiles((prev) => [...prev, ...newUploadingFiles]);

    for (const uploadingFile of newUploadingFiles) {
      try {
        const formData = new FormData();
        formData.append("file", uploadingFile.file);
        const url = await uploadFileMutation.mutateAsync(formData);

        const metadata: MessageAttachment["metadata"] = {};
        if (uploadingFile.type === ATTACHMENT_TYPE.IMAGE) {
          const dims = await getImageDimensions(uploadingFile.file);
          if (dims) { metadata.width = dims.width; metadata.height = dims.height; }
        } else if (uploadingFile.type === ATTACHMENT_TYPE.VIDEO) {
          const dur = await getVideoDuration(uploadingFile.file);
          if (dur) metadata.duration = dur;
        }

        const attachment: MessageAttachment = {
          url,
          type: uploadingFile.type,
          filename: uploadingFile.name,
          size: uploadingFile.size,
          mimeType: uploadingFile.mimeType,
          uploadedAt: new Date(),
          metadata: Object.keys(metadata).length > 0 ? metadata : undefined,
        };

        setUploadedAttachments((prev) => [...prev, attachment]);
        setUploadingFiles((prev) => prev.filter((f) => f.id !== uploadingFile.id));
        if (uploadingFile.localPreview) URL.revokeObjectURL(uploadingFile.localPreview);
      } catch {
        setUploadingFiles((prev) =>
          prev.map((f) => f.id === uploadingFile.id ? { ...f, isUploading: false, error: "Upload failed" } : f)
        );
      }
    }

    event.target.value = "";
  };

  const removeUploadingFile = (fileId: number): void => {
    const file = uploadingFiles.find((f) => f.id === fileId);
    if (file?.localPreview) URL.revokeObjectURL(file.localPreview);
    setUploadingFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  const removeAttachment = (url: string): void => {
    setUploadedAttachments((prev) => prev.filter((a) => a.url !== url));
  };

  const handleDisputeSubmit = async (): Promise<void> => {
    if (!disputeReason.trim()) { toast.error("Please provide a reason for the dispute"); return; }
    if (uploadingFiles.length > 0) { toast.warning("Please wait for all files to finish uploading"); return; }

    setIsSubmitting(true);
    try {
      await onSubmit(disputeReason, uploadedAttachments);
      setDisputeReason("");
      setUploadedAttachments([]);
      setUploadingFiles([]);
      onClose();
    } catch {
      toast.error("Failed to submit dispute. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalFiles = uploadingFiles.length + uploadedAttachments.length;

  return (
    <Fragment>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
        style={{ background: "rgba(14,15,12,0.50)", backdropFilter: "blur(8px)" }}
        onClick={(e) => { if (e.target === e.currentTarget && !isSubmitting) onClose(); }}
      >
        <div
          className="relative w-full sm:max-w-lg flex flex-col max-h-[90dvh] sm:max-h-[85vh]"
          style={{
            background: "#FFFFFF",
            borderRadius: "28px 28px 0 0",
            ...(window.innerWidth >= 640 ? { borderRadius: "28px" } : {}),
          }}
        >
          {/* Drag handle (mobile) */}
          <div className="sm:hidden flex justify-center pt-3 pb-1">
            <div className="w-10 h-1 rounded-full" style={{ background: "#E0E0E0" }} />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-5 pt-4 pb-4" style={{ borderBottom: "1px solid #F0F0F0" }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
                style={{ background: "#FEECEC" }}>
                <AlertTriangle size={18} style={{ color: "#EB5757" }} />
              </div>
              <div>
                <p className="text-base font-extrabold" style={{ color: "#0E0F0C", fontFamily: "'DM Sans', sans-serif" }}>
                  Dispute Transaction
                </p>
                <p className="text-xs mt-0.5 font-mono" style={{ color: "#9A9A9A" }}>
                  {transactionId.slice(0, 20).toUpperCase()}…
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors disabled:opacity-40"
              style={{ background: "#F7F7F9", color: "#6B6E6B" }}
            >
              <X size={16} />
            </button>
          </div>

          {/* Scrollable body */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">

            {/* Info banner */}
            <div className="rounded-2xl px-4 py-3.5" style={{ background: "#FFFBF0", border: "1px solid #FFE4A0" }}>
              <p className="text-xs font-bold mb-1.5" style={{ color: "#A07000" }}>Before submitting</p>
              <ul className="space-y-1">
                {[
                  "Ensure all transaction details are correct",
                  "Provide clear evidence of the issue",
                  "Our team resolves cases as soon as possible",
                  "Disputes are in a live queue — please be patient",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-xs" style={{ color: "#7A6000" }}>
                    <span className="mt-0.5 shrink-0">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Reason */}
            <div>
              <p className="text-[10px] font-bold tracking-widest uppercase mb-2" style={{ color: "#9A9A9A" }}>
                Reason for Dispute <span style={{ color: "#EB5757" }}>*</span>
              </p>
              <textarea
                value={disputeReason}
                onChange={(e) => setDisputeReason(e.target.value)}
                placeholder="Describe the issue in detail…"
                rows={4}
                maxLength={1000}
                disabled={isSubmitting}
                className="w-full px-4 py-3 text-sm rounded-2xl outline-none resize-none transition-all disabled:opacity-60"
                style={{
                  background: "#F7F7F9",
                  border: "1px solid #EEEEEE",
                  color: "#0E0F0C",
                  fontFamily: "inherit",
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = "#948EEE"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "#EEEEEE"; }}
              />
              <div className="flex justify-between mt-1.5">
                <p className="text-[11px]" style={{ color: "#9A9A9A" }}>Be as specific as possible</p>
                <p className="text-[11px]" style={{ color: disputeReason.length > 900 ? "#EB5757" : "#9A9A9A" }}>
                  {disputeReason.length}/1000
                </p>
              </div>
            </div>

            {/* File upload */}
            <div>
              <p className="text-[10px] font-bold tracking-widest uppercase mb-2" style={{ color: "#9A9A9A" }}>
                Supporting Evidence <span style={{ color: "#9A9A9A" }}>(optional · max 5 files · 10MB each)</span>
              </p>

              <label
                className={`flex flex-col items-center justify-center w-full py-6 rounded-2xl transition-all ${isSubmitting || totalFiles >= 5 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                style={{ border: "2px dashed #EEEEEE", background: "#F7F7F9" }}
              >
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center mb-2" style={{ background: "#EEEEEE" }}>
                  <Upload size={18} style={{ color: "#6B6E6B" }} />
                </div>
                <p className="text-sm font-semibold" style={{ color: "#0E0F0C" }}>
                  {totalFiles >= 5 ? "Max files reached" : "Click to upload"}
                </p>
                <p className="text-xs mt-0.5" style={{ color: "#9A9A9A" }}>Images, videos, PDFs, docs…</p>
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt,.xls,.xlsx,.csv"
                  disabled={isSubmitting || totalFiles >= 5}
                />
              </label>

              {/* File list */}
              {totalFiles > 0 && (
                <div className="mt-3 space-y-2">
                  {/* Uploading */}
                  {uploadingFiles.map((file) => {
                    const FileIcon = fileTypeConfig[file.type].icon;
                    return (
                      <div key={file.id} className="flex items-center gap-3 px-3 py-2.5 rounded-2xl"
                        style={{ background: "#F7F7F9", border: "1px solid #EEEEEE" }}>
                        {file.localPreview ? (
                          <img src={file.localPreview} alt={file.name} className="w-10 h-10 rounded-xl object-cover shrink-0" />
                        ) : (
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "#EEEEEE" }}>
                            <FileIcon size={16} style={{ color: fileTypeConfig[file.type].color }} />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold truncate" style={{ color: "#0E0F0C" }}>{file.name}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <p className="text-[11px]" style={{ color: "#9A9A9A" }}>{formatFileSize(file.size)}</p>
                            {file.isUploading && (
                              <span className="flex items-center gap-1 text-[11px]" style={{ color: "#948EEE" }}>
                                <div className="w-3 h-3 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: "#948EEE transparent transparent transparent" }} />
                                Uploading…
                              </span>
                            )}
                            {file.error && <span className="text-[11px]" style={{ color: "#EB5757" }}>{file.error}</span>}
                          </div>
                        </div>
                        <button onClick={() => removeUploadingFile(file.id)} disabled={file.isUploading}
                          className="shrink-0 w-6 h-6 rounded-lg flex items-center justify-center disabled:opacity-40"
                          style={{ background: "#EEEEEE", color: "#6B6E6B" }}>
                          <X size={12} />
                        </button>
                      </div>
                    );
                  })}

                  {/* Uploaded */}
                  {uploadedAttachments.map((att) => {
                    const FileIcon = fileTypeConfig[att.type].icon;
                    const isImage = att.type === ATTACHMENT_TYPE.IMAGE;
                    return (
                      <div key={att.url} className="flex items-center gap-3 px-3 py-2.5 rounded-2xl"
                        style={{ background: "#E8F8F0", border: "1px solid #A8E6C8" }}>
                        {isImage ? (
                          <img src={att.url} alt={att.filename} className="w-10 h-10 rounded-xl object-cover shrink-0" />
                        ) : (
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "#FFFFFF" }}>
                            <FileIcon size={16} style={{ color: fileTypeConfig[att.type].color }} />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold truncate" style={{ color: "#0E0F0C" }}>{att.filename}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <p className="text-[11px]" style={{ color: "#9A9A9A" }}>{formatFileSize(att.size)}</p>
                            <span className="flex items-center gap-1 text-[11px]" style={{ color: "#037847" }}>
                              <Check size={10} /> Uploaded
                            </span>
                          </div>
                        </div>
                        <button onClick={() => removeAttachment(att.url)} disabled={isSubmitting}
                          className="shrink-0 w-6 h-6 rounded-lg flex items-center justify-center disabled:opacity-40"
                          style={{ background: "#FFFFFF", color: "#6B6E6B" }}>
                          <X size={12} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="px-5 py-4 flex gap-3" style={{ borderTop: "1px solid #F0F0F0" }}>
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 py-3.5 rounded-2xl text-sm font-bold transition-all disabled:opacity-50"
              style={{ background: "#F7F7F9", color: "#6B6E6B", border: "1px solid #EEEEEE" }}
            >
              Cancel
            </button>
            <button
              onClick={handleDisputeSubmit}
              disabled={isSubmitting || !disputeReason.trim() || uploadingFiles.length > 0}
              className="flex-1 py-3.5 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: isSubmitting || !disputeReason.trim() || uploadingFiles.length > 0
                  ? "#F0F0F0"
                  : "#EB5757",
                color: isSubmitting || !disputeReason.trim() || uploadingFiles.length > 0
                  ? "#9A9A9A"
                  : "#FFFFFF",
              }}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  Submitting…
                </>
              ) : (
                <>
                  <AlertTriangle size={14} />
                  Submit Dispute
                </>
              )}
            </button>
          </div>

        </div>
      </div>
    </Fragment>
  );
};

export default DisputeTransactionModal;
