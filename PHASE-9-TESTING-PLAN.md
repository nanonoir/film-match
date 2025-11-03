# Phase 9: Testing Infrastructure

## Executive Summary

**Phase 9** implementa una suite completa de testing usando **Vitest** + **Testing Library**, cubriendo:
- Unit tests para Domain Layer (UseCases, Services)
- Integration tests para Data Layer (Repositories, DataSources)
- Component tests para Context Providers y Custom Hooks
- Test utilities y test data compartidos
- CI-ready pipeline configurado

**Objetivo:** Proteger la arquitectura existente y habilitar desarrollo seguro de futuras features.

---

## Why Testing Now?

### Current State
```
✅ Clean Architecture → Domain/Data/Presentation layers
✅ SOLID Principles → Applied and validated
✅ Specialized Contexts → 6 contextos independientes
✅ Error Handling → ErrorBoundary + ErrorClassifier
❌ Tests → NONE
```

### The Risk
Sin tests, cada cambio es un riesgo potencial de romper cosas existentes. Una arquitectura bien diseñada sin tests es como un edificio bonito sin inspecciones de seguridad.

### The Solution
Tests validan que tu arquitectura funciona, permite refactoring seguro, y documenta cómo usar cada módulo.

---

## Technology Stack

### Testing Framework
- **Vitest 2.1** - Fast, Vite-native, TypeScript support
- **Testing Library React** - Best practices for testing React
- **jsdom** - DOM environment for tests
- **@vitest/coverage-v8** - Coverage reporting

### Why Vitest?
1. ✅ Vite-native (no webpack config)
2. ✅ Fast (parallelized, HMR support)
3. ✅ TypeScript out-of-the-box
4. ✅ Jest-compatible API (easy learning)
5. ✅ UI mode para debugging visual

---

## Project Structure

```
film-match/
├── src/
│   ├── core/
│   │   ├── domain/
│   │   │   ├── useCases/
│   │   │   │   ├── FilterMovies.useCase.ts
│   │   │   │   ├── __tests__/
│   │   │   │   │   ├── FilterMovies.useCase.test.ts      (NEW)
│   │   │   │   │   ├── AddMovieMatch.useCase.test.ts     (NEW)
│   │   │   │   │   └── RateMovie.useCase.test.ts         (NEW)
│   │   │   ├── services/
│   │   │   │   ├── errorClassifier.ts
│   │   │   │   └── __tests__/
│   │   │   │       └── errorClassifier.test.ts           (NEW)
│   │   ├── data/
│   │   │   ├── repositories/
│   │   │   │   ├── MovieRepository.impl.ts
│   │   │   │   ├── __tests__/
│   │   │   │   │   ├── MovieRepository.impl.test.ts      (NEW)
│   │   │   │   │   └── UserDataRepository.impl.test.ts   (NEW)
│   │   │   ├── dataSources/
│   │   │   │   ├── MovieLocalDataSource.ts
│   │   │   │   ├── UserDataLocalDataSource.ts
│   │   │   │   └── __tests__/
│   │   │   │       ├── MovieLocalDataSource.test.ts      (NEW)
│   │   │   │       └── UserDataLocalDataSource.test.ts   (NEW)
│   │   │   ├── mappers/
│   │   │   │   ├── MovieMapper.ts
│   │   │   │   ├── __tests__/
│   │   │   │   │   ├── MovieMapper.test.ts               (NEW)
│   │   │   │   │   └── UserRatingMapper.test.ts          (NEW)
│   │   ├── di/
│   │   │   ├── container.ts
│   │   │   └── __tests__/
│   │   │       └── container.test.ts                     (NEW)
│   │   ├── infrastructure/
│   │   │   ├── logging/
│   │   │   │   ├── ErrorLogger.ts
│   │   │   │   └── __tests__/
│   │   │   │       └── ErrorLogger.test.ts               (NEW)
│   ├── context/
│   │   ├── movies/
│   │   │   ├── MoviesProvider.tsx
│   │   │   └── __tests__/
│   │   │       └── MoviesProvider.test.tsx               (NEW)
│   │   ├── filters/
│   │   │   ├── FiltersProvider.tsx
│   │   │   └── __tests__/
│   │   │       └── FiltersProvider.test.tsx              (NEW)
│   │   ├── matches/
│   │   │   ├── MatchesProvider.tsx
│   │   │   └── __tests__/
│   │   │       └── MatchesProvider.test.tsx              (NEW)
│   │   ├── ratings/
│   │   │   ├── RatingsProvider.tsx
│   │   │   └── __tests__/
│   │   │       └── RatingsProvider.test.tsx              (NEW)
│   ├── hooks/
│   │   ├── useErrorHandler.ts
│   │   ├── useMovieRatings.ts
│   │   ├── useMovieMatches.ts
│   │   ├── useFilterMovies.ts
│   │   └── __tests__/
│   │       ├── useErrorHandler.test.ts                   (NEW)
│   │       ├── useMovieRatings.test.ts                   (NEW)
│   │       ├── useMovieMatches.test.ts                   (NEW)
│   │       └── useFilterMovies.test.ts                   (NEW)
│   ├── presentation/
│   │   ├── components/
│   │   │   ├── ErrorBoundary/
│   │   │   │   ├── ErrorBoundary.tsx
│   │   │   │   └── __tests__/
│   │   │   │       └── ErrorBoundary.test.tsx            (NEW)
├── tests/
│   ├── setup.ts                                          (NEW)
│   └── utils/
│       ├── test-utils.tsx                                (NEW)
│       ├── mockData.ts                                   (NEW)
│       ├── mockRepositories.ts                           (NEW)
│       └── testProviders.tsx                             (NEW)
├── vitest.config.ts                                      (NEW)
├── package.json                                          (MODIFY)
└── tsconfig.json                                         (MODIFY)
```

