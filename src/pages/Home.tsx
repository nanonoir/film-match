import React from 'react';
import Navbar from '../components/Navbar';
import Chatbot from '../components/Chatbot';
import MovieListContainer from '../presentation/hooks/MovieListContainer';

/**
 * Home Page
 * Wrapper component that displays the main movie discovery interface
 * Uses the refactored MovieListContainer with clean architecture hooks
 */
const Home: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <MovieListContainer />
      <Chatbot />
    </div>
  );
};

export default Home;
