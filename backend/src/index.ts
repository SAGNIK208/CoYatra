import mongoose from 'mongoose';
import app from './app';
import env from './config/env';

const start = async (): Promise<void> => {
  try {
    await mongoose.connect(env.MONGO_URI);
    console.log('Connected to MongoDB');

    app.listen(env.PORT, () => {
      console.log(`Server running on http://localhost:${env.PORT} [${env.NODE_ENV}]`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

start();
