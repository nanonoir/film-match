import { Router } from 'express';
import { googleAuth, getGoogleAuthUrl, googleCallback } from '../controllers/auth.controller';

const router = Router();

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
