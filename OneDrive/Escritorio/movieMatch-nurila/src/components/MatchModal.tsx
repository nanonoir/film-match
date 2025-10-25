import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles } from 'lucide-react';
import type { Movie } from '../context/AppContext';

interface MatchModalProps {
  isOpen: boolean;
  movie: Movie | null;
  onClose: () => void;
  onViewDetails: () => void;
}

const MatchModal: React.FC<MatchModalProps> = ({
  isOpen,
  movie,
  onClose,
  onViewDetails,
}) => {
  if (!movie) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="card max-w-md w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sparkles Animation */}
            <div className="absolute -top-2 -right-2">
              <motion.div
                animate={{
                  rotate: [0, 20, 0],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              >
                <Sparkles className="w-8 h-8 text-yellow-400 fill-yellow-400" />
              </motion.div>
            </div>

            {/* Match Icon */}
            <div className="flex justify-center mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: 'spring',
                  delay: 0.2,
                  stiffness: 200,
                }}
                className="w-20 h-20 rounded-full bg-gradient-match flex items-center justify-center shadow-lg"
              >
                <Heart className="w-10 h-10 text-white fill-white" />
              </motion.div>
            </div>

            {/* Match Text */}
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold text-center mb-2"
            >
              ¡Es un Match!
            </motion.h2>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-center text-gray-400 mb-8"
            >
              Matcheaste con{' '}
              <span className="text-primary-purple font-semibold">
                {movie.title}
              </span>
            </motion.p>

            {/* Buttons */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="space-y-3"
            >
              <button
                onClick={onViewDetails}
                className="w-full btn-primary"
              >
                Ver Detalles
              </button>
              <button
                onClick={onClose}
                className="w-full btn-secondary"
              >
                Seguir explorando
              </button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MatchModal;
