import { Router } from 'express';
import * as commentController from './comment.controller';
import { validate } from '../../middlewares/validate.middleware';
import { createCommentSchema, updateCommentSchema } from '../media/media.schema'; // Sharing the schema file for simplicity or move to common
import { requireAuth } from '../../middlewares/auth.middleware';
import { authorize } from '../../middlewares/rbac.middleware';
import { TripRole } from '../../types/enums';

const router = Router();

router.use(requireAuth);

router.get('/context/:contextId', commentController.getContextComments);

router.post(
  '/',
  validate(createCommentSchema),
  authorize([TripRole.OWNER, TripRole.EDITOR, TripRole.VIEWER]),
  commentController.createComment
);

router.put('/:id', validate(updateCommentSchema), authorize([TripRole.OWNER, TripRole.EDITOR, TripRole.VIEWER]), commentController.updateComment);
router.delete('/:id', authorize([TripRole.OWNER, TripRole.EDITOR, TripRole.VIEWER]), commentController.deleteComment);

export default router;
