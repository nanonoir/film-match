# 🎣 Custom Hooks - Guía Rápida

## Importaciones

```typescript
import {
  useDIContainer,
  useMovieRepository,
  useMovieMatches,
  useMovieRatings,
  useMovieSearch,
  useMovieStats,
  useFilterMovies,
} from '@/hooks'
```

---

## 1. useDIContainer

**Base hook para resolver servicios del DI**

```typescript
const { get, has } = useDIContainer()

// Resolver un servicio
const repo = get<IMovieRepository>(DI_TOKENS.MOVIE_REPOSITORY)

// Verificar disponibilidad
const exists = has(DI_TOKENS.MOVIE_REPOSITORY)
```

---

## 2. useMovieRepository

**Operaciones CRUD de películas**

```typescript
const {
  getAll,           // () => Promise<Movie[]>
  getById,          // (id) => Promise<Movie | null>
  search,           // (query) => Promise<Movie[]>
  getByGenre,       // (genre) => Promise<Movie[]>
  getByYear,        // (year) => Promise<Movie[]>
  getByDirector,    // (director) => Promise<Movie[]>
  getTopRated,      // (limit?) => Promise<Movie[]>
  getByRatingRange, // (min, max) => Promise<Movie[]>
  getByYearRange,   // (min, max) => Promise<Movie[]>
  loading,          // boolean
  error,            // Error | null
} = useMovieRepository()
```

### Ejemplo
```typescript
useEffect(() => {
  getAll().then(movies => setMovies(movies))
}, [getAll])
```

---

## 3. useMovieMatches

**Gestión de películas favoritas**

```typescript
const {
  matches,        // Movie[]
  addMatch,       // (movie) => Promise<void>
  removeMatch,    // (id) => Promise<void>
  isMatched,      // (id) => Promise<boolean>
  clearMatches,   // () => Promise<void>
  getMatchCount,  // () => number
  getMatchById,   // (id) => Movie | undefined
  loading,        // boolean
  error,          // Error | null
} = useMovieMatches()
```

### Ejemplo
```typescript
const handleLike = async (movie) => {
  await addMatch(movie)
}
```

---

## 4. useMovieRatings

**Gestión de calificaciones**

```typescript
const {
  ratings,              // UserRating[]
  addRating,            // (rating) => Promise<void>
  removeRating,         // (id) => Promise<void>
  getRatingForMovie,    // (id) => UserRating | undefined
  hasRating,            // (id) => boolean
  getAverageRating,     // () => number
  getRatingCount,       // () => number
  getRatingDistribution, // () => Record<number, number>
  getMoviesRatedAbove,  // (threshold) => UserRating[]
  clearRatings,         // () => Promise<void>
  loading,              // boolean
  error,                // Error | null
} = useMovieRatings()
```

### Ejemplo
```typescript
const handleRate = async (movieId, rating, comment) => {
  await addRating({ movieId, rating, comment })
}
```

---

## 5. useMovieSearch

**Búsqueda con debouncing**

```typescript
const {
  results,             // Movie[]
  searchQuery,         // string
  search,              // (query) => void (con debounce)
  searchImmediate,     // (query) => Promise<Movie[]>
  clearSearch,         // () => void
  setDebounceDelay,    // (ms) => void
  searchHistory,       // string[]
  clearSearchHistory,  // () => void
  removeFromHistory,   // (query) => void
  getResultCount,      // () => number
  hasResults,          // () => boolean
  isSearching,         // boolean
  error,               // Error | null
} = useMovieSearch(debounceMs) // default: 300ms
```

### Ejemplo
```typescript
const handleChange = (e) => {
  search(e.target.value) // Debounced!
}
```

---

## 6. useMovieStats

**Análisis de datos del usuario**

```typescript
const {
  stats: {
    totalMatches,
    totalRatings,
    averageRating,
    highestRatedMovie,
    lowestRatedMovie,
    mostCommonGenre,
    averageYearMatched,
    averageYearRated,
    ratingDistribution,
    genreDistribution,
  },
  getAverageRatingByGenre,   // (genre) => number
  getMoviesByGenre,          // (genre) => Movie[]
  getRatingCountByGenre,     // (genre) => number
  getMostRatedGenres,        // (limit?) => { genre, count }[]
  getRatingPercentage,       // (rating) => number
  hasStrongPreferences,      // () => boolean
  getRatingPattern,          // () => 'optimistic'|'neutral'|'critical'
  loading,                   // boolean
} = useMovieStats()
```

