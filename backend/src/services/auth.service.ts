import { prisma } from '../lib/prisma';
import { GoogleUserData } from '../types/auth.types';
import { generateToken } from '../utils/jwt';

/**
 * Autentica o registra un usuario con datos de Google
 * @param googleData - Datos del usuario de Google
 * @returns Usuario y JWT generado
 */
export async function authenticateWithGoogle(googleData: GoogleUserData) {
  try {
    // Buscar usuario existente por googleId
    let user = await prisma.user.findUnique({
      where: { email: googleData.email }
    });

    // Si encontramos usuario por email pero sin googleId, actualizar
    if (user && !user.googleId) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          googleId: googleData.googleId,
          username: googleData.name,
          profilePicture: googleData.picture
        }
      });
    }

    // Si no existe, crear nuevo usuario
    if (!user) {
      user = await prisma.user.create({
        data: {
          googleId: googleData.googleId,
          email: googleData.email,
          username: googleData.name,
          passwordHash: 'google-oauth', // No usamos contraseña con Google OAuth
          profilePicture: googleData.picture
        }
      });
    }

    // Generar JWT
    const token = generateToken({
      userId: user.id.toString(),
      email: user.email
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        profilePicture: user.profilePicture,
        googleId: user.googleId
      },
      token
    };
  } catch (error) {
    console.error('Authentication error:', error);
    throw new Error('Authentication failed');
  }
}