---

## Configuration Files

### 1. `vitest.config.ts`

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mockData.ts',
        'src/main.tsx',
      ],
      thresholds: {
        lines: 70,
        functions: 70,
        branches: 65,
        statements: 70,
      },
    },
    include: ['**/*.test.{ts,tsx}'],
    exclude: ['node_modules', 'dist'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@core': path.resolve(__dirname, './src/core'),
      '@context': path.resolve(__dirname, './src/context'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@presentation': path.resolve(__dirname, './src/presentation'),
    },
  },
});
```

### 2. `tests/setup.ts`

```typescript
import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Extend Vitest matchers
expect.extend(matchers);

// Cleanup after each test
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  localStorage.clear();
  sessionStorage.clear();
});

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));
```

### 3. `package.json` - Add Scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "lint": "eslint .",
    "type-check": "tsc -b",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:run": "vitest run",
    "test:watch": "vitest --watch",
    "test:coverage": "vitest run --coverage",
    "test:debug": "vitest --inspect-brk --inspect --single-thread"
  },
  "devDependencies": {
    "@testing-library/react": "^16.1.0",
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/user-event": "^14.5.2",
    "@vitest/ui": "^2.1.8",
    "@vitest/coverage-v8": "^2.1.8",
    "jsdom": "^26.0.0",
    "vitest": "^2.1.8"
  }
}
```

### 4. `tsconfig.json` - Add/Update

```json
{
  "compilerOptions": {
    "types": ["vitest/globals", "@testing-library/jest-dom"]
  }
}
```

---

## Test Utilities

### `tests/utils/test-utils.tsx`

Custom render function que envuelve con providers:

```typescript
import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { AppProvider } from '@context/AppProvider';
import { BrowserRouter } from 'react-router-dom';

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  withRouter?: boolean;
}

export function renderWithProviders(
  ui: ReactElement,
  options: CustomRenderOptions = {}
) {
  const { withRouter = true, ...renderOptions } = options;

  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    const content = <AppProvider>{children}</AppProvider>;
    return withRouter ? <BrowserRouter>{content}</BrowserRouter> : content;
  };

  return {
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
}

export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
```