### Ejemplo
```typescript
return (
  <div>
    <p>Rating promedio: {stats.averageRating}⭐</p>
    <p>Total visto: {stats.totalMatches}</p>
    <p>Género favorito: {stats.mostCommonGenre}</p>
  </div>
)
```

---

## 7. useFilterMovies

**Filtrado multi-criterio**

```typescript
const {
  filteredMovies,      // Movie[]
  criteria: {
    search,            // string
    genres,            // string[]
    yearRange,         // [number, number]
    minRating,         // number
  },
  toggleGenre,         // (genre) => void
  setGenres,           // (genres) => void
  setYearRange,        // (min, max) => void
  setMinRating,        // (rating) => void
  filterBySearch,      // (query) => void
  resetFilters,        // () => void
  sortResults,         // (by, ascending?) => Movie[]
  getStatistics,       // () => { total, avgRating, avgYear, genreDistribution }
  getAvailableGenres,  // () => string[]
  hasActiveFilters,    // () => boolean
  loading,             // boolean
  error,               // Error | null
} = useFilterMovies(movies)
```

### Ejemplo
```typescript
const sorted = sortResults('rating', false) // por rating descendente
```

---

## Casos de Uso Comunes

### Caso 1: Cargar películas al montar
```typescript
function MovieList() {
  const { getAll, loading } = useMovieRepository()
  const [movies, setMovies] = useState([])

  useEffect(() => {
    getAll().then(setMovies)
  }, [getAll])

  return <div>{loading ? 'Cargando...' : <Movies movies={movies} />}</div>
}
```

### Caso 2: Búsqueda en tiempo real
```typescript
function SearchBar() {
  const { results, search } = useMovieSearch(300)

  return (
    <div>
      <input onChange={(e) => search(e.target.value)} />
      <Results results={results} />
    </div>
  )
}
```

### Caso 3: Agregar/remover favorito con toggle
```typescript
function MovieCard({ movie }) {
  const { addMatch, removeMatch } = useMovieMatches()
  const [liked, setLiked] = useState(false)

  const toggleLike = async () => {
    if (liked) {
      await removeMatch(movie.id)
    } else {
      await addMatch(movie)
    }
    setLiked(!liked)
  }

  return <button onClick={toggleLike}>{liked ? '❤️' : '🤍'}</button>
}
```

### Caso 4: Dashboard con estadísticas
```typescript
function Dashboard() {
  const { stats, getMostRatedGenres } = useMovieStats()
  const { filteredMovies, toggleGenre } = useFilterMovies(movies)

  return (
    <div>
      <Stats stats={stats} />
      <TopGenres genres={getMostRatedGenres(5)} />
      <FilteredList
        movies={filteredMovies}
        onGenreToggle={toggleGenre}
      />
    </div>
  )
}
```

### Caso 5: Filtrado avanzado
```typescript
function FilteredMovies({ movies }) {
  const { filteredMovies, toggleGenre, setYearRange, sortResults }
    = useFilterMovies(movies)

  const sorted = sortResults('rating', false)

  return (
    <div>
      <Filters onGenreToggle={toggleGenre} onYearChange={setYearRange} />
      <MovieGrid movies={sorted} />
    </div>
  )
}
```

---

## Composición de Hooks

Los hooks se pueden componer para crear funcionalidades complejas:

```typescript
function AdvancedMovieSearch() {
  // Resolver servicios
  const { get } = useDIContainer()

  // Obtener películas
  const { getAll } = useMovieRepository()

  // Buscar
  const { results, search } = useMovieSearch(300)

  // Favoritos
  const { matches, addMatch } = useMovieMatches()

  // Filtrar
  const { filteredMovies, toggleGenre } = useFilterMovies(results)

  // Estadísticas
  const { stats } = useMovieStats()

  // Todos los hooks trabajan juntos automáticamente
}
```

---

## Performance Tips

### 1. Memoizar funciones callback
```typescript
const handleLike = useCallback((movie) => {
  addMatch(movie)
}, [addMatch])
```

### 2. Usar debouncing para búsqueda
```typescript
const { search } = useMovieSearch(500) // 500ms delay
```

### 3. Limitar actualizaciones
```typescript
useEffect(() => {
  getAll()
}, [getAll]) // Solo se ejecuta si getAll cambia
```

---

## Error Handling

Todos los hooks incluyen error handling:

```typescript
const { results, error } = useMovieSearch()

if (error) {
  return <ErrorBoundary error={error} />
}
```

---

## Tipos Necesarios

```typescript
import { Movie, UserRating, MovieFilterCriteria } from '@core'
```

---

**¡Ya estás listo para usar los custom hooks!**
