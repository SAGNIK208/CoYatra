import { Schema, model, Document, Types } from 'mongoose';
import { CommentContext } from '../../types/enums';

export interface IComment extends Document {
  tripId: Types.ObjectId;
  context: CommentContext;
  contextId: Types.ObjectId; // ActivityId or DayId
  userId: Types.ObjectId;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema<IComment>(
  {
    tripId: {
      type: Schema.Types.ObjectId,
      ref: 'Trip',
      required: true,
      index: true,
    },
    context: {
      type: String,
      enum: Object.values(CommentContext),
      required: true,
    },
    contextId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: true,
      maxlength: 1000,
    },
  },
  {
    timestamps: true,
  }
);

export const Comment = model<IComment>('Comment', CommentSchema);
