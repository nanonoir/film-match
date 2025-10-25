import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Filter } from 'lucide-react';
import Navbar from '../components/Navbar';
import MovieCard from '../components/MovieCard';
import MatchModal from '../components/MatchModal';
import FiltersSidebar from '../components/FiltersSidebar';
import Chatbot from '../components/Chatbot';
import { useApp } from '../context/AppContext';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { getFilteredMovies, currentMovieIndex, addMatch, skipMovie } = useApp();
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [matchedMovie, setMatchedMovie] = useState<any>(null);
  const [showFilters, setShowFilters] = useState(false);

  const filteredMovies = getFilteredMovies();
  const currentMovie = filteredMovies[currentMovieIndex];

  const handleMatch = () => {
    if (currentMovie) {
      addMatch(currentMovie);
      setMatchedMovie(currentMovie);
      setShowMatchModal(true);
    }
  };

  const handleSkip = () => {
    skipMovie();
  };

  const handleViewDetails = () => {
    if (currentMovie) {
      navigate(`/movie/${currentMovie.id}`);
    }
  };

  const handleCloseMatchModal = () => {
    setShowMatchModal(false);
    setMatchedMovie(null);
  };

  const handleViewDetailsFromModal = () => {
    setShowMatchModal(false);
    handleViewDetails();
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Discover Movies</h1>
              <p className="text-gray-400">
                Swipe right to match, left to skip
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
                  You've seen all the movies. Try adjusting your filters or check back later.
                </p>
                <button
                  onClick={() => setShowFilters(true)}
                  className="btn-primary"
                >
                  Adjust Filters
                </button>
              </motion.div>
            ) : (
              <>
                {/* Next cards in stack (for preview) */}
                {filteredMovies.slice(currentMovieIndex + 1, currentMovieIndex + 3).map((movie, index) => (
                  <div
                    key={movie.id}
                    className="absolute w-full max-w-md"
                    style={{
                      transform: `scale(${1 - (index + 1) * 0.05}) translateY(${(index + 1) * 10}px)`,
                      zIndex: 10 - index,
                      opacity: 0.5 - index * 0.2,
                    }}
                  >
                    <div className="w-full h-[600px] bg-dark-card rounded-3xl" />
                  </div>
                ))}

                {/* Current card */}
                <MovieCard
                  key={currentMovie.id}
                  movie={currentMovie}
                  onMatch={handleMatch}
                  onSkip={handleSkip}
                  onShowDetails={handleViewDetails}
                />
              </>
            )}
          </div>

          {/* Instructions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-8 text-gray-500 text-sm"
          >
            <p>Drag the card or use the buttons to make your choice</p>
          </motion.div>
        </div>
      </div>

      {/* Modals and Overlays */}
      <MatchModal
        isOpen={showMatchModal}
        movie={matchedMovie}
        onClose={handleCloseMatchModal}
        onViewDetails={handleViewDetailsFromModal}
      />

      <FiltersSidebar isOpen={showFilters} onClose={() => setShowFilters(false)} />

      <Chatbot />
    </div>
  );
};

export default Home;
