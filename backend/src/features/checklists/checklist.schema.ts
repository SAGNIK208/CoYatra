import { z } from 'zod';

// Checklist Schemas
export const createChecklistItemSchema = z.object({
  body: z.object({
    tripId: z.string().min(1, 'Trip ID is required'),
    description: z.string().min(1, 'Description is required').max(200),
    assignedToUserId: z.string().optional(),
    dueDate: z.string().transform((val) => new Date(val)).optional(),
  }),
});

export const updateChecklistItemSchema = z.object({
  body: z.object({
    description: z.string().min(1).max(200).optional(),
    assignedToUserId: z.string().optional(),
    isDone: z.boolean().optional(),
    dueDate: z.string().transform((val) => new Date(val)).optional(),
  }),
});

// Finance Schemas
export const createExpenseSchema = z.object({
  body: z.object({
    tripId: z.string().min(1, 'Trip ID is required'),
    activityId: z.string().optional(),
    title: z.string().min(1, 'Title is required').max(100),
    description: z.string().max(500).optional(),
    amount: z.number().positive('Amount must be positive'),
    currency: z.string().length(3).default('INR'),
    paidByUserId: z.string().min(1, 'Payer is required'),
  }),
});

export const updateExpenseSchema = z.object({
  body: z.object({
    activityId: z.string().optional(),
    title: z.string().min(1).max(100).optional(),
    description: z.string().max(500).optional(),
    amount: z.number().positive().optional(),
    currency: z.string().length(3).optional(),
    paidByUserId: z.string().optional(),
  }),
});
