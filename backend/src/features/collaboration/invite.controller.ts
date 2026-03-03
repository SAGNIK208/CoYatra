import { Request, Response } from 'express';
import { getAuth } from '@clerk/express';
import crypto from 'crypto';
import { InviteStatus, TripRole } from '../../types/enums';
import { TripMember } from '../trips/models/trip-member.model';
import { Trip } from '../trips/models/trip.model';
import { User } from '../users/user.model';
import { TripInvite } from './models/trip-invite.model';

/**
 * Generates a secure invite token for a trip.
 */
export const generateInvite = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).auth?.userId || getAuth(req).userId;
    const { tripId, role, expiresAt } = req.body;

    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Verify trip exists
    const trip = await Trip.findById(tripId);
    if (!trip) {
      res.status(404).json({ error: 'Trip not found' });
      return;
    }

    // Generate secure token
    const token = crypto.randomBytes(32).toString('hex');

    const invite = await TripInvite.create({
      tripId,
      createdByUserId: user._id,
      token,
      role,
      expiresAt: expiresAt ? new Date(expiresAt) : undefined,
      status: InviteStatus.PENDING,
    });

    res.status(201).json({
      inviteToken: invite.token,
      role: invite.role,
      expiresAt: invite.expiresAt,
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

/**
 * Joins a trip using an invite token.
 */
export const joinTrip = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).auth?.userId || getAuth(req).userId;
    const { token } = req.body;

    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const invite = await TripInvite.findOne({ token, status: InviteStatus.PENDING });
    if (!invite) {
      res.status(404).json({ error: 'Invalid or spent invite link' });
      return;
    }

    // Check expiry
    if (invite.expiresAt && invite.expiresAt < new Date()) {
      invite.status = InviteStatus.DISABLED;
      await invite.save();
      res.status(410).json({ error: 'Invite link has expired' });
      return;
    }

    // Create membership
    try {
      await TripMember.create({
        tripId: invite.tripId,
        userId: user._id,
        role: invite.role,
        addedByUserId: invite.createdByUserId,
      });
    } catch (err: any) {
      if (err.code === 11000) {
        // Already a member
        res.status(200).json({ message: 'You are already a member of this trip' });
        return;
      }
      throw err;
    }

    res.status(200).json({ message: 'Successfully joined trip', tripId: invite.tripId });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

/**
 * Lists active invites for a trip (Owner only).
 */
export const getActiveInvites = async (req: Request, res: Response): Promise<void> => {
  try {
    const { tripId } = req.params;
    const invites = await TripInvite.find({ tripId, status: InviteStatus.PENDING });
    res.status(200).json(invites);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

/**
 * Disables an invite (Owner only).
 */
export const disableInvite = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.params;
    const invite = await TripInvite.findOneAndUpdate(
      { token },
      { $set: { status: InviteStatus.DISABLED } },
      { new: true }
    );

    if (!invite) {
      res.status(404).json({ error: 'Invite not found' });
      return;
    }

    res.status(200).json({ message: 'Invite disabled' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
