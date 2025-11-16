import { Request } from 'express';

/**
 * Payload del JWT que generamos
 */
export interface JWTPayload {
  userId: string;
  email: string;
  iat?: number;  // issued at (timestamp)
  exp?: number;  // expiration (timestamp)
}

/**
 * Datos del usuario obtenidos de Google
 */
export interface GoogleUserData {
  googleId: string;
  email: string;
  name: string;
  picture?: string;
}

/**
 * Request extendido con usuario autenticado
 */
export interface AuthRequest extends Request {
  user?: JWTPayload;
}