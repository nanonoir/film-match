import { Router } from 'express';
import { googleAuth, getGoogleAuthUrl, googleCallback, register, login } from '../controllers/auth.controller';

const router = Router();

/**
 * POST /api/auth/register
 * Registrar nuevo usuario con email y contraseña
 */
router.post('/register', register);

/**
 * POST /api/auth/login
 * Login con email y contraseña
 */
router.post('/login', login);

/**
 * GET /api/auth/google
 * Obtener URL de autorización de Google
 */
router.get('/google', getGoogleAuthUrl);

/**
 * POST /api/auth/google
 * Login con token de Google
 */
router.post('/google', googleAuth);

/**
 * GET /api/auth/google/callback
 * Callback de OAuth (recibe código de autorización)
 */
router.get('/google/callback', googleCallback);

export default router;
