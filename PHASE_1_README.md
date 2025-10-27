# 🎯 FASE 1: COMPLETADA - Guía de Referencia Rápida

## En Este Documento

Este documento es tu referencia rápida para entender qué se hizo en FASE 1 y cómo usar los nuevos componentes.

---

## 📦 8 Componentes UI Nuevos - Strategy Pattern

Cada componente está en su carpeta con 3 archivos:

```
presentation/components/ui/ComponentName/
├── ComponentName.tsx              # El componente
├── ComponentName.types.ts         # Props & types
└── componentNameStrategies.ts     # Estilos Tailwind
```

### 1. Button
**Para:** Todas tus acciones principales
```tsx
import { Button } from '@/presentation/components/ui';

<Button variant="primary" size="md" onClick={action}>
  Click me
</Button>

// Variantes: primary | secondary | danger | ghost
// Tamaños: sm | md | lg
// Props adicionales: isLoading, disabled
```

### 2. Card
**Para:** Contenedores y secciones
```tsx
import { Card } from '@/presentation/components/ui';

<Card variant="elevated" padding="lg">
  Content here
</Card>

// Variantes: default | elevated | outlined
// Padding: sm | md | lg
```

### 3. Input
**Para:** Formularios y búsquedas
```tsx
import { Input } from '@/presentation/components/ui';

<Input
  label="Email"
  type="email"
  error={hasError}
  helperText="Invalid email"
  placeholder="user@example.com"
/>

// Variantes: default | filled | underlined
// Tamaños: sm | md | lg
```

### 4. Modal
**Para:** Diálogos y confirmaciones
```tsx
import { Modal } from '@/presentation/components/ui';

<Modal
  isOpen={isOpen}
  onClose={handleClose}
  title="Confirm Action"
  size="md"
  closeOnBackdropClick={true}
>
  Modal content
</Modal>

// Tamaños: sm | md | lg
```

### 5. Backdrop
**Para:** Fondos oscuros detrás de modales
```tsx
import { Backdrop } from '@/presentation/components/ui';

<Backdrop onClick={handleClose} zIndex={40} blur={true} />
```

### 6. Badge
**Para:** Etiquetas y chips
```tsx
import { Badge } from '@/presentation/components/ui';

<Badge variant="success" size="md">
  Confirmed
</Badge>

// Variantes: default | success | warning | error | info
// Tamaños: sm | md | lg
```

### 7. RatingStars
**Para:** Calificaciones
```tsx
import { RatingStars } from '@/presentation/components/ui';

<RatingStars
  rating={4}
  onChange={setRating}
  readOnly={false}
  size="md"
  count={5}
/>

// Tamaños: sm | md | lg
// readOnly: boolean - Modo solo lectura
```

### 8. IconButton
**Para:** Botones con iconos
```tsx
import { IconButton } from '@/presentation/components/ui';
import { Heart } from 'lucide-react';

<IconButton
  icon={<Heart />}
  variant="filled"
  size="md"
  onClick={handleLike}
/>

// Variantes: default | filled | outlined
// Tamaños: sm | md | lg
```

---

## 🛠️ Utilidades Disponibles

### Validadores - `@/shared/utils`
```typescript
import {
  isValidEmail,
  isValidPassword,
  isValidRating,
  isValidYear,
  isValidYearRange,
  isValidMovieFilter,
  isValidComment,
  isNotEmpty
} from '@/shared/utils';

if (isValidEmail(email)) { /* ... */ }
if (isValidRating(4)) { /* ... */ }
```

### Formateadores - `@/shared/utils`
```typescript
import {
  formatRating,        // 4.5
  formatMovieYear,     // "2023"
  formatDuration,      // "2h 30m"
  formatGenres,        // "Action, Sci-Fi"
  formatCast,          // "Actor1, Actor2"
  truncateText,        // "Lorem ipsum..."
  capitalizeFirst,     // "Hello"
  formatDate           // "25 de octubre de 2024"
} from '@/shared/utils';

formatRating(4.5)        // "4.5"
formatDuration("150")    // "2h 30m"
```

### Merge Classes - `@/shared/utils`
```typescript
import { mergeClassNames, conditionalClass } from '@/shared/utils';

const className = mergeClassNames(
  'p-4',
  condition && 'bg-red-500',
  customClass
);

const className2 = conditionalClass(
  isActive,
  'bg-blue-500',
  'bg-gray-500'
);
```

---

## 📋 Constantes Disponibles

### Géneros - `@/shared/constants`
```typescript
import { ALL_GENRES, GENRE_LABELS } from '@/shared/constants';

// ALL_GENRES = ['Action', 'Adventure', 'Crime', ...]
// GENRE_LABELS = { Action: 'Acción', Adventure: 'Aventura', ... }
```

### Filtros Por Defecto - `@/shared/constants`
```typescript
import {
  DEFAULT_FILTER_CRITERIA,
  DEFAULT_YEAR_RANGE,
  YEAR_RANGE_MIN,
  YEAR_RANGE_MAX,
  RATING_MIN,
  RATING_MAX
} from '@/shared/constants';

// DEFAULT_FILTER_CRITERIA = { search: '', genres: [], yearRange: [1970, 2025], minRating: 0 }
```

