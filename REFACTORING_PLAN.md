# 📋 PLAN DETALLADO DE REFACTORIZACIÓN - Film-Match

## Visión General

Refactorizar la aplicación film-match desde una arquitectura de componentes monolíticos a una arquitectura limpia con separación de capas (Clean Architecture) y principios SOLID, implementando un sistema robusto de componentes reutilizables basado en el patrón **Strategy** mediante Tailwind CSS utility-first.

**Objetivo:**
- Aumentar adherencia a Clean Architecture de 15% → 85%+
- Mejorar SOLID Principles de 25% → 80%+
- Crear componentes UI reutilizables con Strategy Pattern
- Hacerlo completamente testeable
- Mantener funcionalidad existente sin regresiones

---

## FASE 1: PREPARACIÓN Y ESTRUCTURA (1-2 días)

### 1.1 Crear Estructura de Carpetas de Clean Architecture

```
src/
├── core/
│   ├── domain/
│   │   ├── entities/
│   │   │   ├── Movie.entity.ts
│   │   │   ├── UserRating.entity.ts
│   │   │   └── MovieFilter.entity.ts
│   │   ├── repositories/
│   │   │   ├── MovieRepository.interface.ts
│   │   │   └── UserDataRepository.interface.ts
│   │   ├── useCases/
│   │   │   ├── FilterMovies.useCase.ts
│   │   │   ├── AddMovieMatch.useCase.ts
│   │   │   └── RateMovie.useCase.ts
│   │   └── services/
│   │       ├── ChatbotService.interface.ts
│   │       └── AuthService.interface.ts
│   │
│   ├── data/
│   │   ├── repositories/
│   │   │   ├── MovieRepository.impl.ts
│   │   │   └── UserDataRepository.impl.ts
│   │   ├── dataSources/
│   │   │   ├── MovieLocalDataSource.ts
│   │   │   └── types.ts (DTOs)
│   │   └── services/
│   │       ├── ChatbotService.impl.ts
│   │       └── AuthService.impl.ts
│   │
│   └── di/
│       └── container.ts (Dependency Injection setup)
│
├── presentation/
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Button.types.ts
│   │   │   │   └── buttonStrategies.ts
│   │   │   ├── Card/
│   │   │   │   ├── Card.tsx
│   │   │   │   ├── Card.types.ts
│   │   │   │   └── cardStrategies.ts
│   │   │   ├── Input/
│   │   │   │   ├── Input.tsx
│   │   │   │   ├── Input.types.ts
│   │   │   │   └── inputStrategies.ts
│   │   │   ├── Modal/
│   │   │   │   ├── Modal.tsx
│   │   │   │   ├── Modal.types.ts
│   │   │   │   └── modalStrategies.ts
│   │   │   ├── Backdrop/
│   │   │   │   ├── Backdrop.tsx
│   │   │   │   ├── Backdrop.types.ts
│   │   │   │   └── backdropStrategies.ts
│   │   │   ├── Badge/
│   │   │   │   ├── Badge.tsx
│   │   │   │   ├── Badge.types.ts
│   │   │   │   └── badgeStrategies.ts
│   │   │   ├── Rating/
│   │   │   │   ├── RatingStars.tsx
│   │   │   │   ├── RatingStars.types.ts
│   │   │   │   └── ratingStrategies.ts
│   │   │   └── IconButton/
│   │   │       ├── IconButton.tsx
│   │   │       ├── IconButton.types.ts
│   │   │       └── iconButtonStrategies.ts
│   │   │
│   │   ├── feature/
│   │   │   ├── MovieCard/
│   │   │   │   ├── MovieCard.tsx (refactorizado)
│   │   │   │   └── MovieCard.types.ts
│   │   │   ├── LoginForm/
│   │   │   │   ├── LoginForm.tsx (refactorizado)
│   │   │   │   └── LoginForm.types.ts
│   │   │   ├── FiltersSidebar/
│   │   │   │   ├── FiltersSidebar.tsx (refactorizado)
│   │   │   │   └── FiltersSidebar.types.ts
│   │   │   ├── MatchModal/
│   │   │   │   ├── MatchModal.tsx (refactorizado)
│   │   │   │   └── MatchModal.types.ts
│   │   │   ├── RatingModal/
│   │   │   │   ├── RatingModal.tsx (refactorizado)
│   │   │   │   └── RatingModal.types.ts
│   │   │   ├── Chatbot/
│   │   │   │   ├── Chatbot.tsx (refactorizado)
│   │   │   │   └── Chatbot.types.ts
│   │   │   ├── Navbar/
│   │   │   │   ├── Navbar.tsx (refactorizado)
│   │   │   │   └── Navbar.types.ts
│   │   │   └── MovieCardStack/
│   │   │       ├── MovieCardStack.tsx (nuevo)
│   │   │       └── MovieCardStack.types.ts
│   │   │
│   │   └── layout/
│   │       └── ErrorBoundary.tsx
│   │
│   ├── context/
│   │   ├── MoviesContext.tsx (dividido)
│   │   ├── UserMatchesContext.tsx (dividido)
│   │   ├── UserRatingsContext.tsx (dividido)
│   │   ├── FilterContext.tsx (dividido)
│   │   └── UIContext.tsx (dividido)
│   │
│   ├── hooks/
│   │   ├── useApp.ts (deprecado, eliminar)
│   │   ├── useMovieSwipe.ts (nuevo)
│   │   ├── useFilteredMovies.ts (nuevo)
│   │   ├── useAuth.ts (nuevo)
│   │   ├── useMovieRating.ts (nuevo)
│   │   ├── useChatbot.ts (nuevo)
│   │   └── useUserMatches.ts (nuevo)
│   │
│   ├── pages/
│   │   ├── Login.tsx
│   │   ├── Home.tsx (refactorizado)
│   │   └── MovieDetailsPage.tsx (refactorizado)
│   │
│   └── viewModels/
│       ├── HomeViewModel.ts (opcional)
│       └── MovieDetailsViewModel.ts (opcional)
│
├── shared/
│   ├── types/
│   │   ├── MovieTypes.ts
│   │   ├── FilterTypes.ts
│   │   ├── UserTypes.ts
│   │   ├── UIComponentTypes.ts
│   │   └── index.ts
│   │
│   ├── constants/
│   │   ├── MovieGenres.ts
│   │   ├── FilterDefaults.ts
│   │   ├── MovieYearRange.ts
│   │   └── index.ts
│   │
│   ├── utils/
│   │   ├── formatters.ts
│   │   ├── validators.ts
│   │   ├── classNameMerger.ts
│   │   └── index.ts
│   │
│   └── config/
│       └── tailwind.strategies.ts
│
├── App.tsx (mínimo cambio)
├── main.tsx
├── App.css
└── index.css

examples/  ← MANTENER para referencia
├── Button.tsx
└── Card.tsx
```

