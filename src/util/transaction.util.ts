// Status categories for semantic grouping

export const TRANSACTION_STATUS = {
  INITIATED: "INITIATED",
  AWAITING_PAYMENT: "AWAITING_PAYMENT",
  IN_REVIEW: "IN_REVIEW",
  PROCESSING: "PROCESSING",
  AWAITING_CRYPTO: "AWAITING_CRYPTO",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
  EXPIRED: "EXPIRED",
  CANCELLED: "CANCELLED",
  DISPUTED: "DISPUTED",
  REFUNDED: "REFUNDED",
  DEPOSIT_DETECTED: "DEPOSIT_DETECTED",
  PENDING_CONFIRMATION: "PENDING_CONFIRMATION",
  DEPOSIT_PENDING_MINIMUM: "DEPOSIT_PENDING_MINIMUM",
  DEPOSIT_CONFIRMED: "DEPOSIT_CONFIRMED",
  NO_OWNER: "NO_OWNER",
  PAYOUT_INITIATED: "PAYOUT_INITIATED",
  PENDING_PAYOUT: "PENDING_PAYOUT",
  PAYOUT_FAILED: "PAYOUT_FAILED",
} as const;

export type TransactionStatusType =
  (typeof TRANSACTION_STATUS)[keyof typeof TRANSACTION_STATUS];

export const TRANSACTION_TYPE = {
  BUY: "BUY",
  SELL: "SELL",
} as const;

export type TransactionTypeValue =
  (typeof TRANSACTION_TYPE)[keyof typeof TRANSACTION_TYPE];

/**
 * User-facing high-level transaction status categories.
 */
export const TRANSACTION_STATUS_CATEGORY = {
  PENDING: "PENDING",
  IN_REVIEW: "IN_REVIEW",
  ACTION_NEEDED: "ACTION_NEEDED",
  SUCCESSFUL: "SUCCESSFUL",
  REFUNDED: "REFUNDED",
  DISPUTED: "DISPUTED",
  EXPIRED: "EXPIRED",
  CANCELLED: "CANCELLED",
  FAILED: "FAILED",
} as const;

export type TransactionStatusCategory =
  (typeof TRANSACTION_STATUS_CATEGORY)[keyof typeof TRANSACTION_STATUS_CATEGORY];

// Backward-compatibility alias
export const StatusCategory = TRANSACTION_STATUS_CATEGORY;

export interface TransactionStatusDisplayConfig {
  category: TransactionStatusCategory;
  displayName: string;
  title: string;
  message: string;
  bgColor: string;
  textColor: string;
  dotColor: string;
  borderColor: string;
  style: {
    background: string;
    color: string;
    border: string;
  };
  isActionable: boolean;
}

const DEFAULT_STATUS_CONFIG: TransactionStatusDisplayConfig = {
  category: TRANSACTION_STATUS_CATEGORY.PENDING,
  displayName: "Pending",
  title: "Transaction Pending",
  message: "Your transaction is currently being processed.",
  bgColor: "bg-blue-50",
  textColor: "text-blue-700",
  dotColor: "bg-blue-500",
  borderColor: "border-blue-200",
  style: {
    background: "#F0EFFD",
    color: "#575AE5",
    border: "#C7C4F5",
  },
  isActionable: false,
};

export const TRANSACTION_STATUS_CONFIG: Record<
  TransactionStatusType,
  TransactionStatusDisplayConfig
