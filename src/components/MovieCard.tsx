import React, { useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Heart, X, Star } from 'lucide-react';
import type { Movie } from '../context/AppContext';

interface MovieCardProps {
  movie: Movie;
  onMatch: () => void;
  onSkip: () => void;
  onShowDetails: () => void;
}

const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  onMatch,
  onSkip,
  onShowDetails,
}) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

  const [exitX, setExitX] = useState(0);

  const handleDragEnd = (_: any, info: any) => {
    if (Math.abs(info.offset.x) > 100) {
      setExitX(info.offset.x > 0 ? 500 : -500);
      if (info.offset.x > 0) {
        onMatch();
      } else {
        onSkip();
      }
    }
  };

  const handleMatch = () => {
    setExitX(500);
    setTimeout(onMatch, 200);
  };

  const handleSkip = () => {
    setExitX(-500);
    setTimeout(onSkip, 200);
  };

  return (
    <motion.div
      className="absolute w-full max-w-md h-[600px] cursor-grab active:cursor-grabbing"
      style={{ x, rotate, opacity }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      animate={exitX !== 0 ? { x: exitX } : {}}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl">
        {/* Movie Poster */}
        <img
          src={movie.poster}
          alt={movie.title}
          className="w-full h-full object-cover"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>

        {/* Movie Info */}
        <div className="absolute bottom-0 left-0 right-0 p-6 space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-3xl font-bold mb-2">{movie.title}</h2>
              <div className="flex items-center space-x-3 text-sm text-gray-300">
                <span>{movie.year}</span>
                <span>•</span>
                <span>{movie.genres.join(', ')}</span>
                <span>•</span>
                <span>{movie.duration}</span>
              </div>
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 ${
                  i < Math.floor(movie.rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-500'
                }`}
              />
            ))}
            <span className="ml-2 text-lg font-semibold">
              {movie.rating.toFixed(1)} / 5.0
            </span>
          </div>

          {/* Overview */}
          <p className="text-sm text-gray-300 line-clamp-3">{movie.overview}</p>

          {/* Action Buttons */}
          <div className="flex items-center justify-center space-x-4 pt-4">
            <button
              onClick={handleSkip}
              className="w-16 h-16 rounded-full bg-dark-card border-2 border-red-500 flex items-center justify-center hover:bg-red-500/20 transition-all"
            >
              <X className="w-8 h-8 text-red-500" />
            </button>

            <button
              onClick={onShowDetails}
              className="px-6 py-3 bg-dark-card/80 backdrop-blur-sm rounded-xl font-semibold hover:bg-dark-card transition-all"
            >
              Details
            </button>

            <button
              onClick={handleMatch}
              className="w-16 h-16 rounded-full bg-gradient-match flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
            >
              <Heart className="w-8 h-8 text-white fill-white" />
            </button>
          </div>
        </div>

        {/* Swipe Indicators */}
        <motion.div
          className="absolute top-10 right-10 transform rotate-12"
          style={{
            opacity: useTransform(x, [0, 100], [0, 1]),
          }}
        >
          <div className="px-6 py-3 border-4 border-green-500 rounded-xl">
            <span className="text-green-500 font-bold text-2xl">MATCH</span>
          </div>
        </motion.div>

        <motion.div
          className="absolute top-10 left-10 transform -rotate-12"
          style={{
            opacity: useTransform(x, [-100, 0], [1, 0]),
          }}
        >
          <div className="px-6 py-3 border-4 border-red-500 rounded-xl">
            <span className="text-red-500 font-bold text-2xl">SKIP</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default MovieCard;
