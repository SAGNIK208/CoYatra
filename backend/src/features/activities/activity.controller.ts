import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { getAuth } from '@clerk/express';
import { Activity } from './activity.model';
import { User } from '../users/user.model';

/**
 * Creates a new activity for a trip.
 */
export const createActivity = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).auth?.userId || getAuth(req).userId;
    const user = await User.findOne({ clerkId: userId });
    
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const activity = await Activity.create({
      ...req.body,
      lastEditedByUserId: user._id,
    });

    res.status(201).json(activity);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

/**
 * Gets all activities for a specific trip.
 */
export const getTripActivities = async (req: Request, res: Response): Promise<void> => {
  try {
    const { tripId } = req.params;
    const activities = await Activity.find({ tripId }).sort({ startDateTime: 1, order: 1 });
    res.status(200).json(activities);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

/**
 * Updates an activity.
 */
export const updateActivity = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = (req as any).auth?.userId || getAuth(req).userId;
    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const activity = await Activity.findByIdAndUpdate(
      id,
      { 
        $set: { 
          ...req.body, 
          lastEditedByUserId: user._id 
        } 
      },
      { new: true }
    );

    if (!activity) {
      res.status(404).json({ error: 'Activity not found' });
      return;
    }

    res.status(200).json(activity);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

/**
 * Deletes an activity.
 */
export const deleteActivity = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const activity = await Activity.findByIdAndDelete(id);

    if (!activity) {
      res.status(404).json({ error: 'Activity not found' });
      return;
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

/**
 * Reorders activities in bulk.
 */
export const reorderActivities = async (req: Request, res: Response): Promise<void> => {
  try {
    const { updates } = req.body; // Array of { id: string, order: number }

    if (!updates || !Array.isArray(updates)) {
      res.status(400).json({ error: 'Updates must be an array' });
      return;
    }

    let bulkOps;
    try {
      bulkOps = updates.map((item: { id: string; order: number }) => {
        if (!mongoose.Types.ObjectId.isValid(item.id)) {
          throw new Error(`Invalid Activity ID: ${item.id}`);
        }
        return {
          updateOne: {
            filter: { _id: new mongoose.Types.ObjectId(item.id) },
            update: { $set: { order: item.order } },
          },
        };
      });
    } catch (mapErr: any) {
      res.status(400).json({ error: `Mapping updates failed: ${mapErr.message}` });
      return;
    }

    try {
      await Activity.bulkWrite(bulkOps);
    } catch (bulkErr: any) {
      res.status(500).json({ error: `BulkWrite failed: ${bulkErr.message}` });
      return;
    }

    res.status(200).json({ message: 'Activities reordered' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
