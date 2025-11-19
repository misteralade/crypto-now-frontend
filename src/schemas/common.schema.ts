import z from "zod";
import { emailRegex, passwordRegex } from "../util/regex.util";
import momentClient from "../lib/moment.ts";

export const EmailSchema = z.coerce
  .string()
  .min(5, "Email must be at least 5 characters long")
  .max(150, "Email must not exceed 150 characters")
  .regex(
    emailRegex,
    "Please enter a valid email address (special characters like '+' are not allowed)",
  )
  .refine(
    (email) => {
      const parts = email.split("@");
      if (parts.length !== 2) return false;

      const [local, domain] = parts;

      // Local part validation (explicitly disallow +)
      if (local.includes("+")) return false;
      if (local.length > 64) return false;
      if (/[.]{2,}/.test(local)) return false; // No consecutive dots
      if (/^[.]|[.]$/.test(local)) return false; // Cannot start or end with dot

      // Domain validation
      if (domain.length > 253) return false;
      if (/[.]{2,}/.test(domain)) return false; // No consecutive dots
      if (/^[.]|[.]$/.test(domain)) return false; // Cannot start or end with dot

      return true;
    },
    { message: "Invalid email address" },
  )
  .transform((email) => email.toLowerCase());

export const PasswordSchema = z.coerce.string()
  .min(5, "Password must be at least 5 characters long")
  .max(128, "Password must not exceed 128 characters")
  .regex(passwordRegex, "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character")
  .refine((password) => {
    // Disallow spaces in the password
    return !/\s/.test(password);
  })

export const IsoDateStringSchema = z.coerce
  .string()
  .refine(
    (value) => {
      // Try to parse the date and check if it's valid
      const date = new Date(value);
      return !isNaN(date.getTime());
    },
    {
      message: 'Invalid date format',
    }
  )
  .transform((value) => {
    return momentClient.toISOStringFromDate(new Date(value))
  })
