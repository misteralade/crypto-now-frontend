import {
  AlertCircle,
  CheckCircle2,
  Download,
  FileText,
  Loader2,
  Paperclip,
  Send,
  Shield,
  X,
  MessageSquare,
} from "lucide-react";
import { useEffect, useRef, useState, type ChangeEvent, type KeyboardEvent } from "react";
import type { DisputeMessageResponse } from "../../../types/response.payload.types.ts";
import { ATTACHMENT_TYPE, MAX_FILES_PER_DISPUTE } from "../../../util/constants.util.ts";
import { formatFileSize, getFileType } from "../../../util/index.util.ts";
import type { MessageAttachment, AttachmentType } from "../../../types/transaction.types.ts";
import { toast } from "react-toastify";
import { useUploadQuery } from "../../../queries/upload.query.ts";
import { useDispatch } from "react-redux";
import {
  setDisputeMessageAttachments,
  setDisputeMessageText,
} from "../../../redux/transaction.slice.ts";
import { DISPUTE_SENDER_TYPE, isDisputeClosed } from "../../../util/dispute.util.ts";
import moment from "moment";

interface DisputeMessageProps {
  loading: boolean;
  messages: Array<DisputeMessageResponse>;
  sendMessageMutation: any;
  disputeStatus?: string | null;
}

interface UploadingFile {
  id: number;
  file: File;
  name: string;
  size: number;
  type: AttachmentType;
  mimeType: string;
  isUploading: boolean;
  error?: string;
}

