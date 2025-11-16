# Film-Match Backend Development Phases

Documentación integral del plan de desarrollo del backend en 4 fases, más Fase 0 de setup inicial.

**Estimado total: 18-25 días de desarrollo**

---

## TABLA DE CONTENIDOS

1. [Fase 0: Setup Inicial](#fase-0-setup-inicial)
2. [Fase 1: Base de Datos Relacional](#fase-1-base-de-datos-relacional)
3. [Fase 2: Backend Core (API RESTful)](#fase-2-backend-core-api-restful)
4. [Fase 3: Integración de IA (RAG)](#fase-3-integración-de-ia-rag)
5. [Fase 4: Despliegue y Configuración](#fase-4-despliegue-y-configuración)
6. [Decisiones Arquitectónicas](#decisiones-arquitectónicas)
7. [Stack Tecnológico](#stack-tecnológico)
8. [Checklist de Implementación](#checklist-de-implementación)

---

## FASE 0: Setup Inicial

**Duración estimada: 1-2 días**

### Objetivo
Configurar la estructura base del proyecto, TypeScript, herramientas de desarrollo y conexión inicial a Prisma.

### Tareas

#### 0.1 Configurar Estructura de Monorepo
```
film-match/
├── frontend/                 # React app existente
├── backend/
│   ├── src/
│   │   ├── config/          # Env vars, DB config
│   │   ├── modules/         # Features (auth, movies, users, chat)
│   │   ├── shared/          # Middleware, types, utils
│   │   ├── lib/             # Prisma singleton, external services
│   │   └── index.ts         # App entry
│   ├── api/                 # Vercel Serverless Functions
│   ├── prisma/
│   │   └── schema.prisma    # Schema ORM
│   ├── scripts/
│   │   ├── seed.ts          # Seed initial data
│   │   └── index-vectors.ts # Index embeddings to Pinecone
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   └── README.md
├── .env.local               # Local env vars
└── package.json             # Root workspace
```

#### 0.2 Inicializar package.json y Dependencias

**Instalación de dependencias:**
```bash
cd backend
npm install express @prisma/client bcryptjs jsonwebtoken zod dotenv cors
npm install -D typescript @types/express @types/node @types/bcryptjs @types/jsonwebtoken prisma tsx nodemon
```

**Dependencias de Fase 3 (agregar después):**
```bash
npm install @google/generative-ai @xenova/transformers @pinecone-database/pinecone axios
```

#### 0.3 Configurar TypeScript

**tsconfig.json:**
- Target: ES2020
- Module: ESNext
- Strict mode: true
- Resolver: bundler
- OutDir: dist/

#### 0.4 Configurar Prisma

**Pasos:**
1. Ejecutar `npx prisma init`
2. Configurar DATABASE_URL en `.env`
3. Seleccionar provider: `mysql` para PlanetScale
4. Crear schema.prisma base (se detalla en Fase 1)

#### 0.5 Crear .env.example

Variables requeridas:
```
# Database
DATABASE_URL=mysql://user:password@host/db

# JWT
JWT_SECRET=your-secret-key-min-32-chars
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your-refresh-secret-min-32-chars
JWT_REFRESH_EXPIRES_IN=30d

# API External
TMDB_API_KEY=your-tmdb-key
GEMINI_API_KEY=your-gemini-key
PINECONE_API_KEY=your-pinecone-key
PINECONE_ENVIRONMENT=your-pinecone-env
PINECONE_INDEX=film-match

# App
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:5173
```

#### 0.6 Crear Scripts npm

```json
{
  "scripts": {
    "dev": "nodemon --exec tsx src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "seed": "tsx scripts/seed.ts",
    "index-vectors": "tsx scripts/index-vectors.ts",
    "db:push": "prisma db push",
    "db:studio": "prisma studio",
    "db:generate": "prisma generate"
  }
}
```

#### 0.7 Estructura de Carpetas Compartidas

**backend/src/shared/types/index.ts:**
- `MovieDTO`, `CategoryDTO`, `UserDTO`, `RatingDTO`
- `AuthResponse`, `PaginationResponse`
- `ChatMessageDTO`, `EmbeddingVector`

**backend/src/shared/middleware/index.ts:**
- errorHandler middleware
- authenticateJWT middleware
- corsOptions middleware
- requestLogger middleware

#### 0.8 Crear README.md Backend

Incluir:
- Setup instructions
- Environment variables
- Running locally
- Available scripts
- Project structure overview

---

## FASE 1: Base de Datos Relacional

**Duración estimada: 2-3 días**

### Objetivo
Crear el esquema relacional completo que actúe como "fuente de verdad" de la aplicación, con integridad referencial.

### Tareas

#### 1.1 Diseñar Esquema Prisma Completo

**Schema Entities:**

```prisma
// Users & Authentication
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  username  String?
  passwordHash String
  avatarUrl String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  ratings   UserRating[]
  collections UserCollection[]
  chatHistory ChatMessage[]
}

// Movies & Content
model Movie {
  id            Int      @id @default(autoincrement())
  tmdbId        Int      @unique
  title         String
  overview      String   @db.LongText
  releaseDate   DateTime?
  posterPath    String?
  backdropPath  String?
  voteAverage   Decimal  @db.Decimal(3, 1)
  runtime       Int?
  originalLanguage String?

  // Embedding status tracking
  embeddingStatus EmbeddingStatus @default(PENDING)

  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  // Relations
  categories    MovieCategory[]
  ratings       UserRating[]
  collections   UserCollection[]
  embedding     MovieEmbedding?

  @@index([tmdbId])
  @@index([createdAt])
}

model Category {
  id    Int     @id @default(autoincrement())
  name  String  @unique
  slug  String  @unique

  // Relations
  movies MovieCategory[]
}

// N:M Relationships
model MovieCategory {
  movie    Movie   @relation(fields: [movieId], references: [id], onDelete: Cascade)
  movieId  Int
  category Category @relation(fields: [categoryId], references: [id], onDelete: Cascade)
  categoryId Int

  @@id([movieId, categoryId])
  @@index([categoryId])
}

// User Interactions
model UserRating {
  id        Int     @id @default(autoincrement())
  user      User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId    Int
  movie     Movie   @relation(fields: [movieId], references: [id], onDelete: Cascade)
  movieId   Int

  rating    Decimal @db.Decimal(2, 1) // 1.0 to 5.0
  review    String? @db.Text
  watchedAt DateTime?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([userId, movieId])
  @@index([userId])
  @@index([movieId])
}

model UserCollection {
  id       Int      @id @default(autoincrement())
  user     User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId   Int
  movie    Movie    @relation(fields: [movieId], references: [id], onDelete: Cascade)
  movieId  Int

  collectionType CollectionType
  createdAt      DateTime @default(now())

  @@unique([userId, movieId, collectionType])
  @@index([userId])
  @@index([collectionType])
}

// RAG & AI Metadata (Fase 3)
model MovieEmbedding {
  id        Int     @id @default(autoincrement())
  movie     Movie   @relation(fields: [movieId], references: [id], onDelete: Cascade)
  movieId   Int     @unique

  vectorId  String  // Pinecone vector ID
  indexedAt DateTime?

  @@index([movieId])
}

model ChatMessage {
  id       Int      @id @default(autoincrement())
  user     User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId   Int

  message  String   @db.Text
  role     ChatRole

  contextMovieIds String? // JSON array of movie IDs used as context
  createdAt       DateTime @default(now())

  @@index([userId])
  @@index([createdAt])
}

// Enums
enum EmbeddingStatus {
  PENDING
  INDEXED
  FAILED
}

enum CollectionType {
  FAVORITES
  WATCHLIST
  WATCHED
  MATCHED
}

enum ChatRole {
  USER
  ASSISTANT
}
```

#### 1.2 Crear y Ejecutar Migrations

```bash
npx prisma db push  # Sincronizar schema con DB
npx prisma generate # Generar cliente Prisma
```

#### 1.3 Crear Script de Seed (Población de Datos)

**scripts/seed.ts:**

Tareas:
- Conectar a TMDB API
- Obtener películas populares/trending
- Transformar datos a formato del schema
- Insertar en BD de forma batch
- Insertar categorías/géneros
- Crear relaciones N:M

**Pseudocódigo:**
```typescript
async function seedDatabase() {
  // 1. Fetch movies from TMDB
  const tmdbMovies = await fetchPopularMovies(TMDB_API_KEY);

  // 2. Transform data
  const movies = tmdbMovies.map(transformTMDBToMovie);

  // 3. Batch insert (100 por vez para no sobrecargar)
  for (let i = 0; i < movies.length; i += 100) {
    await prisma.movie.createMany({
      data: movies.slice(i, i + 100),
      skipDuplicates: true,
    });
  }

  // 4. Insert categories
  const categories = await getUniqueCategoriesFromMovies();
  await prisma.category.createMany({
    data: categories,
    skipDuplicates: true,
  });

  // 5. Create N:M relationships
  for (const movie of movies) {
    for (const categoryId of movie.categoryIds) {
      await prisma.movieCategory.create({
        data: { movieId: movie.id, categoryId },
      });
    }
  }
}
```

#### 1.4 Validar Queries de Ejemplo

Tests básicos en `scripts/validate-queries.ts`:
- Obtener todas las películas (con paginación)
- Obtener película por ID con categorías
- Buscar películas por título (LIKE)
- Obtener estadísticas (count por categoría)
- Validar relaciones N:M

#### 1.5 Configurar PlanetScale Producción

- Crear rama `production` en PlanetScale
- Configurar backups automáticos
- Validar límites (connection pooling)
- Documentar connection string

**Optimizaciones de índices:**
- Agregar índices en `tmdbId`, `createdAt`
- Agregar índices en foreign keys
- Considerar índices compuestos para queries frecuentes

---

## FASE 2: Backend Core (API RESTful)

**Duración estimada: 6-8 días (2A + 2B)**

### Objetivo
Construir la API Express con autenticación, endpoints públicos y protegidos para gestionar películas y datos de usuario.

### FASE 2A: Autenticación (3-4 días)

#### 2A.1 Configurar Express & TypeScript Base

**src/index.ts:**
```typescript
import express from 'express';
import cors from 'cors';
import { errorHandler } from './shared/middleware/errorHandler';
import { requestLogger } from './shared/middleware/requestLogger';

const app = express();

// Middleware
app.use(express.json());
app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(requestLogger);

// Routes (por agregar)
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chat', chatRoutes);

// Error handling (última)
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

#### 2A.2 Implementar Módulo de Autenticación

**Estructura:**
```
src/modules/auth/
├── auth.controller.ts    # HTTP handlers
├── auth.service.ts       # Business logic
├── auth.routes.ts        # Route definitions
└── dto/
    ├── register.dto.ts
    └── login.dto.ts
```

**Endpoints:**

```
POST /api/auth/register
Body: { email, password, username }
Response: { success, user: { id, email, username }, token }

POST /api/auth/login
Body: { email, password }
Response: { success, user, token, refreshToken }

POST /api/auth/refresh
Body: { refreshToken }
Response: { token, refreshToken }

POST /api/auth/logout
Response: { success }
```

**Seguridad:**
- Validar email con Zod
- Hash password con bcryptjs (10 rounds)
- Generar JWT con secret >= 32 chars
- Implementar rate limiting en login (máx 5 intentos/15min)

#### 2A.3 Middleware de JWT

**shared/middleware/authenticateJWT.ts:**

```typescript
export const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Missing token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ error: 'Invalid token' });
  }
};
```

#### 2A.4 Error Handling Centralizado

**shared/middleware/errorHandler.ts:**

Manejo de:
- ValidationError (Zod)
- DatabaseError (Prisma)
- JWTError
- NotFoundError
- Unexpected errors

#### 2A.5 Testing Endpoints Auth

Validaciones con Postman/Thunder Client:
- ✓ Register con email válido
- ✓ Register con email duplicado (error)
- ✓ Login con credenciales correctas
- ✓ Login con password incorrecto (error)
- ✓ Refresh token funciona
- ✓ Token expirado genera error

---

### FASE 2B: Movies API (3-4 días)

#### 2B.1 Endpoints Públicos

**GET /api/movies**
```typescript
Query params: page=1, limit=20, genre=action, sortBy=rating

Response: {
  data: MovieDTO[],
  pagination: { page, limit, totalPages, totalItems },
  meta: { timestamp }
}
```

**GET /api/movies/:id**
```typescript
Response: {
  data: {
    id, title, overview, posterPath,
    categories: CategoryDTO[],
    stats: { ratings: 4.5, ratingCount: 123 }
  }
}
```

**GET /api/movies/search**
```typescript
Query params: q=inception

Response: {
  data: MovieDTO[],
  total: number
}
```

#### 2B.2 Endpoints Protegidos (User Collections)

**GET /api/users/me**
```typescript
Response: {
  user: { id, email, username, avatarUrl }
}
```

**GET /api/users/me/ratings**
```typescript
Response: {
  ratings: UserRatingDTO[],
  stats: { average, total, distribution }
}
```

**POST /api/users/me/ratings**
```typescript
Body: { movieId, rating, review? }

Response: {
  success: true,
  rating: UserRatingDTO
}
```

**DELETE /api/users/me/ratings/:movieId**
```typescript
Response: { success: true }
```

**GET /api/users/me/collections/:type**
```typescript
Params: type = favorites | watchlist | watched | matched

Response: {
  movies: MovieDTO[],
  count: number
}
```

**POST /api/users/me/collections**
```typescript
Body: { movieId, collectionType }

Response: { success: true }
```

**DELETE /api/users/me/collections/:movieId**
```typescript
Query: type=favorites

Response: { success: true }
```

#### 2B.3 Implementar Paginación

**shared/utils/pagination.ts:**
```typescript
export const getPaginationParams = (query) => {
  const page = Math.max(parseInt(query.page) || 1, 1);
  const limit = Math.min(parseInt(query.limit) || 20, 100);
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

export const getPaginationMeta = (total, limit, page) => ({
  page,
  limit,
  totalItems: total,
  totalPages: Math.ceil(total / limit),
});
```

#### 2B.4 Integración Frontend

En `frontend/`, actualizar API calls para usar endpoints del backend:
- Reemplazar datos mock por calls a `/api/movies`
- Usar JWT token en requests protegidos
- Manejar errores de autenticación

#### 2B.5 Testing Completo

Validar con Postman:
- ✓ Listar películas con paginación
- ✓ Obtener película por ID
- ✓ Búsqueda por título
- ✓ Agregar rating sin autenticación (error 401)
- ✓ Agregar rating con token válido
- ✓ Obtener colecciones del usuario
- ✓ Agregar a favoritos
- ✓ Remover de colección

---

## FASE 3: Integración de IA (RAG)

**Duración estimada: 7-9 días (3A + 3B)**

### Objetivo
Implementar la lógica RAG (Retrieval-Augmented Generation) para un chatbot inteligente que responde preguntas sobre películas usando contexto de la BD.

### FASE 3A: Indexing de Vectores (4-5 días)

#### 3A.1 Script de Generación de Embeddings

**scripts/index-vectors.ts:**

Tareas:
1. Conectar a base de datos relacional (Prisma)
2. Obtener todas las películas (en batches)
3. Generar embeddings usando @xenova/transformers
4. Almacenar en Pinecone
5. Actualizar `embeddingStatus` en BD

```typescript
async function indexVectors() {
  // 1. Load embedding model (descarga ~80MB primera vez)
  const extractor = await pipeline(
    'feature-extraction',
    'Xenova/all-MiniLM-L6-v2'
  );

  // 2. Get movies in batches
  const BATCH_SIZE = 50;
  let skip = 0;

  while (true) {
    const movies = await prisma.movie.findMany({
      where: { embeddingStatus: 'PENDING' },
      take: BATCH_SIZE,
      skip,
      select: { id: true, title: true, overview: true },
    });

    if (movies.length === 0) break;

    // 3. Generate embeddings
    const vectors = await Promise.all(
      movies.map(async (movie) => {
        const text = `${movie.title} ${movie.overview}`;
        const embedding = await extractor(text, { pooling: 'mean' });

        return {
          id: movie.id.toString(),
          values: Array.from(embedding.data),
          metadata: { movieId: movie.id, title: movie.title },
        };
      })
    );

    // 4. Upsert to Pinecone
    const index = pinecone.Index('film-match');
    await index.upsert(vectors, { namespace: process.env.NODE_ENV });

    // 5. Update embedding status
    await prisma.movie.updateMany({
      where: { id: { in: movies.map(m => m.id) } },
      data: { embeddingStatus: 'INDEXED' },
    });

    console.log(`✓ Indexed ${skip + movies.length} movies`);
    skip += BATCH_SIZE;
  }
}
```

#### 3A.2 Configuración de Pinecone

- Crear índice `film-match` con dimensiones 384 (modelo MiniLM)
- Crear namespaces: `development`, `production`
- Configurar métrica de similaridad: cosine
- Documentar API key en `.env`

#### 3A.3 Estrategia de Sincronización

Crear archivo `MovieEmbedding` para rastrear:
- Qué películas están indexadas
- Cuándo se indexaron
- Status (PENDING, INDEXED, FAILED)

Script para re-indexar películas nuevas:
```bash
npm run index-vectors  # Solo películas con embeddingStatus=PENDING
```

#### 3A.4 Monitoreo

Script de validación:
- Contar películas con `embeddingStatus=PENDING`
- Verificar que todos los vectores en Pinecone tengan counterpart en MySQL
- Detectar vectores huérfanos

---

### FASE 3B: Chat Endpoint RAG (3-4 días)

#### 3B.1 Implementar POST /api/chat

```typescript
POST /api/chat
Auth: Required (JWT)

Body: {
  message: string,
  conversationId?: string  // Para historial
}

Response: {
  id: string,
  message: string,
  contextMovies: MovieDTO[],
  timestamp: ISO8601
}
```

#### 3B.2 Flujo RAG Completo

```typescript
async function handleChatMessage(userMessage: string, userId: number) {
  // 1. Generate embedding for user query
  const extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
  const queryEmbedding = await extractor(userMessage, { pooling: 'mean' });

  // 2. Search similar vectors in Pinecone
  const index = pinecone.Index('film-match');
  const searchResults = await index.query({
    vector: Array.from(queryEmbedding.data),
    topK: 5,
    includeMetadata: true,
    namespace: 'production',
  });

  // 3. Get full movie details from MySQL
  const movieIds = searchResults.matches.map(m => parseInt(m.metadata.movieId));
  const contextMovies = await prisma.movie.findMany({
    where: { id: { in: movieIds } },
    include: { categories: true },
  });

  // 4. Build RAG prompt
  const systemPrompt = `Eres un experto en recomendaciones de películas.
Responde de manera conversacional y amigable.
Si el usuario pregunta sobre películas, usa el contexto proporcionado.
Si no encuentras información relevante en el contexto, responde que no tienes datos sobre esa película.`;

  const contextText = contextMovies
    .map(m => `- ${m.title} (${m.releaseDate?.getFullYear()}): ${m.overview}`)
    .join('\n');

  const userPrompt = `Contexto de películas relevantes:
${contextText}

Pregunta del usuario: ${userMessage}`;

  // 5. Call Gemini API
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  const result = await model.generateContent({
    contents: [{
      role: 'user',
      parts: [{ text: userPrompt }],
    }],
    systemInstruction: systemPrompt,
  });

  const assistantMessage = result.response.text();

  // 6. Save chat history
  await prisma.chatMessage.create({
    data: {
      userId,
      message: userMessage,
      role: 'USER',
      contextMovieIds: JSON.stringify(movieIds),
    },
  });

  await prisma.chatMessage.create({
    data: {
      userId,
      message: assistantMessage,
      role: 'ASSISTANT',
      contextMovieIds: JSON.stringify(movieIds),
    },
  });

  return {
    message: assistantMessage,
    contextMovies,
  };
}
```

#### 3B.3 Configuración Gemini API

- Obtener API key desde Google AI Studio
- Configurar en `.env`
- Documentar modelo a usar (gemini-pro vs gemini-pro-vision)

#### 3B.4 Optimizaciones

**Rate Limiting:**
```typescript
const chatRateLimiter = rateLimit({
  windowMs: 60 * 1000,  // 1 minuto
  max: 10,              // 10 requests por minuto
  message: 'Too many chat requests',
});

app.post('/api/chat', authenticateJWT, chatRateLimiter, chatController);
```

**Caching:**
- Cachear embeddings de queries frecuentes
- Cachear respuestas de Gemini para queries idénticas (max 1 hora)

**Streaming (Opcional avanzado):**
- Usar Server-Sent Events para stream de respuesta de Gemini
- Mejorar UX mostrando respuesta mientras se genera

#### 3B.5 Testing

Validar con Postman:
- ✓ Chat sin autenticación (error 401)
- ✓ Chat con pregunta sobre películas
- ✓ Validar que context movies son relevantes
- ✓ Rate limiting funciona
- ✓ Chat history se guarda
- ✓ Obtener historial de conversación

---

## FASE 4: Despliegue y Configuración

**Duración estimada: 2-3 días**

### Objetivo
Preparar la aplicación para producción en Vercel con configuración de secretos y monitoreo.

#### 4.1 Preparar Estructura para Vercel Serverless

**Migrar de Express monolito a Vercel Functions:**

```
backend/
├── api/                    # Serverless functions
│   ├── auth/
│   │   ├── login.ts       # POST /api/auth/login
│   │   ├── register.ts    # POST /api/auth/register
│   │   └── refresh.ts     # POST /api/auth/refresh
│   ├── movies/
│   │   ├── index.ts       # GET /api/movies
│   │   └── [id].ts        # GET /api/movies/:id
│   ├── users/
│   │   ├── me.ts          # GET /api/users/me
│   │   └── ratings.ts     # GET/POST /api/users/me/ratings
│   ├── chat.ts            # POST /api/chat
│   └── health.ts          # GET /api/health
├── src/lib/               # Shared code
│   ├── prisma.ts          # PrismaClient singleton
│   ├── auth.ts            # JWT utilities
│   └── embeddings.ts      # Vector logic
└── vercel.json            # Vercel config
```

#### 4.2 Archivo vercel.json

```json
{
  "functions": {
    "api/**/*.ts": {
      "memory": 1024,
      "maxDuration": 10
    },
    "api/chat.ts": {
      "memory": 3008,
      "maxDuration": 60
    }
  },
  "redirects": [
    {
      "source": "/api/:path*",
      "destination": "/api/:path*"
    }
  ]
}
```

#### 4.3 Gestión de Secretos

**Variables en Vercel Dashboard:**
```
DATABASE_URL = mysql://...
JWT_SECRET = ...
JWT_REFRESH_SECRET = ...
TMDB_API_KEY = ...
GEMINI_API_KEY = ...
PINECONE_API_KEY = ...
PINECONE_ENVIRONMENT = ...
PINECONE_INDEX = film-match
NODE_ENV = production
FRONTEND_URL = https://film-match.vercel.app
```

**Nunca commitear .env.local**

#### 4.4 Testing Deployment

1. **Preview deployment:**
   ```bash
   git push origin develop  # Auto-deploy a preview
   ```

2. **Validar endpoints:**
   - ✓ GET /api/health
   - ✓ POST /api/auth/login
   - ✓ GET /api/movies
   - ✓ POST /api/chat

3. **Validar integración con BD:**
   - ✓ Queries trabajan contra PlanetScale
   - ✓ Connection pooling funciona
   - ✓ No hay timeout de conexión

#### 4.5 Monitoreo en Producción

**Logging:**
```typescript
// Centralizar logs
const logger = {
  info: (msg) => console.log(`[INFO] ${timestamp()} ${msg}`),
  error: (msg, err) => console.error(`[ERROR] ${timestamp()} ${msg}`, err),
};
```

**Errores críticos a monitorear:**
- Database connection failures
- JWT validation errors
- Gemini API failures
- Pinecone query failures

**Opcional: Integrar con Sentry**
```typescript
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

---

## DECISIONES ARQUITECTÓNICAS

### 1. Stack de Base de Datos
- **Tecnología:** MySQL vía PlanetScale
- **ORM:** Prisma
- **Razón:** Serverless-friendly, mejor DX, type-safe

### 2. Autenticación
- **Método:** JWT stateless
- **Tokens:** Access (7 días) + Refresh (30 días)
- **Razón:** Ideal para serverless, sin state store requerido

### 3. Embeddings
- **Librería:** @xenova/transformers.js
- **Modelo:** Xenova/all-MiniLM-L6-v2 (384 dims)
- **Estrategia:** Batch processing offline
- **Razón:** TypeScript puro, sin Python dependency, balanceado

### 4. Chatbot IA
- **LLM:** Google Gemini
- **Estrategia:** RAG (no fine-tuning)
- **Context:** 5 películas más similares
- **Razón:** API económico, contexto actualizado automáticamente

### 5. Deployment
- **Plataforma:** Vercel
- **Tipo:** Serverless Functions
- **Database:** PlanetScale para MySQL serverless
- **Reason:** Zero-cost infrastructure, auto-scaling, simple

### 6. Estructura de Código
- **Patrón:** Modular por features, Clean Architecture
- **DI:** Manual (simple) vs IoC container (scalable)
- **Error Handling:** Centralizado con middleware
- **Validación:** Zod schemas

---

## STACK TECNOLÓGICO

### Runtime & Framework
- **Node.js:** 18+
- **Express:** HTTP server
- **TypeScript:** Type safety

### Base de Datos
- **Prisma:** ORM TypeScript-first
- **PlanetScale:** MySQL serverless
- **MySQL:** Base de datos relacional

### Autenticación & Seguridad
- **bcryptjs:** Hash de passwords
- **jsonwebtoken:** JWT generation/validation
- **CORS:** Cross-origin requests
- **Rate Limiting:** Middleware para prevenir abuse

### Validación de Datos
- **Zod:** Type-safe schema validation

### IA & Embeddings
- **@xenova/transformers:** Embeddings en Node.js
- **@google/generative-ai:** Gemini API client
- **@pinecone-database/pinecone:** Vector DB client

### Desarrollo
- **tsx:** TypeScript executor
- **nodemon:** Auto-reload en desarrollo
- **Prisma Studio:** GUI para base de datos

### Variables de Entorno
- **dotenv:** Cargar .env files

---

## CHECKLIST DE IMPLEMENTACIÓN

### FASE 0: Setup
- [ ] Crear estructura de monorepo
- [ ] Inicializar backend/package.json
- [ ] Configurar TypeScript
- [ ] Configurar Prisma
- [ ] Crear .env.example
- [ ] Documentar en README.md

### FASE 1: Base de Datos
- [ ] Diseñar schema Prisma completo
- [ ] Crear migrations
- [ ] Crear script seed
- [ ] Validar queries de ejemplo
- [ ] Configurar PlanetScale producción
- [ ] Optimizar índices

### FASE 2A: Auth
- [ ] Configurar Express + base
- [ ] Implementar registro
- [ ] Implementar login
- [ ] Generar JWT tokens
- [ ] Middleware de validación
- [ ] Testing endpoints

### FASE 2B: Movies API
- [ ] Endpoints públicos (list, detail, search)
- [ ] Endpoints protegidos (ratings, collections)
- [ ] Implementar paginación
- [ ] Integrar con frontend
- [ ] Testing completo

### FASE 3A: Indexing
- [ ] Script de generación de embeddings
- [ ] Configurar Pinecone
- [ ] Batch processing
- [ ] Monitoreo de sync

### FASE 3B: Chat
- [ ] Endpoint /api/chat
- [ ] RAG flow completo
- [ ] Integración con Gemini
- [ ] Chat history
- [ ] Testing

### FASE 4: Deployment
- [ ] Migrar a Vercel Functions
- [ ] Configurar vercel.json
- [ ] Gestión de secretos
- [ ] Testing en preview
- [ ] Production deployment
- [ ] Monitoreo

---

## RECURSOS ÚTILES

### APIs Externas
- [TMDB API Docs](https://developer.themoviedb.org/)
- [Google Gemini API](https://ai.google.dev/)
- [Pinecone Docs](https://docs.pinecone.io/)
- [Prisma Docs](https://www.prisma.io/docs/)

### Herramientas de Testing
- Postman / Thunder Client
- Prisma Studio (`npx prisma studio`)
- Vercel CLI (`vercel dev`)
- PlanetScale CLI (`pscale`)

### Rate Limits Típicos
- TMDB: 40 requests/segundo
- Gemini: Variables según plan
- Pinecone: Depende del plan

---

**Última actualización:** 2025-11-16
**Agente:** film-match-backend-architect
