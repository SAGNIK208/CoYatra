import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  clerkId: string;
  email: string;
  name?: string;
  phone?: string;
  profilePicUrl?: string;
  bio?: string;
  homeBase?: string;
  travelStyle?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    clerkId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      index: true,
    },

    bio: {
      type: String,
    },
    homeBase: {
      type: String,
    },
    travelStyle: {
      type: String,
    },
    name: {
      type: String,
    },
    phone: {
      type: String,
    },
    profilePicUrl: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const User = model<IUser>('User', UserSchema);
