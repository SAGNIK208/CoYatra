import { Router } from 'express';
import * as inviteController from './invite.controller';
import { validate } from '../../middlewares/validate.middleware';
import { generateInviteSchema, joinTripSchema } from './invite.schema';
import { requireAuth } from '../../middlewares/auth.middleware';
import { authorize } from '../../middlewares/rbac.middleware';
import { TripRole } from '../../types/enums';

const router = Router();

router.use(requireAuth);

// Generate an invite (Owner/Editor)
router.post(
  '/generate',
  validate(generateInviteSchema),
  authorize([TripRole.OWNER, TripRole.EDITOR]),
  inviteController.generateInvite
);

// Join a trip via token (Any authenticated user)
router.post(
  '/join',
  validate(joinTripSchema),
  inviteController.joinTrip
);

// List active invites for a trip (Owner/Editor)
router.get(
  '/trip/:tripId',
  authorize([TripRole.OWNER, TripRole.EDITOR]),
  inviteController.getActiveInvites
);

// Get details of an invite (Any authenticated user)
router.get(
  '/:token',
  inviteController.getInviteDetails
);

// Disable an invite token (Owner/Editor)
router.post(
  '/disable/:token',
  authorize([TripRole.OWNER, TripRole.EDITOR]),
  inviteController.disableInvite
);

export default router;
