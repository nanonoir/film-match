/**
 * UserProvider
 *
 * Provider component for UserContext
 * Now uses React Query with useAuth hook for authentication
 * Simplifies to only manage local UI state, delegates to server state management
 */

import React, { useCallback, ReactNode } from 'react';
import { useAuth } from '@/hooks/api';
import { UserContext, initialUserState, type UserProfile } from './UserContext';

/**
 * Provider Props
 */
interface UserProviderProps {
  children: ReactNode;
}

/**
 * UserProvider Component
 * Delegates authentication to useAuth (React Query)
 * Only manages derived/local state
 */
export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const {
    currentUser,
    isLoadingUser,
    isUserError,
    userError,
    isAuthenticated,
    loginWithGoogle,
    isLoggingIn,
    loginError,
    logout,
    isLoggingOut,
  } = useAuth();

  // Convert UserDTO to UserProfile for backward compatibility
  const userProfile: UserProfile | null = currentUser
    ? {
        id: String(currentUser.id),
        email: currentUser.email,
        name: currentUser.name || currentUser.username || 'Usuario',
        nickname: currentUser.username || 'usuario',
        avatar: currentUser.picture || undefined,
        bio: undefined,
        twitterUrl: undefined,
        instagramUrl: undefined,
        createdAt: new Date(currentUser.createdAt),
      } as UserProfile
    : null;

  // Maintain backward compatibility with old API
  const updateProfile = useCallback((_profile: Partial<UserProfile>) => {
    // In the future, this could call an API endpoint to update user profile
    console.log('Profile update not yet implemented with API');
  }, []);

  // Map React Query state to the old context interface
  const value = {
    isAuthenticated,
    user: userProfile,
    loading: isLoadingUser || isLoggingIn,
    error: userError || loginError || (isUserError ? new Error('Failed to load user') : null),

    // Actions
    login: async (_email: string, _password: string) => {
      // TODO: Implement email/password login when backend supports it
      throw new Error('Email/password login not yet implemented');
    },
    loginWithGoogle: async () => {
      // Get Google auth URL first
      loginWithGoogle(''); // Will need token from OAuth flow
    },
    logout: () => {
      logout();
      return Promise.resolve();
    },
    register: async (_email: string, _password: string) => {
      // TODO: Implement registration when backend supports it
      throw new Error('Registration not yet implemented');
    },
    updateProfile,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
