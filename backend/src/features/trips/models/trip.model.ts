import { Schema, model, Document, Types } from 'mongoose';

export interface ITrip extends Document {
  ownerUserId: Types.ObjectId; // Primary owner reference
  title: string;
  description?: string;
  location?: string;
  startDate: Date;
  endDate: Date;
  createdByUserId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const TripSchema = new Schema<ITrip>(
  {
    ownerUserId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    location: {
      type: String,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
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

export const Trip = model<ITrip>('Trip', TripSchema);