### `tests/utils/mockData.ts`

Datos de prueba compartidos:

```typescript
import type { Movie } from '@core/domain/entities/Movie.entity';
import type { UserRating } from '@core/domain/entities/UserRating.entity';

export const mockMovie: Movie = {
  id: 1,
  title: 'Inception',
  year: 2010,
  genres: ['Action', 'Sci-Fi'],
  duration: 148,
  rating: 8.8,
  overview: 'A thief who steals corporate secrets...',
  director: 'Christopher Nolan',
  cast: ['Leonardo DiCaprio'],
  poster: '/poster.jpg',
};

export const mockMovies: Movie[] = [mockMovie, /* más movies */];

export const mockUserRating: UserRating = {
  movieId: 1,
  rating: 5,
  comment: 'Amazing!',
  timestamp: new Date(),
};
```

### `tests/utils/mockRepositories.ts`

Mock implementations de repositorios:

```typescript
import { vi } from 'vitest';
import type { IMovieRepository } from '@core/domain/repositories/MovieRepository.interface';
import { mockMovies } from './mockData';

export const createMockMovieRepository = (): IMovieRepository => ({
  getAll: vi.fn().mockResolvedValue(mockMovies),
  getById: vi.fn().mockResolvedValue(mockMovies[0]),
  search: vi.fn().mockResolvedValue(mockMovies),
});
```

---

## Testing Strategy

### Priority Levels

#### PHASE 1 - HIGH PRIORITY (Test First)
```
1. Domain Layer - UseCases
   ├── FilterMovies.useCase.test.ts
   ├── AddMovieMatch.useCase.test.ts
   └── RateMovie.useCase.test.ts

2. Data Layer - DataSources
   ├── MovieLocalDataSource.test.ts
   └── UserDataLocalDataSource.test.ts

3. Services
   ├── ErrorClassifier.test.ts
   └── ErrorLogger.test.ts

4. DI Container
   └── container.test.ts

Target: ~40-50 tests, ~20-30% coverage
```

#### PHASE 2 - MEDIUM PRIORITY (Test Second)
```
5. Data Layer - Repositories
   ├── MovieRepository.impl.test.ts
   └── UserDataRepository.impl.test.ts

6. Data Layer - Mappers
   ├── MovieMapper.test.ts
   └── UserRatingMapper.test.ts

7. Custom Hooks
   ├── useErrorHandler.test.ts
   ├── useMovieRatings.test.ts
   ├── useMovieMatches.test.ts
   └── useFilterMovies.test.ts

Target: ~30-40 tests, ~30-40% coverage
```

#### PHASE 3 - LOW PRIORITY (Test Third)
```
8. Context Providers
   ├── MoviesProvider.test.tsx
   ├── FiltersProvider.test.tsx
   ├── MatchesProvider.test.tsx
   └── RatingsProvider.test.tsx

9. Components
   └── ErrorBoundary.test.tsx

Target: ~20-30 tests, ~10-20% coverage
Total Coverage: ~70%
```

### Testing Pyramid

```
          ╱╲
         ╱  ╲       E2E Tests (10-15%)
        ╱____╲      - Critical user flows
       ╱      ╲     - Manual for now
      ╱        ╲
     ╱          ╲   Integration Tests (20-25%)
    ╱____________╲  - Contexts + Hooks + Services
   ╱              ╲
  ╱                ╲ Unit Tests (60-70%)
 ╱__________________╲ - UseCases, DataSources, Utils
```

---

## Test Categories

### 1. Unit Tests (Domain Layer)

**Qué testar:**
- UseCases: Lógica de negocio pura
- Services: Clasificación de errores
- Utilities: Helpers puros

