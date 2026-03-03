import { Router } from 'express';
import * as activityController from './activity.controller';
import { validate } from '../../middlewares/validate.middleware';
import { createActivitySchema, updateActivitySchema } from './activity.schema';
import { requireAuth } from '../../middlewares/auth.middleware';
import { authorize } from '../../middlewares/rbac.middleware';
import { TripRole } from '../../types/enums';

const router = Router();

router.use(requireAuth);

// Get all activities for a trip (Viewer+)
router.get(
  '/trip/:tripId',
  authorize([TripRole.OWNER, TripRole.EDITOR, TripRole.VIEWER]),
  activityController.getTripActivities
);

// Create activity (Editor+)
router.post(
  '/',
  validate(createActivitySchema),
  authorize([TripRole.OWNER, TripRole.EDITOR]),
  activityController.createActivity
);

// Update activity (Editor+)
// Note: We use authorize with :id here because the middleware handles 
// looking up the trip related to the activity ID if 'id' is present in params.
router.put(
  '/:id',
  validate(updateActivitySchema),
  authorize([TripRole.OWNER, TripRole.EDITOR]),
  activityController.updateActivity
);

// Delete activity (Editor+)
router.delete(
  '/:id',
  authorize([TripRole.OWNER, TripRole.EDITOR]),
  activityController.deleteActivity
);

// Bulk Reorder (Editor+)
router.post(
  '/reorder',
  authorize([TripRole.OWNER, TripRole.EDITOR]),
  activityController.reorderActivities
);

export default router;
