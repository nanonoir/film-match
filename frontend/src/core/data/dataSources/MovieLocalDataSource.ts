/**
 * MovieLocalDataSource
 * Accesses movie data from local JSON file
 */

import moviesData from '../../../data/movies.json';
import type { MovieDTO } from '../types';

/**
 * Data source for accessing movie data from local file
 */
export class MovieLocalDataSource {
  private moviesCache: MovieDTO[] | null = null;

  /**
   * Loads all movies from the data source
   *
   * @returns Promise resolving to array of MovieDTOs
   * @throws Error if loading fails
   */
  async getAll(): Promise<MovieDTO[]> {
    // Return cached data if available
    if (this.moviesCache) {
      return [...this.moviesCache];
    }

    try {
      // Cast the imported data to MovieDTO array
      const movies = moviesData as MovieDTO[];

      // Validate that data is an array
      if (!Array.isArray(movies)) {
        throw new Error('Invalid movies data format');
      }

      // Cache the data
      this.moviesCache = movies;

      return [...movies];
    } catch (error) {
      throw new Error(`Failed to load movies: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Gets a single movie by ID
   *
   * @param id - Movie ID
   * @returns Promise resolving to MovieDTO or null if not found
   */
  async getById(id: number): Promise<MovieDTO | null> {
    try {
      const movies = await this.getAll();
      const movie = movies.find((m) => m.id === id);
      return movie || null;
    } catch (error) {
      throw new Error(`Failed to get movie by ID: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Searches movies by query in title, director, cast, and overview
   *
   * @param query - Search query
   * @returns Promise resolving to matching MovieDTOs
   */
  async search(query: string): Promise<MovieDTO[]> {
    try {
      const movies = await this.getAll();
      const lowerQuery = query.toLowerCase();

      return movies.filter((movie) => {
        return (
          movie.title.toLowerCase().includes(lowerQuery) ||
          movie.director.toLowerCase().includes(lowerQuery) ||
          movie.cast.some((actor) => actor.toLowerCase().includes(lowerQuery)) ||
          movie.overview.toLowerCase().includes(lowerQuery)
        );
      });
    } catch (error) {
      throw new Error(`Failed to search movies: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Clears the cache
   * Useful for testing or refreshing data
   */
  clearCache(): void {
    this.moviesCache = null;
  }
}
