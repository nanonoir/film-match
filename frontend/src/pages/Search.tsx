/**
 * Search Page
 *
 * Movie discovery and search page with filtering, sorting, and pagination
 * Displays search results based on applied filters
 * Persists filter state in URL query parameters
 */

import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sliders } from 'lucide-react';
import Navbar from '../components/Navbar';
import { SearchBar } from '../presentation/components/Search/SearchBar';
import { SearchFiltersModal } from '../presentation/components/Search/SearchFiltersModal';
import { SearchResults } from '../presentation/components/Search/SearchResults';
import { Pagination } from '../presentation/components/Search/Pagination';
import { useFiltersContext } from '../context/filters/useFiltersContext';
import { useSearch } from '../hooks/useSearch';
import type { DecadeOption, TrendOption, SortOption } from '../context/filters/FiltersContext';

export const Search: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filtersModalOpen, setFiltersModalOpen] = useState(false);
  const {
    criteria,
    updateSearch,
    updateGenres,
    updateMinRating,
    setDecade,
    setTrend,
    setSortBy,
    setCurrentPage,
    pagination,
    decade,
    trend,
    sortBy,
  } = useFiltersContext();

  const { filteredMovies, totalResults, totalPages, currentPage } = useSearch();
  const isInitializedRef = useRef(false);

  // Initialize filters from URL on mount
  useEffect(() => {
    if (isInitializedRef.current) return;
    isInitializedRef.current = true;

    const query = searchParams.get('query');
    const decadeParam = searchParams.get('decade') as DecadeOption;
    const genres = searchParams.getAll('genres');
    const rating = searchParams.get('rating');
    const trendParam = searchParams.get('trend') as TrendOption;
    const sortParam = searchParams.get('sort') as SortOption;
    const page = searchParams.get('page');

    if (query) updateSearch(query);
    if (decadeParam) setDecade(decadeParam);
    if (genres.length > 0) updateGenres(genres);
    if (rating) updateMinRating(parseFloat(rating));
    if (trendParam) setTrend(trendParam);
    if (sortParam) setSortBy(sortParam);
    if (page) setCurrentPage(parseInt(page, 10));
  }, []); // Only run on mount

  // Update URL when filters change
  useEffect(() => {
    if (!isInitializedRef.current) return;

    const newParams = new URLSearchParams();

    if (criteria.search) newParams.set('query', criteria.search);
    if (decade !== 'all') newParams.set('decade', decade);
    if (criteria.genres.length > 0) {
      criteria.genres.forEach((g) => newParams.append('genres', g));
    }
    if (criteria.minRating > 0) newParams.set('rating', criteria.minRating.toString());
    if (trend !== 'all') newParams.set('trend', trend);
    if (sortBy !== 'title') newParams.set('sort', sortBy);
    if (currentPage > 1) newParams.set('page', currentPage.toString());

    setSearchParams(newParams);
  }, [criteria.search, criteria.genres, criteria.minRating, decade, trend, sortBy, currentPage, setSearchParams]);

  return (
    <div className="min-h-screen bg-dark-bg">
      <Navbar />

      {/* Main Content */}
      <div className="pt-24 pb-12 px-3 xs:px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header with Search and Filters Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 xs:mb-12"
        >
          <h1 className="text-3xl xs:text-4xl font-bold text-white mb-4 xs:mb-6">
            Buscar Películas
          </h1>

          {/* Search Bar with Filters Button */}
          <div className="flex gap-3 xs:gap-4">
            <div className="flex-1">
              <SearchBar placeholder="Buscar por título, director, actor..." />
            </div>
            <button
              onClick={() => setFiltersModalOpen(true)}
              className="px-4 xs:px-6 py-2.5 xs:py-3 bg-dark-card border border-gray-700 rounded-lg xs:rounded-xl hover:border-primary-pink transition-all flex items-center gap-2 xs:gap-3 text-xs xs:text-sm sm:text-base font-medium text-white hover:text-primary-pink whitespace-nowrap"
            >
              <Sliders className="w-4 xs:w-5 h-4 xs:h-5 flex-shrink-0" />
              <span className="hidden xs:inline">Filtros</span>
            </button>
          </div>
        </motion.div>

        {/* Results Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <SearchResults movies={filteredMovies} totalResults={totalResults} />

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalResults={totalResults}
              itemsPerPage={pagination.itemsPerPage}
            />
          )}
        </motion.div>
      </div>

      {/* Filters Modal */}
      <SearchFiltersModal isOpen={filtersModalOpen} onClose={() => setFiltersModalOpen(false)} />
    </div>
  );
};

export default Search;
