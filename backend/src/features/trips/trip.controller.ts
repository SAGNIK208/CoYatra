import { Request, Response } from 'express';
import { getAuth } from '@clerk/express';
import { Trip } from './models/trip.model';
import logger from '../../utils/logger';
import { TripMember } from './models/trip-member.model';
import { User } from '../users/user.model';
import { TripRole } from '../../types/enums';
import { ChecklistItem } from '../checklists/checklist-item.model';
import { Expense } from '../finances/expense.model';

/**
 * Creates a new trip and adds the creator as the OWNER.
 */
export const createTrip = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).auth?.userId || getAuth(req).userId;
    const { title, description, location, startDateTime, endDateTime, imageUrl, timezone } = req.body;

    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const trip = await Trip.create({
      ownerUserId: user._id,
      createdByUserId: user._id,
      title,
      description,
      location,
      startDateTime,
      endDateTime,
      imageUrl,
      timezone: timezone || 'UTC',
    });

    // Add creator as OWNER in TripMember
    await TripMember.create({
      tripId: trip._id,
      userId: user._id,
      role: TripRole.OWNER,
    });

    res.status(201).json(trip);
  } catch (error) {
    logger.error(error, 'Failed to create trip');
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

/**
 * Gets all trips for the authenticated user (Owned + Joined).
 */
export const getMyTrips = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).auth?.userId || getAuth(req).userId;
    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Find all memberships
    const memberships = await TripMember.find({ userId: user._id }).populate('tripId');
    const trips = (memberships || [])
      .filter(m => !!m.tripId)
      .map((m) => {
        const trip = (m.tripId as any).toObject();
        trip.role = m.role;
        return trip;
      });

    res.status(200).json(trips);
  } catch (error) {
    logger.error(error, 'Failed to get my trips');
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

/**
 * Gets a single trip by ID.
 */
export const getTripById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const trip = await Trip.findById(id).lean();

    if (!trip) {
      res.status(404).json({ error: 'Trip not found' });
      return;
    }

    // Attach role if member
    const userId = (req as any).auth?.userId || getAuth(req).userId;
    const user = await User.findOne({ clerkId: userId });
    let role = 'VIEWER';
    if (user) {
      const membership = await TripMember.findOne({ tripId: id, userId: user._id });
      if (membership) {
        role = membership.role;
      }
    }

    // Fetch and populate members
    const members = await TripMember.find({ tripId: id }).populate('userId', 'name email profilePicUrl clerkId').lean();
    const formattedMembers = members.map(m => ({
      ...m,
      user: m.userId // map to expected frontend structure
    }));

    res.status(200).json({ ...trip, role, members: formattedMembers });
  } catch (error) {
    logger.error(error, 'Failed to get trip by ID');
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

/**
 * Updates a trip.
 */
export const updateTrip = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const trip = await Trip.findByIdAndUpdate(id, { $set: updateData }, { new: true });

    if (!trip) {
      res.status(404).json({ error: 'Trip not found' });
      return;
    }

    res.status(200).json(trip);
  } catch (error) {
    logger.error(error, 'Failed to update trip');
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

/**
 * Deletes a trip and all its members.
 */
export const deleteTrip = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const trip = await Trip.findByIdAndDelete(id);
    if (!trip) {
      res.status(404).json({ error: 'Trip not found' });
      return;
    }

    // Delete all members
    await TripMember.deleteMany({ tripId: id });

    res.status(204).send();
  } catch (error) {
    logger.error(error, 'Failed to delete trip');
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

/**
 * Gets all members of a trip.
 */
export const getTripMembers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const members = await TripMember.find({ tripId: id }).populate('userId', 'name email profilePicUrl clerkId');
    res.status(200).json(members);
  } catch (error) {
    logger.error(error, 'Failed to get trip members');
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

/**
 * Updates a member's role.
 */
export const updateMemberRole = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id, userId: memberUserId } = req.params;
    const { role } = req.body;

    if (role === TripRole.OWNER) {
      res.status(400).json({ error: 'Cannot promote to OWNER via this endpoint' });
      return;
    }

    const userToUpdate = await User.findOne({ clerkId: memberUserId });
    if (!userToUpdate) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const membership = await TripMember.findOneAndUpdate(
      { tripId: id, userId: userToUpdate._id },
      { $set: { role } },
      { new: true }
    );

    if (!membership) {
      res.status(404).json({ error: 'Member not found' });
      return;
    }

    res.status(200).json(membership);
  } catch (error) {
    logger.error(error, 'Failed to update member role');
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

/**
 * Removes a member from a trip.
 */
export const removeMember = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id, userId: memberUserId } = req.params;

    const userToRemove = await User.findOne({ clerkId: memberUserId });
    if (!userToRemove) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const membership = await TripMember.findOneAndDelete({ tripId: id, userId: userToRemove._id });
    
    if (!membership) {
      res.status(404).json({ error: 'Member not found' });
      return;
    }

    res.status(204).send();
  } catch (error) {
    logger.error(error, 'Failed to remove member');
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

/**
 * Gets a member's contributions (tasks and expenses) for a trip.
 */
export const getMemberContributions = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id: tripId, userId: memberClerkId } = req.params;

    const memberUser = await User.findOne({ clerkId: memberClerkId });
    if (!memberUser) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // 1. Fetch Tasks assigned to this member in this trip
    const tasks = await ChecklistItem.find({
      tripId,
      assignedToUserId: memberUser._id
    }).sort({ createdAt: -1 });

    // 2. Fetch Expenses involving this member (as payer OR as payee)
    const expenses = await Expense.find({
      tripId,
      $or: [
        { paidByUserId: memberUser._id },
        { 'payees.user': memberUser._id }
      ]
    }).sort({ createdAt: -1 });

    // 3. Format into a unified contribution list
    const contributions = [
      ...tasks.map(task => ({
        _id: task._id,
        type: 'Task',
        title: task.title,
        date: task.createdAt,
        status: task.isDone ? 'Completed' : 'Pending'
      })),
      ...expenses.map(expense => {
        const userPayee = expense.payees.find(p => p.user.toString() === memberUser._id.toString());
        return {
          _id: expense._id,
          type: 'Expense',
          title: expense.title,
          date: expense.createdAt,
          amount: userPayee ? `${expense.currency} ${userPayee.amount}` : `${expense.currency} 0`,
          status: userPayee ? (userPayee.isPaid ? 'Paid' : 'Pending') : 'N/A',
          isPayer: expense.paidByUserId.toString() === memberUser._id.toString()
        };
      })
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    res.status(200).json(contributions);
  } catch (error) {
    logger.error(error, 'getMemberContributions error');
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
