import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Star } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface FiltersSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const allGenres = [
  'Action',
  'Adventure',
  'Crime',
  'Drama',
  'Sci-Fi',
  'Thriller',
  'Romance',
];

const FiltersSidebar: React.FC<FiltersSidebarProps> = ({ isOpen, onClose }) => {
  const { filters, setFilters, resetFilters } = useApp();
  const [localFilters, setLocalFilters] = useState(filters);

  const handleGenreToggle = (genre: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      genres: prev.genres.includes(genre)
        ? prev.genres.filter((g) => g !== genre)
        : [...prev.genres, genre],
    }));
  };

  const handleApply = () => {
    setFilters(localFilters);
    onClose();
  };

  const handleClear = () => {
    resetFilters();
    setLocalFilters({
      search: '',
      genres: [],
      yearRange: [1970, 2025],
      minRating: 0,
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed left-0 top-0 bottom-0 w-full max-w-md bg-dark-card z-50 overflow-y-auto shadow-2xl"
          >
            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Filtros de Búsqueda</h2>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-full bg-dark-input flex items-center justify-center hover:bg-opacity-80 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-gray-400">
                Personaliza tus recomendaciones de películas
              </p>

              {/* Search */}
              <div>
                <label className="block text-sm font-medium mb-2">Buscar</label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    value={localFilters.search}
                    onChange={(e) =>
                      setLocalFilters({ ...localFilters, search: e.target.value })
                    }
                    placeholder="Título, director, actor..."
                    className="input-field pl-12"
                  />
                </div>
              </div>

              {/* Genres */}
              <div>
                <label className="block text-sm font-medium mb-3">Géneros</label>
                <div className="flex flex-wrap gap-2">
                  {allGenres.map((genre) => (
                    <button
                      key={genre}
                      onClick={() => handleGenreToggle(genre)}
                      className={`px-4 py-2 rounded-xl font-medium transition-all ${
                        localFilters.genres.includes(genre)
                          ? 'bg-gradient-primary text-white'
                          : 'bg-dark-input text-gray-300 hover:bg-dark-input/80'
                      }`}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
              </div>

              {/* Year Range */}
              <div>
                <label className="block text-sm font-medium mb-3">
                  Año: {localFilters.yearRange[0]} - {localFilters.yearRange[1]}
                </label>
                <div className="space-y-4">
                  <input
                    type="range"
                    min="1970"
                    max="2025"
                    value={localFilters.yearRange[0]}
                    onChange={(e) =>
                      setLocalFilters({
                        ...localFilters,
                        yearRange: [parseInt(e.target.value), localFilters.yearRange[1]],
                      })
                    }
                    className="w-full accent-primary-pink"
                  />
                  <input
                    type="range"
                    min="1970"
                    max="2025"
                    value={localFilters.yearRange[1]}
                    onChange={(e) =>
                      setLocalFilters({
                        ...localFilters,
                        yearRange: [localFilters.yearRange[0], parseInt(e.target.value)],
                      })
                    }
                    className="w-full accent-primary-purple"
                  />
                </div>
              </div>

              {/* Min Rating */}
              <div>
                <label className="block text-sm font-medium mb-3">
                  Calificación mínima: {localFilters.minRating.toFixed(1)}{' '}
                  <Star className="w-4 h-4 inline fill-yellow-400 text-yellow-400" />
                </label>
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="0.1"
                  value={localFilters.minRating}
                  onChange={(e) =>
                    setLocalFilters({
                      ...localFilters,
                      minRating: parseFloat(e.target.value),
                    })
                  }
                  className="w-full accent-primary-pink"
                />
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-4">
                <button onClick={handleApply} className="w-full btn-primary">
                  Aplicar
                </button>
                <button onClick={handleClear} className="w-full btn-secondary">
                  Limpiar
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default FiltersSidebar;
