# Phase 7: Multiple Specialized Contexts for State Management

## Resumen Ejecutivo

**Phase 7** implementa un sistema de gestión de estado basado en **múltiples contextos especializados** siguiendo el patrón **Separation of Concerns** y los principios **SOLID**.

En lugar de un único contexto global monolítico, se divide la funcionalidad en 6 contextos independientes, cada uno con responsabilidad única:

1. **UserContext** - Gestión de usuario autenticado
2. **MoviesContext** - Gestión de películas disponibles
3. **FiltersContext** - Gestión de filtros de búsqueda
4. **MatchesContext** - Gestión de películas matcheadas por el usuario
5. **RatingsContext** - Gestión de ratings y comentarios
6. **UIContext** - Gestión de estado UI (notificaciones, modales)

---

## Arquitectura

### Patrón: Composite Provider

```
┌─────────────────────────────────────────────┐
│          AppProvider (Composite)            │
│  Envuelve todos los contextos especializados│
└─────────┬───────────────────────────────────┘
          │
          ├─ UserProvider
          │  └─ UserContext
          │
          ├─ MoviesProvider
          │  └─ MoviesContext
          │
          ├─ FiltersProvider
          │  └─ FiltersContext
          │
          ├─ MatchesProvider
          │  └─ MatchesContext
          │
          ├─ RatingsProvider
          │  └─ RatingsContext
          │
          └─ UIProvider
             └─ UIContext
```

### Estructura de Carpetas

```
src/context/
├── AppProvider.tsx          # Composite provider
├── index.ts                 # Exportaciones
│
├── user/
│   ├── UserContext.tsx      # Context + tipos
│   ├── UserProvider.tsx     # Provider component
│   └── useUserContext.ts    # Custom hook
│
├── movies/
│   ├── MoviesContext.tsx
│   ├── MoviesProvider.tsx
│   └── useMoviesContext.ts
│
├── filters/
│   ├── FiltersContext.tsx
│   ├── FiltersProvider.tsx
│   └── useFiltersContext.ts
│
├── matches/
│   ├── MatchesContext.tsx
│   ├── MatchesProvider.tsx
│   └── useMatchesContext.ts
│
├── ratings/
│   ├── RatingsContext.tsx
│   ├── RatingsProvider.tsx
│   └── useRatingsContext.ts
│
└── ui/
    ├── UIContext.tsx
    ├── UIProvider.tsx
    └── useUIContext.ts
```

---

## Contextos Especializados

### 1. UserContext

**Responsabilidad:** Gestión del usuario autenticado

**Estado:**
```tsx
interface UserState {
  userId: string | null;
  username: string | null;
  email: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: Error | null;
}
```

**Acciones:**
- `login(credentials)` - Autentica usuario
- `logout()` - Cierra sesión
- `updateProfile(data)` - Actualiza perfil
- `setError(error)` - Establece error

**Uso:**
```tsx
import { useUserContext } from '@/context';

function MyComponent() {
  const { isAuthenticated, userId, login, logout } = useUserContext();

  return (
    <div>
      {isAuthenticated ? (
        <button onClick={logout}>Logout</button>
      ) : (
        <button onClick={() => login(...)}>Login</button>
      )}
    </div>
  );
}
```

**Cuándo usar:**
- Verificar si usuario está autenticado
- Acceder a datos del usuario
- Operaciones de login/logout
- Mostrar username/email

---

### 2. MoviesContext

**Responsabilidad:** Gestión de películas disponibles

**Estado:**
```tsx
interface MoviesState {
  movies: Movie[];
  currentMovieIndex: number;
  isLoading: boolean;
  error: Error | null;
}
```

**Acciones:**
- `loadMovies()` - Carga películas desde la fuente
- `setCurrentMovieIndex(index)` - Actualiza índice actual
- `getFilteredMovies()` - Obtiene películas filtradas
- `setError(error)` - Establece error

**Uso:**
```tsx
import { useMoviesContext } from '@/context';

function MovieCard() {
  const { movies, currentMovieIndex } = useMoviesContext();
  const currentMovie = movies[currentMovieIndex];

  return <div>{currentMovie?.title}</div>;
}
```

**Cuándo usar:**
- Acceder a lista de películas
- Obtener película actual
- Cambiar de película (swipe)
- Cargar/recargar películas