**Ejemplo: FilterMovies.useCase.test.ts**
```typescript
describe('FilterMoviesUseCase', () => {
  it('should filter movies by genre', async () => {
    const movies = await useCase.execute({ genres: ['Action'] });
    expect(movies).toHaveLength(1);
    expect(movies[0].genres).toContain('Action');
  });
});
```

### 2. Integration Tests (Data Layer)

**Qué testar:**
- DataSources: localStorage interactions
- Repositories: Combination of data sources
- Mappers: DTO ↔ Entity conversions

**Ejemplo: UserDataLocalDataSource.test.ts**
```typescript
describe('UserDataLocalDataSource', () => {
  it('should save and load matches', async () => {
    await dataSource.saveMatches(mockMatches);
    const loaded = await dataSource.loadMatches();
    expect(loaded).toEqual(mockMatches);
  });
});
```

### 3. Component Tests (Presentation Layer)

**Qué testar:**
- Hooks: State management
- Providers: Context functionality
- Components: Rendering + interactions

**Ejemplo: MoviesProvider.test.tsx**
```typescript
describe('MoviesProvider', () => {
  it('should provide movies context', () => {
    const { result } = renderHook(() => useMoviesContext(), {
      wrapper: MoviesProvider,
    });
    expect(result.current.movies).toBeDefined();
  });
});
```

---

## Implementation Phases

### Week 1: Setup & Configuration
- [ ] Install dependencies
- [ ] Create vitest.config.ts
- [ ] Create tests/setup.ts
- [ ] Create test utilities
- [ ] Update package.json

**Deliverable:** Proyecto listo para escribir tests

### Week 2: Domain Layer Tests
- [ ] FilterMovies.useCase.test.ts
- [ ] AddMovieMatch.useCase.test.ts
- [ ] RateMovie.useCase.test.ts
- [ ] errorClassifier.test.ts
- [ ] ErrorLogger.test.ts

**Deliverable:** 15-20 tests, core business logic validated

### Week 3: Data Layer Tests
- [ ] MovieLocalDataSource.test.ts
- [ ] UserDataLocalDataSource.test.ts
- [ ] MovieRepository.impl.test.ts
- [ ] UserDataRepository.impl.test.ts
- [ ] Mappers tests

**Deliverable:** 20-25 tests, data layer validated

### Week 4: Hooks & Contexts
- [ ] useErrorHandler.test.ts
- [ ] Custom hooks tests
- [ ] Provider tests
- [ ] Coverage reporting

**Deliverable:** ~70% coverage, ci-ready

---

## Commands

```bash
# Run all tests
bun run test

# Run tests in watch mode
bun run test:watch

# Run tests with UI
bun run test:ui

# Run single test file
bun run test -- src/core/domain/useCases/__tests__/FilterMovies.useCase.test.ts

# Run tests matching pattern
bun run test -- --grep "FilterMovies"

# Generate coverage report
bun run test:coverage

# Debug tests
bun run test:debug
```

---

## Coverage Targets

### By Layer

| Layer | Target | Priority |
|-------|--------|----------|
| Domain - UseCases | 90% | HIGH |
| Domain - Services | 85% | HIGH |
| Domain - Entities | 100% | HIGH |
| Data - DataSources | 80% | HIGH |
| Data - Repositories | 75% | MEDIUM |
| Data - Mappers | 80% | MEDIUM |
| Presentation - Hooks | 70% | MEDIUM |
| Presentation - Providers | 60% | LOW |
| Presentation - Components | 50% | LOW |

### Overall Target

```
Line Coverage:      70%
Function Coverage:  70%
Branch Coverage:    65%
Statement Coverage: 70%
```

---

## CI/CD Integration

### GitHub Actions (Optional)

**`.github/workflows/test.yml`**

```yaml
name: Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v1

      - name: Install dependencies
        run: bun install

      - name: Type check
        run: bun run type-check

      - name: Lint
        run: bun run lint

      - name: Run tests
        run: bun run test:coverage

      - name: Upload coverage
        uses: codecov/codecov-action@v4
```

---

