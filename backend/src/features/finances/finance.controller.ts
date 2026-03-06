import { Request, Response } from 'express';
import { Expense } from './expense.model';
import logger from '../../utils/logger';
import { getAuth } from '@clerk/express';

export const createExpense = async (req: Request, res: Response): Promise<void> => {
  try {
    const { amount, payees, paidByUserId, splitType = 'Equal', ...rest } = req.body;
    
    // Calculate amount per person if Equal split
    const perPersonAmount = splitType === 'Equal' ? amount / (payees.length || 1) : 0;
    
    const processedPayees = payees.map((pUserId: string) => ({
      user: pUserId,
      amount: perPersonAmount,
      isPaid: pUserId === paidByUserId, // Payer is considered paid
      paidAt: pUserId === paidByUserId ? new Date() : undefined
    }));

    // Calculate initial status
    const allPaid = processedPayees.every((p: any) => p.isPaid);
    const somePaid = processedPayees.some((p: any) => p.isPaid);
    const initialStatus = allPaid ? 'Settled' : (somePaid ? 'Paid' : 'Pending');

    const expense = await Expense.create({
      ...rest,
      amount,
      paidByUserId,
      payees: processedPayees,
      splitType,
      status: initialStatus
    });
    
    res.status(201).json(expense);
  } catch (error) {
    logger.error(error, 'Failed to create expense');
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getTripExpenses = async (req: Request, res: Response): Promise<void> => {
  try {
    const { tripId } = req.params;
    const expenses = await Expense.find({ tripId })
      .populate('paidByUserId', 'name')
      .populate('payees.user', 'name clerkId')
      .sort({ createdAt: -1 });
    res.status(200).json(expenses);
  } catch (error) {
    logger.error(error, 'Failed to get trip expenses');
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const updatePayeeStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { userId, isPaid } = req.body;
    const auth = getAuth(req);

    const expense = await Expense.findById(id).populate('payees.user', 'clerkId');
    if (!expense) {
      res.status(404).json({ error: 'Expense not found' });
      return;
    }

    // Permission Check: only the user themselves can update their status
    const targetPayee = expense.payees.find(p => (p.user as any)?._id.toString() === userId || p.user.toString() === userId);
    
    if (!targetPayee) {
      res.status(404).json({ error: 'Payee not found in this expense' });
      return;
    }

    const targetClerkId = (targetPayee.user as any)?.clerkId;
    if (targetClerkId !== auth.userId) {
      res.status(403).json({ error: 'Forbidden: You can only update your own payment status' });
      return;
    }

    const payeeIndex = expense.payees.findIndex(p => (p.user as any)?._id.toString() === userId || p.user.toString() === userId);
    
    expense.payees[payeeIndex].isPaid = isPaid;
    expense.payees[payeeIndex].paidAt = isPaid ? new Date() : undefined;

    // Update overall expense status
    const allPaid = expense.payees.every(p => p.isPaid);
    if (allPaid) {
      expense.status = 'Settled';
    } else if (expense.payees.some(p => p.isPaid)) {
       expense.status = 'Paid';
    } else {
       expense.status = 'Pending';
    }

    await expense.save();
    res.status(200).json(expense);
  } catch (error) {
    logger.error(error, 'Error in updatePayeeStatus');
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const updateExpense = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const expense = await Expense.findByIdAndUpdate(id, { $set: req.body }, { new: true });
    if (!expense) {
      res.status(404).json({ error: 'Expense not found' });
      return;
    }
    res.status(200).json(expense);
  } catch (error) {
    logger.error(error, 'Failed to update expense');
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const deleteExpense = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const expense = await Expense.findByIdAndDelete(id);
    if (!expense) {
      res.status(404).json({ error: 'Expense not found' });
      return;
    }
    res.status(204).send();
  } catch (error) {
    logger.error(error, 'Failed to delete expense');
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
