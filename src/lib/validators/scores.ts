import { z } from 'zod';

export const ScoreSchema = z.object({
  score: z
    .number({
      message: "Score is required",
    })
    .int()
    .min(1, "Score must be at least 1")
    .max(45, "Score cannot exceed 45"),
  played_at: z
    .string({
      message: "Date is required",
    })
    .refine((date) => {
      const selectedDate = new Date(date);
      const today = new Date();
      // Set hours to 0 to compare dates only
      today.setHours(0, 0, 0, 0);
      return selectedDate <= today;
    }, "Date cannot be in the future"),
});

export type ScoreInput = z.infer<typeof ScoreSchema>;
