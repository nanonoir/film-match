import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Star } from 'lucide-react';
import Navbar from '../components/Navbar';
import RatingModal from '../presentation/hooks/RatingModal';
import { useMovieRepository } from '@/hooks';
import type { Movie } from '@core';

const MovieDetailsPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getById, loading, error } = useMovieRepository();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [showRatingModal, setShowRatingModal] = useState(false);
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
    <div className="min-h-screen">
      <Navbar />

      <div className="pt-20">
        {/* Hero Section */}
        <div className="relative h-96 overflow-hidden">
          <img
            src={movie.poster}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-dark-bg/70 to-transparent" />

          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="absolute top-6 left-6 w-12 h-12 bg-dark-card/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-dark-card transition-all"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 -mt-32 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Title and Basic Info */}
            <div>
              <h1 className="text-4xl font-bold mb-3">{movie.title}</h1>
              <div className="flex flex-wrap items-center gap-3 text-gray-400">
                <span>{movie.year}</span>
                <span>•</span>
                <span>{movie.genres.join(', ')}</span>
                <span>•</span>
                <span>{movie.duration}</span>
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-6 h-6 ${
                        i < Math.floor(movie.rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-600'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-2xl font-bold">
                  {movie.rating.toFixed(1)} / 5.0
                </span>
              </div>

              <button
                onClick={() => setShowRatingModal(true)}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-primary rounded-xl hover:opacity-90 transition-opacity"
              >
                <Star className="w-5 h-5" />
                <span className="font-semibold">Rate this movie</span>
              </button>
            </div>

            {/* Overview */}
            <div className="card">
              <h2 className="text-2xl font-bold mb-4">Overview</h2>
              <p className="text-gray-300 leading-relaxed">{movie.overview}</p>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Director */}
              <div className="card">
                <h3 className="text-xl font-bold mb-3">Director</h3>
                <p className="text-primary-purple font-semibold text-lg">
                  {movie.director}
                </p>
              </div>

              {/* Cast */}
              <div className="card">
                <h3 className="text-xl font-bold mb-3">Cast</h3>
                <div className="flex flex-wrap gap-2">
                  {movie.cast.map((actor) => (
                    <span
                      key={actor}
                      className="px-4 py-2 bg-dark-input rounded-xl text-sm font-medium"
                    >
                      {actor}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Back Button */}
            <div className="text-center py-8">
              <button
                onClick={() => navigate('/home')}
                className="btn-secondary px-8"
              >
                Back to Recommendations
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Rating Modal */}
      {showRatingModal && (
        <RatingModal
          movie={movie}
          onClose={() => setShowRatingModal(false)}
        />
      )}
    </div>
  );
};

export default MovieDetailsPage;