### 1.2 Crear Archivo de Tipos Centralizados

**shared/types/UIComponentTypes.ts**
```typescript
// Props base para todos los componentes
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

// Button
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

// Card
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

// Input
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'filled' | 'underlined';
  size?: 'sm' | 'md' | 'lg';
  error?: boolean;
  helperText?: string;
  label?: string;
}

// Modal
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  closeOnBackdropClick?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

// Backdrop
export interface BackdropProps {
  onClick: () => void;
  zIndex?: number;
  blur?: boolean;
}

// Badge
export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

// RatingStars
export interface RatingStarsProps {
  rating: number;
  onChange?: (rating: number) => void;
  readOnly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  count?: number;
}

// IconButton
export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  variant?: 'default' | 'filled' | 'outlined';
  size?: 'sm' | 'md' | 'lg';
}
```

### 1.3 Crear Sistema de Estrategias para Estilos

**presentation/components/ui/buttonStrategies.ts**
```typescript
export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

const baseStyles = 'rounded-xl shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold';

export const buttonVariantStrategies: Record<ButtonVariant, string> = {
  primary: 'bg-gradient-primary text-white hover:opacity-90 active:scale-95',
  secondary: 'bg-dark-card text-white border border-primary-pink hover:border-primary-purple transition-colors',
  danger: 'bg-rose-500 text-white hover:bg-rose-600 active:scale-95',
  ghost: 'text-primary-pink hover:bg-primary-pink/10 active:bg-primary-pink/20',
};

export const buttonSizeStrategies: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
};

export const getButtonClassName = (variant: ButtonVariant, size: ButtonSize, customClassName?: string): string => {
  return `${baseStyles} ${buttonVariantStrategies[variant]} ${buttonSizeStrategies[size]} ${customClassName || ''}`.trim();
};
```

