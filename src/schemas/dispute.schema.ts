import { z } from "zod";

export const attachmentTypes = z.object({
  url: z.string().url().describe("The URL of the attachment."),
  type: z.enum(["IMAGE", "VIDEO", "DOCUMENT", "OTHER"]).describe("The type of the attachment."),
  filename: z.string().describe("The filename of the attachment."),
  size: z.number().min(0).describe("The size of the attachment in bytes."),
  mimeType: z.string().describe("The MIME type of the attachment."),
  uploadedAt: z.coerce.date().describe("The date and time when the attachment was uploaded."),
  metadata: z.object(z.any()).optional().describe("Optional metadata for the attachment."),
})

export const CreateDisputeRequestSchema = z.object({
  reason: z.string().min(10).max(2000).describe("The reason for creating the dispute."),
  attachments: z.array(attachmentTypes).max(5).optional().describe("Optional list of attachments related to the dispute."),
});

export type CreateDisputeRequestType = z.infer<typeof CreateDisputeRequestSchema>;