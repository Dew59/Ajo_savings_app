import { z } from "zod";

export const createContributionCycleSchema = z.object({
    params: z.object({
        groupId: z.string().length(24, "Invalid group id."),
    }),
});