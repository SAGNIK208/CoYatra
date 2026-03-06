import { getAuth } from '@clerk/express';

/**
 * CoYatra API Seeding Script
 * 
 * Usage:
 * export AUTH_TOKEN="your_clerk_token_here"
 * export TRIP_ID="your_trip_id_here"
 * npx ts-node scripts/seed_trip.ts
 */

const API_BASE = process.env.API_URL || 'http://localhost:3000/api/v1';
const TOKEN = process.env.AUTH_TOKEN;
const TRIP_ID = process.env.TRIP_ID;

if (!TOKEN || !TRIP_ID) {
  console.error('Error: AUTH_TOKEN and TRIP_ID environment variables are required.');
  process.exit(1);
}

const headers = {
  'Authorization': `Bearer ${TOKEN}`,
  'Content-Type': 'application/json'
};

const seedData = {
  activities: [
    { name: 'Arrival & Airport Pickup', type: 'Travel', category: 'Transportation', startDateTime: new Date(Date.now() + 3600000).toISOString(), location: 'Airport Terminal 3', tripId: TRIP_ID, order: 0 },
    { name: 'Hotel Check-in: Grand Palace', type: 'Accommodation', category: 'Relaxation', startDateTime: new Date(Date.now() + 7200000).toISOString(), location: 'Downtown', tripId: TRIP_ID, order: 1 },
    { name: 'Welcome Sunset Dinner', type: 'Activity', category: 'Food', startDateTime: new Date(Date.now() + 25200000).toISOString(), location: 'Beachfront Grill', tripId: TRIP_ID, order: 2 },
    { name: 'Morning Yoga Session', type: 'Activity', category: 'Relaxation', startDateTime: new Date(Date.now() + 86400000).toISOString(), location: 'Hotel Deck', tripId: TRIP_ID, order: 3 },
    { name: 'Guided City Heritage Walk', type: 'Activity', category: 'Sightseeing', startDateTime: new Date(Date.now() + 100800000).toISOString(), location: 'Old Quarter', tripId: TRIP_ID, order: 4 },
    { name: 'Street Food Crawl', type: 'Activity', category: 'Food', startDateTime: new Date(Date.now() + 122400000).toISOString(), location: 'Night Market', tripId: TRIP_ID, order: 5 },
    { name: 'Full Day Island Hopping', type: 'Activity', category: 'Adventure', startDateTime: new Date(Date.now() + 172800000).toISOString(), location: 'Marina Pier', tripId: TRIP_ID, order: 6 },
    { name: 'Cooking Class: Local Cuisine', type: 'Activity', category: 'Culture', startDateTime: new Date(Date.now() + 194400000).toISOString(), location: 'Chef Maria\'s Kitchen', tripId: TRIP_ID, order: 7 },
    { name: 'Mountain Hike: Sunrise Point', type: 'Activity', category: 'Adventure', startDateTime: new Date(Date.now() + 259200000).toISOString(), location: 'Base Camp', tripId: TRIP_ID, order: 8 },
    { name: 'Spa & Wellness Afternoon', type: 'Activity', category: 'Relaxation', startDateTime: new Date(Date.now() + 280800000).toISOString(), location: 'Zen Spa', tripId: TRIP_ID, order: 9 },
    { name: 'Farewell Party', type: 'Activity', category: 'Food', startDateTime: new Date(Date.now() + 345600000).toISOString(), location: 'Rooftop Lounge', tripId: TRIP_ID, order: 10 }
  ],
  tasks: [
    { title: 'Book International Flights', tripId: TRIP_ID },
    { title: 'Renew Passport / Check Visa', tripId: TRIP_ID },
    { title: 'Purchase Travel Insurance', tripId: TRIP_ID },
    { title: 'Exchange Local Currency', tripId: TRIP_ID },
    { title: 'Pack Universal Power Adapter', tripId: TRIP_ID },
    { title: 'Buy Sunscreen & Bug Spray', tripId: TRIP_ID },
    { title: 'Download Offline Google Maps', tripId: TRIP_ID },
    { title: 'Confirm Hotel Bookings', tripId: TRIP_ID },
    { title: 'Scan Important Documents to Cloud', tripId: TRIP_ID },
    { title: 'Setup International Roaming', tripId: TRIP_ID },
    { title: 'Pack First Aid Kit', tripId: TRIP_ID },
    { title: 'Inform Bank of Travel Dates', tripId: TRIP_ID },
    { title: 'Check-in Online (24h before)', tripId: TRIP_ID },
    { title: 'Coordinate Airport Pickup', tripId: TRIP_ID },
    { title: 'Charge Power Bank', tripId: TRIP_ID }
  ],
  expenses: [
    { title: 'Flight Tickets (Team)', amount: 150000, splitType: 'Equal' },
    { title: 'Grand Palace Deposit', amount: 45000, splitType: 'Equal' },
    { title: 'Welcome Dinner Pre-pay', amount: 8500, splitType: 'Equal' },
    { title: 'Island Tour Group Booking', amount: 12000, splitType: 'Equal' },
    { title: 'Miscellaneous Group Fund', amount: 5000, splitType: 'Equal' }
  ]
};

async function seed() {
  console.log(`\n🚀 STARTING EXHAUSTIVE SEED FOR TRIP: ${TRIP_ID}`);
  console.log('--------------------------------------------------');

  try {
    const meRes = await fetch(`${API_BASE}/users/me`, { headers });
    if (!meRes.ok) throw new Error(`Auth failed: ${await meRes.text()}`);
    const me = await meRes.json();
    console.log(`👤 AUTHENTICATED AS: ${me.name || me.email} (${me._id})\n`);

    // 1. Activities
    console.log('📅 Seeding Itinerary Activities...');
    for (const act of seedData.activities) {
      const res = await fetch(`${API_BASE}/activities`, { method: 'POST', headers, body: JSON.stringify(act) });
      if (res.ok) console.log(`  ✅ ${act.name}`);
      else console.error(`  ❌ Failed: ${act.name}`);
    }

    // 2. Checklist
    console.log('\n📝 Seeding Checklist Tasks...');
    for (const task of seedData.tasks) {
      const res = await fetch(`${API_BASE}/checklists`, { method: 'POST', headers, body: JSON.stringify(task) });
      if (res.ok) console.log(`  ✅ ${task.title}`);
      else console.error(`  ❌ Failed: ${task.title}`);
    }

    // 3. Expenses
    console.log('\n💰 Seeding Group Finances...');
    for (const expData of seedData.expenses) {
      const expense = {
        ...expData,
        tripId: TRIP_ID,
        paidByUserId: me._id,
        payees: [me._id], // Defaulting to just the user for demo; UI can add more
        currency: 'INR'
      };
      const res = await fetch(`${API_BASE}/finances`, { method: 'POST', headers, body: JSON.stringify(expense) });
      if (res.ok) console.log(`  ✅ ${expData.title}`);
      else console.error(`  ❌ Failed: ${expData.title}`);
    }

    console.log('\n--------------------------------------------------');
    console.log('✨ SEEDING COMPLETED! Your trip is now ready for demo.');
    console.log('--------------------------------------------------\n');
  } catch (err) {
    console.error('\n💥 FATAL ERROR DURING SEEDING:', err);
  }
}

seed();
