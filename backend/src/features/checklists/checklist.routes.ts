import { Router } from 'express';
import * as checklistController from './checklist.controller';
import { validate } from '../../middlewares/validate.middleware';
import { createChecklistItemSchema, updateChecklistItemSchema } from './checklist.schema';
import { requireAuth } from '../../middlewares/auth.middleware';
import { authorize } from '../../middlewares/rbac.middleware';
import { TripRole } from '../../types/enums';

const router = Router();

router.use(requireAuth);

router.get('/trip/:tripId', authorize([TripRole.OWNER, TripRole.EDITOR, TripRole.VIEWER]), checklistController.getTripItems);
router.post('/', validate(createChecklistItemSchema), authorize([TripRole.OWNER, TripRole.EDITOR, TripRole.VIEWER]), checklistController.createItem);
router.put('/:id', validate(updateChecklistItemSchema), authorize([TripRole.OWNER, TripRole.EDITOR, TripRole.VIEWER]), checklistController.updateItem);
router.delete('/:id', authorize([TripRole.OWNER, TripRole.EDITOR, TripRole.VIEWER]), checklistController.deleteItem);

export default router;
