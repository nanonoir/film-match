import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { env } from './config/env';
import authRoutes from './routes/auth.routes';
import movieRoutes from './routes/movie.routes';
import ratingRoutes from './routes/rating.routes';
import collectionRoutes from './routes/collection.routes';
import userRoutes from './routes/user.routes';
import categoryRoutes from './routes/category.routes';
import tmdbRoutes from './routes/tmdb.routes';
import { errorHandler, notFound } from './middleware/error.middleware';

const app = express();

// ============================================
// Security Middleware
// ============================================

// Helmet: Security headers
app.use(helmet());

// CORS: Allow cross-origin requests from frontend
app.use(cors({
  origin: env.frontendUrl,
  credentials: true
}));

// Rate limiting: Prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max 100 requests per window
  message: 'Too many requests, please try again later'
});
app.use('/api/', limiter);

// ============================================
// Body Parser
// ============================================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================
// Health Check
// ============================================
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Backend is running',
    timestamp: new Date().toISOString(),
    environment: env.nodeEnv
  });
});

// ============================================
// API Routes
// ============================================
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/collections', collectionRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/tmdb', tmdbRoutes);

// ============================================
// Error Handling (MUST be last)
// ============================================
app.use(notFound);
app.use(errorHandler);

export default app;