---

### 3. FiltersContext

**Responsabilidad:** Gestión de filtros de búsqueda

**Estado:**
```tsx
interface FilterState {
  search: string;
  genres: string[];
  yearRange: [number, number];
  minRating: number;
}
```

**Acciones:**
- `setSearch(query)` - Actualiza búsqueda
- `setGenres(genres)` - Actualiza géneros seleccionados
- `setYearRange(range)` - Actualiza rango de años
- `setMinRating(rating)` - Actualiza rating mínimo
- `resetFilters()` - Resetea todos los filtros

**Uso:**
```tsx
import { useFiltersContext } from '@/context';

function FiltersSidebar() {
  const { search, genres, setSearch, setGenres } = useFiltersContext();

  return (
    <div>
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {/* género buttons */}
    </div>
  );
}
```

**Cuándo usar:**
- Actualizar filtros de búsqueda
- Mostrar estado actual de filtros
- Lógica de búsqueda/filtrado
- Sidebar de filtros

---

### 4. MatchesContext

**Responsabilidad:** Gestión de películas matcheadas

**Estado:**
```tsx
interface MatchesState {
  matches: Movie[];
  isLoading: boolean;
  error: Error | null;
}
```

**Acciones:**
- `addMatch(movie)` - Agrega película al match
- `removeMatch(movieId)` - Quita película del match
- `getMatches()` - Obtiene todas las películas matcheadas
- `clearMatches()` - Limpia todos los matches

**Uso:**
```tsx
import { useMatchesContext } from '@/context';

function MatchModal() {
  const { matches, addMatch } = useMatchesContext();

  const handleMatch = (movie: Movie) => {
    addMatch(movie);
  };

  return <div>Matches: {matches.length}</div>;
}
```

**Cuándo usar:**
- Mostrar películas matcheadas
- Agregar/quitar matches
- Mostrar contador de matches
- Ver historial de matches

---

### 5. RatingsContext

**Responsabilidad:** Gestión de ratings y comentarios

**Estado:**
```tsx
interface RatingState {
  ratings: UserRating[];
  isLoading: boolean;
  error: Error | null;
}

interface UserRating {
  movieId: number;
  rating: number; // 0-10
  comment?: string;
  timestamp: Date;
}
```

**Acciones:**
- `addRating(movieId, rating, comment?)` - Agrega rating
- `updateRating(movieId, rating, comment?)` - Actualiza rating
- `removeRating(movieId)` - Quita rating
- `getRating(movieId)` - Obtiene rating de película
- `getAllRatings()` - Obtiene todos los ratings

**Uso:**
```tsx
import { useRatingsContext } from '@/context';

function RatingModal() {
  const { addRating, getRating } = useRatingsContext();

  const handleSubmit = (rating: number, comment: string) => {
    addRating(movieId, rating, comment);
  };

  const currentRating = getRating(movieId);

  return <div>Current rating: {currentRating?.rating}</div>;
}
```

**Cuándo usar:**
- Mostrar rating modal
- Guardar rating de usuario
- Mostrar rating previo
- Editar comentarios

---

### 6. UIContext

**Responsabilidad:** Gestión de estado UI (notificaciones, modales)

**Estado:**
```tsx
interface UIState {
  isMatchModalOpen: boolean;
  isRatingModalOpen: boolean;
  selectedMovieForRating?: Movie;
  notifications: Notification[];
}

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}
```

**Acciones:**
- `showNotification(config)` - Muestra notificación
- `hideNotification(id)` - Oculta notificación
- `openMatchModal()` - Abre modal de match
- `closeMatchModal()` - Cierra modal de match
- `openRatingModal(movie)` - Abre modal de rating
- `closeRatingModal()` - Cierra modal de rating

**Uso:**
```tsx
import { useUIContext } from '@/context';

function App() {
  const {
    isMatchModalOpen,
    showNotification,
    openMatchModal
  } = useUIContext();

  const handleSuccess = () => {
    showNotification({
      type: 'success',
      message: 'Movie added to matches!',
      duration: 3000
    });
  };

  return (
    <div>
      {isMatchModalOpen && <MatchModal />}
    </div>
  );
}
```

**Cuándo usar:**
- Mostrar/ocultar modales
- Mostrar notificaciones
- Controlar estado de UI
- Feedback visual al usuario

