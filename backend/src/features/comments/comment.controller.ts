import { Request, Response } from 'express';
import { getAuth } from '@clerk/express';
import { Comment } from './comment.model';
import { User } from '../users/user.model';
import { TripRole } from '../../types/enums';

export const createComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).auth?.userId || getAuth(req).userId;
    const user = await User.findOne({ clerkId: userId });
    
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Add authorization check here if needed, or rely on route-level authorize.
    // For comments, we usually want to ensure the user is part of the trip.
    
    const comment = await Comment.create({
      ...req.body,
      userId: user._id,
    });

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getContextComments = async (req: Request, res: Response): Promise<void> => {
  try {
    const { contextId } = req.params;
    const comments = await Comment.find({ contextId })
      .populate('userId', 'name profilePicUrl')
      .sort({ createdAt: 1 });
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const updateComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const userId = (req as any).auth?.userId || getAuth(req).userId;
    const user = await User.findOne({ clerkId: userId });
    
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const comment = await Comment.findById(id);
    if (!comment) {
      res.status(404).json({ error: 'Comment not found' });
      return;
    }

    // Ownership check: Only author can edit
    if (comment.userId.toString() !== user._id.toString()) {
      res.status(403).json({ error: 'Only the author can edit this comment' });
      return;
    }

    comment.content = content;
    await comment.save();

    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

/**
 * Deletes a comment. Only author or Trip Owner can delete.
 */
export const deleteComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = (req as any).auth?.userId || getAuth(req).userId;
    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const comment = await Comment.findById(id);
    if (!comment) {
      res.status(404).json({ error: 'Comment not found' });
      return;
    }

    // RBAC: Membership is already checked by 'authorize' middleware.
    // We get membership from req.
    const membership = (req as any).membership;

    // Ownership check: Author OR Trip Owner
    const isAuthor = comment.userId.toString() === user._id.toString();
    const isTripOwner = membership?.role === TripRole.OWNER;

    if (!isAuthor && !isTripOwner) {
      res.status(403).json({ error: 'Permission denied' });
      return;
    }

    await comment.deleteOne();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
