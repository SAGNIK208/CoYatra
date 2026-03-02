import { Schema, model, Document, Types } from 'mongoose';

export interface IExpense extends Document {
  tripId: Types.ObjectId;
  activityId?: Types.ObjectId; // Optional link to specific activity
  title: string;
  description?: string;
  amount: number;
  currency: string;
  paidByUserId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ExpenseSchema = new Schema<IExpense>(
  {
    tripId: {
      type: Schema.Types.ObjectId,
      ref: 'Trip',
      required: true,
      index: true,
    },
    activityId: {
      type: Schema.Types.ObjectId,
      ref: 'Activity',
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
      default: 'INR',
    },
    paidByUserId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Expense = model<IExpense>('Expense', ExpenseSchema);