---

## Patrones de Uso

### Patrón 1: Usar un Único Contexto

```tsx
import { useMoviesContext } from '@/context';

function MovieCard() {
  const { movies, currentMovieIndex } = useMoviesContext();

  return <div>{movies[currentMovieIndex]?.title}</div>;
}
```

### Patrón 2: Combinar Múltiples Contextos

```tsx
import { useMoviesContext, useFiltersContext, useRatingsContext } from '@/context';

function MovieDetailsView() {
  const { movies, currentMovieIndex } = useMoviesContext();
  const { search } = useFiltersContext();
  const { getRating } = useRatingsContext();

  const movie = movies[currentMovieIndex];
  const rating = getRating(movie?.id);

  return (
    <div>
      <h1>{movie?.title}</h1>
      <p>Search term: {search}</p>
      <p>Your rating: {rating?.rating}</p>
    </div>
  );
}
```

### Patrón 3: Operación que Requiere Múltiples Contextos

```tsx
import {
  useMoviesContext,
  useMatchesContext,
  useUIContext
} from '@/context';

function MovieCard() {
  const { movies, currentMovieIndex, setCurrentMovieIndex } = useMoviesContext();
  const { addMatch } = useMatchesContext();
  const { openMatchModal, showNotification } = useUIContext();

  const handleSwipeRight = () => {
    const movie = movies[currentMovieIndex];

    // 1. Agregar al match (MatchesContext)
    addMatch(movie);

    // 2. Mostrar modal (UIContext)
    openMatchModal();

    // 3. Ir a siguiente película (MoviesContext)
    setCurrentMovieIndex(currentMovieIndex + 1);

    // 4. Notificar al usuario (UIContext)
    showNotification({
      type: 'success',
      message: `${movie.title} added to matches!`
    });
  };

  return <button onClick={handleSwipeRight}>Like</button>;
}
```

---

## Ventajas del Enfoque

### ✅ Separation of Concerns
Cada contexto tiene una responsabilidad única y clara.

```
❌ Antes (Monolítico):
AppContext = {
  movies, currentMovieIndex,    // Películas
  matches,                        // Matches
  ratings,                        // Ratings
  filters,                        // Filtros
  isModalOpen,                    // UI
  notifications,                  // UI
  // ...300 líneas de código
}

✅ Después (Especializado):
UserContext    → Usuario autenticado
MoviesContext  → Películas disponibles
FiltersContext → Filtros de búsqueda
MatchesContext → Películas matcheadas
RatingsContext → Ratings y comentarios
UIContext      → Estado UI
```

### ✅ Escalabilidad
Agregar nuevos contextos es directo sin afectar existentes.

```tsx
// Agregar new context es simple
src/context/
├── newFeature/
│   ├── NewFeatureContext.tsx
│   ├── NewFeatureProvider.tsx
│   └── useNewFeatureContext.ts

// Y solo actualizar AppProvider
<AppProvider>
  <NewFeatureProvider>
    {/* resto */}
  </NewFeatureProvider>
</AppProvider>
```

### ✅ Re-renders Optimizados
Componentes solo se re-renderizan si su contexto específico cambia.

```tsx
// Este componente solo se re-renderiza si MoviesContext cambia
function MovieCard() {
  const { movies } = useMoviesContext();
  return <div>{movies[0]?.title}</div>;
}

// Este no se afecta por cambios en MoviesContext
function FiltersSidebar() {
  const { genres, setGenres } = useFiltersContext();
  return <div>{genres.map(...)}</div>;
}
```

### ✅ Testing Simplificado
Cada contexto puede testearse independientemente.

```tsx
// Fácil de mockear un contexto sin afectar otros
<MoviesProvider mockMovies={testMovies}>
  <MovieCard />
</MoviesProvider>

// Sin necesidad de mockear toda la AppProvider
```

### ✅ Mantenibilidad
Código más organizado y fácil de mantener.

```tsx
// Buscar lógica de ratings es fácil:
// Ir a RatingsContext y RatingsProvider
// Sin tener que navegar 500 líneas de código global
```

---

## Orden de Providers

**IMPORTANTE:** El orden en `AppProvider.tsx` importa:

