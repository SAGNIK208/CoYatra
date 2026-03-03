import { Request, Response } from 'express';
import { getAuth } from '@clerk/express';
import { ChecklistItem } from './checklist-item.model';
import { User } from '../users/user.model';

export const createItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).auth?.userId || getAuth(req).userId;
    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const item = await ChecklistItem.create({
      ...req.body,
      createdByUserId: user._id,
    });
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getTripItems = async (req: Request, res: Response): Promise<void> => {
  try {
    const { tripId } = req.params;
    const items = await ChecklistItem.find({ tripId }).sort({ createdAt: -1 });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const updateItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    
    if (updateData.isDone) {
      updateData.completedAt = new Date();
    } else if (updateData.isDone === false) {
      updateData.completedAt = null;
    }

    const item = await ChecklistItem.findByIdAndUpdate(id, { $set: updateData }, { new: true });
    if (!item) {
      res.status(404).json({ error: 'Item not found' });
      return;
    }
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const deleteItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const item = await ChecklistItem.findByIdAndDelete(id);
    if (!item) {
      res.status(404).json({ error: 'Item not found' });
      return;
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
