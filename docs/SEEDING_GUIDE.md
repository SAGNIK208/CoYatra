# CoYatra Interactive Seeding Guide

This guide ensures that any tester or evaluator can instantly provision their account with a comprehensive set of demo data representing different user roles and test cases.

## Step 1: Create Your Account
Create an account on the CoYatra frontend frontend.
*Note: Make sure to complete the signup process so the user is registered in the MongoDB database via Clerk webhooks.*

## Step 2: Run the Seeder
Open your terminal, navigate to the `backend` folder, and execute the interactive seed script:

```bash
cd backend
npm run seed
```

## Step 3: Follow the Prompts
The script is interactive and will ask you three things:
1. **Environment**: Choose `[1]` for Local Development or `[2]` for Production.
2. **MongoDB URI**: If you chose Production, paste your live MongoDB connection string.
3. **Email**: Enter the exact email address you used to sign up in Step 1.

## What will be seeded?
The script will perform a deep cleanup of any previous seed data and then generate **three complete trips** for your account:

1. **Trip 1 (Owner Role)**: A fully fleshed-out trip where you are the Owner. It is pre-populated with Activities, Checklist items, and Expenses (including paid statuses).
2. **Trip 2 (Editor Role)**: A trip owned by a dummy bot user where you have Editor permissions.
3. **Trip 3 (Viewer Role)**: A trip owned by a dummy bot user where you have strict read-only Viewer permissions.

Log back into the frontend dashboard after the script completes to explore the access controls and data!
