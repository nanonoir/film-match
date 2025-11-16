/**
 * Film-Match Backend API
 * Entry point de la aplicación
 *
 * Para desarrollar:
 *   npm run dev
 *
 * Para producción:
 *   npm run build
 *   npm start
 */

import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { corsOptions, requestLogger, errorHandler } from './shared/middleware/index.js';

// Cargar variables de entorno
dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3001;

/**
 * Middlewares globales
 */

// Body parsing
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ limit: '1mb', extended: true }));

// CORS
app.use(corsOptions);

// Logging
app.use(requestLogger);

/**
 * Rutas
 */

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Backend is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// TODO: Agregar rutas de auth (Fase 2A)
// app.use('/api/auth', authRoutes);

// TODO: Agregar rutas de películas (Fase 2B)
// app.use('/api/movies', movieRoutes);

// TODO: Agregar rutas de usuario (Fase 2B)
// app.use('/api/users', userRoutes);

// TODO: Agregar rutas de chat (Fase 3B)
// app.use('/api/chat', chatRoutes);

/**
 * Manejo de rutas no encontradas
 */
app.use('*', (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    path: req.path,
    timestamp: new Date().toISOString(),
  });
});

/**
 * Middleware de error (debe ser el último)
 */
app.use(errorHandler);

/**
 * Iniciar servidor
 */
const server = app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║     🎬 FILM-MATCH BACKEND STARTED      ║
╚════════════════════════════════════════╝

  📍 Server running on http://localhost:${PORT}
  🔧 Environment: ${process.env.NODE_ENV || 'development'}
  🗄️  Database: ${process.env.DATABASE_URL ? 'Configured' : 'Not configured'}

  Available endpoints:
    GET  /api/health         (Health check)

  Status:
    ✓ Express server initialized
    ⏳ Awaiting database configuration (Fase 1)
    ⏳ Awaiting authentication routes (Fase 2A)
    ⏳ Awaiting API routes (Fase 2B)
    ⏳ Awaiting chat routes (Fase 3B)
`);
});

/**
 * Manejo de errores no capturados
 */
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  server.close(() => {
    process.exit(1);
  });
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  server.close(() => {
    process.exit(1);
  });
});

export default app;
