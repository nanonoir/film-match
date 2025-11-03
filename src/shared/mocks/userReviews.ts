/**
 * Mock User Reviews
 * Datos mock de reseñas de películas para mostrar en el perfil
 */

export interface MockReview {
  movieId: number;
  rating: number;
  ratedAt: Date;
}

/**
 * Mock reviews para el perfil
 * Estas son las últimas 3 películas "calificadas" por el usuario
 */
export const MOCK_USER_REVIEWS: MockReview[] = [
  {
    movieId: 5, // The Shawshank Redemption
    rating: 5,
    ratedAt: new Date('2024-01-15'),
  },
  {
    movieId: 7, // Forrest Gump
    rating: 5,
    ratedAt: new Date('2024-01-10'),
  },
  {
    movieId: 3, // The Dark Knight
    rating: 4,
    ratedAt: new Date('2024-01-05'),
  },
];
