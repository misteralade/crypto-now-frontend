// Status categories for semantic grouping
import type {TransactionStatus} from "../types/request.payload.types.ts";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
export enum StatusCategory {
  INITIAL = 'initial',
  IN_PROGRESS = 'in_progress',
  AWAITING = 'awaiting',
  SUCCESS = 'success',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

// Status configuration with colors and metadata
const statusConfig: Record<TransactionStatus, {
  category: StatusCategory;
  bgColor: string;
  textColor: string;
  dotColor: string;
  displayName: string;
  description: string;
  isActionable: boolean;
}> = {
  // Initial statuses
  INITIATED: {
    category: StatusCategory.INITIAL,
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    dotColor: 'bg-blue-500',
    displayName: 'Initiated',
    description: 'Transaction has been started',
    isActionable: false,
  },

  // In progress statuses
  PENDING: {
    category: StatusCategory.IN_PROGRESS,
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-700',
    dotColor: 'bg-amber-500',
    displayName: 'Pending',
    description: 'Transaction is being processed',
    isActionable: false,
  },
  PROCESSING: {
    category: StatusCategory.IN_PROGRESS,
    bgColor: 'bg-indigo-50',
    textColor: 'text-indigo-700',
    dotColor: 'bg-indigo-500',
    displayName: 'Processing',
    description: 'Transaction is currently being processed',
    isActionable: false,
  },
  PAYMENT_CONFIRMED: {
    category: StatusCategory.IN_PROGRESS,
    bgColor: 'bg-cyan-50',
    textColor: 'text-cyan-700',
    dotColor: 'bg-cyan-500',
    displayName: 'Payment Confirmed',
    description: 'Payment has been confirmed',
    isActionable: false,
  },
  PAYMENT_ACCOUNT_CONFIRMED: {
    category: StatusCategory.IN_PROGRESS,
    bgColor: 'bg-teal-50',
    textColor: 'text-teal-700',
    dotColor: 'bg-teal-500',
    displayName: 'Account Confirmed',
    description: 'Payment account has been confirmed',
    isActionable: false,
  },
  CRYPTO_SENT: {
    category: StatusCategory.IN_PROGRESS,
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-700',
    dotColor: 'bg-purple-500',
    displayName: 'Crypto Sent',
    description: 'Cryptocurrency has been sent',
    isActionable: false,
  },
  CRYPTO_CONFIRMED: {
    category: StatusCategory.IN_PROGRESS,
    bgColor: 'bg-violet-50',
    textColor: 'text-violet-700',
    dotColor: 'bg-violet-500',
    displayName: 'Crypto Confirmed',
    description: 'Cryptocurrency transaction confirmed',
    isActionable: false,
  },

  // Awaiting statuses
  AWAITING_PAYMENT: {
    category: StatusCategory.AWAITING,
    bgColor: 'bg-yellow-50',
    textColor: 'text-yellow-700',
    dotColor: 'bg-yellow-500',
    displayName: 'Awaiting Payment',
    description: 'Waiting for payment to be received',
    isActionable: true,
  },
  PAYMENT_RECEIVED: {
    category: StatusCategory.AWAITING,
    bgColor: 'bg-lime-50',
    textColor: 'text-lime-700',
    dotColor: 'bg-lime-500',
    displayName: 'Payment Received',
    description: 'Payment has been received, awaiting confirmation',
    isActionable: false,
  },
  AWAITING_CRYPTO: {
    category: StatusCategory.AWAITING,
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-700',
    dotColor: 'bg-orange-500',
    displayName: 'Awaiting Crypto',
    description: 'Waiting for cryptocurrency transaction',
    isActionable: false,
  },
  CRYPTO_RECEIVED: {
    category: StatusCategory.AWAITING,
    bgColor: 'bg-emerald-50',
    textColor: 'text-emerald-700',
    dotColor: 'bg-emerald-500',
    displayName: 'Crypto Received',
    description: 'Cryptocurrency received, awaiting confirmation',
    isActionable: false,
  },

  // Success statuses
  COMPLETED: {
    category: StatusCategory.SUCCESS,
    bgColor: 'bg-green-50',
    textColor: 'text-green-700',
    dotColor: 'bg-green-600',
    displayName: 'Completed',
    description: 'Transaction completed successfully',
    isActionable: true,
  },
  REFUNDED: {
    category: StatusCategory.SUCCESS,
    bgColor: 'bg-green-50',
    textColor: 'text-green-700',
    dotColor: 'bg-green-500',
    displayName: 'Refunded',
    description: 'Transaction has been refunded',
    isActionable: true,
  },

  // Failed statuses
  FAILED: {
    category: StatusCategory.FAILED,
    bgColor: 'bg-red-50',
    textColor: 'text-red-700',
    dotColor: 'bg-red-600',
    displayName: 'Failed',
    description: 'Transaction failed',
    isActionable: true,
  },
  EXPIRED: {
    category: StatusCategory.FAILED,
    bgColor: 'bg-red-50',
    textColor: 'text-red-600',
    dotColor: 'bg-red-500',
    displayName: 'Expired',
    description: 'Transaction has expired',
    isActionable: true,
  },
  DISPUTED: {
    category: StatusCategory.FAILED,
    bgColor: 'bg-rose-50',
    textColor: 'text-rose-700',
    dotColor: 'bg-rose-500',
    displayName: 'Disputed',
    description: 'Transaction is under dispute',
    isActionable: true,
  },

  // Cancelled statuses
  CANCELLED: {
    category: StatusCategory.CANCELLED,
    bgColor: 'bg-gray-50',
    textColor: 'text-gray-700',
    dotColor: 'bg-gray-500',
    displayName: 'Cancelled',
    description: 'Transaction was cancelled',
    isActionable: true,
  },
  REFUNDING: {
    category: StatusCategory.CANCELLED,
    bgColor: 'bg-slate-50',
    textColor: 'text-slate-700',
    dotColor: 'bg-slate-500',
    displayName: 'Refunding',
    description: 'Refund is being processed',
    isActionable: false,
  },
};

// Utility functions
export const getStatusConfig = (status: string): typeof statusConfig[TransactionStatus] => {
  const normalizedStatus = status.toUpperCase() as TransactionStatus;
  return statusConfig[normalizedStatus] || {
    category: StatusCategory.IN_PROGRESS,
    bgColor: 'bg-gray-50',
    textColor: 'text-gray-700',
    dotColor: 'bg-gray-500',
    displayName: status,
    description: 'Unknown status',
    isActionable: false,
  };
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

export const getStatusDescription = (status: string): string => {
  return getStatusConfig(status).description;
};

export const isStatusActionable = (status: string): boolean => {
  return getStatusConfig(status).isActionable;
};

export const getStatusCategory = (status: string): StatusCategory => {
  return getStatusConfig(status).category;
};

// Filter functions for different status categories
export const isSuccessStatus = (status: string): boolean => {
  return getStatusCategory(status) === StatusCategory.SUCCESS;
};

export const isFailedStatus = (status: string): boolean => {
  return getStatusCategory(status) === StatusCategory.FAILED;
};

export const isPendingStatus = (status: string): boolean => {
  const category = getStatusCategory(status);
  return category === StatusCategory.IN_PROGRESS || category === StatusCategory.AWAITING;
};

export const isFinalStatus = (status: string): boolean => {
  const category = getStatusCategory(status);
  return category === StatusCategory.SUCCESS ||
    category === StatusCategory.FAILED ||
    category === StatusCategory.CANCELLED;
};

// Get icon color for download button
export const getDownloadIconColor = (status: string): string => {
  if (isSuccessStatus(status) || isFailedStatus(status)) {
    return "text-accent1 cursor-pointer";
  }
  return "text-grey4 cursor-not-allowed";
};

// Check if download should be disabled
export const isDownloadDisabled = (status: string): boolean => {
  return !isFinalStatus(status);
};

// Simple function to get status colors (compatible with Material Tailwind)
export const getStatusColor = (status: string): string => {
  const config = getStatusConfig(status);
  return `${config.textColor} ${config.bgColor}`;
};

// Simple function to get status dot colors
export const getStatusDot = (status: string): string => {
  const config = getStatusConfig(status);
  return config.dotColor;
};
