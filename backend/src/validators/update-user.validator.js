import { z } from "zod";

export const updateUserSchema = z.object({
    body: z.object({
        name: z
            .string()
            .min(2, "Name must be at least 2 characters.")
            .max(
                50,
                "Name cannot exceed 50 characters."
            )
            .trim()
            .optional(),

        email: z
            .string()
            .email("Please provide a valid email address.")
            .toLowerCase()
            .trim()
            .optional(),

        avatar: z
            .string()
            .trim()
            .optional(),
    }),

    params: z.object({}),
});