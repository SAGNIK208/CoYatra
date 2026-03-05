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
    const { assignedToUserId } = req.query;
    
    const query: any = { tripId };
    if (assignedToUserId) {
      // If 'null' or empty string is passed, it might mean unassigned, but usually we filter by a specific ID
      if (assignedToUserId === 'unassigned') {
        query.assignedToUserId = { $exists: false };
      } else {
        query.assignedToUserId = assignedToUserId;
      }
    }

    const items = await ChecklistItem.find(query)
      .populate('assignedToUserId', 'name clerkId')
      .sort({ createdAt: -1 });
      
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const updateItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = (req as any).auth?.userId || getAuth(req).userId;
    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const item = await ChecklistItem.findById(id);
    if (!item) {
      res.status(404).json({ error: 'Item not found' });
      return;
    }

    // Logic: If assigned, only the assignee can mark it done/undone.
    // If unassigned, anyone (with trip access) can update it.
    if (item.assignedToUserId && item.assignedToUserId.toString() !== user._id.toString()) {
      res.status(403).json({ error: 'Only the assignee can update the status of this task' });
      return;
    }

    const updateData = { ...req.body };
    
    if (updateData.isDone !== undefined) {
      if (updateData.isDone) {
        updateData.completedAt = new Date();
      } else {
        updateData.completedAt = null;
      }
    }

    const updatedItem = await ChecklistItem.findByIdAndUpdate(id, { $set: updateData }, { new: true });
    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const deleteItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = (req as any).auth?.userId || getAuth(req).userId;
    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const item = await ChecklistItem.findById(id);
    if (!item) {
      res.status(404).json({ error: 'Item not found' });
      return;
    }

    // Logic: If assigned, only the assignee can delete.
    // If unassigned, anyone (with trip access) can delete.
    if (item.assignedToUserId && item.assignedToUserId.toString() !== user._id.toString()) {
      res.status(403).json({ error: 'Only the assignee can delete this task' });
      return;
    }

    await ChecklistItem.findByIdAndDelete(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
