import { z } from 'zod';

export const SelectCharitySchema = z.object({
  charityId: z.string({
    message: "Charity ID is required",
  }).uuid("Invalid Charity ID format"),
});

export const CharityPercSchema = z.object({
  charity_perc: z
    .number({
      message: "Percentage is required",
    })
    .int()
    .min(10, "Minimum contribution is 10%")
    .max(50, "Maximum contribution is 50%"),
});

export type SelectCharityInput = z.infer<typeof SelectCharitySchema>;
export type CharityPercInput = z.infer<typeof CharityPercSchema>;
