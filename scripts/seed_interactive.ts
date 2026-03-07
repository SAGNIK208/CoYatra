import mongoose from 'mongoose';
import * as readline from 'readline';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Import models
import { User } from '../backend/src/features/users/user.model';
import { Trip } from '../backend/src/features/trips/models/trip.model';
import { TripMember } from '../backend/src/features/trips/models/trip-member.model';
import { Activity } from '../backend/src/features/activities/activity.model';
import { ChecklistItem } from '../backend/src/features/checklists/checklist-item.model';
import { Expense } from '../backend/src/features/finances/expense.model';

// Types
import { TripRole } from '../backend/src/types/enums';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const prompt = (query: string): Promise<string> => {
  return new Promise((resolve) => rl.question(query, resolve));
};

async function main() {
  console.log('\n🚀 CoYatra Interactive Database Seeder');
  console.log('--------------------------------------------------');

  // 1. Environment Selection
  console.log('Select Environment:');
  console.log('[1] Local Development (uses backend/.env)');
  console.log('[2] Production (requires manual URI)');
  
  const envChoice = await prompt('Choice [1 or 2]: ');
  
  let mongoUri = '';
  
  if (envChoice === '1') {
    // Load local env
    dotenv.config({ path: path.resolve(__dirname, '../backend/.env') });
    mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/coyatra';
    console.log(`\nUsing local URI: ${mongoUri}`);
  } else if (envChoice === '2') {
    mongoUri = await prompt('\nEnter Production MONGO_URI: ');
    if (!mongoUri) {
      console.error('URI is required for production.');
      process.exit(1);
    }
  } else {
    console.error('Invalid choice.');
    process.exit(1);
  }

  // 2. User Selection
  const testEmail = await prompt('\nEnter the exact email of your Main Test User (e.g., sagnik+clerk_test@example.com): ');
  if (!testEmail) {
    console.error('Email is required.');
    process.exit(1);
  }

  // 3. Connect to DB
  try {
    console.log('\nConnecting to database...');
    await mongoose.connect(mongoUri);
    console.log('✅ Connected successfully.');

    // 4. Find Users
    const mainUser = await User.findOne({ email: testEmail });
    if (!mainUser) {
      console.error(`\n❌ Could not find a user with email: ${testEmail}`);
      console.log('Please make sure you have signed up on the frontend using this exact email first!');
      process.exit(1);
    }
    console.log(`✅ Found Main User: ${mainUser.name} (${mainUser._id})`);

    // Create a dummy user for Trips 2 & 3
    let dummyUser = await User.findOne({ email: 'dummy_ceo@coyatra.local' });
    if (!dummyUser) {
      dummyUser = await User.create({
        clerkId: 'seed_dummy_' + Date.now(),
        email: 'dummy_ceo@coyatra.local',
        name: 'CoYatra Seed Bot',
        profilePicUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=coyatra'
      });
      console.log('✅ Created Dummy User for secondary trips.');
    }

    // --- SEEDING LOGIC ---

    // Clean up previous seeds
    console.log('\n🧹 Searching for previous seed data...');
    const prevTrips = await Trip.find({ title: { $regex: /^\[SEED-/ } });
    if (prevTrips.length > 0) {
      const doCleanup = await prompt(`Found ${prevTrips.length} previous seed trips. Do you want to delete them? (y/n): `);
      if (doCleanup.toLowerCase() === 'y') {
        process.stdout.write('Deleting previous seed data... ');
        const tripIds = prevTrips.map(t => t._id);
        await TripMember.deleteMany({ tripId: { $in: tripIds } });
        await Activity.deleteMany({ tripId: { $in: tripIds } });
        await ChecklistItem.deleteMany({ tripId: { $in: tripIds } });
        await Expense.deleteMany({ tripId: { $in: tripIds } });
        await Trip.deleteMany({ _id: { $in: tripIds } });
        console.log('✅ Done.');
      } else {
        console.log('Skipping cleanup.');
      }
    }

    const seedId = `SEED-${Date.now().toString().slice(-6)}`;

    // TRIP 1: MAIN USER IS OWNER (Fully Fleshed Out)
    console.log('\n📅 Creating Trip 1 (Main User = OWNER)...');
    const trip1 = await Trip.create({
      title: `[${seedId}] Grand Swiss Alps Adventure`,
      description: 'A 7-day excursion through the mountains, fully planned.',
      location: 'Switzerland',
      startDateTime: new Date(),
      endDateTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      imageUrl: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?q=80&w=2000&auto=format&fit=crop',
      ownerUserId: mainUser._id,
      createdByUserId: mainUser._id
    });

    await TripMember.create({
      tripId: trip1._id,
      userId: mainUser._id,
      role: TripRole.OWNER,
      joinedAt: new Date()
    });

    // Add rich data to Trip 1
    console.log('  └─ Seeding Activities, Checklists, and Expenses...');
    
    await Activity.insertMany([
      { tripId: trip1._id, name: 'Arrival in Zurich', type: 'TRAVEL', category: 'Transportation', startDateTime: new Date(), location: 'ZRH Airport', order: 0, lastEditedByUserId: mainUser._id },
      { tripId: trip1._id, name: 'Check-in to Alpine Resort', type: 'STAY', category: 'Relaxation', startDateTime: new Date(Date.now() + 2 * 3600000), location: 'Interlaken', order: 1, lastEditedByUserId: mainUser._id },
      { tripId: trip1._id, name: 'Fondue Dinner', type: 'FOOD', category: 'Food', startDateTime: new Date(Date.now() + 6 * 3600000), location: 'Restaurant Taverne', order: 2, lastEditedByUserId: mainUser._id }
    ]);

    await ChecklistItem.insertMany([
      { tripId: trip1._id, title: 'Book Train Passes', isDone: true, createdByUserId: mainUser._id },
      { tripId: trip1._id, title: 'Pack Winter Gear', isDone: false, createdByUserId: mainUser._id },
      { tripId: trip1._id, title: 'Buy Travel Insurance', isDone: false, assignedToUserId: mainUser._id, createdByUserId: mainUser._id }
    ]);

    await Expense.create({
      tripId: trip1._id,
      title: 'Resort Deposit',
      amount: 450,
      currency: 'USD',
      paidByUserId: mainUser._id,
      splitType: 'Equal',
      status: 'Paid',
      payees: [{ user: mainUser._id as any, amount: 450, isPaid: true, paidAt: new Date() }] // User paid for themselves
    });

    // TRIP 2: MAIN USER IS EDITOR
    console.log('\n📅 Creating Trip 2 (Main User = EDITOR)...');
    const trip2 = await Trip.create({
      title: `[${seedId}] Tokyo Tech Tour`,
      description: 'Exploring gadgets and neon lights.',
      location: 'Tokyo, Japan',
      startDateTime: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      endDateTime: new Date(Date.now() + 37 * 24 * 60 * 60 * 1000),
      imageUrl: 'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?q=80&w=2000&auto=format&fit=crop',
      ownerUserId: dummyUser._id,
      createdByUserId: dummyUser._id
    });

    await TripMember.insertMany([
      { tripId: trip2._id, userId: dummyUser._id, role: TripRole.OWNER, joinedAt: new Date() },
      { tripId: trip2._id, userId: mainUser._id, role: TripRole.EDITOR, joinedAt: new Date() } // The magic link!
    ]);

    await ChecklistItem.create({ tripId: trip2._id, title: 'Draft Itinerary', isDone: false, assignedToUserId: mainUser._id, createdByUserId: dummyUser._id });


    // TRIP 3: MAIN USER IS VIEWER
    console.log('\n📅 Creating Trip 3 (Main User = VIEWER)...');
    const trip3 = await Trip.create({
      title: `[${seedId}] Weekend in Paris`,
      description: 'A quick getaway. Look but dont touch!',
      location: 'Paris, France',
      startDateTime: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      endDateTime: new Date(Date.now() + 63 * 24 * 60 * 60 * 1000),
      imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2000&auto=format&fit=crop',
      ownerUserId: dummyUser._id,
      createdByUserId: dummyUser._id
    });

    await TripMember.insertMany([
      { tripId: trip3._id, userId: dummyUser._id, role: TripRole.OWNER, joinedAt: new Date() },
      { tripId: trip3._id, userId: mainUser._id, role: TripRole.VIEWER, joinedAt: new Date() } // The magic link!
    ]);

    console.log('\n--------------------------------------------------');
    console.log('🎉 SEEDING COMPLETE!');
    console.log(`Your test user (${mainUser.email}) now has access to 3 trips with varying permissions.`);
    console.log('Login to the frontend to view them.');
    console.log('--------------------------------------------------\n');

  } catch (err) {
    console.error('💥 Error during seeding:', err);
  } finally {
    await mongoose.disconnect();
    rl.close();
  }
}

main().catch(console.error);
