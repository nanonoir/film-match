/**
 * MatchModal Component
 * Refactored version using custom hooks
 *
 * Modal displayed when user matches with a movie
 * Allows user to view details or continue swiping
 */

import React from 'react';
import { motion } from 'framer-motion';
import { X, ExternalLink } from 'lucide-react';
import type { Movie } from '@core';

interface MatchModalProps {
  movie: Movie;
  onClose: () => void;
  onViewDetails: () => void;
}

/**
 * MatchModal Component
 * Celebratory modal for movie matches
 *
 * @param movie - Matched movie
 * @param onClose - Callback to close modal
 * @param onViewDetails - Callback to view movie details
 *
 * @example
 * ```typescript
 * {showMatchModal && (
 *   <MatchModal
 *     movie={movie}
 *     onClose={handleClose}
 *     onViewDetails={handleDetails}
 *   />
 * )}
 * ```
 */
const MatchModal: React.FC<MatchModalProps> = ({ movie, onClose, onViewDetails }) => {
  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/80 z-40"
      />

      {/* Modal Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div className="relative w-full max-w-md bg-dark-card rounded-2xl overflow-hidden shadow-2xl">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/40 hover:bg-black/60 transition-all"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Header with celebration */}
          <div className="relative bg-gradient-to-br from-green-500/20 to-transparent p-8 text-center">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.6, repeat: 3 }}
              className="text-6xl mb-4"
            >
              💚
            </motion.div>
            <h2 className="text-3xl font-bold mb-2">It's a Match!</h2>
            <p className="text-gray-400">You've successfully added this movie to your favorites</p>
          </div>

          {/* Movie Preview */}
          <div className="p-6 space-y-4">
            <div className="relative rounded-xl overflow-hidden h-40 mb-4">
              <img
                src={movie.poster}
                alt={movie.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            </div>

            {/* Movie Info */}
            <div>
              <h3 className="text-2xl font-bold mb-2">{movie.title}</h3>
              <div className="flex items-center space-x-3 text-sm text-gray-400 mb-3">
                <span>{movie.year}</span>
                <span>•</span>
                <span>{movie.genres.join(', ')}</span>
              </div>
              <p className="text-gray-300 text-sm line-clamp-3">{movie.overview}</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 py-4 border-t border-white/10">
              <div className="text-center">
                <p className="text-xs text-gray-400 mb-1">Rating</p>
                <p className="text-lg font-bold">{movie.rating}⭐</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-400 mb-1">Duration</p>
                <p className="text-lg font-bold">{movie.duration}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-400 mb-1">Year</p>
                <p className="text-lg font-bold">{movie.year}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-3 rounded-xl bg-dark-hover hover:bg-dark-hover/80 font-semibold transition-all"
              >
                Keep Swiping
              </button>
              <button
                onClick={onViewDetails}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 font-semibold transition-all"
              >
                <ExternalLink className="w-4 h-4" />
                View Details
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default MatchModal;
