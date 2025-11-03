/**
 * Profile Page
 * Página de perfil del usuario con información personal y reseñas
 */

import React, { useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Settings, Edit2, Twitter, Instagram, Star } from 'lucide-react';
import Navbar from '../components/Navbar';
import { Button } from '../presentation/components/ui/Button/Button';
import { ProfileEditModal } from '../presentation/components/ProfileEditModal';
import { useUser } from '../context/user/useUser';
import { useUI } from '../context/ui';
import { getAvatarImage } from '../shared/utils/avatarHelpers';
import { MOCK_USER_REVIEWS } from '../shared/mocks/userReviews';
import moviesData from '../data/movies.json';
import type { Movie } from '@core';

interface MovieReview {
  movie: Movie;
  rating: number;
  date: Date;
}

const Profile: React.FC = () => {
  const { user } = useUser();
  const { profileEditModalOpen, openProfileEditModal, closeProfileEditModal } = useUI();

  // Cargar reseñas directamente desde el JSON
  const reviews = useMemo(() => {
    return MOCK_USER_REVIEWS
      .map((mockReview) => {
        const movie = moviesData.find((m) => m.id === mockReview.movieId) as Movie | undefined;
        return movie
          ? {
              movie,
              rating: mockReview.rating,
              date: mockReview.ratedAt,
            }
          : null;
      })
      .filter((review): review is MovieReview => review !== null);
  }, []);

  // Always have a user in mock mode, so no need for guards
  if (!user) {
    return null; // Should never happen with mock user
  }

  const avatarImage = getAvatarImage(user.avatar);

  return (
    <div className="min-h-screen bg-dark-bg">
      <Navbar />

      {/* Main Content */}
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-dark-card rounded-3xl p-8 border border-gray-800 mb-8"
        >
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-primary-pink/30"
              >
                <img
                  src={avatarImage}
                  alt={user.nickname || user.name}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-white mb-2">
                {user.nickname || user.name}
              </h1>
              <p className="text-gray-400 mb-4 max-w-xl">
                {user.bio || 'Amante del cine'}
              </p>

              {/* Social Links */}
              <div className="flex gap-4 justify-center md:justify-start">
                {user.twitterUrl && (
                  <a
                    href={user.twitterUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    <Twitter className="w-5 h-5" />
                    <span className="text-sm">Twitter</span>
                  </a>
                )}
                {user.instagramUrl && (
                  <a
                    href={user.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-pink-400 hover:text-pink-300 transition-colors"
                  >
                    <Instagram className="w-5 h-5" />
                    <span className="text-sm">Instagram</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-8 flex-wrap">
            <Button
              onClick={openProfileEditModal}
              variant="primary"
              size="md"
              className="flex-1 md:flex-initial"
            >
              <Edit2 className="w-4 h-4 mr-2" />
              Personalizar Perfil
            </Button>
            <Button
              onClick={() => {}}
              variant="secondary"
              size="md"
              className="flex-1 md:flex-initial"
            >
              <Settings className="w-4 h-4 mr-2" />
              Preferencias
            </Button>
          </div>
        </motion.div>

        {/* My Reviews Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-white mb-6">Mis Últimas Reseñas</h2>

          {reviews.length === 0 ? (
            <div className="bg-dark-card rounded-2xl p-12 border border-gray-800 text-center">
              <p className="text-gray-400">
                Aún no has calificado ninguna película. ¡Comienza a explorar!
              </p>
            </div>
          ) : (
            <div className="grid gap-6">
              {reviews.map((review, index) => (
                <motion.div
                  key={review.movie.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="bg-dark-card rounded-2xl overflow-hidden border border-gray-800 hover:border-primary-pink/30 transition-all group"
                >
                  <div className="flex flex-col sm:flex-row gap-4 p-4">
                    {/* Movie Poster */}
                    <div className="flex-shrink-0 w-full sm:w-32">
                      <div className="aspect-[2/3] rounded-xl overflow-hidden bg-gray-800">
                        <img
                          src={review.movie.poster}
                          alt={review.movie.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                    </div>

                    {/* Movie Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-bold text-white mb-2 truncate">
                        {review.movie.title}
                      </h3>
                      <p className="text-sm text-gray-400 mb-3">
                        {review.movie.year} • {review.movie.genres.join(', ')}
                      </p>

                      {/* Rating */}
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-5 h-5 ${
                                star <= review.rating
                                  ? 'text-yellow-400 fill-yellow-400'
                                  : 'text-gray-600'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-white font-semibold">
                          {review.rating}/5
                        </span>
                      </div>

                      {/* Overview */}
                      <p className="text-gray-400 text-sm line-clamp-2">
                        {review.movie.overview}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Profile Edit Modal */}
      <AnimatePresence>
        {profileEditModalOpen && <ProfileEditModal onClose={closeProfileEditModal} />}
      </AnimatePresence>
    </div>
  );
};

export default Profile;
