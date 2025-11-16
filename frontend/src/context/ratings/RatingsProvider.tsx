/**
 * RatingsProvider
 *
 * Provider component for RatingsContext
 * State management only - business logic in custom hooks
 */

import React, { useReducer, useCallback, ReactNode } from 'react';
import { RatingsContext, initialRatingsState, type RatingsState } from './RatingsContext';
import type { UserRating } from '@core';

/**
 * Action Types
 */
type RatingsAction =
  | { type: 'SET_RATINGS'; payload: UserRating[] }
  | { type: 'ADD_RATING'; payload: UserRating }
  | { type: 'REMOVE_RATING'; payload: number }
  | { type: 'CLEAR_RATINGS' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: Error | null };

/**
 * Reducer Function
 */
function ratingsReducer(state: RatingsState, action: RatingsAction): RatingsState {
  switch (action.type) {
    case 'SET_RATINGS':
      return {
        ...state,
        ratings: action.payload,
        loading: false,
        error: null,
      };

    case 'ADD_RATING':
      // Replace existing rating or add new
      const existingIndex = state.ratings.findIndex(r => r.movieId === action.payload.movieId);
      if (existingIndex >= 0) {
        const updated = [...state.ratings];
        updated[existingIndex] = action.payload;
        return { ...state, ratings: updated };
      }
      return {
        ...state,
        ratings: [...state.ratings, action.payload],
      };

    case 'REMOVE_RATING':
      return {
        ...state,
        ratings: state.ratings.filter(r => r.movieId !== action.payload),
      };

    case 'CLEAR_RATINGS':
      return {
        ...state,
        ratings: [],
      };

    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false,
      };

    default:
      return state;
  }
}

/**
 * Provider Props
 */
interface RatingsProviderProps {
  children: ReactNode;
}

/**
 * RatingsProvider Component
 */
export const RatingsProvider: React.FC<RatingsProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(ratingsReducer, initialRatingsState);

  // Actions
  const setRatings = useCallback((ratings: UserRating[]) => {
    dispatch({ type: 'SET_RATINGS', payload: ratings });
  }, []);

  const addRating = useCallback((rating: UserRating) => {
    dispatch({ type: 'ADD_RATING', payload: rating });
  }, []);

  const removeRating = useCallback((movieId: number) => {
    dispatch({ type: 'REMOVE_RATING', payload: movieId });
  }, []);

  const clearRatings = useCallback(() => {
    dispatch({ type: 'CLEAR_RATINGS' });
  }, []);

  const getRatingForMovie = useCallback((movieId: number): UserRating | undefined => {
    return state.ratings.find(r => r.movieId === movieId);
  }, [state.ratings]);

  const hasRating = useCallback((movieId: number): boolean => {
    return state.ratings.some(r => r.movieId === movieId);
  }, [state.ratings]);

  const getAverageRating = useCallback((): number => {
    if (state.ratings.length === 0) return 0;
    const sum = state.ratings.reduce((acc, r) => acc + r.rating, 0);
    return Math.round((sum / state.ratings.length) * 10) / 10;
  }, [state.ratings]);

  const getRatingCount = useCallback((): number => {
    return state.ratings.length;
  }, [state.ratings]);

  const setLoading = useCallback((loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  }, []);

  const setError = useCallback((error: Error | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  }, []);

  const value = {
    ...state,
    addRating,
    removeRating,
    clearRatings,
    getRatingForMovie,
    hasRating,
    getAverageRating,
    getRatingCount,
    setRatings,
    setLoading,
    setError,
  };

  return (
    <RatingsContext.Provider value={value}>
      {children}
    </RatingsContext.Provider>
  );
};
