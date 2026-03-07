import { Router } from 'express';
import * as mediaController from './media.controller';
import { validate } from '../../middlewares/validate.middleware';
import { getPresignedUrlSchema, confirmUploadSchema } from './media.schema';
import { requireAuth } from '../../middlewares/auth.middleware';
import { authorize } from '../../middlewares/rbac.middleware';
import { TripRole } from '../../types/enums';

const router = Router();

router.use(requireAuth);

router.get('/trip/:tripId', authorize([TripRole.OWNER, TripRole.EDITOR, TripRole.VIEWER]), mediaController.getTripAttachments);

router.post(
  '/upload-url',
  validate(getPresignedUrlSchema),
  authorize([TripRole.OWNER, TripRole.EDITOR, TripRole.VIEWER]),
  mediaController.getUploadUrl
);

router.post(
  '/confirm',
  validate(confirmUploadSchema),
  authorize([TripRole.OWNER, TripRole.EDITOR, TripRole.VIEWER]),
  mediaController.confirmUpload
);

router.get('/:id/download-url', authorize([TripRole.OWNER, TripRole.EDITOR, TripRole.VIEWER]), mediaController.getDownloadUrl);

router.delete('/:id', authorize([TripRole.OWNER, TripRole.EDITOR, TripRole.VIEWER]), mediaController.deleteAttachment);

export default router;
