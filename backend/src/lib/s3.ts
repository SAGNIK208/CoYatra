import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import env from '../config/env';

const s3Client = new S3Client({
  region: env.AWS_REGION,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
  endpoint: process.env['AWS_ENDPOINT'] || undefined,
  forcePathStyle: !!process.env['AWS_ENDPOINT'], // Required for LocalStack
});

/**
 * Generates a pre-signed URL for uploading a file to S3.
 * @param key The S3 object key (path + filename).
 * @param contentType The MIME type of the file.
 * @param expiresIn Time in seconds until the URL expires (default 3600).
 */
export const getPresignedUploadUrl = async (
  key: string,
  contentType: string,
  expiresIn = 3600
): Promise<string> => {
  const command = new PutObjectCommand({
    Bucket: env.AWS_S3_BUCKET_NAME,
    Key: key,
    ContentType: contentType,
  });

  const url = await getSignedUrl(s3Client, command, { expiresIn });

  // If we have a public endpoint, replace the internal one in the generated URL
  if (env.AWS_S3_PUBLIC_ENDPOINT && env.AWS_ENDPOINT) {
    return url.replace(env.AWS_ENDPOINT, env.AWS_S3_PUBLIC_ENDPOINT);
  }

  return url;
};

/**
 * Utility to generate a consistent S3 key for profile pictures.
 * Format: profiles/{clerkId}/{timestamp}-{filename}
 */
export const generateProfilePicKey = (clerkId: string, fileName: string): string => {
  const timestamp = Date.now();
  const sanitizedFileName = fileName.replace(/\s+/g, '-').toLowerCase();
  return `profiles/${clerkId}/${timestamp}-${sanitizedFileName}`;
};
