import { z } from "zod";

export const createContributionSchema = z.object({
    params: z.object({
        cycleId: z.string().length(24, "Invalid cycle id."),
    }),

    body: z.object({
        amount: z
            .number()
            .positive("Contribution amount must be greater than zero."),
    }),
});