---

## 🎨 Sistema de Tipos

Todos los tipos están centralizados en `@/shared/types`:

```typescript
import {
  ButtonProps,
  CardProps,
  InputProps,
  ModalProps,
  BackdropProps,
  BadgeProps,
  RatingStarsProps,
  IconButtonProps,
  MovieGenre,
  IMovie,
  IUserRating,
  MovieFilterCriteria
} from '@/shared/types';
```

---

## 📂 Estructura Completa

```
src/
├── core/                    ← Próxima en Fase 2
│   ├── domain/
│   ├── data/
│   └── di/
│
├── presentation/
│   ├── components/
│   │   ├── ui/             ✅ Completo (8 componentes)
│   │   ├── feature/        ← Próximo en Fase 6
│   │   └── layout/
│   ├── context/            ← Próximo en Fase 7
│   ├── hooks/              ← Próximo en Fase 5
│   ├── pages/              ✅ Ya existen
│   └── viewModels/
│
└── shared/
    ├── types/              ✅ Completo
    ├── constants/          ✅ Completo
    ├── utils/              ✅ Completo
    └── config/
```

---

## 💡 Ejemplos Prácticos

### Ejemplo 1: Form Login
```tsx
import { Button, Input, Card } from '@/presentation/components/ui';
import { isValidEmail } from '@/shared/utils';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState(false);

  const handleSubmit = () => {
    if (!isValidEmail(email)) {
      setEmailError(true);
      return;
    }
    // Handle login
  };

  return (
    <Card variant="elevated" padding="lg" className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6">Login</h2>

      <Input
        label="Email"
        type="email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          setEmailError(false);
        }}
        error={emailError}
        helperText={emailError ? "Invalid email" : ""}
        placeholder="user@example.com"
      />

      <Input
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="••••••••"
        className="mt-4"
      />

      <Button
        variant="primary"
        size="lg"
        className="w-full mt-6"
        onClick={handleSubmit}
      >
        Sign In
      </Button>
    </Card>
  );
}
```

### Ejemplo 2: Movie Rating Dialog
```tsx
import { Modal, RatingStars, Button, Input } from '@/presentation/components/ui';

export function RatingDialog({ isOpen, onClose, movieTitle }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    if (rating === 0) return;
    // Submit rating
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Rate "${movieTitle}"`}
      size="md"
    >
      <div className="space-y-6">
        <div>
          <p className="text-sm text-gray-400 mb-4">How would you rate this?</p>
          <RatingStars
            rating={rating}
            onChange={setRating}
            size="lg"
            count={5}
          />
        </div>

        <Input
          label="Comment (optional)"
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your thoughts..."
        />

        <div className="flex gap-3">
          <Button variant="ghost" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={rating === 0}
            className="flex-1"
          >
            Submit
          </Button>
        </div>
      </div>
    </Modal>
  );
}
```

### Ejemplo 3: Genre Filter
```tsx
import { Badge, Button } from '@/presentation/components/ui';
import { ALL_GENRES } from '@/shared/constants';

export function GenreFilter({ selectedGenres, onGenreChange }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Genres</h3>

      <div className="flex flex-wrap gap-2">
        {ALL_GENRES.map((genre) => (
          <Badge
            key={genre}
            variant={selectedGenres.includes(genre) ? 'success' : 'default'}
            size="md"
            onClick={() => onGenreChange(genre)}
            className="cursor-pointer"
          >
            {genre}
          </Badge>
        ))}
      </div>

      <Button
        variant="ghost"
        onClick={() => onGenreChange(null)} // Clear all
      >
        Clear Filters
      </Button>
    </div>
  );
}
```

---

## 🚀 Próxima Fase

**FASE 2:** Crear la capa de dominio
- Entidades (Movie, UserRating, MovieFilter)
- Interfaces de repositorio
- Use cases
- Servicios

Estimado: **1-2 días**

---

## ✅ Checklist Antes de Fase 2

- [x] Estructura de carpetas creada
- [x] 8 componentes UI funcionales
- [x] Tipos centralizados
- [x] Utilidades y validadores
- [x] Constantes globales
- [x] Sin breaking changes
- [x] Todo tipado y documentado

**¡Estamos listos para continuar!** 🚀

---

## 📞 Referencia Rápida de Imports

```typescript
// UI Components
import { Button, Card, Input, Modal, Backdrop, Badge, RatingStars, IconButton }
  from '@/presentation/components/ui';

// Types
import type { ButtonProps, CardProps, InputProps, ModalProps, /* ... */ }
  from '@/shared/types';

// Utils
import { formatRating, isValidEmail, mergeClassNames, /* ... */ }
  from '@/shared/utils';

// Constants
import { ALL_GENRES, DEFAULT_FILTER_CRITERIA, GENRE_LABELS, /* ... */ }
  from '@/shared/constants';
```

---

**Estado:** ✅ COMPLETADO
**Próximo:** FASE 2 - Capa de Dominio
**Tiempo total Fase 1:** ~4-6 horas
