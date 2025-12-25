import {AlertCircle, CheckCircle, Download, FileText, Paperclip, Send, Shield, User, X} from "lucide-react";
import {Fragment, useEffect, useRef, useState, type ChangeEvent} from "react";
import type {DisputeMessageResponse} from "../../../types/response.payload.types.ts";
import {LoadingSpinner} from "../../../components/global/LoadingSpinner.tsx";
import { ATTACHMENT_TYPE, TIME_IN_MILLISECONDS } from "../../../util/constants.util.ts";
import {formatFileSize, getFileType} from "../../../util/index.util.ts";
import type {MessageAttachment, AttachmentType} from "../../../types/transaction.types.ts";
import { toast } from "react-toastify";
import {useUploadQuery} from "../../../queries/upload.query.ts";
import { useDispatch } from "react-redux";
import {setDisputeMessageAttachments, setDisputeMessageText } from "../../../redux/transaction.slice.ts";

interface DisputeMessageProps {
  loading: boolean;
  messages: Array<DisputeMessageResponse>
  sendMessageMutation: any;
}

interface UploadingFile {
  id: number;
  file: File;
  name: string;
  size: number;
  type: AttachmentType;
  mimeType: string;
  localPreview: string | null;
  isUploading: boolean;
  error?: string;
}

