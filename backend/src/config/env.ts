import { config } from 'dotenv';

// Cargar variables de entorno
config();

interface EnvConfig {
  // Database
  databaseUrl: string;

  // Server
  port: number;
  nodeEnv: string;

  // JWT
  jwtSecret: string;
  jwtExpiresIn: string;

  // Google OAuth
  googleClientId: string;
  googleClientSecret: string;
  googleRedirectUri: string;

  // Frontend
  frontendUrl: string;

  // TMDB API
  tmdbApiKey: string;
  tmdbBaseUrl: string;
  tmdbImageBaseUrl: string;
}

/**
 * Valida que existan las variables de entorno requeridas
 * @throws Error si falta alguna variable requerida
 */
function validateEnv(): EnvConfig {
  const requiredVars = [
    'DATABASE_URL',
    'JWT_SECRET',
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
    'GOOGLE_REDIRECT_URI',
    'FRONTEND_URL',
    'TMDB_API_KEY'
  ];

  const missing = requiredVars.filter(varName => !process.env[varName]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      'Please check your .env file'
    );
  }

  return {
    databaseUrl: process.env.DATABASE_URL!,
    port: parseInt(process.env.PORT || '3001', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
    jwtSecret: process.env.JWT_SECRET!,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
    googleClientId: process.env.GOOGLE_CLIENT_ID!,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    googleRedirectUri: process.env.GOOGLE_REDIRECT_URI!,
    frontendUrl: process.env.FRONTEND_URL!,
    tmdbApiKey: process.env.TMDB_API_KEY!,
    tmdbBaseUrl: process.env.TMDB_API_BASE_URL || 'https://api.themoviedb.org/3',
    tmdbImageBaseUrl: process.env.TMDB_IMAGE_BASE_URL || 'https://image.tmdb.org/t/p'
  };
}

export const env = validateEnv();