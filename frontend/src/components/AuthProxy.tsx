import { useAuth, useUser } from '@clerk/clerk-react';
import { useEffect, useState, ReactNode } from 'react';
import api from '../lib/api';
import { userService } from '../lib/userService';

interface AuthProxyProps {
  children: ReactNode;
}

/**
 * AuthProxy ensures that the Axios auth interceptor is registered 
 * BEFORE any child components (like Dashboard) attempt to make API calls.
 */
export function AuthProxy({ children }: AuthProxyProps) {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const [isInterceptorReady, setIsInterceptorReady] = useState(false);

  useEffect(() => {
    if (!isLoaded) return;

    // 1. Setup Interceptor
    const interceptor = api.interceptors.request.use(async (config) => {
      try {
        const token = await getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (err) {
        console.error('Error fetching auth token:', err);
      }
      return config;
    });

    setIsInterceptorReady(true);

    // 2. Sync User once
    if (isSignedIn && user) {
      const syncUser = async () => {
        try {
          const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
          const syncName = fullName || user.primaryEmailAddress?.emailAddress?.split('@')[0] || 'Traveler';

          await userService.syncClerk({
            email: user.primaryEmailAddress?.emailAddress,
            name: syncName,
            profilePicUrl: user.imageUrl
          });
        } catch (error) {
          console.error('Error during User Sync:', error);
        }
      };
      syncUser();
    }

    return () => {
      api.interceptors.request.eject(interceptor);
      setIsInterceptorReady(false);
    };
  }, [isLoaded, isSignedIn, user, getToken]);

  if (!isLoaded || (isSignedIn && !isInterceptorReady)) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium text-slate-500">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
