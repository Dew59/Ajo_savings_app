import { z } from "zod";

export const deleteGroupSchema = z.object({
    params: z.object({
        groupId: z.string().length(24, "Invalid group id."),
    }),
});