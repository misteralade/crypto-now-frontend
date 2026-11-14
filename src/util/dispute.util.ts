import {
  AlertCircle,
  CheckCircle2,
  Clock,
  HelpCircle,
  Loader2,
  XCircle,
  Zap,
  type LucideIcon,
} from "lucide-react";

export const DISPUTE_STATUS = {
  OPEN: "OPEN",
  UNDER_REVIEW: "UNDER_REVIEW",
  AWAITING_EVIDENCE: "AWAITING_EVIDENCE",
  AWAITING_USER_RESPONSE: "AWAITING_USER_RESPONSE",
  AWAITING_ADMIN_RESPONSE: "AWAITING_ADMIN_RESPONSE",
  ESCALATED: "ESCALATED",
  RESOLVED: "RESOLVED",
  REJECTED: "REJECTED",
  CLOSED: "CLOSED",
} as const;

export type DisputeStatusType =
  (typeof DISPUTE_STATUS)[keyof typeof DISPUTE_STATUS];

export const DISPUTE_PRIORITY = {
  LOW: "LOW",
  NORMAL: "NORMAL",
  HIGH: "HIGH",
  URGENT: "URGENT",
} as const;

export type DisputePriorityType =
  (typeof DISPUTE_PRIORITY)[keyof typeof DISPUTE_PRIORITY];

export const DISPUTE_SENDER_TYPE = {
  USER: "USER",
  ADMIN: "ADMIN",
} as const;

export type DisputeSenderType =
  (typeof DISPUTE_SENDER_TYPE)[keyof typeof DISPUTE_SENDER_TYPE];

export interface DisputeStatusConfig {
  label: string;
  description: string;
  bg: string;
  text: string;
  border: string;
  dot: string;
  icon: LucideIcon;
}

export const DISPUTE_STATUS_CONFIG: Record<DisputeStatusType, DisputeStatusConfig> = {
  [DISPUTE_STATUS.OPEN]: {
    label: "Open",
    description: "Your dispute has been logged. Our team will review your case shortly.",
    bg: "#FEF6E7",
    text: "#B45309",
    border: "#FDE68A",
    dot: "#F59E0B",
    icon: Clock,
  },
  [DISPUTE_STATUS.UNDER_REVIEW]: {
    label: "Under Review",
    description: "A support specialist is actively reviewing this transaction and your submitted information.",
    bg: "#F0EFFD",
    text: "#575AE5",
    border: "#C7C4F5",
    dot: "#948EEE",
    icon: Loader2,
  },
  [DISPUTE_STATUS.AWAITING_EVIDENCE]: {
    label: "Awaiting Evidence",
    description: "Additional documentation or proof of payment is requested to proceed with the review.",
    bg: "#FEF6E7",
    text: "#B45309",
    border: "#FDE68A",
    dot: "#F59E0B",
    icon: HelpCircle,
  },
  [DISPUTE_STATUS.AWAITING_USER_RESPONSE]: {
    label: "Action Needed",
    description: "Our support team sent a question. Please reply in the conversation below.",
    bg: "#FEF6E7",
    text: "#B45309",
    border: "#FDE68A",
    dot: "#F59E0B",
    icon: Zap,
  },
  [DISPUTE_STATUS.AWAITING_ADMIN_RESPONSE]: {
    label: "Awaiting Team Reply",
    description: "Your message has been received. Our team will respond as soon as possible.",
    bg: "#F0EFFD",
    text: "#575AE5",
    border: "#C7C4F5",
    dot: "#948EEE",
    icon: Clock,
  },
  [DISPUTE_STATUS.ESCALATED]: {
    label: "Escalated",
    description: "This dispute has been escalated to senior review for priority resolution.",
    bg: "#FEECEC",
    text: "#EB5757",
    border: "#F5C0C0",
    dot: "#EB5757",
    icon: AlertCircle,
  },
  [DISPUTE_STATUS.RESOLVED]: {
    label: "Resolved",
    description: "This dispute has been resolved. Check the resolution notes for details.",
    bg: "#E8F8F0",
    text: "#037847",
    border: "#B7EAD0",
    dot: "#12B76A",
    icon: CheckCircle2,
  },
  [DISPUTE_STATUS.REJECTED]: {
    label: "Declined",
    description: "This dispute was reviewed and declined. See the resolution notes for details.",
    bg: "#FEECEC",
    text: "#EB5757",
    border: "#F5C0C0",
    dot: "#EB5757",
    icon: XCircle,
  },
  [DISPUTE_STATUS.CLOSED]: {
    label: "Closed",
    description: "This dispute case is now closed.",
    bg: "#F7F7F9",
    text: "#6B6E6B",
    border: "#EEEEEE",
    dot: "#9A9A9A",
    icon: CheckCircle2,
  },
};

export const DISPUTE_PRIORITY_CONFIG: Record<
  DisputePriorityType,
  { label: string; bg: string; text: string; border: string }
> = {
  [DISPUTE_PRIORITY.LOW]: {
    label: "Low",
    bg: "#F7F7F9",
    text: "#6B6E6B",
    border: "#EEEEEE",
  },
  [DISPUTE_PRIORITY.NORMAL]: {
    label: "Normal",
    bg: "#F0EFFD",
    text: "#575AE5",
    border: "#C7C4F5",
  },
  [DISPUTE_PRIORITY.HIGH]: {
    label: "High",
    bg: "#FEF6E7",
    text: "#B45309",
    border: "#FDE68A",
  },
  [DISPUTE_PRIORITY.URGENT]: {
    label: "Urgent",
    bg: "#FEECEC",
    text: "#EB5757",
    border: "#F5C0C0",
  },
};

export function getDisputeStatusConfig(status?: string | null): DisputeStatusConfig {
  if (status && status in DISPUTE_STATUS_CONFIG) {
    return DISPUTE_STATUS_CONFIG[status as DisputeStatusType];
  }
  return DISPUTE_STATUS_CONFIG[DISPUTE_STATUS.OPEN];
}

export function isDisputeClosed(status?: string | null): boolean {
  return (
    status === DISPUTE_STATUS.RESOLVED ||
    status === DISPUTE_STATUS.REJECTED ||
    status === DISPUTE_STATUS.CLOSED
  );
}

export function formatDisputeReason(reason?: string | null): string {
  if (!reason) return "Transaction Issue";
  const normalized = reason.toLowerCase();
  if (normalized === "payment_not_received") return "Payment not received";
  if (normalized === "wrong_amount") return "Incorrect amount";
  if (normalized === "transaction_delayed") return "Transaction delayed";
  if (normalized === "other") return "Other issue";
  return reason.replace(/_/g, " ");
}
