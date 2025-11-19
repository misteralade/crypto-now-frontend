import z from "zod";
import { IsoDateStringSchema } from "./common.schema";

export const UserProfileUpdateRequestSchema = z.object({
  firstName: z.coerce.string().max(255).optional(),
  lastName: z.coerce.string().max(255).optional(),
  phoneNumber: z.coerce.string().max(255).optional(),
  dob: IsoDateStringSchema.optional().describe("Filter users with dob"),
  profileImg: z.coerce.string().max(255).optional(),
})

export type UserProfileUpdateRequestType = z.infer<typeof UserProfileUpdateRequestSchema>;