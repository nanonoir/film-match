/**
 * MoviesProvider
 *
 * Provider component for MoviesContext
 * Manages state using useReducer for predictable state updates
 */

import React, { useReducer, useCallback, ReactNode } from 'react';
import { MoviesContext, initialMoviesState, type MoviesState } from './MoviesContext';
import type { Movie } from '@core';

/**
 * Action Types
 */
type MoviesAction =
  | { type: 'SET_MOVIES'; payload: Movie[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: Error | null }
  | { type: 'SET_CURRENT_INDEX'; payload: number }
  | { type: 'NEXT_MOVIE' }
  | { type: 'RESET_INDEX' };

/**
 * Reducer Function
 */
function moviesReducer(state: MoviesState, action: MoviesAction): MoviesState {
  switch (action.type) {
    case 'SET_MOVIES':
      return {
        ...state,
        movies: action.payload,
        loading: false,
        error: null,
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

    case 'SET_CURRENT_INDEX':
      return {
        ...state,
        currentMovieIndex: Math.max(0, Math.min(action.payload, state.movies.length)),
      };

    case 'NEXT_MOVIE':
      return {
        ...state,
        currentMovieIndex: Math.min(state.currentMovieIndex + 1, state.movies.length),
      };

    case 'RESET_INDEX':
      return {
        ...state,
        currentMovieIndex: 0,
      };

    default:
      return state;
  }
}

/**
 * Provider Props
 */
interface MoviesProviderProps {
  children: ReactNode;
}

/**
 * MoviesProvider Component
 */
export const MoviesProvider: React.FC<MoviesProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(moviesReducer, initialMoviesState);

  // Actions
  const setMovies = useCallback((movies: Movie[]) => {
    dispatch({ type: 'SET_MOVIES', payload: movies });
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  }, []);

  const setError = useCallback((error: Error | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  }, []);

  const setCurrentMovieIndex = useCallback((index: number) => {
    dispatch({ type: 'SET_CURRENT_INDEX', payload: index });
  }, []);

  const nextMovie = useCallback(() => {
    dispatch({ type: 'NEXT_MOVIE' });
  }, []);

  const resetMovieIndex = useCallback(() => {
    dispatch({ type: 'RESET_INDEX' });
  }, []);

  const value = {
    ...state,
    setMovies,
    setLoading,
    setError,
    setCurrentMovieIndex,
    nextMovie,
    resetMovieIndex,
  };

  return (
    <MoviesContext.Provider value={value}>
      {children}
    </MoviesContext.Provider>
  );
};