const DisputeMessage = ({
  loading,
  messages,
  sendMessageMutation,
  disputeStatus,
}: DisputeMessageProps) => {
  const dispatch = useDispatch();
  const { uploadFileMutation } = useUploadQuery();

  const [message, setMessage] = useState("");
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [uploadedAttachments, setUploadedAttachments] = useState<MessageAttachment[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const closed = isDisputeClosed(disputeStatus);

  // Auto-scroll to bottom on messages change
  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages.length]);

  // Handle file selection
  const handleFileSelect = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    const totalFiles = uploadingFiles.length + uploadedAttachments.length + files.length;
    if (totalFiles > MAX_FILES_PER_DISPUTE) {
      toast.warning(`You can attach up to ${MAX_FILES_PER_DISPUTE} files per dispute.`);
      return;
    }

    const newUploadingFiles: UploadingFile[] = files.map((file) => ({
      id: Date.now() + Math.random(),
      file,
      name: file.name,
      size: file.size,
      type: getFileType(file),
      mimeType: file.type || "application/octet-stream",
      isUploading: true,
    }));

    setUploadingFiles((prev) => [...prev, ...newUploadingFiles]);

    for (const uploadingFile of newUploadingFiles) {
      try {
        const formData = new FormData();
        formData.append("file", uploadingFile.file);

        const response = await uploadFileMutation.mutateAsync(formData);
        const fileUrl = (typeof response === "string" ? response : response?.url) || "";

        const attachment: MessageAttachment = {
          url: fileUrl,
          type: uploadingFile.type,
          filename: uploadingFile.name,
          size: uploadingFile.size,
          mimeType: uploadingFile.mimeType,
          uploadedAt: new Date(),
        };

        setUploadedAttachments((prev) => [...prev, attachment]);
        setUploadingFiles((prev) => prev.filter((f) => f.id !== uploadingFile.id));
      } catch (err) {
        setUploadingFiles((prev) =>
          prev.map((f) =>
            f.id === uploadingFile.id
              ? { ...f, isUploading: false, error: "Upload failed" }
              : f
          )
        );
      }
    }

    event.target.value = "";
  };

  const removeUploadingFile = (fileId: number) => {
    setUploadingFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  const removeAttachment = (url: string) => {
    setUploadedAttachments((prev) => prev.filter((a) => a.url !== url));
  };

  const handleSendMessage = async () => {
    const trimmed = message.trim();
    if (!trimmed && uploadedAttachments.length === 0) {
      return;
    }

    if (uploadingFiles.some((f) => f.isUploading)) {
      toast.warning("Please wait for your files to finish uploading.");
      return;
    }

    try {
      dispatch(setDisputeMessageText(trimmed));
      dispatch(setDisputeMessageAttachments(uploadedAttachments));

      await sendMessageMutation.mutateAsync();

      setMessage("");
      setUploadedAttachments([]);
      setUploadingFiles([]);
    } catch {
      // toast error is already handled in mutation
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div
      className="rounded-3xl flex flex-col h-[640px] sm:h-[700px] overflow-hidden"
      style={{ background: "#FFFFFF", border: "1px solid #F0F0F0" }}
    >
      {/* Chat Header */}
      <div
        className="px-5 py-4 flex items-center justify-between shrink-0"
        style={{ borderBottom: "1px solid #F0F0F0" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
            style={{ background: "#F0EFFD", color: "#575AE5" }}
          >
            <Shield size={18} />
          </div>
          <div>
            <h2 className="text-sm font-bold" style={{ color: "#0E0F0C" }}>
              Support Conversation
            </h2>
            <p className="text-xs" style={{ color: "#9A9A9A" }}>
              CryptoNow Resolution Desk
            </p>
          </div>
        </div>

        {/* Live indicator */}
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-[11px] font-semibold" style={{ color: "#6B6E6B" }}>
            Live
          </span>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4"
        style={{ background: "#FAFAFA" }}
      >
        {loading && messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center py-12 text-center">
            <Loader2 className="w-6 h-6 animate-spin text-[#948EEE] mb-2" />
            <p className="text-xs font-semibold" style={{ color: "#9A9A9A" }}>
              Loading conversation...
            </p>
          </div>
        ) : messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center py-12 text-center px-4">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3"
              style={{ background: "#F0EFFD", color: "#575AE5" }}
            >
              <MessageSquare size={22} />
            </div>
            <h4 className="text-sm font-bold mb-1" style={{ color: "#0E0F0C" }}>
              No messages yet
            </h4>
            <p className="text-xs max-w-sm" style={{ color: "#9A9A9A" }}>
              You can ask questions or provide additional payment details here. Our team will respond directly.
            </p>
          </div>
        ) : (
          messages.map((msg) => {
            const isUser = msg.senderType === DISPUTE_SENDER_TYPE.USER;
            const timeFormatted = moment(msg.createdAt).format("h:mm A");

            return (
              <div
                key={msg.id}
                className={`flex gap-2.5 items-end ${
                  isUser ? "justify-end" : "justify-start"
                }`}
              >
                {!isUser && (
                  <div
                    className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0 mb-1"
                    style={{ background: "#F0EFFD", color: "#575AE5" }}
                  >
                    <Shield size={14} />
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[75%] flex flex-col ${
                    isUser ? "items-end" : "items-start"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1 px-1">
                    <span
                      className="text-[10px] font-bold"
                      style={{ color: isUser ? "#6B6E6B" : "#575AE5" }}
                    >
                      {isUser ? "You" : "CryptoNow Team"}
                    </span>
                    <span className="text-[10px]" style={{ color: "#9A9A9A" }}>
                      {timeFormatted}
                    </span>
                  </div>

                  {/* Message Bubble */}
                  {msg.messageText && (
                    <div
                      className="px-4 py-3 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words"
                      style={{
                        background: isUser ? "#03034D" : "#FFFFFF",
                        color: isUser ? "#FFFFFF" : "#0E0F0C",
                        border: isUser ? "none" : "1px solid #EEEEEE",
                        borderBottomRightRadius: isUser ? "4px" : "16px",
                        borderBottomLeftRadius: isUser ? "16px" : "4px",
                      }}
                    >
                      {msg.messageText}
                    </div>
                  )}

                  {/* Attachments */}
                  {msg.attachments && msg.attachments.length > 0 && (
                    <div className="mt-2 space-y-1.5 w-full">
                      {msg.attachments.map((att, idx) => {
                        const isImg = att.type === ATTACHMENT_TYPE.IMAGE;
                        return (
                          <a
                            key={idx}
                            href={att.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 p-2 rounded-xl transition-all hover:opacity-90"
                            style={{
                              background: isUser ? "rgba(3, 3, 77, 0.08)" : "#FFFFFF",
                              border: "1px solid #EEEEEE",
                            }}
                          >
                            {isImg ? (
                              <img
                                src={att.url}
                                alt={att.filename}
                                className="w-8 h-8 rounded-lg object-cover"
                                onError={(e) => {
                                  (e.currentTarget as HTMLImageElement).style.display = "none";
                                }}
                              />
                            ) : (
                              <FileText size={16} style={{ color: "#575AE5" }} />
                            )}
                            <div className="flex-1 min-w-0">
                              <p
                                className="text-[11px] font-semibold truncate"
                                style={{ color: "#0E0F0C" }}
                              >
                                {att.filename}
                              </p>
                              <p className="text-[10px]" style={{ color: "#9A9A9A" }}>
                                {formatFileSize(att.size)}
                              </p>
                            </div>
                            <Download size={12} style={{ color: "#6B6E6B" }} />
                          </a>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input / Composer Area */}
      <div
        className="p-3 sm:p-4 shrink-0"
        style={{ background: "#FFFFFF", borderTop: "1px solid #F0F0F0" }}
      >
        {closed ? (
          <div
            className="rounded-2xl p-3 text-center text-xs"
            style={{ background: "#F7F7F9", color: "#6B6E6B" }}
          >
            This dispute is closed. Messages cannot be sent.
          </div>
        ) : (
          <div>
            {/* Pending & Uploaded files tray */}
            {(uploadingFiles.length > 0 || uploadedAttachments.length > 0) && (
              <div className="mb-2.5 flex flex-wrap gap-2">
                {uploadingFiles.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs"
                    style={{ background: "#F7F7F9", border: "1px solid #EEEEEE" }}
                  >
                    {file.isUploading ? (
                      <Loader2 size={12} className="animate-spin text-[#575AE5]" />
                    ) : (
                      <AlertCircle size={12} className="text-red-500" />
                    )}
                    <span className="max-w-[120px] truncate text-[11px] font-medium" style={{ color: "#0E0F0C" }}>
                      {file.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeUploadingFile(file.id)}
                      className="text-gray-400 hover:text-red-500 ml-1"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}

                {uploadedAttachments.map((att, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs"
                    style={{ background: "#E8F8F0", border: "1px solid #B7EAD0" }}
                  >
                    <CheckCircle2 size={12} style={{ color: "#037847" }} />
                    <span className="max-w-[120px] truncate text-[11px] font-semibold" style={{ color: "#037847" }}>
                      {att.filename}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeAttachment(att.url)}
                      className="text-[#037847] hover:text-red-500 ml-1"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Input Row */}
            <div className="flex items-end gap-2">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileSelect}
                className="hidden"
                accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={sendMessageMutation.isPending}
                aria-label="Attach file"
                className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 transition-all hover:bg-gray-100 active:scale-95 disabled:opacity-50"
                style={{
                  background: "#F7F7F9",
                  border: "1px solid #EEEEEE",
                  color: "#6B6E6B",
                }}
              >
                <Paperclip size={16} />
              </button>

              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                rows={1}
                disabled={sendMessageMutation.isPending}
                className="flex-1 px-4 py-2.5 rounded-2xl text-xs sm:text-sm resize-none focus:outline-none transition-all"
                style={{
                  background: "#F7F7F9",
                  border: "1px solid #EEEEEE",
                  color: "#0E0F0C",
                  minHeight: "40px",
                  maxHeight: "120px",
                }}
              />

              <button
                type="button"
                onClick={handleSendMessage}
                disabled={
                  sendMessageMutation.isPending ||
                  (!message.trim() && uploadedAttachments.length === 0) ||
                  uploadingFiles.some((f) => f.isUploading)
                }
                aria-label="Send message"
                className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 text-white transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  background: "#03034D",
                }}
              >
                {sendMessageMutation.isPending ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Send size={15} />
                )}
              </button>
            </div>
            <p className="text-[10px] mt-1.5 px-1" style={{ color: "#9A9A9A" }}>
              Press Enter to send, Shift+Enter for new line
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DisputeMessage;
