import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name cannot exceed 50 characters"),

    email: z
      .email("Please provide a valid email address")
      .transform((email) => email.toLowerCase()),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(100),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z
      .email("Please provide a valid email address")
      .transform((email) => email.toLowerCase()),

    password: z
      .string()
      .min(1, "Password is required"),
  }),
});

export const resetPasswordSchema = z.object({
    body: z.object({
        password: z
            .string(),
    }),

    params: z.object({
        token: z.string(),
    }),
});