```tsx
export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  return (
    <UserProvider>           {/* 1° - Autenticación */}
      <MoviesProvider>       {/* 2° - Datos base */}
        <FiltersProvider>    {/* 3° - Filtros aplicados */}
          <MatchesProvider>  {/* 4° - Matches (depende de películas) */}
            <RatingsProvider>{/* 5° - Ratings (depende de películas) */}
              <UIProvider>   {/* 6° - UI (último, puede depender de otros) */}
                {children}
              </UIProvider>
            </RatingsProvider>
          </MatchesProvider>
        </FiltersProvider>
      </MoviesProvider>
    </UserProvider>
  );
};
```

**Razón del orden:**
1. **UserProvider primero** - Necesario saber si hay usuario antes de cargar datos
2. **MoviesProvider** - Datos base que otros necesitan
3. **FiltersProvider** - Filtros que se aplican a películas
4. **MatchesProvider** - Depende de películas
5. **RatingsProvider** - Depende de películas
6. **UIProvider** - Último para poder mostrar notificaciones de otros contextos

---

## Mejores Prácticas

### ✅ Hacer

| Práctica | Razón |
|----------|-------|
| Usar hooks específicos (useMoviesContext) | Más legible y con TypeScript |
| Importar solo lo que necesitas | Reduce re-renders |
| Mantener estado simple en cada contexto | Fácil de entender |
| Usar AppProvider una sola vez | En el nivel root |
| Agrupar lógica relacionada | En el mismo contexto |

### ❌ No Hacer

| Práctica | Razón |
|----------|-------|
| Crear contextos para todo | Excesivo y confuso |
| Nesting profundo de providers | Afecta performance |
| Mezclar responsabilidades | Viola SRP |
| Pasar contexto como prop | Usa hooks en su lugar |
| Usar AppProvider múltiples veces | Solo una vez al root |

---

## Diagrama de Dependencias

```
User Authentication
    │
    └─→ Movies Available
         │
         ├─→ Filters Applied
         │   └─→ Get Filtered Movies
         │
         ├─→ Matches (depend on Movies)
         │
         ├─→ Ratings (depend on Movies)
         │
         └─→ UI State
             └─→ Notifications, Modals
```

---

## Integración con Clean Architecture

### Capa de Presentación
```
Components (MovieCard, FiltersSidebar, etc.)
         ↓
      Hooks (useMoviesContext, useFiltersContext, etc.)
         ↓
      Providers (AppProvider, MoviesProvider, etc.)
```

### Separación de Capas
```
┌─────────────────────────────────┐
│   Presentation Layer             │
│   (Components, Hooks)            │
└──────────────┬────────────────────┘
               │
┌──────────────▼────────────────────┐
│   Context Layer                   │
│   (State Management)              │
└──────────────┬────────────────────┘
               │
┌──────────────▼────────────────────┐
│   Domain/Infrastructure Layer     │
│   (Business Logic, Services)      │
└─────────────────────────────────┘
```

---

## Archivos Clave

```
src/
├── context/
│   ├── AppProvider.tsx           # Composite Provider
│   ├── index.ts                  # Exportaciones centralizadas
│   ├── user/
│   ├── movies/
│   ├── filters/
│   ├── matches/
│   ├── ratings/
│   └── ui/

└── App.tsx
    └─ <AppProvider>
        └─ <Router>
            └─ <Routes>
```

---

## Próximos Pasos Sugeridos

### Mejoras Opcionales
- [ ] **Context Persistence:** Guardar estado en localStorage
- [ ] **Context Sync:** Sincronizar estado con backend
- [ ] **DevTools Integration:** Integrar con Redux DevTools
- [ ] **Performance Monitoring:** Trackear re-renders
- [ ] **Error Handling:** Integrar con ErrorBoundary

### Para Producción
- [ ] Revisar re-renders con React DevTools
- [ ] Optimizar con useMemo/useCallback
- [ ] Considerar Zustand o Jotai si crece mucho
- [ ] Agregar tests para each context

---

## Conclusión

**Phase 7** establece una arquitectura de estado escalable, mantenible y alineada con Clean Architecture. El enfoque de múltiples contextos especializados proporciona:

✅ Código más limpio y organizado
✅ Mejor performance (re-renders específicos)
✅ Fácil de testear y mantener
✅ Escalable para nuevas features
✅ Separación clara de responsabilidades

Esta arquitectura forma la base sólida para todas las fases siguientes.

