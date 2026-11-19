import z from "zod";
import {
  EmailSchema,
  IsoDateStringSchema,
  PasswordSchema,
} from "./common.schema";

export const UserProfileUpdateRequestSchema = z.object({
  firstName: z.coerce.string().max(255).optional().nullable(),
  lastName: z.coerce.string().max(255).optional().nullable(),
  phoneNumber: z.coerce.string().max(255).optional().nullable(),
  dob: IsoDateStringSchema.describe("Filter users with dob")
    .optional()
    .nullable(),
  profileImg: z.coerce.string().max(255).optional().nullable(),
});

export const CreateUserRequestSchema = z.object({
  email: EmailSchema,
  password: PasswordSchema,
  // phoneNumber: z.coerce.string().max(255).optional().describe("Phone number"),
  // dob: IsoDateStringSchema.optional().describe("Date of Birth"),
});

export const ContactUsRequestSchema = z.object({
  email: EmailSchema.describe("Email address"),
  firstName: z.coerce
    .string()
    .min(3, { message: "Must be at least 3 characters long" })
    .max(55, { message: "Name too long, maximum 55 characters long" }),
  lastName: z.coerce
    .string()
    .min(3, { message: "Must be at least 3 characters long" })
    .max(55, { message: "Name too long, maximum 55 characters long" }),
  message: z.coerce
    .string()
    .min(10, { message: "Message too short" })
    .max(2000, { message: "Message too long" }),
});

export const AuthenticationRequestSchema = z.object({
  email: EmailSchema,
  password: PasswordSchema,
  rememberMe: z.boolean().optional(),
});

export type UserProfileUpdateRequestType = z.infer<
  typeof UserProfileUpdateRequestSchema
>;
export type CreateUserRequestType = z.infer<typeof CreateUserRequestSchema>;
export type ContactUsRequestType = z.infer<typeof ContactUsRequestSchema>;
export type AuthenticationRequestType = z.infer<
  typeof AuthenticationRequestSchema
>;
