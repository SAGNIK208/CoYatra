import { z } from 'zod';

export const createTripSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required').max(100),
    description: z.string().max(500).optional(),
    location: z.string().max(100).optional(),
    startDateTime: z.string().transform((val) => new Date(val)),
    endDateTime: z.string().transform((val) => new Date(val)),
    defaultCurrency: z.string().default('INR'),
    timezone: z.string().min(1, 'Timezone is required'),
    imageUrl: z.string().url().or(z.literal('')).optional(),
  }).refine((data) => data.endDateTime >= data.startDateTime, {
    message: "End date must be after start date",
    path: ["endDateTime"],
  }),
});

export const updateTripSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(100).optional(),
    description: z.string().max(500).optional(),
    location: z.string().max(100).optional(),
    startDateTime: z.string().transform((val) => new Date(val)).optional(),
    endDateTime: z.string().transform((val) => new Date(val)).optional(),
    timezone: z.string().optional(),
    imageUrl: z.string().url().or(z.literal('')).optional(),
  }).refine((data) => {
    if (data.startDateTime && data.endDateTime) {
      return data.endDateTime >= data.startDateTime;
    }
    return true;
  }, {
    message: "End date must be after start date",
    path: ["endDateTime"],
  }),
});

export type CreateTripInput = z.infer<typeof createTripSchema>['body'];
export type UpdateTripInput = z.infer<typeof updateTripSchema>['body'];
