import { Request, Response, NextFunction } from 'express';
import { verifyToken, extractTokenFromHeader } from '../utils/jwt';
import { AuthRequest } from '../types/auth.types';

/**
 * Middleware para verificar JWT en requests
 * Adjunta el usuario decodificado a req.user
 */
export function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  try {
    // Extraer token del header
    const token = extractTokenFromHeader(req.headers.authorization);

    if (!token) {
      res.status(401).json({
        success: false,
        error: 'No token provided'
      });
      return;
    }

    // Verificar token
    const decoded = verifyToken(token);

    // Adjuntar usuario al request
    (req as AuthRequest).user = decoded;

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      error: error instanceof Error ? error.message : 'Authentication failed'
    });
  }
}

/**
 * Middleware opcional: no falla si no hay token
 * Útil para rutas que funcionan diferente con/sin auth
 */
export async function optionalAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);

    if (token) {
      const decoded = verifyToken(token);
      (req as AuthRequest).user = decoded;
    }

    next();
  } catch (error) {
    // Ignorar errores, continuar sin usuario
    next();
  }
}
