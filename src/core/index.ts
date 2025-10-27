/**
 * Core Layer Exports
 * Clean Architecture: Domain, Data, and DI layers
 */

// Domain Layer
export {
  Movie,
  UserRating,
  MovieFilter,
  FilterMoviesUseCase,
  AddMovieMatchUseCase,
  RateMovieUseCase,
} from './domain';
export type { IMovieRepository, IUserDataRepository, MovieFilterCriteria } from './domain';

// Data Layer
export {
  MovieRepositoryImpl,
  UserDataRepositoryImpl,
  MovieMapper,
  UserRatingMapper,
  MovieLocalDataSource,
  UserDataLocalDataSource,
} from './data';
export type { MovieDTO, UserRatingDTO, UserDataDTO } from './data';

// Dependency Injection Layer
export {
  DIContainer,
  diContainer,
  setupDIContainer,
  DI_TOKENS,
  provideMovieLocalDataSource,
  provideUserDataLocalDataSource,
  provideMovieRepository,
  provideUserDataRepository,
  provideFilterMoviesUseCase,
  provideAddMovieMatchUseCase,
  provideRateMovieUseCase,
} from './di';
export type { DIToken, IServiceContainer } from './di';
