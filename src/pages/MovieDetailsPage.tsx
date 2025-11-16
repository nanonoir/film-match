import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, MessageCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import RatingModal from '../presentation/hooks/RatingModal';
import MovieReviewsModal from '../presentation/hooks/MovieReviewsModal';
import { useMovieRepository } from '@/hooks';
import type { Movie } from '@core';

const MovieDetailsPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getById, loading, error } = useMovieRepository();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showReviewsModal, setShowReviewsModal] = useState(false);
  const [notFound, setNotFound] = useState(false);

  // Load movie on mount
  useEffect(() => {
    const loadMovie = async () => {
      try {
        const movieId = parseInt(id || '0');
        if (movieId === 0) {
          setNotFound(true);
          return;
        }

        const loadedMovie = await getById(movieId);
        if (loadedMovie) {
          setMovie(loadedMovie);
        } else {
          setNotFound(true);
        }
      } catch (err) {
        console.error('Error loading movie:', err);
        setNotFound(true);
      }
    };

    loadMovie();
  }, [id, getById]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading movie...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || notFound || !movie) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Movie not found</h2>
          <button onClick={() => navigate('/home')} className="btn-primary">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      <Navbar />

      <div className="pt-16 xs:pt-20 pb-12">
        {/* Hero Section */}
        <div className="relative h-56 xs:h-72 sm:h-96 overflow-hidden">
          <img
            src={movie.poster}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-dark-bg/70 to-transparent" />

          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="absolute top-3 xs:top-4 sm:top-6 left-3 xs:left-4 sm:left-6 w-10 xs:w-12 h-10 xs:h-12 bg-dark-card/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-dark-card transition-all"
          >
            <ArrowLeft className="w-5 xs:w-6 h-5 xs:h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="w-full px-3 xs:px-4 sm:px-6 lg:px-8 -mt-24 xs:-mt-28 sm:-mt-32 relative z-10">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3 xs:space-y-4 sm:space-y-6"
            >
              {/* Title and Basic Info */}
              <div>
                <h1 className="text-2xl xs:text-3xl sm:text-4xl font-bold mb-2 xs:mb-3 line-clamp-2">
                  {movie.title}
                </h1>
                <div className="flex flex-wrap items-center gap-2 xs:gap-3 text-gray-400 text-xs xs:text-sm sm:text-base">
                  <span>{movie.year}</span>
                  <span>•</span>
                  <span className="line-clamp-1">{movie.genres.join(', ')}</span>
                  <span>•</span>
                  <span>{movie.duration}</span>
                </div>
              </div>

              {/* Rating */}
              <div className="flex flex-col gap-2 xs:gap-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="flex items-center gap-0.5 xs:gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 xs:w-6 h-5 xs:h-6 ${
                          i < Math.floor(movie.rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-lg xs:text-xl sm:text-2xl font-bold">
                    {movie.rating.toFixed(1)} / 5.0
                  </span>
                </div>

                <div className="flex gap-2 xs:gap-3 flex-wrap">
                  <button
                    onClick={() => setShowRatingModal(true)}
                    className="flex-1 xs:flex-auto flex items-center justify-center gap-2 px-3 xs:px-4 sm:px-6 py-2 xs:py-2.5 sm:py-3 bg-gradient-primary rounded-lg xs:rounded-xl hover:opacity-90 transition-opacity text-xs xs:text-sm sm:text-base font-semibold min-w-0"
                  >
                    <Star className="w-4 xs:w-5 h-4 xs:h-5 flex-shrink-0" />
                    <span className="truncate">Calificar</span>
                  </button>
                  <button
                    onClick={() => setShowReviewsModal(true)}
                    className="flex-1 xs:flex-auto flex items-center justify-center gap-2 px-3 xs:px-4 sm:px-6 py-2 xs:py-2.5 sm:py-3 bg-dark-input hover:bg-dark-input/80 rounded-lg xs:rounded-xl transition-colors text-xs xs:text-sm sm:text-base font-semibold min-w-0"
                  >
                    <MessageCircle className="w-4 xs:w-5 h-4 xs:h-5 flex-shrink-0" />
                    <span className="truncate">Reseñas</span>
                  </button>
                </div>
              </div>

              {/* Overview */}
              <div className="card p-3 xs:p-4 sm:p-6">
                <h2 className="text-lg xs:text-xl sm:text-2xl font-bold mb-2 xs:mb-3 sm:mb-4">Overview</h2>
                <p className="text-gray-300 leading-relaxed text-sm xs:text-base">{movie.overview}</p>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 xs:gap-4 sm:gap-6">
                {/* Director */}
                <div className="card p-3 xs:p-4 sm:p-6">
                  <h3 className="text-base xs:text-lg sm:text-xl font-bold mb-2 xs:mb-3">Director</h3>
                  <p className="text-primary-purple font-semibold text-sm xs:text-base sm:text-lg">
                    {movie.director}
                  </p>
                </div>

                {/* Cast */}
                <div className="card p-3 xs:p-4 sm:p-6">
                  <h3 className="text-base xs:text-lg sm:text-xl font-bold mb-2 xs:mb-3">Cast</h3>
                  <div className="flex flex-wrap gap-1.5 xs:gap-2">
                    {movie.cast.map((actor) => (
                      <span
                        key={actor}
                        className="px-2 xs:px-3 py-1 xs:py-1.5 bg-dark-input rounded-lg text-xs xs:text-sm font-medium"
                      >
                        {actor}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Back Button */}
              <div className="text-center py-4 xs:py-6 sm:py-8">
                <button
                  onClick={() => navigate('/home')}
                  className="btn-secondary px-4 xs:px-6 sm:px-8 py-2 xs:py-3 text-sm xs:text-base"
                >
                  Volver a Recomendaciones
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Rating Modal */}
      <AnimatePresence>
        {showRatingModal && (
          <RatingModal
            movie={movie}
            onClose={() => setShowRatingModal(false)}
          />
        )}
      </AnimatePresence>

      {/* Reviews Modal */}
      <AnimatePresence>
        {showReviewsModal && (
          <MovieReviewsModal
            movie={movie}
            onClose={() => setShowReviewsModal(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default MovieDetailsPage;
