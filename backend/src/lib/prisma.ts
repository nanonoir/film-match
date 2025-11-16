import { PrismaClient } from '@prisma/client';

/**
 * Singleton instance of PrismaClient
 *
 * This pattern prevents multiple instances of PrismaClient from being created,
 * which is especially important in development with hot-reload and in serverless
 * environments like Vercel where each function invocation is isolated.
 *
 * See: https://www.prisma.io/docs/orm/more/help-and-troubleshooting/help-articles/nextjs-prisma-client-dev-practices
 */

declare global {
  // Allow adding prisma to global namespace
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// In development, use the global instance if available
// In production, create a new instance (which will be reused within the same container)
export const prisma =
  global.prisma ||
  new PrismaClient({
    log: ['error', 'warn'],
  });

// Attach to global in development to avoid multiple instances
if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}