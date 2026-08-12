import { z } from "zod";
import mongoose from "mongoose";

export const groupIdSchema = z.object({
  params: z.object({
    groupId: z.string().refine(
      (value) => mongoose.Types.ObjectId.isValid(value),
      {
        message: "Invalid group id.",
      }
    ),
  }),
});