> = {
  [TRANSACTION_STATUS.INITIATED]: {
    category: TRANSACTION_STATUS_CATEGORY.PENDING,
    displayName: "Pending",
    title: "Transaction Pending",
    message: "Your transaction has been initiated.",
    bgColor: "bg-blue-50",
    textColor: "text-blue-700",
    dotColor: "bg-blue-500",
    borderColor: "border-blue-200",
    style: {
      background: "#F0EFFD",
      color: "#575AE5",
      border: "#C7C4F5",
    },
    isActionable: false,
  },
  [TRANSACTION_STATUS.AWAITING_PAYMENT]: {
    category: TRANSACTION_STATUS_CATEGORY.PENDING,
    displayName: "Pending",
    title: "Awaiting Payment",
    message: "Please complete payment using the provided details and upload your payment receipt.",
    bgColor: "bg-yellow-50",
    textColor: "text-yellow-700",
    dotColor: "bg-yellow-500",
    borderColor: "border-yellow-200",
    style: {
      background: "#FFFBF0",
      color: "#B45309",
      border: "#FDE68A",
    },
    isActionable: true,
  },
  [TRANSACTION_STATUS.IN_REVIEW]: {
    category: TRANSACTION_STATUS_CATEGORY.IN_REVIEW,
    displayName: "In Review",
    title: "Payment Under Review",
    message: "Your payment receipt has been submitted and is currently being verified by our team.",
    bgColor: "bg-amber-50",
    textColor: "text-amber-700",
    dotColor: "bg-amber-500",
    borderColor: "border-amber-200",
    style: {
      background: "#FFF7ED",
      color: "#C2410C",
      border: "#FED7AA",
    },
    isActionable: false,
  },
  [TRANSACTION_STATUS.PROCESSING]: {
    category: TRANSACTION_STATUS_CATEGORY.PENDING,
    displayName: "Pending",
    title: "Processing Transaction",
    message: "Your transaction is being processed.",
    bgColor: "bg-blue-50",
    textColor: "text-blue-700",
    dotColor: "bg-blue-500",
    borderColor: "border-blue-200",
    style: {
      background: "#F0EFFD",
      color: "#575AE5",
      border: "#C7C4F5",
    },
    isActionable: false,
  },
  [TRANSACTION_STATUS.AWAITING_CRYPTO]: {
    category: TRANSACTION_STATUS_CATEGORY.PENDING,
    displayName: "Pending",
    title: "Awaiting Crypto Transfer",
    message: "Waiting to detect your crypto deposit on the network.",
    bgColor: "bg-blue-50",
    textColor: "text-blue-700",
    dotColor: "bg-blue-500",
    borderColor: "border-blue-200",
    style: {
      background: "#F0EFFD",
      color: "#575AE5",
      border: "#C7C4F5",
    },
    isActionable: true,
  },
  [TRANSACTION_STATUS.DEPOSIT_DETECTED]: {
    category: TRANSACTION_STATUS_CATEGORY.PENDING,
    displayName: "Pending",
    title: "Deposit Detected",
    message: "We detected your deposit on the blockchain. Waiting for network confirmations.",
    bgColor: "bg-blue-50",
    textColor: "text-blue-700",
    dotColor: "bg-blue-500",
    borderColor: "border-blue-200",
    style: {
      background: "#F0EFFD",
      color: "#575AE5",
      border: "#C7C4F5",
    },
    isActionable: false,
  },
  [TRANSACTION_STATUS.PENDING_CONFIRMATION]: {
    category: TRANSACTION_STATUS_CATEGORY.PENDING,
    displayName: "Pending",
    title: "Pending Confirmation",
    message: "Waiting for the required network block confirmations.",
    bgColor: "bg-blue-50",
    textColor: "text-blue-700",
    dotColor: "bg-blue-500",
    borderColor: "border-blue-200",
    style: {
      background: "#F0EFFD",
      color: "#575AE5",
      border: "#C7C4F5",
    },
    isActionable: false,
  },
  [TRANSACTION_STATUS.DEPOSIT_PENDING_MINIMUM]: {
    category: TRANSACTION_STATUS_CATEGORY.ACTION_NEEDED,
    displayName: "Action Needed",
    title: "Deposit Below Minimum",
    message: "We received your deposit, but it is below the minimum required amount. Send the remaining amount to proceed automatically.",
    bgColor: "bg-orange-50",
    textColor: "text-orange-700",
    dotColor: "bg-orange-500",
    borderColor: "border-orange-200",
    style: {
      background: "#FFF7ED",
      color: "#EA580C",
      border: "#FED7AA",
    },
    isActionable: true,
  },
  [TRANSACTION_STATUS.DEPOSIT_CONFIRMED]: {
    category: TRANSACTION_STATUS_CATEGORY.PENDING,
    displayName: "Pending",
    title: "Deposit Confirmed",
    message: "Your crypto deposit has been confirmed. Processing your bank payout.",
    bgColor: "bg-blue-50",
    textColor: "text-blue-700",
    dotColor: "bg-blue-500",
    borderColor: "border-blue-200",
    style: {
      background: "#F0EFFD",
      color: "#575AE5",
      border: "#C7C4F5",
    },
    isActionable: false,
  },
  [TRANSACTION_STATUS.PAYOUT_INITIATED]: {
    category: TRANSACTION_STATUS_CATEGORY.PENDING,
    displayName: "Pending",
    title: "Payout Initiated",
    message: "Your payout has been initiated and is being processed by the bank.",
    bgColor: "bg-blue-50",
    textColor: "text-blue-700",
    dotColor: "bg-blue-500",
    borderColor: "border-blue-200",
    style: {
      background: "#F0EFFD",
      color: "#575AE5",
      border: "#C7C4F5",
    },
    isActionable: false,
  },
  [TRANSACTION_STATUS.PENDING_PAYOUT]: {
    category: TRANSACTION_STATUS_CATEGORY.PENDING,
    displayName: "Pending",
    title: "Processing Payout",
    message: "Your payout is queued and will be processed shortly.",
    bgColor: "bg-blue-50",
    textColor: "text-blue-700",
    dotColor: "bg-blue-500",
    borderColor: "border-blue-200",
    style: {
      background: "#F0EFFD",
      color: "#575AE5",
      border: "#C7C4F5",
    },
    isActionable: false,
  },
  [TRANSACTION_STATUS.PAYOUT_FAILED]: {
    category: TRANSACTION_STATUS_CATEGORY.ACTION_NEEDED,
    displayName: "Action Needed",
    title: "Payout Failed",
    message: "The transfer to your bank account could not be completed. Please check your bank details or contact support.",
    bgColor: "bg-red-50",
    textColor: "text-red-700",
    dotColor: "bg-red-500",
    borderColor: "border-red-200",
    style: {
      background: "#FEECEC",
      color: "#EB5757",
      border: "#F5C0C0",
    },
    isActionable: true,
  },
  [TRANSACTION_STATUS.COMPLETED]: {
    category: TRANSACTION_STATUS_CATEGORY.SUCCESSFUL,
    displayName: "Successful",
    title: "Transaction Successful",
    message: "Your transaction has completed successfully.",
    bgColor: "bg-green-50",
    textColor: "text-green-700",
    dotColor: "bg-green-500",
    borderColor: "border-green-200",
    style: {
      background: "#E8F8F0",
      color: "#037847",
      border: "#A8E6C8",
    },
    isActionable: false,
  },
  [TRANSACTION_STATUS.DISPUTED]: {
    category: TRANSACTION_STATUS_CATEGORY.DISPUTED,
    displayName: "Disputed",
    title: "Transaction Disputed",
    message: "This transaction is currently under dispute review. Our support team is handling the case.",
    bgColor: "bg-purple-50",
    textColor: "text-purple-700",
    dotColor: "bg-purple-500",
    borderColor: "border-purple-200",
    style: {
      background: "#F5F3FF",
      color: "#7C3AED",
      border: "#DDD6FE",
    },
    isActionable: true,
  },
  [TRANSACTION_STATUS.REFUNDED]: {
    category: TRANSACTION_STATUS_CATEGORY.REFUNDED,
    displayName: "Refunded",
    title: "Refund Completed",
    message: "Your refund has been processed and funds returned to your original payment method.",
    bgColor: "bg-emerald-50",
    textColor: "text-emerald-700",
    dotColor: "bg-emerald-500",
    borderColor: "border-emerald-200",
    style: {
      background: "#ECFDF5",
      color: "#047857",
      border: "#A7F3D0",
    },
    isActionable: false,
  },
  [TRANSACTION_STATUS.EXPIRED]: {
    category: TRANSACTION_STATUS_CATEGORY.EXPIRED,
    displayName: "Expired",
    title: "Transaction Expired",
    message: "This transaction expired because payment was not completed within the allowed time.",
    bgColor: "bg-gray-100",
    textColor: "text-gray-700",
    dotColor: "bg-gray-400",
    borderColor: "border-gray-200",
    style: {
      background: "#F4F4F5",
      color: "#52525B",
      border: "#E4E4E7",
    },
    isActionable: false,
  },
  [TRANSACTION_STATUS.CANCELLED]: {
    category: TRANSACTION_STATUS_CATEGORY.CANCELLED,
    displayName: "Cancelled",
    title: "Transaction Cancelled",
    message: "This transaction was cancelled.",
    bgColor: "bg-gray-100",
    textColor: "text-gray-700",
    dotColor: "bg-gray-400",
    borderColor: "border-gray-200",
    style: {
      background: "#F4F4F5",
      color: "#52525B",
      border: "#E4E4E7",
    },
    isActionable: false,
  },
  [TRANSACTION_STATUS.FAILED]: {
    category: TRANSACTION_STATUS_CATEGORY.FAILED,
    displayName: "Failed",
    title: "Transaction Failed",
    message: "This transaction could not be completed. Please contact support for assistance.",
    bgColor: "bg-red-50",
    textColor: "text-red-700",
    dotColor: "bg-red-500",
    borderColor: "border-red-200",
    style: {
      background: "#FEECEC",
      color: "#EB5757",
      border: "#F5C0C0",
    },
    isActionable: true,
  },
  [TRANSACTION_STATUS.NO_OWNER]: {
    category: TRANSACTION_STATUS_CATEGORY.FAILED,
    displayName: "Under Review",
    title: "Deposit Under Review",
    message: "Deposit received on an unlinked address. Held for manual review.",
    bgColor: "bg-amber-50",
    textColor: "text-amber-700",
    dotColor: "bg-amber-500",
    borderColor: "border-amber-200",
    style: {
      background: "#FFF7ED",
      color: "#C2410C",
      border: "#FED7AA",
    },
    isActionable: false,
  },
};

