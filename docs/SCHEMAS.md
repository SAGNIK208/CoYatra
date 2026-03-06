# CoYatra Data Schemas

Latest schemas for Mongoose and Zod validation.

## User
```typescript
{
  clerkId: string; // Unique Clerk ID
  email: string;
  name?: string;
  phone?: string;
  profilePicUrl?: string;
  bio?: string;
  homeBase?: string;
  travelStyle?: string;
}
```

## Trip
```typescript
{
  ownerUserId: ObjectId; // Ref: User
  title: string;
  description?: string;
  location?: string;
  startDateTime: Date;
  endDateTime: Date;
  defaultCurrency: string; // Default: INR
  timezone: string; // Default: UTC
  imageUrl?: string;
  createdByUserId: ObjectId; // Ref: User
}
```

## TripMember
```typescript
{
  tripId: ObjectId; // Ref: Trip
  userId: ObjectId; // Ref: User
  role: 'OWNER' | 'EDITOR' | 'VIEWER';
  joinedAt: Date;
  addedByUserId?: ObjectId;
}
```

## Expense
```typescript
{
  tripId: ObjectId;
  activityId?: ObjectId;
  title: string;
  amount: number;
  currency: string;
  paidByUserId: ObjectId;
  status: 'Pending' | 'Paid' | 'Settled';
  splitType: 'Equal' | 'Percentage' | 'Exact';
  payees: [
    {
      user: ObjectId;
      amount: number;
      isPaid: boolean;
      paidAt?: Date;
    }
  ];
}
```

## ChecklistItem
```typescript
{
  tripId: ObjectId;
  title: string;
  assignedToUserId?: ObjectId;
  isDone: boolean;
  dueDate?: Date;
  completedAt?: Date;
  createdByUserId: ObjectId;
}
```

## Activity
```typescript
{
  tripId: ObjectId;
  name: string;
  description?: string;
  type: string; // e.g., 'Travel', 'Accommodation', 'Activity'
  subType?: string;
  startDateTime: Date;
  endDateTime?: Date;
  category?: string;
  cost?: string;
  timezone: string;
  isAllDay: boolean;
  location?: string;
  order: number;
}
```

## Attachment
```typescript
{
  tripId: ObjectId;
  activityId?: ObjectId;
  checklistItemId?: ObjectId;
  userId: ObjectId;
  fileName: string;
  fileKey: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
}
```

## TripInvite
```typescript
{
  tripId: ObjectId;
  createdByUserId: ObjectId;
  token: string;
  role: 'EDITOR' | 'VIEWER';
  status: 'Pending' | 'Accepted' | 'Expired';
  expiresAt?: Date;
}
```