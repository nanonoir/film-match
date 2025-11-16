import { Request, Response, NextFunction } from 'express';
import { verifyGoogleToken, getGoogleAuthURL, getGoogleTokens } from '../services/google-auth.service';
import { authenticateWithGoogle } from '../services/auth.service';
import { AppError } from '../middleware/error.middleware';
import { env } from '../config/env';

/**
 * GET /api/auth/google
 * Devuelve URL de autorización de Google
 */
export async function getGoogleAuthUrl(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const url = getGoogleAuthURL();

    res.json({
      success: true,
      data: { url }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/auth/google
 * Autentica usuario con token de Google
 */
export async function googleAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { token } = req.body;

    if (!token) {
      throw new AppError(400, 'Token is required');
    }

    // Verificar token de Google
    const googleData = await verifyGoogleToken(token);

    // Autenticar/registrar usuario
    const result = await authenticateWithGoogle(googleData);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      next(new AppError(401, 'Google authentication failed'));
    }
  }
}

/**
 * GET /api/auth/google/callback
 * Callback de Google OAuth (recibe código de autorización)
 */
export async function googleCallback(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { code } = req.query;

    if (!code || typeof code !== 'string') {
      throw new AppError(400, 'Authorization code missing');
    }

    // Intercambiar código por tokens
    const tokens = await getGoogleTokens(code);

    if (!tokens.id_token) {
      throw new AppError(400, 'ID token missing');
    }

    // Verificar token
    const googleData = await verifyGoogleToken(tokens.id_token);

    // Autenticar usuario
    const result = await authenticateWithGoogle(googleData);

    // Redirigir al frontend con el token
    const redirectUrl = new URL('/auth/callback', env.frontendUrl);
    redirectUrl.searchParams.set('token', result.token);

    res.redirect(redirectUrl.toString());
  } catch (error) {
    next(error);
  }
}
