import { z } from 'zod';

export const userAccountSchema = z.object({
  firstName: z.string().min(1, "First name is required."),
  lastName: z.string().min(1, "Last name is required."),
  email: z.string().email("Invalid email address."),
  passwordHash: z.string().min(6, "Password must be at least 6 characters."),
  telephone: z.string().regex(/^[0-9]{8,15}$/, "Invalid phone number."),
  userRole: z.string(),
});

export const addressSchema = z.object({
  country: z.string().min(1),
  state: z.string().min(1),
  city: z.string().min(1),
  addressLine: z.string().min(1),
  postalCode: z.string(),
});

export const resumeSchema = z.object({
  description: z.string().min(1),
  education: z.string().min(1),
  resume: z.any(), // Will validate manually on submission
});

export const fullApplicantSchema = z.object({
  userAccount: userAccountSchema,
  address: addressSchema,
  resume: resumeSchema,
});
