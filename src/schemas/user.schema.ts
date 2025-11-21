import z from "zod";
import {EmailSchema, IsoDateStringSchema, PasswordSchema} from "./common.schema";

export const UserProfileUpdateRequestSchema = z.object({
  firstName: z.coerce.string().max(255).optional(),
  lastName: z.coerce.string().max(255).optional(),
  phoneNumber: z.coerce.string().max(255).optional(),
  dob: IsoDateStringSchema.optional().describe("Filter users with dob"),
  profileImg: z.coerce.string().max(255).optional(),
});

export const CreateUserRequestSchema = z.object({
  email: EmailSchema,
  password: PasswordSchema,
  firstName: z.coerce.string().min(3, { message: 'Too short, name must be at least 3 characters long' }).max(60),
  lastName: z.coerce.string().min(3, { message: 'Too short, name must be at least 3 characters long' }).max(60),
  // phoneNumber: z.coerce.string().max(255).optional().describe("Phone number"),
  // dob: IsoDateStringSchema.optional().describe("Date of Birth"),
});

export const ContactUsRequestSchema = z.object({
  email: EmailSchema.describe("Email address"),
  firstName: z.coerce.string().min(3, { message: "Must be at least 3 characters long" }).max(55, { message: 'Name too long, maximum 55 characters long' }),
  lastName: z.coerce.string().min(3, { message: "Must be at least 3 characters long" }).max(55, { message: 'Name too long, maximum 55 characters long' }),
  message: z.coerce.string().min(100, { message: "Message too short" }).max(2000, { message: 'Message too long' }),
});

export type UserProfileUpdateRequestType = z.infer<typeof UserProfileUpdateRequestSchema>;
export type CreateUserRequestType = z.infer<typeof CreateUserRequestSchema>;
export type ContactUsRequestType = z.infer<typeof ContactUsRequestSchema>;