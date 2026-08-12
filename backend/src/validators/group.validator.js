import { z } from "zod";

export const createGroupSchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(3, "Group name must be at least 3 characters.")
      .max(100, "Group name cannot exceed 100 characters."),

    description: z
      .string()
      .trim()
      .max(500, "Description cannot exceed 500 characters.")
      .optional()
      .default(""),

    contributionAmount: z
      .number({
        required_error: "Contribution amount is required.",
      })
      .positive("Contribution amount must be greater than zero."),

    contributionFrequency: z.enum(
      ["daily", "weekly", "monthly"],
      {
        errorMap: () => ({
          message:
            "Contribution frequency must be daily, weekly or monthly.",
        }),
      }
    ),

    maxMembers: z
      .number({
        required_error: "Maximum members is required.",
      })
      .int()
      .min(2, "A group must have at least 2 members."),
  }),
});