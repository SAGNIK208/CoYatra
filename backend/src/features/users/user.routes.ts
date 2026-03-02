import { Router } from 'express';
import * as userController from './user.controller';
import { validate } from '../../middlewares/validate.middleware';
import { syncUserSchema, updateMeSchema, getProfileUploadUrlSchema } from './user.schema';
import { requireAuth } from '../../middlewares/auth.middleware';

const router = Router();

// All routes here are protected
router.use(requireAuth);

router.get('/me', userController.getMe);
router.put('/me', validate(updateMeSchema), userController.updateMe);
router.post('/sync', validate(syncUserSchema), userController.syncUser);
router.post('/profile-upload-url', validate(getProfileUploadUrlSchema), userController.getProfileUploadUrl);

export default router;
