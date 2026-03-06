import { Router } from 'express';
import * as tripController from './trip.controller';
import { validate } from '../../middlewares/validate.middleware';
import { createTripSchema, updateTripSchema } from './trip.schema';
import { requireAuth } from '../../middlewares/auth.middleware';
import { authorize } from '../../middlewares/rbac.middleware';
import { TripRole } from '../../types/enums';

const router = Router();

// Apply auth to all trip routes
router.use(requireAuth);

router.get('/', tripController.getMyTrips);
router.post('/', validate(createTripSchema), tripController.createTrip);
router.get('/:id', authorize([TripRole.OWNER, TripRole.EDITOR, TripRole.VIEWER]), tripController.getTripById);
router.put('/:id', authorize([TripRole.OWNER]), validate(updateTripSchema), tripController.updateTrip);
router.delete('/:id', authorize([TripRole.OWNER]), tripController.deleteTrip);

// Member Management
router.get('/:id/members', authorize([TripRole.OWNER, TripRole.EDITOR, TripRole.VIEWER]), tripController.getTripMembers);
router.patch('/:id/members/:userId', authorize([TripRole.OWNER]), tripController.updateMemberRole);
router.delete('/:id/members/:userId', authorize([TripRole.OWNER]), tripController.removeMember);
router.get('/:id/members/:userId/contributions', authorize([TripRole.OWNER, TripRole.EDITOR, TripRole.VIEWER]), tripController.getMemberContributions);

export default router;
