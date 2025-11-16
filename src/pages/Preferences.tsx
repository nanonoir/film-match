/**
 * Preferences Page
 * Página de preferencias de recomendación del usuario
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, X, Search } from 'lucide-react';
import Navbar from '../components/Navbar';

const GENRES = [
  'Acción',
  'Comedia',
  'Ciencia Ficción',
  'Drama',
  'Terror',
  'Romance',
  'Thriller',
  'Aventura',
  'Animación',
  'Crimen',
  'Fantasía',
  'Documental',
  'Musical',
  'Misterio',
  'Western',
  'Guerra',
];

const FAVORITE_MOVIES = ['Inception', 'The Matrix', 'Interstellar', 'The Dark Knight', 'Pulp Fiction'];
const FAVORITE_DIRECTORS = ['Christopher Nolan', 'Steven Spielberg', 'Martin Scorsese', 'Quentin Tarantino'];
const FAVORITE_ACTORS = ['Leonardo DiCaprio', 'Tom Hanks', 'Meryl Streep', 'Denzel Washington'];

const Preferences: React.FC = () => {
  const navigate = useNavigate();

  // Genre preferences
  const [selectedGenres, setSelectedGenres] = useState<string[]>(['Acción', 'Ciencia Ficción']);

  // Favorite movies
  const [movieSearch, setMovieSearch] = useState('');
  const [favoriteMovies, setFavoriteMovies] = useState<string[]>(['Inception', 'The Matrix']);

  // Favorite directors
  const [directorSearch, setDirectorSearch] = useState('');
  const [favoriteDirectors, setFavoriteDirectors] = useState<string[]>(['Christopher Nolan']);

  // Favorite actors
  const [actorSearch, setActorSearch] = useState('');
  const [favoriteActors, setFavoriteActors] = useState<string[]>(['Leonardo DiCaprio']);

  // Handle genre toggle
  const toggleGenre = (genre: string) => {
    setSelectedGenres(prev =>
      prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
    );
  };

  // Handle adding favorite movie
  const addFavoriteMovie = (movie: string) => {
    if (!favoriteMovies.includes(movie) && movie.trim()) {
      setFavoriteMovies([...favoriteMovies, movie]);
      setMovieSearch('');
    }
  };

  // Handle removing favorite movie
  const removeFavoriteMovie = (movie: string) => {
    setFavoriteMovies(favoriteMovies.filter(m => m !== movie));
  };

  // Handle adding favorite director
  const addFavoriteDirector = (director: string) => {
    if (!favoriteDirectors.includes(director) && director.trim()) {
      setFavoriteDirectors([...favoriteDirectors, director]);
      setDirectorSearch('');
    }
  };

  // Handle removing favorite director
  const removeFavoriteDirector = (director: string) => {
    setFavoriteDirectors(favoriteDirectors.filter(d => d !== director));
  };

  // Handle adding favorite actor
  const addFavoriteActor = (actor: string) => {
    if (!favoriteActors.includes(actor) && actor.trim()) {
      setFavoriteActors([...favoriteActors, actor]);
      setActorSearch('');
    }
  };

  // Handle removing favorite actor
  const removeFavoriteActor = (actor: string) => {
    setFavoriteActors(favoriteActors.filter(a => a !== actor));
  };

  return (
    <div className="min-h-screen bg-dark-bg">
      <Navbar />

      {/* Header */}
      <div className="pt-20 px-3 xs:px-4 sm:px-6 lg:px-8 pb-6">
        <div className="max-w-4xl mx-auto flex items-center gap-3 xs:gap-4">
          <button
            onClick={() => navigate('/profile')}
            className="p-2 xs:p-3 rounded-full bg-dark-card hover:bg-dark-card/80 transition-colors"
          >
            <ArrowLeft className="w-5 xs:w-6 h-5 xs:h-6" />
          </button>
          <div className="flex items-center gap-2 xs:gap-3">
            <div className="w-10 xs:w-12 h-10 xs:h-12 bg-gradient-primary rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xs xs:text-sm">⚙️</span>
            </div>
            <h1 className="text-xl xs:text-2xl sm:text-3xl font-bold">Preferencias de Recomendación</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-3 xs:px-4 sm:px-6 lg:px-8 pb-12">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Géneros Favoritos */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-dark-card rounded-2xl p-4 xs:p-6 border-2 border-gray-700"
          >
            <h2 className="text-lg xs:text-xl sm:text-2xl font-bold mb-4 xs:mb-6">Géneros Favoritos</h2>
            <div className="p-4 xs:p-6 border border-gray-700 rounded-xl flex flex-wrap gap-2 xs:gap-3">
              {GENRES.map(genre => (
                <button
                  key={genre}
                  onClick={() => toggleGenre(genre)}
                  className={`px-3 xs:px-4 py-2 rounded-full font-semibold text-xs xs:text-sm transition-all border ${
                    selectedGenres.includes(genre)
                      ? 'bg-gradient-primary text-white border-primary-pink'
                      : 'bg-dark-hover hover:bg-dark-hover/80 text-gray-300 border-gray-600 hover:border-gray-500'
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Películas Favoritas */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-dark-card rounded-2xl p-4 xs:p-6 border-2 border-gray-700"
          >
            <h2 className="text-lg xs:text-xl sm:text-2xl font-bold mb-4 xs:mb-6">Películas Favoritas</h2>

            {/* Search Input with Dropdown */}
            <div className="mb-4 xs:mb-6">
              <div className="relative">
                <Search className="absolute left-3 xs:left-4 top-1/2 transform -translate-y-1/2 w-4 xs:w-5 h-4 xs:h-5 text-gray-500 z-10" />
                <input
                  type="text"
                  value={movieSearch}
                  onChange={(e) => setMovieSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && movieSearch.trim()) {
                      addFavoriteMovie(movieSearch);
                    }
                  }}
                  placeholder="Busca y añade tus películas favoritas..."
                  className="input-field pl-10 xs:pl-12 text-xs xs:text-sm w-full"
                />

                {/* Dropdown Results */}
                {movieSearch.trim() && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-dark-card border border-gray-700 rounded-lg overflow-hidden z-20 max-h-48 overflow-y-auto">
                    {FAVORITE_MOVIES.filter(movie =>
                      movie.toLowerCase().includes(movieSearch.toLowerCase()) &&
                      !favoriteMovies.includes(movie)
                    ).map(movie => (
                      <button
                        key={movie}
                        onClick={() => addFavoriteMovie(movie)}
                        className="w-full text-left px-4 py-3 hover:bg-dark-hover transition-colors text-gray-300 text-xs xs:text-sm border-b border-gray-800 last:border-b-0"
                      >
                        {movie}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Selected Movies */}
            <div className="flex flex-wrap gap-2 xs:gap-3">
              {favoriteMovies.map(movie => (
                <div
                  key={movie}
                  className="bg-dark-hover px-3 xs:px-4 py-2 rounded-lg flex items-center gap-2 text-xs xs:text-sm border border-gray-600"
                >
                  <span>{movie}</span>
                  <button
                    onClick={() => removeFavoriteMovie(movie)}
                    className="hover:text-red-400 transition-colors"
                  >
                    <X className="w-4 xs:w-5 h-4 xs:h-5" />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Directores Preferidos */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-dark-card rounded-2xl p-4 xs:p-6 border-2 border-gray-700"
          >
            <h2 className="text-lg xs:text-xl sm:text-2xl font-bold mb-4 xs:mb-6">Directores Preferidos</h2>

            {/* Search Input with Dropdown */}
            <div className="mb-4 xs:mb-6">
              <div className="relative">
                <Search className="absolute left-3 xs:left-4 top-1/2 transform -translate-y-1/2 w-4 xs:w-5 h-4 xs:h-5 text-gray-500 z-10" />
                <input
                  type="text"
                  value={directorSearch}
                  onChange={(e) => setDirectorSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && directorSearch.trim()) {
                      addFavoriteDirector(directorSearch);
                    }
                  }}
                  placeholder="Busca y añade tus directores preferidos..."
                  className="input-field pl-10 xs:pl-12 text-xs xs:text-sm w-full"
                />

                {/* Dropdown Results */}
                {directorSearch.trim() && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-dark-card border border-gray-700 rounded-lg overflow-hidden z-20 max-h-48 overflow-y-auto">
                    {FAVORITE_DIRECTORS.filter(director =>
                      director.toLowerCase().includes(directorSearch.toLowerCase()) &&
                      !favoriteDirectors.includes(director)
                    ).map(director => (
                      <button
                        key={director}
                        onClick={() => addFavoriteDirector(director)}
                        className="w-full text-left px-4 py-3 hover:bg-dark-hover transition-colors text-gray-300 text-xs xs:text-sm border-b border-gray-800 last:border-b-0"
                      >
                        {director}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Selected Directors */}
            <div className="flex flex-wrap gap-2 xs:gap-3">
              {favoriteDirectors.map(director => (
                <div
                  key={director}
                  className="bg-dark-hover px-3 xs:px-4 py-2 rounded-lg flex items-center gap-2 text-xs xs:text-sm border border-gray-600"
                >
                  <span>{director}</span>
                  <button
                    onClick={() => removeFavoriteDirector(director)}
                    className="hover:text-red-400 transition-colors"
                  >
                    <X className="w-4 xs:w-5 h-4 xs:h-5" />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Actores/Actrices Preferidos */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-dark-card rounded-2xl p-4 xs:p-6 border-2 border-gray-700"
          >
            <h2 className="text-lg xs:text-xl sm:text-2xl font-bold mb-4 xs:mb-6">Actores/Actrices Preferidos</h2>

            {/* Search Input with Dropdown */}
            <div className="mb-4 xs:mb-6">
              <div className="relative">
                <Search className="absolute left-3 xs:left-4 top-1/2 transform -translate-y-1/2 w-4 xs:w-5 h-4 xs:h-5 text-gray-500 z-10" />
                <input
                  type="text"
                  value={actorSearch}
                  onChange={(e) => setActorSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && actorSearch.trim()) {
                      addFavoriteActor(actorSearch);
                    }
                  }}
                  placeholder="Busca y añade tus actores preferidos..."
                  className="input-field pl-10 xs:pl-12 text-xs xs:text-sm w-full"
                />

                {/* Dropdown Results */}
                {actorSearch.trim() && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-dark-card border border-gray-700 rounded-lg overflow-hidden z-20 max-h-48 overflow-y-auto">
                    {FAVORITE_ACTORS.filter(actor =>
                      actor.toLowerCase().includes(actorSearch.toLowerCase()) &&
                      !favoriteActors.includes(actor)
                    ).map(actor => (
                      <button
                        key={actor}
                        onClick={() => addFavoriteActor(actor)}
                        className="w-full text-left px-4 py-3 hover:bg-dark-hover transition-colors text-gray-300 text-xs xs:text-sm border-b border-gray-800 last:border-b-0"
                      >
                        {actor}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Selected Actors */}
            <div className="flex flex-wrap gap-2 xs:gap-3">
              {favoriteActors.map(actor => (
                <div
                  key={actor}
                  className="bg-dark-hover px-3 xs:px-4 py-2 rounded-lg flex items-center gap-2 text-xs xs:text-sm border border-gray-600"
                >
                  <span>{actor}</span>
                  <button
                    onClick={() => removeFavoriteActor(actor)}
                    className="hover:text-red-400 transition-colors"
                  >
                    <X className="w-4 xs:w-5 h-4 xs:h-5" />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Save Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex gap-3 xs:gap-4 pt-4 xs:pt-6"
          >
            <button
              onClick={() => navigate('/profile')}
              className="flex-1 btn-secondary py-3 xs:py-4 text-xs xs:text-sm sm:text-base rounded-lg xs:rounded-xl font-semibold"
            >
              Cancelar
            </button>
            <button
              onClick={() => navigate('/profile')}
              className="flex-1 btn-primary py-3 xs:py-4 text-xs xs:text-sm sm:text-base rounded-lg xs:rounded-xl font-semibold"
            >
              Guardar Preferencias
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Preferences;
