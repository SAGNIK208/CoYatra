import { Request, Response, NextFunction } from 'express';
import { getAuth } from '@clerk/express';

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {

  const auth = getAuth(req);

  if (!auth.userId) {
    res.status(401).json({ error: 'Unauthenticated' });
    return;
  }

  next();
};
