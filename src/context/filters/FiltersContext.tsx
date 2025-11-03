/**
 * FiltersContext
 *
 * Context for managing active movie filters
 * Persists filter state across navigation
 *
 * @responsibility Manage and persist filter criteria
 * @architecture_layer Presentation - State Management
 */

import { createContext } from 'react';
import type { MovieFilterCriteria } from '@core';

/**
 * Filters State Interface
 */
export interface FiltersState {
  criteria: MovieFilterCriteria;
  isActive: boolean;
}

/**
 * Filters Actions Interface
 */
export interface FiltersActions {
  setCriteria: (criteria: MovieFilterCriteria) => void;
  updateSearch: (search: string) => void;
  updateGenres: (genres: string[]) => void;
  toggleGenre: (genre: string) => void;
  updateYearRange: (min: number, max: number) => void;
  updateMinRating: (rating: number) => void;
  resetFilters: () => void;
  resetFilter: (filterType: keyof MovieFilterCriteria) => void;
}

/**
 * Combined Context Interface
 */
export interface FiltersContextValue extends FiltersState, FiltersActions {}

/**
 * Default Criteria
 */
export const defaultCriteria: MovieFilterCriteria = {
  search: '',
  genres: [],
  yearRange: [1970, new Date().getFullYear()],
  minRating: 0,
};

/**
 * Initial State
 */
export const initialFiltersState: FiltersState = {
  criteria: defaultCriteria,
  isActive: false,
};

/**
 * Filters Context
 */
export const FiltersContext = createContext<FiltersContextValue | undefined>(undefined);
