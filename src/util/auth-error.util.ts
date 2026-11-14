import axios from "axios";
import type { StandardizedServerError } from "../types/response.payload.types.ts";

const EMAIL_VERIFICATION_REQUIRED = "EMAIL_VERIFICATION_REQUIRED";
const LEGACY_VERIFICATION_SENT = "Account is not verified. A verification email has been sent to your email address.";

export function wasVerificationEmailSent(error: unknown): boolean {
  return axios.isAxiosError<StandardizedServerError>(error) &&
    error.response?.data?.error?.message === LEGACY_VERIFICATION_SENT;
}

export function isEmailVerificationRequired(error: unknown): boolean {
  return (axios.isAxiosError<StandardizedServerError>(error) &&
    error.response?.data?.error?.code === EMAIL_VERIFICATION_REQUIRED) || wasVerificationEmailSent(error);
}
