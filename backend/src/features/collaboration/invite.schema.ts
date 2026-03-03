import { z } from 'zod';
import { TripRole } from '../../types/enums';

export const generateInviteSchema = z.object({
  body: z.object({
    tripId: z.string().min(1, 'Trip ID is required'),
    role: z.nativeEnum(TripRole).default(TripRole.VIEWER),
    expiresAt: z.string().transform((val) => new Date(val)).optional(),
  }),
});

export const joinTripSchema = z.object({
  body: z.object({
    token: z.string().min(1, 'Invite token is required'),
  }),
});

export type GenerateInviteInput = z.infer<typeof generateInviteSchema>['body'];
export type JoinTripInput = z.infer<typeof joinTripSchema>['body'];
