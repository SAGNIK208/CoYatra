import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { TripRole } from '../types/enums';
import logger from '../utils/logger';

/**
 * Middleware to check if a user has a specific role in a trip.
 * Expects tripId to be in req.params or req.body.
 */
export const authorize = (roles: TripRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    let tripId: string | undefined;
    let userId: string | undefined;
    try {
      userId = (req as any).auth?.userId;
      tripId = req.params['tripId'] || req.body?.['tripId'] || req.params['id'];

      // Resource lookup (Activity, Checklist, Finance, etc.)
      if (req.params['id']) {
        const id = req.params['id'];
        try {
          if (req.baseUrl.includes('activities')) {
            const resource = await mongoose.model('Activity').findById(id);
            if (resource) tripId = (resource as any).tripId.toString();
          } else if (req.baseUrl.includes('checklists')) {
            const resource = await mongoose.model('ChecklistItem').findById(id);
            if (resource) tripId = (resource as any).tripId.toString();
          } else if (req.baseUrl.includes('finances')) {
            const resource = await mongoose.model('Expense').findById(id);
            if (resource) tripId = (resource as any).tripId.toString();
          } else if (req.baseUrl.includes('media')) {
            const resource = await mongoose.model('Attachment').findById(id);
            if (resource) tripId = (resource as any).tripId.toString();
          } else if (req.baseUrl.includes('comments')) {
            const resource = await mongoose.model('Comment').findById(id);
            if (resource) tripId = (resource as any).tripId.toString();
          }
        } catch (mErr: any) {
          logger.error(mErr, 'Model lookup failed');
          return res.status(500).json({ error: `Model lookup failed for ${req.baseUrl}: ${mErr.message}` });
        }
      }

      if (!tripId || tripId === 'undefined' || tripId.length < 12) {
        return res.status(400).json({ error: 'Valid Trip ID is required for authorization' });
      }

      let user;
      try {
        user = await mongoose.model('User').findOne({ clerkId: userId });
      } catch (uErr: any) {
        logger.error(uErr, 'User lookup failed');
        return res.status(500).json({ error: `User lookup failed: ${uErr.message}` });
      }

      if (!user) {
        return res.status(404).json({ error: 'User not found in database' });
      }

      let membership;
      try {
        membership = await mongoose.model('TripMember').findOne({
          tripId,
          userId: user._id,
        });
      } catch (tmErr: any) {
        logger.error(tmErr, 'Membership lookup failed');
        return res.status(500).json({ error: `Membership lookup failed: ${tmErr.message}` });
      }

      if (!membership || !roles.includes((membership as any).role)) {
        logger.error('Insufficient permissions');
        return res.status(403).json({ error: 'Insufficient permissions' });
      }

      (req as any).membership = membership;
      next();
    } catch (error: any) {
      logger.error(error, 'Authorization Error');
      res.status(500).json({ 
        error: `Global RBAC error: ${error.message}`,
        stack: error.stack 
      });
    }
  };
};
