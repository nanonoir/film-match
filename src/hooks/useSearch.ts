/**
 * useSearch Hook
 *
 * Custom hook for managing search logic with filtering, sorting, and pagination
 * Handles movie filtering based on search criteria, trend, decade, and sorting
 *
 * @returns Object with filteredMovies, totalResults, and related state
 */

import { useMemo } from 'react';
import { useFiltersContext } from '../context/filters/useFiltersContext';
import moviesData from '../data/movies.json';
import type { Movie } from '@core';

interface UseSearchResult {
  filteredMovies: Movie[];
  totalResults: number;
  totalPages: number;
  currentPage: number;
}

export function useSearch(): UseSearchResult {
  const context = useFiltersContext();

  if (!context) {
    throw new Error('useSearch must be used within FiltersProvider');
  }

  const { criteria, pagination, sortBy, trend, decade } = context;

  // Provide default values if pagination is undefined
  const currentPagination = pagination || {
    currentPage: 1,
    itemsPerPage: 10,
    totalResults: 0,
  };

  const { filteredMovies, totalResults } = useMemo(() => {
    let results = [...(moviesData as Movie[])];

    // Apply search filter
    if (criteria.search.trim()) {
      const searchLower = criteria.search.toLowerCase();
      results = results.filter(
        (movie) =>
          movie.title.toLowerCase().includes(searchLower) ||
          movie.overview.toLowerCase().includes(searchLower) ||
          movie.director.toLowerCase().includes(searchLower) ||
          movie.cast.some((actor) => actor.toLowerCase().includes(searchLower))
      );
    }

    // Apply genre filter
    if (criteria.genres.length > 0) {
      results = results.filter((movie) =>
        criteria.genres.some((genre) => movie.genres.includes(genre))
      );
    }

    // Apply decade filter
    if (decade !== 'all') {
      const decadeRanges: { [key: string]: [number, number] } = {
        '70s': [1970, 1979],
        '80s': [1980, 1989],
        '90s': [1990, 1999],
        '00s': [2000, 2009],
        '10s': [2010, 2019],
        '20s': [2020, 2029],
      };

      const [minYear, maxYear] = decadeRanges[decade] || [1970, new Date().getFullYear()];
      results = results.filter((movie) => movie.year >= minYear && movie.year <= maxYear);
    }

    // Apply rating filter
    if (criteria.minRating > 0) {
      results = results.filter((movie) => movie.rating >= criteria.minRating);
    }

    // Apply trend filter (based on movie rating and year)
    if (trend !== 'all') {
      const currentYear = new Date().getFullYear();
      if (trend === 'trending') {
        // Trending: newer movies with high ratings
        results = results.filter((movie) => movie.rating >= 7 && movie.year >= currentYear - 3);
      } else if (trend === 'recent') {
        // Recent: movies from last 5 years
        results = results.filter((movie) => movie.year >= currentYear - 5);
      } else if (trend === 'oldest') {
        // Oldest: movies before 2000
        results = results.filter((movie) => movie.year < 2000);
      }
    }

    // Apply sorting
    switch (sortBy) {
      case 'title':
        results.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'rating':
        results.sort((a, b) => b.rating - a.rating);
        break;
      case 'date':
        results.sort((a, b) => b.year - a.year);
        break;
    }

    return {
      filteredMovies: results,
      totalResults: results.length,
    };
  }, [criteria, sortBy, trend, decade]);

  const paginatedMovies = useMemo(() => {
    const startIndex = (currentPagination.currentPage - 1) * currentPagination.itemsPerPage;
    const endIndex = startIndex + currentPagination.itemsPerPage;
    return filteredMovies.slice(startIndex, endIndex);
  }, [filteredMovies, currentPagination.currentPage, currentPagination.itemsPerPage]);

  const totalPages = Math.ceil(totalResults / currentPagination.itemsPerPage);

  return {
    filteredMovies: paginatedMovies,
    totalResults,
    totalPages,
    currentPage: currentPagination.currentPage,
  };
}
