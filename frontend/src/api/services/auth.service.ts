import { apiClient } from '@/api/client';
import {
  UserDTO,
  LoginResponse,
  GoogleAuthPayload,
  RefreshTokenPayload,
  RefreshTokenResponse,
} from '@/api/types/auth.types';
import { ApiResponse } from '@/api/types/common.types';

/**
 * Servicio de autenticación
 * Maneja: login, logout, refresh token, usuario actual
 */
class AuthService {
  private basePath = '/auth';

  /**
   * Obtener URL para iniciar flow de Google OAuth
   */
  async getGoogleAuthUrl(): Promise<string> {
    const response = await apiClient.get<ApiResponse<{ url: string }>>(
      `${this.basePath}/google`
    );
    return response.data.data.url;
  }

  /**
   * Login con Google OAuth token
   *
   * @param token - ID token de Google
   * @returns Usuario y tokens
   */
  async loginWithGoogle(token: string): Promise<LoginResponse> {
    const payload: GoogleAuthPayload = { token };
    const response = await apiClient.post<ApiResponse<LoginResponse>>(
      `${this.basePath}/google`,
      payload
    );
    return response.data.data;
  }

  /**
   * Obtener usuario actual autenticado
   *
   * @returns Datos del usuario
   */
  async getCurrentUser(): Promise<UserDTO> {
    const response = await apiClient.get<ApiResponse<UserDTO>>('/users/me');
    return response.data.data;
  }

  /**
   * Renovar access token usando refresh token
   *
   * @param refreshToken - Refresh token válido
   * @returns Nuevo access token
   */
  async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    const payload: RefreshTokenPayload = { refreshToken };
    const response = await apiClient.post<ApiResponse<RefreshTokenResponse>>(
      `${this.basePath}/refresh`,
      payload
    );
    return response.data.data;
  }

  /**
   * Logout (limpiar tokens en cliente)
   * El backend no tiene endpoint logout específico
   */
  async logout(): Promise<void> {
    // Limpiar tokens es responsabilidad del cliente
    // El interceptor manejará esto cuando sea necesario
    console.log('🔓 User logged out');
  }
}

export const authService = new AuthService();
