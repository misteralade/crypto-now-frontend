import axios from "axios";
import type { StandardizedServerError } from "../types/response.payload.types.ts";

const EMAIL_VERIFICATION_REQUIRED = "EMAIL_VERIFICATION_REQUIRED";

export function isEmailVerificationRequired(error: unknown): boolean {
  return axios.isAxiosError<StandardizedServerError>(error) &&
    error.response?.data?.error?.code === EMAIL_VERIFICATION_REQUIRED;
}
