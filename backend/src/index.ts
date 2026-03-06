import mongoose from 'mongoose';
import app from './app';
import env from './config/env';
import logger from './utils/logger';

const start = async (): Promise<void> => {
  try {
    await mongoose.connect(env.MONGO_URI);
    logger.info('Connected to MongoDB');

    app.listen(env.PORT, () => {
      logger.info(
        { port: env.PORT, env: env.NODE_ENV },
        `Server running on http://localhost:${env.PORT}`
      );
    });
  } catch (error) {
    logger.error(error, 'Failed to start server');
    process.exit(1);
  }
};

start();
