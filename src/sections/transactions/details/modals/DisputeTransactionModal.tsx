import {
  AlertCircle,
  AlertTriangle,
  FileSpreadsheet,
  FileText,
  Music,
  Upload,
  Video,
  X,
  Image,
  CheckCircle,
} from "lucide-react";
import { type ChangeEvent, Fragment, useState } from "react";
import { formatFileSize } from "../../../../util/index.util";
import type { FileTypeConfig, MessageAttachment, AttachmentType } from "../../../../types/transaction.types.ts";
import { ATTACHMENT_TYPE } from "../../../../util/constants.util.ts";
import { toast } from "react-toastify";
import {useUploadQuery} from "../../../../queries/upload.query.ts";

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
  [ATTACHMENT_TYPE.IMAGE]: {
    accept: "image/*",
    icon: Image,
    color: "text-purple-600",
    label: "Image",
  },
  [ATTACHMENT_TYPE.VIDEO]: {
    accept: "video/*",
    icon: Video,
    color: "text-red-600",
    label: "Video",
  },
  [ATTACHMENT_TYPE.PDF]: {
    accept: "application/pdf",
    icon: FileText,
    color: "text-red-600",
    label: "PDF",
  },
  [ATTACHMENT_TYPE.DOCUMENT]: {
    accept: ".doc,.docx,.txt",
    icon: FileText,
    color: "text-blue-600",
    label: "Document",
  },
  [ATTACHMENT_TYPE.AUDIO]: {
    accept: "audio/*",
    icon: Music,
    color: "text-green-600",
    label: "Audio",
  },
  [ATTACHMENT_TYPE.SPREADSHEET]: {
    accept: ".xls,.xlsx,.csv",
    icon: FileSpreadsheet,
    color: "text-emerald-600",
    label: "Spreadsheet",
  },
  [ATTACHMENT_TYPE.OTHER]: {
    accept: "*/*",
    icon: FileText,
    color: "text-gray-600",
    label: "Other",
  },
};

