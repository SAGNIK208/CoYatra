import { Schema, model, Document, Types } from 'mongoose';

export interface IAttachment extends Document {
  tripId: Types.ObjectId;
  fileName: string;
  fileType: string;
  fileSize: number;
  storageKey: string;
  url: string;
  uploadedByUserId: Types.ObjectId;
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
    fileName: {
      type: String,
      required: true,
    },
    fileType: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number,
      required: true,
    },
    storageKey: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    uploadedByUserId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Attachment = model<IAttachment>('Attachment', AttachmentSchema);
