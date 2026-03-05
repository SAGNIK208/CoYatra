import { Schema, model, Document, Types } from 'mongoose';

export interface IPayee {
  user: Types.ObjectId;
  amount: number;
  isPaid: boolean;
  paidAt?: Date;
}

export interface IExpense extends Document {
  tripId: Types.ObjectId;
  activityId?: Types.ObjectId;
  title: string;
  description?: string;
  amount: number;
  currency: string;
  paidByUserId: Types.ObjectId;
  status: 'Pending' | 'Paid' | 'Settled'; // Overall status
  splitType: 'Equal' | 'Percentage' | 'Exact';
  payees: IPayee[];
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
    status: {
      type: String,
      enum: ['Pending', 'Paid', 'Settled'],
      default: 'Pending',
    },
    splitType: {
      type: String,
      enum: ['Equal', 'Percentage', 'Exact'],
      default: 'Equal',
    },
    payees: [{
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      amount: {
        type: Number,
        required: true,
      },
      isPaid: {
        type: Boolean,
        default: false,
      },
      paidAt: {
        type: Date,
      }
    }],
  },
  {
    timestamps: true,
  }
);

export const Expense = model<IExpense>('Expense', ExpenseSchema);