const DisputeTransactionModal = ({ transactionId, onClose, onSubmit }: DisputeTransactionModalProps) => {
  const { uploadFileMutation } = useUploadQuery();
  
  const [disputeReason, setDisputeReason] = useState<string>("");
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [uploadedAttachments, setUploadedAttachments] = useState<MessageAttachment[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  // Helper functions
  const getAttachmentType = (file: File): AttachmentType => {
    if (file.type.startsWith("image/")) return ATTACHMENT_TYPE.IMAGE;
    if (file.type.startsWith("video/")) return ATTACHMENT_TYPE.VIDEO;
    if (file.type === "application/pdf") return ATTACHMENT_TYPE.PDF;
    if (file.type.startsWith("audio/")) return ATTACHMENT_TYPE.AUDIO;
    if (file.name.match(/\.(xls|xlsx|csv)$/)) return ATTACHMENT_TYPE.SPREADSHEET;
    if (file.name.match(/\.(doc|docx|txt)$/)) return ATTACHMENT_TYPE.DOCUMENT;
    return ATTACHMENT_TYPE.OTHER;
  };
  
  const getImageDimensions = (
    file: File
  ): Promise<{ width: number; height: number } | null> => {
    return new Promise((resolve) => {
      if (!file.type.startsWith("image/")) {
        resolve(null);
        return;
      }
      
      const img = new window.Image();
      img.onload = () => {
        resolve({ width: img.width, height: img.height });
        URL.revokeObjectURL(img.src);
      };
      img.onerror = () => {
        resolve(null);
        URL.revokeObjectURL(img.src);
      };
      img.src = URL.createObjectURL(file);
    });
  };
  
  const getVideoDuration = (file: File): Promise<number | null> => {
    return new Promise((resolve) => {
      if (!file.type.startsWith("video/")) {
        resolve(null);
        return;
      }
      
      const video = document.createElement("video");
      video.onloadedmetadata = () => {
        resolve(video.duration);
        URL.revokeObjectURL(video.src);
      };
      video.onerror = () => {
        resolve(null);
        URL.revokeObjectURL(video.src);
      };
      video.src = URL.createObjectURL(file);
    });
  };
  
  // File upload handler
  const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
    const files = Array.from(event.target.files || []);
    
    if (files.length === 0) return;
    
    // If any of the file is greater than 10MB, toast an error message
    for (const file of files) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`File "${file.name}" exceeds the 10MB size limit.`);
        return;
      }
    }
    
    if (files.length > 5 || uploadingFiles.length + uploadedAttachments.length + files.length > 5) {
      toast.error("You can upload a maximum of 5 files.");
      return;
    }
    
    // Add files to uploading state
    const newUploadingFiles: UploadingFile[] = files.map((file) => ({
      id: Date.now() + Math.random(),
      file: file,
      name: file.name,
      size: file.size,
      type: getAttachmentType(file),
      mimeType: file.type || "application/octet-stream",
      localPreview: file.type.startsWith("image/")
        ? URL.createObjectURL(file)
        : null,
      isUploading: true,
      uploadProgress: 0,
    }));
    
    setUploadingFiles((prev) => [...prev, ...newUploadingFiles]);
    
    // Upload each file
    for (const uploadingFile of newUploadingFiles) {
      try {
        // Create FormData
        const formData = new FormData();
        formData.append("file", uploadingFile.file);
        
        // Upload file
        const url = await uploadFileMutation.mutateAsync(formData);
        
        // Get metadata
        const metadata: MessageAttachment["metadata"] = {};
        
        if (uploadingFile.type === ATTACHMENT_TYPE.IMAGE) {
          const dimensions = await getImageDimensions(uploadingFile.file);
          if (dimensions) {
            metadata.width = dimensions.width;
            metadata.height = dimensions.height;
          }
        } else if (uploadingFile.type === ATTACHMENT_TYPE.VIDEO) {
          const duration = await getVideoDuration(uploadingFile.file);
          if (duration) {
            metadata.duration = duration;
          }
        }
        
        // Create MessageAttachment
        const attachment: MessageAttachment = {
          url: url,
          type: uploadingFile.type,
          filename: uploadingFile.name,
          size: uploadingFile.size,
          mimeType: uploadingFile.mimeType,
          uploadedAt: new Date(),
          metadata: Object.keys(metadata).length > 0 ? metadata : undefined,
        };
        
        // Add to uploaded attachments
        setUploadedAttachments((prev) => [...prev, attachment]);
        
        // Remove from uploading
        setUploadingFiles((prev) => prev.filter((f) => f.id !== uploadingFile.id));
        
        // Clean up local preview
        if (uploadingFile.localPreview) {
          URL.revokeObjectURL(uploadingFile.localPreview);
        }
      } catch (error) {
        console.error("Upload failed:", error);
        
        // Update uploading file with error
        setUploadingFiles((prev) =>
          prev.map((f) =>
            f.id === uploadingFile.id
              ? { ...f, isUploading: false, error: "Upload failed" }
              : f
          )
        );
      }
    }
    
    // Reset input
    event.target.value = "";
  };
  
  const removeUploadingFile = (fileId: number): void => {
    const file = uploadingFiles.find((f) => f.id === fileId);
    if (file?.localPreview) {
      URL.revokeObjectURL(file.localPreview);
    }
    setUploadingFiles((prev) => prev.filter((f) => f.id !== fileId));
  };
  
  const removeAttachment = (url: string): void => {
    setUploadedAttachments((prev) => prev.filter((a) => a.url !== url));
  };
  
  const handleDisputeSubmit = async (): Promise<void> => {
    if (!disputeReason.trim()) {
      toast.error("Please provide a reason for the dispute");
      return;
    }
    
    // Check if any files are still uploading
    if (uploadingFiles.length > 0) {
      toast.warning("Please wait for all files to finish uploading");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Call the onSubmit callback with reason and attachments
      await onSubmit(disputeReason, uploadedAttachments);
      
      // Reset form
      setDisputeReason("");
      setUploadedAttachments([]);
      setUploadingFiles([]);
      
      // Close modal
      onClose();
    } catch (error) {
      console.error("Error submitting dispute:", error);
      toast.error("Failed to submit dispute. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Fragment>
      <div className="fixed inset-0 bg-white/30 backdrop-blur-md flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
          {/* Modal Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Dispute Transaction</h2>
                <p className="text-sm text-gray-500">
                  Transaction ID: {transactionId.slice(0, 20)}...
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          {/* Modal Body */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              {/* Info Alert */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div className="text-sm text-yellow-800">
                    <p className="font-medium mb-1">Before submitting a dispute:</p>
                    <ul className="list-disc list-inside space-y-1 ml-1">
                      <li>Ensure all transaction details are correct</li>
                      <li>Provide clear evidence of the issue</li>
                      <li>Our team will review your case within 24-48 hours</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              {/* Reason Textarea */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Reason for Dispute <span className="text-red-600">*</span>
                </label>
                <textarea
                  value={disputeReason}
                  onChange={(e) => setDisputeReason(e.target.value)}
                  placeholder="Please provide a detailed explanation of why you're disputing this transaction..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                  rows={5}
                  maxLength={1000}
                  disabled={isSubmitting}
                />
                <div className="flex justify-between items-center mt-2">
                  <p className="text-xs text-gray-500">Be as specific as possible</p>
                  <p className="text-xs text-gray-500">{disputeReason.length}/1000</p>
                </div>
              </div>
              
              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Supporting Documents (Optional)
                </label>
                <p className="text-xs text-gray-500 mb-3">
                  Upload any relevant files (images, videos, PDFs, documents, audio,
                  spreadsheets)
                </p>
                
                {/* Upload Button */}
                <label
                  className={`flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg ${
                    isSubmitting
                      ? "cursor-not-allowed opacity-50"
                      : "cursor-pointer hover:bg-gray-50"
                  } transition-colors`}
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-10 h-10 text-gray-400 mb-3" />
                    <p className="text-sm text-gray-600 font-medium">
                      Click to upload files
                    </p>
                    <p className="text-xs text-gray-500 mt-1">or drag and drop</p>
                  </div>
                  <input
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                    accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt,.xls,.xlsx,.csv"
                    disabled={isSubmitting}
                  />
                </label>
                
                {/* Files List */}
                {(uploadingFiles.length > 0 || uploadedAttachments.length > 0) && (
                  <div className="mt-4 space-y-2">
                    <p className="text-sm font-medium text-gray-900">
                      Files ({uploadingFiles.length + uploadedAttachments.length})
                      {uploadingFiles.length > 0 && (
                        <span className="text-gray-500 ml-2">
                          ({uploadingFiles.length} uploading)
                        </span>
                      )}
                    </p>
                    
                    {/* Uploading Files */}
                    {uploadingFiles.map((file) => {
                      const FileIcon = fileTypeConfig[file.type].icon;
                      const iconColor = fileTypeConfig[file.type].color;
                      
                      return (
                        <div
                          key={file.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            {file.localPreview ? (
                              <img
                                src={file.localPreview}
                                alt={file.name}
                                className="w-12 h-12 object-cover rounded"
                              />
                            ) : (
                              <div className="w-12 h-12 bg-white rounded flex items-center justify-center border border-gray-200">
                                <FileIcon className={`w-6 h-6 ${iconColor}`} />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {file.name}
                              </p>
                              <div className="flex items-center gap-2">
                                <p className="text-xs text-gray-500">
                                  {formatFileSize(file.size)} •{" "}
                                  {fileTypeConfig[file.type].label}
                                </p>
                                {file.isUploading && (
                                  <span className="text-xs text-blue-600 flex items-center gap-1">
                                    <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                    Uploading...
                                  </span>
                                )}
                                {file.error && (
                                  <span className="text-xs text-red-600">{file.error}</span>
                                )}
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => removeUploadingFile(file.id)}
                            disabled={file.isUploading}
                            className="ml-2 p-1 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      );
                    })}
                    
                    {/* Uploaded Attachments */}
                    {uploadedAttachments.map((attachment) => {
                      const FileIcon = fileTypeConfig[attachment.type].icon;
                      const iconColor = fileTypeConfig[attachment.type].color;
                      const isImage = attachment.type === ATTACHMENT_TYPE.IMAGE;
                      
                      return (
                        <div
                          key={attachment.url}
                          className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200"
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            {isImage ? (
                              <img
                                src={attachment.url}
                                alt={attachment.filename}
                                className="w-12 h-12 object-cover rounded"
                              />
                            ) : (
                              <div className="w-12 h-12 bg-white rounded flex items-center justify-center border border-gray-200">
                                <FileIcon className={`w-6 h-6 ${iconColor}`} />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {attachment.filename}
                              </p>
                              <div className="flex items-center gap-2">
                                <p className="text-xs text-gray-500">
                                  {formatFileSize(attachment.size)} •{" "}
                                  {fileTypeConfig[attachment.type].label}
                                </p>
                                <span className="text-xs text-green-600 flex items-center gap-1">
                                  <CheckCircle className="w-3 h-3" />
                                  Uploaded
                                </span>
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => removeAttachment(attachment.url)}
                            disabled={isSubmitting}
                            className="ml-2 p-1 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Modal Footer */}
          <div className="border-t border-gray-200 p-6 bg-gray-50">
            <div className="flex gap-3 justify-end">
              <button
                onClick={onClose}
                disabled={isSubmitting}
                className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDisputeSubmit}
                disabled={
                  isSubmitting || !disputeReason.trim() || uploadingFiles.length > 0
                }
                className="px-6 py-2.5 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 hover:cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4" />
                    Submit Dispute
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default DisputeTransactionModal;