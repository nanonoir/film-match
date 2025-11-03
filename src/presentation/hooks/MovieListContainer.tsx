/**
 * MovieListContainer Component
 * Refactored version using custom hooks instead of AppContext
 *
 * Manages the main movie discovery flow with swiping functionality
 * Uses custom hooks for all state and data management
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Filter } from 'lucide-react';
import { useMovieRepository, useMovieMatches, useFilterMovies } from '@/hooks';
import type { Movie } from '@core';
import MovieCardComponent from './MovieCard';
import MatchModalComponent from './MatchModal';
import FiltersSidebarComponent from './FiltersSidebar';

/**
 * Movie List Container Component
 * Main component for discovering and swiping through movies
 *
 * @example
 * ```typescript
 * <MovieListContainer />
 * ```
 */
const MovieListContainer: React.FC = () => {
  const navigate = useNavigate();

  // State management using custom hooks
  const { getAll, loading: repoLoading } = useMovieRepository();
  const { matches, addMatch } = useMovieMatches();
  const [allMovies, setAllMovies] = useState<Movie[]>([]);
  const { filteredMovies, toggleGenre, setYearRange, setMinRating, filterBySearch } =
    useFilterMovies(allMovies);

  // Local UI state
  const [currentMovieIndex, setCurrentMovieIndex] = useState(0);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [matchedMovie, setMatchedMovie] = useState<Movie | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Load all movies on component mount
   */
  useEffect(() => {
    const loadMovies = async () => {
      try {
        setLoading(true);
        const movies = await getAll();
        setAllMovies(movies);
        setError(null);
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        console.error('Error loading movies:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMovies();
  }, [getAll]);

  /**
   * Get current movie to display
   */
  const currentMovie = filteredMovies[currentMovieIndex] || null;

  /**
   * Handle match action
   */
  const handleMatch = async () => {
    if (currentMovie) {
      try {
        await addMatch(currentMovie);
        setMatchedMovie(currentMovie);
        setShowMatchModal(true);
      } catch (err) {
        console.error('Error adding match:', err);
      }
    }
  };

  /**
   * Handle skip action
   */
  const handleSkip = () => {
    advanceToNextMovie();
  };

  /**
   * Advance to next movie
   */
  const advanceToNextMovie = () => {
    setCurrentMovieIndex((prev) => prev + 1);
  };

  /**
   * Handle view details
   */
  const handleViewDetails = () => {
    if (currentMovie) {
      navigate(`/movie/${currentMovie.id}`);
    }
  };

  /**
   * Handle close match modal
   */
  const handleCloseMatchModal = () => {
    setShowMatchModal(false);
    setMatchedMovie(null);
    advanceToNextMovie();
  };

  /**
   * Handle view details from modal
   */
  const handleViewDetailsFromModal = () => {
    setShowMatchModal(false);
    handleViewDetails();
  };

  /**
   * Reset to first movie
   */
  const handleResetMovies = () => {
    setCurrentMovieIndex(0);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading movies...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">Error loading movies: {error.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // No movies state
  if (allMovies.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">No movies available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Discover Movies</h1>
              <p className="text-gray-400">
                Swipe right to match, left to skip ({currentMovieIndex + 1} / {filteredMovies.length})
              </p>
            </div>
            <button
              onClick={() => setShowFilters(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-dark-card rounded-xl hover:bg-opacity-80 transition-all"
            >
              <Filter className="w-5 h-5" />
              <span>Filters</span>
            </button>
          </div>

          {/* Movie Cards Stack */}
          <div className="flex justify-center items-center min-h-[600px] relative">
            {currentMovieIndex >= filteredMovies.length ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="card text-center max-w-md"
              >
                <h2 className="text-2xl font-bold mb-4">
                  No more movies to show!
                </h2>
                <p className="text-gray-400 mb-6">
                  You've seen {filteredMovies.length} movies. Try adjusting your filters or check back later.
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={() => setShowFilters(true)}
                    className="btn-primary flex-1"
                  >
                    Adjust Filters
                  </button>
                  <button
                    onClick={handleResetMovies}
                    className="btn-secondary flex-1"
                  >
                    Start Over
                  </button>
                </div>
              </motion.div>
            ) : (
              <>
                {/* Stack preview of next movies */}
                {filteredMovies.slice(currentMovieIndex + 1, currentMovieIndex + 3).map((movie, index) => (
                  <div
                    key={movie.id}
                    className="absolute w-full max-w-md"
                    style={{
                      transform: `translateY(${(index + 1) * 12}px) scale(${1 - (index + 1) * 0.05})`,
                      zIndex: -index - 1,
                    }}
                  >
                    <div className="h-[600px] rounded-3xl bg-dark-card overflow-hidden shadow-2xl" />
                  </div>
                ))}

                {/* Main card */}
                {currentMovie && (
                  <MovieCardComponent
                    key={currentMovie.id}
                    movie={currentMovie}
                    onMatch={handleMatch}
                    onSkip={handleSkip}
                    onShowDetails={handleViewDetails}
                  />
                )}
              </>
            )}
          </div>

          {/* Match stats */}
          <div className="mt-12 flex justify-center gap-8">
            <div className="text-center">
              <p className="text-sm text-gray-400 mb-2">Matches</p>
              <p className="text-3xl font-bold">{matches.length}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-400 mb-2">Remaining</p>
              <p className="text-3xl font-bold">
                {Math.max(0, filteredMovies.length - currentMovieIndex)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Match Modal */}
      {showMatchModal && matchedMovie && (
        <MatchModalComponent
          movie={matchedMovie}
          onClose={handleCloseMatchModal}
          onViewDetails={handleViewDetailsFromModal}
        />
      )}

      {/* Filters Sidebar */}
      {showFilters && (
        <FiltersSidebarComponent
          onClose={() => setShowFilters(false)}
          onGenreToggle={toggleGenre}
          onYearRangeChange={setYearRange}
          onMinRatingChange={setMinRating}
          onSearchChange={filterBySearch}
        />
      )}
    </div>
  );
};

export default MovieListContainer;
