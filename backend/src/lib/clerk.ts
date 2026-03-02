import { createClerkClient } from '@clerk/express';
import env from '../config/env';

export const clerkClient = createClerkClient({
  publishableKey: env.CLERK_PUBLISHABLE_KEY,
  secretKey: env.CLERK_SECRET_KEY,
});
