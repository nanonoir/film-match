/**
 * UserProvider
 *
 * Provider component for UserContext
 * Handles authentication and persists to localStorage
 */

import React, { useReducer, useCallback, useEffect, ReactNode } from 'react';
import { UserContext, initialUserState, type UserState, type UserProfile } from './UserContext';

const STORAGE_KEY = 'film-match:user';

/**
 * Action Types
 */
type UserAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: UserProfile }
  | { type: 'LOGIN_FAILURE'; payload: Error }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_PROFILE'; payload: Partial<UserProfile> }
  | { type: 'SET_LOADING'; payload: boolean };

/**
 * Reducer Function
 */
function userReducer(state: UserState, action: UserAction): UserState {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        loading: true,
        error: null,
      };

    case 'LOGIN_SUCCESS':
      return {
        isAuthenticated: true,
        user: action.payload,
        loading: false,
        error: null,
      };

    case 'LOGIN_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case 'LOGOUT':
      return {
        isAuthenticated: false,
        user: null,
        loading: false,
        error: null,
      };

    case 'UPDATE_PROFILE':
      if (!state.user) return state;
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };

    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };

    default:
      return state;
  }
}

/**
 * Load user from localStorage
 */
function loadUserFromStorage(): UserState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const user = JSON.parse(stored);
      return {
        isAuthenticated: true,
        user: {
          ...user,
          createdAt: new Date(user.createdAt),
        },
        loading: false,
        error: null,
      };
    }
  } catch (err) {
    console.error('Error loading user from storage:', err);
  }
  return { ...initialUserState, loading: false };
}

/**
 * Provider Props
 */
interface UserProviderProps {
  children: ReactNode;
}

/**
 * UserProvider Component
 */
export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialUserState, loadUserFromStorage);

  // Persist to localStorage when user changes
  useEffect(() => {
    try {
      if (state.user) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state.user));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (err) {
      console.error('Error saving user to storage:', err);
    }
  }, [state.user]);

  // Actions
  const login = useCallback(async (email: string, password: string) => {
    dispatch({ type: 'LOGIN_START' });

    try {
      // Simulate API call - replace with real authentication
      await new Promise(resolve => setTimeout(resolve, 1000));

      const user: UserProfile = {
        id: crypto.randomUUID(),
        email,
        name: email.split('@')[0],
        createdAt: new Date(),
      };

      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Login failed');
      dispatch({ type: 'LOGIN_FAILURE', payload: error });
      throw error;
    }
  }, []);

  const loginWithGoogle = useCallback(async () => {
    dispatch({ type: 'LOGIN_START' });

    try {
      // Simulate Google OAuth - replace with real implementation
      await new Promise(resolve => setTimeout(resolve, 1000));

      const user: UserProfile = {
        id: crypto.randomUUID(),
        email: 'user@gmail.com',
        name: 'Google User',
        avatar: 'https://via.placeholder.com/150',
        createdAt: new Date(),
      };

      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Google login failed');
      dispatch({ type: 'LOGIN_FAILURE', payload: error });
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      // Simulate API call if needed
      await new Promise(resolve => setTimeout(resolve, 500));
      dispatch({ type: 'LOGOUT' });
    } catch (err) {
      console.error('Logout error:', err);
      // Even if API fails, logout locally
      dispatch({ type: 'LOGOUT' });
    }
  }, []);

  const register = useCallback(async (email: string, password: string) => {
    dispatch({ type: 'LOGIN_START' });

    try {
      // Simulate API call - replace with real registration
      await new Promise(resolve => setTimeout(resolve, 1000));

      const user: UserProfile = {
        id: crypto.randomUUID(),
        email,
        name: email.split('@')[0],
        createdAt: new Date(),
      };

      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Registration failed');
      dispatch({ type: 'LOGIN_FAILURE', payload: error });
      throw error;
    }
  }, []);

  const updateProfile = useCallback((profile: Partial<UserProfile>) => {
    dispatch({ type: 'UPDATE_PROFILE', payload: profile });
  }, []);

  const value = {
    ...state,
    login,
    loginWithGoogle,
    logout,
    register,
    updateProfile,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
