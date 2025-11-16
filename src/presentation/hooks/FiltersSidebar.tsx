/**
 * FiltersSidebar Component
 * Refactored version using custom hooks
 *
 * Sidebar for filtering movies by various criteria
 * Integrates with useFilterMovies hook
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Sliders } from 'lucide-react';

interface FiltersSidebarProps {
  onClose: () => void;
  onGenreToggle: (genre: string) => void;
  onYearRangeChange: (min: number, max: number) => void;
  onMinRatingChange: (rating: number) => void;
  onSearchChange: (query: string) => void;
}

const GENRES = [
  'Acción',
  'Comedia',
  'Drama',
  'Terror',
  'Ciencia Ficción',
  'Suspenso',
  'Romance',
  'Animación',
];

const YEARS = {
  min: 1970,
  max: new Date().getFullYear(),
};

const RATINGS = [1, 2, 3, 4, 5];

/**
 * FiltersSidebar Component
 * Sidebar with various movie filter options
 *
 * @param onClose - Callback to close sidebar
 * @param onGenreToggle - Callback when genre is toggled
 * @param onYearRangeChange - Callback when year range changes
 * @param onMinRatingChange - Callback when min rating changes
 * @param onSearchChange - Callback when search query changes
 *
 * @example
 * ```typescript
 * {showFilters && (
 *   <FiltersSidebar
 *     onClose={handleClose}
 *     onGenreToggle={handleGenreToggle}
 *     onYearRangeChange={handleYearChange}
 *     onMinRatingChange={handleRatingChange}
 *     onSearchChange={handleSearchChange}
 *   />
 * )}
 * ```
 */
const FiltersSidebar: React.FC<FiltersSidebarProps> = ({
  onClose,
  onGenreToggle,
  onYearRangeChange,
  onMinRatingChange,
  onSearchChange,
}) => {
  // Local state for filter values
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [yearRange, setYearRange] = useState<[number, number]>([YEARS.min, YEARS.max]);
  const [minRating, setMinRating] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  /**
   * Handle genre toggle
   */
  const handleGenreToggle = (genre: string) => {
    const updated = selectedGenres.includes(genre)
      ? selectedGenres.filter((g) => g !== genre)
      : [...selectedGenres, genre];
    setSelectedGenres(updated);
    onGenreToggle(genre);
  };

  /**
   * Handle year range change
   */
  const handleYearChange = (type: 'min' | 'max', value: number) => {
    const newRange: [number, number] = [...yearRange];
    if (type === 'min') {
      newRange[0] = Math.min(value, yearRange[1]);
    } else {
      newRange[1] = Math.max(value, yearRange[0]);
    }
    setYearRange(newRange);
    onYearRangeChange(newRange[0], newRange[1]);
  };

  /**
   * Handle rating change
   */
  const handleRatingChange = (rating: number) => {
    setMinRating(rating);
    onMinRatingChange(rating);
  };

  /**
   * Handle search input
   */
  const handleSearchInput = (value: string) => {
    setSearchQuery(value);
    onSearchChange(value);
  };

  /**
   * Reset all filters
   */
  const handleResetFilters = () => {
    setSelectedGenres([]);
    setYearRange([YEARS.min, YEARS.max]);
    setMinRating(0);
    setSearchQuery('');
    onYearRangeChange(YEARS.min, YEARS.max);
    onMinRatingChange(0);
    onSearchChange('');
  };

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 z-40"
      />

      {/* Sidebar */}
      <motion.div
        initial={{ x: -400 }}
        animate={{ x: 0 }}
        exit={{ x: -400 }}
        className="fixed left-0 top-0 bottom-0 w-full sm:w-96 md:w-[400px] bg-dark-card z-50 overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-dark-card border-b border-white/10 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sliders className="w-6 h-6" />
            <h2 className="text-2xl font-bold">Filtros</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-dark-hover transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Filters Content */}
        <div className="p-6 space-y-8">
          {/* Search */}
          <div>
            <label className="block text-sm font-semibold mb-3">Buscar</label>
            <input
              type="text"
              placeholder="Buscar películas..."
              value={searchQuery}
              onChange={(e) => handleSearchInput(e.target.value)}
              className="w-full px-4 py-2 bg-dark-hover rounded-lg border border-white/10 focus:border-primary outline-none transition-all"
            />
          </div>

          {/* Genres */}
          <div>
            <label className="block text-sm font-semibold mb-3">Géneros</label>
            <div className="grid grid-cols-2 gap-2">
              {GENRES.map((genre) => (
                <button
                  key={genre}
                  onClick={() => handleGenreToggle(genre)}
                  className={`px-4 py-2 rounded-lg transition-all border ${
                    selectedGenres.includes(genre)
                      ? 'bg-primary text-white border-primary-pink'
                      : 'bg-dark-hover hover:bg-dark-hover/80 text-gray-300 border-gray-600 hover:border-gray-500'
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>

          {/* Year Range */}
          <div>
            <label className="block text-sm font-semibold mb-3">
              Rango de Años: {yearRange[0]} - {yearRange[1]}
            </label>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Desde</label>
                <input
                  type="range"
                  min={YEARS.min}
                  max={YEARS.max}
                  value={yearRange[0]}
                  onChange={(e) => handleYearChange('min', parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Hasta</label>
                <input
                  type="range"
                  min={YEARS.min}
                  max={YEARS.max}
                  value={yearRange[1]}
                  onChange={(e) => handleYearChange('max', parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Minimum Rating */}
          <div>
            <label className="block text-sm font-semibold mb-3">
              Calificación Mínima: {minRating > 0 ? minRating : 'Cualquiera'}⭐
            </label>
            <div className="flex gap-2">
              {[0, ...RATINGS].map((rating) => (
                <button
                  key={rating}
                  onClick={() => handleRatingChange(rating)}
                  className={`flex-1 px-3 py-2 rounded-lg transition-all border ${
                    minRating === rating
                      ? 'bg-yellow-500 text-white border-yellow-400'
                      : 'bg-dark-hover hover:bg-dark-hover/80 text-gray-300 border-gray-600 hover:border-gray-500'
                  }`}
                >
                  {rating === 0 ? 'Cualquiera' : `${rating}+`}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-6 border-t border-white/10">
            <button
              onClick={handleResetFilters}
              className="flex-1 px-4 py-3 rounded-lg bg-dark-hover hover:bg-dark-hover/80 font-semibold transition-all border border-gray-600 hover:border-gray-500"
            >
              Restablecer
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-lg bg-primary hover:bg-primary/80 font-semibold transition-all border border-primary-pink"
            >
              Aplicar
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default FiltersSidebar;
