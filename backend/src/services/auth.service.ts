import { prisma } from '../lib/prisma';
import { GoogleUserData } from '../types/auth.types';
import { generateToken } from '../utils/jwt';
import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

/**
 * Autentica o registra un usuario con datos de Google
 * @param googleData - Datos del usuario de Google
 * @returns Usuario y JWT generado
 */
export async function authenticateWithGoogle(googleData: GoogleUserData) {
  try {
    // Extraer el prefijo del email (texto antes del @) para usar como apodo automático
    const emailPrefix = googleData.email.split('@')[0];

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
          nickname: user.nickname || emailPrefix, // Mantener apodo si existe, si no usar prefijo de email
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
          nickname: emailPrefix, // Auto-generar apodo del prefijo del email
          passwordHash: 'google-oauth', // No usamos contraseña con Google OAuth
          profilePicture: googleData.picture
        }
      });

      console.log(`✅ Google Auth - New user created with auto-generated nickname: ${emailPrefix}`);
    }

    // Generar JWT
    const accessToken = generateToken({
      userId: user.id.toString(),
      email: user.email
    });

    console.log('✅ Google Auth - accessToken generated:', {
      length: accessToken.length,
      startsCorrect: accessToken.startsWith('eyJ'),
      parts: accessToken.split('.').length
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        name: user.name || user.username, // Asegurar que name siempre existe
        nickname: user.nickname,
        profilePicture: user.profilePicture,
        bio: user.bio,
        twitterUrl: user.twitterUrl,
        instagramUrl: user.instagramUrl,
        googleId: user.googleId,
        createdAt: user.createdAt
      },
      accessToken
    };
  } catch (error) {
    console.error('Authentication error:', error);
    throw new Error('Authentication failed');
  }
}

/**
 * Registra un nuevo usuario con email y contraseña
 * @param email - Email del usuario
 * @param password - Contraseña en texto plano
 * @param username - Nombre de usuario (opcional)
 * @returns Usuario y JWT generado
 */
export async function registerWithEmail(email: string, password: string, username?: string) {
  try {
    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      throw new Error('El email ya está registrado');
    }

    // Hashear contraseña
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    // Crear usuario
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        username: username || email.split('@')[0], // Use part of email as default username
        authProvider: 'local'
      }
    });

    // Generar JWT
    const accessToken = generateToken({
      userId: user.id.toString(),
      email: user.email
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        profilePicture: user.profilePicture
      },
      accessToken
    };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    console.error('Registration error:', error);
    throw new Error('Registration failed');
  }
}

/**
 * Inicia sesión con email y contraseña
 * @param email - Email del usuario
 * @param password - Contraseña en texto plano
 * @returns Usuario y JWT generado
 */
export async function loginWithEmail(email: string, password: string) {
  try {
    // Buscar usuario
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      throw new Error('Email o contraseña incorrectos');
    }

    // Verificar que tenga passwordHash (para usuarios local)
    if (!user.passwordHash) {
      throw new Error('Esta cuenta está registrada con Google. Por favor inicia sesión con Google');
    }

    // Comparar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      throw new Error('Email o contraseña incorrectos');
    }

    // Generar JWT
    const accessToken = generateToken({
      userId: user.id.toString(),
      email: user.email
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        profilePicture: user.profilePicture
      },
      accessToken
    };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    console.error('Login error:', error);
    throw new Error('Login failed');
  }
}