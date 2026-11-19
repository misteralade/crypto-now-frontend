export const RECEIPT_MAX_BYTES = 5 * 1024 * 1024;
export const PDF_MIME_TYPE = "application/pdf";
export const RECEIPT_ACCEPT = ".jpg,.jpeg,.png,.pdf";
const receiptTypes: Record<string, string> = { jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", pdf: PDF_MIME_TYPE };

export function receiptFileError(file: File): string | null {
  const extension = file.name.split(".").pop()?.toLowerCase();
  if (!extension || !receiptTypes[extension] || receiptTypes[extension] !== file.type) return "Choose a JPG, PNG or PDF file.";
  if (file.size > RECEIPT_MAX_BYTES) return "File must be 5 MB or smaller.";
  return null;
}