---

## FASE 2: CREAR COMPONENTES UI REUTILIZABLES (2-3 días)

### 2.1 Crear Componentes Base con Strategy Pattern

**Componentes a crear en presentation/components/ui/**

1. **Button.tsx** - Usando patrón strategy como ejemplo
2. **Card.tsx** - Usando patrón strategy como ejemplo
3. **Input.tsx** - Nueva
4. **Modal.tsx** - Nueva, reemplaza MatchModal/RatingModal
5. **Backdrop.tsx** - Nueva
6. **Badge.tsx** - Nueva
7. **RatingStars.tsx** - Nueva
8. **IconButton.tsx** - Nueva

**Formato consistente para cada componente:**
```
ComponentName/
├── ComponentName.tsx          # Componente principal
├── ComponentName.types.ts     # Tipos e interfaces
└── componentNameStrategies.ts # Estrategias de estilos
```

### 2.2 Orden de Creación (por dependencias)

1. **Button** (sin dependencias)
2. **Input** (sin dependencias)
3. **Badge** (sin dependencias)
4. **Backdrop** (sin dependencias)
5. **Card** (usa Button internamente)
6. **RatingStars** (usa Button internamente)
7. **IconButton** (sin dependencias)
8. **Modal** (usa Backdrop)

---

## FASE 3: CREAR CAPA DE DOMINIO (1-2 días)

### 3.1 Entidades de Dominio

**core/domain/entities/Movie.entity.ts**
```typescript
export class Movie {
  constructor(
    public readonly id: number,
    public readonly title: string,
    public readonly year: number,
    public readonly genres: string[],
    public readonly duration: string,
    public readonly rating: number,
    public readonly overview: string,
    public readonly director: string,
    public readonly cast: string[],
    public readonly poster: string,
  ) {}

  // Métodos de dominio
  matchesGenres(genres: string[]): boolean {
    if (genres.length === 0) return true;
    return genres.some(g => this.genres.includes(g));
  }

  matchesYearRange(minYear: number, maxYear: number): boolean {
    return this.year >= minYear && this.year <= maxYear;
  }

  matchesMinRating(minRating: number): boolean {
    return this.rating >= minRating;
  }

  matchesSearch(searchTerm: string): boolean {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      this.title.toLowerCase().includes(search) ||
      this.director.toLowerCase().includes(search) ||
      this.cast.some(actor => actor.toLowerCase().includes(search))
    );
  }
}
```

**core/domain/entities/UserRating.entity.ts**
```typescript
export class UserRating {
  constructor(
    public readonly movieId: number,
    public readonly rating: number,
    public readonly comment?: string,
    public readonly createdAt?: Date,
  ) {
    if (rating < 0 || rating > 5) {
      throw new Error('Rating must be between 0 and 5');
    }
  }
}
```

**core/domain/entities/MovieFilter.entity.ts**
```typescript
export interface MovieFilterCriteria {
  search: string;
  genres: string[];
  yearRange: [number, number];
  minRating: number;
}

export class MovieFilter {
  constructor(public readonly criteria: MovieFilterCriteria) {}

  matches(movie: Movie): boolean {
    return (
      movie.matchesSearch(this.criteria.search) &&
      movie.matchesGenres(this.criteria.genres) &&
      movie.matchesYearRange(this.criteria.yearRange[0], this.criteria.yearRange[1]) &&
      movie.matchesMinRating(this.criteria.minRating)
    );
  }

  isEmpty(): boolean {
    return (
      this.criteria.search === '' &&
      this.criteria.genres.length === 0 &&
      this.criteria.yearRange[0] === 1970 &&
      this.criteria.yearRange[1] === 2025 &&
      this.criteria.minRating === 0
    );
  }
}
```

### 3.2 Interfaces de Repositorio

**core/domain/repositories/MovieRepository.interface.ts**
```typescript
export interface MovieRepository {
  getAll(): Promise<Movie[]>;
  getById(id: number): Promise<Movie | null>;
  search(query: string): Promise<Movie[]>;
}
```

**core/domain/repositories/UserDataRepository.interface.ts**
```typescript
export interface UserDataRepository {
  getMatches(): Promise<Movie[]>;
  addMatch(movie: Movie): Promise<void>;
  removeMatch(movieId: number): Promise<void>;

  getRatings(): Promise<UserRating[]>;
  addRating(rating: UserRating): Promise<void>;
  getRatingForMovie(movieId: number): Promise<UserRating | null>;
}
```

### 3.3 Use Cases

**core/domain/useCases/FilterMovies.useCase.ts**
```typescript
export class FilterMoviesUseCase {
  constructor(private movieRepository: MovieRepository) {}

  async execute(
    movies: Movie[],
    criteria: MovieFilterCriteria
  ): Promise<Movie[]> {
    const filter = new MovieFilter(criteria);
    return movies.filter(movie => filter.matches(movie));
  }
}
```

**core/domain/useCases/AddMovieMatch.useCase.ts**
```typescript
export class AddMovieMatchUseCase {
  constructor(private userDataRepository: UserDataRepository) {}

  async execute(movie: Movie): Promise<void> {
    return this.userDataRepository.addMatch(movie);
  }
}
```

**core/domain/useCases/RateMovie.useCase.ts**
```typescript
export class RateMovieUseCase {
  constructor(private userDataRepository: UserDataRepository) {}

  async execute(rating: UserRating): Promise<void> {
    return this.userDataRepository.addRating(rating);
  }
}
```

---

## FASE 4: CREAR CAPA DE DATOS (1 día)

### 4.1 Implementaciones de Repositorio

**core/data/repositories/MovieRepository.impl.ts**
```typescript
import moviesData from '@/data/movies.json';

export class MovieRepositoryImpl implements MovieRepository {
  async getAll(): Promise<Movie[]> {
    // Simular delay de fetch
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(moviesData.map(data => this.mapToEntity(data)));
      }, 100);
    });
  }

  async getById(id: number): Promise<Movie | null> {
    const data = moviesData.find(m => m.id === id);
    return data ? this.mapToEntity(data) : null;
  }

  private mapToEntity(data: any): Movie {
    return new Movie(
      data.id,
      data.title,
      data.year,
      data.genres,
      data.duration,
      data.rating,
      data.overview,
      data.director,
      data.cast,
      data.poster,
    );
  }
}
```

**core/data/repositories/UserDataRepository.impl.ts**
```typescript
export class UserDataRepositoryImpl implements UserDataRepository {
  private readonly MATCHES_KEY = 'film_match_matches';
  private readonly RATINGS_KEY = 'film_match_ratings';

  async getMatches(): Promise<Movie[]> {
    const data = localStorage.getItem(this.MATCHES_KEY);
    return data ? JSON.parse(data) : [];
  }

  async addMatch(movie: Movie): Promise<void> {
    const matches = await this.getMatches();
    if (!matches.find(m => m.id === movie.id)) {
      matches.push(movie);
      localStorage.setItem(this.MATCHES_KEY, JSON.stringify(matches));
    }
  }

  async removeMatch(movieId: number): Promise<void> {
    const matches = await this.getMatches();
    const filtered = matches.filter(m => m.id !== movieId);
    localStorage.setItem(this.MATCHES_KEY, JSON.stringify(filtered));
  }

  async getRatings(): Promise<UserRating[]> {
    const data = localStorage.getItem(this.RATINGS_KEY);
    return data ? JSON.parse(data) : [];
  }

  async addRating(rating: UserRating): Promise<void> {
    const ratings = await this.getRatings();
    const existingIndex = ratings.findIndex(r => r.movieId === rating.movieId);
    if (existingIndex >= 0) {
      ratings[existingIndex] = rating;
    } else {
      ratings.push(rating);
    }
    localStorage.setItem(this.RATINGS_KEY, JSON.stringify(ratings));
  }

  async getRatingForMovie(movieId: number): Promise<UserRating | null> {
    const ratings = await this.getRatings();
    return ratings.find(r => r.movieId === movieId) || null;
  }
}
```

### 4.2 Servicios de Datos

**core/data/services/ChatbotService.impl.ts**
```typescript
export class ChatbotServiceImpl implements ChatbotService {
  constructor(private movieRepository: MovieRepository) {}

  async getResponse(userMessage: string, context: ChatContext): Promise<string> {
    const keywords = this.extractKeywords(userMessage);
    const recommendations = await this.findRecommendations(keywords);
    return this.formatResponse(recommendations);
  }

  private extractKeywords(message: string): string[] {
    // Implementación básica de extracción de palabras clave
    return message.toLowerCase().split(' ').filter(w => w.length > 3);
  }

  private async findRecommendations(keywords: string[]): Promise<Movie[]> {
    // Buscar películas que coincidan con palabras clave
    const allMovies = await this.movieRepository.getAll();
    return allMovies.filter(movie =>
      keywords.some(keyword =>
        movie.title.toLowerCase().includes(keyword) ||
        movie.genres.some(g => g.toLowerCase().includes(keyword))
      )
    );
  }

  private formatResponse(movies: Movie[]): string {
    if (movies.length === 0) {
      return 'No encontré películas que coincidan con tu búsqueda. ¿Prueba con otro género o título?';
    }
    const titles = movies.slice(0, 3).map(m => `"${m.title}"`).join(', ');
    return `¡Excelente elección! Te recomiendo ${titles}. ¿Te gustaría conocer más detalles de alguna?`;
  }
}
```

---

## FASE 5: CREAR CUSTOM HOOKS (1-2 días)

### 5.1 Hooks para Use Cases

**presentation/hooks/useFilteredMovies.ts**
```typescript
export const useFilteredMovies = (movies: Movie[], filters: MovieFilterCriteria) => {
  const filterMoviesUseCase = useMemo(
    () => new FilterMoviesUseCase(movieRepository),
    []
  );

  return useMemo(
    () => filterMoviesUseCase.execute(movies, filters),
    [filterMoviesUseCase, movies, filters]
  );
};
```

**presentation/hooks/useMovieSwipe.ts** (Lógica del Home.tsx)
```typescript
export const useMovieSwipe = (movies: Movie[]) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [matchedMovie, setMatchedMovie] = useState<Movie | null>(null);
  const [showMatchModal, setShowMatchModal] = useState(false);

  const addMovieMatchUseCase = useMemo(
    () => new AddMovieMatchUseCase(userDataRepository),
    []
  );

  const handleMatch = useCallback(async () => {
    const movie = movies[currentIndex];
    if (movie) {
      await addMovieMatchUseCase.execute(movie);
      setMatchedMovie(movie);
      setShowMatchModal(true);
      setCurrentIndex(prev => prev + 1);
    }
  }, [currentIndex, movies, addMovieMatchUseCase]);

  const handleSkip = useCallback(() => {
    setCurrentIndex(prev => prev + 1);
  }, []);

  return {
    currentMovie: movies[currentIndex] || null,
    hasMoreMovies: currentIndex < movies.length,
    matchedMovie,
    showMatchModal,
    handleMatch,
    handleSkip,
    closeMatchModal: () => {
      setShowMatchModal(false);
      setMatchedMovie(null);
    },
  };
};
```

**presentation/hooks/useMovieRating.ts**
```typescript
export const useMovieRating = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const rateMovieUseCase = useMemo(
    () => new RateMovieUseCase(userDataRepository),
    []
  );

  const addRating = useCallback(
    async (movieId: number, rating: number, comment?: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const userRating = new UserRating(movieId, rating, comment);
        await rateMovieUseCase.execute(userRating);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setIsLoading(false);
      }
    },
    [rateMovieUseCase]
  );

  return { addRating, isLoading, error };
};
```

### 5.2 Hooks para Contextos (Reemplazarán AppContext)

Se crearán hooks de contexto para cada dominio:
- `useMovies()` - Películas disponibles
- `useUserMatches()` - Matches del usuario
- `useUserRatings()` - Ratings del usuario
- `useFilters()` - Estado de filtros
- `useUI()` - Estado de UI (modals, etc.)

---

## FASE 6: REFACTORIZAR COMPONENTES EXISTENTES (2-3 días)

### 6.1 Componentes Feature a Refactorizar

**1. Home.tsx**
- Extraer lógica a `useMovieSwipe` hook
- Usar componentes UI de `presentation/components/ui/`
- Eliminar estado local de modals complejos
- Crear `MovieCardStack` sub-componente

**2. LoginForm.tsx**
- Extraer validación a utilidades
- Reemplazar buttons genéricos con `<Button variant="primary"/>`
- Usar `<Input/>` reutilizable
- Extraer lógica de autenticación a `useAuth` hook

**3. MovieCard.tsx**
- Usar `<Badge/>` para géneros
- Usar `<Button/>` para acciones
- Usar `<RatingStars/>` para rating
- Eliminar estilos inline

**4. FiltersSidebar.tsx**
- Reemplazar inputs con `<Input/>`
- Usar `<Button/>` para reset/apply
- Usar `<Badge/>` para géneros seleccionados
- Sincronizar correctamente con contexto

**5. MatchModal.tsx**
- Reemplazar con componente genérico `<Modal/>`
- Usar `<Button/>` para acciones
- Mantener Framer Motion para animaciones

**6. RatingModal.tsx**
- Reemplazar con componente genérico `<Modal/>`
- Usar `<RatingStars/>` integrado
- Usar `<Input/>` para comentarios
- Usar `<Button/>` para submit

**7. Chatbot.tsx**
- Extraer lógica a `useChatbot` hook
- Usar `<Modal/>` o contenedor custom
- Usar `<Button/>` para send
- Usar `<Input/>` para mensaje

**8. Navbar.tsx**
- Usar `<IconButton/>` para íconos
- Usar `<Button/>` para acciones principales
- Mejorar navegación con validaciones

**9. MovieDetailsPage.tsx**
- Usar `<Button/>` para acciones
- Usar `<RatingStars/>` integrado
- Usar `<Modal/>` para rating
- Usar `<Badge/>` para géneros

### 6.2 Orden de Refactorización (sin dependencias circular)

1. **LoginForm** (sin muchas dependencias)
2. **Navbar** (sin muchas dependencias)
3. **MovieDetailsPage** (depende de componentes UI)
4. **FiltersSidebar** (requiere `<Input/>`, `<Button/>`, `<Badge/>`)
5. **MovieCard** (requiere `<Button/>`, `<Badge/>`, `<RatingStars/>`)
6. **MatchModal** (requiere `<Modal/>`, `<Button/>`)
7. **RatingModal** (requiere `<Modal/>`, `<RatingStars/>`, `<Input/>`)
8. **Home** (requiere todo + `useMovieSwipe` hook)
9. **Chatbot** (requiere `<Modal/>`, `<Input/>`, `<Button/>`)

---

## FASE 7: CONTEXTOS API DIVIDIDOS (1 día)

### 7.1 Dividir AppContext en 5 Contextos

**presentation/context/MoviesContext.tsx**
- Estado de películas disponibles
- Carga inicial
- Funciones: `getMovies()`, `getMovieById()`

**presentation/context/UserMatchesContext.tsx**
- Películas matcheadas por usuario
- Funciones: `addMatch()`, `removeMatch()`, `getMatches()`

**presentation/context/UserRatingsContext.tsx**
- Ratings del usuario
- Funciones: `addRating()`, `getRating()`, `getAllRatings()`

**presentation/context/FilterContext.tsx**
- Estado de filtros
- Funciones: `setFilters()`, `resetFilters()`

**presentation/context/UIContext.tsx**
- Estado de UI (índice de película actual, etc.)
- Funciones: `setCurrentMovieIndex()`, `nextMovie()`, `previousMovie()`

### 7.2 Providers Wrapper

```typescript
// presentation/context/AppProviders.tsx
export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <MoviesProvider>
      <UserMatchesProvider>
        <UserRatingsProvider>
          <FilterProvider>
            <UIProvider>
              {children}
            </UIProvider>
          </FilterProvider>
        </UserRatingsProvider>
      </UserMatchesProvider>
    </MoviesProvider>
  );
};
```

---

## FASE 8: ERROR HANDLING & BOUNDARIES (1 día)

### 8.1 Error Boundary Component

**presentation/components/layout/ErrorBoundary.tsx**
- Captura errores de React
- Muestra UI de error
- Opción de reintentar

### 8.2 Mejora de Validaciones

**shared/utils/validators.ts**
- `isValidEmail()`
- `isValidRating()`
- `isValidYear()`
- `isValidMovieFilter()`

---

## FASE 9: TESTING SETUP (1 día)

### 9.1 Configurar Framework de Testing

- Vitest/Jest
- React Testing Library
- Mocks para repositorios

### 9.2 Escribir Tests para

- Use Cases (FilterMovies, AddMatch, RateMovie)
- Entities (Movie, UserRating)
- Custom Hooks
- UI Components

---

## FASE 10: DOCUMENTACIÓN & LIMPIEZA (1 día)

### 10.1 Actualizar CLAUDE.md

- Documentar nueva estructura
- Actualizar guías de desarrollo
- Documenta patrones a seguir

### 10.2 Limpiar Código

- Remover AppContext antiguo
- Remover componentes duplicados
- Actualizar imports

---

## 📊 RESUMEN DE CAMBIOS

| Aspecto | Antes | Después | Beneficio |
|---------|-------|---------|-----------|
| Componentes | 7 grandes + 1 context | 8 UI reutilizables + 9 feature + 5 contexts | Reutilizabilidad |
| Capas | 1 (Presentación) | 4 (Domain, Data, Presentation, Shared) | Separación de responsabilidades |
| Use Cases | 0 | 3+ | Testabilidad |
| Custom Hooks | 1 (useApp) | 8+ | Composibilidad |
| Líneas de código UI | ~1200 | ~800 | Simplificación |
| Líneas de código Lógica | ~200 | ~600 | Completitud |
| Testabilidad | 10% | 85% | Confianza |
| Mantenibilidad | Baja | Alta | Escalabilidad |

---

## 🎯 MÉTRICAS DE ÉXITO

✅ Clean Architecture: **15% → 85%+**
✅ SOLID Principles: **25% → 80%+**
✅ TypeScript Strictness: **60% → 95%+**
✅ Component Reusability: **0 → 8 componentes UI reutilizables**
✅ Test Coverage: **0% → 60%+**
✅ Type Safety: Eliminar todos los `any` → 0 `any`
✅ Funcionalidad: **100% backward compatible**

---

## ⏱️ CRONOGRAMA ESTIMADO

- **Fase 1:** 1-2 días
- **Fase 2:** 2-3 días
- **Fase 3:** 1-2 días
- **Fase 4:** 1 día
- **Fase 5:** 1-2 días
- **Fase 6:** 2-3 días
- **Fase 7:** 1 día
- **Fase 8:** 1 día
- **Fase 9:** 1 día
- **Fase 10:** 1 día

**TOTAL: 13-18 días de trabajo**

*Puede paralelizarse para acelerar si hay múltiples desarrolladores*

---

## 🚀 PRÓXIMOS PASOS

1. ✅ Revisar y confirmar este plan
2. ⏳ Comenzar Fase 1 (Estructura de carpetas)
3. ⏳ Crear tipos centralizados
4. ⏳ Crear sistema de estrategias
5. ⏳ Proceder con Fases 2-10...
