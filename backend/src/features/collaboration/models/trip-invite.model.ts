import { Schema, model, Document, Types } from 'mongoose';
import { TripRole, InviteStatus } from '../../../types/enums';

export interface ITripInvite extends Document {
  tripId: Types.ObjectId;
  createdByUserId: Types.ObjectId;
  token: string;
  role: TripRole;
  status: InviteStatus;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const TripInviteSchema = new Schema<ITripInvite>(
  {
    tripId: {
      type: Schema.Types.ObjectId,
      ref: 'Trip',
      required: true,
      index: true,
    },
    createdByUserId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    token: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    role: {
      type: String,
      enum: Object.values(TripRole),
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(InviteStatus),
      default: InviteStatus.PENDING,
      required: true,
    },
    expiresAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export const TripInvite = model<ITripInvite>('TripInvite', TripInviteSchema);
