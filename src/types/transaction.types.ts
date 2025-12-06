import type { LucideIcon } from "lucide-react";
import type {FileType} from "../util/constants.util.ts";

// Attachment type as string literal union
export type AttachmentType =
  | 'IMAGE'
  | 'VIDEO'
  | 'PDF'
  | 'DOCUMENT'
  | 'AUDIO'
  | 'SPREADSHEET'
  | 'OTHER';

// Message attachment interface
export interface MessageAttachment {
  url: string;
  type: AttachmentType;
  filename: string;
  size: number; // in bytes
  mimeType: string;
  uploadedAt: Date;
  metadata?: {
    width?: number;
    height?: number;
    duration?: number; // for videos in seconds
    pageCount?: number; // for PDFs
    [key: string]: any;
  };
}

// File type config for UI
export interface FileTypeConfig {
  accept: string;
  icon: LucideIcon;
  color: string;
  label: string;
}

// Legacy FileType (for backward compatibility)
export type FileType =
  | 'IMAGE'
  | 'VIDEO'
  | 'PDF'
  | 'DOCUMENT'
  | 'AUDIO'
  | 'SPREADSHEET';

// Legacy UploadedFile interface (for backward compatibility)
export interface UploadedFile {
  id: number;
  file: File;
  name: string;
  size: number;
  type: FileType;
  preview: string | null;
}

// Dispute submission payload
export interface DisputeSubmission {
  transactionId: string;
  reason: string;
  attachments: MessageAttachment[];
}