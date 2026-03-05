import { Router } from 'express';
import * as financeController from './finance.controller';
import { validate } from '../../middlewares/validate.middleware';
import { createExpenseSchema, updateExpenseSchema } from './expense.schema';
import { requireAuth } from '../../middlewares/auth.middleware';
import { authorize } from '../../middlewares/rbac.middleware';
import { TripRole } from '../../types/enums';

const router = Router();

router.use(requireAuth);

router.get('/trip/:tripId', authorize([TripRole.OWNER, TripRole.EDITOR, TripRole.VIEWER]), financeController.getTripExpenses);
router.post('/', validate(createExpenseSchema), authorize([TripRole.OWNER, TripRole.EDITOR, TripRole.VIEWER]), financeController.createExpense);
router.put('/:id', validate(updateExpenseSchema), authorize([TripRole.OWNER, TripRole.EDITOR, TripRole.VIEWER]), financeController.updateExpense);
router.patch('/:id/payee', authorize([TripRole.OWNER, TripRole.EDITOR, TripRole.VIEWER]), financeController.updatePayeeStatus);
router.delete('/:id', authorize([TripRole.OWNER, TripRole.EDITOR, TripRole.VIEWER]), financeController.deleteExpense);

export default router;
