# CoYatra Dynamic Seeding Guide

This guide ensures that any user (even with a brand new account) can populate their Trip with a comprehensive set of demo data in seconds.

## Step 1: Create Your Trip
1.  Log in to the **CoYatra** app.
2.  On the Dashboard, click **"Create Trip"**.
3.  Enter a Title (e.g., "Grand Vacations") and pick your dates.
4.  Once created, copy the **Trip ID** from the browser URL:
    - URL: `http://localhost/trip/65df...`
    - **ID**: `65df...` (24-character string).

## Step 2: Extract Your Clerk Auth Token
To seed data, the script needs to "act as you". You must provide your temporary session token.
1.  In your browser (Chrome/Edge/Safari), right-click and select **"Inspect"** to open Developer Tools.
2.  Go to the **"Network"** tab.
3.  Refresh the page or click on "Itinerary".
4.  Find a request named `me` or `trips` in the list.
5.  Click it, scroll to **"Request Headers"**, and find **`Authorization`**.
6.  Copy the long string starting *after* `Bearer `. (e.g., `eyJhbG...`).

## Step 3: Run the Seeding Script
Open your terminal in the project root and execute the following:

```bash
# 1. Set your token
export AUTH_TOKEN="PASTE_YOUR_FULL_TOKEN_HERE"

# 2. Set your Trip ID
export TRIP_ID="PASTE_YOUR_TRIP_ID_HERE"

# 3. Run the script
npx ts-node scripts/seed_trip.ts
```

## What will be seeded?
The script is exhaustive and will add:
- **Itinerary**: 10+ activities (Check-ins, Dinner, Island Hopping, Spa, etc.).
- **Checklist**: 15 essential travel tasks (Passport, Insurance, Roaming, etc.).
- **Finances**: 5 major group expenses (Flight, Hotel Deposit, Dinner Fund, etc.).

---

## Troubleshooting
- **Permission Denied**: Ensure you are using the token from the account that *owns* the trip.
- **Port Error**: If you changed the backend port, use `export API_URL="http://localhost:XXXX/api/v1"` before running.
