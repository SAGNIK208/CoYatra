import { Schema, model, Document, Types } from 'mongoose';

export interface IAttachment extends Document {
  tripId: Types.ObjectId;
  activityId?: Types.ObjectId;
  checklistItemId?: Types.ObjectId;
  userId: Types.ObjectId;
  fileName: string;
  fileKey: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  createdAt: Date;
  updatedAt: Date;
}

const AttachmentSchema = new Schema<IAttachment>(
  {
    tripId: {
      type: Schema.Types.ObjectId,
      ref: 'Trip',
      required: true,
      index: true,
    },
    activityId: {
      type: Schema.Types.ObjectId,
      ref: 'Activity',
      index: true,
    },
    checklistItemId: {
      type: Schema.Types.ObjectId,
      ref: 'ChecklistItem',
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    fileKey: {
      type: String,
      required: true,
      unique: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number,
      required: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Attachment = model<IAttachment>('Attachment', AttachmentSchema);
