import { z } from 'zod';

// Checklist Schemas
export const createChecklistItemSchema = z.object({
  body: z.object({
    tripId: z.string().min(1, 'Trip ID is required'),
    title: z.string().min(1, 'Title is required').max(200),
    assignedToUserId: z.string().optional(),
    dueDate: z.string().transform((val) => new Date(val)).optional(),
  }),
});

export const updateChecklistItemSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(200).optional(),
    assignedToUserId: z.string().optional(),
    isDone: z.boolean().optional(),
    dueDate: z.string().transform((val) => new Date(val)).optional(),
  }),
});
