import dotenv from 'dotenv';

dotenv.config();

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

const env = {
  PORT: parseInt(process.env['PORT'] ?? '3000', 10),
  MONGO_URI: requireEnv('MONGO_URI'),
  NODE_ENV: (process.env['NODE_ENV'] ?? 'development') as 'development' | 'production' | 'test',
  CLERK_PUBLISHABLE_KEY: requireEnv('CLERK_PUBLISHABLE_KEY'),
  CLERK_SECRET_KEY: requireEnv('CLERK_SECRET_KEY'),
  AWS_ACCESS_KEY_ID: requireEnv('AWS_ACCESS_KEY_ID'),
  AWS_SECRET_ACCESS_KEY: requireEnv('AWS_SECRET_ACCESS_KEY'),
  AWS_REGION: requireEnv('AWS_REGION'),
  AWS_S3_BUCKET_NAME: requireEnv('AWS_S3_BUCKET_NAME'),
  AWS_ENDPOINT: process.env['AWS_ENDPOINT'],
  AWS_S3_PUBLIC_ENDPOINT: process.env['AWS_S3_PUBLIC_ENDPOINT'],
} as const;

export default env;
