# ErrorBoundary Usage Guide

**Film-Match** implementa un sistema robusto de manejo de errores usando **ErrorBoundary**, **ErrorClassifier**, y **ErrorLogger** siguiendo principios de Clean Architecture.

## Tabla de Contenidos

1. [Conceptos Básicos](#conceptos-básicos)
2. [Componentes del Sistema](#componentes-del-sistema)
3. [Cómo Funciona](#cómo-funciona)
4. [Uso en Componentes](#uso-en-componentes)
5. [Testing Manual](#testing-manual)
6. [Mejores Prácticas](#mejores-prácticas)
7. [Troubleshooting](#troubleshooting)

---

## Conceptos Básicos

El ErrorBoundary es un **componente React de clase** que captura errores ocurridos en cualquier parte del árbol de componentes durante el renderizado.

**¿Por qué es necesario?**
- React no captura errores por defecto en los lifecycle methods
- Sin ErrorBoundary, un error cuelga toda la aplicación
- ErrorBoundary proporciona una fallback UI amigable

---

## Componentes del Sistema

### 1. ErrorBoundary (Clase)
**Ubicación:** `src/presentation/components/ErrorBoundary.tsx`

Componente encargado de:
- Capturar errores de renderizado
- Clasificar errores usando ErrorClassifier
- Loguear errores usando ErrorLogger
- Mostrar fallback UI

```tsx
<ErrorBoundary context={{ component: 'App', source: 'root' }}>
  <YourApp />
</ErrorBoundary>
```

### 2. ErrorFallback (Funcional)
**Ubicación:** `src/presentation/components/ErrorFallback.tsx`

Componente encargado de:
- Mostrar UI de error al usuario
- Proporcionar información relevante del error
- Permitir retry si es posible
- Adaptar mensaje según severidad

### 3. ErrorClassifier (Servicio)
**Ubicación:** `src/core/domain/services/errorClassifier.ts`

Servicio encargado de:
- Analizar tipo de error
- Determinar severidad y categoría
- Decidir si notificar al usuario
- Decidir si es retryable

### 4. ErrorLogger (Servicio)
**Ubicación:** `src/core/infrastructure/logging/ErrorLogger.ts`

Servicio encargado de:
- Loguear errores en consola
- Mantener buffer de logs
- Exportar logs para debugging
- Filtrar logs por nivel/categoría

---

## Cómo Funciona

### Flujo de Captura de Error

```
┌─────────────────────────────────────┐
│ Error ocurre en árbol React         │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│ ErrorBoundary.componentDidCatch()   │ ◄── Captura el error
│ ErrorBoundary.getDerivedStateFromError()
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│ ErrorClassifier.classify(error)     │ ◄── Analiza el error
│ Determina: categoria, severidad,    │
│ shouldNotify, retryable, etc.       │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│ ErrorLogger.logClassifiedError()    │ ◄── Registra en logs
│ Envía a console.error() o console.warn()
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│ ErrorBoundary.render()              │ ◄── Renderiza fallback
│ Muestra ErrorFallback component     │
└─────────────────────────────────────┘
```

### Diagrama de Decisiones

```
Error ocurre
    │
    ├─→ ¿Es CustomError?
    │   ├─ SÍ → Clasificar por tipo (ValidationError, NetworkError, etc.)
    │   └─ NO → Clasificar como error estándar de JS
    │
    ├─→ Determinar severidad (DEBUG, INFO, WARNING, ERROR, FATAL)
    │
    ├─→ Determinar si notificar al usuario (shouldNotify)
    │
    ├─→ Determinar si es retryable
    │   ├─ SÍ (NetworkError, DataPersistenceError) → Mostrar botón Retry
    │   └─ NO → Solo mostrar error
    │
    └─→ Loguear con contexto (component, userId, movieId, etc.)
```

---

## Uso en Componentes

### Caso 1: Wrap Toda la Aplicación (Recomendado)

**Ubicación:** `src/App.tsx`

```tsx
import { ErrorBoundary } from '@/presentation/components';

function App() {
  return (
    <ErrorBoundary context={{ component: 'App', source: 'root' }}>
      <AppProvider>
        <Router>
          <Routes>
            {/* routes */}
          </Routes>
        </Router>
      </AppProvider>
    </ErrorBoundary>
  );
}
```

**Ventaja:** Captura cualquier error en la aplicación
**Desventaja:** Menos granular (error en una página afecta toda la app)

---

### Caso 2: ErrorBoundary por Ruta

```tsx
// En App.tsx
<Routes>
  <Route
    path="/home"
    element={
      <ErrorBoundary context={{ component: 'Home', source: 'route' }}>
        <Home />
      </ErrorBoundary>
    }
  />
  <Route
    path="/movie/:id"
    element={
      <ErrorBoundary context={{ component: 'MovieDetails', source: 'route' }}>
        <MovieDetailsPage />
      </ErrorBoundary>
    }
  />
</Routes>
```

**Ventaja:** Aislamiento por ruta (error en una página no afecta otras)
**Desventaja:** Más verboso

---

### Caso 3: ErrorBoundary por Sección

```tsx
// En Home.tsx
import { ErrorBoundary } from '@/presentation/components';

export function Home() {
  return (
    <div className="space-y-4">
      <ErrorBoundary context={{ component: 'FiltersSidebar' }}>
        <FiltersSidebar />
      </ErrorBoundary>

      <ErrorBoundary context={{ component: 'MovieCard' }}>
        <MovieCard />
      </ErrorBoundary>

      <ErrorBoundary context={{ component: 'Chatbot' }}>
        <Chatbot />
      </ErrorBoundary>
    </div>
  );
}
```

**Ventaja:** Control muy granular
**Desventaja:** Muy verboso, puede ser excesivo

---

### Caso 4: Uso Recomendado (Estrategia Mixta)

**Nivel 1: Root (App.tsx)**
```tsx
<ErrorBoundary context={{ source: 'root' }}>
  <AppProvider>
    <Router>{routes}</Router>
  </AppProvider>
</ErrorBoundary>
```

**Nivel 2: Por Ruta (si hay muchas rutas críticas)**
```tsx
<Route
  path="/movie/:id"
  element={
    <ErrorBoundary context={{ component: 'MovieDetails' }}>
      <MovieDetailsPage />
    </ErrorBoundary>
  }
/>
```

**Nivel 3: Por Sección (solo para partes críticas)**
```tsx
<ErrorBoundary context={{ component: 'Chatbot' }}>
  <Chatbot />
</ErrorBoundary>
```

---

## Manejo de Errores en Componentes

### Para Errores Síncronos

```tsx
import { ValidationError } from '@core';

function MyComponent() {
  const handleSubmit = (data: any) => {
    if (!data.title) {
      throw new ValidationError('Title is required');
    }
    // Continúa...
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

### Para Errores Asíncronos (NO son capturados por ErrorBoundary)

```tsx
import { useErrorHandler } from '@/hooks';
import { useEffect } from 'react';

function MyComponent() {
  const { handleAsyncError } = useErrorHandler();

  useEffect(() => {
    const loadData = async () => {
      const result = await handleAsyncError(
        fetchData(),
        { component: 'MyComponent', action: 'loadData' }
      );
      if (result) {
        // Procesra resultado
      }
    };

    loadData();
  }, [handleAsyncError]);

  return <div>...</div>;
}
```

**IMPORTANTE:** ErrorBoundary solo captura errores de **renderizado**. Para errores en event handlers y async operations, usa `useErrorHandler`.

---

## Testing Manual

### Opción 1: Usar ErrorTest Component (Recomendado)

1. Agrega a cualquier página:
```tsx
import { ErrorTest } from '@/presentation/components';

function Home() {
  return (
    <>
      {/* Tu contenido */}
      {import.meta.env.DEV && <ErrorTest />}
    </>
  );
}
```

2. Abre http://localhost:5173/home
3. Verás un panel en la esquina inferior derecha con botones para disparar errores
4. Haz clic en cualquier botón para testear

### Opción 2: Console Commands

Abre DevTools (F12) y ejecuta:
```javascript
throw new Error('Test error');
```

### Opción 3: Agregar Botón Temporal

```tsx
function MyComponent() {
  const handleTest = () => {
    throw new Error('Test render error');
  };

  return (
    <div>
      {import.meta.env.DEV && (
        <button onClick={handleTest}>Test Error</button>
      )}
    </div>
  );
}
```

### Qué Observar

1. **UI de Error:** Debería aparecer ErrorFallback con el mensaje
2. **Consola:** Verás logs con detalles del error
3. **Botón Retry:** Si el error es retryable, debería haber un botón "Try Again"
4. **DevTools:** Abre la pestaña Console para ver los logs detallados

---

## Mejores Prácticas

### ✅ Hacer

| Práctica | Razón |
|----------|-------|
| Usar ErrorBoundary al nivel root | Captura errores no previstos globalmente |
| Proporcionar contexto significativo | `{ component: 'MovieCard', movieId: 123 }` |
| Usar errorLogger para debugging | Mantiene historial de errores |
| Validar inputs antes de procesar | Previene errores innecesarios |
| Usar try/catch para async | ErrorBoundary no captura errores async |
| Testear escenarios de error | Asegura buena UX en errores |
| Usar tipos CustomError | Facilita clasificación y manejo |

### ❌ No Hacer

| Práctica | Razón |
|----------|-------|
| Envolver cada componente | Demasiado granular, afecta performance |
| Ignorar logs de error | Dificulta debugging |
| Ocultar errores al usuario | Mala experiencia de usuario |
| Usar ErrorBoundary para validation | Usa try/catch o validación previa |
| Enviar ErrorTest a producción | Solo para desarrollo |
| No proporcionar contexto | Difícil debuggear errores |

---

## Ejemplos Reales

### Ejemplo 1: MovieCard con Validación

```tsx
import { ValidationError } from '@core';
import { useErrorHandler } from '@/hooks';

interface MovieCardProps {
  movie: Movie;
  onSwipe: (direction: 'left' | 'right') => void;
}

function MovieCard({ movie, onSwipe }: MovieCardProps) {
  const { handleError } = useErrorHandler();

  const handleMovieSwipe = (direction: 'left' | 'right') => {
    try {
      if (!movie || !movie.id) {
        throw new ValidationError('Invalid movie data');
      }
      onSwipe(direction);
    } catch (error) {
      handleError(error as Error, {
        component: 'MovieCard',
        movieId: movie.id,
        action: 'swipe',
        direction,
      });
    }
  };

  return (
    <div onClick={() => handleMovieSwipe('right')}>
      {movie.title}
    </div>
  );
}
```

### Ejemplo 2: Home con Múltiples Boundaries

```tsx
import { ErrorBoundary } from '@/presentation/components';
import { useErrorHandler } from '@/hooks';

function Home() {
  const { handleAsyncError } = useErrorHandler();

  return (
    <div className="flex gap-4">
      {/* Sección de Filtros */}
      <ErrorBoundary context={{ component: 'FiltersSection' }}>
        <FiltersSidebar />
      </ErrorBoundary>

      {/* Sección de Películas */}
      <ErrorBoundary context={{ component: 'MoviesSection' }}>
        <MovieListContainer />
      </ErrorBoundary>

      {/* Sección de Chat (Crítica) */}
      <ErrorBoundary context={{ component: 'ChatSection' }}>
        <Chatbot />
      </ErrorBoundary>
    </div>
  );
}

export default Home;
```

### Ejemplo 3: Fetch de Datos con Manejo de Errores

```tsx
import { useErrorHandler } from '@/hooks';
import { useEffect, useState } from 'react';
import { NetworkError } from '@core';

function MovieDetailsPage({ movieId }: { movieId: number }) {
  const { handleAsyncError } = useErrorHandler();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMovie = async () => {
      setLoading(true);

      const result = await handleAsyncError(
        fetch(`/api/movies/${movieId}`).then(r => {
          if (!r.ok) throw new NetworkError('Failed to fetch movie', r.status);
          return r.json();
        }),
        {
          component: 'MovieDetailsPage',
          movieId,
          action: 'loadMovie',
        }
      );

      if (result) {
        setMovie(result);
      }

      setLoading(false);
    };

    loadMovie();
  }, [movieId, handleAsyncError]);

  if (loading) return <div>Loading...</div>;
  if (!movie) return <div>Movie not found</div>;

  return <div>{movie.title}</div>;
}
```

---

## API Reference

### ErrorBoundary Props

```tsx
interface ErrorBoundaryProps {
  children: React.ReactNode;
  context?: ErrorContext;
  fallback?: (error: ClassifiedError, reset: () => void) => React.ReactNode;
}
```

| Prop | Tipo | Descripción |
|------|------|-------------|
| `children` | `ReactNode` | Componentes a proteger |
| `context?` | `ErrorContext` | Contexto adicional (component, userId, etc.) |
| `fallback?` | `Function` | Custom fallback UI (opcional) |

### ErrorFallback Props

```tsx
interface ErrorFallbackProps {
  error: ClassifiedError;
  resetError: () => void;
  size?: 'small' | 'medium' | 'large' | 'fullscreen';
  actions?: ErrorAction[];
}
```

### ErrorContext

```tsx
interface ErrorContext {
  userId?: string;
  movieId?: number;
  component?: string;
  action?: string;
  source?: string;
  line?: number;
  column?: number;
  type?: string;
  [key: string]: unknown;
}
```

### useErrorHandler Hook

```tsx
const { handleError, handleAsyncError, clearErrors } = useErrorHandler();

// Uso
handleError(error, { component: 'MyComponent', action: 'doSomething' });

const result = await handleAsyncError(
  promise,
  { component: 'MyComponent', movieId: 123 }
);
```

---

## Troubleshooting

### Problema: Error no es capturado por ErrorBoundary

**Solución:**
```tsx
// ❌ NO es capturado (async)
function MyComponent() {
  const handleClick = async () => {
    await fetch('/api/data'); // Error aquí no es capturado
  };
  return <button onClick={handleClick}>Load</button>;
}

// ✅ Es capturado
function MyComponent() {
  const { handleAsyncError } = useErrorHandler();
  const handleClick = async () => {
    await handleAsyncError(fetch('/api/data'));
  };
  return <button onClick={handleClick}>Load</button>;
}
```

### Problema: ErrorBoundary muestra error que debería ser manejado

**Solución:** Valida antes de que llegue al renderizado:
```tsx
// ❌ Mal
function MyComponent() {
  if (!data) { // Esto renderiza undefined, causa error
    throw new Error('No data');
  }
  return <div>{data.title}</div>;
}

// ✅ Bien
function MyComponent() {
  if (!data) {
    return <div>No data available</div>; // Renderiza algo válido
  }
  return <div>{data.title}</div>;
}
```

### Problema: No veo logs en la consola

**Solución:**
1. Abre DevTools (F12)
2. Vete a la pestaña "Console"
3. Filtra por `[` para ver logs estructurados
4. Verifica que no tengas filters activos

---

## Resumen Rápido

| Escenario | Solución |
|-----------|----------|
| Capturar errores de render | ErrorBoundary |
| Manejar errores en event handlers | useErrorHandler |
| Manejar errores async/await | useErrorHandler + handleAsyncError |
| Registrar errores en logs | errorLogger.logClassifiedError() |
| Testear manualmente | ErrorTest component |
| Agregar contexto a error | Pasar 2do parámetro a handleError |

---

## Recursos

- 📄 PHASE-8-ERROR-BOUNDARY.md - Documentación técnica detallada
- 📄 src/presentation/components/README.md - Guía de componentes
- 🧪 ErrorTest component - Para testing manual
- 💻 DevTools Console - Para ver logs en tiempo real

