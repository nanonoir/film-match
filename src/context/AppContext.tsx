import React, { createContext, useContext, useState, type ReactNode } from 'react';
import moviesData from '../data/movies.json';

interface Movie {
  id: number;
  title: string;
  year: number;
  genres: string[];
  duration: string;
  rating: number;
  overview: string;
  director: string;
  cast: string[];
  poster: string;
}

interface UserRating {
  movieId: number;
  rating: number;
  comment?: string;
}

interface AppContextType {
  movies: Movie[];
  currentMovieIndex: number;
  matches: Movie[];
  userRatings: UserRating[];
  filters: {
    search: string;
    genres: string[];
    yearRange: [number, number];
    minRating: number;
  };
  addMatch: (movie: Movie) => void;
  skipMovie: () => void;
  addRating: (rating: UserRating) => void;
  setFilters: (filters: any) => void;
  resetFilters: () => void;
  getFilteredMovies: () => Movie[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [movies] = useState<Movie[]>(moviesData);
  const [currentMovieIndex, setCurrentMovieIndex] = useState(0);
  const [matches, setMatches] = useState<Movie[]>([]);
  const [userRatings, setUserRatings] = useState<UserRating[]>([]);
  const [filters, setFiltersState] = useState({
    search: '',
    genres: [] as string[],
    yearRange: [1970, 2025] as [number, number],
    minRating: 0,
  });

  const addMatch = (movie: Movie) => {
    setMatches((prev) => [...prev, movie]);
    setCurrentMovieIndex((prev) => prev + 1);
  };

  const skipMovie = () => {
    setCurrentMovieIndex((prev) => prev + 1);
  };

  const addRating = (rating: UserRating) => {
    setUserRatings((prev) => {
      const existing = prev.findIndex((r) => r.movieId === rating.movieId);
      if (existing !== -1) {
        const updated = [...prev];
        updated[existing] = rating;
        return updated;
      }
      return [...prev, rating];
    });
  };

  const setFilters = (newFilters: any) => {
    setFiltersState((prev) => ({ ...prev, ...newFilters }));
  };

  const resetFilters = () => {
    setFiltersState({
      search: '',
      genres: [],
      yearRange: [1970, 2025],
      minRating: 0,
    });
  };

  const getFilteredMovies = () => {
    return movies.filter((movie) => {
      const matchesSearch =
        filters.search === '' ||
        movie.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        movie.director.toLowerCase().includes(filters.search.toLowerCase()) ||
        movie.cast.some((actor) =>
          actor.toLowerCase().includes(filters.search.toLowerCase())
        );

      const matchesGenres =
        filters.genres.length === 0 ||
        filters.genres.some((genre) => movie.genres.includes(genre));

      const matchesYear =
        movie.year >= filters.yearRange[0] && movie.year <= filters.yearRange[1];

      const matchesRating = movie.rating >= filters.minRating;

      return matchesSearch && matchesGenres && matchesYear && matchesRating;
    });
  };

  return (
    <AppContext.Provider
      value={{
        movies,
        currentMovieIndex,
        matches,
        userRatings,
        filters,
        addMatch,
        skipMovie,
        addRating,
        setFilters,
        resetFilters,
        getFilteredMovies,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export type { Movie, UserRating };
