import app from './app';
import { env } from './config/env';
import { prisma } from './lib/prisma';

const PORT = env.port;

async function startServer() {
  try {
    // Verificar conexión a BD
    await prisma.$connect();
    console.log('✅ Database connected');

    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📊 Environment: ${env.nodeEnv}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Manejo de shutdown graceful
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down server...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Shutting down server...');
  await prisma.$disconnect();
  process.exit(0);
});

startServer();
