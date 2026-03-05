import { z } from 'zod';

export const syncUserSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email format'),
    name: z.string().optional(),
    profilePicUrl: z.string().url('Invalid URL format').optional(),
  }),
});

export const updateMeSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name cannot be empty').optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    bio: z.string().max(500, 'Bio too long').optional(),
    homeBase: z.string().optional(),
    travelStyle: z.string().optional(),
    phone: z.string().min(5, 'Invalid phone number').optional(),
    profilePicUrl: z.string().url('Invalid URL format').optional(),
  }),
});

export const getProfileUploadUrlSchema = z.object({
  body: z.object({
    fileName: z.string().min(1, 'fileName is required'),
    fileType: z.string().regex(/^image\/(jpeg|png|webp|gif)$/, 'Only common image types are allowed (jpg, png, webp, gif)'),
  }),
});
