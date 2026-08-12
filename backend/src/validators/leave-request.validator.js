import { z } from "zod";

export const createLeaveRequestSchema = z.object({
    params: z.object({
        groupId: z.string().length(24, "Invalid group id."),
    }),

    body: z.object({
        reason: z
            .string()
            .trim()
            .max(500, "Reason cannot exceed 500 characters.")
            .optional()
            .default(""),
    }),
});

export const getLeaveRequestsSchema = z.object({
    params: z.object({
        groupId: z.string().length(24, "Invalid group id."),
    }),
});

export const approveLeaveRequestSchema = z.object({
    params: z.object({
        requestId: z.string().length(24, "Invalid request id."),
    }),
});