import { Request, Response } from 'express';
import { Expense } from './expense.model';

export const createExpense = async (req: Request, res: Response): Promise<void> => {
  try {
    const expense = await Expense.create(req.body);
    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getTripExpenses = async (req: Request, res: Response): Promise<void> => {
  try {
    const { tripId } = req.params;
    const expenses = await Expense.find({ tripId }).sort({ createdAt: -1 });
    res.status(200).json(expenses);
  } catch (error) {
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
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
