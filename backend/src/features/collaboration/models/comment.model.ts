import { Schema, model, Document, Types } from 'mongoose';
import { CommentContext } from '../../../types/enums';

export interface IComment extends Document {
  tripId: Types.ObjectId;
  contextType: CommentContext;
  activityId?: Types.ObjectId; // set when contextType = ACTIVITY
  date?: Date;                 // set when contextType = DAY (YYYY-MM-DD)
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
    contextType: {
      type: String,
      enum: Object.values(CommentContext),
      required: true,
    },
    activityId: {
      type: Schema.Types.ObjectId,
      ref: 'Activity',
    },
    date: {
      type: Date,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Comment = model<IComment>('Comment', CommentSchema);
