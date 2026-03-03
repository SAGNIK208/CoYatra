import { z } from 'zod';
import { ActivityType } from '../../types/enums';

export const createActivitySchema = z.object({
  body: z.object({
    tripId: z.string().min(1, 'Trip ID is required'),
    name: z.string().min(1, 'Name is required').max(100),
    description: z.string().max(500).optional(),
    type: z.nativeEnum(ActivityType),
    subType: z.string().optional(),
    startDateTime: z.string().transform((val) => new Date(val)),
    endDateTime: z.string().transform((val) => new Date(val)).optional(),
    timezone: z.string().default('UTC'),
    isAllDay: z.boolean().default(false),
    location: z.string().optional(),
    startLocation: z.string().optional(),
    endLocation: z.string().optional(),
    googlePlaceId: z.string().optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    order: z.number().int().default(0),
  }),
});

export const updateActivitySchema = z.object({
  body: z.object({
    name: z.string().min(1).max(100).optional(),
    description: z.string().max(500).optional(),
    type: z.nativeEnum(ActivityType).optional(),
    subType: z.string().optional(),
    startDateTime: z.string().transform((val) => new Date(val)).optional(),
    endDateTime: z.string().transform((val) => new Date(val)).optional(),
    timezone: z.string().optional(),
    isAllDay: z.boolean().optional(),
    location: z.string().optional(),
    startLocation: z.string().optional(),
    endLocation: z.string().optional(),
    googlePlaceId: z.string().optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    order: z.number().int().optional(),
  }),
});

export type CreateActivityInput = z.infer<typeof createActivitySchema>['body'];
export type UpdateActivityInput = z.infer<typeof updateActivitySchema>['body'];
