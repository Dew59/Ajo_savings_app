import { z } from "zod";

export const joinGroupSchema = z.object({
  body: z.object({
    inviteCode: z
      .string()
      .trim()
      .min(1, "Invite code is required.")
      .transform((value) => value.toUpperCase()),
  }),
});