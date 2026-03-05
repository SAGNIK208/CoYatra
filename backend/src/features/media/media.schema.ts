import { z } from 'zod';
import { CommentContext } from '../../types/enums';

// Media Schemas
export const getPresignedUrlSchema = z.object({
  body: z.object({
    tripId: z.string().min(1, 'Trip ID is required'),
    activityId: z.string().optional(),
    checklistItemId: z.string().optional(),
    fileName: z.string().min(1, 'File name is required'),
    contentType: z.string().min(1, 'Content type is required'),
  }),
});

export const confirmUploadSchema = z.object({
  body: z.object({
    tripId: z.string().min(1, 'Trip ID is required'),
    activityId: z.string().optional(),
    checklistItemId: z.string().optional(),
    fileName: z.string().min(1),
    fileKey: z.string().min(1),
    fileSize: z.number().positive(),
    mimeType: z.string().min(1),
  }),
});

// Comment Schemas
export const createCommentSchema = z.object({
  body: z.object({
    tripId: z.string().min(1, 'Trip ID is required'),
    context: z.nativeEnum(CommentContext),
    contextId: z.string().min(1, 'Context ID (Activity/Day) is required'),
    content: z.string().min(1, 'Comment cannot be empty').max(1000),
  }),
});

export const updateCommentSchema = z.object({
  body: z.object({
    content: z.string().min(1).max(1000),
  }),
});
