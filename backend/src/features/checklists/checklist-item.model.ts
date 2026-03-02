import { Schema, model, Document, Types } from 'mongoose';

export interface IChecklistItem extends Document {
  tripId: Types.ObjectId;
  description: string;
  assignedToUserId?: Types.ObjectId;
  isDone: boolean;
  dueDate?: Date;
  completedAt?: Date;
  createdByUserId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ChecklistItemSchema = new Schema<IChecklistItem>(
  {
    tripId: {
      type: Schema.Types.ObjectId,
      ref: 'Trip',
      required: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
    },
    assignedToUserId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    isDone: {
      type: Boolean,
      default: false,
    },
    dueDate: {
      type: Date,
    },
    completedAt: {
      type: Date,
    },
    createdByUserId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const ChecklistItem = model<IChecklistItem>('ChecklistItem', ChecklistItemSchema);
