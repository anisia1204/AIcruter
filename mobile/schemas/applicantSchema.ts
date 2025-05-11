import { z } from 'zod';

export const userAccountSchema = z.object({
  firstName: z.string().min(1, "First name is required."),
  lastName: z.string().min(1, "Last name is required."),
  email: z.string().email("Invalid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
  telephone: z.string().regex(/^[0-9]{8,15}$/, "Invalid phone number."),
  role: z.string(),
});

export const addressSchema = z.object({
  country: z.string().min(1, "Country is required."),
  state: z.string().min(1, "State is required."),
  city: z.string().min(1, "City is required."),
  addressLine: z.string().min(1, "Street is required."),
  postalCode: z.string().min(6, "Postal code is required."),
});

export const resumeSchema = z.object({
  description: z.string().min(10, "Description must be longer."),
  education: z.string().min(10, "Education field must be longer."),
  resumeFile: z.object({
    uri: z.string().min(1, "Resume file is required."),
    name: z.string(),
    size: z.number(),
    mimeType: z.string(),
  }),
});

export const fullApplicantSchema = z.object({
  userAccount: userAccountSchema,
  address: addressSchema,
  resume: resumeSchema,
});
