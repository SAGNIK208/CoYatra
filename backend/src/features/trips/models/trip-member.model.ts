import { Schema, model, Document, Types } from 'mongoose';
import { TripRole } from '../../../types/enums';

export interface ITripMember extends Document {
  tripId: Types.ObjectId;
  userId: Types.ObjectId;
  role: TripRole;
  joinedAt: Date;
  addedByUserId?: Types.ObjectId;
}

const TripMemberSchema = new Schema<ITripMember>(
  {
    tripId: {
      type: Schema.Types.ObjectId,
      ref: 'Trip',
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    role: {
      type: String,
      enum: Object.values(TripRole),
      default: TripRole.VIEWER,
      required: true,
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
    addedByUserId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure a user is only in a trip once
TripMemberSchema.index({ tripId: 1, userId: 1 }, { unique: true });

export const TripMember = model<ITripMember>('TripMember', TripMemberSchema);
