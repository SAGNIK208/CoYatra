import { Request, Response, NextFunction } from 'express';
import { getAuth } from '@clerk/express';

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  // ── LOCAL TESTING BYPASS ───────────────────────────────────────────────────
  // Allows testing without frontend/Clerk by passing X-Mock-User-Id header
  if (process.env['NODE_ENV'] === 'development' && req.headers['x-mock-user-id']) {
    // We modify the req object to simulate Clerk's getAuth behavior
    (req as any).auth = { userId: req.headers['x-mock-user-id'] };
    return next();
  }
  // ────────────────────────────────────────────────────────────────────────────

  const auth = getAuth(req);

  if (!auth.userId) {
    res.status(401).json({ error: 'Unauthenticated' });
    return;
  }

  next();
};
