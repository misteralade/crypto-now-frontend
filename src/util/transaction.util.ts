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
  INITIATED: PENDING_CONFIG,
  PENDING: PENDING_CONFIG,
  AWAITING_PAYMENT: PENDING_CONFIG,
  PAYMENT_RECEIVED: PENDING_CONFIG,
  PAYMENT_CONFIRMED: PENDING_CONFIG,
  PROCESSING: PENDING_CONFIG,
  AWAITING_CRYPTO: PENDING_CONFIG,
  CRYPTO_SENT: PENDING_CONFIG,
  CRYPTO_RECEIVED: PENDING_CONFIG,
  CRYPTO_CONFIRMED: PENDING_CONFIG,
  PAYMENT_ACCOUNT_CONFIRMED: PENDING_CONFIG,
  DEPOSIT_DETECTED: PENDING_CONFIG,
  DEPOSIT_CONFIRMED: PENDING_CONFIG,
  PAYOUT_INITIATED: PENDING_CONFIG,
  REFUNDING: PENDING_CONFIG,

  COMPLETED: COMPLETED_CONFIG,
  REFUNDED: COMPLETED_CONFIG,

  FAILED: FAILED_CONFIG,
  EXPIRED: FAILED_CONFIG,
  CANCELLED: FAILED_CONFIG,
  DISPUTED: FAILED_CONFIG,
  PAYOUT_FAILED: FAILED_CONFIG,
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
  return getStatusConfig(status).displayName;
};

export const getStatusColor = (status: string) => {
  return getStatusColors(status).text;
};

export const getStatusDot = (status: string) => {
  return getStatusColors(status).dot;
};
