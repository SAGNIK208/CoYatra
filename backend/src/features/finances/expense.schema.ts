import { z } from 'zod';

export const createExpenseSchema = z.object({
  body: z.object({
    tripId: z.string().min(1, 'Trip ID is required'),
    activityId: z.string().optional(),
    title: z.string().min(1, 'Title is required').max(100),
    description: z.string().max(500).optional(),
    amount: z.number().positive('Amount must be positive'),
    currency: z.string().min(1, 'Currency is required'),
    paidByUserId: z.string().min(1, 'Paid by User ID is required'),
    status: z.enum(['Pending', 'Paid', 'Settled']).default('Pending'),
    splitType: z.enum(['Equal', 'Percentage', 'Exact']).default('Equal'),
    payees: z.array(z.string()).optional(),
  }),
});

export const updateExpenseSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(100).optional(),
    description: z.string().max(500).optional(),
    amount: z.number().positive().optional(),
    currency: z.string().optional(),
    paidByUserId: z.string().optional(),
    status: z.enum(['Pending', 'Paid', 'Settled']).optional(),
    splitType: z.enum(['Equal', 'Percentage', 'Exact']).optional(),
    payees: z.array(z.string()).optional(),
  }),
});

export type CreateExpenseInput = z.infer<typeof createExpenseSchema>['body'];
export type UpdateExpenseInput = z.infer<typeof updateExpenseSchema>['body'];
