import { z } from 'zod';

export const SimulateDrawSchema = z.object({
  draw_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format, use YYYY-MM-DD"),
  draw_mode: z.enum(['random', 'weighted_common', 'weighted_rare']),
});

export const PublishDrawSchema = z.object({
  draw_id: z.string().uuid("Invalid draw ID"),
});

export type SimulateDrawInput = z.infer<typeof SimulateDrawSchema>;
export type PublishDrawInput = z.infer<typeof PublishDrawSchema>;
