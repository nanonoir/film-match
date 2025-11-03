/**
 * MoviesContext
 *
 * Context for managing the loaded movie catalog
 * Does NOT contain business logic - only state management
 * Business logic stays in custom hooks using DIContainer
 *
 * @responsibility Store and provide access to loaded movies
 * @architecture_layer Presentation - State Management
 */

import { createContext } from 'react';
import type { Movie } from '@core';

/**
 * Movies State Interface
 */
export interface MoviesState {
  movies: Movie[];
  loading: boolean;
  error: Error | null;
  currentMovieIndex: number;
}

/**
 * Movies Actions Interface
 */
export interface MoviesActions {
  setMovies: (movies: Movie[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: Error | null) => void;
  setCurrentMovieIndex: (index: number) => void;
  nextMovie: () => void;
  resetMovieIndex: () => void;
}

/**
 * Combined Context Interface
 */
export interface MoviesContextValue extends MoviesState, MoviesActions {}

/**
 * Initial State
 */
export const initialMoviesState: MoviesState = {
  movies: [],
  loading: true,
  error: null,
  currentMovieIndex: 0,
};

/**
 * Movies Context
 */
export const MoviesContext = createContext<MoviesContextValue | undefined>(undefined);
