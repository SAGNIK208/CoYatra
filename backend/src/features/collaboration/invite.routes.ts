import { Router } from 'express';
import * as inviteController from './invite.controller';
import { validate } from '../../middlewares/validate.middleware';
import { generateInviteSchema, joinTripSchema } from './invite.schema';
import { requireAuth } from '../../middlewares/auth.middleware';
import { authorize } from '../../middlewares/rbac.middleware';
import { TripRole } from '../../types/enums';

const router = Router();

router.use(requireAuth);

// Generate an invite (Owner only)
router.post(
  '/generate',
  validate(generateInviteSchema),
  authorize([TripRole.OWNER]),
  inviteController.generateInvite
);

// Join a trip via token (Any authenticated user)
router.post(
  '/join',
  validate(joinTripSchema),
  inviteController.joinTrip
);

// List active invites for a trip (Owner only)
router.get(
  '/trip/:tripId',
  authorize([TripRole.OWNER]),
  inviteController.getActiveInvites
);

// Disable an invite token (Owner only)
router.post(
  '/disable/:token',
  inviteController.disableInvite
);

export default router;
