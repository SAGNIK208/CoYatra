import { Request, Response } from 'express';
import { getAuth } from '@clerk/express';
import { getPresignedUploadUrl } from '../../lib/s3';
import { Attachment } from './attachment.model';
import { User } from '../users/user.model';

export const getUploadUrl = async (req: Request, res: Response): Promise<void> => {
  try {
    const { tripId, fileName, contentType } = req.body;
    const fileKey = `trips/${tripId}/attachments/${Date.now()}-${fileName}`;
    
    const uploadUrl = await getPresignedUploadUrl(fileKey, contentType);
    
    res.status(200).json({
      uploadUrl,
      fileKey,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate upload URL' });
  }
};

export const confirmUpload = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).auth?.userId || getAuth(req).userId;
    const user = await User.findOne({ clerkId: userId });
    
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const { tripId, activityId, checklistItemId, fileName, fileKey, fileSize, mimeType } = req.body;
    
    // Logic: If this is for a checklist item, check assignment rules
    if (checklistItemId) {
      // We need to import ChecklistItem, but let's assume it's available or use mongoose
      const mongoose = require('mongoose');
      const item = await mongoose.model('ChecklistItem').findById(checklistItemId);
      if (item && item.assignedToUserId && item.assignedToUserId.toString() !== user._id.toString()) {
        res.status(403).json({ error: 'Only the assignee can attach files to this assigned task' });
        return;
      }
    }

    // In production, we'd verify the file exists in S3 here.
    // For now, we trust the client (standard for MVP/LocalStack).
    const fileUrl = `${process.env['AWS_ENDPOINT']}/${process.env['AWS_S3_BUCKET_NAME']}/${fileKey}`;

    const attachment = await Attachment.create({
      tripId,
      activityId,
      checklistItemId,
      userId: user._id,
      fileName,
      fileKey,
      fileUrl,
      fileSize,
      mimeType,
    });

    res.status(201).json(attachment);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getTripAttachments = async (req: Request, res: Response): Promise<void> => {
  try {
    const { tripId } = req.params;
    const attachments = await Attachment.find({ tripId }).sort({ createdAt: -1 });
    res.status(200).json(attachments);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const deleteAttachment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const attachment = await Attachment.findByIdAndDelete(id);
    if (!attachment) {
      res.status(404).json({ error: 'Attachment not found' });
      return;
    }
    // Note: In production, also delete from S3
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
