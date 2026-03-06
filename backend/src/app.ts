import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { clerkMiddleware } from '@clerk/express';
import userRouter from './features/users/user.routes';
import tripRouter from './features/trips/trip.routes';
import activityRouter from './features/activities/activity.routes';
import checklistRouter from './features/checklists/checklist.routes';
import commentRouter from './features/comments/comment.routes';
import financeRouter from './features/finances/finance.routes';
import inviteRouter from './features/collaboration/invite.routes';
import mediaRouter from './features/media/media.routes';

const app: Application = express();

// ── Middleware ────────────────────────────────────────────────────────────────
const corsOrigins = process.env['CORS_ORIGINS'] 
  ? process.env['CORS_ORIGINS'].split(',').map(o => o.trim()) 
  : [process.env['CLIENT_URL'] || ''];

app.use(cors({
  origin: corsOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(clerkMiddleware());

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/v1/users', userRouter);
app.use('/api/v1/trips', tripRouter);
app.use('/api/v1/activities', activityRouter);
app.use('/api/v1/checklists', checklistRouter);
app.use('/api/v1/comments', commentRouter);
app.use('/api/v1/finances', financeRouter);
app.use('/api/v1/invites', inviteRouter);
app.use('/api/v1/media', mediaRouter);

// ── 404 handler ───────────────────────────────────────────────────────────────
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

// ── Global error handler ──────────────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

export default app;
