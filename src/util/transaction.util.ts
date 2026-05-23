// Status categories for semantic grouping
import type { TransactionStatus } from "../types/request.payload.types.ts";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
export enum StatusCategory {
  INITIAL = "initial",
  IN_PROGRESS = "in_progress",
  AWAITING = "awaiting",
  SUCCESS = "success",
  FAILED = "failed",
  CANCELLED = "cancelled",
}

const PENDING_CONFIG = {
  category: StatusCategory.IN_PROGRESS,
  bgColor: "bg-amber-50",
  textColor: "text-amber-700",
  dotColor: "bg-amber-500",
  displayName: "Pending",
  description: "Transaction is being processed",
  isActionable: false,
};

const COMPLETED_CONFIG = {
  category: StatusCategory.SUCCESS,
  bgColor: "bg-green-50",
  textColor: "text-green-700",
  dotColor: "bg-green-600",
  displayName: "Completed",
  description: "Transaction completed successfully",
  isActionable: true,
};

const FAILED_CONFIG = {
  category: StatusCategory.FAILED,
  bgColor: "bg-red-50",
  textColor: "text-red-700",
  dotColor: "bg-red-600",
  displayName: "Failed",
  description: "Transaction failed",
  isActionable: true,
};

// All statuses map to Pending / Completed / Failed — the backend owns the label
const statusConfig: Record<string, typeof PENDING_CONFIG> = {
  INITIATED: { ...PENDING_CONFIG, displayName: "Pending" },
  PENDING: { ...PENDING_CONFIG, displayName: "Pending" },
  AWAITING_PAYMENT: { ...PENDING_CONFIG, displayName: "Pending" },
  PAYMENT_RECEIVED: { ...PENDING_CONFIG, displayName: "Pending" },
  PAYMENT_CONFIRMED: { ...PENDING_CONFIG, displayName: "Pending" },
  PROCESSING: { ...PENDING_CONFIG, displayName: "Pending" },
  AWAITING_CRYPTO: { ...PENDING_CONFIG, displayName: "Pending" },
  CRYPTO_SENT: { ...PENDING_CONFIG, displayName: "Pending" },
  CRYPTO_RECEIVED: { ...PENDING_CONFIG, displayName: "Pending" },
  CRYPTO_CONFIRMED: { ...PENDING_CONFIG, displayName: "Pending" },
  DEPOSIT_DETECTED: { ...PENDING_CONFIG, displayName: "Pending" },
  DEPOSIT_PENDING_MINIMUM: { ...PENDING_CONFIG, displayName: "Pending" },
  DEPOSIT_CONFIRMED: { ...PENDING_CONFIG, displayName: "Pending" },
  PAYOUT_INITIATED: { ...PENDING_CONFIG, displayName: "Pending" },
  REFUNDING: { ...PENDING_CONFIG, displayName: "Pending" },

  COMPLETED: { ...COMPLETED_CONFIG, displayName: "Completed" },
  REFUNDED: { ...COMPLETED_CONFIG, displayName: "Completed" },

  FAILED: { ...FAILED_CONFIG, displayName: "Failed" },
  EXPIRED: { ...FAILED_CONFIG, displayName: "Failed" },
  CANCELLED: { ...FAILED_CONFIG, displayName: "Failed" },
  DISPUTED: { ...FAILED_CONFIG, displayName: "Failed" },
  PAYOUT_FAILED: { ...FAILED_CONFIG, displayName: "Failed" },
};

// Utility functions
export const getStatusConfig = (status: string): typeof PENDING_CONFIG => {
  const normalizedStatus = status.toUpperCase() as TransactionStatus;
  return statusConfig[normalizedStatus] || PENDING_CONFIG;
};

export const getStatusColors = (status: string) => {
  const config = getStatusConfig(status);
  return {
    background: config.bgColor,
    text: config.textColor,
    dot: config.dotColor,
  };
};

export const getStatusDisplayName = (status: string): string => {
  const config = getStatusConfig(status);
  return config.displayName;
};

export const getStatusColor = (status: string) => {
  return getStatusColors(status).text;
};

export const getStatusDot = (status: string) => {
  return getStatusColors(status).dot;
};
