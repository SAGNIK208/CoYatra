import { Schema, model, Document, Types } from 'mongoose';

export interface ITrip extends Document {
  ownerUserId: Types.ObjectId; // Primary owner reference
  title: string;
  description?: string;
  location?: string;
  startDateTime: Date;
  endDateTime: Date;
  defaultCurrency: string;
  timezone: string;
  imageUrl?: string;
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
    startDateTime: {
      type: Date,
      required: true,
    },
    endDateTime: {
      type: Date,
      required: true,
    },
    defaultCurrency: {
      type: String,
      required: true,
      default: 'INR',
    },
    timezone: {
      type: String,
      required: true,
      default: 'UTC',
    },
    imageUrl: {
      type: String,
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
