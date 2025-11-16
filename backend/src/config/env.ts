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
    'FRONTEND_URL'
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
    frontendUrl: process.env.FRONTEND_URL!
  };
}

export const env = validateEnv();