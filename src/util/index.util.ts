import millify from "millify";
import {LOCAL_STORAGE_KEYS} from "./constants.util.ts";
import type {AxiosServerError} from "../types/response.payload.types.ts";
import {ZodError} from "zod";

export const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
}

export const handleLogout = () => {
  localStorage.removeItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
  window.location.href = "/sign-in";
}

export const formatNumber = (value: string | number) => {
  return parseFloat(value.toString()).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 8,
  })
}

export const convertToMillify = (num: number, precision: number = 2): string => {
  const safe = Number.isFinite(num) ? num : 0;
  return millify(safe, { precision });
}

export const getFileType = (file: File) => {
  if (file.type.startsWith('image/')) return 'IMAGE';
  if (file.type.startsWith('video/')) return 'VIDEO';
  if (file.type === 'application/pdf') return 'PDF';
  if (file.type.startsWith('audio/')) return 'AUDIO';
  if (file.name.match(/\.(xls|xlsx|csv)$/)) return 'SPREADSHEET';
  return 'DOCUMENT';
};

export const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Extracts error messages from various error types including:
 * - Axios server errors with StandardizedServerError format
 * - ZodError instances (client-side validation)
 * - Server-side Zod validation errors in BaseApiResponse format
 * - Generic Error objects
 * 
 * @param error - The error object to extract message from
 * @returns A formatted error message string or undefined
 */
export const extractErrorMessage = (error: AxiosServerError | ZodError | Error | unknown): string | undefined => {
  // Handle ZodError instances (client-side validation)
  // Handle server-side ZodError
  if (error && typeof error === 'object' && 'response' in error) {
    const axiosError = error as AxiosServerError;
    const errorData = axiosError?.response?.data?.error;
    
    if (errorData && typeof errorData === 'object' && 'name' in errorData && errorData.name === 'ZodError' && 'errors' in errorData) {
      const errors = errorData.errors as Record<string, { _errors?: string[] }>;
      const validationErrors: string[] = [];
      
      for (const [field, fieldError] of Object.entries(errors)) {
        if (field !== '_errors' && fieldError && typeof fieldError === 'object' && '_errors' in fieldError) {
          const errorMessages = (fieldError as { _errors?: string[] })._errors;
          if (errorMessages && Array.isArray(errorMessages)) {
            errorMessages.forEach((msg: string) => {
              validationErrors.push(`${field}: ${msg}`);
            });
          }
        }
      }
      
      if (validationErrors.length > 0) {
        return validationErrors.join('; ');
      }
    }
  }

  // Handle client-side ZodError instances
  if (error instanceof ZodError) {
    const issues = error.issues.map(issue => {
      const path = issue.path.join('.');
      return path ? `${path}: ${issue.message}` : issue.message;
    });
    return issues.join('; ');
  }

  // Handle AxiosError with StandardizedServerError response
  if (error && typeof error === 'object' && 'response' in error) {
    const axiosError = error as AxiosServerError;
    const { response } = axiosError;

    if (response?.data) {
      // Check for standardized error format
      if (response.data.error?.message) {
        return response.data.error.message;
      }

      // Check for direct message field
      if (response.data.message) {
        return response.data.message;
      }

      // Check for Zod validation errors in BaseApiResponse format
      if (response.data.error && typeof response.data.error === 'object') {
        const validationErrors: string[] = [];
        
        for (const [field, fieldError] of Object.entries(response.data.error)) {
          if (fieldError && typeof fieldError === 'object' && '_errors' in fieldError) {
            const errors = (fieldError as { _errors?: string[] })._errors;
            if (errors && Array.isArray(errors)) {
              const messages = errors.map((msg: string) => `${field}: ${msg}`);
              validationErrors.push(...messages);
            }
          }
        }

        if (validationErrors.length > 0) {
          return validationErrors.join('; ');
        }
      }
    }

    // Check if response exists but is not yet accessed in the log
    // Sometimes response.data might be undefined but the error is still valid
    if (!response) {
      // No response means network error or request was cancelled
      if ('code' in axiosError && typeof axiosError.code === 'string') {
        const code = axiosError.code;
        if (code === 'ERR_NETWORK') {
          return 'Network error. Please check your internet connection.';
        }
        if (code === 'ECONNABORTED' || code === 'ERR_CANCELED') {
          return 'Request was cancelled or timed out.';
        }
      }
    }

    // Fallback to axios error message
    if ('message' in axiosError && axiosError.message) {
      return axiosError.message;
    }
  }

  // Handle generic Error objects
  if (error instanceof Error) {
    return error.message;
  }

  // Handle string errors
  if (typeof error === 'string') {
    return error;
  }

  // Fallback for unknown error types
  return 'An unexpected error occurred';
}

export const formatCurrency = (amount: number, currency?: string) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'NGN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)
}
