import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star } from 'lucide-react';
import type { Movie } from '../context/AppContext';

interface RatingModalProps {
  isOpen: boolean;
  movie: Movie | null;
  onClose: () => void;
  onSubmit: (rating: number, comment: string) => void;
}

const RatingModal: React.FC<RatingModalProps> = ({
  isOpen,
  movie,
  onClose,
  onSubmit,
}) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    if (rating > 0) {
      onSubmit(rating, comment);
      setRating(0);
      setComment('');
      onClose();
    }
  };

  const handleCancel = () => {
    setRating(0);
    setComment('');
    onClose();
  };

  if (!movie) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={handleCancel}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="card max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-2">Rate {movie.title}</h2>
            <p className="text-gray-400 mb-6">Share your thoughts about this movie</p>

            {/* Star Rating */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-3">Your Rating</label>
              <div className="flex items-center justify-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.button
                    key={star}
                    type="button"
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`w-12 h-12 transition-colors ${
                        star <= (hoverRating || rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-600'
                      }`}
                    />
                  </motion.button>
                ))}
              </div>
              {rating > 0 && (
                <p className="text-center mt-3 text-gray-400">
                  You rated: {rating} / 5
                </p>
              )}
            </div>

            {/* Comment */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Comment (Optional)
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your thoughts about this movie..."
                rows={4}
                className="w-full bg-dark-input text-white px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-primary-pink transition-all placeholder-gray-500 resize-none border-none"
              />
            </div>

            {/* Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={handleCancel}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={rating === 0}
                className={`flex-1 btn-primary ${
                  rating === 0 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                Submit Rating
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RatingModal;
