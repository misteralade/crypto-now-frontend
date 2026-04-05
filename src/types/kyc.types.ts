import type { BaseApiResponse } from "./response.payload.types.ts";

export type KycStatus =
  | "unverified"
  | "kyc_in_progress"
  | "kyc_pending_review"
  | "kyc_verified"
  | "kyc_failed";

export type KycSessionStep =
  | "Not Started"
  | "submitted"
  | "In Progress"
  | "In Review"
  | "Resubmitted"
  | "Approved"
  | "Declined"
  | "Expired"
  | "Abandoned"
  | "archived";

export type KycIdType = "national_id" | "drivers_license" | "passport";

export type KycVerificationResult =
  | "pending"
  | "approved"
  | "rejected"
  | "error";

export type KycNinStatus = "unverified" | "verified" | "verification_failed";

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
