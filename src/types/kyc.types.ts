import type { BaseApiResponse } from "./response.payload.types.ts";

export type KycStatus =
  | "unverified"
  | "kyc_in_progress"
  | "kyc_pending_review"
  | "kyc_verified"
  | "kyc_failed";

export type KycSessionStep =
  | "not_started"
  | "id_type_selected"
  | "front_uploaded"
  | "back_uploaded"
  | "selfie_uploaded"
  | "submitted"
  | "processing"
  | "verified"
  | "failed"
  | "archived";

export type KycIdType = "national_id" | "drivers_license" | "passport";

export type KycVerificationResult =
  | "pending"
  | "approved"
  | "rejected"
  | "error";

export type KycNinBvnType = "none" | "nin" | "bvn";

export type KycNinStatus = "pending_future_verification";

export type KycSessionResponse = {
  id: string;
  sessionId?: string | null;
  internalKycId?: string;
  userId: string;
  currentStep: KycSessionStep;
  selectedIdType: KycIdType | null;
  hasSelectedIdType: boolean;
  hasCompletedFrontUpload: boolean;
  hasCompletedBackUpload: boolean;
  hasCompletedSelfieCapture: boolean;
  hasSubmitted: boolean;
  hasCompletedDocumentVerification: boolean;
  hasCompletedFaceMatching: boolean;
  documentVerificationStatus: KycVerificationResult;
  faceMatchStatus: KycVerificationResult;
  ninBvnType: KycNinBvnType | null;
  ninStatus?: KycNinStatus;
  diditSessionId?: string | null;
  diditWorkflowId?: string | null;
  diditCallbackStatus?: string | null;
  diditWebhookStatus?: string | null;
  diditSessionUrl?: string | null;
  lastSyncedAt?: string | null;
  failureReason: string | null;
  retryCount: number;
  maxRetries: number;
  submittedAt: string | null;
  verifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type KycStatusResponse = {
  currentStep: KycSessionStep;
  documentVerificationStatus: KycVerificationResult;
  faceMatchStatus: KycVerificationResult;
  failureReason: string | null;
  retryCount: number;
  maxRetries: number;
  verifiedAt: string | null;
  diditCallbackStatus?: string | null;
  diditWebhookStatus?: string | null;
};

export type GetKycSessionApiResponse = BaseApiResponse<KycSessionResponse>;
export type GetKycStatusApiResponse = BaseApiResponse<KycStatusResponse>;
export type KycActionApiResponse = BaseApiResponse<KycSessionResponse | null>;
