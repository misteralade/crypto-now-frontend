import type { BaseApiResponse } from "./response.payload.types.ts";

export enum KycStatusEnum {
  UNVERIFIED = "unverified",
  KYC_IN_PROGRESS = "kyc_in_progress",
  KYC_PENDING_REVIEW = "kyc_pending_review",
  KYC_VERIFIED = "kyc_verified",
  KYC_FAILED = "kyc_failed",
}

export type KycStatus =
  | "unverified"
  | "kyc_in_progress"
  | "kyc_pending_review"
  | "kyc_verified"
  | "kyc_failed";

export enum KycSessionStepEnum {
  NOT_STARTED = "Not Started",
  SUBMITTED = "submitted",
  IN_PROGRESS = "In Progress",
  IN_REVIEW = "In Review",
  RESUBMITTED = "Resubmitted",
  APPROVED = "Approved",
  DECLINED = "Declined",
  EXPIRED = "Expired",
  ABANDONED = "Abandoned",
}

export type KycSessionStep =
  | "Not Started"
  | "submitted"
  | "In Progress"
  | "In Review"
  | "Resubmitted"
  | "Approved"
  | "Declined"
  | "Expired"
  | "Abandoned";

export type KycIdType = "national_id" | "drivers_license" | "passport";

export type KycVerificationResult =
  | "pending"
  | "approved"
  | "rejected"
  | "error";

export enum KycNinStatusEnum {
  UNVERIFIED = "unverified",
  VERIFIED = "verified",
  VERIFICATION_FAILED = "verification_failed",
}

export type KycNinStatus = "unverified" | "verified" | "verification_failed";

export enum DiditSessionStatusEnum {
  NOT_STARTED = "Not Started",
  IN_PROGRESS = "In Progress",
  IN_REVIEW = "In Review",
  RESUBMITTED = "Resubmitted",
  APPROVED = "Approved",
  DECLINED = "Declined",
  EXPIRED = "Expired",
  ABANDONED = "Abandoned",
  KYC_EXPIRED = "Kyc Expired",
}

export type DiditSessionStatus =
  | "Not Started"
  | "In Progress"
  | "In Review"
  | "Resubmitted"
  | "Approved"
  | "Declined"
  | "Expired"
  | "Abandoned"
  | "Kyc Expired";

export type KycSessionResponse = {
  id: string;
  currentStep: KycSessionStep;
  selectedIdType: KycIdType | null;
  hasSelectedIdType: boolean;

  hasSubmitted: boolean;
  identityVerificationStatus: DiditSessionStatus;
  ninStatus: KycNinStatus;
  ninVerifiedName: string | null;
  ninVerificationAttempts: number;
  ninVerificationAttemptsRemaining: number;
  identityVerificationAttempts: number;
  identityVerificationAttemptsRemaining: number;
  diditSessionId: string | null;
  diditWorkflowId: string | null;
  diditCallbackStatus: string | null;
  diditWebhookStatus: string | null;
  diditSessionUrl: string | null;
  verificationUrl?: string | null;
  lastSyncedAt: string | null;
  failureReason: string | null;
  submittedAt: string | null;
  verifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type KycStatusResponse = {
  currentStep: KycSessionStep;
  identityVerificationStatus: DiditSessionStatus;
  failureReason: string | null;
  verifiedAt: string | null;
  diditCallbackStatus?: string | null;
  diditWebhookStatus?: string | null;
};

export type GetKycSessionApiResponse = BaseApiResponse<KycSessionResponse>;
export type GetKycStatusApiResponse = BaseApiResponse<KycStatusResponse>;
export type KycActionApiResponse = BaseApiResponse<KycSessionResponse | null>;