## Troubleshooting

### Common Issues

#### Issue: "Cannot find module" in tests
**Solution:** Asegúrate que `vitest.config.ts` tiene los alias correctos

#### Issue: localStorage errors in tests
**Solution:** El setup.ts limpia localStorage después de cada test

#### Issue: Tests are slow
**Solution:** Usa `vitest --ui` para debuggear, considera mocking de APIs

#### Issue: Context provider errors
**Solution:** Usa `renderWithProviders` de test-utils.tsx

---

## Best Practices

### ✅ Do

```typescript
// ✅ Descriptive test names
it('should filter movies by genre when genres filter is applied', () => {});

// ✅ Arrange-Act-Assert pattern
it('should add movie to matches', () => {
  // Arrange
  const movie = mockMovie;

  // Act
  addMatch(movie);

  // Assert
  expect(matches).toContain(movie);
});

// ✅ Test behavior, not implementation
it('should return filtered movies', async () => {
  const result = await useCase.execute(filter);
  expect(result).toEqual(expectedMovies);
});

// ✅ Use test utilities
const { getByText } = renderWithProviders(<Component />);

// ✅ Mock external dependencies
const mockRepository = createMockMovieRepository();
```

### ❌ Don't

```typescript
// ❌ Vague test names
it('works', () => {});

// ❌ Test implementation details
it('should call filter function', () => {
  expect(filterFn).toHaveBeenCalled();
});

// ❌ Test multiple things
it('should filter and sort movies', () => {});

// ❌ Hardcoded values everywhere
expect(result[0].title).toBe('Inception');

// ❌ Skip tests
it.skip('should do something', () => {});
```

---

## Success Criteria

### Phase 9 is Complete When:

- ✅ Vitest configurado y funcionando
- ✅ Test utilities creadas y documentadas
- ✅ Mock data y repositorios compartidos
- ✅ 50+ tests implementados
- ✅ 70%+ coverage en Domain layer
- ✅ 50%+ coverage en Data layer
- ✅ 30%+ coverage en Presentation layer
- ✅ CI/CD workflow listo (opcional)
- ✅ Documentación completa

### Verification

```bash
# All tests pass
bun run test:run

# Coverage targets met
bun run test:coverage
# Look for: Lines 70%, Functions 70%, Branches 65%, Statements 70%

# TypeScript still clean
bun run type-check

# Linting clean
bun run lint
```

---

## Next Steps (Phase 10+)

Con testing implementado, puedes:

### Phase 10A - Data Persistence
- IndexedDB para offline-first
- Sync strategies
- **PROTEGIDO CON TESTS**

### Phase 10B - Performance
- Code splitting
- Lazy loading
- **MEDIDO CON TESTS**

### Phase 11 - Advanced Features
- Recomendaciones AI
- Social features
- **VALIDADO CON TESTS**

---

## Resources

### Documentation
- [Vitest Docs](https://vitest.dev)
- [Testing Library React](https://testing-library.com/react)
- [Jest DOM Matchers](https://github.com/testing-library/jest-dom)

### Examples
- `tests/utils/test-utils.tsx` - Testing utilities
- `tests/utils/mockData.ts` - Shared test data
- `src/core/domain/useCases/__tests__/*` - Domain tests
- `src/core/data/dataSources/__tests__/*` - Integration tests

### Tools
- `bun run test:ui` - Visual test runner
- `bun run test:debug` - Debug mode
- `bun run test:coverage` - Coverage reports

---

## Conclusion

**Phase 9: Testing Infrastructure** es la inversión más importante que puedes hacer en tu proyecto en este momento.

No es una feature visible, pero:
- ✅ Protege tu arquitectura
- ✅ Permite desarrollo seguro
- ✅ Documenta cómo funciona el código
- ✅ Habilita refactoring sin miedo
- ✅ Acelera desarrollo a largo plazo

**Tu proyecto está listo. Ahora necesitas tests para mantenerlo así mientras crece.**

