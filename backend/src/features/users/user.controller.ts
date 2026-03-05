import { Request, Response } from 'express';
import { getAuth } from '@clerk/express';
import { User } from './user.model';

export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).auth?.userId || getAuth(req).userId;

    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

/**
 * Provides a pre-signed URL for a user to upload their profile picture.
 */
export const getProfileUploadUrl = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).auth?.userId || getAuth(req).userId;
    const { fileName, fileType } = req.body;

    if (!userId) {
      res.status(401).json({ error: 'Unauthenticated' });
      return;
    }

    const { getPresignedUploadUrl, generateProfilePicKey } = await import('../../lib/s3');
    const key = generateProfilePicKey(userId, fileName);
    const uploadUrl = await getPresignedUploadUrl(key, fileType);

    res.status(200).json({
      uploadUrl,
      key,
    });
  } catch (error) {
    console.error('S3 Presign Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const updateMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).auth?.userId || getAuth(req).userId;
    const { name, firstName, lastName, phone, profilePicUrl, bio, homeBase, travelStyle } = req.body;

    // Use firstName/lastName if name is not provided
    const combinedName = name || (firstName || lastName ? `${firstName || ''} ${lastName || ''}`.trim() : undefined);

    // Sanitize: Treat empty strings as undefined so they aren't stored as empty strings in DB
    const sanitize = (val: any) => (val === "" ? undefined : val);

    const user = await User.findOneAndUpdate(
      { clerkId: userId },
      { 
        $set: { 
          name: combinedName, 
          phone: sanitize(phone), 
          profilePicUrl: sanitize(profilePicUrl), 
          bio: sanitize(bio), 
          homeBase: sanitize(homeBase), 
          travelStyle: sanitize(travelStyle) 
        } 
      },
      { new: true }
    );

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

/**
 * Syncs user from Clerk to local MongoDB.
 * Useful for frontends to call after a successful login/signup.
 */
export const syncUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).auth?.userId || getAuth(req).userId;
    const { email, name, profilePicUrl } = req.body;

    const user = await User.findOneAndUpdate(
      { clerkId: userId },
      { 
        $set: { 
          email, 
          name: name || undefined, 
          profilePicUrl: profilePicUrl === "" ? undefined : profilePicUrl 
        } 
      },
      { upsert: true, new: true }
    );

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
