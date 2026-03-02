import { Schema, model, Document, Types } from 'mongoose';
import { ActivityType } from '../../types/enums';

export interface IActivity extends Document {
  tripId: Types.ObjectId;
  name: string;
  description?: string;
  type: ActivityType;
  subType?: string;
  
  // Timing
  startDateTime: Date;
  endDateTime?: Date;
  timezone: string;
  isAllDay: boolean;

  // Location
  location?: string;
  startLocation?: string; // Travel only
  endLocation?: string;   // Travel only

  // External IDs
  googlePlaceId?: string;
  latitude?: number;
  longitude?: number;

  // Ordering
  order: number;

  // Audit
  lastEditedByUserId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ActivitySchema = new Schema<IActivity>(
  {
    tripId: {
      type: Schema.Types.ObjectId,
      ref: 'Trip',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    type: {
      type: String,
      enum: Object.values(ActivityType),
      required: true,
    },
    subType: {
      type: String,
    },
    startDateTime: {
      type: Date,
      required: true,
      index: true,
    },
    endDateTime: {
      type: Date,
    },
    timezone: {
      type: String,
      required: true,
      default: 'UTC',
    },
    isAllDay: {
      type: Boolean,
      default: false,
    },
    location: {
      type: String,
    },
    startLocation: {
      type: String,
    },
    endLocation: {
      type: String,
    },
    googlePlaceId: {
      type: String,
    },
    latitude: {
      type: Number,
    },
    longitude: {
      type: Number,
    },
    order: {
      type: Number,
      required: true,
      default: 0,
    },
    lastEditedByUserId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Activity = model<IActivity>('Activity', ActivitySchema);