const DisputeMessage = ({ loading, messages, sendMessageMutation }: DisputeMessageProps) => {
  const dispatch = useDispatch();
  const { uploadFileMutation } = useUploadQuery();
  
  const [message, setMessage] = useState("");
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [uploadedAttachments, setUploadedAttachments] = useState<MessageAttachment[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const lastActivityTimeRef = useRef<number>(Date.now());
  
  // Track user activity (mouse movement, scroll, and touch events)
  useEffect(() => {
    const messagesContainer = messagesContainerRef.current;
    if (!messagesContainer) return;

    const handleActivity = () => {
      lastActivityTimeRef.current = Date.now();
    };

    // Listen for mouse movement
    messagesContainer.addEventListener('mousemove', handleActivity, { passive: true });
    // Listen for mouse wheel scroll
    messagesContainer.addEventListener('wheel', handleActivity, { passive: true });
    // Listen for touch scroll (mobile)
    messagesContainer.addEventListener('touchmove', handleActivity, { passive: true });
    // Listen for scroll events (covers all scroll types)
    messagesContainer.addEventListener('scroll', handleActivity, { passive: true });

    return () => {
      messagesContainer.removeEventListener('mousemove', handleActivity);
      messagesContainer.removeEventListener('wheel', handleActivity);
      messagesContainer.removeEventListener('touchmove', handleActivity);
      messagesContainer.removeEventListener('scroll', handleActivity);
    };
  }, []);

  // Auto-scroll to bottom only if user has been idle for 120 seconds
  useEffect(() => {
    // Only check when messages change (new message arrives)
    if (messages.length === 0) return;

    const timeSinceLastActivity = Date.now() - lastActivityTimeRef.current;
    // Only auto-scroll if user has been inactive for 120 seconds
    if (timeSinceLastActivity >= TIME_IN_MILLISECONDS.ONE_HUNDRED_TWENTY_SECONDS) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  
  // Get image dimensions
  const getImageDimensions = (file: File): Promise<{ width: number; height: number } | null> => {
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
  
  // Get video duration
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
  
  // Handle file selection - Upload immediately
  const handleFileSelect = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    if (files.length === 0) return;
    
    // Add files to uploading state
    const newUploadingFiles: UploadingFile[] = files.map((file) => ({
      id: Date.now() + Math.random(),
      file: file,
      name: file.name,
      size: file.size,
      type: getFileType(file),
      mimeType: file.type || "application/octet-stream",
      localPreview: file.type.startsWith("image/") ? URL.createObjectURL(file) : null,
      isUploading: true,
    }));
    
    setUploadingFiles((prev) => [...prev, ...newUploadingFiles]);
    
    // Upload each file immediately
    for (const uploadingFile of newUploadingFiles) {
      try {
        const formData = new FormData();
        formData.append("file", uploadingFile.file);
        
        const toastId = toast.loading(`Uploading ${uploadingFile.name}...`);
        
        try {
          // Upload file
          const url = await uploadFileMutation.mutateAsync(formData);
          toast.dismiss(toastId);
          toast.success(`${uploadingFile.name} uploaded successfully`);
          
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
          toast.dismiss(toastId);
          toast.error(`Failed to upload ${uploadingFile.name}`);
          throw error;
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
  
  // Remove uploading file
  const removeUploadingFile = (fileId: number): void => {
    const file = uploadingFiles.find((f) => f.id === fileId);
    if (file?.localPreview) {
      URL.revokeObjectURL(file.localPreview);
    }
    setUploadingFiles((prev) => prev.filter((f) => f.id !== fileId));
  };
  
  // Remove uploaded attachment
  const removeAttachment = (url: string): void => {
    setUploadedAttachments((prev) => prev.filter((a) => a.url !== url));
  };
  
  // Send message
  const handleSendMessage = async () => {
    if (!message.trim() && uploadedAttachments.length === 0) {
      toast.error("Please enter a message or attach a file");
      return;
    }
    
    // Check if any files are still uploading
    if (uploadingFiles.length > 0) {
      toast.warning("Please wait for all files to finish uploading");
      return;
    }
    
    try {
      // Set message and attachments in Redux
      dispatch(setDisputeMessageText(message.trim()));
      dispatch(setDisputeMessageAttachments(uploadedAttachments));
      
      // Send message (disputeId will be passed from parent)
      await sendMessageMutation.mutateAsync();
      
      // Clear form after successful send
      setMessage("");
      setUploadedAttachments([]);
      setUploadingFiles([]);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };
  
  return (
    <Fragment>
      {loading ? (
        <LoadingSpinner size="lg" message="Loading messages..." />
      ) : (
        <div className="bg-white rounded-lg shadow-sm flex flex-col h-[calc(148vh-200px)]">
          {/* Chat Header */}
          <div className="border-b border-gray-200 p-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Conversation
            </h2>
            <p className="text-sm text-gray-500">
              Chat with support team about this dispute
            </p>
          </div>
          
          {/* Messages */}
          <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500">No messages yet</p>
                <p className="text-sm text-gray-400 mt-1">
                  Start a conversation with the support team
                </p>
              </div>
            ) : (
              messages.map((msg: DisputeMessageResponse) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${
                    msg.senderType === "USER" ? "flex-row-reverse" : ""
                  }`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      msg.senderType === "ADMIN"
                        ? "bg-blue-100"
                        : "bg-purple-100"
                    }`}
                  >
                    {msg.senderType === "ADMIN" ? (
                      <Shield className="w-4 h-4 text-blue-600" />
                    ) : (
                      <User className="w-4 h-4 text-purple-600" />
                    )}
                  </div>
                  
                  {/* Message Content */}
                  <div
                    className={`flex-1 max-w-lg ${
                      msg.senderType === "USER" ? "items-end" : "items-start"
                    } flex flex-col`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <p
                        className={`text-xs font-medium ${
                          msg.senderType === "ADMIN"
                            ? "text-blue-600"
                            : "text-purple-600"
                        }`}
                      >
                        {msg.senderType === "ADMIN" ? "Support Team" : "You"}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    
                    {msg.messageText && (
                      <div
                        className={`rounded-lg px-4 py-2 ${
                          msg.senderType === "ADMIN"
                            ? "bg-gray-100 text-gray-900"
                            : "bg-purple-600 text-white"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">
                          {msg.messageText}
                        </p>
                      </div>
                    )}
                    
                    {/* Message Attachments */}
                    {msg.attachments && msg.attachments.length > 0 && (
                      <div className="mt-2 space-y-2">
                        {msg.attachments.map((attachment, index) => (
                          <a
                            key={index}
                            href={attachment.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex items-center gap-2 p-2 rounded-lg hover:opacity-80 transition-opacity ${
                              msg.senderType === "ADMIN"
                                ? "bg-gray-100"
                                : "bg-purple-500"
                            }`}
                          >
                            {attachment.type === ATTACHMENT_TYPE.IMAGE ? (
                              <img
                                src={attachment.url}
                                alt={attachment.filename}
                                className="w-10 h-10 object-cover rounded"
                              />
                            ) : (
                              <div className="w-10 h-10 bg-white rounded flex items-center justify-center">
                                <FileText className="w-5 h-5 text-gray-400" />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p
                                className={`text-xs font-medium truncate ${
                                  msg.senderType === "ADMIN"
                                    ? "text-gray-900"
                                    : "text-white"
                                }`}
                              >
                                {attachment.filename}
                              </p>
                              <p
                                className={`text-xs ${
                                  msg.senderType === "ADMIN"
                                    ? "text-gray-500"
                                    : "text-purple-200"
                                }`}
                              >
                                {formatFileSize(attachment.size)}
                              </p>
                            </div>
                            <Download
                              className={`w-4 h-4 ${
                                msg.senderType === "ADMIN"
                                  ? "text-gray-400"
                                  : "text-white"
                              }`}
                            />
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Message Input */}
          <div className="border-t border-gray-200 p-4">
            {/* Files Preview - Both Uploading and Uploaded */}
            {(uploadingFiles.length > 0 || uploadedAttachments.length > 0) && (
              <div className="mb-3 space-y-2">
                <p className="text-sm font-medium text-gray-900">
                  Files ({uploadingFiles.length + uploadedAttachments.length})
                  {uploadingFiles.length > 0 && (
                    <span className="text-gray-500 ml-2">
                      ({uploadingFiles.length} uploading)
                    </span>
                  )}
                </p>
                
                <div className="flex flex-wrap gap-2">
                  {/* Uploading Files */}
                  {uploadingFiles.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2 border border-gray-200"
                    >
                      <FileText className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-700 max-w-[150px] truncate">
                        {file.name}
                      </span>
                      {file.isUploading && (
                        <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                      )}
                      {file.error && (
                        <span className="text-xs text-red-600">{file.error}</span>
                      )}
                      <button
                        onClick={() => removeUploadingFile(file.id)}
                        disabled={file.isUploading}
                        className="text-gray-400 hover:text-red-600 disabled:opacity-50"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  
                  {/* Uploaded Attachments */}
                  {uploadedAttachments.map((attachment, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 bg-green-50 rounded-lg px-3 py-2 border border-green-200"
                    >
                      <FileText className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-gray-700 max-w-[150px] truncate">
                        {attachment.filename}
                      </span>
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <button
                        onClick={() => removeAttachment(attachment.url)}
                        className="text-gray-400 hover:text-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Input Area */}
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
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors hover:cursor-pointer"
                disabled={sendMessageMutation.isPending}
              >
                <Paperclip className="w-5 h-5" />
              </button>
              
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Type your message..."
                rows={1}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                disabled={sendMessageMutation.isPending}
              />
              
              <button
                onClick={handleSendMessage}
                disabled={
                  sendMessageMutation.isPending ||
                  (!message.trim() && uploadedAttachments.length === 0) ||
                  uploadingFiles.length > 0
                }
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {sendMessageMutation.isPending ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>
            
            <p className="text-xs text-gray-500 mt-2">
              Press Enter to send, Shift+Enter for new line
              {uploadingFiles.length > 0 && (
                <span className="text-blue-600 ml-2">• Files uploading...</span>
              )}
            </p>
          </div>
        </div>
      )}
    </Fragment>
  )
}

export default DisputeMessage;