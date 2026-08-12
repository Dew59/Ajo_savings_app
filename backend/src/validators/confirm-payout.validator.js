import { z } from "zod";

export const confirmPayoutSchema = z.object({
    params: z.object({
        cycleId: z.string().length(24, "Invalid cycle id."),
    }),
});