/**
 * `amountFiat` is stored in the transaction's settlement `currency`, which is
 * USD for stablecoin trades: not always NGN. Anywhere the amount is shown
 * with a ₦ symbol must convert through `stableToFiatRate` first.
 */
export function getTransactionAmountFiatNGN(tx: {
  amountFiat: string | number;
  currency: string;
  stableToFiatRate: string | number;
}): number {
  const amountFiat = Number(tx.amountFiat ?? 0);
  const stableToFiatRate = Number(tx.stableToFiatRate ?? 0);
  if (tx.currency === "NGN") return amountFiat;
  if (tx.currency === "USD" && stableToFiatRate > 0)
    return amountFiat * stableToFiatRate;
  return amountFiat;
}

// Utility functions
export const getStatusConfig = (status?: string | null): TransactionStatusDisplayConfig => {
  if (!status) return DEFAULT_STATUS_CONFIG;
  const normalizedStatus = status.toUpperCase() as TransactionStatusType;
  return TRANSACTION_STATUS_CONFIG[normalizedStatus] || DEFAULT_STATUS_CONFIG;
};

export const getStatusColors = (status?: string | null) => {
  const config = getStatusConfig(status);
  return {
    background: config.bgColor,
    text: config.textColor,
    dot: config.dotColor,
  };
};

export const getStatusDisplayName = (status?: string | null): string => {
  const config = getStatusConfig(status);
  return config.displayName;
};

export const getStatusColor = (status?: string | null) => {
  return getStatusColors(status).text;
};

export const getStatusDot = (status?: string | null) => {
  return getStatusColors(status).dot;
};

export const getStatusBadgeStyle = (status?: string | null) => {
  return getStatusConfig(status).style;
};

